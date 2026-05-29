import { useCallback, useState } from 'react';
import DataGrid, {
  Column, RowDragging, Sorting, Selection, Lookup, Scrolling, type DataGridTypes,
} from 'devextreme-react/data-grid';
import type { DragTemplateData } from 'devextreme/ui/draggable';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import notify from 'devextreme/ui/notify';
import type CustomStore from 'devextreme/data/custom_store';
import type { Task } from './data';
import type { GridDemoComponentProps } from './App';
import { getVisibleRowValues } from './utils';

const keyExpr: keyof Task = 'ID';
const url = 'https://js.devexpress.com/Demos/NetCore/api/DataGridRowReordering';

const tasksStore: CustomStore = createStore({
  key: 'ID',
  loadUrl: `${url}/Tasks`,
  updateUrl: `${url}/UpdateTask`,
  onBeforeSend(_method, ajaxOptions) {
    ajaxOptions.xhrFields = { withCredentials: true };
  },
});
const employeesStore: CustomStore = createStore({
  key: 'ID',
  loadUrl: `${url}/Employees`,
  onBeforeSend(_method, ajaxOptions) {
    ajaxOptions.xhrFields = { withCredentials: true };
  },
});

function draggedItemsRender(data: DragTemplateData): JSX.Element {
  const draggedItems = data.itemData.map((item: Task) => {
    const cellValues = (Object.keys(item) as (keyof Task)[]).map((key: keyof Task) => <td key={item.ID.toString() + String(item[key])}>{item[key]}</td>);
    return (<tr key={`row${item.ID}`} className="dragged-item">{cellValues}</tr>);
  });
  return (<table className="drag-container">
    <tbody>{draggedItems}</tbody>
  </table>);
}
function canDrop(e: DataGridTypes.RowDraggingChangeEvent): boolean {
  const visibleRows = e.component.getVisibleRows();
  return !visibleRows.some((r) => r.isSelected && r.rowIndex === e.toIndex);
}
function dragChange(e: DataGridTypes.RowDraggingChangeEvent): void {
  e.cancel = !canDrop(e);
}

function DataGridRemoteData(props: GridDemoComponentProps): JSX.Element {
  const [updateInProgress, setUpdateInProgress] = useState(false);

  const canDrag = useCallback((e: DataGridTypes.RowDraggingStartEvent): boolean => {
    if (updateInProgress) return false;
    const visibleRows = e.component.getVisibleRows();
    return visibleRows.some((r) => r.isSelected && r.rowIndex === e.fromIndex);
  }, [updateInProgress]);

  const dragStart = useCallback((e: DataGridTypes.RowDraggingStartEvent): void => {
    const selectedData: Task[] = e.component.getSelectedRowsData();
    e.itemData = getVisibleRowValues(selectedData, e.component);
    e.cancel = !canDrag(e);
  }, [canDrag]);

  // eslint-disable-next-line space-before-function-paren
  const updateOrderIndex = useCallback(async (e: DataGridTypes.RowDraggingReorderEvent): Promise<void> => {
    const visibleRows = e.component.getVisibleRows();
    const newOrderIndex = visibleRows[e.toIndex].data.OrderIndex;
    const store = e.component.getDataSource().store();
    try {
      setUpdateInProgress(true);
      e.component.beginCustomLoading('Loading...');
      const promises = [];
      for (const itemData of e.itemData) {
        promises.push(store.update(itemData[keyExpr], { OrderIndex: newOrderIndex }));
      }
      await Promise.all(promises);
      await e.component.refresh();
    } catch (error: unknown) {
      notify(error, 'error', 1000);
    } finally {
      e.component.endCustomLoading();
      setUpdateInProgress(false);
    }
  }, []);

  const reorder = useCallback((e: DataGridTypes.RowDraggingReorderEvent): void => {
    e.promise = updateOrderIndex(e);
    if (props.shouldClearSelection) { e.component.clearSelection(); }
  }, [props.shouldClearSelection, updateOrderIndex]);

  return (
    <DataGrid
      dataSource={tasksStore}
      remoteOperations={true}
      height={480}
    >
      <RowDragging
        allowReordering={true}
        dragRender={draggedItemsRender}
        onReorder={reorder as () => void}
        onDragChange={dragChange as () => void}
        onDragStart={dragStart as () => void}
      />
      <Selection mode="multiple" />
      <Sorting mode="none" />
      <Scrolling mode="virtual" />
      <Column dataField="ID" dataType='number' width={55} />
      <Column dataField="Owner" width={150}>
        <Lookup dataSource={employeesStore} valueExpr="ID" displayExpr="FullName" />
      </Column>
      <Column dataField="AssignedEmployee" width={150} caption="Assignee">
        <Lookup dataSource={employeesStore} valueExpr="ID" displayExpr="FullName" />
      </Column>
      <Column dataField="Subject" dataType='string' />
    </DataGrid>
  );
}

export default DataGridRemoteData;

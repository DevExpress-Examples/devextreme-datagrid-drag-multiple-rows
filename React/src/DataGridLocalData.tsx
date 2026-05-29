import { useCallback } from 'react';
import DataGrid, {
  Column, RowDragging, Sorting, Selection, type DataGridTypes,
} from 'devextreme-react/data-grid';
import type { DragTemplateData } from 'devextreme/ui/draggable';
import notify from 'devextreme/ui/notify';
import type { Customer } from './data';
import { customers } from './data';
import type { GridDemoComponentProps } from './App';
import { getVisibleRowValues } from './utils';

const keyExpr: keyof Customer = 'ID';

function draggedItemsRender(data: DragTemplateData): JSX.Element {
  const draggedItems = data.itemData.map((item: Customer) => {
    const cellValues = (Object.keys(item) as (keyof Customer)[]).map((key: keyof Customer) => <td key={item.ID.toString() + String(item[key])}>{item[key]}</td>);
    return (<tr key={`row${item.ID}`} className="dragged-item">{cellValues}</tr>);
  });
  return (<table className="drag-container">
    <tbody>{draggedItems}</tbody>
  </table>);
}

function canDrag(e: DataGridTypes.RowDraggingStartEvent): boolean {
  const visibleRows = e.component.getVisibleRows();
  return visibleRows.some((r) => r.isSelected && r.rowIndex === e.fromIndex);
}
function canDrop(e: DataGridTypes.RowDraggingChangeEvent): boolean {
  const visibleRows = e.component.getVisibleRows();
  return !visibleRows.some((r) => r.isSelected && r.rowIndex === e.toIndex);
}
function dragStart(e: DataGridTypes.RowDraggingStartEvent): void {
  const selectedData: Customer[] = e.component.getSelectedRowsData();
  e.itemData = getVisibleRowValues(selectedData, e.component);
  e.cancel = !canDrag(e);
}
function dragChange(e: DataGridTypes.RowDraggingChangeEvent): void {
  e.cancel = !canDrop(e);
}
function calculateToIndex(dataArray: Customer[], e: DataGridTypes.RowDraggingChangeEvent): number {
  const visibleRows = e.component.getVisibleRows();
  const toIndex = dataArray.findIndex((item) => item[keyExpr] === visibleRows[e.toIndex].data[keyExpr]);
  return e.fromIndex >= e.toIndex ? toIndex : toIndex + 1;
}

function DataGridLocalData(props: GridDemoComponentProps): JSX.Element {
  const reorder = useCallback((e: DataGridTypes.RowDraggingReorderEvent): void => {
    const fullDataToInsert: Customer[] = [];
    e.itemData?.forEach((rowData: Customer) => {
      const indexToRemove = customers.findIndex((item: Customer) => item[keyExpr] === rowData[keyExpr]);
      fullDataToInsert.push(customers[indexToRemove]);
      customers.splice(indexToRemove, 1);
    });
    const toIndex = calculateToIndex(customers, e);
    customers.splice(toIndex, 0, ...fullDataToInsert);
    e.component.refresh().catch((error: unknown) => notify(error, 'error', 1000));
    if (props.shouldClearSelection) { e.component.clearSelection(); }
  }, [props.shouldClearSelection]);

  return (
    <DataGrid
      dataSource={customers}
      keyExpr="ID"
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
      <Column dataField="ID" width={55} />
      <Column dataField="CompanyName" />
      <Column dataField="Address" />
      <Column dataField="City" />
      <Column dataField="State" />
    </DataGrid>
  );
}

export default DataGridLocalData;

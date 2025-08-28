import { useCallback, useState } from 'react';
import DataGrid, { Column, RowDragging, Sorting, Selection, Lookup, Scrolling } from 'devextreme-react/data-grid';
import { GridDemoComponentProps } from './App';
import { Task } from './data';
import { DragTemplateData } from 'devextreme/ui/draggable';
import dxDataGrid, { RowDraggingStartEvent, RowDraggingChangeEvent, RowDraggingReorderEvent, Column as DxColumn } from 'devextreme/ui/data_grid';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import CustomStore from 'devextreme/data/custom_store';

const keyExpr: keyof Task = "ID";
const url = 'https://js.devexpress.com/Demos/Mvc/api/RowReordering';

const tasksStore: CustomStore = createStore({
    key: 'ID',
    loadUrl: `${url}/Tasks`,
    updateUrl: `${url}/UpdateTask`,
    onBeforeSend(method, ajaxOptions) {
        ajaxOptions.xhrFields = { withCredentials: true };
    },
});
const employeesStore: CustomStore = createStore({
    key: 'ID',
    loadUrl: `${url}/Employees`,
    onBeforeSend(method, ajaxOptions) {
        ajaxOptions.xhrFields = { withCredentials: true };
    },
});

function draggedItemsRender(data: DragTemplateData) {
    const draggedItems = data.itemData.map((item: Task) => {
        const cellValues = (Object.keys(item) as (keyof Task)[]).map((key: keyof Task) =>
            <td key={item.ID.toString() + item[key]}>{item[key]}</td>
        );
        return (<tr key={"row" + item.ID} className="dragged-item">{cellValues}</tr>)
    });
    return (<table className="drag-container">
        <tbody>{draggedItems}</tbody>
    </table>);
}
function dragChange(e: RowDraggingChangeEvent) {
    e.cancel = !canDrop(e);
}
function canDrop(e: RowDraggingChangeEvent) {
    const visibleRows = e.component.getVisibleRows();
    return !visibleRows.some(r => r.isSelected && r.rowIndex === e.toIndex);
}
function getVisibleRowValues(rowsData: Task[], grid: dxDataGrid) {
    const visbileColumns = grid.getVisibleColumns();
    const selectedData = rowsData.map((rowData: Task) => {
        const visibleValues: any = {};
        visbileColumns.forEach((column: DxColumn) => {
            if (column.dataField)
                visibleValues[column.dataField] = getVisibleCellValue(column, rowData);
        });
        return visibleValues;
    });
    return selectedData;
}
function getVisibleCellValue(column: DxColumn, rowData: Task) {
    if (column.dataField) {
        const propKey = column.dataField as (keyof Task);
        const cellValue = rowData[propKey];
        return column.lookup && column.lookup.calculateCellValue ? column.lookup.calculateCellValue(cellValue) : cellValue;
    }
}

function DataGridRemoteData(props: GridDemoComponentProps) {
    const [updateInProgress, setUpdateInProgress] = useState(false);

    const canDrag = useCallback((e: RowDraggingStartEvent) => {
        if (updateInProgress) return false;
        const visibleRows = e.component.getVisibleRows();
        return visibleRows.some(r => r.isSelected && r.rowIndex === e.fromIndex);
    }, [updateInProgress]);

    const dragStart = useCallback((e: RowDraggingStartEvent) => {
        const selectedData: Task[] = e.component.getSelectedRowsData();
        e.itemData = getVisibleRowValues(selectedData, e.component);
        e.cancel = !canDrag(e);
    }, [canDrag]);

    const updateOrderIndex = useCallback(async (e: RowDraggingReorderEvent) => {
        const visibleRows = e.component.getVisibleRows();
        const newOrderIndex = visibleRows[e.toIndex].data.OrderIndex;
        const store = e.component.getDataSource().store();
        setUpdateInProgress(true);
        e.component.beginCustomLoading("Loading...");
        for (let i = 0; i < e.itemData.length; i++) {
            await store.update(e.itemData[i][keyExpr], { OrderIndex: newOrderIndex });
        }
        e.component.refresh().then(() => {
            e.component.endCustomLoading();
            setUpdateInProgress(false);
        });
    }, []);

    const reorder = useCallback((e: RowDraggingReorderEvent) => {
        e.promise = updateOrderIndex(e);
        if (props.shouldClearSelection)
            e.component.clearSelection();
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
                onReorder={reorder}
                onDragChange={dragChange}
                onDragStart={dragStart}
            />
            <Selection mode="multiple" />
            <Sorting mode="none" />
            <Scrolling mode="virtual" />
            <Column dataField="ID" width={55} />
            <Column dataField="Owner" width={150}>
                <Lookup dataSource={employeesStore} valueExpr="ID" displayExpr="FullName" />
            </Column>
            <Column dataField="AssignedEmployee" width={150} caption="Assignee">
                <Lookup dataSource={employeesStore} valueExpr="ID" displayExpr="FullName" />
            </Column>
            <Column dataField="Subject" />
        </DataGrid>
    )
}

export default DataGridRemoteData;
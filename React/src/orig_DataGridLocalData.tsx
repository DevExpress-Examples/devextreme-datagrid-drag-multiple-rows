import { useCallback } from 'react';
import DataGrid, { Column, RowDragging, Sorting, Selection } from 'devextreme-react/data-grid';
import { GridDemoComponentProps } from './App';
import { Customer, customers } from './data';
import { DragTemplateData } from 'devextreme/ui/draggable';
import dxDataGrid, { RowDraggingStartEvent, RowDraggingChangeEvent, RowDraggingReorderEvent, Column as DxColumn } from 'devextreme/ui/data_grid';

const keyExpr: keyof Customer = "ID";

function draggedItemsRender(data: DragTemplateData) {
    const draggedItems = data.itemData.map((item: Customer) => {
        const cellValues = (Object.keys(item) as (keyof Customer)[]).map((key: keyof Customer) => 
            <td key={item.ID.toString() + item[key]}>{item[key]}</td>
        );
        return (<tr key={"row" + item.ID} className="dragged-item">{cellValues}</tr>)
    });
    return (<table className="drag-container">
        <tbody>{draggedItems}</tbody>
    </table>);
}

function dragStart(e: RowDraggingStartEvent) {
    const selectedData: Customer[] = e.component.getSelectedRowsData();
    e.itemData = getVisibleRowValues(selectedData, e.component);
    e.cancel = !canDrag(e);
}
function dragChange(e: RowDraggingChangeEvent) {
    e.cancel = !canDrop(e);
}
function canDrag(e: RowDraggingStartEvent) {
      const visibleRows = e.component.getVisibleRows();
      return visibleRows.some(r => r.isSelected && r.rowIndex === e.fromIndex);
}
function canDrop(e: RowDraggingChangeEvent) {
      const visibleRows = e.component.getVisibleRows();
      return !visibleRows.some(r => r.isSelected && r.rowIndex === e.toIndex);
}
function calculateToIndex(dataArray: Customer[], e: RowDraggingReorderEvent) {
      const visibleRows = e.component.getVisibleRows();
      const toIndex = dataArray.findIndex((item) => item[keyExpr] === visibleRows[e.toIndex].data[keyExpr]);
      return e.fromIndex >= e.toIndex ? toIndex : toIndex + 1;
}
function getVisibleRowValues(rowsData: Customer[], grid: dxDataGrid) {
      const visbileColumns: DxColumn[] = grid.getVisibleColumns();
      const selectedData = rowsData.map(rowData => {
          const visibleValues: any = {};
          visbileColumns.forEach((column: DxColumn) => {
              if (column.dataField)
                visibleValues[column.dataField] = getVisibleCellValue(column, rowData);
          });
          return visibleValues;
      });
      return selectedData;
}
function getVisibleCellValue(column: DxColumn, rowData: Customer) {
    if (column.dataField) {
        const propKey = column.dataField as (keyof Customer);
        const cellValue = rowData[propKey];
        return column.lookup && column.lookup.calculateCellValue ? column.lookup.calculateCellValue(cellValue) : cellValue;
    }
}

function DataGridLocalData(props: GridDemoComponentProps) {
    const reorder = useCallback((e: RowDraggingReorderEvent) => {
        const fullDataToInsert: Customer[] = [];
        e.itemData.forEach((rowData: any) => {
            const indexToRemove = customers.findIndex((item: Customer) => item[keyExpr] === rowData[keyExpr]);
            fullDataToInsert.push(customers[indexToRemove]);
            customers.splice(indexToRemove, 1);
        });
        const toIndex = calculateToIndex(customers, e);
        customers.splice(toIndex, 0, ...fullDataToInsert);
        e.component.refresh();
        if (props.shouldClearSelection)
            e.component.clearSelection();
    }, [props.shouldClearSelection]);

    return (
        <DataGrid
          dataSource={customers}
          keyExpr="ID"
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
          <Column dataField="ID" width={55} />
          <Column dataField="CompanyName"/>
          <Column dataField="Address"/>
          <Column dataField="City"/>
          <Column dataField="State"/>
        </DataGrid>
    )
}

export default DataGridLocalData;
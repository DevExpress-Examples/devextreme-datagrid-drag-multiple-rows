import { Component, Input } from '@angular/core';
import { KeyValue } from '@angular/common';
import { Customer, GridDataService } from 'src/app/services/grid-data.service';
import dxDataGrid, { RowDraggingStartEvent, RowDraggingChangeEvent, RowDraggingReorderEvent, Column } from 'devextreme/ui/data_grid';

@Component({
  selector: 'grid-local-data',
  templateUrl: './data-grid-local-data.component.html',
})
export class DataGridLocalDataComponent {
  @Input() shouldClearSelection: boolean = false;
  customers: Customer[];
  keyExpr: keyof Customer = "ID";

  constructor(dataService: GridDataService) {
    this.customers = dataService.getCustomers();
    this.dragStart = this.dragStart.bind(this);
    this.dragChange = this.dragChange.bind(this);
    this.reorder = this.reorder.bind(this);
  }
  dragStart(e: RowDraggingStartEvent) {
    const selectedData: Customer[] = e.component.getSelectedRowsData();
    e.itemData = this.getVisibleRowValues(selectedData, e.component);
    e.cancel = !this.canDrag(e);
  }
  dragChange(e: RowDraggingChangeEvent) {
    e.cancel = !this.canDrop(e);
  }
  reorder(e: RowDraggingReorderEvent) {
    const fullDataToInsert: Customer[] = [];
    e.itemData.forEach((rowData: any) => {
        const indexToRemove = this.customers.findIndex((item: Customer) => item[this.keyExpr] === rowData[this.keyExpr]);
        fullDataToInsert.push(this.customers[indexToRemove]);
        this.customers.splice(indexToRemove, 1);
    });
    const toIndex = this.calculateToIndex(this.customers, e);
    this.customers.splice(toIndex, 0, ...fullDataToInsert);
    e.component.refresh();
    if (this.shouldClearSelection)
        e.component.clearSelection();
  }

  canDrag(e: RowDraggingStartEvent) {
      const visibleRows = e.component.getVisibleRows();
      return visibleRows.some(r => r.isSelected && r.rowIndex === e.fromIndex);
  }
  canDrop(e: RowDraggingChangeEvent) {
      const visibleRows = e.component.getVisibleRows();
      return !visibleRows.some(r => r.isSelected && r.rowIndex === e.toIndex);
  }
  calculateToIndex(dataArray: Customer[], e: RowDraggingReorderEvent) {
      const visibleRows = e.component.getVisibleRows();
      const toIndex = dataArray.findIndex((item) => item[this.keyExpr] === visibleRows[e.toIndex].data[this.keyExpr]);
      return e.fromIndex >= e.toIndex ? toIndex : toIndex + 1;
  }
  getVisibleRowValues(rowsData: Customer[], grid: dxDataGrid) {
      const visbileColumns: Column[] = grid.getVisibleColumns();
      const selectedData = rowsData.map(rowData => {
          const visibleValues: any = {};
          visbileColumns.forEach((column: Column) => {
              if (column.dataField)
                visibleValues[column.dataField] = this.getVisibleCellValue(column, rowData);
          });
          return visibleValues;
      });
      return selectedData;
  }
  getVisibleCellValue(column: Column, rowData: Customer) {
    if (column.dataField) {
        const propKey = column.dataField as (keyof Customer);
        const cellValue = rowData[propKey];
        return column.lookup && column.lookup.calculateCellValue ? column.lookup.calculateCellValue(cellValue) : cellValue;
    }
  }
  originalOrder(a: KeyValue<number, string>, b: KeyValue<number, string>): number {
    return 0
  }
}

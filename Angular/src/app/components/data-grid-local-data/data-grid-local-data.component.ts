import { Component, Input } from '@angular/core';
import { KeyValue } from '@angular/common';
import { Customer, GridDataService } from 'src/app/services/grid-data.service';
import type {
  DxDataGridTypes,
} from 'devextreme-angular/ui/data-grid';
import { getVisibleRowValues } from 'src/app/utils';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'grid-local-data',
  standalone: false,
  templateUrl: './data-grid-local-data.component.html',
})
export class DataGridLocalDataComponent {
  @Input() shouldClearSelection = false;

  customers: Customer[];

  keyExpr: keyof Customer = 'ID';

  constructor(dataService: GridDataService) {
    this.customers = dataService.getCustomers();
    this.dragStart = this.dragStart.bind(this);
    this.dragChange = this.dragChange.bind(this);
    this.reorder = this.reorder.bind(this);
  }

  dragStart(e: DxDataGridTypes.RowDraggingStartEvent): void {
    const selectedData: Customer[] = e.component.getSelectedRowsData();
    e.itemData = getVisibleRowValues(selectedData, e.component);
    e.cancel = !this.canDrag(e);
  }

  dragChange(e: DxDataGridTypes.RowDraggingChangeEvent): void {
    e.cancel = !this.canDrop(e);
  }

  reorder(e: DxDataGridTypes.RowDraggingReorderEvent): void {
    const fullDataToInsert: Customer[] = [];
    e.itemData?.forEach((rowData: Customer) => {
      const indexToRemove = this.customers.findIndex((item: Customer) => item[this.keyExpr] === rowData[this.keyExpr]);
      fullDataToInsert.push(this.customers[indexToRemove]);
      this.customers.splice(indexToRemove, 1);
    });
    const toIndex = this.calculateToIndex(this.customers, e);
    this.customers.splice(toIndex, 0, ...fullDataToInsert);
    if (this.shouldClearSelection) {
      e.component.clearSelection();
    }
  }

  canDrag(e: DxDataGridTypes.RowDraggingStartEvent): boolean {
    const visibleRows = e.component.getVisibleRows();
    return visibleRows.some((r) => r.isSelected && r.rowIndex === e.fromIndex);
  }

  canDrop(e: DxDataGridTypes.RowDraggingChangeEvent): boolean {
    const visibleRows = e.component.getVisibleRows();
    return !visibleRows.some((r) => r.isSelected && r.rowIndex === e.toIndex);
  }

  calculateToIndex(dataArray: Customer[], e: DxDataGridTypes.RowDraggingReorderEvent): number {
    const visibleRows = e.component.getVisibleRows();
    const toIndex = dataArray.findIndex((item) => item[this.keyExpr] === visibleRows[e.toIndex].data[this.keyExpr]);
    return e.fromIndex >= e.toIndex ? toIndex : toIndex + 1;
  }

  originalOrder(a: KeyValue<number, string>, b: KeyValue<number, string>): number {
    return 0;
  }
}

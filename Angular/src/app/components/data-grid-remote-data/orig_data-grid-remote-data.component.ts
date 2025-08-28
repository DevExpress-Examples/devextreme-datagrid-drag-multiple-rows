import { Component, Input } from '@angular/core';
import { KeyValue } from '@angular/common';
import dxDataGrid, { RowDraggingStartEvent, RowDraggingChangeEvent, RowDraggingReorderEvent, Column } from 'devextreme/ui/data_grid';
import CustomStore from 'devextreme/data/custom_store';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { Task } from 'src/app/services/grid-data.service';

@Component({
  selector: 'grid-remote-data',
  templateUrl: './data-grid-remote-data.component.html',
})
export class DataGridRemoteDataComponent {
  @Input() shouldClearSelection: boolean = false;
  updateInProgress: boolean = false;
  keyExpr: keyof Task = "ID";
  tasksStore: CustomStore;
  employeesStore: CustomStore;

  constructor() {
    const url = 'https://js.devexpress.com/Demos/Mvc/api/RowReordering';
    this.tasksStore = createStore({
      key: 'ID',
      loadUrl: `${url}/Tasks`,
      updateUrl: `${url}/UpdateTask`,
      onBeforeSend(method, ajaxOptions) {
        ajaxOptions.xhrFields = { withCredentials: true };
      },
    });

    this.employeesStore = createStore({
      key: 'ID',
      loadUrl: `${url}/Employees`,
      onBeforeSend(method, ajaxOptions) {
        ajaxOptions.xhrFields = { withCredentials: true };
      },
    });

    this.dragStart = this.dragStart.bind(this);
    this.dragChange = this.dragChange.bind(this);
    this.reorder = this.reorder.bind(this);
  }

  dragStart(e: RowDraggingStartEvent) {
    const selectedData: Task[] = e.component.getSelectedRowsData();
    e.itemData = this.getVisibleRowValues(selectedData, e.component);
    e.cancel = !this.canDrag(e);
  }
  dragChange(e: RowDraggingChangeEvent) {
    e.cancel = !this.canDrop(e);
  }
  reorder(e: RowDraggingReorderEvent) {
    e.promise = this.updateOrderIndex(e);
    if (this.shouldClearSelection)
      e.component.clearSelection();
  }

  async updateOrderIndex(e: RowDraggingReorderEvent) {
    const visibleRows = e.component.getVisibleRows();
    const newOrderIndex = visibleRows[e.toIndex].data.OrderIndex;
    const store = e.component.getDataSource().store();
    this.updateInProgress = true;
    e.component.beginCustomLoading("Loading...");
    for (let i = 0; i < e.itemData.length; i++) {
        await store.update(e.itemData[i][this.keyExpr], { OrderIndex: newOrderIndex });
    }
    e.component.refresh().then(() => {
        e.component.endCustomLoading();
        this.updateInProgress = false;
    });
  }
  canDrag(e: RowDraggingStartEvent) {
      if (this.updateInProgress) return false;
      const visibleRows = e.component.getVisibleRows();
      return visibleRows.some(r => r.isSelected && r.rowIndex === e.fromIndex);
  }
  canDrop(e: RowDraggingChangeEvent) {
      const visibleRows = e.component.getVisibleRows();
      return !visibleRows.some(r => r.isSelected && r.rowIndex === e.toIndex);
  }
  getVisibleRowValues(rowsData: Task[], grid: dxDataGrid) {
      const visbileColumns = grid.getVisibleColumns();
      const selectedData = rowsData.map((rowData: Task) => {
          const visibleValues: any = {};
          visbileColumns.forEach((column: Column) => {
            if (column.dataField)
              visibleValues[column.dataField] = this.getVisibleCellValue(column, rowData);
          });
          return visibleValues;
      });
      return selectedData;
  }
  getVisibleCellValue(column: Column, rowData: Task) {
    if (column.dataField) {
      const propKey = column.dataField as (keyof Task);
      const cellValue = rowData[propKey];
      return column.lookup && column.lookup.calculateCellValue ? column.lookup.calculateCellValue(cellValue) : cellValue;
    }
  }
  originalOrder(a: KeyValue<number, string>, b: KeyValue<number, string>): number {
    return 0
  }
}

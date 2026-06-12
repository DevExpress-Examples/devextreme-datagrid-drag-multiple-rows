import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { KeyValue, NgFor, KeyValuePipe } from '@angular/common';
import type {
  DxDataGridTypes,
} from 'devextreme-angular/ui/data-grid';
import type CustomStore from 'devextreme/data/custom_store';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { Task } from 'src/app/services/grid-data.service';
import { DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { getVisibleRowValues } from 'src/app/utils';

@Component({
  selector: 'grid-remote-data',
  imports: [DxDataGridModule, DxTemplateModule, NgFor, KeyValuePipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './data-grid-remote-data.component.html',
})
export class DataGridRemoteDataComponent {
  @Input() shouldClearSelection = false;

  updateInProgress = false;

  keyExpr: keyof Task = 'ID';

  tasksStore: CustomStore;

  employeesStore: CustomStore;

  constructor() {
    const url = 'https://js.devexpress.com/Demos/NetCore/api/DataGridRowReordering';
    this.tasksStore = createStore({
      key: 'ID',
      loadUrl: `${url}/Tasks`,
      updateUrl: `${url}/UpdateTask`,
      onBeforeSend(_method, ajaxOptions) {
        ajaxOptions.xhrFields = { withCredentials: true };
      },
    });

    this.employeesStore = createStore({
      key: 'ID',
      loadUrl: `${url}/Employees`,
      onBeforeSend(_method, ajaxOptions) {
        ajaxOptions.xhrFields = { withCredentials: true };
      },
    });

    this.dragStart = this.dragStart.bind(this);
    this.dragChange = this.dragChange.bind(this);
    this.reorder = this.reorder.bind(this);
  }

  dragStart(e: DxDataGridTypes.RowDraggingStartEvent): void {
    const selectedData: Task[] = e.component.getSelectedRowsData();
    e.itemData = getVisibleRowValues(selectedData, e.component);
    e.cancel = !this.canDrag(e);
  }

  dragChange(e: DxDataGridTypes.RowDraggingChangeEvent): void {
    e.cancel = !this.canDrop(e);
  }

  reorder(e: DxDataGridTypes.RowDraggingReorderEvent): void {
    e.promise = this.updateOrderIndex(e);
    if (this.shouldClearSelection) { e.component.clearSelection(); }
  }

  async updateOrderIndex(e: DxDataGridTypes.RowDraggingReorderEvent): Promise<void> {
    const visibleRows = e.component.getVisibleRows();
    const newOrderIndex = visibleRows[e.toIndex].data.OrderIndex;
    const store = e.component.getDataSource().store();
    try {
      this.updateInProgress = true;
      e.component.beginCustomLoading('Loading...');
      const promises = [];
      for (const itemData of e.itemData) {
        promises.push(store.update(itemData[this.keyExpr], { OrderIndex: newOrderIndex }));
      }
      await Promise.all(promises);
      await e.component.refresh();
    } catch (error: unknown) {
      notify(error, 'error', 1000);
    } finally {
      this.updateInProgress = false;
      e.component.endCustomLoading();
    }
  }

  canDrag(e: DxDataGridTypes.RowDraggingStartEvent): boolean {
    if (this.updateInProgress) return false;
    const visibleRows = e.component.getVisibleRows();
    return visibleRows.some((r) => r.isSelected && r.rowIndex === e.fromIndex);
  }

  canDrop(e: DxDataGridTypes.RowDraggingChangeEvent): boolean {
    const visibleRows = e.component.getVisibleRows();
    return !visibleRows.some((r) => r.isSelected && r.rowIndex === e.toIndex);
  }

  originalOrder(_a: KeyValue<number, string>, _b: KeyValue<number, string>): number {
    return 0;
  }
}

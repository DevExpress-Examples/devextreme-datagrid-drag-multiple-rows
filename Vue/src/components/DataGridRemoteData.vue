<script setup lang="ts">
import DxDataGrid, {
  DxColumn,
  DxSorting,
  DxRowDragging,
  DxLookup,
  DxScrolling,
  DxSelection,
  type DxDataGridTypes,
} from 'devextreme-vue/data-grid';
import notify from 'devextreme/ui/notify';
import type { Task } from '../data';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import type CustomStore from 'devextreme/data/custom_store';
import { getVisibleRowValues } from '@/utils';

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

let updateInProgress: Boolean = false;

const props = defineProps({
  shouldClearSelection: Boolean,
});

function dragChange(e: DxDataGridTypes.RowDraggingChangeEvent): void {
  e.cancel = !canDrop(e);
}
function canDrop(e: DxDataGridTypes.RowDraggingChangeEvent): boolean {
  const visibleRows = e.component.getVisibleRows();
  return !visibleRows.some((r) => r.isSelected && r.rowIndex === e.toIndex);
}

function canDrag(e: DxDataGridTypes.RowDraggingStartEvent): boolean {
  if (updateInProgress) return false;
  const visibleRows = e.component.getVisibleRows();
  return visibleRows.some((r) => r.isSelected && r.rowIndex === e.fromIndex);
}

function dragStart(e: DxDataGridTypes.RowDraggingStartEvent): void {
  const selectedData: Task[] = e.component.getSelectedRowsData();
  e.itemData = getVisibleRowValues(selectedData, e.component);
  e.cancel = !canDrag(e);
}

async function updateOrderIndex(e: DxDataGridTypes.RowDraggingReorderEvent): Promise<void> {
  const visibleRows = e.component.getVisibleRows();
  const newOrderIndex = visibleRows[e.toIndex].data.OrderIndex;
  const store = e.component.getDataSource().store();
  updateInProgress = true;
  e.component.beginCustomLoading('Loading...');

  try {
    await Promise.all(
      e.itemData.map((itemData: Task) => {
        return store.update(itemData[keyExpr], { OrderIndex: newOrderIndex });
      })
    );
    await e.component.refresh();
  } catch (error) {
    notify(error, 'error', 1000);
  } finally {
    e.component.endCustomLoading();
    updateInProgress = false;
  }
}

function reorder(e: any): void {
  e.promise = updateOrderIndex(e);
  if (props.shouldClearSelection) e.component.clearSelection();
}
</script>
<template>
  <DxDataGrid
    :data-source="tasksStore"
    :remote-operations="true"
    :height="480"
  >
    <DxRowDragging
      :allow-reordering="true"
      :on-reorder="reorder"
      :on-drag-change="dragChange as () => void"
      :on-drag-start="dragStart as () => void"
      drag-template="dragItems"
    />
    <template #dragItems="{ data }">
      <table className="drag-container">
        <tbody>
          <tr
            v-for="item in data.itemData"
            class="dragged-item"
            :key="item[keyExpr]"
          >
            <td
              v-for="key in Object.keys(item)"
              :key="item[keyExpr] + key"
            >
              {{ item[key] }}
            </td>
          </tr>
        </tbody>
      </table>
    </template>
    <DxSelection mode="multiple"/>
    <DxSorting mode="none"/>
    <DxScrolling mode="virtual"/>
    <DxColumn
      data-field="ID"
      :width="55"
    />
    <DxColumn
      data-field="Owner"
      :width="150"
    >
      <DxLookup
        :data-source="employeesStore"
        value-expr="ID"
        display-expr="FullName"
      />
    </DxColumn>
    <DxColumn
      data-field="AssignedEmployee"
      :width="150"
      caption="Assignee"
    >
      <DxLookup
        :data-source="employeesStore"
        value-expr="ID"
        display-expr="FullName"
      />
    </DxColumn>
    <DxColumn data-field="Subject"/>
  </DxDataGrid>
</template>

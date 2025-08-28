<script setup lang="ts">
import DxDataGrid, {
  DxColumn,
  DxSorting,
  DxRowDragging,
  DxLookup,
  DxScrolling,
  DxSelection,
} from "devextreme-vue/data-grid";
import type {

  RowDraggingStartEvent,
  RowDraggingChangeEvent,
  RowDraggingReorderEvent,
  Column,
} from "devextreme/ui/data_grid";
import type { Task } from "../data";
import { createStore } from "devextreme-aspnet-data-nojquery";
import type CustomStore from "devextreme/data/custom_store";

const keyExpr: keyof Task = "ID";
const url = "https://js.devexpress.com/Demos/Mvc/api/RowReordering";

const tasksStore: CustomStore = createStore({
  key: "ID",
  loadUrl: `${url}/Tasks`,
  updateUrl: `${url}/UpdateTask`,
  onBeforeSend(method, ajaxOptions) {
    ajaxOptions.xhrFields = { withCredentials: true };
  },
});
const employeesStore: CustomStore = createStore({
  key: "ID",
  loadUrl: `${url}/Employees`,
  onBeforeSend(method, ajaxOptions) {
    ajaxOptions.xhrFields = { withCredentials: true };
  },
});

let updateInProgress: Boolean = false;

const props = defineProps({
  shouldClearSelection: Boolean,
});

function dragChange(e: RowDraggingChangeEvent) {
  e.cancel = !canDrop(e);
}
function canDrop(e: RowDraggingChangeEvent) {
  const visibleRows = e.component.getVisibleRows();
  return !visibleRows.some((r) => r.isSelected && r.rowIndex === e.toIndex);
}
function getVisibleRowValues(rowsData: Task[], grid: dxDataGrid) {
  const visbileColumns = grid.getVisibleColumns();
  const selectedData = rowsData.map((rowData: Task) => {
    const visibleValues: any = {};
    visbileColumns.forEach((column: Column) => {
      if (column.dataField)
        visibleValues[column.dataField] = getVisibleCellValue(column, rowData);
    });
    return visibleValues;
  });
  return selectedData;
}
function getVisibleCellValue(column: Column, rowData: Task) {
  if (column.dataField) {
    const propKey = column.dataField as keyof Task;
    const cellValue = rowData[propKey];
    return column.lookup && column.lookup.calculateCellValue
      ? column.lookup.calculateCellValue(cellValue)
      : cellValue;
  }
}
function canDrag(e: RowDraggingStartEvent) {
  if (updateInProgress) return false;
  const visibleRows = e.component.getVisibleRows();
  return visibleRows.some((r) => r.isSelected && r.rowIndex === e.fromIndex);
}

function dragStart(e: RowDraggingStartEvent) {
  const selectedData: Task[] = e.component.getSelectedRowsData();
  e.itemData = getVisibleRowValues(selectedData, e.component);
  e.cancel = !canDrag(e);
}

async function updateOrderIndex(e: RowDraggingReorderEvent) {
  const visibleRows = e.component.getVisibleRows();
  const newOrderIndex = visibleRows[e.toIndex].data.OrderIndex;
  const store = e.component.getDataSource().store();
  updateInProgress = true;
  e.component.beginCustomLoading("Loading...");
  for (let i = 0; i < e.itemData.length; i++) {
    await store.update(e.itemData[i][keyExpr], { OrderIndex: newOrderIndex });
  }
  e.component.refresh().then(() => {
    e.component.endCustomLoading();
    updateInProgress = false;
  });
}

function reorder(e: RowDraggingReorderEvent) {
  e.promise = updateOrderIndex(e);
  if (props.shouldClearSelection) e.component.clearSelection();
}
</script>
<template>
  <DxDataGrid :data-source="tasksStore" :remote-operations="true" :height="480">
    <DxRowDragging
      :allow-reordering="true"
      :on-reorder="reorder"
      :on-drag-change="dragChange"
      :on-drag-start="dragStart"
      drag-template="dragItems"
    />
    <template #dragItems="{ data }">
      <table className="drag-container">
        <tbody>
          <tr
            v-for="item in data.itemData"
            class="dragged-item"
            v-bind:key="item[keyExpr]"
          >
            <td
              v-for="key in Object.keys(item)"
              v-bind:key="item[keyExpr] + key"
            >
              {{ item[key] }}
            </td>
          </tr>
        </tbody>
      </table>
    </template>
    <DxSelection mode="multiple" />
    <DxSorting mode="none" />
    <DxScrolling mode="virtual" />
    <DxColumn data-field="ID" :width="55" />
    <DxColumn data-field="Owner" :width="150">
      <DxLookup
        :data-source="employeesStore"
        value-expr="ID"
        display-expr="FullName"
      />
    </DxColumn>
    <DxColumn data-field="AssignedEmployee" :width="150" caption="Assignee">
      <DxLookup
        :data-source="employeesStore"
        value-expr="ID"
        display-expr="FullName"
      />
    </DxColumn>
    <DxColumn data-field="Subject" />
  </DxDataGrid>
</template>

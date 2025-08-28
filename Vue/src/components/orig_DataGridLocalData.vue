<script setup lang="ts">
import DxDataGrid, {
  DxColumn,
  DxSorting,
  DxRowDragging,
  DxSelection,
} from "devextreme-vue/data-grid";
import type {
  RowDraggingStartEvent,
  RowDraggingChangeEvent,
  RowDraggingReorderEvent,
  Column,
} from "devextreme/ui/data_grid";
import type { Customer } from "../data";
import type dxDataGrid from "devextreme/ui/data_grid";

import { customers } from "../data";

const props = defineProps({
  shouldClearSelection: Boolean,
});

const keyExpr: keyof Customer = "ID";

function reorder(e: RowDraggingReorderEvent) {
  const fullDataToInsert: Customer[] = [];
  e.itemData.forEach((rowData: any) => {
    const indexToRemove = customers.findIndex(
      (item: Customer) => item[keyExpr] === rowData[keyExpr]
    );
    fullDataToInsert.push(customers[indexToRemove]);
    customers.splice(indexToRemove, 1);
  });
  const toIndex = calculateToIndex(customers, e);
  customers.splice(toIndex, 0, ...fullDataToInsert);
  e.component.refresh();
  if (props.shouldClearSelection) e.component.clearSelection();
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
  return visibleRows.some((r) => r.isSelected && r.rowIndex === e.fromIndex);
}
function canDrop(e: RowDraggingChangeEvent) {
  const visibleRows = e.component.getVisibleRows();
  return !visibleRows.some((r) => r.isSelected && r.rowIndex === e.toIndex);
}
function calculateToIndex(dataArray: Customer[], e: RowDraggingReorderEvent) {
  const visibleRows = e.component.getVisibleRows();
  const toIndex = dataArray.findIndex(
    (item) => item[keyExpr] === visibleRows[e.toIndex].data[keyExpr]
  );
  return e.fromIndex >= e.toIndex ? toIndex : toIndex + 1;
}
function getVisibleRowValues(rowsData: Customer[], grid: dxDataGrid) {
  const visbileColumns: Column[] = grid.getVisibleColumns();
  const selectedData = rowsData.map((rowData) => {
    const visibleValues: any = {};
    visbileColumns.forEach((column: Column) => {
      if (column.dataField)
        visibleValues[column.dataField] = getVisibleCellValue(column, rowData);
    });
    return visibleValues;
  });
  return selectedData;
}
function getVisibleCellValue(column: Column, rowData: Customer) {
  if (column.dataField) {
    const propKey = column.dataField as keyof Customer;
    const cellValue = rowData[propKey];
    return column.lookup && column.lookup.calculateCellValue
      ? column.lookup.calculateCellValue(cellValue)
      : cellValue;
  }
}
</script>
<template>
  <DxDataGrid :data-source="customers" key-expr="ID">
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
    <DxColumn data-field="ID" :width="55" />
    <DxColumn data-field="CompanyName" />
    <DxColumn data-field="Address" />
    <DxColumn data-field="City" />
    <DxColumn data-field="State" />
  </DxDataGrid>
</template>

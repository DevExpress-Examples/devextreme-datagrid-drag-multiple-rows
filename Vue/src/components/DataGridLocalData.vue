<script setup lang="ts">
import DxDataGrid, {
  DxColumn,
  DxSorting,
  DxRowDragging,
  DxSelection,
} from 'devextreme-vue/data-grid';
import type { DxDataGridTypes } from 'devextreme-vue/data-grid';
import type { Customer } from '../data';
import { customers } from '../data';
import { getVisibleRowValues } from '@/utils';

const props = defineProps({
  shouldClearSelection: Boolean,
});

const keyExpr: keyof Customer = 'ID';

function reorder(e: DxDataGridTypes.RowDraggingReorderEvent): void {
  const fullDataToInsert: Customer[] = [];
  e.itemData?.forEach((rowData: Customer) => {
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
function dragStart(e: DxDataGridTypes.RowDraggingStartEvent): void {
  const selectedData: Customer[] = e.component.getSelectedRowsData();
  e.itemData = getVisibleRowValues(selectedData, e.component);
  e.cancel = !canDrag(e);
}
function dragChange(e: DxDataGridTypes.RowDraggingChangeEvent): void {
  e.cancel = !canDrop(e);
}
function canDrag(e: DxDataGridTypes.RowDraggingStartEvent): boolean {
  const visibleRows = e.component.getVisibleRows();
  return visibleRows.some((r) => r.isSelected && r.rowIndex === e.fromIndex);
}
function canDrop(e: DxDataGridTypes.RowDraggingChangeEvent): boolean {
  const visibleRows = e.component.getVisibleRows();
  return !visibleRows.some((r) => r.isSelected && r.rowIndex === e.toIndex);
}
function calculateToIndex(
  dataArray: Customer[],
  e: DxDataGridTypes.RowDraggingReorderEvent
): number {
  const visibleRows = e.component.getVisibleRows();
  const toIndex = dataArray.findIndex(
    (item) => item[keyExpr] === visibleRows[e.toIndex].data[keyExpr]
  );
  return e.fromIndex >= e.toIndex ? toIndex : toIndex + 1;
}

</script>
<template>
  <DxDataGrid
    :data-source="customers"
    key-expr="ID"
  >
    <DxRowDragging
      :allow-reordering="true"
      :on-reorder="reorder as () => void"
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
    <DxColumn
      data-field="ID"
      :width="55"
    />
    <DxColumn data-field="CompanyName"/>
    <DxColumn data-field="Address"/>
    <DxColumn data-field="City"/>
    <DxColumn data-field="State"/>
  </DxDataGrid>
</template>

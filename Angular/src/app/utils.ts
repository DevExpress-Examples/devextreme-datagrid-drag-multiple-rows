import type { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import type dxDataGrid from 'devextreme/ui/data_grid';

export type CellValue = number | string | undefined;

export function getVisibleCellValue<T>(column: DxDataGridTypes.Column, rowData: T): CellValue {
  if (column.dataField) {
    const propKey = column.dataField as keyof T;
    const cellValue = rowData[propKey];
    return column?.lookup?.calculateCellValue
      ? column.lookup.calculateCellValue(cellValue) as CellValue
      : cellValue as CellValue;
  }
  return undefined;
}

export function getVisibleRowValues<T, K>(
  rowsData: T[],
  grid: dxDataGrid<T, K>,
): Record<string, unknown>[] {
  const visibleColumns: DxDataGridTypes.Column[] = grid.getVisibleColumns();
  const selectedData = rowsData.map((rowData) => {
    const visibleValues: Record<string, CellValue> = {};
    visibleColumns.forEach((column: DxDataGridTypes.Column) => {
      if (column.dataField) {
        visibleValues[column.dataField] = getVisibleCellValue(column, rowData);
      }
    });
    return visibleValues;
  });
  return selectedData;
}

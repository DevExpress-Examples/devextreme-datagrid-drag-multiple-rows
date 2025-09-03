const LocalGrid = {
  KEY_EXPR: 'ID',
  
  dragStart(e) {
    const selectedData = e.component.getSelectedRowsData();
    e.itemData = LocalGrid.getVisibleRowValues(selectedData, e.component);
    e.cancel = !LocalGrid.canDrag(e);
  },
  
  dragChange(e) {
    e.cancel = !LocalGrid.canDrop(e);
  },
  
  reorder(e) {
    const fullDataToInsert = [];
    e.itemData.forEach((rowData) => {
      const indexToRemove = customers.findIndex((item) => item[LocalGrid.KEY_EXPR] === rowData[LocalGrid.KEY_EXPR]);
      fullDataToInsert.push(customers[indexToRemove]);
      customers.splice(indexToRemove, 1);
    });
    const toIndex = LocalGrid.calculateToIndex(customers, e);
    customers.splice(toIndex, 0, ...fullDataToInsert);
    e.component.refresh();
    if (LocalGrid.shouldClearSelection()) {
      e.component.clearSelection();
    }
  },
  
  dragTemplate(dragData) {
    const itemsContainer = $('<table>').addClass('drag-container');
    dragData.itemData.forEach((rowData) => {
      const itemContainer = $('<tr>');
      for (const field in rowData) {
        if (Object.prototype.hasOwnProperty.call(rowData, field)) {
          itemContainer.append($('<td>').text(rowData[field]));
        }
      }
      itemsContainer.append(itemContainer);
    });
    return $('<div>').append(itemsContainer);
  },
  
  canDrag(e) {
    const visibleRows = e.component.getVisibleRows();
    return visibleRows.some((r) => r.isSelected && r.rowIndex === e.fromIndex);
  },
  
  canDrop(e) {
    const visibleRows = e.component.getVisibleRows();
    return !visibleRows.some((r) => r.isSelected && r.rowIndex === e.toIndex);
  },
  
  calculateToIndex(dataArray, e) {
    const visibleRows = e.component.getVisibleRows();
    const toIndex = dataArray.findIndex((item) => item[LocalGrid.KEY_EXPR] === visibleRows[e.toIndex].data[LocalGrid.KEY_EXPR]);
    return e.fromIndex >= e.toIndex ? toIndex : toIndex + 1;
  },
  
  getVisibleRowValues(rowsData, grid) {
    const visibleColumns = grid.getVisibleColumns();
    const selectedData = rowsData.map((rowData) => {
      const visibleValues = {};
      visibleColumns.forEach((column) => {
        if (column.dataField) {
          visibleValues[column.dataField] = LocalGrid.getVisibleCellValue(column, rowData);
        }
      });
      return visibleValues;
    });
    return selectedData;
  },
  
  getVisibleCellValue(column, rowData) {
    if (!column.dataField) return undefined;
    const cellValue = rowData[column.dataField];
    return column.lookup?.calculateCellValue
      ? column.lookup.calculateCellValue(cellValue)
      : cellValue;
  },
  
  shouldClearSelection() {
    return $('#clear-after-drop-switch').dxSwitch('option', 'value');
  },
};

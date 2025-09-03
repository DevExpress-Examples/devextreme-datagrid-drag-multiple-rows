$(() => {
  const KEY_EXPR = 'ID';

  $('#grid-local-data').dxDataGrid({
    keyExpr: KEY_EXPR,
    dataSource: customers,
    rowDragging: {
      allowReordering: true,
      onDragStart(e) {
        const selectedData = e.component.getSelectedRowsData();
        e.itemData = getVisibleRowValues(selectedData, e.component);
        e.cancel = !canDrag(e);
      },
      dragTemplate(dragData) {
        const itemsContainer = $('<table>').addClass('drag-container');
        dragData.itemData.forEach(((rowData) => {
          const itemContainer = $('<tr>');
          Object.keys(rowData).forEach((field) => {
            itemContainer.append($('<td>').text(rowData[field]));
          });
          itemsContainer.append(itemContainer);
        }));
        return $('<div>').append(itemsContainer);
      },
      onDragChange(e) {
        e.cancel = !canDrop(e);
      },
      onReorder(e) {
        const fullDataToInsert = [];
        e.itemData.forEach((rowData) => {
          const indexToRemove = customers.findIndex((item) => item[KEY_EXPR] === rowData[KEY_EXPR]);
          fullDataToInsert.push(customers[indexToRemove]);
          customers.splice(indexToRemove, 1);
        });
        const toIndex = calculateToIndex(customers, e);
        customers.splice(toIndex, 0, ...fullDataToInsert);
        e.component.refresh();
        if (shouldClearSelection()) {
          e.component.clearSelection();
        }
      },
    },
    selection: { mode: 'multiple' },
    sorting: { mode: 'none' },
    columns: [{
      dataField: 'ID',
      width: 55,
    }, 'CompanyName', 'Address', 'City', 'State'],
  });

  function canDrag(e) {
    const visibleRows = e.component.getVisibleRows();
    return visibleRows.some((r) => r.isSelected && r.rowIndex === e.fromIndex);
  }

  function canDrop(e) {
    const visibleRows = e.component.getVisibleRows();
    return !visibleRows.some((r) => r.isSelected && r.rowIndex === e.toIndex);
  }

  function calculateToIndex(dataArray, e) {
    const visibleRows = e.component.getVisibleRows();
    const toIndex = dataArray.findIndex(
      (item) => item[KEY_EXPR] === visibleRows[e.toIndex].data[KEY_EXPR],
    );
    return e.fromIndex >= e.toIndex ? toIndex : toIndex + 1;
  }

  function getVisibleRowValues(rowsData, grid) {
    const visibleColumns = grid.getVisibleColumns();
    const selectedData = rowsData.map((rowData) => {
      const visibleValues = {};
      visibleColumns.forEach((column) => {
        if (column.dataField) {
          visibleValues[column.dataField] = getVisibleCellValue(column, rowData);
        }
      });
      return visibleValues;
    });
    return selectedData;
  }

  function getVisibleCellValue(column, rowData) {
    const cellValue = rowData[column.dataField];
    return column.lookup ? column.lookup.calculateCellValue(cellValue) : cellValue;
  }

  function shouldClearSelection() {
    return $('#clear-after-drop-switch').dxSwitch('option', 'value');
  }
});

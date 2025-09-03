const RemoteGrid = {
    updateInProgress: false,
    KEY_EXPR: 'ID',

    dragStart(e) {
        const selectedData = e.component.getSelectedRowsData().sort((a, b) => (a.OrderIndex > b.OrderIndex ? 1 : -1));
        e.itemData = RemoteGrid.getVisibleRowValues(selectedData, e.component);
        e.cancel = !RemoteGrid.canDrag(e);
    },

    dragChange(e) {
        e.cancel = !RemoteGrid.canDrop(e);
    },

    reorder(e) {
        e.promise = RemoteGrid.updateOrderIndex(e);
        if (RemoteGrid.shouldClearSelection()) {
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

    async updateOrderIndex(e) {
        const visibleRows = e.component.getVisibleRows();
        const newOrderIndex = visibleRows[e.toIndex].data.OrderIndex;
        const store = e.component.getDataSource().store();
        RemoteGrid.updateInProgress = true;
        e.component.beginCustomLoading('Loading...');

        try {
            const updatePromises = e.itemData.map((itemData) =>
                store.update(itemData[RemoteGrid.KEY_EXPR], { OrderIndex: newOrderIndex })
            );
            await Promise.all(updatePromises);
            await e.component.refresh();
        } catch (error) {
            throw DevExtreme.ui.notify(error, 'error', 1000);
        } finally {
            e.component.endCustomLoading();
            RemoteGrid.updateInProgress = false;
        }
    },

    canDrag(e) {
        if (RemoteGrid.updateInProgress) return false;
        const visibleRows = e.component.getVisibleRows();
        return visibleRows.some((r) => r.isSelected && r.rowIndex === e.fromIndex);
    },

    canDrop(e) {
        if (RemoteGrid.updateInProgress) return false;
        const visibleRows = e.component.getVisibleRows();
        return !visibleRows.some((r) => r.isSelected && r.rowIndex === e.toIndex);
    },

    getVisibleRowValues(rowsData, grid) {
        const visibleColumns = grid.getVisibleColumns();
        const selectedData = rowsData.map((rowData) => {
            const visibleValues = {};
            visibleColumns.forEach((column) => {
                if (column.dataField) {
                    visibleValues[column.dataField] = RemoteGrid.getVisibleCellValue(column, rowData);
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

    beforeSend(method, ajaxOptions) {
        ajaxOptions.xhrFields = { withCredentials: true };
    },
};

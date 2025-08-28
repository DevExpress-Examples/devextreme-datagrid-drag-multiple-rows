<!-- default badges list -->
![](https://img.shields.io/endpoint?url=https://codecentral.devexpress.com/api/v1/VersionRange/617017018/22.2.3%2B)
[![](https://img.shields.io/badge/Open_in_DevExpress_Support_Center-FF7200?style=flat-square&logo=DevExpress&logoColor=white)](https://supportcenter.devexpress.com/ticket/details/T1155013)
[![](https://img.shields.io/badge/📖_How_to_use_DevExpress_Examples-e9f6fc?style=flat-square)](https://docs.devexpress.com/GeneralInformation/403183)
[![](https://img.shields.io/badge/💬_Leave_Feedback-feecdd?style=flat-square)](#does-this-example-address-your-development-requirementsobjectives)
<!-- default badges end -->
# DataGrid for DevExtreme - How to drag multiple rows

This example demonstrates how to simultaneously drag and drop multiple selected rows.

![grid-drag-multiple-rows](https://user-images.githubusercontent.com/13280527/226650938-08e5b3df-c543-4c56-b06c-aa4b97e8dd17.gif)

This implementation includes solutions for both local and remote data sources. It is based on our demos that illustrate how to drag a single row:
- [Demo: Local Reordering](https://js.devexpress.com/Demos/WidgetsGallery/Demo/DataGrid/LocalReordering/jQuery/Light/)
- [Demo: Remote Reordering](https://js.devexpress.com/Demos/WidgetsGallery/Demo/DataGrid/RemoteReordering/jQuery/Light/)

The implementation for remote data sources sends multiple requests to update the order index of every dropped row. If your back-end supports batch updates, you can simultaneously send all data updates in a custom way.

## Implementation Details

Use the [DataGrid.rowDragging](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/rowDragging/) object to configure the drag and drop functionality:
1) Handle the [RowDragging.onDragStart](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/rowDragging/#onDragStart) event to collect selected rows and cancel the drag operation if a user attempts to drag non-selected rows.
2) Handle the [RowDragging.onDragChange](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/rowDragging/#onDragChange) event to cancel the drop operation if a user attempts to drop rows to the same position.
3) Handle the [RowDragging.onReorder](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/rowDragging/#onReorder) event to re-order rows in the data source.
4) Define [RowDragging.dragTemplate](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/rowDragging/#dragTemplate) to arrange cell values of selected rows for the dragged item.

## Files to Review

- **jQuery**
	- [GridLocalData.js](jQuery/src/GridLocalData.js)
	- [GridRemoteData.js](jQuery/src/GridRemoteData.js)
- **Angular**
	- [data-grid-local-data.component.html](Angular/src/app/components/data-grid-local-data/data-grid-local-data.component.html)
	- [data-grid-local-data.component.ts](Angular/src/app/components/data-grid-local-data/data-grid-local-data.component.ts)
	- [data-grid-remote-data.component.html](Angular/src/app/components/data-grid-remote-data/data-grid-remote-data.component.html)
	- [data-grid-remote-data.component.ts](Angular/src/app/components/data-grid-remote-data/data-grid-remote-data.component.ts)
- **Vue**
	- [DataGridLocalData.vue](Vue/src/components/DataGridLocalData.vue)
	- [DataGridRemoteData.vue](Vue/src/components/DataGridRemoteData.vue)
- **React**
	- [DataGridLocalData.tsx](React/src/DataGridLocalData.tsx)
	- [DataGridRemoteData.tsx](React/src/DataGridRemoteData.tsx)
- **NetCore**    
	- [DataGridLocal.cshtml](<ASP.NET Core/Views/PartialViews/DataGridLocal.cshtml>)
	- [DataGridRemote.cshtml](<ASP.NET Core/Views/PartialViews/DataGridRemote.cshtml>)
	- [GridLocal.js.js](<ASP.NET Core/wwwroot/js/GridLocal.js>)
	- [GridRemote.js](<ASP.NET Core/wwwroot/js/GridRemote.js>)
	

## Documentation

[DataGrid.rowDragging](https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDataGrid/Configuration/rowDragging/)

## More Examples

- [TreeView for DevExtreme - How to drag and drop multiple items](https://github.com/DevExpress-Examples/devextreme-treeview-drag-and-drop-multiple-items)
- [DataGrid for DevExtreme - How to drag multiple rows between two grids](https://github.com/DevExpress-Examples/devextreme-datagrid-drag-multiple-rows-between-grids)
<!-- feedback -->
## Does this example address your development requirements/objectives?

[<img src="https://www.devexpress.com/support/examples/i/yes-button.svg"/>](https://www.devexpress.com/support/examples/survey.xml?utm_source=github&utm_campaign=devextreme-datagrid-drag-multiple-rows&~~~was_helpful=yes) [<img src="https://www.devexpress.com/support/examples/i/no-button.svg"/>](https://www.devexpress.com/support/examples/survey.xml?utm_source=github&utm_campaign=devextreme-datagrid-drag-multiple-rows&~~~was_helpful=no)

(you will be redirected to DevExpress.com to submit your response)
<!-- feedback end -->

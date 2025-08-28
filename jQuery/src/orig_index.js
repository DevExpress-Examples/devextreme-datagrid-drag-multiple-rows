$(function () {
    function createTabItemTemplate(contentID) {
        return $("<div>").attr("id", contentID).addClass("tab-item-content");
    }
    $("#tabPanel").dxTabPanel({
        deferRendering: false,
        items: [{
            title: "Local Data",
            template: function() {
                return createTabItemTemplate("gridLocalData");
            }
        }, {
            title: "Remote Data",
            template: function() {
                return createTabItemTemplate("gridRemoteData");
            }
        }]
    })
    $("#clearAfterDropSwitch").dxSwitch({});  
});
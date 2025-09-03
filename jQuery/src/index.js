$(() => {
  function createTabItemTemplate(contentID) {
    return $('<div>').attr('id', contentID).addClass('tab-item-content');
  }

  $('#tab-panel').dxTabPanel({
    deferRendering: false,
    items: [{
      title: 'Local Data',
      template() {
        return createTabItemTemplate('grid-local-data');
      },
    }, {
      title: 'Remote Data',
      template() {
        return createTabItemTemplate('grid-remote-data');
      },
    }],
  });

  $('#clear-after-drop-switch').dxSwitch({});
});

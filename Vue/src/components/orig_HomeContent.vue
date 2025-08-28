<script setup lang="ts">
import { ref } from "vue";

import DxTabPanel, { DxItem } from 'devextreme-vue/tab-panel';
import DxSwitch from 'devextreme-vue/switch';
import DataGridLocalData from './DataGridLocalData.vue';
import DataGridRemoteData from './DataGridRemoteData.vue';

const shouldClearSelection = ref(false);
</script>
<template>
  <div>
    <div className="demo-header">
      <h3>DataGrid - Select multiple items and drag'n'drop</h3>
      <div id="toggle-container">
          <span>Clear selection after drop</span>
          <DxSwitch id="clearAfterDropSwitch" v-model:value="shouldClearSelection"></DxSwitch>
      </div>
    </div>
    <DxTabPanel>
      <DxItem title="Local Data">
          <DataGridLocalData :should-clear-selection="shouldClearSelection"></DataGridLocalData>
      </DxItem> 
      <DxItem title="Remote Data">
        <DataGridRemoteData :should-clear-selection="shouldClearSelection"></DataGridRemoteData>
      </DxItem>
    </DxTabPanel>
  </div>
</template>
<style scoped>
  .tab-item-content {
    margin: auto;
  }
  .demo-header {
    display: flex;
    justify-content: space-between;
  }
  #toggle-container {
    padding-top: 20px;
  }
  #clearAfterDropSwitch {
    vertical-align: text-bottom;
  }
  #toggle-container span {
    padding-right: 10px;
  }
  .drag-container {
    padding: 10px;
  }
  .drag-container td {
    padding: 0px 10px 0px 10px;
  }
</style>

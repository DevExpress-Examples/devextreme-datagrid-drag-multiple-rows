import { useCallback, useState } from 'react';
import './App.css';
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import TabPanel, { Item } from 'devextreme-react/tab-panel';
import Switch from 'devextreme-react/switch';
import { ValueChangedEvent } from 'devextreme/ui/switch';
import DataGridLocalData from './DataGridLocalData';
import DataGridRemoteData from './DataGridRemoteData';


function App() {
  const [shouldClearSelection, setShouldClearSelection] = useState(false);

  const switchValueChanged = useCallback((e: ValueChangedEvent) => {
    setShouldClearSelection(e.value);
  }, []);

  const dataGridLocalRender = useCallback(() => {
    return  <div className='tab-item-content'>
      <DataGridLocalData shouldClearSelection={shouldClearSelection}></DataGridLocalData>
    </div>
  }, [shouldClearSelection])

  const dataGridRemoteRender = useCallback(() => {
    return <div className='tab-item-content'>
      <DataGridRemoteData shouldClearSelection={shouldClearSelection}></DataGridRemoteData>
    </div>
  }, [shouldClearSelection])

  return (
    <div className="main">
      <div className="demo-header">
        <h3>DataGrid - Select multiple items and drag'n'drop</h3>
        <div id="toggle-container">
            <span>Clear selection after drop</span>
            <Switch id="clearAfterDropSwitch" value={shouldClearSelection} onValueChanged={switchValueChanged}></Switch>
        </div>
      </div>
      <TabPanel>
        <Item title="Local Data" render={dataGridLocalRender}></Item> 
        <Item title="Remote Data" render={dataGridRemoteRender}></Item>
      </TabPanel>
    </div>
  );
}
export class GridDemoComponentProps {
  shouldClearSelection: boolean = false; 
}
export default App;

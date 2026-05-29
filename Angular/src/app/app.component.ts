import { Component } from '@angular/core';
import { DxDataGridModule, DxTabPanelModule, DxSwitchModule } from 'devextreme-angular';

@Component({
  imports: [DxDataGridModule, DxTabPanelModule, DxSwitchModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  clearSelectionAfterDrop = false;
}

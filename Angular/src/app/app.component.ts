import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DxTabPanelModule, DxSwitchModule, DxTemplateModule } from 'devextreme-angular';
import { DataGridLocalDataComponent } from './components/data-grid-local-data/data-grid-local-data.component';
import { DataGridRemoteDataComponent } from './components/data-grid-remote-data/data-grid-remote-data.component';

@Component({
  imports: [DxTabPanelModule, DxSwitchModule, DxTemplateModule, DataGridLocalDataComponent, DataGridRemoteDataComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  clearSelectionAfterDrop = false;
}

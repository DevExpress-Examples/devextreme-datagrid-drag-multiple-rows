import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DxDataGridModule, DxTabPanelModule, DxSwitchModule } from 'devextreme-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataGridLocalDataComponent } from './components/data-grid-local-data/data-grid-local-data.component';
import { DataGridRemoteDataComponent } from './components/data-grid-remote-data/data-grid-remote-data.component';

@NgModule({
  declarations: [
    AppComponent,
    DataGridLocalDataComponent,
    DataGridRemoteDataComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DxDataGridModule, DxTabPanelModule, DxSwitchModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }

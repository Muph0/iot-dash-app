import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DeviceListComponent } from './pages/device-list/device-list.component';
import { DeviceDetailComponent } from './pages/device-detail/device-detail.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { GraphComponent } from './components/graph/graph.component';
import { ToggleComponent } from './components/toggle/toggle.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    DeviceListComponent,
    DeviceDetailComponent,
    SidenavComponent,
    GraphComponent,
    ToggleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

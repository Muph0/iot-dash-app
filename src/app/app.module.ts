import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ToggleComponent } from './components/toggle/toggle.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IIdentityService } from './services/identity.service';
import { ApiV1IdentityService } from './services/implementation/api-v1-identity.service';
import { LoginComponent } from './pages/login/login.component';
import { UserDetailComponent } from './pages/user-detail/user-detail.component';
import { InterfaceDetailComponent } from './components/interface-detail/interface-detail.component';
import { InterfaceListComponent } from './pages/interface-list/interface-list.component';
import { FormErrorListComponent } from './components/form-error-list/form-error-list.component';
import { HistoryChartComponent } from './components/history-chart/history-chart.component';

import 'chart.js/auto';
import 'src/app/utils/chartjs-adapter-datefns';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Chart } from 'chart.js';
import { DashCardComponent } from './components/dash-card/dash-card.component';
import { GaugeControlComponent } from './components/card-gauge/card-gauge.component';
import { GaugeChartComponent } from './components/dash-card/gauge-chart.component';
import { CardSourceBoxComponent } from './components/dash-card/card-source-box.component';
import { CardChartComponent } from './components/card-chart/card-chart.component';

Chart.register(zoomPlugin);

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        SidenavComponent,
        ToggleComponent,
        LoginComponent,
        UserDetailComponent,
        InterfaceDetailComponent,
        InterfaceListComponent,
        InterfaceDetailComponent,
        FormErrorListComponent,
        HistoryChartComponent,
        DashCardComponent,
        GaugeControlComponent,
        GaugeChartComponent,
        CardSourceBoxComponent,
        CardChartComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
    ],
    providers: [
        { provide: IIdentityService, useClass: ApiV1IdentityService },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

    constructor() {



    }

}
// 540 720 960 1140 1320
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InterfaceListComponent } from './pages/interface-list/interface-list.component';
import { LoginComponent } from './pages/login/login.component';
import { UserDetailComponent } from './pages/user-detail/user-detail.component';
import { AuthGuard } from './services/routeGuards/auth-guard.service';

const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'list', component: InterfaceListComponent, canActivate: [AuthGuard] },
    //{ path: 'device/:id', component: DeviceDetailComponent, canActivate: [AuthGuard] },
    { path: 'me', component: UserDetailComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

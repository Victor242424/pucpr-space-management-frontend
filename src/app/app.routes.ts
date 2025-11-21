import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { DashboardComponent } from './components/dashboard/dashboard';
import { SpacesComponent } from './components/spaces/spaces';
import { AccessControlComponent } from './components/access-control/access-control';
import { ReportsComponent } from './components/reports/reports';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { DashboardStudentComponent } from './components/dashboard-student/dashboard-student';
import { StudentsComponent } from './components/students/students';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'dashboard-student', component: DashboardStudentComponent, canActivate: [AuthGuard] },
  { path: 'spaces', component: SpacesComponent, canActivate: [AuthGuard] },
  { path: 'access', component: AccessControlComponent, canActivate: [AuthGuard] },
  { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },
  { path: 'students', component: StudentsComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: '**', redirectTo: '/login' }
];
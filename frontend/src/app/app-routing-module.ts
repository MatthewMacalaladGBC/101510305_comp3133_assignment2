import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login',  loadChildren: () => import('./login/login-module').then(m => m.LoginModule) },
  { path: 'signup', loadChildren: () => import('./signup/signup-module').then(m => m.SignupModule) },
  { path: 'employees', loadChildren: () => import('./employees/employees-module').then(m => m.EmployeesModule), canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
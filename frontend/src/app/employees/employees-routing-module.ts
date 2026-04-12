import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeList } from './employee-list/employee-list';
import { EmployeeAdd } from './employee-add/employee-add';
import { EmployeeDetail } from './employee-detail/employee-detail';
import { EmployeeEdit } from './employee-edit/employee-edit';

const routes: Routes = [
  { path: '', component: EmployeeList },
  { path: 'add', component: EmployeeAdd },
  { path: ':id', component: EmployeeDetail },
  { path: ':id/edit', component: EmployeeEdit },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeesRoutingModule {}

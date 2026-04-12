import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeesRoutingModule } from './employees-routing-module';
import { EmployeeList } from './employee-list/employee-list';
import { EmployeeAdd } from './employee-add/employee-add';
import { EmployeeDetail } from './employee-detail/employee-detail';
import { EmployeeEdit } from './employee-edit/employee-edit';

@NgModule({
  declarations: [EmployeeList, EmployeeAdd, EmployeeDetail, EmployeeEdit],
  imports: [CommonModule, EmployeesRoutingModule],
})
export class EmployeesModule {}

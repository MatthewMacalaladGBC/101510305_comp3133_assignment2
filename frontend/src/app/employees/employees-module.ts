import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

import { EmployeesRoutingModule } from './employees-routing-module';
import { EmployeeList } from './employee-list/employee-list';
import { EmployeeAdd } from './employee-add/employee-add';
import { EmployeeDetail } from './employee-detail/employee-detail';
import { EmployeeEdit } from './employee-edit/employee-edit';
import { DefaultValuePipe } from '../pipes/default-value-pipe';
import { HighlightDirective } from '../directives/highlight-directive';

@NgModule({
  declarations: [
    EmployeeList,
    EmployeeAdd,
    EmployeeDetail,
    EmployeeEdit,
    DefaultValuePipe,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatTableModule, MatButtonModule, MatIconModule,
    MatInputModule, MatFormFieldModule, MatSelectModule,
    MatCardModule, MatDialogModule, MatSnackBarModule, MatToolbarModule,
    EmployeesRoutingModule,
    HighlightDirective,
  ],
})
export class EmployeesModule {}

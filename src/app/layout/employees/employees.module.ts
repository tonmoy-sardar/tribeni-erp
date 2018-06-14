import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeesComponent } from './employees.component';
import { EmployeesAddComponent } from './employees-add/employees-add.component';
import { EmployeesEditComponent } from './employees-edit/employees-edit.component';
import { EmployeeRoleManagementComponent } from './employee-role-management/employee-role-management.component';
import { EmployeeAttendanceComponent } from './employee-attendance/employee-attendance.component';
import { EmployeeAttendanceAddComponent } from './employee-attendance-add/employee-attendance-add.component';
import { EmployeeAttendanceEditComponent } from './employee-attendance-edit/employee-attendance-edit.component';

// core
import {CoreModule} from "../../core/core.module";

@NgModule({
  imports: [
    CommonModule,
    EmployeesRoutingModule,
    CoreModule
  ],
  declarations: [EmployeesComponent, EmployeesAddComponent, EmployeesEditComponent, EmployeeRoleManagementComponent, EmployeeAttendanceComponent, EmployeeAttendanceAddComponent, EmployeeAttendanceEditComponent]
})
export class EmployeesModule { }

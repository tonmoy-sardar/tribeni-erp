import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeesComponent } from './employees.component';
import { EmployeesAddComponent } from './employees-add/employees-add.component';
import { EmployeesEditComponent } from './employees-edit/employees-edit.component';
import { EmployeeRoleManagementComponent } from './employee-role-management/employee-role-management.component';
import { EmployeeAttendanceComponent } from './employee-attendance/employee-attendance.component';
import { EmployeeAttendanceAddComponent } from './employee-attendance-add/employee-attendance-add.component';
import { EmployeeAttendanceEditComponent } from './employee-attendance-edit/employee-attendance-edit.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeesComponent
  },
  {
    path: 'add',
    component: EmployeesAddComponent
  },
  {
    path: 'edit/:id',
    component: EmployeesEditComponent
  },
  {
    path: 'role-management',
    component: EmployeeRoleManagementComponent
  },
  {
    path: 'attendance',
    component: EmployeeAttendanceComponent
  },
  {
    path: 'attendance/add',
    component: EmployeeAttendanceAddComponent
  },
  {
    path: 'attendance/edit/:id',
    component: EmployeeAttendanceEditComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesRoutingModule { }

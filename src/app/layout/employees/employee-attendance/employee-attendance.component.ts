import { Component, OnInit } from '@angular/core';
import { HelpService } from '../../../core/services/help.service';
import { LoadingState } from '../../../core/component/loading/loading.component';
import { Router } from '@angular/router';
import { EmployeesService } from '../../../core/services/employees.service';

@Component({
  selector: 'app-employee-attendance',
  templateUrl: './employee-attendance.component.html',
  styleUrls: ['./employee-attendance.component.scss']
})
export class EmployeeAttendanceComponent implements OnInit {

  help_heading = "";
  help_description = "";
  loading: LoadingState = LoadingState.NotReady;
  employee_list: any = [];
  employee_attendance_list: any = [];

  constructor(
    private helpService: HelpService,
    private router: Router,
    private employeesService: EmployeesService
  ) { }

  ngOnInit() {
    this.getHelp();
    this.getEmployeeList();
  }

  getHelp() {
    this.helpService.getHelp().subscribe(res => {
      this.help_heading = res.data.grn.heading;
      this.help_description = res.data.grn.desc;
      this.loading = LoadingState.Ready
    })
  }

  btnClickNav(toNav) {
    this.router.navigateByUrl('/' + toNav);
  };

  getEmployeeList() {
    this.employeesService.getEmployeeListWithoutPagination().subscribe(res => {
      console.log(res);
      this.employee_list = res;
    })
  }

  changeEmployee(id) {
    this.getAttendanceList(id);
  }

  getAttendanceList(id) {

  }

}

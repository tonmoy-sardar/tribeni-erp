import { Component, OnInit } from '@angular/core';
import { HelpService } from '../../../core/services/help.service';
import { LoadingState } from '../../../core/component/loading/loading.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-attendance-add',
  templateUrl: './employee-attendance-add.component.html',
  styleUrls: ['./employee-attendance-add.component.scss']
})
export class EmployeeAttendanceAddComponent implements OnInit {

  help_heading = "";
  help_description = "";
  loading: LoadingState = LoadingState.NotReady;
  constructor(
    private helpService: HelpService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getHelp();
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


  addAttendance(){

  }

  reSet(){
    
  }

}

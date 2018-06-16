import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { EmployeesService } from '../../../core/services/employees.service';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HelpService } from '../../../core/services/help.service';
import { LoadingState } from '../../../core/component/loading/loading.component';

@Component({
  selector: 'app-module-activate-permission-add',
  templateUrl: './module-activate-permission-add.component.html',
  styleUrls: ['./module-activate-permission-add.component.scss']
})
export class ModuleActivatePermissionAddComponent implements OnInit {

  form: FormGroup;
  help_heading = "";
  help_description = "";
  employeeList = [];
  moduleList = [];

  loading: LoadingState = LoadingState.NotReady;

  in_time = {hour: '', minute: ''};
  out_time = {hour: '', minute: ''};
  hourStep = 1;
  minuteStep = 15;
  secondStep = 30;
  meridian = false;
  prevMainLevel = 0;
  mainLevel = 0;

   constructor(
    private employeesService: EmployeesService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private helpService: HelpService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      content: ['', Validators.required],
      primary_emp: ['', Validators.required],
      secondary_emp: ['', Validators.required],
      emp_approve_details: this.formBuilder.array([this.createEmpApproveDetails()]),
    });
    this.getEmployeeList();
    this.getHelp();
   
    this.getContentDropdown();

  }

  moduleChange(id)
  {
    //var mainLevel = 3
    //var mainLevel1 = 3

    var contentDetails = this.moduleList.filter(p => p.content_id == this.form.value.content)[0];

    this.mainLevel = contentDetails.approval_level;

    console.log(contentDetails);

    for(var i=this.prevMainLevel; i>0; i--)
    {
      this.deleteApproveDetails(i);
    }
   

    for(var i=1; i<this.mainLevel; i++)
    {
      this.addApproveDetails();
    }

    this.prevMainLevel = this.mainLevel;

  }

  getEmpApproveDetails(form) {
    return form.get('emp_approve_details').controls
  }

  createEmpApproveDetails() {
    return this.formBuilder.group({
      emp_level: ['', Validators.required],
      primary_emp: ['', Validators.required],
      secondary_emp: ['', Validators.required]
    });
  }

  deleteApproveDetails(index: number) {
    const control = <FormArray>this.form.controls['emp_approve_details'];
    control.removeAt(index);
  }

  addApproveDetails() {
    const control = <FormArray>this.form.controls['emp_approve_details'];
    control.push(this.createEmpApproveDetails());
  }

  

  getHelp() {
    this.helpService.getHelp().subscribe(res => {
      this.help_heading = res.data.grn.heading;
      this.help_description = res.data.grn.desc;
      this.loading = LoadingState.Ready
    })
  }

  getEmployeeList() {
    this.employeesService.getEmployeeListWithoutPagination().subscribe(
      (data: any[]) => {
        this.employeeList = data;
      }
    );
  };

  getContentDropdown() {
    this.employeesService.getContentDropdown().subscribe(
      (data: any[]) => {
        this.moduleList = data;
        console.log(this.moduleList);
      }
    );
  };
  
  addModuleActivatePermission(){
    if (this.form.valid) {
      this.loading = LoadingState.Processing;
      var in_time = this.form.value.in_time.hour+":"+this.form.value.in_time.minute+":00";
      var out_time = this.form.value.out_time.hour+":"+this.form.value.out_time.minute+":00";
      
      var date = new Date(this.form.value.date.year, this.form.value.date.month - 1, this.form.value.date.day)
      this.form.patchValue({
        date: date.toISOString(),
        in_time: in_time,
        out_time:out_time
      })

      this.employeesService.addEmployeesAttendance(this.form.value).subscribe(
        response => {
          this.toastr.success('Attendance added successfully', '', {
            timeOut: 3000,
          });
          this.loading = LoadingState.Ready;
          this.goToList('employees/attendance');
        },
        error => {
          this.loading = LoadingState.Ready;
          this.toastr.error('Something went wrong', '', {
            timeOut: 3000,
          });
        }
      );
    } else {
      Object.keys(this.form.controls).forEach(field => {
        const control = this.form.get(field);
        control.markAsTouched({ onlySelf: true });
      });
    }
  }

  reSet(){
    this.form.reset();
  }

  goToList(toNav) {
    this.router.navigateByUrl('/' + toNav);
  };

  btnClickNav(toNav) {
    this.router.navigateByUrl('/' + toNav);
  };

  isFieldValid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }

  displayFieldCss(field: string) {
    return {
      'is-invalid': !this.form.get(field).valid && this.form.get(field).touched,
      'is-valid': this.form.get(field).valid
    };
  }
}

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../../core/services/company.service';
import { StatesService } from '../../../core/services/states.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HelpService } from '../../../core/services/help.service';
import * as Globals from '../../../core/globals';
import { LoadingState } from '../../../core/component/loading/loading.component';

@Component({
  selector: 'app-project-add',
  templateUrl: './project-add.component.html',
  styleUrls: ['./project-add.component.scss']
})
export class ProjectAddComponent implements OnInit {

  @Output() showProjectList = new EventEmitter();

  companyProject;
  stateList;
  form: FormGroup;
  help_heading = "";
  help_description = "";
  loading: LoadingState = LoadingState.NotReady;
  constructor(
    private companyService: CompanyService,
    private statesService: StatesService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private helpService: HelpService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      project_name: [null, Validators.required],
      project_email: [null, [Validators.required, Validators.email]],
      project_contact_no: [null, Validators.required],
      project_address: [null, Validators.required],
      project_state: [null, Validators.required],
      project_city: [null, Validators.required],
      project_pincode: [null, Validators.required],
      project_gstin: [null, Validators.required],
      project_pan: [null, Validators.required],
      project_cin: [null, Validators.required]
    });
    this.companyProject = {
      project_name: '',
      project_email: '',
      project_contact_no: '',
      project_address: '',
      project_state: '',
      project_city: '',
      project_pincode: '',
      project_gstin: '',
      project_pan: '',
      project_cin: '',
      company: this.route.snapshot.params['id']
    };
    this.getStateList();
    this.getHelp();
  }

  getHelp() {
    this.helpService.getHelp().subscribe(res => {
      this.help_heading = res.data.projectAdd.heading;
      this.help_description = res.data.projectAdd.desc;
    })
  }

  addNewCompanyProject() {
    if (this.form.valid) {
      this.loading = LoadingState.Processing;
      this.companyService.addNewCompanyProject(this.companyProject).subscribe(
        response => {
          this.toastr.success('Project added successfully', '', {
            timeOut: 3000,
          });
          this.loading = LoadingState.Ready;
          this.showProjectList.emit();
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

  btnClickNav() {
    this.showProjectList.emit();
  };

  getStateList() {
    this.statesService.getStateActiveList().subscribe(
      (data: any[]) => {
        this.stateList = data;
        this.loading = LoadingState.Ready;
      },
      error => {
        this.loading = LoadingState.Ready;
        this.toastr.error('Something went wrong', '', {
          timeOut: 3000,
        });
      }
    );
  };

  reSet() {
    this.form.reset();
  }

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

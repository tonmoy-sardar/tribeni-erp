import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { PurchaseRequisitionService } from '../../../core/services/purchase-requisition.service';
import { CompanyService } from '../../../core/services/company.service';
import { ProjectService } from '../../../core/services/project.service';
import { MaterialGroupService } from '../../../core/services/material-group.service';
import { MaterialService } from '../../../core/services/material.service';
import { UomService } from '../../../core/services/uom.service';
import { ToastrService } from 'ngx-toastr';
import { HelpService } from '../../../core/services/help.service';
import * as Globals from '../../../core/globals';
import { LoadingState } from '../../../core/component/loading/loading.component';
import * as _ from "lodash";

@Component({
  selector: 'app-purchase-requisition-add',
  templateUrl: './purchase-requisition-add.component.html',
  styleUrls: ['./purchase-requisition-add.component.scss']
})
export class PurchaseRequisitionAddComponent implements OnInit {
  form: FormGroup;
  items: FormArray;
  UOMList = [];
  CompanyList = [];
  projectList: any = [];
  materialTypeList: any = [];
  MaterialList = [];
  companyBranchDropdownList = [];
  companyStorageDropdownList = [];
  companyStoragebinDropdownList = [];
  help_heading = "";
  help_description = "";
  loading: LoadingState = LoadingState.NotReady;
  constructor(
    private purchaseRequisitionService: PurchaseRequisitionService,
    private materialService: MaterialService,
    private companyService: CompanyService,
    private projectService: ProjectService,
    private materialGroupService: MaterialGroupService,
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private helpService: HelpService,
    private uomService: UomService
  ) { }


  ngOnInit() {    
    this.form = this.formBuilder.group({
      project: ['', Validators.required],
      company: ['', Validators.required],
      created_at: ['', Validators.required],
      special_note: ['', Validators.required],
      requisition_detail: this.formBuilder.array([this.createRequisitionDetail()])
    });

    //
    this.getUOMList();
    this.getCompanyList();
    this.getHelp();
  }

  getHelp() {
    this.helpService.getHelp().subscribe(res => {
      this.help_heading = res.data.purchaseRequisitionAdd.heading;
      this.help_description = res.data.purchaseRequisitionAdd.desc;
    })
  }

  getCompanyList() {
    this.companyService.getCompanyDropdownList().subscribe(
      (data: any[]) => {
        this.CompanyList = data;
        this.loading = LoadingState.Ready;
      },
      error => {
        this.loading = LoadingState.Ready;
        this.toastr.error('Something went wrong', '', {
          timeOut: 3000,
        });
      }
    );
  }

  getProjectListBycompany(id){
    this.projectService.getProjectListBycompany(id).subscribe(res => {
      this.projectList = res;
      console.log(res);
    })
  }

  getMaterialTypeListByProject(id){
    this.materialGroupService.getMaterialGroupListByProject(id).subscribe(res => {
      this.materialTypeList = res;
      console.log(res)
    })
  }

  getUOMList() {
    this.uomService.getUomListWithoutPagination().subscribe(
      (data: any[]) => {
        this.UOMList = data['results'];

      }
    );
  };   

  getMaterialListByMaterialTypeAndProject(id) {
    this.materialService.getMaterialListByMaterialTypeAndProject(id).subscribe(
      (data: any[]) => {
        this.MaterialList = data;
        console.log(this.MaterialList);
      }
    );
  }  

  changeCompany(id) {
    if (id > 0) {
      this.getProjectListBycompany(id);
    }
  }

  changePoject(id){
    if (id > 0) {
      this.getMaterialTypeListByProject(id);
    }
  }

  changeMaterialType(id){
    if (id > 0) {
      this.getMaterialListByMaterialTypeAndProject(id);
    }
  }

  createRequisitionDetail() {
    return this.formBuilder.group({
      material_type: ['', Validators.required],
      material: ['', Validators.required],
      quantity: ['', Validators.required],
      uom: ['', Validators.required]
    });
  }

  getRequisitionDetail(form) {
    return form.get('requisition_detail').controls
  }
  
  addRequisitionDetail() {
    const control = <FormArray>this.form.controls['requisition_detail'];
    control.push(this.createRequisitionDetail());
  }

  deleteRequisitionDetail(index: number) {
    const control = <FormArray>this.form.controls['requisition_detail'];
    control.removeAt(index);
  }

  btnClickNav(toNav) {
    this.router.navigateByUrl('/' + toNav);
  };

  addPurchaseRequisition() {
    if (this.form.valid) {
      this.loading = LoadingState.Processing;
      var requisition_all_detail = _.cloneDeep(this.form.value.requisition_detail)
      for (var i = 0; i < requisition_all_detail.length; i++) {
        var form_data = _.cloneDeep(this.form.value);
        form_data.requisition_detail = []
        form_data.requisition_detail[0] = requisition_all_detail[i];
        this.insertRequisition(form_data, i, requisition_all_detail.length)
      }

    } else {
      this.markFormGroupTouched(this.form)
    }

  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        control.controls.forEach(c => this.markFormGroupTouched(c));
      }
    });
  }

  insertRequisition(obj, i, n) {
    this.purchaseRequisitionService.addNewPurchaseRequisition(obj).subscribe(
      response => {
        if (i == n - 1) {
          this.toastr.success('Material added successfully', '', {
            timeOut: 3000,
          });
          this.loading = LoadingState.Ready;
          this.goToList('purchase-requisition');
        }
      },
      error => {
        this.loading = LoadingState.Ready;
        this.toastr.error('Something went wrong', '', {
          timeOut: 3000,
        });
      }
    )
  }

  goToList(toNav) {
    this.router.navigateByUrl('/' + toNav);
  };

  reSet() {
    this.form.reset();
  }
  isFieldValid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }
  displayFieldCss(field: string) {
    return {
      'is-invalid': this.form.get(field).invalid && (this.form.get(field).dirty || this.form.get(field).touched),
      'is-valid': this.form.get(field).valid && (this.form.get(field).dirty || this.form.get(field).touched)
    };
  }

  


}

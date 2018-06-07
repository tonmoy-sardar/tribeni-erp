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
  uomValueList: any = [];
  CompanyList = [];
  projectList: any = [];
  materialTypeList: any = [];
  MaterialList = [];
  dynamicMaterialList = [];
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

    this.uomValueList = [
      {
        id: ''
      }
    ]
   
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

  getProjectListBycompany(id) {
    this.projectService.getProjectListBycompany(id).subscribe(res => {
      this.projectList = res;
    })
  }

  getMaterialTypeListByProject(id) {
    this.materialGroupService.getMaterialGroupListByProject(id).subscribe(res => {
      this.materialTypeList = res;
    })
  }

  getUOMList() {
    this.uomService.getUomListWithoutPagination().subscribe(
      (data: any[]) => {
        this.UOMList = data;
      }
    );
  };

  getMaterialListByMaterialTypeAndProject(project_id, materialType_id) {
    this.materialService.getMaterialListByMaterialTypeAndProject(project_id, materialType_id).subscribe(
      (data: any[]) => {
        this.MaterialList = data;
        this.dynamicMaterialList.push(data)
      }
    );
  }

  changeCompany(id) {
    if (id > 0) {
      this.getProjectListBycompany(id);
    }
  }

  changePoject(id) {
    if (id > 0) {
      this.getMaterialTypeListByProject(id);
    }
  }

  changeMaterialType(id) {
    if (id > 0) {
      this.getMaterialListByMaterialTypeAndProject(this.form.value.project, id);
    }
  }

  changeMaterial(id, i) {
    this.materialService.getMaterialDetails(id).subscribe(res => {
      this.uomValueList[i]['id'] = res.material_uom[0].base_uom;
    })
  }

  createRequisitionDetail() {
    return this.formBuilder.group({
      material_type: ['', Validators.required],
      material: ['', Validators.required],
      quantity: ['', Validators.required],
      uom: [{ value: null, disabled: true }]
    });
  }

  getRequisitionDetail(form) {
    return form.get('requisition_detail').controls
  }

  addRequisitionDetail() {
    const control = <FormArray>this.form.controls['requisition_detail'];
    control.push(this.createRequisitionDetail());
    var d = { id: '' };
    this.uomValueList.push(d);
  }

  deleteRequisitionDetail(index: number) {
    const control = <FormArray>this.form.controls['requisition_detail'];
    control.removeAt(index);
    this.uomValueList.splice(index, 1)
    this.dynamicMaterialList.splice(index, 1)
  }

  btnClickNav(toNav) {
    this.router.navigateByUrl('/' + toNav);
  };

  addPurchaseRequisition() {
    if (this.form.valid) {
      this.loading = LoadingState.Processing;
      const requisition_detail_control = <FormArray>this.form.controls['requisition_detail'];
      for (var i = 0; i < this.uomValueList.length; i++) {
        var x = this.uomValueList[i]
        this.form.value.requisition_detail[i]['uom'] = x.id
      }
      var createdAt = new Date(this.form.value.created_at.year, this.form.value.created_at.month - 1, this.form.value.created_at.day)
      this.form.patchValue({
        created_at: createdAt.toISOString()
      })      
      this.purchaseRequisitionService.addNewPurchaseRequisition(this.form.value).subscribe(
        response => {
          this.toastr.success('Material added successfully', '', {
            timeOut: 3000,
          });
          this.loading = LoadingState.Ready;
          this.goToList('purchase-requisition');
        },
        error => {
          this.loading = LoadingState.Ready;
          this.toastr.error('Something went wrong', '', {
            timeOut: 3000,
          });
        }
      )

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

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, } from '@angular/forms';
import { CompanyService } from '../../../core/services/company.service';
import { PurchaseOrganizationService } from '../../../core/services/purchase-organization.service';
import { PurchaseGroupService } from '../../../core/services/purchase-group.service';
import { MaterialService } from '../../../core/services/material.service';
import { ToastrService } from 'ngx-toastr';
import { HelpService } from '../../../core/services/help.service';
import * as Globals from '../../../core/globals';
import { LoadingState } from '../../../core/component/loading/loading.component';

@Component({
  selector: 'app-material-add',
  templateUrl: './material-add.component.html',
  styleUrls: ['./material-add.component.scss']
})
export class MaterialAddComponent implements OnInit {
  material;
  materialTypeList = [];
  UOMList = [];
  purchaseGroupList = [];
  purchaseOrganizationList = [];
  form: FormGroup;
  is_taxable_value = false;
  help_heading = "";
  help_description = "";
  loading: LoadingState = LoadingState.NotReady;
  constructor(
    private materialService: MaterialService,
    private purchaseOrganizationService: PurchaseOrganizationService,
    private purchaseGroupService: PurchaseGroupService,
    private companyService: CompanyService,
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private helpService: HelpService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      material_type: ['', Validators.required],
      material_code: [null, Validators.required],
      material_fullname: [null, Validators.required],
      material_purchase_org: [null, Validators.required],
      material_purchase_grp: [null, Validators.required],
      description: [null, Validators.required],
      material_uom: this.formBuilder.array([this.createmMaterialUom(1)]),
      is_sales: [false],
      is_taxable: [false],
      material_tax: this.formBuilder.array([])
    });

    this.getUOMList();
    this.getMaterialTypeList();
    this.getPurchaseGroupActiveList();
    this.getPurchaseOrganizationActiveList();
    this.getHelp();
  }

  getHelp() {
    this.helpService.getHelp().subscribe(res => {
      this.help_heading = res.data.materialAdd.heading;
      this.help_description = res.data.materialAdd.desc;
    })
  }



  getMaterialUom(form) {
    return form.get('material_uom').controls
  }

  createmMaterialUom(for_id) {
    return this.formBuilder.group({
      material_for: for_id,
      base_uom: ['', Validators.required],
      unit_per_uom: ['', Validators.required],
      unit_uom: ['', Validators.required]
    });
  }

  addMaterialUom(id) {
    const control = <FormArray>this.form.controls['material_uom'];
    control.push(this.createmMaterialUom(id));
  }

  deleteMaterialUom(index: number) {
    const control = <FormArray>this.form.controls['material_uom'];
    control.removeAt(index);
  }

  showHideMaterialUOM(val) {
    if (val.currentTarget.checked) {
      this.addMaterialUom(2);
      if (this.form.value.is_taxable == true) {
        this.addMateriaTax(2);
      }
    }
    else {
      this.deleteMaterialUom(1);
      if (this.form.value.is_taxable == true) {
        this.deleteMaterialTax(1);
      }
    }
  }


  getMateriaTax(form) {
    return form.get('material_tax').controls
  }

  createmMaterialTax(for_id) {
    return this.formBuilder.group({
      tax_for: for_id,
      igst: ['', Validators.required],
      cgst: ['', Validators.required],
      sgst: ['', Validators.required],
      hsn: ['', Validators.required]
    });
  }

  addMateriaTax(id) {
    const control = <FormArray>this.form.controls['material_tax'];
    control.push(this.createmMaterialTax(id));
  }

  deleteMaterialTax(index: number) {
    const control = <FormArray>this.form.controls['material_tax'];
    control.removeAt(index);
  }

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }

  showHideMaterialTax(val) {
    if (val.currentTarget.checked) {
      this.addMateriaTax(1);
      if (this.form.value.is_sales == true) {
        this.addMateriaTax(2);
      }
      this.is_taxable_value = true;
    }
    else {
      const material_tax_control = <FormArray>this.form.controls['material_tax'];
      this.clearFormArray(material_tax_control);
      this.is_taxable_value = false;
    }
  }

  getMaterialTypeList() {
    this.materialService.getMaterialTypeList().subscribe(
      (data: any[]) => {
        this.materialTypeList = data['results'];

      }
    );
  }
  btnClickNav(toNav) {
    this.router.navigateByUrl('/' + toNav);
  };

  getUOMList() {
    this.companyService.getUOMList().subscribe(
      (data: any[]) => {
        this.UOMList = data['results'];
      }
    );
  };

  getPurchaseGroupActiveList() {
    this.purchaseGroupService.getPurchaseGroupActiveList().subscribe(
      (data: any[]) => {
        this.purchaseGroupList = data;

      }
    );
  }

  getPurchaseOrganizationActiveList() {
    this.purchaseOrganizationService.getPurchaseOrganizationActiveList().subscribe(
      (data: any[]) => {
        this.purchaseOrganizationList = data;
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

  getIgst(i) {
    const material_tax_control = <FormArray>this.form.controls['material_tax'];
    if (this.form.value.material_tax[i].cgst != "" && this.form.value.material_tax[i].sgst != "") {
      material_tax_control.at(i).patchValue({
        igst: parseFloat(this.form.value.material_tax[i].cgst) + parseFloat(this.form.value.material_tax[i].sgst)
      });
    }
  }


  addMaterial() {
    if (this.form.valid) {
      this.loading = LoadingState.Processing;
      let material_purchase_org_arr = [];
      this.form.value.material_purchase_org.forEach(x => {
        material_purchase_org_arr.push({ pur_org: x });
      })

      let material_purchase_grp_arr = [];
      this.form.value.material_purchase_grp.forEach(k => {
        material_purchase_grp_arr.push({ pur_group: k });
      })

      this.form.value.material_purchase_org = material_purchase_org_arr;
      this.form.value.material_purchase_grp = material_purchase_grp_arr;
      this.form.patchValue({
        material_purchase_org: material_purchase_org_arr,
        material_purchase_grp: material_purchase_grp_arr
      })
      this.materialService.addNewMaterial(this.form.value).subscribe(
        response => {
          this.toastr.success('Material added successfully', '', {
            timeOut: 3000,
          });
          this.loading = LoadingState.Ready;
          this.goToList('material');
        },
        error => {
          this.loading = LoadingState.Ready;
          this.toastr.error('Something went wrong', '', {
            timeOut: 3000,
          });
        }
      );
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

  displayFieldCss(field: string) {
    return {
      'is-invalid': this.form.controls[field].invalid && (this.form.controls[field].dirty || this.form.controls[field].touched),
      'is-valid': this.form.controls[field].valid && (this.form.controls[field].dirty || this.form.controls[field].touched)
    };
  }





}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PurchaseOrganizationService } from '../../core/services/purchase-organization.service';
import { ToastrService } from 'ngx-toastr';
import { HelpService } from '../../core/services/help.service';
import * as Globals from '../../core/globals';
import { LoadingState } from '../../core/component/loading/loading.component';

@Component({
  selector: 'app-purchase-organization',
  templateUrl: './purchase-organization.component.html',
  styleUrls: ['./purchase-organization.component.scss']
})
export class PurchaseOrganizationComponent implements OnInit {
  purchaseOrganizationList = [];
  totalPurchaseOrganizationList: number;
  defaultPagination: number;
  search_key = '';
  itemNo: number;
  help_heading = "";
  help_description = "";
  lower_count: number;
  upper_count: number;
  paginationMaxSize: number;
  itemPerPage: number;

  sort_by = '';
  sort_type = '';

  headerThOption = [];
  loading: LoadingState = LoadingState.NotReady;
  constructor(
    private purchaseOrganizationService: PurchaseOrganizationService,
    private router: Router,
    private toastr: ToastrService,
    private helpService: HelpService
  ) { }

  ngOnInit() {

    this.headerThOption = [
      {
        name: "Organization Name",
        code: "name",
        sort_type: ''
      },
      {
        name: "Organization Description",
        code: "description",
        sort_type: ''
      },
      {
        name: "Status",
        code: "status",
        sort_type: ''
      }
    ];

    this.itemNo = 0;
    this.defaultPagination = 1;
    this.paginationMaxSize = Globals.paginationMaxSize;
    this.itemPerPage = Globals.itemPerPage;
    this.getPurchaseOrganizationList();
    this.getHelp();
  }

  getHelp() {
    this.helpService.getHelp().subscribe(res => {
      this.help_heading = res.data.purchaseOrganization.heading;
      this.help_description = res.data.purchaseOrganization.desc;
    })
  }

  btnClickNav(toNav) {
    this.router.navigateByUrl('/' + toNav);
  };

  dataSearch() {
    this.loading = LoadingState.Processing;
    this.defaultPagination = 1;
    this.getPurchaseOrganizationList();
  }

  getPurchaseOrganizationList() {
    let params: URLSearchParams = new URLSearchParams();
    params.set('page', this.defaultPagination.toString());
    if (this.search_key != '') {
      params.set('search', this.search_key.toString());
    }
    if (this.sort_by != '') {
      params.set('field_name', this.sort_by.toString());
    }

    if (this.sort_type != '') {
      params.set('order_by', this.sort_type.toString());
    }
    this.purchaseOrganizationService.getPurchaseOrganizationList(params).subscribe(
      (data: any[]) => {
        this.purchaseOrganizationList = data['results'];
        this.totalPurchaseOrganizationList = data['count'];
        this.itemNo = (this.defaultPagination - 1) * this.itemPerPage;
        this.lower_count = this.itemNo + 1;

        if (this.totalPurchaseOrganizationList > this.itemPerPage * this.defaultPagination) {
          this.upper_count = this.itemPerPage * this.defaultPagination
        }
        else {
          this.upper_count = this.totalPurchaseOrganizationList
        }
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

  activePurchaseOrganization(id) {
    this.loading = LoadingState.Processing;
    let purchaseOrganization;

    purchaseOrganization = {
      id: id,
      status: true
    };
    this.purchaseOrganizationService.activeInactivePurchaseOrganization(purchaseOrganization).subscribe(
      response => {
        this.toastr.success('Status changed successfully', '', {
          timeOut: 3000,
        });
        this.getPurchaseOrganizationList();
      },
      error => {
        this.loading = LoadingState.Ready;
        this.toastr.error('Something went wrong', '', {
          timeOut: 3000,
        });
      }
    );
  };

  inactivePurchaseOrganization(id) {
    this.loading = LoadingState.Processing;
    let purchaseOrganization;

    purchaseOrganization = {
      id: id,
      status: false
    };

    this.purchaseOrganizationService.activeInactivePurchaseOrganization(purchaseOrganization).subscribe(
      response => {
        this.toastr.success('Status changed successfully', '', {
          timeOut: 3000,
        });
        this.getPurchaseOrganizationList();
      },
      error => {
        this.loading = LoadingState.Ready;
        this.toastr.error('Something went wrong', '', {
          timeOut: 3000,
        });
      }
    );
  };

  pagination() {
    this.loading = LoadingState.Processing;
    this.getPurchaseOrganizationList();
  };

  sortTable(value) {
    let type = '';
    this.headerThOption.forEach(function (optionValue) {
      if (optionValue.code == value) {
        if (optionValue.sort_type == 'desc') {
          type = 'asc';
        }
        else {
          type = 'desc';
        }
        optionValue.sort_type = type;
      }
      else {
        optionValue.sort_type = '';
      }
    });

    this.sort_by = value;
    this.sort_type = type;
    this.loading = LoadingState.Processing;
    this.defaultPagination = 1;
    this.getPurchaseOrganizationList();
  };

}

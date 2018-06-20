import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReverseGrnRoutingModule } from './reverse-grn-routing.module';
import { ReverseGrnComponent } from './reverse-grn.component';
import { ReverseGrnAddComponent } from './reverse-grn-add/reverse-grn-add.component';

// core
import {CoreModule} from "../../core/core.module";

@NgModule({
  imports: [
    CommonModule,
    ReverseGrnRoutingModule,
    CoreModule
  ],
  declarations: [ReverseGrnComponent, ReverseGrnAddComponent]
})
export class ReverseGrnModule { }

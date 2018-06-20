import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReverseGrnComponent } from './reverse-grn.component';
import { ReverseGrnAddComponent } from './reverse-grn-add/reverse-grn-add.component';

const routes: Routes = [
  {
    path: '',
    component: ReverseGrnComponent
  },
  {
    path: 'add',
    component: ReverseGrnAddComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReverseGrnRoutingModule { }

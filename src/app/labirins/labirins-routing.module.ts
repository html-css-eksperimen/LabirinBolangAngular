import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LabirinsComponent } from './labirins.component';

const routes: Routes = [
  { path: '', component: LabirinsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LabirinsRoutingModule { }

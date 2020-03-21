import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LabirinsRoutingModule } from './labirins-routing.module';
import { LabirinsComponent } from './labirins.component';


@NgModule({
  declarations: [LabirinsComponent],
  imports: [
    CommonModule,
    LabirinsRoutingModule
  ]
})
export class LabirinsModule { }

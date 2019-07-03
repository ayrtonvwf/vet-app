import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConsultationPage } from './consultation.page';
import { BrMaskerModule } from 'br-mask';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: ConsultationPage }]),
    ReactiveFormsModule,
    BrMaskerModule
  ],
  declarations: [ConsultationPage]
})
export class ConsultationPageModule {}

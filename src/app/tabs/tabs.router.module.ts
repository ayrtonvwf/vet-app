import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'vets',
        children: [
          {
            path: '',
            loadChildren: '../pages/vets/vets.module#VetsPageModule'
          }
        ]
      },
      {
        path: 'vet',
        children: [
          {
            path: '',
            loadChildren: '../pages/vet/vet.module#VetPageModule'
          },
          {
            path: ':id',
            loadChildren: '../pages/vet/vet.module#VetPageModule'
          }
        ]
      },
      {
        path: 'customers',
        children: [
          {
            path: '',
            loadChildren: '../pages/customers/customers.module#CustomersPageModule'
          }
        ]
      },
      {
        path: 'customer',
        children: [
          {
            path: '',
            loadChildren: '../pages/customer/customer.module#CustomerPageModule'
          },
          {
            path: ':id',
            loadChildren: '../pages/customer/customer.module#CustomerPageModule'
          }
        ]
      },
      {
        path: 'animals',
        children: [
          {
            path: '',
            loadChildren: '../pages/animals/animals.module#AnimalsPageModule'
          }
        ]
      },
      {
        path: 'animal',
        children: [
          {
            path: '',
            loadChildren: '../pages/animal/animal.module#AnimalPageModule'
          },
          {
            path: ':id',
            loadChildren: '../pages/animal/animal.module#AnimalPageModule'
          }
        ]
      },
      {
        path: 'consultations',
        children: [
          {
            path: '',
            loadChildren: '../pages/consultations/consultations.module#ConsultationsPageModule'
          }
        ]
      },
      {
        path: 'consultation',
        children: [
          {
            path: '',
            loadChildren: '../pages/consultation/consultation.module#ConsultationPageModule'
          },
          {
            path: ':id',
            loadChildren: '../pages/consultation/consultation.module#ConsultationPageModule'
          }
        ]
      },
      {
        path: 'cash',
        children: [
          {
            path: '',
            loadChildren: '../pages/cash/cash.module#CashPageModule'
          }
        ]
      },
    ]
  },
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}

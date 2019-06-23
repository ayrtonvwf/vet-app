import {Component} from '@angular/core';
import {CustomerModel} from '../../models/customer.model';
import {CustomerService} from '../../services/customer.service';

@Component({
  selector: 'app-customers',
  templateUrl: 'customers.page.html',
  styleUrls: ['customers.page.scss']
})
export class CustomersPage {

  customers: CustomerModel[] = [];

  showProgressBar = true;

  constructor(
      public customerService: CustomerService
  ) {}

  async ionViewDidEnter() {
    this.customers = await this.customerService.get();

    this.showProgressBar = false;
  }

  async delete(id: number) {
    this.showProgressBar = true;

    await this.customerService.delete(id);

    this.showProgressBar = false;
  }
}

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
      private customerService: CustomerService
  ) {}

  async ionViewDidEnter() {
    this.showProgressBar = true;

    await this.loadCustomers();

    this.showProgressBar = false;
  }

  async reload(event) {
    await Promise.all([
      this.customerService.load()
    ]);

    await this.ionViewDidEnter();

    event.target.complete();
  }

  private async loadCustomers() {
    this.customers = await this.customerService.get();
  }

  async delete(id: number) {
    this.showProgressBar = true;

    await this.customerService.delete(id);

    this.showProgressBar = false;
  }
}

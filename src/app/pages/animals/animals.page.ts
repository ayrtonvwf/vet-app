import {Component} from '@angular/core';
import {AnimalModel} from '../../models/animal.model';
import {AnimalService} from '../../services/animal.service';
import {CustomerService} from '../../services/customer.service';
import {CustomerModel} from '../../models/customer.model';

@Component({
  selector: 'app-animals',
  templateUrl: 'animals.page.html',
  styleUrls: ['animals.page.scss']
})
export class AnimalsPage {

  animals: AnimalModel[] = [];
  customers: CustomerModel[] = [];

  showProgressBar = true;

  constructor(
      private animalService: AnimalService,
      private customerService: CustomerService
  ) {}

  async ionViewDidEnter() {
    this.showProgressBar = true;

    await Promise.all([
      this.loadAnimals(),
      this.loadCustomers()
    ]);

    this.showProgressBar = false;
  }

  async reload(event) {
    await Promise.all([
      this.animalService.load(),
      this.customerService.load()
    ]);

    await this.ionViewDidEnter();

    event.target.complete();
  }

  private async loadAnimals() {
    this.animals = await this.animalService.get();
  }

  private async loadCustomers() {
    this.customers = await this.customerService.get();
  }

  async delete(id: number) {
    this.showProgressBar = true;

    await this.animalService.delete(id);

    this.showProgressBar = false;
  }

  customer(id: number) {
    return this.customers.find(customer =>
        customer.customerID === id
    );
  }
}

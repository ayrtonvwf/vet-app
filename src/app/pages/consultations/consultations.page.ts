import {Component} from '@angular/core';
import {ConsultationModel} from '../../models/consultation.model';
import {ConsultationService} from '../../services/consultation.service';
import {CustomerModel} from '../../models/customer.model';
import {AnimalModel} from '../../models/animal.model';
import {CustomerService} from '../../services/customer.service';
import {AnimalService} from '../../services/animal.service';

@Component({
  selector: 'app-consultations',
  templateUrl: 'consultations.page.html',
  styleUrls: ['consultations.page.scss']
})
export class ConsultationsPage {

  consultations: ConsultationModel[] = [];
  customers: CustomerModel[] = [];
  animals: AnimalModel[] = [];

  today = new Date().toISOString().slice(0, 10) + 'T00:00:00';

  showUnpaid = false;
  showExpired = false;
  showPaid = false;
  showScheduled = false;
  showDone = false;

  list: ConsultationModel[] = [];

  showProgressBar = true;

  constructor(
      private consultationService: ConsultationService,
      private customerService: CustomerService,
      private animalService: AnimalService
  ) {}

  async ionViewDidEnter() {
    this.showProgressBar = true;

    await Promise.all([
      this.loadAnimals(),
      this.loadConsultations(),
      this.loadCustomers()
    ]);

    this.loadList();

    this.showProgressBar = false;
  }

  async reload(event) {
    await Promise.all([
      this.animalService.load(),
      this.consultationService.load(),
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

  private async loadConsultations() {
    this.consultations = await this.consultationService.get();
  }

  private loadList() {
    this.list = this.consultations.filter(consultation =>
      (!this.showUnpaid || consultation.paidAt === null) &&
      (
        !this.showExpired || (
          consultation.paidAt === null &&
          consultation.paymentExpiration < this.today
        )
      ) &&
      (!this.showPaid || consultation.paidAt !== null) &&
      (!this.showScheduled || consultation.date > this.today) &&
      (!this.showDone || consultation.date <= this.today)
    );
  }

  async delete(id: number) {
    this.showProgressBar = true;

    await this.consultationService.delete(id);

    this.loadList();

    this.showProgressBar = false;
  }

  customer(id: number) {
    return this.customers.find(customer => customer.customerID === id);
  }

  customerOfAnimal(id: number) {
    const animal = this.animal(id);
    return this.customer(animal.customerID);
  }

  animal(id: number) {
    return this.animals.find(animal => animal.animalID === id);
  }

  localDate(date: string) {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  toggleFilterUnpaid() {
    this.showUnpaid = !this.showUnpaid;

    if (this.showUnpaid) {
      this.showPaid = false;
      this.showExpired = false;
    }

    this.loadList();
  }

  toggleFilterExpired() {
    this.showExpired = !this.showExpired;

    if (this.showExpired) {
      this.showPaid = false;
      this.showUnpaid = false;
    }

    this.loadList();
  }

  toggleFilterPaid() {
    this.showPaid = !this.showPaid;

    if (this.showPaid) {
      this.showUnpaid = false;
      this.showExpired = false;
    }

    this.loadList();
  }

  toggleFilterScheduled() {
    this.showScheduled = !this.showScheduled;

    if (this.showScheduled) {
      this.showDone = false;
    }

    this.loadList();
  }

  toggleFilterDone() {
    this.showDone = !this.showDone;

    if (this.showDone) {
      this.showScheduled = false;
    }

    this.loadList();
  }

  unsetFilters() {
    this.showPaid = false;
    this.showUnpaid = false;
    this.showExpired = false;
    this.showScheduled = false;
    this.showDone = false;

    this.loadList();
  }
}

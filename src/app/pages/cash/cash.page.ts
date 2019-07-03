import {Component} from '@angular/core';
import {ConsultationModel} from '../../models/consultation.model';
import {ConsultationService} from '../../services/consultation.service';
import {CustomerModel} from '../../models/customer.model';
import {AnimalModel} from '../../models/animal.model';
import {CustomerService} from '../../services/customer.service';
import {AnimalService} from '../../services/animal.service';

@Component({
  selector: 'app-cash',
  templateUrl: 'cash.page.html',
  styleUrls: ['cash.page.scss']
})
export class CashPage {

  consultations: ConsultationModel[] = [];
  customers: CustomerModel[] = [];
  animals: AnimalModel[] = [];

  year = new Date().getFullYear();
  month = (new Date().getMonth() + 1).toString().padStart(2, '0');
  lastDay = new Date(this.year, parseInt(this.month, 10), 0).getDate();

  today = new Date().toISOString().slice(0, 10) + 'T00:00:00';

  startDate: string;
  endDate: string;

  monthStart = `${this.year}-${this.month}-01T00:00:00`;
  monthEnd = `${this.year}-${this.month}-${this.lastDay}T00:00:00`;

  showUnpaid = false;
  showExpired = false;
  showPaid = true;

  list: ConsultationModel[] = [];

  previousBalance = 0;
  currentBalance = 0;

  showProgressBar = true;

  constructor(
      private consultationService: ConsultationService,
      private customerService: CustomerService,
      private animalService: AnimalService
  ) {}

  async ionViewDidEnter() {
    this.showProgressBar = true;

    this.startDate = this.monthStart;
    this.endDate = this.monthEnd;

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
        this.startDate <= consultation.date &&
        this.endDate >= consultation.date
    );

    this.previousBalance = this.consultations.reduce((prev, curr) =>
      curr.date < this.startDate && curr.paidAt !== null ? prev + curr.value : prev
    , 0);

    this.currentBalance = this.list.reduce((prev, curr) =>
        prev + curr.value
    , 0);
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

  localMoney(value: number) {
    return `R$ ${Intl.NumberFormat('pt-BR').format(value)}`;
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

  unsetFilters() {
    this.showPaid = true;
    this.showUnpaid = false;
    this.showExpired = false;

    this.startDate = this.monthStart;
    this.endDate = this.monthEnd;

    this.loadList();
  }
}

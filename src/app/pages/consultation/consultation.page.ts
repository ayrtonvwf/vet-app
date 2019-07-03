import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConsultationModel} from '../../models/consultation.model';
import {ConsultationService} from '../../services/consultation.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomerModel} from '../../models/customer.model';
import {CustomerService} from '../../services/customer.service';
import {AnimalModel} from '../../models/animal.model';
import {VetModel} from '../../models/vet.model';
import {AnimalService} from '../../services/animal.service';
import {VetService} from '../../services/vet.service';
import {PrescriptionService} from '../../services/prescription.service';
import {PrescriptionModel} from '../../models/prescription.model';

@Component({
  selector: 'app-consultation',
  templateUrl: 'consultation.page.html',
  styleUrls: ['consultation.page.scss']
})
export class ConsultationPage {

  consultation?: ConsultationModel;

  customers: CustomerModel[] = [];
  animals: AnimalModel[] = [];
  vets: VetModel[] = [];
  prescriptions: PrescriptionModel[] = [];

  showProgressBar = true;

  form: FormGroup;

  today = new Date().toISOString().slice(0, 10);

  constructor(
      private route: ActivatedRoute,
      private consultationService: ConsultationService,
      private customerService: CustomerService,
      private animalService: AnimalService,
      private vetService: VetService,
      private prescriptionService: PrescriptionService,
      private formBuilder: FormBuilder,
      private router: Router
  ) {
    this.form = formBuilder.group({
      date: [this.today, Validators.required],
      paymentExpiration: ['', Validators.required],
      value: ['', Validators.required],
      animalID: ['', Validators.required],
      vetID: ['', Validators.required],
      customerID: ['', Validators.required],
      paid: [true, Validators.required],
      description: ['', Validators.required],
      prescriptions: formBuilder.array([])
    });
  }

  async ionViewDidEnter() {
    this.showProgressBar = true;

    this.resetFormPrescriptions();

    const id = parseInt(this.route.snapshot.paramMap.get('id'), 10);

    await Promise.all([
        this.loadConsultation(id),
        this.loadCustomers(),
        this.loadVets(),
        this.loadPrescriptions()
    ]);

    if (id) {
      const animal = await this.animalService.getById(this.consultation.animalID);

      this.form.setValue({
        date: this.consultation.date,
        paymentExpiration: this.consultation.paymentExpiration,
        value: this.consultation.value.toString().replace('.', ','),
        animalID: this.consultation.animalID,
        vetID: this.consultation.vetID,
        customerID: animal.customerID,
        paid: this.consultation.paidAt !== null,
        description: this.consultation.description,
        prescriptions: []
      });

      this.prescriptions.forEach(prescription => {
        if (prescription.consultationID !== id) {
          return;
        }

        this.formPrescriptions.push(this.formBuilder.control(prescription.description, Validators.required));
      });
    }

    this.showProgressBar = false;
  }

  private async loadConsultation(id: number) {
    this.consultation = id ?
        await this.consultationService.getById(id) :
        new ConsultationModel();
  }

  private async loadCustomers() {
      this.customers = await this.customerService.get();
  }

  private async loadVets() {
      this.vets = await this.vetService.get();
  }

  private async loadPrescriptions() {
    this.prescriptions = await this.prescriptionService.get();
  }

  goBack() {
    return this.router.navigate(['/tabs/consultations']);
  }

  async save(value) {
    this.showProgressBar = true;

    this.consultation.date = value.date;
    this.consultation.paymentExpiration = value.paid ? this.today : value.paymentExpiration;
    this.consultation.value = parseFloat(value.value.replace(',', '.'));
    this.consultation.paidAt = value.paid ? (this.consultation.paidAt ? this.consultation.paidAt : this.today) : null;
    this.consultation.animalID = value.animalID;
    this.consultation.vetID = value.vetID;
    this.consultation.description = value.description;

    this.consultation = await this.consultationService.store(this.consultation);

    if (this.consultation.consultationID) {
      await Promise.all(
        this.prescriptions.filter(prescription =>
          prescription.consultationID === this.consultation.consultationID
        ).map(prescription =>
          this.prescriptionService.delete(prescription.prescriptionID)
        )
      );
    }

    await Promise.all(
      value.prescriptions.map(description =>
        this.prescriptionService.store({
          prescriptionID: undefined,
          description,
          consultationID: this.consultation.consultationID
        })
      )
    );

    this.form.reset();

    this.showProgressBar = false;

    return this.goBack();
  }

  async changeCustomer() {
    this.animals = [];

    const customerID = this.form.value.customerID;

    this.animals = await this.animalService.getByCustomerId(customerID);
  }

  get formPrescriptions() {
    return this.form.get('prescriptions') as FormArray;
  }

  resetFormPrescriptions() {
    while (this.formPrescriptions.controls.length) {
      this.formPrescriptions.removeAt(0);
    }
  }

  addPrescription() {
    this.formPrescriptions.push(this.formBuilder.control('', Validators.required));
  }

  removePrescription(index: number) {
    this.formPrescriptions.removeAt(index);
  }
}

import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AnimalModel} from '../../models/animal.model';
import {AnimalService} from '../../services/animal.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomerModel} from '../../models/customer.model';
import {CustomerService} from '../../services/customer.service';

@Component({
  selector: 'app-animal',
  templateUrl: 'animal.page.html',
  styleUrls: ['animal.page.scss']
})
export class AnimalPage {

  animal?: AnimalModel;

  customers: CustomerModel[] = [];

  showProgressBar = true;

  form: FormGroup;

  constructor(
      private route: ActivatedRoute,
      private animalService: AnimalService,
      private customerService: CustomerService,
      public formBuilder: FormBuilder,
      private router: Router
  ) {
    this.form = formBuilder.group({
      breed: new FormControl('', Validators.required),
      customerID: new FormControl('', Validators.required)
    });
  }

  async ionViewDidEnter() {
    const id = parseInt(this.route.snapshot.paramMap.get('id'), 10);

    this.animal = id ? await this.animalService.getById(id) : new AnimalModel();

    if (id) {
      this.form.setValue({
        breed: this.animal.breed,
        customerID: this.animal.customerID
      });
    }

    this.customers = await this.customerService.get();

    this.showProgressBar = false;
  }

  goBack() {
    return this.router.navigate(['/tabs/animals']);
  }

  async save(value) {
    this.showProgressBar = true;

    this.animal.breed = value.breed;
    this.animal.customerID = value.customerID;

    await this.animalService.store(this.animal);

    this.form.reset();

    this.showProgressBar = false;

    return this.goBack();
  }
}

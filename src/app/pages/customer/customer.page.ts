import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomerModel} from '../../models/customer.model';
import {CustomerService} from '../../services/customer.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-customer',
  templateUrl: 'customer.page.html',
  styleUrls: ['customer.page.scss']
})
export class CustomerPage {

  customer?: CustomerModel;

  showProgressBar = true;

  form: FormGroup;

  constructor(
      private route: ActivatedRoute,
      private customerService: CustomerService,
      public formBuilder: FormBuilder,
      private router: Router
  ) {
    this.form = formBuilder.group({
      name: new FormControl('', Validators.required)
    });
  }

  async ionViewDidEnter() {
    const id = parseInt(this.route.snapshot.paramMap.get('id'), 10);

    this.customer = id ? await this.customerService.getById(id) : new CustomerModel();

    if (id) {
      this.form.setValue({name: this.customer.name});
    }

    this.showProgressBar = false;
  }

  goBack() {
    return this.router.navigate(['/tabs/customers']);
  }

  async save(value) {
    this.showProgressBar = true;

    this.customer.name = value.name;

    await this.customerService.store(this.customer);

    this.form.reset();

    this.showProgressBar = false;

    return this.goBack();
  }
}

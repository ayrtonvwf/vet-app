import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {VetModel} from '../../models/vet.model';
import {VetService} from '../../services/vet.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-vet',
  templateUrl: 'vet.page.html',
  styleUrls: ['vet.page.scss']
})
export class VetPage {

  vet?: VetModel;

  showProgressBar = true;

  form: FormGroup;

  constructor(
      private route: ActivatedRoute,
      private vetService: VetService,
      public formBuilder: FormBuilder,
      private router: Router
  ) {
    this.form = formBuilder.group({
        name: new FormControl('', [Validators.required])
    });
  }

  async ionViewDidEnter() {
    const id = parseInt(this.route.snapshot.paramMap.get('id'), 10);

    this.vet = id ? await this.vetService.getById(id) : new VetModel();

    if (id) {
      this.form.setValue({name: this.vet.name});
    }

    this.showProgressBar = false;
  }

  goBack() {
    return this.router.navigate(['/tabs/vets']);
  }

  async save(value) {
    this.showProgressBar = true;

    this.vet.name = value.name;

    await this.vetService.store(this.vet);

    this.form.reset();

    this.showProgressBar = false;

    return this.goBack();
  }
}

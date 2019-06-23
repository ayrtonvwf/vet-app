import {Component} from '@angular/core';
import {VetService} from '../../services/vet.service';
import {VetModel} from '../../models/vet.model';

@Component({
  selector: 'app-vets',
  templateUrl: 'vets.page.html',
  styleUrls: ['vets.page.scss']
})
export class VetsPage {

  vets: VetModel[] = [];

  showProgressBar = true;

  constructor(
      public vetService: VetService
  ) {}

  async ionViewDidEnter() {
    this.vets = await this.vetService.get();

    this.showProgressBar = false;
  }

  async delete(id: number) {
    this.showProgressBar = true;

    await this.vetService.delete(id);

    this.showProgressBar = false;
  }
}

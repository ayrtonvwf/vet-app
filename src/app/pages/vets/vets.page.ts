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
      private vetService: VetService
  ) {}

  async ionViewDidEnter() {
    this.showProgressBar = true;

    await this.loadVets();

    this.showProgressBar = false;
  }

  async reload(event) {
    await Promise.all([
      this.vetService.load()
    ]);

    await this.ionViewDidEnter();

    event.target.complete();
  }

  private async loadVets() {
    this.vets = await this.vetService.get();
  }

  async delete(id: number) {
    this.showProgressBar = true;

    await this.vetService.delete(id);

    this.showProgressBar = false;
  }
}

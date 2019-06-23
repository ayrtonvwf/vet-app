import {Component} from '@angular/core';
import {AnimalModel} from '../../models/animal.model';
import {AnimalService} from '../../services/animal.service';

@Component({
  selector: 'app-animals',
  templateUrl: 'animals.page.html',
  styleUrls: ['animals.page.scss']
})
export class AnimalsPage {

  animals: AnimalModel[] = [];

  showProgressBar = true;

  constructor(
      public animalService: AnimalService
  ) {}

  async ionViewDidEnter() {
    this.animals = await this.animalService.get();

    this.showProgressBar = false;
  }

  async delete(id: number) {
    this.showProgressBar = true;

    await this.animalService.delete(id);

    this.showProgressBar = false;
  }
}

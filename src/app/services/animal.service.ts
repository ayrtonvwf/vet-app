import { Injectable } from '@angular/core';
import {AnimalModel} from '../models/animal.model';
import axios from 'axios';

@Injectable({
    providedIn: 'root'
})
export class AnimalService {

    loaded = false;

    items: AnimalModel[] = [];

    baseUrl = 'http://localhost:5000/api/animal/';

    constructor() { }

    private async create(animal: AnimalModel) {
        const response = await axios.post<AnimalModel>(this.baseUrl, animal);

        this.items.push(response.data);
    }

    private async load() {
        const response = await axios.get<AnimalModel[]>(this.baseUrl);
        this.items = response.data;
        this.loaded = true;
    }

    private async ensureLoaded() {
        if (this.loaded) {
            return;
        }

        await this.load();
    }

    async get() {
        await this.ensureLoaded();

        return this.items;
    }

    async getById(id: number) {
        const animal = await this.findId(id);

        if (animal) {
            return animal;
        }

        await this.load();

        return await this.findId(id);
    }

    async findId(id: number) {
        const items = await this.get();

        return items.find(animal => animal.animalID === id);
    }

    private async update(animal: AnimalModel) {
        await this.ensureLoaded();

        const response = await axios.put<AnimalModel>(`${this.baseUrl}${animal.animalID}`, animal);

        const index = this.items.findIndex(item => item.animalID === animal.animalID);

        this.items[index] = response.data;
    }

    async delete(id: number) {
        await this.ensureLoaded();

        await axios.delete(`${this.baseUrl}${id}`);

        const index = this.items.findIndex(item => item.animalID === id);

        this.items.splice(index, 1);
    }

    async store(animal: AnimalModel) {
        return animal.animalID ?
            await this.update(animal) :
            await this.create(animal);
    }
}

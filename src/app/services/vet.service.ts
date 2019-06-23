import { Injectable } from '@angular/core';
import {VetModel} from '../models/vet.model';
import axios from 'axios';

@Injectable({
    providedIn: 'root'
})
export class VetService {

    loaded = false;

    items: VetModel[] = [];

    baseUrl = 'http://localhost:5000/api/vet/';

    constructor() { }

    async create(vet: VetModel) {
        const response = await axios.post<VetModel>(this.baseUrl, vet);

        this.items.push(response.data);
    }

    private async load() {
        const response = await axios.get<VetModel[]>(this.baseUrl);
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
        const vet = this.findId(id);

        if (vet) {
            return vet;
        }

        await this.load();

        return await this.findId(id);
    }

    private async findId(id: number) {
        const items = await this.get();

        return items.find(vet => vet.vetID === id);
    }

    async update(vet: VetModel) {
        await this.ensureLoaded();

        const response = await axios.put<VetModel>(`${this.baseUrl}${vet.vetID}`, vet);

        const index = this.items.findIndex(item => item.vetID === vet.vetID);

        this.items[index] = response.data;
    }

    async delete(id: number) {
        await this.ensureLoaded();

        await axios.delete(`${this.baseUrl}${id}`);

        const index = this.items.findIndex(item => item.vetID === id);

        this.items.splice(index, 1);
    }

    async store(vet: VetModel) {
        return vet.vetID ?
            await this.update(vet) :
            await this.create(vet);
    }
}

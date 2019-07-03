import { Injectable } from '@angular/core';
import {PrescriptionModel} from '../models/prescription.model';
import axios from 'axios';

@Injectable({
    providedIn: 'root'
})
export class PrescriptionService {

    loaded = false;

    items: PrescriptionModel[] = [];

    baseUrl = 'http://localhost:5000/api/prescription/';

    constructor() { }

    async create(prescription: PrescriptionModel) {
        const response = await axios.post<PrescriptionModel>(this.baseUrl, prescription);

        this.items.push(response.data);
    }

    async load() {
        const response = await axios.get<PrescriptionModel[]>(this.baseUrl);
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
        const prescription = this.findId(id);

        if (prescription) {
            return prescription;
        }

        await this.load();

        return await this.findId(id);
    }

    private async findId(id: number) {
        const items = await this.get();

        return items.find(prescription => prescription.prescriptionID === id);
    }

    async getByConsultationId(consultationID: number) {
        const items = await this.get();

        return items.filter(prescription => prescription.consultationID === consultationID);
    }

    async update(prescription: PrescriptionModel) {
        await this.ensureLoaded();

        const response = await axios.put<PrescriptionModel>(`${this.baseUrl}${prescription.prescriptionID}`, prescription);

        const index = this.items.findIndex(item => item.prescriptionID === prescription.prescriptionID);

        this.items[index] = response.data;
    }

    async delete(id: number) {
        await this.ensureLoaded();

        await axios.delete(`${this.baseUrl}${id}`);

        const index = this.items.findIndex(item => item.prescriptionID === id);

        this.items.splice(index, 1);
    }

    async store(prescription: PrescriptionModel) {
        return prescription.prescriptionID ?
            await this.update(prescription) :
            await this.create(prescription);
    }
}

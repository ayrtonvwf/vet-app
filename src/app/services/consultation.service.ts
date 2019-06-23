import { Injectable } from '@angular/core';
import {ConsultationModel} from '../models/consultation.model';
import axios from 'axios';

@Injectable({
    providedIn: 'root'
})
export class ConsultationService {

    loaded = false;

    items: ConsultationModel[] = [];

    baseUrl = 'http://localhost:5000/api/consultation/';

    constructor() { }

    async create(consultation: ConsultationModel) {
        const response = await axios.post<ConsultationModel>(this.baseUrl, consultation);

        this.items.push(response.data);
    }

    private async load() {
        const response = await axios.get<ConsultationModel[]>(this.baseUrl);
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
        const consultation = await this.findId(id);

        if (consultation) {
            return consultation;
        }

        await this.load();

        return await this.findId(id);
    }

    async findId(id: number) {
        const items = await this.get();

        return items.find(consultation => consultation.consultationID === id);
    }

    async update(consultation: ConsultationModel) {
        await this.ensureLoaded();

        const response = await axios.put<ConsultationModel>(`${this.baseUrl}${consultation.consultationID}`, consultation);

        const index = this.items.findIndex(item => item.consultationID === consultation.consultationID);

        this.items[index] = response.data;
    }

    async delete(id: number) {
        await this.ensureLoaded();

        await axios.delete(`${this.baseUrl}${id}`);

        const index = this.items.findIndex(item => item.consultationID === id);

        this.items.splice(index, 1);
    }

    async store(consultation: ConsultationModel) {
        return consultation.consultationID ?
            await this.update(consultation) :
            await this.create(consultation);
    }
}

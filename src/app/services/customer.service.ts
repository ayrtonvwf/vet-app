import { Injectable } from '@angular/core';
import {CustomerModel} from '../models/customer.model';
import axios from 'axios';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {

    loaded = false;

    items: CustomerModel[] = [];

    baseUrl = 'http://localhost:5000/api/customer/';

    constructor() { }

    async create(customer: CustomerModel) {
        const response = await axios.post<CustomerModel>(this.baseUrl, customer);

        this.items.push(response.data);
    }

    async load() {
        const response = await axios.get<CustomerModel[]>(this.baseUrl);
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

    private async findId(id: number) {
        const items = await this.get();

        return items.find(customer => customer.customerID === id);
    }

    async getById(id: number): Promise<CustomerModel> {
        const customer = await this.findId(id);

        if (customer) {
            return customer;
        }

        await this.load();

        return await this.findId(id);
    }

    async update(customer: CustomerModel) {
        await this.ensureLoaded();

        const response = await axios.put<CustomerModel>(`${this.baseUrl}${customer.customerID}`, customer);

        const index = this.items.findIndex(item => item.customerID === customer.customerID);

        this.items[index] = response.data;
    }

    async delete(id: number) {
        await this.ensureLoaded();

        await axios.delete(`${this.baseUrl}${id}`);

        const index = this.items.findIndex(item => item.customerID === id);

        this.items.splice(index, 1);
    }

    async store(customer: CustomerModel) {
        return customer.customerID ?
            await this.update(customer) :
            await this.create(customer);
    }
}

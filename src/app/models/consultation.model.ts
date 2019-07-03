import {PrescriptionModel} from './prescription.model';

export class ConsultationModel {
    consultationID: number;
    date: string;
    paymentExpiration: string;
    description: string;
    value: number;
    paidAt?: string;
    animalID: number;
    vetID: number;
    prescriptions: PrescriptionModel[];
}

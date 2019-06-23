export class ConsultationModel {
    consultationID: number;
    date: string;
    paymentExpiration: string;
    value: number;
    paidAt?: string;
    animalID: number;
    vetID: number;
}

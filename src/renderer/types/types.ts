export interface Request {
  id: string;
  clientId: string;
  requestDate: string;
  deliveryDate: string;
  deadline: string;
  status: string;
  plan: string;
  fee: number;
  paymentMethod: string;
  paymentReceived: boolean;
  songName: string;
  notes: string;
}

export interface Client {
  id: string;
  name: string;
  contactInfo: string;
}

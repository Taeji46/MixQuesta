export interface Order {
  id: string;
  clientId: string;
  orderDate: string;
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
  xAccountId: string;
  otherContactInfo: string;
  notes: string;
}

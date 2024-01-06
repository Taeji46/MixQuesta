import { Order } from '../types/types';

interface ElectronWindow extends Window {
  db: {
    loadOrderList: () => Promise<Array<Order> | null>;
    storeOrderList: (orderList: Array<Order>) => Promise<void>;
    resetOrderList: () => Promise<void>;
  };
}

declare const window: ElectronWindow;

export const loadOrderList = async (): Promise<Array<Order> | null> => {
  const orderList = await window.db.loadOrderList();
  return orderList;
};

export const storeOrderList = async (
  orderList: Array<Order>,
): Promise<void> => {
  await window.db.storeOrderList(orderList);
};

export const resetOrderList = async (): Promise<void> => {
  await window.db.resetOrderList();
};

export const defaultOrder = {
  id: '',
  clientId: '',
  orderDate: '',
  deliveryDate: '',
  deadline: '',
  status: '',
  plan: '',
  fee: 0,
  paymentMethod: '',
  paymentReceived: false,
  songName: '',
  notes: '',
};

export const fetchOrderById = async (id: string): Promise<Order> => {
  const orderList = await loadOrderList();

  if (orderList) {
    const order = orderList.find((order) => String(order.id) === id);
    return order || defaultOrder;
  } else {
    return defaultOrder;
  }
};

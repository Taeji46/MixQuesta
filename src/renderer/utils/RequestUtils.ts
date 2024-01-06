import { Request } from '../types/types';

interface ElectronWindow extends Window {
  db: {
    loadRequestList: () => Promise<Array<Request> | null>;
    storeRequestList: (requestList: Array<Request>) => Promise<void>;
    resetRequestList: () => Promise<void>;
  };
}

declare const window: ElectronWindow;

export const loadRequestList = async (): Promise<Array<Request> | null> => {
  const requestList = await window.db.loadRequestList();
  return requestList;
};

export const storeRequestList = async (
  requestList: Array<Request>,
): Promise<void> => {
  await window.db.storeRequestList(requestList);
};

export const resetRequestList = async (): Promise<void> => {
  await window.db.resetRequestList();
};

export const defaultRequest = {
  id: '',
  clientId: '',
  requestDate: '',
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

export const fetchRequestById = async (id: string): Promise<Request> => {
  const requestList = await loadRequestList();

  if (requestList) {
    const request = requestList.find((request) => String(request.id) === id);
    return request || defaultRequest;
  } else {
    return defaultRequest;
  }
};

import { Request } from '../types/types';

interface ElectronWindow extends Window {
  db: {
    loadRequestList: () => Promise<Array<Request> | null>;
    storeRequestList: (todoList: Array<Request>) => Promise<void>;
    resetRequestList: () => Promise<void>;
  };
}

declare const window: ElectronWindow;

export const loadRequestList = async (): Promise<Array<Request> | null> => {
  const todoList = await window.db.loadRequestList();
  return todoList;
};

export const storeRequestList = async (
  todoList: Array<Request>,
): Promise<void> => {
  await window.db.storeRequestList(todoList);
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

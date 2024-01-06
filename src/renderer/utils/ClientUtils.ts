import { Client } from '../types/types';

interface ElectronWindow extends Window {
  db: {
    loadClientList: () => Promise<Array<Client> | null>;
    storeClientList: (clientList: Array<Client>) => Promise<void>;
    resetClientList: () => Promise<void>;
  };
}

declare const window: ElectronWindow;

export const loadClientList = async (): Promise<Array<Client> | null> => {
  const clientList = await window.db.loadClientList();
  return clientList;
};

export const storeClientList = async (
  clientList: Array<Client>,
): Promise<void> => {
  await window.db.storeClientList(clientList);
};

export const resetClientList = async (): Promise<void> => {
  await window.db.resetClientList();
};

export const defaultClient = {
  id: '',
  name: '',
  xAccountId: '',
  otherContactInfo: '',
  notes: '',
};

export const fetchClientById = async (id: string): Promise<Client> => {
  const clientList = await loadClientList();

  if (clientList) {
    const client = clientList.find((client) => String(client.id) === id);
    return client || defaultClient;
  } else {
    return defaultClient;
  }
};

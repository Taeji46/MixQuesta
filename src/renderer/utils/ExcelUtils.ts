import { Request, Client } from '../types/types';

interface ElectronWindow extends Window {
  db: {
    exportToExcel: (requestList: Array<Request>, clientList: Array<Client>) => Promise<void>;
    importFromExcel: () => Promise<Array<Request> | null>;
  };
}

declare const window: ElectronWindow;

export const exportToExcel = async (
  requestList: Array<Request>,
  clientList: Array<Client>,
): Promise<void> => {
  await window.db.exportToExcel(requestList, clientList);
};

export const importFromExcel = async (): Promise<Array<any> | null> => {
  const excelData = await window.db.importFromExcel();
  return excelData;
};
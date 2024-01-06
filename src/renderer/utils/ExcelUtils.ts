import { Order, Client } from '../types/types';

interface ElectronWindow extends Window {
  db: {
    exportToExcel: (orderList: Array<Order>, clientList: Array<Client>) => Promise<void>;
    importFromExcel: () => Promise<Array<Order> | null>;
  };
}

declare const window: ElectronWindow;

export const exportToExcel = async (
  orderList: Array<Order>,
  clientList: Array<Client>,
): Promise<void> => {
  await window.db.exportToExcel(orderList, clientList);
};

export const importFromExcel = async (): Promise<Array<any> | null> => {
  const excelData = await window.db.importFromExcel();
  return excelData;
};
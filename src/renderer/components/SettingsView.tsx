import MenuBar from './MenuBar';
import { Order, Client } from '../types/types';
import {
  loadOrderList,
  storeOrderList,
  resetOrderList,
} from '../utils/OrderUtils';
import {
  loadClientList,
  storeClientList,
  resetClientList,
} from '../utils/ClientUtils';
import {
  exportToExcel,
  importFromExcel,
} from '../utils/ExcelUtils';
import styles from '../styles/SettingsView.module.css';

const SettingsView = () => {
  const reflectsExcelData = () => {
    importFromExcel().then((importData) => {
      if (importData) {
        const orderList: Array<Order> = importData[0];
        const clientList: Array<Client> = importData[1];

        storeOrderList(orderList);
        storeClientList(clientList);
      }
    });
  };
  
  const ExecuteExportToExcel = () => {
    loadOrderList().then((orderList) => {
      if (orderList) {
        loadClientList().then((clientList) => {
          if (clientList) {
            exportToExcel(orderList, clientList);
          }
        });
      }
    });
  };

  return (
    <div className={styles.app_container}>
      <MenuBar />
      <div className={styles.settings_container}>
        <button className={styles.excel_io_button} onClick={reflectsExcelData}>
          <span>Excelデータからインポート</span>
        </button>
        <button className={styles.excel_io_button} onClick={ExecuteExportToExcel}>
          <span>Excelデータにエクスポート</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsView;

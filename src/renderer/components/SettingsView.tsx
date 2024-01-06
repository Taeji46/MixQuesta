import MenuBar from './MenuBar';
import { Request, Client } from '../types/types';
import {
  loadRequestList,
  storeRequestList,
  resetRequestList,
} from '../utils/RequestUtils';
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
        const requestList: Array<Request> = importData[0];
        const clientList: Array<Client> = importData[1];

        storeRequestList(requestList);
        storeClientList(clientList);
      }
    });
  };
  
  const ExecuteExportToExcel = () => {
    loadRequestList().then((requestList) => {
      if (requestList) {
        loadClientList().then((clientList) => {
          if (clientList) {
            exportToExcel(requestList, clientList);
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

import MenuBar from './MenuBar';
import {
  loadRequestList,
  storeRequestList,
  resetRequestList,
  exportToExcel,
  importFromExcel,
} from '../utils/RequestUtils';
import styles from '../styles/SettingsView.module.css';

const SettingsView = () => {
  const reflectsExcelData = () => {
    importFromExcel().then((requestList) => {
      if (requestList) {
        storeRequestList(requestList);
        exportToExcel(requestList);
      }
    });
  };

  return (
    <div className={styles.app_container}>
      <MenuBar />
      <div className={styles.settings_container}>
        <button className={styles.import_from_excel_button} onClick={reflectsExcelData}>
          <span>Excelデータからインポート</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsView;

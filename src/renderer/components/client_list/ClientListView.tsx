import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Client } from '../../types/types';
import {
  loadClientList,
  storeClientList,
  resetClientList,
} from '../../utils/ClientUtils';
import { v4 as uuidv4 } from 'uuid';
import MenuBar from '../MenuBar';
import styles from '../../styles/client_list/ClientListView.module.css';

const ClientListView = () => {
  const [maxHeight, setMaxHeight] = useState(window.innerHeight * 0.85);
  const [clientList, setClientList] = useState<Array<Client>>([]);

  useEffect(() => {
    loadClientList().then((clientList) => {
      if (clientList) {
        setClientList(clientList);
      }
    });

    const handleResize = () => {
      setMaxHeight(window.innerHeight * 0.85);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const navigate = useNavigate();

  const navigateToCreateNewClientView = () => {
    navigate('/create_new_client');
  }

  const handleRowClick = (clientId: string) => {
    const url = `/client_details/${clientId}`;
    navigate(url); // ページ遷移
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    return date.toLocaleDateString('ja-JP', options);
  };

  return (
    <div className={styles.app_container}>
      <MenuBar />
      <div className={styles.client_list_container}>
        <div style={{ maxHeight: `${maxHeight}px`, overflowY: 'auto', overflowX: 'hidden' }}>
          <table className={styles.client_list_table}>
            <thead>
              <tr>
                <th>顧客名</th>
                <th>Xアカウント</th>
                <th>その他連絡先</th>
              </tr>
            </thead>
            <tbody>
              {clientList
                .map((client) => (
                  <tr
                    key={client.id}
                    onClick={() => handleRowClick(client.id)}
                  >
                    <td>{client.name} 様</td>
                    <td>{client.xAccountId}</td>
                    <td>{client.otherContactInfo}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <button className={styles.create_client_button} onClick={navigateToCreateNewClientView}>
          <span>新規作成</span>
        </button>
      </div>
    </div>
  );
};

export default ClientListView;

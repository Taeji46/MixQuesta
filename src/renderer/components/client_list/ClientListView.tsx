import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from '../../types/types';
import { loadClientList } from '../../utils/ClientUtils';
import MenuBar from '../MenuBar';
import styles from '../../styles/client_list/ClientListView.module.css';

const ClientListView = () => {
  const [maxHeight, setMaxHeight] = useState(window.innerHeight * 0.85);
  const [clientList, setClientList] = useState<Array<Client>>([]);
  const [filteredClients, setFilteredClients] = useState<Array<Client>>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    loadClientList().then((loadedClientList) => {
      if (loadedClientList) {
        setClientList(loadedClientList);
        setFilteredClients(loadedClientList);
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
  };

  const handleRowClick = (clientId: string) => {
    const url = `/client_details/${clientId}`;
    navigate(url);
  };

  const handleSearchChange = (searchTerm: string) => {
    setSearchTerm(searchTerm);

    const filtered = clientList.filter((client) =>
      client.name.includes(searchTerm),
    );

    setFilteredClients(filtered);
  };

  return (
    <div className={styles.app_container}>
      <MenuBar />
      <div className={styles.client_list_container}>
        <div
          style={{
            maxHeight: `${maxHeight}px`,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <div className={styles.input_container}>
            <input
              type="text"
              placeholder="名前で絞り込み"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <table className={styles.client_list_table}>
            <thead>
              <tr>
                <th>顧客名</th>
                <th>Xアカウント</th>
                <th>その他連絡先</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} onClick={() => handleRowClick(client.id)}>
                  <td>{client.name} 様</td>
                  <td>@{client.xAccountId}</td>
                  <td>{client.otherContactInfo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          className={styles.create_client_button}
          onClick={navigateToCreateNewClientView}
        >
          <span>新規作成</span>
        </button>
      </div>
    </div>
  );
};

export default ClientListView;
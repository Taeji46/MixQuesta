import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Request, Client } from '../../types/types';
import { loadRequestList } from '../../utils/RequestUtils';
import { loadClientList } from '../../utils/ClientUtils';
import MenuBar from '../MenuBar';
import styles from '../../styles/request_list/RequestListView.module.css';

const RequestListView = () => {
  const [maxHeight, setMaxHeight] = useState(window.innerHeight * 0.85);
  const [requestList, setRequestList] = useState<Array<Request>>([]);
  const [clientList, setClientList] = useState<Array<Client>>([]);

  useEffect(() => {
    loadRequestList().then((requestList) => {
      if (requestList) {
        setRequestList(requestList);
      }
    });

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

  const navigateToCreateNewRequestView = () => {
    navigate('/create_new_request');
  };

  const handleRowClick = (requestId: string) => {
    const url = `/request_details/${requestId}`;
    navigate(url);
  };

  const getClientNameById = (clientId: string) => {
    const client = clientList.find((client) => client.id === clientId);
    return client ? `${client.name} 様` : '未選択';
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    return date.toLocaleDateString('ja-JP', options);
  };

  const getStatusClassName = (status: String) => {
    switch (status) {
      case '依頼受付':
        return 'status_requested';
      case '進行中':
        return 'status_in-progress';
      case '納品済':
        return 'status_delivered';
      default:
        return 'unknown_status';
    }
  };

  return (
    <div className={styles.app_container}>
      <MenuBar />
      <div className={styles.request_list_container}>
        <div
          style={{
            maxHeight: `${maxHeight}px`,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <table className={styles.request_list_table}>
            <thead>
              <tr>
                <th>顧客</th>
                <th>依頼日</th>
                <th>希望納期</th>
                <th>プラン</th>
                <th>進行状況</th>
              </tr>
            </thead>
            <tbody>
              {requestList
                ?.sort(
                  (a, b) =>
                    new Date(b.requestDate).getTime() -
                    new Date(a.requestDate).getTime(),
                )
                .map((request) => (
                  <tr
                    key={request.id}
                    onClick={() => handleRowClick(request.id)}
                  >
                    <td>{getClientNameById(request.clientId)}</td>
                    <td>{formatDate(new Date(request.requestDate))}</td>
                    <td>
                      {request.deadline === 'なし'
                        ? 'なし'
                        : formatDate(new Date(request.deadline))}
                    </td>
                    <td>{request.plan}</td>
                    <td>
                      <span
                        className={styles[getStatusClassName(request.status)]}
                      >
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <button
          className={styles.create_request_button}
          onClick={navigateToCreateNewRequestView}
        >
          <span>新規作成</span>
        </button>
      </div>
    </div>
  );
};

export default RequestListView;

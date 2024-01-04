import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Request } from '../../types/types';
import {
  loadRequestList,
  storeRequestList,
  resetRequestList,
  exportToExcel,
} from '../../utils/RequestUtils';
import { v4 as uuidv4 } from 'uuid';
import MenuBar from '../MenuBar';
import styles from '../../styles/request_list/RequestListView.module.css';

const RequestListView = () => {
  const [maxHeight, setMaxHeight] = useState(window.innerHeight * 0.85);
  const [requestList, setRequestList] = useState<Array<Request>>([]);

  useEffect(() => {
    loadRequestList().then((requestList) => {
      if (requestList) {
        setRequestList(requestList);
        exportToExcel(requestList);
      }
    });

    // resetRequestList();

    const handleResize = () => {
      setMaxHeight(window.innerHeight * 0.85);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const navigate = useNavigate();

  const handleRowClick = (requestId: string) => {
    const url = `/request_details/${requestId}`;
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

  const getStatusClassName = (status: String) => {
    switch (status) {
      case '依頼受付':
        return 'status-requested';
      case '進行中':
        return 'status-in-progress';
      case '納品済':
        return 'status-delivered';
      default:
        return 'unknown-status';
    }
  };

  return (
    <div className={styles.app_container}>
      <MenuBar />
      <div className={styles.request_list_container}>
        <div style={{ maxHeight: `${maxHeight}px`, overflowY: 'auto' }}>
          <table className={styles.request_list_table}>
            <thead>
              <tr>
                <th>顧客</th>
                <th>依頼日</th>
                <th>希望納期</th>
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
                    <td>{request.clientId} 様</td>
                    <td>{formatDate(new Date(request.requestDate))}</td>
                    <td>
                      {request.deadline === 'なし'
                        ? 'なし'
                        : formatDate(new Date(request.deadline))}
                    </td>
                    <td>
                      <span className={getStatusClassName(request.status)}>
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {/* <Link to="/create_new_request" className="add-request-button"> */}
        <Link to="/create_new_request" className={styles.button_solid007}>
          <span>新規作成</span>
        </Link>
      </div>
    </div>
  );
};

export default RequestListView;

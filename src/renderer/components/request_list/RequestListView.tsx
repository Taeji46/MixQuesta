import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Request } from '../../types/types';
import {
  loadRequestList,
  storeRequestList,
  resetRequestList,
} from '../../utils/RequestUtils';
import { v4 as uuidv4 } from 'uuid';
import MenuBar from '../MenuBar';
import RequestListItem from './RequestListItem';
import '../../styles/request_list/RequestListView.css';

const RequestListView = () => {
  const [clientId, setClientId] = useState<string>('');
  const [requestList, setRequestList] = useState<Array<Request>>([]);

  useEffect(() => {
    loadRequestList().then((requestList) => {
      if (requestList) {
        setRequestList(requestList);
      }
    });
    // resetRequestList();
  }, []);

  const onSubmit = () => {
    if (clientId !== '') {
      const newRequestList: Array<Request> = [
        {
          id: uuidv4(),
          clientId: clientId,
          requestDate: '2023-02-01',
          deliveryDate: '2023-03-01',
          deadline: '2023-04-01',
          status: '進行中',
          plan: 'フルコーラス',
          fee: 5000,
          paymentMethod: 'PayPal',
          paymentReceived: true,
          songName: 'Sample Song 2',
          notes: 'Another sample request in progress.',
        },
        ...requestList,
      ];
      setRequestList(newRequestList);
      storeRequestList(newRequestList);
      setClientId('');
    }
  };

  const navigate = useNavigate();

  const handleRowClick = (requestId: string) => {
    const url = `/request_details/${requestId}`;
    navigate(url); // ページ遷移
  };

  return (
    <div className="app-container">
      <MenuBar />
      <div className="request-list-container">
        <div className="input-field">
          <input
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          />
          <button onClick={onSubmit} className="add-request-button">
            追加
          </button>
        </div>

        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {/* <ul className="request-list">
            {requestList?.map((request) => {
              return (
                <Link key={request.id} to={`/request_details/${request.id}`}>
                  <RequestListItem key={request.id} request={request} />
                </Link>
              );
            })}
          </ul> */}
          <table>
            <thead>
              <tr>
                <th>顧客</th>
                <th>依頼日</th>
                <th>納期</th>
                <th>進行状況</th>
              </tr>
            </thead>
            <tbody>
              {requestList?.map((request) => (
                <tr key={request.id} onClick={() => handleRowClick(request.id)}>
                  <td>{request.clientId} 様</td>
                  <td>{request.requestDate}</td>
                  <td>{request.deadline}</td>
                  <td>{request.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RequestListView;

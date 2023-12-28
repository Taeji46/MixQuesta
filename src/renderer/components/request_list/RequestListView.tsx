import { useState, useEffect } from 'react';
import { Request } from '../../types/types';
import { loadRequestList, storeRequestList, resetRequestList } from '../../utils/RequestUtils';
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
          requestDate: '2023/02/01',
          deliveryDate: '2023/03/01',
          deadline: '2023/04/01',
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

  return (
    <div className="app-container">
      <MenuBar />
      <div className="container">
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
          <ul className="request-list">
            {requestList?.map((request) => {
              return <RequestListItem key={request.id} request={request} />;
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RequestListView
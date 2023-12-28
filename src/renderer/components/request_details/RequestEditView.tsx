import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Request } from '../../types/types';
import {
  loadRequestList,
  storeRequestList,
  fetchRequestById,
} from '../../utils/RequestUtils';
import MenuBar from '../MenuBar';
import RequestListView from '../request_list/RequestListView';
import '../../styles/request_details/RequestDetailsView.css';

const RequestDetailsView = () => {
  const [requestList, setRequestList] = useState<Array<Request>>([]);
  const { id } = useParams<{ id: string }>();
  const [clientId, setClientId] = useState<string>('');
  const [requestDate, setRequestDate] = useState<string>('');
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  const [deadline, setDeadline] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [plan, setPlan] = useState<string>('');
  const [fee, setFee] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [paymentReceived, setPaymentReceived] = useState<boolean>(false);
  const [songName, setSongName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  if (id) {
    useEffect(() => {
      loadRequestList().then((loadedRequestList) => {
        if (loadedRequestList) {
          setRequestList(loadedRequestList);
        }
      });

      fetchRequestById(id).then((request) => {
        setClientId(request.clientId);
        setRequestDate(request.requestDate);
        setDeliveryDate(request.deliveryDate);
        setDeadline(request.deadline);
        setStatus(request.status);
        setPlan(request.plan);
        setFee(request.fee);
        setPaymentMethod(request.paymentMethod);
        setPaymentReceived(request.paymentReceived);
        setSongName(request.songName);
        setNotes(request.notes);
      });
    }, [id]);
  }

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const onSave = () => {
    if (id) {
      const updatedRequest: Request = {
        id: id,
        clientId: clientId,
        requestDate: requestDate,
        deliveryDate: deliveryDate,
        deadline: deadline,
        status: status,
        plan: plan,
        fee: fee,
        paymentMethod: paymentMethod,
        paymentReceived: paymentReceived,
        songName: songName,
        notes: notes,
      };

      const updatedRequestList = requestList.map((request) =>
        request.id === id ? updatedRequest : request,
      );

      setRequestList(updatedRequestList);
      storeRequestList(updatedRequestList);
    }
  };

  return (
    <div className="app-container">
      <MenuBar />
      {/* <RequestListView /> */}
      <div className="request-details-container">
        <form>
          <label>
            顧客ID
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
          </label>

          <label>
            依頼日
            <input
              type="date"
              value={requestDate}
              onChange={(e) => setRequestDate(e.target.value)}
            />
          </label>

          <label>
            納品日
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
            />
          </label>

          <label>
            納期
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </label>

          <label>
            ステータス
            <input
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </label>

          <label>
            プラン
            <input
              type="text"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
            />
          </label>

          <label>
            料金
            <input
              type="number"
              value={fee}
              onChange={(e) => setFee(Number(e.target.value))}
            />
          </label>

          <label>
            支払い方法
            <input
              type="text"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </label>

          <label>
            支払い受領済み
            <input
              type="checkbox"
              checked={paymentReceived}
              onChange={(e) => setPaymentReceived(e.target.checked)}
            />
          </label>

          <label>
            曲名
            <input
              type="text"
              value={songName}
              onChange={(e) => setSongName(e.target.value)}
            />
          </label>

          <label>
            備考
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>
        </form>

        <button onClick={onSave}>保存</button>
      </div>
    </div>
  );
};

export default RequestDetailsView;

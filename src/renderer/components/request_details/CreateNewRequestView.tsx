import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Request } from '../../types/types';
import {
  loadRequestList,
  storeRequestList,
} from '../../utils/RequestUtils';
import MenuBar from '../MenuBar';
import styles from '../../styles/request_details/RequestDetailsView.module.css';

const CreateNewRequestView = () => {
  const [requestList, setRequestList] = useState<Array<Request>>([]);
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
  const [isEditing, setIsEditing] = useState<boolean>(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadRequestList().then((loadedRequestList) => {
      if (loadedRequestList) {
        setRequestList(loadedRequestList);
      }
    });

    setDeliveryDate('未納品');
    setDeadline('なし');
    setStatus('依頼受付');
    setPaymentReceived(false);
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    switch (type) {
      case 'text':
      case 'date':
        handleTextChange(name, value);
        break;
      case 'number':
        handleNumberChange(name, value);
        break;
      case 'checkbox':
        handleCheckboxChange(name);
        break;
      case 'select-one':
        handleSelectChange(name, value);
        break;
      default:
        break;
    }
  };

  const handleTextChange = (field: string, value: string) => {
    switch (field) {
      case 'clientId':
        setClientId(value);
        break;
      case 'requestDate':
        setRequestDate(value);
        break;
      case 'deliveryDate':
        setDeliveryDate(value);
        break;
      case 'deadline':
        setDeadline(value);
        break;
      case 'plan':
        setPlan(value);
        break;
      case 'paymentMethod':
        setPaymentMethod(value);
        break;
      case 'songName':
        setSongName(value);
        break;
      case 'notes':
        setNotes(value);
        break;
      default:
        break;
    }
  };

  const handleNumberChange = (field: string, value: string) => {
    switch (field) {
      case 'fee':
        setFee(Number(value));
        break;
      default:
        break;
    }
  };

  const handleCheckboxChange = (field: string) => {
    switch (field) {
      case 'paymentReceived':
        setPaymentReceived(!paymentReceived);
        break;
      default:
        break;
    }
  };

  const handleSelectChange = (field: string, value: string) => {
    switch (field) {
      case 'status':
        setStatus(value);
        break;
      default:
        break;
    }
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    return date.toLocaleDateString('ja-JP', options);
  };

  const getStatusClassName = () => {
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

  const onSubmit = () => {
    if (clientId !== '') {
      const newRequestList: Array<Request> = [
        {
          id: uuidv4(),
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
        },
        ...requestList,
      ];
      setRequestList(newRequestList);
      storeRequestList(newRequestList);

      navigate('/request_list')
    }
  };

  return (
    <div className={styles.app_container}>
      <MenuBar />
      <div className={styles.request_details_container}>
        <table className={styles.request_details_table}>
          <tbody>
            <tr>
              <th>顧客ID</th>
              <td>
                {isEditing ? (
                  <input
                    type="text"
                    name="clientId"
                    value={clientId}
                    onChange={handleInputChange}
                  />
                ) : (
                  clientId
                )}
              </td>
            </tr>
            <tr>
              <th>依頼日</th>
              <td>
                {isEditing ? (
                  <input
                    type="date"
                    name="requestDate"
                    value={requestDate}
                    onChange={handleInputChange}
                  />
                ) : (
                  formatDate(new Date(requestDate))
                )}
              </td>
            </tr>
            <tr>
              <th>納品日</th>
              <td>
                {isEditing ? (
                  <input
                    type="date"
                    name="deliveryDate"
                    value={deliveryDate}
                    onChange={handleInputChange}
                  />
                ) : (
                  formatDate(new Date(deliveryDate))
                )}
              </td>
            </tr>
            <tr>
              <th>希望納期</th>
              <td>
                {isEditing ? (
                  <input
                    type="date"
                    name="deadline"
                    value={deadline}
                    onChange={handleInputChange}
                  />
                ) : (
                  formatDate(new Date(deadline))
                )}
              </td>
            </tr>
            <tr>
              <th>進行状況</th>
              <td>
                {isEditing ? (
                  <select
                    name="status"
                    value={status}
                    onChange={handleInputChange}
                  >
                    <option value="依頼受付">依頼受付</option>
                    <option value="進行中">進行中</option>
                    <option value="納品済">納品済</option>
                  </select>
                ) : (
                  <span className={getStatusClassName()}>{status}</span>
                )}
              </td>
            </tr>
            <tr>
              <th>プラン</th>
              <td>
                {isEditing ? (
                  <input
                    type="text"
                    name="plan"
                    value={plan}
                    onChange={handleInputChange}
                  />
                ) : (
                  plan
                )}
              </td>
            </tr>
            <tr>
              <th>料金</th>
              <td>
                {isEditing ? (
                  <input
                    type="number"
                    name="fee"
                    value={fee}
                    onChange={handleInputChange}
                  />
                ) : (
                  fee
                )}{' '}
                円
              </td>
            </tr>
            <tr>
              <th>支払い方法</th>
              <td>
                {isEditing ? (
                  <input
                    type="text"
                    name="paymentMethod"
                    value={paymentMethod}
                    onChange={handleInputChange}
                  />
                ) : (
                  paymentMethod
                )}
              </td>
            </tr>
            <tr>
              <th>支払い</th>
              <td>
                {isEditing ? (
                  <input
                    type="checkbox"
                    name="paymentReceived"
                    checked={paymentReceived}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span className={paymentReceived ? 'yes' : 'no'}>
                    {paymentReceived ? '受領済' : '未受領'}
                  </span>
                )}
              </td>
            </tr>
            <tr>
              <th>曲名</th>
              <td>
                {isEditing ? (
                  <input
                    type="text"
                    name="songName"
                    value={songName}
                    onChange={handleInputChange}
                  />
                ) : (
                  songName
                )}
              </td>
            </tr>
            <tr>
              <th>備考</th>
              <td>
                {isEditing ? (
                  <input
                    type="text"
                    name="notes"
                    value={notes}
                    onChange={handleInputChange}
                  />
                ) : (
                  notes
                )}
              </td>
            </tr>
          </tbody>
        </table>
        <div className={styles.button_container}>
          {isEditing ? (
            <button className={styles.save_edit_button}>
              <span>保存</span>
            </button>
          ) : (
            <button className={styles.save_edit_button} onClick={handleEditClick}>
              <span>編集</span>
            </button>
          )}
        </div>
        <button className={styles.back_button} onClick={() => navigate(-1)}>
          <span>戻る</span>
        </button>
      </div>
    </div>
  );
};

export default CreateNewRequestView;

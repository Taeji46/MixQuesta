import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Order } from '../../types/types';
import { loadOrderList, storeOrderList } from '../../utils/OrderUtils';
import MenuBar from '../MenuBar';
import styles from '../../styles/order_details/OrderDetailsView.module.css';

const CreateNewOrderView = () => {
  const [orderList, setOrderList] = useState<Array<Order>>([]);
  const [clientId, setClientId] = useState<string>('');
  const [orderDate, setOrderDate] = useState<string>('');
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
  const [maxHeight, setMaxHeight] = useState(window.innerHeight * 0.8);

  useEffect(() => {
    loadOrderList().then((loadedOrderList) => {
      if (loadedOrderList) {
        setOrderList(loadedOrderList);
      }
    });

    setDeliveryDate('未納品');
    setDeadline('なし');
    setStatus('依頼受付');
    setPaymentReceived(false);

    const handleResize = () => {
      setMaxHeight(window.innerHeight * 0.8);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
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
      case 'textarea':
        handleTextChange(name, value);
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
      case 'orderDate':
        setOrderDate(value);
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
        return 'status_ordered';
      case '進行中':
        return 'status_in-progress';
      case '納品済':
        return 'status_delivered';
      default:
        return 'unknown_status';
    }
  };

  const onSubmit = () => {
    if (clientId !== '') {
      const newOrderList: Array<Order> = [
        {
          id: uuidv4(),
          clientId: clientId,
          orderDate: orderDate,
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
        ...orderList,
      ];
      setOrderList(newOrderList);
      storeOrderList(newOrderList);

      navigate('/order_list');
    }
  };

  return (
    <div className={styles.app_container}>
      <MenuBar />
      <div className={styles.order_details_container}>
        <div style={{ maxHeight: `${maxHeight}px`, overflowY: 'auto' }}>
          <table className={styles.order_details_table}>
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
                      name="orderDate"
                      value={orderDate}
                      onChange={handleInputChange}
                    />
                  ) : (
                    formatDate(new Date(orderDate))
                  )}
                </td>
              </tr>
              {status === '納品済' ? (
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
              ) : (
                <tr>
                  <th>納品日</th>
                  <td>未納</td>
                </tr>
              )}
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
                <th>受領</th>
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
                    <textarea
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
        </div>
        <div className={styles.button_container}>
          {isEditing ? (
            <button className={styles.save_edit_button} onClick={onSubmit}>
              <span>保存</span>
            </button>
          ) : (
            <button
              className={styles.save_edit_button}
              onClick={handleEditClick}
            >
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

export default CreateNewOrderView;

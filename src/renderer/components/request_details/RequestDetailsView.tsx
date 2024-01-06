import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Request, Client } from '../../types/types';
import {
  loadRequestList,
  storeRequestList,
  fetchRequestById,
} from '../../utils/RequestUtils';
import {
  loadClientList,
  storeClientList,
  fetchClientById,
} from '../../utils/ClientUtils';
import MenuBar from '../MenuBar';
import styles from '../../styles/request_details/RequestDetailsView.module.css';

const RequestDetailsView = () => {
  const [requestList, setRequestList] = useState<Array<Request>>([]);
  const [clientList, setClientList] = useState<Array<Client>>([]);

  const { id } = useParams<{ id: string }>();

  const [selectedClient, setSelectedClient] = useState<Client | undefined>(
    undefined,
  );

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

  const [hasDeadline, setHasDeadline] = useState<boolean>(true);

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [filteredClients, setFilteredClients] =
    useState<Array<Client>>(clientList);

  const navigate = useNavigate();
  const [maxHeight, setMaxHeight] = useState(window.innerHeight * 0.8);

  useEffect(() => {
    setFilteredClients(clientList);
  }, [clientList]);

  useEffect(() => {
    if (id) {
      loadRequestList().then((loadedRequestList) => {
        if (loadedRequestList) {
          setRequestList(loadedRequestList);
        }
      });

      loadClientList().then((loadedClientList) => {
        if (loadedClientList) {
          setClientList(loadedClientList);

          fetchRequestById(id).then((request) => {
            if (request && request.clientId) {
              const selectedClient = loadedClientList.find(
                (client) => client.id === request.clientId,
              );
              setSelectedClient(selectedClient);
            }
          });
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

      setHasDeadline(deadline === 'なし' ? false : true);

      const handleResize = () => {
        setMaxHeight(window.innerHeight * 0.8);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [id]);

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
      case 'hasDeadline':
        setHasDeadline(!hasDeadline);
        setDeadline(!hasDeadline ? '2024-01-01' : 'なし');
        break;
      default:
        break;
    }
  };

  const handleSelectChange = (field: string, value: string) => {
    switch (field) {
      case 'clientId':
        const selectedClient = clientList.find((client) => client.id === value);
        setSelectedClient(selectedClient);
        setClientId(value);
        break;
      case 'status':
        setStatus(value);
        setDeliveryDate(value === '納品済' ? '2024-01-01' : '未納');
        break;
      default:
        break;
    }
  };

  const handleSearchChange = (searchTerm: string) => {
    const filtered = clientList.filter((client) =>
      client.name.includes(searchTerm),
    );
    setFilteredClients(filtered);
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
        return 'status_requested';
      case '進行中':
        return 'status_in-progress';
      case '納品済':
        return 'status_delivered';
      default:
        return 'unknown_status';
    }
  };

  const onSave = () => {
    if (id && clientId !== '') {
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

      loadClientList().then((loadedClientList) => { // 2回目編集時にselectの要素をリセット
        if (loadedClientList) {
          setClientList(loadedClientList);
          setFilteredClients(loadedClientList);
        }
      });

      setRequestList(updatedRequestList);
      storeRequestList(updatedRequestList);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    const confirmDeletion = window.confirm('本当に削除しますか？');

    if (confirmDeletion) {
      storeRequestList(requestList.filter((request) => request.id !== id));
      navigate('/request_list');
    }
  };

  return (
    <div className={styles.app_container}>
      <MenuBar />
      <div className={styles.request_details_container}>
        <div style={{ maxHeight: `${maxHeight}px`, overflowY: 'auto' }}>
          <table className={styles.request_details_table}>
            <tbody>
              <tr>
                <th>顧客</th>
                <td>
                  {isEditing ? (
                    <div>
                      <select
                        name="clientId"
                        value={selectedClient?.id || ''}
                        onChange={(e) =>
                          handleSelectChange('clientId', e.target.value)
                        }
                      >
                        {filteredClients.length >= 0 ? (
                          <option value="">未選択</option>
                        ) : (null)}
                        {filteredClients.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="名前で絞り込み"
                        onChange={(e) => handleSearchChange(e.target.value)}
                      />
                    </div>
                  ) : selectedClient ? (
                    selectedClient.name + ' 様'
                  ) : (
                    '未選択'
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
            <button className={styles.delete_button} onClick={handleDelete}>
              <span>削除</span>
            </button>
          ) : null}
          {isEditing ? (
            <button className={styles.save_edit_button} onClick={onSave}>
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

export default RequestDetailsView;

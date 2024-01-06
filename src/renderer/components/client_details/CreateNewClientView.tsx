import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Client } from '../../types/types';
import { loadClientList, storeClientList } from '../../utils/ClientUtils';
import MenuBar from '../MenuBar';
import styles from '../../styles/client_details/ClientDetailsView.module.css';

const CreateNewClientView = () => {
  const [clientList, setClientList] = useState<Array<Client>>([]);
  const [name, setName] = useState<string>('');
  const [xAccountId, setXAccountId] = useState<string>('');
  const [otherContactInfo, setOtherContactInfo] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [isEditing, setIsEditing] = useState<boolean>(true);

  const navigate = useNavigate();
  const [maxHeight, setMaxHeight] = useState(window.innerHeight * 0.8);

  useEffect(() => {
    loadClientList().then((loadedClientList) => {
      if (loadedClientList) {
        setClientList(loadedClientList);
      }
    });

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
      case 'textarea':
        handleTextChange(name, value);
        break;
      default:
        break;
    }
  };

  const handleTextChange = (field: string, value: string) => {
    switch (field) {
      case 'name':
        setName(value);
        break;
      case 'xAccountId':
        setXAccountId(value);
        break;
      case 'otherContactInfo':
        setOtherContactInfo(value);
        break;
      case 'notes':
        setNotes(value);
        break;
      default:
        break;
    }
  };

  const onSubmit = () => {
    if (name !== '') {
      const newClientList: Array<Client> = [
        {
          id: uuidv4(),
          name: name,
          xAccountId: xAccountId,
          otherContactInfo: otherContactInfo,
          notes: notes,
        },
        ...clientList,
      ];
      setClientList(newClientList);
      storeClientList(newClientList);

      navigate('/client_list');
    }
  };

  return (
    <div className={styles.app_container}>
      <MenuBar />
      <div className={styles.client_details_container}>
        <div style={{ maxHeight: `${maxHeight}px`, overflowY: 'auto' }}>
          <table className={styles.client_details_table}>
            <tbody>
              <tr>
                <th>顧客名</th>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={name}
                      onChange={handleInputChange}
                    />
                  ) : (
                    name
                  )}
                </td>
              </tr>
              <tr>
                <th>Xアカウント</th>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      name="xAccountId"
                      value={xAccountId}
                      onChange={handleInputChange}
                    />
                  ) : (
                    xAccountId
                  )}
                </td>
              </tr>
              <tr>
                <th>その他連絡先</th>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      name="otherContactInfo"
                      value={otherContactInfo}
                      onChange={handleInputChange}
                    />
                  ) : (
                    otherContactInfo
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

export default CreateNewClientView;

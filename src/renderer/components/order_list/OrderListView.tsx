import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Order, Client } from '../../types/types';
import { loadOrderList } from '../../utils/OrderUtils';
import { loadClientList } from '../../utils/ClientUtils';
import MenuBar from '../MenuBar';
import styles from '../../styles/order_list/OrderListView.module.css';

const OrderListView = () => {
  const [maxHeight, setMaxHeight] = useState(window.innerHeight * 0.85);
  const [orderList, setOrderList] = useState<Array<Order>>([]);
  const [clientList, setClientList] = useState<Array<Client>>([]);

  useEffect(() => {
    loadOrderList().then((orderList) => {
      if (orderList) {
        setOrderList(orderList);
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

  const navigateToCreateNewOrderView = () => {
    navigate('/create_new_order');
  };

  const handleRowClick = (orderId: string) => {
    const url = `/order_details/${orderId}`;
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
        return 'status_ordered';
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
      <div className={styles.order_list_container}>
        <div
          style={{
            maxHeight: `${maxHeight}px`,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <table className={styles.order_list_table}>
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
              {orderList
                ?.sort(
                  (a, b) =>
                    new Date(b.orderDate).getTime() -
                    new Date(a.orderDate).getTime(),
                )
                .map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => handleRowClick(order.id)}
                  >
                    <td>{getClientNameById(order.clientId)}</td>
                    <td>{formatDate(new Date(order.orderDate))}</td>
                    <td>
                      {order.deadline === 'なし'
                        ? 'なし'
                        : formatDate(new Date(order.deadline))}
                    </td>
                    <td>{order.plan}</td>
                    <td>
                      <span
                        className={styles[getStatusClassName(order.status)]}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <button
          className={styles.create_order_button}
          onClick={navigateToCreateNewOrderView}
        >
          <span>新規作成</span>
        </button>
      </div>
    </div>
  );
};

export default OrderListView;

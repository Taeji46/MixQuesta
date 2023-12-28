import { Request } from '../../types/types';
import '../../styles/request_list/RequestListItem.css';

const RequestListItem = (props: { request: Request }) => {
  const { request } = props;

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    return date.toLocaleDateString('ja-JP', options);
  };

  const getStatusClassName = () => {
    switch (request.status) {
      case '依頼受付':
        return 'status-requested';
      case '進行中':
        return 'status-in-progress';
      case '納品済み':
        return 'status-delivered';
      default:
        return 'unknown-status';
    }
  };

  // return (
  //   <li>
  //     <div>
  //       <label>
  //         <span>顧客ID:</span>
  //         <span>{request.clientId}</span>
  //       </label>
  //     </div>
  //     <div>
  //       <label>
  //         <span>依頼日:</span>
  //         <span>{formatDate(new Date(request.requestDate))}</span>
  //       </label>
  //     </div>
  //     <div>
  //       <label>
  //         <span>納品日:</span>
  //         <span>{formatDate(new Date(request.deliveryDate))}</span>
  //       </label>
  //     </div>
  //     <div>
  //       <label>
  //         <span>納期:</span>
  //         <span>{formatDate(new Date(request.deadline))}</span>
  //       </label>
  //     </div>
  //     <div>
  //       <label>
  //         <span>進行状況:</span>
  //         <span>{request.progress}</span>
  //       </label>
  //     </div>
  //     <div>
  //       <label>
  //         <span>プラン:</span>
  //         <span>{request.plan}</span>
  //       </label>
  //     </div>
  //     <div>
  //       <label>
  //         <span>料金:</span>
  //         <span>{request.fee}</span>
  //       </label>
  //     </div>
  //     <div>
  //       <label>
  //         <span>支払い方法:</span>
  //         <span>{request.paymentMethod}</span>
  //       </label>
  //     </div>
  //     <div>
  //       <label>
  //         <span>受領:</span>
  //         <span>{request.paymentReceived ? 'Yes' : 'No'}</span>
  //       </label>
  //     </div>
  //     <div>
  //       <label>
  //         <span>曲名:</span>
  //         <span>{request.songName}</span>
  //       </label>
  //     </div>
  //     <div>
  //       <label>
  //         <span>備考:</span>
  //         <span>{request.notes}</span>
  //       </label>
  //     </div>
  //   </li>
  // );
  return (
    // <li>
    //   <div>
    //     <label>
    //       <span>{request.clientId}様</span>
    //     </label>
    //   </div>
    //   <div>
    //     <label>
    //       <span>進行状況:</span>
    //       <span className={getStatusClassName()}>{request.status}</span>
    //     </label>
    //   </div>
    //   <div>
    //     <label>
    //       <span>受領:</span>
    //       <span className={request.paymentReceived ? 'yes' : 'no'}>
    //         {request.paymentReceived ? '受領済' : '未受領'}
    //       </span>
    //     </label>
    //   </div>
    // </li>
    <tr>
      <td>{request.clientId}</td>
      <td>{request.clientId}</td>
      <td>{request.clientId}</td>
      <td>{request.clientId}</td>
    </tr>
  );
};

export default RequestListItem;

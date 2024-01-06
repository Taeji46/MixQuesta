import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import HomeView from '../components/HomeView';
import OrderListView from './order_list/OrderListView';
import OrderDetailsView from './order_details/OrderDetailsView';
import CreateNewOrderView from './order_details/CreateNewOrderView';
import ClientListView from './client_list/ClientListView';
import ClientDetailsView from './client_details/ClientDetailsView';
import CreateNewClientView from './client_details/CreateNewClientView';
import SettingsView from './SettingsView';

import '../styles/App.css'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/order_list" element={<OrderListView />} />
        <Route path="/order_details/:id" element={<OrderDetailsView />} />
        <Route path="/create_new_order" element={<CreateNewOrderView />} />
        <Route path="/client_list" element={<ClientListView />} />
        <Route path="/settings" element={<SettingsView />} />
        <Route path="/client_details/:id" element={<ClientDetailsView />} />
        <Route path="/create_new_client" element={<CreateNewClientView />} />
      </Routes>
    </Router>
  );
}
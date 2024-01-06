import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import HomeView from '../components/HomeView';
import RequestListView from './request_list/RequestListView';
import RequestDetailsView from './request_details/RequestDetailsView';
import CreateNewRequestView from './request_details/CreateNewRequestView';
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
        <Route path="/request_list" element={<RequestListView />} />
        <Route path="/request_details/:id" element={<RequestDetailsView />} />
        <Route path="/create_new_request" element={<CreateNewRequestView />} />
        <Route path="/client_list" element={<ClientListView />} />
        <Route path="/settings" element={<SettingsView />} />
        <Route path="/client_details/:id" element={<ClientDetailsView />} />
        <Route path="/create_new_client" element={<CreateNewClientView />} />
      </Routes>
    </Router>
  );
}
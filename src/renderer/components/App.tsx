import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import HomeView from '../components/HomeView';
import RequestListView from './request_list/RequestListView';
import RequestDetailsView from './request_details/RequestDetailsView';
import CreateNewRequestView from './request_details/CreateNewRequestView';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/request_list" element={<RequestListView />} />
        <Route path="/request_details/:id" element={<RequestDetailsView />} />
        <Route path="/create_new_request" element={<CreateNewRequestView />} />
      </Routes>
    </Router>
  );
}
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import HomeView from '../components/HomeView';
import RequestListView from './request_list/RequestListView';
import RequestDetailsView from './request_details/RequestDetailsView';
// import EditScreen from '../components/EditScreen';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/request_list" element={<RequestListView />} />
        {/* <Route path="/edit/:id" element={<EditScreen />} /> */}
        <Route path="/request_details/:id" element={<RequestDetailsView />} />
      </Routes>
    </Router>
  );
}
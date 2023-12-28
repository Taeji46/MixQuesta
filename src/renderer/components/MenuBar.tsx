import { Link } from 'react-router-dom';
import '../styles/MenuBar.css';

const MenuBar = () => {
  return (
    <div className="menu-bar">
      <Link to="/">Home</Link>
      <Link to="/request_list">Requests</Link>
      <Link to="/">Clients</Link>
    </div>
  );
};

export default MenuBar;
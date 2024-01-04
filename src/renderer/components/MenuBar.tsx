import { Link } from 'react-router-dom';
import styles from '../styles/MenuBar.module.css';

const MenuBar = () => {
  return (
    <div className={styles.menu_bar}>
      <Link to="/">Home</Link>
      <Link to="/request_list">Requests</Link>
      <Link to="/">Clients</Link>
      <Link to="/settings" className={styles.menu_bar_setting}>&#9881;</Link>
    </div>
  );
};

export default MenuBar;
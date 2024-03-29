import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/MenuBar.module.css';

const MenuBar = () => {
  return (
    <div>
      <div className={styles.menu_bar}>
      <Link to="/">ホーム</Link>
      <Link to="/order_list">依頼一覧</Link>
      <Link to="/client_list">顧客一覧</Link>
      <Link to="/settings" className={styles.menu_bar_setting}>&#9881;</Link>
      </div>
    </div>
  );
};

export default MenuBar;
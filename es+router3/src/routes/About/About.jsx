import React from 'react';
import { Link } from 'react-router';
import styles from './About.module.less';

export default class About extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.main}>
          <p className="test">About page</p>
          <Link to="/">Main</Link>
        </div>
      </div>
    );
  }
}

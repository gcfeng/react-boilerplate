import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './assets/logo.svg';
import styles from './Home.module.less';

export default class Home extends React.Component<any> {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.main}>
          <img src={Logo} alt="logo" className={styles.logo} />
          <p className="test">Hello React</p>
          <div>
            <span>Redux Value: {this.props.value}</span>
            <span className={styles.button} onClick={this.props.genValue}>
              Update
            </span>
          </div>
          <Link to="/about">About</Link>
        </div>
      </div>
    );
  }
}

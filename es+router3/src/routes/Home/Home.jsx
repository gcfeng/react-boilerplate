import React from 'react';
import Logo from './assets/logo.svg';
import styles from './Home.module.less';

export default class Home extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.main}>
          <img src={Logo} alt="logo" className={styles.logo} />
          <p className="test">Hello React</p>
          <div>Redux Value: {this.props.value}</div>
          <div className={styles.button} onClick={this.props.genValue}>
            Update
          </div>
        </div>
      </div>
    );
  }
}

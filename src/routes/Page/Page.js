import React from 'react';
import CMPage from '../../components/CMPage';
import styles from './Page.less';

export default class Page extends CMPage {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    }
  }

  _componentWillReceiveProps (nextProps) {
  }

  _onBackOrNext (params) {
    this._setState(params, () => {
      console.log('Fetch remote data...');
    });
  }

  render() {
    return (
      <div className={styles.container}>
        <p>{this.state.count}</p>
        <button onClick={this.increaseAsync}>Click</button>
      </div>
    );
  }

  increaseAsync = () => {
    this._setState({
      count: this.state.count + 1
    }, () => {
      this.changeUrl('/page', this.state);
      console.log('Fetch remote data...');
    })
  };
}

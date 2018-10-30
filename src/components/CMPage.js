import React from 'react';
import { addUrlParams } from './url';
import { browserHistory } from 'react-router';

export default class CMPage extends React.Component {
  componentDidMount () {
    this._mounted = true;
    let params = this.syncParamsFromURL(this.props);
    this.onParamsChange(params);
    this._componentDidMount && this._componentDidMount(...arguments);
  }

  componentWillUnmount () {
    this._componentWillUnmount && this._componentWillUnmount(...arguments);
    this._mounted = false;
  }

  componentWillReceiveProps (nextProps) {
    let params = this.syncParamsFromURL(nextProps);
    this.onParamsChange(params);
    this._componentWillReceiveProps && this._componentWillReceiveProps(nextProps);
  }

  render () {
    return null;
  }

  onParamsChange (params) {
    console.log('Active trigge url change: ', !!this.activeChange);
    if (!this.activeChange) {
      this._onBackOrNext && this._onBackOrNext(params);
    }
    this.activeChange = false;
  }

  syncParamsFromURL (props) {
    return Object.assign({}, (props.location || {}).query, props.params);
  }

  _setState () {
    if (this._mounted) {
      this.setState(...arguments);
    }
  }

  changeUrl(url, params) {
    this.activeChange = true; // Active trigge mark
    browserHistory.push(addUrlParams(url, params));
  }
}

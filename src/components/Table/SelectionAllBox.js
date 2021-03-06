/**
 * R91 2017/5/10
 * SelectionAllBox
 */

import React from 'react';
import { Checkbox } from '../../components/Form2/Checkbox';
import { noop } from './utils';
import styles from './index.less';

export default class SelectionAllBox extends React.Component {
  state = {
    checked: this.getCheckState(),
  };

  componentDidMount() {
    this.subscribe();
  }

  componentWillReceiveProps(nextProps) {
    this.setCheckState(nextProps);
  }

  componentWillUnmount() {
    this.unSubscribe();
    this.unSubscribe = null;
  }
  setCheckState(props) {
    const { changeState } = props;
    const checked = this.getCheckState(props);
    if (checked !== this.state.checked) {
      this.setState({ checked });
      if (changeState) changeState(checked);
    }
  }

  getCheckState(props) {
    const { data } = props || this.props;
    let checked;
    if (!data.length) {
      checked = false;
    } else {
      checked = this.checkSelection(data, 'every');
    }
    return checked;
  }
  unSubscribe = noop;
  subscribe() {
    const { store } = this.props;
    this.unSubscribe = store.subscribe(() => {
      this.setCheckState(this.props);
    });
  }
  checkSelection(data, type) {
    const { store, getRecordKey } = this.props;
    if (type === 'every' || type === 'some') {
      return data[type]((item, i) =>
        store.getState().selectedRowKeys.indexOf(getRecordKey(item, i)) >= 0);
    }
    return false;
  }
  handleSelectAll = (value) => {
    const { onSelect } = this.props;
    if (onSelect) onSelect(value ? 'all' : 'removeAll', value, null);
  };
  render() {
    const { disabled } = this.props;
    const { checked } = this.state;
    return (
      <Checkbox
        className={styles.selectAllBox}
        value={checked}
        disabled={disabled}
        onChange={this.handleSelectAll}
      />);
  }
}

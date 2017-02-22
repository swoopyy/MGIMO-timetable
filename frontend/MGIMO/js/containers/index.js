import React, {Component} from 'react';
import { StyleSheet } from 'react-native';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import Settings from '../components/settings';
import * as settingsActions from '../actions/settingsActions';

class Mgimo extends Component {
  render() {
    return (<Settings
      {...this.props.settingsReducer}
      {...this.props.settingsActions}/>);
  }
}

export default connect((state) => {return state},
  (dispatch) => ({
    settingsActions: bindActionCreators(settingsActions, dispatch),
  })
)(Mgimo);

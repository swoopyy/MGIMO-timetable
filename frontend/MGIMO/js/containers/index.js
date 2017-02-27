import React, {Component} from 'react';
import { StyleSheet, Platform } from 'react-native';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import Settings from '../components/settings';
import ControllerIOS from '../components/tabbarios';

import * as settingsActions from '../actions/settingsActions';
import * as tabBarActions from '../actions/tabBarActions';

class Mgimo extends Component {
  render() {
    if (Platform.OS === 'ios') {
      return (<ControllerIOS
                settingsProps={Object.assign(this.props.settingsReducer, this.props.settingsActions)}
                selectTab={this.props.tabBarActions.selectTab}
                selectedTab={this.props.tabBarReducer.selectedTab}
                />);
    } else {
      return (<Settings
        {...this.props.settingsReducer}
        {...this.props.settingsActions}/>);
    }
  }
}

export default connect((state) => {return state},
  (dispatch) => ({
    settingsActions: bindActionCreators(settingsActions, dispatch),
    tabBarActions: bindActionCreators(tabBarActions, dispatch),
  })
)(Mgimo);

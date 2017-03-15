import React, {Component} from 'react';
import {StyleSheet, Platform} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Settings from '../components/settings';
import ControllerIOS from '../components/tabbarios';

import * as settingsActions from '../actions/settingsActions';
import * as tabBarActions from '../actions/tabBarActions';
import * as sdkActions from '../actions/sdkActions';

class Mgimo extends Component {
    render() {
        if (Platform.OS === 'ios') {
            return (<ControllerIOS
                settingsProps={Object.assign(this.props.settingsReducer, this.props.settingsActions)}
                selectTab={this.props.tabBarActions.selectTab}
                selectedTab={this.props.tabBarReducer.selectedTab}
                sdkReducer={this.props.sdkReducer}
                sdkActions={this.props.sdkActions}
            />);
        } else {
            return (<Settings
                {...this.props.settingsReducer}
                {...this.props.sdkReducer}
                {...this.props.sdkActions}
                {...this.props.settingsActions}/>);
        }
    }
}

export default connect((state) => {
        return state
    },
    (dispatch) => ({
        settingsActions: bindActionCreators(settingsActions, dispatch),
        tabBarActions: bindActionCreators(tabBarActions, dispatch),
        sdkActions: bindActionCreators(sdkActions, dispatch),
    })
)(Mgimo);

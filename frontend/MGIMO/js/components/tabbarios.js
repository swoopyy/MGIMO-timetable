import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  TabBarIOS,
  Text,
  View,
} from 'react-native';
import Settings from './settings';
import Timetable from './timetable';
import Icon from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default class ControllerIOS extends Component {
  static propTypes = {
    settingsProps: PropTypes.object,
    timetableProps: PropTypes.object,
    selectTab: PropTypes.func,
    selectedTab: PropTypes.string,
  }

  _renderContent() {
    if (this.props.selectedTab === 'settings') {
      return (<Settings
                {...this.props.settingsProps}
                {...this.props.sdkActions}
                {...this.props.sdkReducer}
                />);
    } else if (this.props.selectedTab === 'timetable') {
      return (<Timetable
                {...this.props.sdkActions}
                {...this.props.sdkReducer}
                />);
    }
  }

  render() {
    return (
      <TabBarIOS
          unselectedTintColor="#8e8e93"
          tintColor="#007AFF"
          barTintColor="#efeff4">
          <Icon.TabBarItem
            title="Расписaние"
            iconName="ios-school-outline"
            selectedIconName="ios-school"
            selected={this.props.selectedTab === 'timetable'}
            onPress={() => this.props.selectTab('timetable')}>
            {this._renderContent()}
          </Icon.TabBarItem>
          <Icon.TabBarItem
            title="Параметры"
            iconName="ios-list-box-outline"
            selectedIconName="ios-list-box"
            selected={this.props.selectedTab === 'settings'}
            onPress={() => this.props.selectTab('settings')}>
            {this._renderContent()}
          </Icon.TabBarItem>
        </TabBarIOS>
      );
  }
}

/**
 * Created by denissamohvalov on 18.03.17.
 */

import React, { Component, PropTypes } from 'react';
import {
    StyleSheet,
    TabBarIOS,
    Text,
    View,
    TouchableWithoutFeedback,
    Navigator
} from 'react-native';
import Settings from './settings';
import Timetable from './timetable';
import Icon from 'react-native-vector-icons/Ionicons';
import {mainColor} from '../constants';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    tabBarContainer: {
        height: 44,
        elevation: 3,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconText: {
        fontSize: 10,
    }

});

export default class NavigationAndroid extends Component {
    static propTypes = {
        settingsProps: PropTypes.object,
        timetableProps: PropTypes.object,
        selectTab: PropTypes.func,
        selectedTab: PropTypes.string,
    };

    _renderContent = (route, navigator)  => {
        if (route.name === 'settings') {
            return (
                <Settings
                    selectedTab={this.props.selectedTab}
                    navigator={navigator}
                    {...this.props.settingsProps}
                    {...this.props.sdkActions}
                    {...this.props.sdkReducer}/>);
        } else if (route.name === 'timetable') {
            return (
                <Timetable
                    selectedTab={this.props.selectedTab}
                    navigator={navigator}
                    {...this.props.sdkActions}
                    {...this.props.sdkReducer}/>);
        }
    };

    _getColor = (isSelected) => {
        if (isSelected) {
            return mainColor;
        } else {
            return "#8e8e93";
        }
    };

    _isUser = () => {
      return  this.props.settingsProps.academic_group;
    };

    componentDidMount() {
        if (this.props.selectedTab === 'settings') {
            this._configureScene = (route, routeStack) => Navigator.SceneConfigs.SwipeFromLeft;
        } else {
            this._configureScene = (route, routeStack) => Navigator.SceneConfigs.FloatFromRight;
        }
    }
    render() {
        const {selectedTab, selectTab} = this.props;
        const timetableColor = this._getColor(selectedTab === "timetable");
        const settingsColor = this._getColor(selectedTab === "settings");
        return (
            <View style={styles.container}>
                <Navigator
                    initialRoute={{name: selectedTab}}
                    configureScene={this._configureScene}
                    renderScene={this._renderContent}/>
                <View style={styles.tabBarContainer}>
                    <TouchableWithoutFeedback onPress={() => {if (this._isUser()) selectTab('timetable')}}>
                        <View style={styles.iconContainer}>
                            <Icon name="md-school" size={25} color={timetableColor}/>
                            <Text style={[styles.iconText, {color: timetableColor}]}>Расписание</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => selectTab('settings')}>
                        <View style={styles.iconContainer}>
                            <Icon name="md-list-box" size={25} color={settingsColor}/>
                            <Text style={[styles.iconText, {color: settingsColor}]}>Настройки</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        );
    }
}

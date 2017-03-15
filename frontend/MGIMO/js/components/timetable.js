import React, {Component, PropTypes} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Button,
    ScrollView,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import * as constants from '../constants';
import {enhanceTimetable, getRussianName} from '../utils/utils';
const containerMargin = 20;

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
        backgroundColor: constants.backgroundColor,
    },
    container: {
        flex: 1,
        marginTop: containerMargin,
        marginLeft: containerMargin,
        marginRight: containerMargin,
        borderWidth: 1,
        backgroundColor: 'white',
        borderColor: constants.mainColor,
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
        backgroundColor: constants.mainColor,
    },
    headerText: {
        fontSize: 17,
        color: 'white'
    },
    timetable: {
        flex: 1,
    },
    centering: {
        flex: 1,
        backgroundColor: constants.backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    classContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    classNumber: {
        flex: 0.15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: constants.mainColor,
        opacity: 0.6,
        borderWidth: 0.5,
        borderColor: constants.backgroundColor,

    },
    classTextNumber: {
        color: 'white',
        fontSize: 17,
    },
    classInfo: {
        flex: 0.85,
        padding: 3,
        justifyContent: 'flex-start',
    },
    windowInfo: {
        flex: 0.85,
        justifyContent: 'flex-start',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 3,
        paddingRight: 3,
    },
    windowText: {
        color: 'black',
        opacity: 0.87,
        fontSize: 17,
    },
    noClasses: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    noClassesText: {
        fontSize: 17,
        opacity: 0.87,
    },
    seminarOrLectionContainer: {
        alignSelf: 'flex-start',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 1,
        borderRadius: 15,
        overflow: 'hidden'
    },
    seminarOrLectionText: {
        marginLeft: 4,
        marginRight: 4,
        marginTop: 2,
        marginBottom: 2,
        color: 'white',
    },
    nameText: {
        color: 'black',
        fontSize: 16,
        opacity: 0.87,
    },
    professor: {
        color: 'black',
        fontSize: 14,
        opacity: 0.54,
    },
    room: {
        color: constants.mainColor,
        fontSize: 14,
    }

});
export default class Timetable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
        };
    }

    static propTypes = {
        get_timetable: PropTypes.func,
        timetable: PropTypes.object,
        is_internet: PropTypes.bool,
    }

    componentWillMount() {
        this.props.get_timetable(false);
    }

    scrollTo() {
        let dayOfWeek = new Date().getDay();
        if (dayOfWeek === 7) {
            dayOfWeek = 1;
        }
        let day = constants.daysOfWeek[dayOfWeek - 1];
        this.refs[day].measure((fx, fy, width, height, px, py) => {
                this.refs.scroll.scrollTo({
                    x: px - containerMargin,
                    y: py - containerMargin,
                    animated: true,
                });
            }
        );
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.timetable) {
            this.setState({refreshing: false});
            setTimeout(this.scrollTo.bind(this), 500);
        }
    }

    _getSeminarOrLectionColor(type) {
        if (type === 'Семинар') {
            return constants.seminarColor;
        } else if (type === 'Лекция') {
            return constants.lectionColor;
        } else {
            return 'transparent';
        }
    }

    _getDays(timetable) {
        return timetable.map((x, index) =>
            <View style={styles.container} ref={constants.daysOfWeek[index]}>
                <View style={styles.header}>
                    <Text style={styles.headerText}> {constants.daysOfWeek[index]}</Text>
                </View>
                {this._getClasses(x)}
                <View style={styles.timetable}/>
            </View>
        );
    }


    _getClasses(day) {
        return day.map((x, index) =>
            <View>
                {x.noClasses &&
                    <View style={styles.noClasses}>
                        <Text style={styles.noClassesText}>Нет пар</Text>
                    </View>
                }
                {!x.noClasses &&
                    <View style={styles.classContainer}>
                        <View style={styles.classNumber}>
                            <Text style={styles.classTextNumber}>{constants.romainanNumbers[index]}</Text>
                        </View>

                        {!x.window &&
                        <View style={styles.classInfo}>
                            <View style={[
                            styles.seminarOrLectionContainer,
                            {backgroundColor: this._getSeminarOrLectionColor(x.type)}
                          ]}>
                                <Text style={styles.seminarOrLectionText}>{x.type || '—'}</Text>
                            </View>
                            <Text style={styles.nameText}>{getRussianName(x.name) || '—'}</Text>
                            <Text style={styles.professor}>{x.professor_name || '—'}</Text>
                            <Text style={styles.room}>Аудитория: {x.room || '—'}</Text>
                        </View>}
                        {x.window &&
                        <View style={styles.windowInfo}>
                            <Text style={styles.windowText}>Нет пары</Text>
                        </View>
                        }
                    </View>
                }
            </View>
        );
    }

    _onRefresh() {
        const {get_timetable} = this.props;
        this.setState({refreshing: true});
        get_timetable(false, true);
    }

    render() {
        const {timetable} = this.props;
        if (!timetable && !this.state.refreshing) {
            return <ActivityIndicator
                style={[styles.centering, {transform: [{scale: 1.5}]}]}
                size="large"
            />
        }
        let enhancedTimetable = enhanceTimetable(timetable);
        const days = this._getDays(enhancedTimetable);
        return (
            <ScrollView
                ref="scroll"
                automaticallyAdjustContentInsets={false}
                contentInset={{bottom:49}}
                style={styles.scroll}
                refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh.bind(this)}
                  title="Обновление..."
                />
            }>
                {days}
            </ScrollView>
        );
    }
}

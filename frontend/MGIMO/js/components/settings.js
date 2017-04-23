import React, {Component, PropTypes} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Platform,
    Picker,
    TextInput,
    Image,
    Button,
    ActivityIndicator,
} from 'react-native';
import ModalPicker from 'react-native-modal-picker';
import * as constants from '../constants';
let tree = require('../assets/tree1.json');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: constants.backgroundColor,
    },
    activityContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: constants.backgroundColor,
    },
    textInput: {
        borderWidth: 1,
        borderColor: constants.mainColor,
        borderRadius: 10,
        padding: 10,
        height: 40
    },
    modalPicker: {
        marginTop: 30,
        height: 40,
        width: 300,
        marginRight: 8,
        marginLeft: 8,
    },

    button: {
        marginTop: 20,
        marginRight: 8,
        marginLeft: 8,
    },

    itemStyle: {
        marginBottom: 15,
        height: 40,
        width: 300,
    }
});


export default class Settings extends Component {
    static propTypes = {
        program: PropTypes.string,
        faculty: PropTypes.string,
        department: PropTypes.string,
        course: PropTypes.string,
        academic_group: PropTypes.string,
        lang_group: PropTypes.string,
        selectProgram: PropTypes.func,
        selectFaculty: PropTypes.func,
        selectDepartment: PropTypes.func,
        selectCourse: PropTypes.func,
        selectGroup: PropTypes.func,
        selectAcademicGroup: PropTypes.func,
        selectLangGroup: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            program: [],
            faculty: [],
            department: [],
            course: [],
            academic_group: [],
            lang_group: [],
        }
    }

    componentDidMount() {
        this._setInitialState(tree); //todo

        //  this.props.getTree();
    }

    componentWillReceiveProps(nextProps){
        //if (nextProps.tree) {
         //   this._setInitialState(tree); //todo
      //  }
    }

    _setInitialState(_tree) {
        const {program, faculty, department, course, academic_group} = this.props;
        this.setState({program: this._extractOptions(_tree)});

        if (program) {
            _tree = _tree[program];
            this.setState({faculty: this._extractOptions(_tree)});
        }

        if (faculty) {
            _tree = _tree[faculty];
            this.setState({department: this._extractOptions(_tree)});
        }

        if (department) {
            _tree = _tree[department];
            this.setState({course: this._extractOptions(_tree)});
        }

        if (course) {
            _tree = _tree[course];
            this.setState({academic_group: this._extractOptions(_tree)});
        }

        if (academic_group) {
            _tree = _tree[academic_group]
            this.setState({lang_group: this._extractOptions(_tree)});
        }
    }

    _extractOptions = (tree) => {
        if (Platform.OS === 'android') {
            var out = [{key: '0', label: 'Не выбрано'}];
        } else {
            var out = [];
        }
        for (var key in tree) {
            if (key !== 'name') {
                out.push({key: key, label: tree[key].name});
            }
        }
        return out;
    }

    _getTree = (props) => {
        let out = tree;
        const {program, faculty, department, course, academic_group, lang_group} = props;
        if (program) {
            out = out[program];
        }

        if (faculty) {
            out = out[faculty];
        }

        if (department) {
            out = out[department];
        }

        if (course) {
            out = out[course];
        }

        if (academic_group) {
            out = out[academic_group];
        }
        if (lang_group) {
            out = out[lang_group];
        }

        return out;
    }

    componentWillReceiveProps(props) {
        const {navigator} = props;
        if (props.selectedTab === 'timetable' && this.props.selectedTab !== 'timetable') {
            let routes = navigator.getCurrentRoutes();
            if (routes.length > 1) {
                navigator.pop();
            } else {
                navigator.push({name: 'timetable'});
            }
        }
        const {program, faculty, department, course, group, academic_group, lang_group} = props;
        if (!faculty) {
            let options = this._extractOptions(this._getTree(props));
            this.setState({faculty: options});
            return;
        }

        if (!department) {
            let options = this._extractOptions(this._getTree(props));
            this.setState({department: options});
            return;
        }

        if (!course) {
            let options = this._extractOptions(this._getTree(props));
            this.setState({course: options});
            return;
        }

        if (!academic_group) {
            let options = this._extractOptions(this._getTree(props));
            this.setState({academic_group: options});
            return;
        }

        if (!lang_group) {
            let options = this._extractOptions(this._getTree(props));
            this.setState({lang_group: options});
            return;
        }
    }

    getLabel = (key, data) => {
        if (data === null) {
            return null;
        }
        for (var i = 0; i < data.length; ++i) {
            let item = data[i];
            if (item.key === key) {
                return item.label;
            }
        }
    }

    renderAndroid = () => {
        const {program, faculty, department, course, academic_group, lang_group} = this.props;
        let user = {program, faculty, department, course, academic_group, lang_group};
        const {
            selectProgram, selectFaculty, selectDepartment, selectCourse,
            selectAcademicGroup, selectLangGroup, save_and_register, deselectAll,
            reset_timetable, get_timetable, is_loading
        } = this.props;
        if(is_loading) {
            return (
                <View style={styles.activityContainer}>
                    <ActivityIndicator color={constants.mainColor} animating={true} size="large"/>
                    <Text>Загружаем дерево...</Text>
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <Picker
                    style={styles.itemStyle}
                    selectedValue={program}
                    onValueChange={(x) => selectProgram(x)}>
                    {this.state.program.map((item) => <Picker.Item key={item.key} label={item.label}
                                                                   value={item.key}/>)}
                </Picker>
                {program && program !== '0' &&
                <Picker
                    style={styles.itemStyle}
                    selectedValue={faculty}
                    onValueChange={(x) => selectFaculty(x)}>
                    {this.state.faculty.map((item) => <Picker.Item key={item.key} label={item.label}
                                                                   value={item.key}/>)}
                </Picker>}
                {faculty && faculty !== '0' &&
                <Picker
                    style={styles.itemStyle}
                    selectedValue={department}
                    onValueChange={(x) => selectDepartment(x)}>
                    {this.state.department.map((item) => <Picker.Item key={item.key} label={item.label}
                                                                      value={item.key}/>)}
                </Picker>}
                {department && department !== '0' &&
                <Picker
                    style={styles.itemStyle}
                    selectedValue={course}
                    onValueChange={(x) => selectCourse(x)}>
                    {this.state.course.map((item) => <Picker.Item key={item.key} label={item.label} value={item.key}/>)}
                </Picker>}
                {course && course !== '0' &&
                <Picker
                    style={styles.itemStyle}
                    selectedValue={academic_group}
                    onValueChange={(x) => selectAcademicGroup(x)}>
                    {this.state.academic_group.map((item) => <Picker.Item key={item.key} label={item.label}
                                                                          value={item.key}/>)}
                </Picker>}
                {academic_group && academic_group !== '0' &&
                <Picker
                    style={styles.itemStyle}
                    selectedValue={lang_group}
                    onValueChange={(x) => {
                            selectLangGroup(x);
                            save_and_register({...user, lang_group: x});
                            reset_timetable();
                            setTimeout(() => get_timetable(false), 2000);}}>
                    {this.state.lang_group.map((item) => <Picker.Item key={item.key} label={item.label} value={item.key}/>)}
                </Picker>}
                {lang_group && lang_group !== '0' &&
                    <View style={styles.button}>
                        <Button
                            style={styles.button}
                            onPress={() => {deselectAll(); }}
                            title="Сбросить"
                            color="#ff3b30"/>
                    </View>
                }
            </View>
        );
    };

    renderIos = () =>  {
        const {program, faculty, department, course, academic_group, lang_group} = this.props;
        let user = {program, faculty, department, course, academic_group, lang_group};
        const {
            selectProgram, selectFaculty, selectDepartment, selectCourse,
            selectAcademicGroup, selectLangGroup, save_and_register, deselectAll,
            reset_timetable, get_timetable
        } = this.props;
        return (
            <View style={styles.container}>
                <ModalPicker
                    style={styles.modalPicker}
                    data={this.state.program}
                    onChange={(x) => selectProgram(x.key)}>
                    <TextInput
                        style={styles.textInput}
                        editable={false}
                        placeholder="Вид программы"
                        value={this.getLabel(program, this.state.program)}/>
                </ModalPicker>
                {program &&
                <ModalPicker
                    style={styles.modalPicker}
                    initValue={"Факультет"}
                    data={this.state.faculty}
                    onChange={(x) => selectFaculty(x.key)}>
                    <TextInput
                        style={styles.textInput}
                        editable={false}
                        placeholder="Факультет"
                        value={this.getLabel(faculty, this.state.faculty)}/>
                </ModalPicker>}
                {faculty &&
                <ModalPicker
                    style={styles.modalPicker}
                    initValue={"Отделение"}
                    data={this.state.department}
                    onChange={(x) => selectDepartment(x.key)}>
                    <TextInput
                        style={styles.textInput}
                        editable={false}
                        placeholder="Отделение"
                        value={this.getLabel(department, this.state.department)}/>
                </ModalPicker>}
                {department &&
                <ModalPicker
                    style={styles.modalPicker}
                    initValue={"Курс"}
                    data={this.state.course}
                    onChange={(x) => selectCourse(x.key)}>
                    <TextInput
                        style={styles.textInput}
                        editable={false}
                        placeholder="Курс"
                        value={this.getLabel(course, this.state.course)}/>
                </ModalPicker>}
                {course &&
                <ModalPicker
                    style={styles.modalPicker}
                    initValue={"Академическая группа"}
                    data={this.state.academic_group}
                    onChange={(x) => selectAcademicGroup(x.key)}>
                    <TextInput
                        style={styles.textInput}
                        editable={false}
                        placeholder="Академическая группа"
                        value={this.getLabel(academic_group, this.state.academic_group)}/>
                </ModalPicker>}
                {academic_group &&
                <ModalPicker
                    style={styles.modalPicker}
                    initValue={"Языковая группа"}
                    data={this.state.lang_group}
                    onChange={(x) => {
                selectLangGroup(x.key);
                save_and_register({...user, lang_group: x.key});
                reset_timetable();
                setTimeout(() => get_timetable(false), 2000);
              }}>
                    <TextInput
                        style={styles.textInput}
                        editable={false}
                        placeholder="Языковая группа"
                        value={this.getLabel(lang_group, this.state.lang_group)}/>
                </ModalPicker>}
                {lang_group &&
                    <View style={styles.button}>
                        <Button
                            style={styles.button}
                            onPress={() => {deselectAll(); }}
                            title="Сбросить"
                            color="#ff3b30"/>
                    </View>}
            </View>
        );
    }

    render() {
        if (Platform.OS === 'ios') {
            return this.renderIos();
        } else {
            return this.renderAndroid();
        }
    }
}

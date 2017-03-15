import React, {Component, PropTypes} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Platform,
    Picker,
    TextInput,
    Image,
    Button
} from 'react-native';
import ModalPicker from 'react-native-modal-picker';
import {mainColor, backgroundColor} from '../constants';
const tree = require('../assets/tree1');

const styles = StyleSheet.create({
    conatainer: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        width: null,
        height: null,
        resizeMode: 'contain',
        backgroundColor: backgroundColor
    },
    textInput: {
        borderWidth: 1,
        borderColor: mainColor,
        borderRadius: 10,
        padding: 10,
        height: 40
    },
    modalPicker: {
        marginTop: 30,
        marginRight: 8,
        marginLeft: 8,
    },

    button: {
        marginTop: 30,
        marginRight: 8,
        marginLeft: 8,
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
    }

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

    componentWillMount() {
        this._setInitialState();
    }

    _setInitialState() {
        let _tree = tree;
        const {program, faculty, department, course, academic_group, lang_group} = this.props;
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

    _extractOptions(tree) {
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

    _getTree(props) {
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

    getLabel(key, data) {
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

    renderAndroid() {
        const {program, faculty, department, course, group, academic_group, lang_group} = this.props;
        const {
            selectProgram, selectFaculty, selectDepartment, selectCourse,
            selectAcademicGroup, selectLangGroup
        } = this.props;
        return (
            <View style={styles.container}>
                <Picker
                    selectedValue={program}
                    onValueChange={(x) => selectProgram(x)}>
                    {this.state.program.map((item) => <Picker.Item key={item.key} label={item.label}
                                                                   value={item.key}/>)}
                </Picker>
                {program &&
                <Picker
                    selectedValue={faculty}
                    onValueChange={(x) => selectFaculty(x)}>
                    {this.state.faculty.map((item) => <Picker.Item key={item.key} label={item.label}
                                                                   value={item.key}/>)}
                </Picker>}
                {faculty &&
                <Picker
                    selectedValue={department}
                    onValueChange={(x) => selectDepartment(x)}>
                    {this.state.department.map((item) => <Picker.Item key={item.key} label={item.label}
                                                                      value={item.key}/>)}
                </Picker>}
                {department &&
                <Picker
                    selectedValue={course}
                    onValueChange={(x) => selectCourse(x)}>
                    {this.state.course.map((item) => <Picker.Item key={item.key} label={item.label} value={item.key}/>)}
                </Picker>}
                {course &&
                <Picker
                    selectedValue={academic_group}
                    onValueChange={(x) => selectAcademicGroup(x)}>
                    {this.state.academic_group.map((item) => <Picker.Item key={item.key} label={item.label}
                                                                          value={item.key}/>)}
                </Picker>}
                {academic_group &&
                <Picker
                    selectedValue={lang_group}
                    onValueChange={(x) => selectLangGroup(x)}>
                    {this.state.lang_group.map((item) => <Picker.Item key={item.key} label={item.label}
                                                                      value={item.key}/>)}
                </Picker>}
            </View>
        );
    }

    renderIos() {

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
                </View>
                }
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

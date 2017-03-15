import * as sdk  from '../sdk/index';
import realm from '../db';
const uuidV1 = require('uuid/v1');

export function save_and_register(data) {
    return (dispatch, getState) => {
        let user = _save(data);
        return sdk.register(user)
            .then(
                result => {
                    dispatch({type: 'USER_REGISTERED'});
                }
            )
            .catch(error => dispatch({type: 'NO_INTERNET'}));
    }
}

export function get_timetable(is_cached, refresh) {
    return (dispatch, getState) => {
        let user = realm.objects('User')[0];
        let data = {
            cached: is_cached,
            date: new Date().getTime(),
            id: user.id,
        };
        let timetable = realm.objects('Timetable')[0];
        console.log('Timetable', timetable);
        console.log('User', user);
        if (!timetable || refresh) {
            return sdk.get_timetable(data)
                .then(
                    result => {
                        console.log("RESULT", result.timetable);
                        realm.write(() => {
                            realm.delete(realm.objects('Timetable'));
                            realm.create('Timetable', {
                                timetable: result.timetable,
                            })
                        });
                        dispatch({
                            type: 'GOT_TIMETABLE',
                            timetable: result.timetable
                        });
                    }
                )
                .catch(error => dispatch({type: 'NO_INTERNET'}));
        } else {
            dispatch({
                    type: 'GOT_TIMETABLE',
                    timetable: timetable.timetable,
                });
        }
    }
}

export function reset_timetable() {
    return {
        type: 'RESET_TIMETABLE'
    }
}

function _save(data) {
    let user = realm.objects('User');
    if (user.length === 0) {
        realm.write(() => {
            realm.create('User', {
                ...data,
                is_pro: false,
                id: uuidV1(),
            });
        });
    } else {
        realm.write(() => {
            user[0].program = data.program;
            user[0].faculty = data.faculty;
            user[0].department = data.department;
            user[0].course = data.course;
            user[0].group = data.group;
            user[0].academic_group = data.academic_group;
            user[0].lang_group = data.lang_group;
        });
    }
    return user[0];
}

import realm from '../db';

const initialState = {
    timetable: null,
    is_internet: true,
};

export default function sdk(state = initialState, action = {}) {
    switch (action.type) {
        case 'USER_REGISTERED':
            return state;
        case 'GOT_TIMETABLE':
            return {
                ...state,
                timetable: JSON.parse(action.timetable)
            };
        case 'NO_INTERNET':
            return {
                ...state,
                is_internet: false
            };
        case 'RESET_TIMETABLE':
            realm.write(() => {
                realm.delete(realm.objects('Timetable'));
            });
            console.log('Reset');
            return {
                ...state,
                timetable: null,
            };
        default:
            return state;
    }
}

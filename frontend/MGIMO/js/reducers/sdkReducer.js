import {deleteTimetable} from '../db/handlers';
import {enhanceTimetable} from '../utils/utils';

const initialState = {
    timetable: null,
    is_internet: true,
    is_tree_loading: false,
    is_timetable_loading: false,
    is_registering: false,
    error: null,
    tree,
};


export default function sdk(state = initialState, action = {}) {
    switch (action.type) {
        case 'USER_REGISTERING':
            return {
                ...state,
                is_registering: true,
            };
        case 'USER_REGISTERED':
            return state;
        case 'GETTING_TREE':
            return {
                ...state,
                is_tree_loading: true,
            };
        case 'GOT_TREE':
            return {
                ...state,
                is_tree_loading: false,
                tree: action.tree,
            };
        case 'GETTING_TIMETABLE':
            return {
                ...state,
                is_timetable_loading: true,
            };
        case 'GOT_TIMETABLE':
            return {
                ...state,
                timetable: enhanceTimetable(action.timetable),
                is_timetable_loading: false,
                error: null,
            };
        case 'ERROR':
            return {
                ...state,
                error: action.error,
            };
        case 'RESET_TIMETABLE':
            deleteTimetable();
            return {
                ...state,
                timetable: null,
            };
        default:
            return state;
    }
}

import * as sdk  from '../sdk/index';
import realm from '../db/schemas';
const uuidV1 = require('uuid/v1');
import * as handlers from '../db/handlers';
import {unescapeStr} from '../utils/utils'
export function getTree() {
    return (dispatch, getState) => {
        dispatch({type: 'GETTING_TREE'});
        let tree = handlers.getTree();
        if (!tree) {
            return sdk.get_tree()
                .then(
                    result => {
                        console.log('GOT TREE');
                        let decodedTree = unescapeStr(result.tree);
                        handlers.updateTree(decodedTree);
                        dispatch({type: 'GOT_TREE', tree: JSON.parse(decodedTree)})
                    }
                )
                .catch(error => { console.log(error); dispatch({type: 'ERROR', error})})
        } else {
            dispatch({type: 'GOT_TREE', tree: JSON.parse(tree)})
        }
    }
}
export function save_and_register(data) {
    return (dispatch, getState) => {
        dispatch({type: 'USER_REGISTERING'});
        let user = handlers.getUser();
        let is_pro;
        let id;
        if (!user) {
            is_pro = false;
            id = uuidV1();
        } else {
            is_pro = user.is_pro;
            id = user.id;
        }
        handlers.deleteUser();
        handlers.commitUser({
            ...data,
            is_pro,
            id,
        });
        user = handlers.getUser();
        return sdk.register(user)
            .then(
                result => {
                    dispatch({type: 'USER_REGISTERED'});
                }
            )
            .catch(error => dispatch({type: 'ERROR', error}));
     }
}

export function get_timetable(is_cached, refresh) {
    return (dispatch, getState) => {
        dispatch({type: 'GETTING_TIMETABLE'});
        let user = handlers.getUser();
        let timetable = handlers.getTimetable();
        let data = {
            cached: is_cached,
            date: new Date().getTime(),
            id: user.id,
        };
        if (!timetable || refresh) {
            return sdk.get_timetable(data)
                .then(
                    result => {
                        handlers.updateTimetable(result.timetable)
                        dispatch({type: 'GOT_TIMETABLE', timetable: JSON.parse(result.timetable)});
                    }
                )
                .catch(error => dispatch({type: 'ERROR', error}));
        } else {
            dispatch({type: 'GOT_TIMETABLE', timetable: JSON.parse(timetable.timetable)});
        }
    }
}

export function reset_timetable() {
    return {
        type: 'RESET_TIMETABLE'
    }
}



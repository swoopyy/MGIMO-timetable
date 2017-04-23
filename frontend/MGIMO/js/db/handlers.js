/**
 * Created by denissamohvalov on 24.03.17.
 */
import realm from './schemas';

export function deleteTimetable() {
    realm.write(() => {
        realm.delete(realm.objects('Timetable'));
    });
}

export function getUser() {
    return realm.objects('User')[0];
}

export function getTimetable() {
    return realm.objects('Timetable')[0];
}

export function commitTimetable(timetable) {
    realm.write(() => {
        realm.create('Timetable', {timetable});
    })
}

export function commitUser(user) {
    console.log('USER in commit', user)
    realm.write(() => {
        realm.create('User', user);
    });
    console.log('Committed')
}

export function deleteUser() {
    realm.write(() => {
        realm.delete(realm.objects('User'));
    });
}

export function updateUser(user) {
    deleteUser();
    realm.write(() => {
        realm.create('User', user)
    })
}

export function updateTimetable(timetable) {
    deleteTimetable();
    commitTimetable(timetable);
}

export function getTree() {
    return realm.objects('Tree')[0];
}

export function deleteTree() {
    realm.write(() => {
        realm.delete(realm.objects('Tree'));
    });
}

export function commitTree(tree) {
    realm.write(() => {
        realm.create('Tree', {tree});
    })
}

export function updateTree(tree) {
    deleteTree();
    commitTree(tree);
}

export function clearDB() {
    deleteTimetable();
    deleteUser();
    deleteTree();
}
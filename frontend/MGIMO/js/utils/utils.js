/**
 * Created by denissamohvalov on 15.03.17.
 */

function _removeEmptyClasses(ar) {
    while (ar.length !== 0 && Object.keys(ar[ar.length - 1]).length === 0){
        ar.pop();
    }
    for (var i = 0; i < ar.length; ++i) {
        if (Object.keys(ar[i]).length === 0) {
            ar[i].window = true;
        }
    }
    if (ar.length === 0) {
        return [{noClasses: true}];
    }
    return ar;
}

function processDay(day) {
    let classes = [];
    for (let i = 1; i < 9; ++i) {
        classes.push(day[i + '']);
    }
    return _removeEmptyClasses(classes);
}

export function enhanceTimetable(timetable) {
    let days = [];
    for (let i = 1; i < 7; ++i) {
        let day = processDay(timetable[i + '']);
        days.push(day);
    }
    console.log("DAYS", days);
    return days;
}

export function getRussianName(name) {
    if (name) {
        return name.split('/')[0];
    } else {
        return name;
    }
}
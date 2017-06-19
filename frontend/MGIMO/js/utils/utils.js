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
    return days;
}

export function getRussianName(name) {
    if (name) {
        return name.split('/')[0];
    } else {
        return name;
    }
}

export function unescapeStr(s) {
    let r = /\\u([\d\w]{4})/gi;
    s = s.replace(/\\x/g, "\\u00");
    s = s.replace(r, function (match, grp) {
        return String.fromCharCode(parseInt(grp, 16)); } );
    let tree = unescape(s);
    return tree.replace(/\\\\/g,  '\\')
}
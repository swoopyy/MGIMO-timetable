let Realm = require('realm');

const UserSchema = {
  name: 'User',
  properties: {
    id: 'string',
    is_pro: 'bool',
    program: 'string',
    faculty: 'string',
    department: 'string',
    course: 'string',
    academic_group: 'string',
    lang_group: 'string',
  }
};

const TimetableSchema = {
  name: "Timetable",
  properties: {
    timetable: 'string',
  }
};

let realm = new Realm({schema: [UserSchema, TimetableSchema], schemaVersion: 4});
export default realm;

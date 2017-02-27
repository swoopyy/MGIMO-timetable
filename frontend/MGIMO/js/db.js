var Realm = require('realm');

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

let realm = new Realm({schema: [UserSchema], schemaVersion: 3});
export default realm;

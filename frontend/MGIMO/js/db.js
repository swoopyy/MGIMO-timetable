var Realm = require('realm');

const UserSchema = {
  name: 'User',
  properties: {
    id: 'string',
    is_pro: 'bool',
    program: 'int',
    faculty: 'int',
    department: 'int',
    course: 'int',
    academic_group: 'int',
    lang_group: 'int',
  }
};

let realm = new Realm({schema: [UserSchema], schemaVersion: 2});
export default realm;

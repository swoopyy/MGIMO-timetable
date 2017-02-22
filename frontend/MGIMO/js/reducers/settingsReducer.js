
const initialState = {
    program: null,
    faculty: null,
    department: null,
    course: null,
    lang_group: null,
    academic_group: null
}

export default function settings(state = initialState, action = {}) {
  console.log(action);
  switch (action.type) {
    case "SELECT_PROGRAM":
      if (action.program == '-1') {
        return state;
      }
      return {
          ...state,
          program: action.program,
          faculty: null,
          department: null,
          course: null,
          lang_group: null,
          academic_group: null
      }
    case "SELECT_FACULTY":
      if (action.faculty == '-1') {
        return state;
      }
      return {
        ...state,
        faculty: action.faculty,
        department: null,
        course: null,
        lang_group: null,
        academic_group: null
      }
    case "SELECT_DEPARTMENT":
      if (action.department == '-1') {
        return state;
      }
      return {
        ...state,
        department: action.department,
        course: null,
        lang_group: null,
        academic_group: null
      }
    case "SELECT_COURSE":
      if (action.course == '-1') {
        return state;
      }
      return {
        ...state,
        course: action.course,
        lang_group: null,
        academic_group: null
      }
    case "SELECT_ACADEMIC_GROUP":
      if (action.group == '-1') {
        return state;
      }
      return {
        ...state,
        academic_group: action.group,
        lang_group: null
      }
    case "SELECT_LANG_GROUP":
      if (action.group == '-1') {
        return state;
      }
      return {
        ...state,
        lang_group: action.group
      }
    default:
      return state;
  }
}

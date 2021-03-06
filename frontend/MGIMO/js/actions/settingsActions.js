export function selectProgram(program) {
  return {
    type: 'SELECT_PROGRAM',
    program
  }
}

export function selectFaculty(faculty) {
  console.log("Faculty", faculty);
  return {
    type: 'SELECT_FACULTY',
    faculty
  }
}

export function selectDepartment(department) {
  return {
    type: 'SELECT_DEPARTMENT',
    department
  }
}

export function selectCourse(course) {
  return {
    type: 'SELECT_COURSE',
    course
  }
}

export function selectAcademicGroup(group) {
  return {
    type: 'SELECT_ACADEMIC_GROUP',
    group
  }
}

export function selectLangGroup(group) {
  return {
    type: 'SELECT_LANG_GROUP',
    group
  }
}

export function deselectAll() {
  return {
    type: 'DESELECT_ALL'
  }
}

export function save(user) {
  return {
    type: 'SAVE',
    ...user,
  }
}

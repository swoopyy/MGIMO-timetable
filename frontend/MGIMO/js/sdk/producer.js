const root = "https://mgimo-timetable.appspot.com/_ah/api/mgimo/v1";
export default producer = {
  register: (data) => {
    let params = 'id=' + data.id + '&' +
            'program_type=' + data.program + '&' +
            'faculty=' + data.faculty + '&' +
            'department=' + data.department + '&' +
            'course=' + data.course + '&' +
            'lang_group=' + data.lang_group + '&' +
            'academic_group=' + data.academic_group + '&' +
            'is_pro=' + data.is_pro;
    return root + '/register?' + params;
  },

  get_timetable: (data) => {
    let params = 'id=' + data.id + '&' +
                 'date=' + data.date + '&' +
                 'cached=' + data.cached + '&';
    return root + '/timetable?' + params;
  },

  get_tree: () => {
      return root + '/tree';
  }
}

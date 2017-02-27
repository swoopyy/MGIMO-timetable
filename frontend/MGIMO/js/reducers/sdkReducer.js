const initialState = {
  timetable: null,
  is_internet: true,
};

export default function sdk(state = initialState, action = {}) {
  switch(action.type) {
    case 'USER_REGISTERED':
      return state;
    case 'GOT_TIMETABLE':
      return {
        ...state,
        timetable: action.timetable
      };
    case 'NO_INTERNET':
      return {
        ...state,
        is_internet: false
      }
    default:
      return state;
  }
}

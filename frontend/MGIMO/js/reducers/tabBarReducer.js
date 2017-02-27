const initialState = {
    selectedTab: 'settings',
}

export default function tabBarReducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'SELECT_TAB':
      return {
        ...state,
        selectedTab: action.tab,
      }
    default:
      return state;
  }
}

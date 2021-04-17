import { combineReducers } from 'redux';
import userReducer from './userReducer';
import groupsReducer from './groupsReducer';
import {
  USER_LOGOUT,
} from "../constants/actionTypes";

const appReducer = combineReducers({
  userReducer,
  groupsReducer,
});

const rootReducer = (state, action) => {
  // when a logout action is dispatched it will reset redux state
  if (action.type === USER_LOGOUT) {
    localStorage.clear();
    return {};
  }

  return appReducer(state, action);
};
export default rootReducer;

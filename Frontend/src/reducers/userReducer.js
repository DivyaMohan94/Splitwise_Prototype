/* eslint-disable func-names */
import {
  USER_LOGIN, USER_LOGOUT, USER_SIGNEDUP, PROFILE_UPDATED,
} from "../constants/actionTypes";

const initialState = {
  _id: -1,
  emailID: '',
  userName: '',
  currency: '',
  phoneNum: '',
  countryCode: '',
  timeZone: '',
  createdAt: '',
  language: '',
  image: '',

};

export default function (state = initialState, action) {
  console.log("in reducer");
  console.log(action.payload);
  switch (action.type) {
    case USER_LOGIN:
      console.log("inside switch case");
      return {
        ...state,
        ...action.payload,
      };
    case USER_LOGOUT:
      localStorage.clear();
      return {};
    case USER_SIGNEDUP:
      console.log('inside signup reducer part');
      return {
        ...state,
        ...action.payload,
      };
    case PROFILE_UPDATED:
      console.log('inside profile updated action-reducer', action.payload);
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

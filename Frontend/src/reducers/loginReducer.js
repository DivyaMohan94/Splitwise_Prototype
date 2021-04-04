/* eslint-disable func-names */
import { USER_LOGIN, USER_LOGOUT } from "../constants/actionTypes";

const initialState = {
  _id: -1,
  emailID: '',
  userName: '',
  currency: '',
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
        // userID: action.payload._id,
        // emailID: action.payload.emailID,
        // userName: action.payload.userName,
        // currency: action.payload.currency,
      };
    case USER_LOGOUT:
      localStorage.clear();
      return {};
    default:
      console.log('helllooooooooooooooooooooooooooooooooooooooooooooooooooooooooo', state);
      return state;
  }
}

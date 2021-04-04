/* eslint-disable func-names */
import { USER_SIGNEDUP } from '../constants/actionTypes';

const initialState = {
};

export default function (state = initialState, action) {
  console.log(action.payload);
  switch (action.type) {
    case USER_SIGNEDUP:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

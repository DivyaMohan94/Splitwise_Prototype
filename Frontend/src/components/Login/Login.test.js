/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import Login from './Login';

const mockStore = configureMockStore();
const store = mockStore({
  userID: -1,
  emailID: '',
  userName: '',
  currency: '',
});

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Provider store={store}><Login /></Provider>, div);
  ReactDOM.unmountComponentAtNode(div);
});

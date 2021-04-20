/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { screen } from '@testing-library/react';
import Signup from './Signup';

const mockStore = configureMockStore();
const store = mockStore({
  userID: -1,
  emailID: '',
  userName: '',
  currency: '',
});

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Provider store={store}><Signup /></Provider>, div);
  expect(screen.findAllByLabelText('Email Address'));
  ReactDOM.unmountComponentAtNode(div);
});

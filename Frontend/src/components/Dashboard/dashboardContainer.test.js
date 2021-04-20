/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { BrowserRouter as Router } from 'react-router-dom';
import { screen } from '@testing-library/react';
import DashboardContainer from './dashboardContainer';

const mockStore = configureMockStore();
const store = mockStore({
  userID: 1,
  emailID: "",
  userName: "",
  currency: "",
  phoneNum: "",
  countryCode: "",
  timeZone: "",
  createdAt: "",
  language: "",
  image: "",
});
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Provider store={store}><Router><DashboardContainer /></Router></Provider>, div);
  expect(screen.findAllByLabelText('Total Balance'));
  ReactDOM.unmountComponentAtNode(div);
});

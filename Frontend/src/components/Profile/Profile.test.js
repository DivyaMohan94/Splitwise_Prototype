/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Profile from './profile';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Router><Profile /></Router>, div);
  ReactDOM.unmountComponentAtNode(div);
});

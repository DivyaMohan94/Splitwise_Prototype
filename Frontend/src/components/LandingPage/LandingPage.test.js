/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { screen } from '@testing-library/react';
import LandingPage from './LandingPage';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Router><LandingPage /></Router>, div);
  expect(screen.findAllByLabelText('Splitwise'));
  ReactDOM.unmountComponentAtNode(div);
});

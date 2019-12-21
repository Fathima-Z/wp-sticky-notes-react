import React from "react";
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import LoginForm from './LoginForm';
import Board from './Board';
import NotFound from './NotFound';
import ProtectedRoute from './ProtectedRoute';

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={LoginForm} />
      <ProtectedRoute path="/notes" component={Board} />
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
)

export default Router;

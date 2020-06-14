import React, { Fragment } from 'react';
import { renderRoutes } from 'react-router-config';
import './App.css';

import 'element-theme-default';

import routes from './router'
import TopMenu from './components/Menu/Menu'
import LoginRegister from './components/LoginRegister'
import {
  // BrowserRouter as Router,
  Switch
} from "react-router-dom";

import { checkJWTAuthentication, getUser } from './api/api'
import cookie from './static/js/cookie';

import { history } from './history'

import { connect } from 'react-redux'
import * as actionCreators from './actions'

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.checkAuthentication();
  }

  checkAuthentication() { 
    checkJWTAuthentication({ token: cookie.getCookie('token') })
    .then((response) => {
      if (response.status === 200 && response.data.token === cookie.getCookie('token')) {
        getUser(cookie.getCookie('username'))
        .then((response) => {
          if (response.data.is_login_user) {
            this.props.loginUser({ user: response.data })
          }
        })
        .catch(console.log)
      }
    })
    .catch(console.log)
  }

  render() {
    const subRoutes = routes.filter(r =>  r.routes != null)
                            .map(r => r.routes)
                            .reduce((allRoutes, currentSubRoutes) => allRoutes.concat(currentSubRoutes), [])

    let displayPages = "";
    // if ('is_login_user' in this.props.currentUser) {
      // if (this.props.currentUser.is_login_user === true) {
        displayPages = (<Fragment>
          <section className="AppHeader">
            <TopMenu history={history} />
          </section>

          <Switch>
            { renderRoutes(subRoutes.concat(routes)) }
          </Switch>
        </Fragment>);
      // } else {
      //   displayPages = (<Fragment>
      //     <section className="AppHeader">
      //       <TopMenu history={history} />
      //     </section>
      //     <LoginRegister history={history} location={history.location} />
      //   </Fragment>);
      // }
    // }
    return (
      <div className="App">
        { displayPages }
      </div>
    );
  }
}

const mapStateToProps = store => (
  { currentUser: store.currentUser }
)

export default connect(mapStateToProps, actionCreators)(App);

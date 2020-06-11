import React, { Fragment } from 'react';

import { Dialog, Button, Breadcrumb, Tag, Input, Form, Message } from 'element-react';
import './login.css'
import { TMBreadcrumb } from '../Menu'
import { Link } from "react-router-dom";

import cookie from '../../static/js/cookie';

import { getJWTAuthenticatino, getUser } from '../../api/api'

import githubLogo from '../../static/img/GitHub-Mark-Light-32px.png'
import facebookLogo from '../../static/img/Facebook-Mark-Light-58px.png'
import linkedinLogo from '../../static/img/Linkedin-Mark-Light.png'
import googleLogo from '../../static/img/Google-Mark-Light.png'

import { connect } from 'react-redux'
import * as actionCreators from '../../actions'

class LoginRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      form: {
        password: 'ttt',
        username: 'tesla_bro',
      },
    };
  }

  componentDidMount() {

  }

  handleLogin(e) {
    e.preventDefault();
    getJWTAuthenticatino({ ...this.state.form })
    .then((response) => {
      cookie.setCookie('username', this.state.form.username, 7);
      cookie.setCookie('token', response.data.token, 7);
      getUser(cookie.getCookie('username'))
      .then((response) => {
        if (response.data.is_login_user) {
          this.props.loginUser({ user: response.data })
          Message.success({
            message: 'Successfully logged in',
            customClass: 'element-message',
          });
          this.props.history.push('/home')
        }
      })
      .catch(e => {
        Message.error({
          message: `${e.non_field_errors[0]}`,
          customClass: 'element-message',
        });
      })      
    })
    .catch(e => {
      Message.error({
        message: `${e.non_field_errors[0]}`,
        customClass: 'element-message',
      });
    })
  }

  handleRegister(e) {
    e.preventDefault();
  }

  onChange(key, value) {
    this.setState({
      form: Object.assign({}, this.state.form, { [key]: value })
    });
  }

  render() {
    return (
      <Fragment>
        <TMBreadcrumb currentPath={this.props.location.pathname}/>
        <section className="external-wrapper">
          <div className="form-wrapper">
            <Form ref="form" model={this.state.form} labelWidth="100" className="loginForm">
              <Form.Item label="User Name" prop="username">
                <Input type="text" value={this.state.form.username} onChange={this.onChange.bind(this, 'username')} autoComplete="off" />
              </Form.Item>
              <Form.Item label="Password" prop="password">
                <Input type="password" value={this.state.form.password} onChange={this.onChange.bind(this, 'password')} autoComplete="off" />
              </Form.Item>
              <div className="form-footer">
                <Button className="" type="primary" onClick={this.handleLogin.bind(this)}>Login</Button>
              </div>
            </Form>
          </div>
          <div className="thirdparty-form-wrapper">
            <div className="login_3rdparty_button facebook">
              <div className="logo-wrapper"><img src={facebookLogo} alt="facebook"/></div>
              <span>Login with Facebook</span>
            </div>
            <div className="login_3rdparty_button google">
              <div className="logo-wrapper"><img src={googleLogo} alt="google"/></div>
              <span>Login with Google</span>
            </div>
            <div className="login_3rdparty_button github">
              <div className="logo-wrapper"><img src={githubLogo} alt="github"/></div>
              <span>Login with GitHub</span>
            </div>
            <div className="login_3rdparty_button linkedin">
              <div className="logo-wrapper"><img src={linkedinLogo} alt="linkedin"/></div>
              <span>Login with Linkedin</span>
            </div>
          </div>
        </section>
      </Fragment>
    )
  }
}


const mapStateToProps = store => (
  { currentUser: store.currentUser }
)

export default connect(mapStateToProps, actionCreators)(LoginRegister);

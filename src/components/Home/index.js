import React, { Fragment } from 'react';
import News from './News'

import { Button, Dialog, Form, Input, Message } from 'element-react';

import { TMBreadcrumb } from '../Menu'
import './NewsList.css'
import { addNews, getNews, getNewsDetail } from '../../api/api'

import { connect } from 'react-redux'
import * as actionCreators from '../../actions'

class NewsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogVisible: false,
      form: {
        content: '',
      }
    };
    this._isMounted = false;
  }

  reinit_visible_components() {
    this.props.resetNewsVisbleList({
      uuid_list: this.props.newsList.map(news => news.uuid_id),
    });

    if ('uuid' in this.props.match.params) {
      getNewsDetail(this.props.match.params.uuid)
      .then((response) => {
        this.props.updateNews({ news: response.data });
      })
      .catch(console.log)

      this.props.makeNewsVisble({
        uuid_id: this.props.match.params.uuid,
      });
    }
  }

  onRouteChanged() {
    console.log('aisdjaoisdo');
  }

  componentWillReceiveProps(nextProps){
    if ((JSON.stringify(nextProps.newsList) !== JSON.stringify(this.props.newsList)) ) {
     this._isMounted && this.reinit_visible_components();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    this._isMounted && getNews()
    .then((response) => {
      this.setState({ news: response.data, })
      this.props.updateNewsList({
        newsList: response.data,
      });
      this.reinit_visible_components()
    })
    .catch(console.log)
  }

  updateInputValue(value) {
    this.setState({form: {content: value}});
  }

  submitForm() {
    const that = this;
    addNews({ content: that.state.form.content })
    .then((response) => {
      getNews()
      .then((response) => {
        this.setState({ news: response.data, })
        this.props.updateNewsList({
          newsList: response.data,
        });
        this.reinit_visible_components()
      })
      .catch(console.log)

      that.setState({ dialogVisible: false });
      this.updateInputValue("")

      Message.success({
        message: 'Successfully posted',
        customClass: 'element-message',
      });
    })
    .catch(console.log);
  }


  render() {
    return (
      <Fragment>
        <TMBreadcrumb currentPath={this.props.location.pathname}/>
        <ul className="newsList">
          <div className="post-article-button-wrapper">
            <Button 
              type="primary"
              size="large"
              icon="edit"
              onClick={ () => this.setState({ dialogVisible: true }) }>
              &nbsp;Post news
            </Button>
          </div>
          { 
            this.props.newsList.map((news, idx) => 
              <News
                key={idx}
                news={news}
              />
            )
          }
        </ul>
        
        <Dialog
          title="Tweets"
          visible={ this.state.dialogVisible }
          closeOnPressEscape={ true }
          onCancel={ () => this.setState({ dialogVisible: false }) }>
          <Dialog.Body>
            <Form model={this.state.form}>
              <Form.Item label="News, Tweets, Feelings..." >
                <Input
                  type="textarea"
                  placeholder="What's happening?"
                  autosize={{ minRows: 6, maxRows: 6}}
                  onChange={value => this.updateInputValue(value)}
                  value={this.state.form.content}></Input>
              </Form.Item>
            </Form>
          </Dialog.Body>

          <Dialog.Footer className="dialog-footer">
            <Button onClick={ () => this.setState({ dialogVisible: false }) }>Cancel</Button>
            <Button type="primary" onClick={ this.submitForm.bind(this) }>Post</Button>
          </Dialog.Footer>
        </Dialog>
      </Fragment>
    )
  }
}

const mapStateToProps = store => (
  { newsList: store.newsList }
)

export default connect(mapStateToProps, actionCreators)(NewsList);
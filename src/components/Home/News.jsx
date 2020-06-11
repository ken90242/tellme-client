import React, { Fragment } from 'react';
import moment from 'moment';
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FaRegCommentDots, FaTrashAlt } from "react-icons/fa";
import { GrTrash } from "react-icons/gr";
import { Link } from "react-router-dom";
import { Button, Dialog, Form, Input, Message } from 'element-react';

import './News.css'
import { addNews, switchNewsLike, deleteNews, getNewsDetail } from '../../api/api'

import { connect } from 'react-redux'
import * as actionCreators from '../../actions'

class News extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputContent: '',
      isHovered: {
        like: false,
        remove: false,
      },
    };
  }

  submitForm() {
    const { inputContent } = this.state;
    addNews({ parent_uuid: this.props.news.uuid_id, content: inputContent })
    .then((response) => {
      getNewsDetail(this.props.news.uuid_id)
      .then((response) => {
        this.props.updateNews({ news: response.data });
      })
      .catch(console.log)

      this.setState({inputContent: ""});
    })
    .catch(console.log);
  }

  deleteNews(event) {
    event.stopPropagation();
    deleteNews(this.props.news.uuid_id)
    .then((response) => {
      this.props.deleteNews({ uuid_id: this.props.news.uuid_id });
      Message.success({
        message: 'Successfully deleted',
        customClass: 'element-message',
      });
    })
    .catch(console.log);
  }

  switchLike(event) {
    event.stopPropagation();
    switchNewsLike(this.props.news.uuid_id)
    .then((response) => {
      getNewsDetail(this.props.news.uuid_id)
      .then((response) => {
        this.props.updateNews({ news: response.data });
      })
      .catch(console.log)
    })
    .catch(console.log);
  }

  updateInputValue(value) {
    this.setState({inputContent: value});
  }

  render() {
    let ele;
    let deleteButton;

    if (this.props.news.liked.some(user => user.is_login_user) === true) {
      ele = (<span
              className="card-icon"
              onClick={ this.switchLike.bind(this) }>
              <AiFillLike/>
            </span>);
    } else {
      ele = (<span
              className="card-icon"
              onMouseEnter={()=> this.setState({isHovered: {like: true}})}
              onMouseLeave={()=> this.setState({isHovered: {like: false}})}
              onClick={ this.switchLike.bind(this) }>
              {
                this.state.isHovered.like ? <AiFillLike/> : <AiOutlineLike/>
              }
            </span>);
    }

    if (this.props.news.user.is_login_user === true) {
      deleteButton = 
      (<span className="card-interaction-button">
        <span
          className="card-icon"
          onMouseEnter={()=> this.setState({isHovered: {remove: true}})}
          onMouseLeave={()=> this.setState({isHovered: {remove: false}})}
          onClick={this.deleteNews.bind(this)}>
          {
            this.state.isHovered.remove ?
            <FaTrashAlt/> :
            <GrTrash/>
          }
        </span>
      </span>)
    }

    return (
      <li>
        <section className="card" onClick={ this.props.makeNewsVisble.bind(this, { uuid_id: this.props.news.uuid_id }) }>
          <div className="card-body">
            <div className="head-img-wrapper">
              <img className="card-head-img" src="https://shop.line-scdn.net/themeshop/v1/products/d5/46/a2/d546a2d4-27a8-48d7-8bf4-ad88815e8c75/17/WEBSTORE/icon_198x278.png"></img>
            </div>
            <div className="post">
              <p className="post-author"><Link className="no-textdecoration" to={`/user/${this.props.news.user.username}`}>{ this.props.news.user.username }</Link></p>
              <p className="post-content">{ this.props.news.content }</p>
            </div>
          </div>
          <div className="card-footer">
            <div className="card-footer-left">
              <div className="card-interaction-button">
                { ele }
                <p>{ this.props.news.liked.length }</p>
              </div>
              <span className="card-interaction-button">
                <span className="card-icon"><FaRegCommentDots/></span>
                <p>{ this.props.news.thread.length }</p>
              </span>
              { deleteButton }
            </div>
            <div className="card-footer-right">
              <span className="card-date">{ moment().to(moment(this.props.news.updated_at)) }</span>
            </div>
          </div>
        </section>

        <Dialog
          size="small"
          visible={ this.props.newsVisibleDict[this.props.news.uuid_id] }
          onCancel={ this.props.makeNewsInvisble.bind(this, { uuid_id: this.props.news.uuid_id }) }
          closeOnPressEscape={ true }
          top="1%"
          lockScroll={ true }
        >
          <Dialog.Body>
            <section className="newsDetail-card">
              <div className="newsDetail-head-img-wrapper">
                <img className="newsDetail-card-head-img" src="https://shop.line-scdn.net/themeshop/v1/products/d5/46/a2/d546a2d4-27a8-48d7-8bf4-ad88815e8c75/17/WEBSTORE/icon_198x278.png"></img>
                <p className="post-author"><Link className="no-textdecoration" to={`/user/${this.props.news.user.username}`}>{ this.props.news.user.username }</Link></p>
              </div>
              <p className="post-content">{ this.props.news.content }</p>
            </section>
            <section className="newsDetail-buttons">
              <Input
                placeholder="Tweet your reply"
                className="newsDetail-buttons-input"
                onChange={value => this.updateInputValue(value)}
                value={this.state.inputContent}/>
              <Button onClick={ this.submitForm.bind(this) }>Reply</Button>
            </section>
            <section className="newsDetail-replies">
              { this.props.news.thread.map((thread, i) => {
                  return (
                    <Fragment key={i}>
                      <div className="thread">
                        <div className="thread-header">
                          <img className="thread-head-img" src="https://shop.line-scdn.net/themeshop/v1/products/d5/46/a2/d546a2d4-27a8-48d7-8bf4-ad88815e8c75/17/WEBSTORE/icon_198x278.png"></img>
                          <div className="thread-author-replyer">
                            <p className="thread-post-author"><Link className="no-textdecoration" to={`/user/${thread.user.username}`}>{ thread.user.username }</Link>&nbsp;&nbsp;<span className="reply_grey">{ thread.updated_at }</span></p>
                            <p className="thread-post-replyer"><span className="reply_grey">Replying&nbsp;to&nbsp;</span><Link className="no-textdecoration" to={`/user/${this.props.news.user.username}`}>{ this.props.news.user.username }</Link></p>
                          </div>
                        </div>
                        <div className="thread-body">
                          <p className="thread-post-content">{ thread.content }</p>
                        </div>
                      </div>
                    </Fragment>
                  )
                })
              }
            </section>
          </Dialog.Body>
        </Dialog>
      </li>
    )
  }
}

const mapStateToProps = store => (
  { newsVisibleDict: store.newsVisibleDict }
)

export default connect(mapStateToProps, actionCreators)(News);


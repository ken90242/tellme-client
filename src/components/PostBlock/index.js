import React, { Fragment } from 'react';

import { Button, Tabs, Tag, Input, Upload, Message } from 'element-react';
import { Link } from "react-router-dom";

import './PostBlock.css';
import { TMBreadcrumb } from '../Menu'

import { FaUserCircle } from 'react-icons/fa';
import { IoMdMail } from 'react-icons/io';
import { MdFeaturedPlayList, MdLocationOn } from 'react-icons/md';
import { TiLocation } from 'react-icons/ti';
import { DiCode } from 'react-icons/di';
import { RiQuestionAnswerLine } from 'react-icons/ri';
import { GoComment } from 'react-icons/go';
import { GrArticle } from 'react-icons/gr';
import { BsQuestionCircle } from 'react-icons/bs';
import { AiOutlineInteraction } from 'react-icons/ai';
import cookie from '../../static/js/cookie';
import { host, getMarkdonPreview, publishArticle, publishQuestion, getDraftDetail, createDraft, updateDraft, publishDraft } from '../../api/api'


class PostBlock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: [],
      inputVisible: false,
      inputTagValue: '',
      title: '',
      content: '',
      preview: '',
      image: '',
      itemId: null,
      errors: {
        title: [],
        content: [],
        tags: [],
      },
    }
  }
  componentDidMount() {
    if (this.props.match.path === '/draft/:id') {
      getDraftDetail(this.props.match.params.id)
      .then((response) => {
        const { id, title, content, tags } = response.data
        this.setState({ title, content, tags, itemId: id });
        this.updateInputValue('content', content);
      })
      .catch(console.log)
    }
  }


  onKeyUp(e) {
    if (e.keyCode === 13) {
      this.handleTagInputConfirm();
    }
  }

  onTagChange(value) {
    this.setState({ inputTagValue: value });
  }

  handleTagClose(index) {
    this.state.tags.splice(index, 1);
    this.forceUpdate();
  }

  showTagInput() {
    this.setState({ inputVisible: true }, () => {
      this.refs.saveTagInput.focus();
    });
  }

  updateInputValue(key, value) {
    if (key === 'content') {
      const params = new URLSearchParams();
      params.append(key, value);
      getMarkdonPreview(params)
      .then((response) => {
        this.setState({ preview: response.data.result })
      })
      .catch(console.log)
    }

    const kw = {}
    kw[key] = value
    this.setState(kw);
  }

  handleTagInputConfirm() {
    let inputTagValue = this.state.inputTagValue;

    if (inputTagValue) {
      this.state.tags.push(inputTagValue);
    }

    this.state.inputVisible = false;
    this.state.inputTagValue = '';

    this.forceUpdate();
  }

  submitForm(status, apiFunc, forSpecificItem=false) {
    const { title, content, image, tags } = this.state
    let apiPromise;

    if (typeof apiFunc !== 'function') {
      return;
    }

    if (forSpecificItem === true) {
      apiPromise = apiFunc(this.state.itemId, { title, content, image, tags, status })
    } else {
      apiPromise = apiFunc({ title, content, image, tags, status })
    }

    apiPromise
    .then((response) => {
        if (status === "P") {
          Message.success({
            message: 'Successfully posted',
            customClass: 'element-message',
          });
          this.props.history.push('/article')
        } else if (status === "D") {
          Message.success({
            message: 'Successfully saved',
            customClass: 'element-message',
          });
          this.props.history.push('/draft')
        } else if (status === "O") {
          Message.success({
            message: 'Successfully posted',
            customClass: 'element-message',
          });
          this.props.history.push('/qa')
        } 
    })
    .catch((e) => {
      this.setState(prevState => {
        const errors = Object.assign(prevState.errors, e);
        return { errors };
      });
      console.log(this.state.errors.title.length);
      Message.error({
        message: 'Invalid Fields',
        customClass: 'element-message',
      });
    })
  }

  render() {
    const previewHtml = { __html: this.state.preview }
    let submitButton;
    let saveDraftButton;
    let quitButton;

    if (this.props.match.path === '/article/post') {
      submitButton = <Button type="primary" onClick={this.submitForm.bind(this, "P", publishArticle)}>Post</Button>;
      saveDraftButton = <Button onClick={this.submitForm.bind(this, "D", createDraft)}>Save to draft</Button>;
      quitButton = <Link className="no-textdecoration" to={`/article`}>
                      <Button>Leave</Button>
                   </Link>;
    } else if (this.props.match.path === '/draft/:id') {
      submitButton = <Button type="primary" onClick={this.submitForm.bind(this, "P", publishDraft, true)}>Post</Button>;
      saveDraftButton = <Button onClick={this.submitForm.bind(this, "D", updateDraft, true)}>Save to draft</Button>;
      quitButton = <Link className="no-textdecoration" to={`/article`}>
                      <Button>Leave</Button>
                   </Link>;
    } else if (this.props.match.path === '/qa/ask') {
      submitButton = <Button type="primary" onClick={this.submitForm.bind(this, "O", publishQuestion)}>Post</Button>;
      quitButton = <Link className="no-textdecoration" to={`/qa`}> <Button>Leave</Button> </Link>;
    }

    return (
      <Fragment>
        <TMBreadcrumb currentPath={this.props.location.pathname}/>
        <div className="post-edit-wrapper">
          <section className="post-edit-item">
            <h3 className="post-edit-item-title">Title</h3>
            <Input
              className={ this.state.errors.title.length > 0 ? "errorInput" : "" }
              placeholder="Input the question title"
              value={this.state.title}
              onChange={value => this.updateInputValue('title', value)}/>
            { 
              this.state.errors.title.map(error => { return (<span className="errorTip">{ error }</span>) })
            }
          </section>
          <section className="post-edit-item">
            <h3 className="post-edit-item-title">Content (Markdown Syntax)</h3>
            <Input
              className={ this.state.errors.content.length > 0 ? "errorInput" : "" }
              type="textarea"
              autosize={{ minRows: 7, maxRows: 7}}
              resize="none"
              value={this.state.content} onChange={value => this.updateInputValue('content', value)}
              placeholder="Input the question content"/>
            { 
              this.state.errors.content.map(error => { return (<span className="errorTip">{ error }</span>) })
            }
          </section>
          <section className="post-edit-item">
            <h3 className="post-edit-item-title">Content Preview</h3>
            <div className="content-textarea-preview" dangerouslySetInnerHTML={ previewHtml }/>
          </section>
          { 
            this.props.match.path === '/article/post' || this.props.match.path === '/draft/:id' ? 
              <section className="post-edit-item">
                <h3 className="post-edit-item-title">Index Picture</h3>
                <div className="post-edit-img">
                  <Upload
                    className="upload-demo"
                    drag
                    headers={{'X-CSRFToken': cookie.getCookie("csrftoken")}}
                    limit={1}
                    action={`${host}/upload/`}
                    name="file"
                    multiple={false}
                    onSuccess={ response => { this.state.image = response.id } }
                    tip={<div className="el-upload__tip">only accept jpg/png type, must smaller than 500 KB</div>}
                  >
                    <i className="el-icon-upload"></i>
                    <div className="el-upload__text">Drag, or <em>click to upload</em></div>
                  </Upload>
                </div>
              </section> : ""
          }
          <section className="post-edit-item post-edit-tag">
            <h3 className="post-edit-item-title">Tags</h3>
            <div className={ this.state.errors.tags.length > 0 ? "edit-tag-group errorInput" : "edit-tag-group" }>
              {
                this.state.tags.map((tag, index) => {
                  return (
                    <Tag
                      className="edit-tag"
                      key={Math.random()}
                      closable={true}
                      closeTransition={false}
                      onClose={this.handleTagClose.bind(this, index)}>{tag}</Tag>
                  )
                })
              }
              {
                this.state.inputVisible ? (
                  <Input
                    className="input-new-tag"
                    value={this.state.inputTagValue}
                    ref="saveTagInput"
                    size="mini"
                    onChange={this.onTagChange.bind(this)}
                    onKeyUp={this.onKeyUp.bind(this)}
                    onBlur={this.handleTagInputConfirm.bind(this)}
                  />
                ) : (<Button className="button-new-tag" size="small" onClick={this.showTagInput.bind(this)}>+ New Tag</Button>)

              }
              {
                this.state.errors.tags.map(error => { return (<span className="errorTip">{ error }</span>) })
              }
            </div>
          </section>
          <hr className="post-edit-item post-hr"/>
          <section className="post-edit-item post-buttons">
            <div className="post-button-left">
              { submitButton }
              { saveDraftButton }
            </div>
            <div className="post-button-right">
              { quitButton }
            </div>
          </section>
        </div>
      </Fragment>
    )
  }
}


export default PostBlock
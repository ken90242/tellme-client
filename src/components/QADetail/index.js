import React, { Fragment } from 'react';

import { Dialog, Button, Breadcrumb, Tag, Input, Form, Message } from 'element-react';
import './QADetail.css'
import { TMBreadcrumb } from '../Menu'
import { Link } from "react-router-dom";
import Answer from './Answer'

import moment from 'moment';

import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai'
import { getVoteUUID, startVote, updateVote, deleteVote,
  getQuestionDetail, updateAnswer, getMarkdonPreview, createAnswer } from '../../api/api'

class QADetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      question_answer: { answer: [], user: {}, tags: [], votes: [] },
      dialogVisible: false,
      form: {
        content: '',
      },
      preview: ""
    };
  }

  acceptAnswer(uuid_id) {
    updateAnswer(uuid_id, { is_answer: true })
    .then((response) => {
      // console.log(response);
    })
    .catch(console.log)
  }

  updateInputValue(value) {
    this.setState({form: {content: value}});
    const params = new URLSearchParams();
      params.append('content', value);
      getMarkdonPreview(params)
      .then((response) => {
        this.setState({ preview: response.data.result })
      })
      .catch(console.log)
  }

  submitForm() {
    const that = this;
    createAnswer({ content: that.state.form.content, question_slug: this.props.match.params.id })
    .then((response) => {
      that.setState({ dialogVisible: false });
      getQuestionDetail(this.props.match.params.id)
      .then((response) => {
        this.setState({ question_answer: response.data })
        Message.success({
          message: 'Successfully answered',
          customClass: 'element-message',
        });
      })
      .catch(console.log)
      that.updateInputValue("");
    })
    .catch(console.log);
  }

  upVoteQuestion() {
    const category = 'question';
    const pk = this.state.question_answer.slug;
    getVoteUUID(category, pk)
    .then((response) => {
      if (response.data.length > 0) {
        // has voted before
        const vote = response.data[0];
        const vote_uuid = response.data[0]['uuid_id']
        
        if (vote.value === true) {
          // cancel upvote
          deleteVote(vote_uuid)
          .then((response) => {
            // console.log(response);
          })
          .catch(console.log);
        } else {
          // switch to upvote
          updateVote(vote_uuid, { value: true })
          .then((response) => {
            // console.log(response);
          })
          .catch(console.log);
        }
      } else {
        // hasnt voted before, start a new upvote
        startVote({ category, pk, value: true })
        .then((response) => {
          // console.log(response);
        })
        .catch(console.log);
      }
      this.updateWhole();
    })
    .catch(console.log);
  }

  downVoteQuestion() {
    const category = 'question';
    const pk = this.state.question_answer.slug;
    getVoteUUID(category, pk)
    .then((response) => {
      if (response.data.length > 0) {
        // has voted before
        const vote = response.data[0];
        const vote_uuid = response.data[0]['uuid_id']
        
        if (vote.value === false) {
          // cancel downvote
          deleteVote(vote_uuid)
          .then((response) => {
            // console.log(response);
          })
          .catch(console.log);
        } else {
          // switch to downvote
          updateVote(vote_uuid, { value: false })
          .then((response) => {
            // console.log(response);
          })
          .catch(console.log);
        }
      } else {
        // hasnt voted before, start a new downvote
        startVote({ category, pk, value: false })
        .then((response) => {
          // console.log(response);
        })
        .catch(console.log);
      }
      this.updateWhole();
    })
    .catch(console.log);
  }

  updateWhole() {
    getQuestionDetail(this.props.match.params.id)
    .then((response) => {
      this.setState({ question_answer: response.data })
      // console.log(this.state);
    })
    .catch(console.log)
  }

  componentDidMount() {
    getQuestionDetail(this.props.match.params.id)
    .then((response) => {
      this.setState({ question_answer: response.data })
      // console.log(this.state);
    })
    .catch(console.log)
  }

  render() {
    const QuestionContentHtml =  {
      __html: this.state.question_answer.content,
    }
    const answerPreviewHtml = { __html: this.state.preview }
    return (
      <Fragment>
        <TMBreadcrumb currentPath={this.props.location.pathname}/>
        <div class="qa-list-wrapper">
          <div class="qa-card">
            <h1 class="qa-title">{this.state.question_answer.title}</h1>
            <div class="qa-content">
              <div class="qa-content-left">
                <div class="qa-meta-answer">
                  <span class="qa-meta-answer-count">{this.state.question_answer.answer.length}</span>
                  <span class="qa-meta-answer-label">answers</span>
                </div>
                <div class="qa-meta-vote">
                  <AiFillCaretUp 
                    onClick={ this.upVoteQuestion.bind(this) }
                    className={ 
                      this.state.question_answer.votes.some(vote => vote.user.is_login_user === true && vote.value === true) ?
                      'qa-meta-vote-icon question_voted' : 
                      'qa-meta-vote-icon'
                    }/>
                  <span class="qa-meta-vote-count">{this.state.question_answer.total_votes}</span>
                  <AiFillCaretDown
                    onClick={ this.downVoteQuestion.bind(this) }
                    className={
                      this.state.question_answer.votes.some(vote => vote.user.is_login_user === true && vote.value === false) ?
                      'qa-meta-vote-icon question_voted' : 
                      'qa-meta-vote-icon' 
                    }/>
                  <span class="qa-meta-vote-label">thumbs</span>
                </div>
              </div>
              <div class="qa-content-right" dangerouslySetInnerHTML={ QuestionContentHtml }/>
            </div>
            <div class="qa-footer">
              <span class="qa-author">
                <Link className="no-textdecoration" to={`/user/${this.state.question_answer.user.username}`}>
                  {this.state.question_answer.user.username}
                </Link>
              </span>
              <span class="qa-post-time">{moment().to(moment(this.state.question_answer.updated_at))}</span>
              <div class="qa-tag-group">
                { this.state.question_answer.tags.map( tag => <Tag className="question-tag" color="#007bff">{tag}</Tag> ) }
              </div>
            </div>
          </div>
          <section class="qa-function-area">
            <Button
              type="info"
              size="large"
              onClick={ () => this.setState({ dialogVisible: true }) }>
              Answer
            </Button>
          </section>
          <section class="qa-answer-list">
            <h2 class="qa-answer-list-title">Answer</h2>
            { this.state.question_answer.answer
                .sort((a,b) => moment(a.created_at) - moment(b.created_at))
                .map(ans => <Answer is_login_user={this.state.question_answer.user.is_login_user} updateWhole={this.updateWhole.bind(this)} acceptAnswerFunc={this.acceptAnswer.bind(this, ans.uuid_id)} answer={ans}/>) }
          </section>
        </div>

        <Dialog
          visible={ this.state.dialogVisible }
          closeOnPressEscape={ true }
          onCancel={ () => this.setState({ dialogVisible: false }) }>
          <Dialog.Body>
            <Form model={this.state.form}>
              <Form.Item>
                <Input
                  type="textarea"
                  placeholder="Markdown syntax supported"
                  autosize={{ minRows: 6, maxRows: 6}}
                  onChange={value => this.updateInputValue(value)}
                  value={this.state.form.content}></Input>
                <div class="content-textarea-preview" dangerouslySetInnerHTML={answerPreviewHtml}/>
              </Form.Item>
            </Form>
          </Dialog.Body>

          <Dialog.Footer className="dialog-footer">
            <Button onClick={ () => this.setState({ dialogVisible: false }) }>Cancel</Button>
            <Button type="primary" onClick={ this.submitForm.bind(this) }>Submit</Button>
          </Dialog.Footer>
        </Dialog>
      </Fragment>
    )
  }
}






export default QADetail
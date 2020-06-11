import React, { Fragment } from 'react';

import { Button, Tabs, Tag } from 'element-react';
import { Link } from "react-router-dom";

import { TMBreadcrumb } from '../Menu';
import QAList from './QAList';
import './QAPage.css';
import { getQuestions, getTagsWithCategory } from '../../api/api';
import moment from 'moment';

class QAPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      answered_questions: [], 
      unanswered_questions: [],
      tags: [],
    };
  }

  componentDidMount() {
    const answered_questions = [];
    const unanswered_questions = [];

    getQuestions()
    .then((response) => {
      response.data.forEach(obj => {
        if (obj.status === 'C') {
          answered_questions.push(obj);
        } else if (obj.status === 'O') {
          unanswered_questions.push(obj);
        }
      })
      this.setState({ answered_questions, unanswered_questions })
      console.log(this.state);
    })
    .catch(console.log)

    getTagsWithCategory('question')
    .then((response) => {
      this.setState({ tags: response.data })
    })
    .catch(console.log)
  }

  compareFunction(q1, q2) {
    if (moment(q1.created_at).isAfter(moment(q2.created_at))) {
      return 1;
    }
    return -1;
  }

  render() {
    let all_q = this.state.answered_questions.concat(this.state.unanswered_questions);
    return (
      <Fragment>
        <TMBreadcrumb currentPath={this.props.location.pathname}/>
        <section className="qa-classify-area">
          <div className="qa-classify-header">
            <h3>Topics Classification</h3>
            <Link className="no-textdecoration" to={`/qa/ask`}><Button type="primary" icon="edit">Ask</Button></Link>
          </div>
          <div className="qa-classify-tag-group">
            { 
              this.state.tags
              .filter(tag => tag.count > 0)
              .map((tag, idx) => <Tag key={idx} className="qa-classify-tag" color="#17a2b8">{tag.count} {tag.name}</Tag>)
            }
          </div>
        </section>
        <section className="Tabs-wrapper">
          <Tabs className="Tabs" type="card" value="1">
            <Tabs.Pane label="Unanswered" name="1">
              <QAList questions={ this.state.unanswered_questions }/>
            </Tabs.Pane>
            <Tabs.Pane label="Answered" name="2">
              <QAList questions={ this.state.answered_questions }/>
            </Tabs.Pane>
            <Tabs.Pane label="All (Answered / Unanswered)" name="3">
              <QAList questions={ 
                all_q.sort(this.compareFunction)
              }/>
            </Tabs.Pane>
          </Tabs>
        </section>
      </Fragment>
    )
  }
}


export default QAPage
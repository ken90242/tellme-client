import React from 'react';

import QA from './QA'



class QAList extends React.Component {
  render() {
    return (
      <div className="qa-list-wrapper">
        { this.props.questions.map((question, idx) => <QA key={idx} question={question}/>) }
      </div>
    )
  }
}


export default QAList
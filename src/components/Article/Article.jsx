import React from 'react';

import { Button, Tag } from 'element-react';
import { Link } from "react-router-dom";
import moment from 'moment'
import './Article.css'

const Article = ({ article }) => {
  const articleContentHtml =  {
    __html: article.content,
  }

  return (
    <div className="article">
      { article.image ? <img alt="article-cover" src={ article.image.file } /> : "" }
      <h3 className="article-title">{ article.title }</h3>
      <div className="article-content">
        <div dangerouslySetInnerHTML={ articleContentHtml }/>
      </div>
      <div className="article-footer">
        <div className="article-footer-left">
          <Link className="no-textdecoration" to={`/user/${article.user.username}`}><span className="article-author">{ article.user.username }</span></Link>
          <span className="article-date">{ moment().to(moment(article.updated_at)) }</span>
          <div className="article-tag-group">
            { article.tags.map((tag, i) => {return <Tag key={i} className="article-tag" color="#17a2b8">{tag}</Tag>}) }
          </div>
        </div>
        <div className="article-footer-right">
          <Link to={ `/article/${article.slug}` }><Button icon="arrow-right" type="primary">Read more</Button></Link>
        </div>
      </div>
    </div>
  )
}


export default Article
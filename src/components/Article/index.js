import React, { Fragment } from 'react';

import { Button, Breadcrumb, Tag } from 'element-react';
import { Link } from "react-router-dom";

import { renderRoutes } from 'react-router-config';
import { TMBreadcrumb } from '../Menu'
import './ArticleList.css'
import Article from './Article'
import { getTagsWithCategory, getArticles } from '../../api/api'

class ArticleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { articles: [ { image: { file: '' }, user: {}, tags: [] } ], tags: [] };
  }

  componentDidMount() {
    
    getArticles()
    .then((response) => {
      this.setState({ articles: response.data })
    })
    .catch(console.log)


    getTagsWithCategory('article')
    .then((response) => {
      this.setState({ tags: response.data })
    })
    .catch(console.log)
  }

  render() {
    return (
      <Fragment>
        { this.state.article }
        <TMBreadcrumb currentPath={this.props.location.pathname} />
        <div className="article-list-wrapper">
          <section className="article-list-left-section">
            { 
              this.state.articles.map((article, i) => <Article key={i} article={article}/>)
            }
          </section>
          <section className="article-list-right-section">
            <div className="functional-buttons">
              <Link className="no-textdecoration" to="/article/post" style={{ marginRight: '4%' }}>
                <Button className="functional-button" icon="edit" type="success">Write</Button>
              </Link>
              <Link className="no-textdecoration" to={`/draft`}>
                <Button className="functional-button" icon="document" type="primary">Draft</Button>
              </Link>
            </div>
            <div className="all-article-tags-card">
              <div className="all-article-tag-card-header">Tags</div>
              <div className="all-article-tag-card-group">
                { 
                  this.state.tags
                  .filter(tag => tag.count > 0)
                  .map((tag, i) => <Tag key={i} className="article-tag" color="#17a2b8">{tag.name}({tag.count})</Tag>)
                }
              </div>
            </div>
          </section>
        </div>
      </Fragment>
    )
  }
}

export default ArticleList

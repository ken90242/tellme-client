import React, { Fragment } from 'react';

import { Button, Breadcrumb, Tag, Input, Message } from 'element-react';
import './ArticleDetail.css'
import { TMBreadcrumb } from '../Menu'
import ArticleComment from './ArticleComment'
import moment from 'moment';
import { Link } from "react-router-dom";

import { addComment, getArticleDetail } from '../../api/api'

class ArticleDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = { commentContent: "", articleDetail: { user: {}, comments: [], image: {}, tags: [] } };
  }

  componentDidMount() {
    getArticleDetail(this.props.match.params.id)
    .then((response) => {
      this.setState({ articleDetail: response.data })
      console.log(this.state.articleDetail.tags);
    })
    .catch(console.log)
  }

  updateInputValue(value) {
    this.setState({commentContent: value});
  }

  postComment() {
    const params = {}
    params['article_slug'] = this.props.match.params.id;
    params['comment'] = this.state.commentContent;

    addComment(params)
    .then((response) => {
      getArticleDetail(this.props.match.params.id)
      .then((response) => {
        this.setState({ articleDetail: response.data })
      })
      .catch(console.log);

      Message.success({
        message: 'Successfully commented',
        customClass: 'element-message',
      });
    })
    .catch(console.log)
    this.updateInputValue("");
  }

  render() {
    const articleContentHtml = { __html: this.state.articleDetail.content }
    return (
      <Fragment>
        <TMBreadcrumb currentPath={this.props.location.pathname}/>
        <div class="article-list-wrapper">
          <section class="article-list-left-section article-detail-wrapper">
            <div class="article-card">
              <h4 class="article-detail-title">{this.state.articleDetail.title}</h4>
              <div class="article-detail-author-post-time-area">
                <span class="article-detail-author">{this.state.articleDetail.user.username}</span>
                <span class="article-detail-post-time">
                  posted {moment().to(moment(this.state.articleDetail.updated_at))}
                </span>
              </div>
              <img class="article-detail-img" src={`${this.state.articleDetail.image.file}`} />
              <div class="article-detail-content" dangerouslySetInnerHTML={ articleContentHtml }/>
            </div>
            <hr/>
            <div class="leave-comment-area">
              <Input
                type="textarea"
                autosize={{ minRows: 2, maxRows: 2}}
                value={this.state.commentContent}
                onChange={value => this.updateInputValue(value)}
                placeholder="Input content"/>
              <Button className="comment-button" type="primary" size="large" onClick={ this.postComment.bind(this) }>Comment</Button>
            </div>
            <div class="comment-list">
              { this.state.articleDetail.comments.map(comment => <ArticleComment comment={comment}/>) }
            </div>
          </section>
          <section class="article-list-right-section">
            <div class="functional-buttons">
              <Link className="no-textdecoration" to="/article/post" style={{ marginRight: '4%' }}>
                <Button className="functional-button" icon="edit" type="success">Write</Button>
              </Link>
              <Link className="no-textdecoration" to={`/draft`}>
                <Button className="functional-button" icon="document" type="primary">Draft</Button>
              </Link>
            </div>
            <div class="all-article-tags-card">
              <div class="all-article-tag-card-header">Tags</div>
              <div class="all-article-tag-card-group">
                { 
                  this.state.articleDetail.tags
                  .map((name, i) => <Tag key={i} className="article-tag" color="#17a2b8">{name}</Tag>)
                }
              </div>
            </div>
          </section>
        </div>
      </Fragment>
    )
  }
}






export default ArticleDetail
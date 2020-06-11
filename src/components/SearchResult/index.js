import React, { Fragment } from 'react';

import { Button, Breadcrumb, Tag, Input, Menu } from 'element-react';
import './SearchResult.css'
import { TMBreadcrumb } from '../Menu'

import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai'
import Article from '../Article/Article'
import News from '../Home/News'
import QA from '../QA/QA'

import { getArticleSearch, getQuestionSearch, getNewsSearch, getUserSearch } from '../../api/api'

class SearchResult extends React.Component {
  constructor(props) {
    super(props);
    const defaultActiveIndex = "1";
    this.state = {
      searchCategoryIndex: defaultActiveIndex,
      newsList: [ { user: { username:'' }, liked: [], thread: [] } ],
      articleList: [],
      questionList: [],
    };
  }

  componentDidMount() {
    getNewsSearch(this.props.match.params.q)
    .then((response) => {
      this.setState({
        newsList: response.data,
      })
    })
    .catch(console.log)
    
    getArticleSearch(this.props.match.params.q)
    .then((response) => {
      this.setState({
        articleList: response.data,
      })
    })
    .catch(console.log)

    getQuestionSearch(this.props.match.params.q)
    .then((response) => {
      this.setState({
        questionList: response.data,
      })
    })
    .catch(console.log)
  }

  render() {
    return (
      <Fragment>
        <TMBreadcrumb currentPath={this.props.location.pathname}/>
        <div class="search-result-wrapper">
          <div class="search-left">
            <Menu defaultActive={this.state.searchCategoryIndex} className="el-menu-vertical-demo" onSelect={this.onSelect.bind(this)}>
              <Menu.Item index="1"><i className="el-icon-message"></i>News</Menu.Item>
              <Menu.Item index="2"><i className="el-icon-menu"></i>Articles</Menu.Item>
              <Menu.Item index="3"><i className="el-icon-setting"></i>Questions</Menu.Item>
            </Menu>
          </div>
          <div class="search-right">
            <section style={this.state.searchCategoryIndex === '1' ? null : { display: 'none' } }>
              <Fragment>
                {
                  this.state.newsList.length > 0 ?
                  this.state.newsList.map(news => <News news={news}/>) :
                  <span>Not Found</span>
                }
              </Fragment>
            </section>
            <section style={this.state.searchCategoryIndex === '2' ? null : { display: 'none' } }>
              <Fragment>
                {
                  this.state.articleList.length > 0 ? 
                  this.state.articleList.map(article => <Article article={article}/>) : 
                  <span>Not Found</span>
                }
              </Fragment>
            </section>
            <section style={this.state.searchCategoryIndex === '3' ? null : { display: 'none' } }>
              <Fragment>
                {
                  this.state.questionList.length > 0 ?
                  this.state.questionList.map(question => <QA question={question}/>) :
                  <span>Not Found</span>
                }
              </Fragment>
            </section>
          </div>
        </div>
      </Fragment>
    )
  }

  onSelect(index) {
    this.setState({
      searchCategoryIndex: index,
    });
  }


}

export default SearchResult
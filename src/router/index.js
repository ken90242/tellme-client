import NewsList from '../components/Home'
import ArticleList from '../components/Article'
import DraftList from '../components/Article/DraftList'
import ArticleDetail from '../components/ArticleDetail'
import QAPage from '../components/QA'
import QADetail from '../components/QADetail'
import UserProfile from '../components/UserProfile'
import PostBlock from '../components/PostBlock'
import Messenger from '../components/Messenger'
import SearchResult from '../components/SearchResult'
import LoginRegister from '../components/LoginRegister'

const routes = [
  {
    path: '/',
    component: NewsList,
    exact: true,
    breadcrumbName: 'Home'
  },
  {
    path: '/login',
    component: LoginRegister,
    breadcrumbName: 'Login'
  },
  {
    path: '/news/:uuid',
    component: NewsList,
    breadcrumbName: 'Home'
  },
  {
    path: '/home',
    component: NewsList,
    breadcrumbName: 'Home'
  },
  {
    path: '/messenger',
    component: Messenger,
    breadcrumbName: 'Messenger'
  },
  {
    path: '/user/:id',
    component: UserProfile,
    breadcrumbName: 'User Profile'
  },
  {
    path: '/search/:q',
    component: SearchResult,
    breadcrumbName: 'Search Result'
  },
  {
    path: '/settings',
    component: UserProfile,
    breadcrumbName: 'Settings'
  },
  {
    path: '/draft',
    component: DraftList,
    breadcrumbName: 'Draft',
    routes: [
      {
        path: '/draft/:id',
        component: PostBlock,
        breadcrumbName: '<Draft Title>'
      }
    ]
  },
  {
    path: '/article',
    component: ArticleList,
    breadcrumbName: 'Article',
    routes: [
      {
        path: '/article/post',
        component: PostBlock,
        breadcrumbName: 'Post Article'
      },
      {
        path: '/article/:id',
        component: ArticleDetail,
        breadcrumbName: '<Article Title>'
      }
    ]
  },
  {
    path: '/qa',
    component: QAPage,
    breadcrumbName: 'Q&A',
    routes: [
      {
        path: '/qa/ask',
        component: PostBlock,
        breadcrumbName: 'Ask Question'
      },
      {
        path: '/qa/:id',
        component: QADetail,
        breadcrumbName: '<Q&A Title>'
      }
    ]
  }
];

export default routes;
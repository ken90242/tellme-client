import axios from 'axios';
import cookie from '../static/js/cookie';

import router from '../router'
import { history } from '../history'
import { Message } from 'element-react';

export const host = 'https://tellme.ken-han.info/api';
// const host = 'https://104.155.218.110:8000';

axios.interceptors.request.use(
  config => {
  if (cookie.getCookie('token')) {  // 每个http header都加上 JWT token
    config.headers.Authorization = `JWT ${ cookie.getCookie('token') }`;
  }
  return config;
},
err => {
  return Promise.reject(err);
});


axios.interceptors.response.use(
  undefined,
  error => {
    let res = error.response;
    let err_msg = "Unknown Error"
    switch (res.status) {
      case 400:
        err_msg = "Please check your internet connection"
      case 401:
        cookie.delCookie("token");
        cookie.delCookie("username");
        // 返回 401 清除token信息并跳转到登录页面
        err_msg = "Please login"
      case 403:
        err_msg = "Lack of permission"
        // console.log('您没有该操作权限');
      case 500:
        err_msg = "Server Error"
      default:
        // Message.error({
        //   message: err_msg,
        //   customClass: 'element-message',
        // });
        history.replace('/login');
    }
    return Promise.reject(error.response.data)   // 返回接口返回的错误信息
});

export const getNews = () => { return axios.get(`${host}/news/`) }

export const getNewsDetail = uuid =>  axios.get(`${host}/news/${uuid}`)

export const addNews = params => axios.post(`${host}/news/`, params)

export const switchNewsLike = uuid => axios.put(`${host}/news/${uuid}/`)

export const deleteNews = uuid => axios.delete(`${host}/news/${uuid}/`)



export const getQuestions = () => { return axios.get(`${host}/question/`) }

export const getQuestionDetail = slug => { return axios.get(`${host}/question/${slug}`) }

export const publishQuestion = params => axios.post(`${host}/question/`, params)



export const getVoteUUID = (category, pk) => axios.get(`${host}/vote/?category=${category}&pk=${pk}`)

export const startVote = params => axios.post(`${host}/vote/`, params)

export const updateVote = (uuid, params) => axios.put(`${host}/vote/${uuid}/`, params)

export const deleteVote = uuid => axios.delete(`${host}/vote/${uuid}/`)



export const createAnswer = params => axios.post(`${host}/answer/`, params)

export const updateAnswer = (uuid_id, params) => axios.put(`${host}/answer/${uuid_id}/`, params)




export const getArticles = () => axios.get(`${host}/article/`)

export const getArticleDetail = slug => { return axios.get(`${host}/article/${slug}`) }

export const publishArticle = params => axios.post(`${host}/draft/`, params)



export const getDrafts = () => axios.get(`${host}/draft/`)

export const getDraftDetail = id => axios.get(`${host}/draft/${id}`)

export const deleteDraftDetail = id => axios.delete(`${host}/draft/${id}`)

export const createDraft = params => axios.post(`${host}/draft/`, params)

export const updateDraft = (id, params) => axios.put(`${host}/draft/${id}/`, params)

export const publishDraft = (id, params) => axios.put(`${host}/draft/${id}/`, params)



export const getUsers = () => axios.get(`${host}/user/`)

export const getUser = name => axios.get(`${host}/user/${name}`)

export const updateUser = (name, params) => axios.put(`${host}/user/${name}/`, params)



export const getArticleSearch = query => axios.get(`${host}/search/article/?q=${query}`)

export const getQuestionSearch = query => axios.get(`${host}/search/question/?q=${query}`)

export const getNewsSearch = query => axios.get(`${host}/search/news/?q=${query}`)

export const getUserSearch = query => axios.get(`${host}/search/user/?q=${query}`)



export const getNotifications = () => axios.get(`${host}/notification/`)

export const deleteNotification = uuid => axios.delete(`${host}/notification/${uuid}/`);

export const updateNotification = (uuid, params) => axios.put(`${host}/notification/${uuid}/`, params)



export const getJWTAuthenticatino = params => axios.post(`${host}/api-token-auth/`, params)

export const checkJWTAuthentication = params => axios.post(`${host}/api-token-verify/`, params)



export const getMessageWithUser = name => axios.get(`${host}/message/${name}/`)

export const addComment = params => axios.post(`${host}/comment/`, params)

export const getMarkdonPreview = params => axios.post(`${host}/markdown/`, params)

export const getTagsWithCategory = category => { return axios.get(`${host}/tags/`, { params: { category } }) }

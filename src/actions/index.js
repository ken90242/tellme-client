import { ADD_ARTICLE } from "../constants/action-types";

export function updateNewsList(payload) {
  return { type: 'UPDATE_NEWSLIST', payload };
}

export function deleteNews(payload) {
  return { type: 'DELETE_NEWS', payload };
}

export function updateNews(payload) {
  return { type: 'UPDATE_NEWS', payload };
}

export function addNews(payload) {
  return { type: 'ADD_NEWS', payload };
}


export function updateNotificationList(payload) {
  return { type: 'UPDATE_NOTIFICATIONLIST', payload };
}

export function addNotification(payload) {
  return { type: 'ADD_NOTIFICATION', payload };
}



export function makeNewsVisble(payload) {
  return { type: 'VISIBLIZE_NEWS', payload };
}

export function makeNewsInvisble(payload) {
  return { type: 'INVISIBLIZE_NEWS', payload };
}

export function resetNewsVisbleList(payload) {
  return { type: 'INIT_VISIBLE_NEWS', payload };
}



export function loginUser(payload) {
  return { type: 'LOGIN', payload };
}

export function logoutUser() {
  return { type: 'LOGOUT' };
}



export function addItem(payload) {
  return { type: 'ADD_ITEM', payload };
}

export function delItem(payload) {
  return { type: 'DEL_ITEM', payload };
}
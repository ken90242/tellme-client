import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { history } from '../history'

function notificationList(state = [], action) {
  switch (action.type) {
    case 'UPDATE_NOTIFICATIONLIST':
    {
      return action.payload.notificationList
    }
    case 'ADD_NOTIFICATION':
    {
      return [action.payload.notification, ...state]
    }
    default:
      return state
  }
}


function newsList(state = [], action) {
  switch (action.type) {
    case 'UPDATE_NEWSLIST':
    {
      return action.payload.newsList
    }
    case 'DELETE_NEWS':
    {
      return state.filter(news => news.uuid_id !== action.payload.uuid_id)
    }
    case 'UPDATE_NEWS':
    {
      const idx = state.findIndex(({ uuid_id }) => uuid_id === action.payload.news.uuid_id);
      console.log(idx);

      if (idx !== -1) {
        state[idx] = action.payload.news;
      }

      return [...state];
    }

    case 'ADD_NEWS':
    {
      return [action.payload.news, ...state];
    }

    default:
      return state
  }
}

function newsVisibleDict(state={}, action) {
  switch (action.type) {
    case 'INIT_VISIBLE_NEWS':
    {
      const new_state = {};

      for (const uuid_id of action.payload.uuid_list) {
        new_state[uuid_id] = false;
      }

      return new_state;
    }
    case 'VISIBLIZE_NEWS':
    {
      const new_state = {};

      for (const uuid_id of Object.keys(state)) {
        new_state[uuid_id] = false;
      }

      new_state[action.payload.uuid_id] = true;

      return new_state;
    }
    case 'INVISIBLIZE_NEWS':
    {
      state[action.payload.uuid_id] = false;
      return {...state};
    }
    default:
      return state;
  }
}

function currentUser(state={}, action) {
  switch (action.type) {
    case 'LOGIN':
    {
      return action.payload.user;
    }
    case 'LOGOUT':
    {
      return {};
    }
    default:
      return state;
  }
}

const itemApp = combineReducers({
  newsList,
  newsVisibleDict,
  currentUser,
  notificationList,
  router: connectRouter(history),
})

export default itemApp
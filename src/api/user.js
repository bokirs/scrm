// import axios from '../libs/api.request.js'
import axios from 'axios'
import https from './https.js'

// export const login = ({ userName, password }) => {
//   const data = {
//     userName,
//     password
//   }
//   return axios.request({
//     url: 'token/login/administrator_B3774FFD16247900AC7A6CA623F0B417',
//     data,
//     method: 'get'
//   })
// }
// 
export const getUserInfo = ( userName, password ) => {
//   return axios.request({
//     url: '/api/v1/token/login/'+ userName + '_' + password,
//     method: 'get'
//   })
	const requestUrl = "/api/v1/token/login/" + userName + "_" + password;	
	console.log( "getUserInfo => requestUrl",requestUrl )
	return https.fetchGet( requestUrl );
}

export const login = (userName, password) => {
	const requestUrl = "/api/v1/token/login/" + userName + "_" + password;	
	return https.fetchGet( requestUrl );
// 	return axios.request({
// 	  url: '/api/v1/token/login/'+ userName + '_' + password,
// 	  method: 'get'
// 	})
}

export const search = ( URL, params ) => {
	https.fetchPost( URL,params );
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}

export const getUnreadCount = () => {
//   return axios.request({
//     url: 'message/count',
//     method: 'get'
//   })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}

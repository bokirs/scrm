import _axios from '@/libs/api.request.js'

export const search = (URL, DATA) => {
	return _axios.request({
		url: URL,
		data: DATA,
		method: 'post',
	})
}

export const _lock = (id,token) => {
	return _axios.request({
		url: '/api/v1/customer/change/'+ token + '_' + id,
		data: {
			"State": 0,
			"Reason": ""
		},
		method: 'PATCH'
	})
}

export const AXIOSrequest = (URL,METHOD,DATA) => {
	const param = {
		url: URL,
		data: DATA,
		method: METHOD,
	}
	return _axios.request(param);
}


export const _post = (URL, DATA) => {
	return _axios.request({
		url: URL,
		data: DATA,
		method: 'post',
	})
}

export const _get = url => {
	return _axios.request({
		url,
		method: 'get'
	})
}

export const _del = (id,token) => {
	return _axios.request({
		url: '/api/v1/customer/delete/'+ token + '_' + id,
		method: 'DELETE'
	})
}

export const login = ({ userName, password }) => {
  const data = {
    userName,
    password
  }
  return _axios.request({
    url: '/api/v1/token/login',
	data: {
		"account": data.userName,
		"passticket": data.password
	},
    method: 'post'
  })
}

export const GlobalMsg = function(data,msg){
	const err = data.data.Err;
	const vue = this;
	if ( !err && data.status === 200 ) {
		if ( !msg ) {
			return
		} else {
			vue.$Message.success( msg );
		}
	} else {
		if ( err === -1000 ) {
			vue.$Message.error( '登录过期! 请重新登录...' );
		} else if ( err === -1007 ) {
			vue.$Message.error( '重复数据！' );
		} else if ( err === -1001 ) {
			vue.$Message.error( '非法操作！' );
		} else if ( err === -1003 ) {
			vue.$Message.error( '账号或者密码错误！' );
		} else if ( err === -1002 ) {
			vue.$Message.error( '信息异常！' );
		} else {
			vue.$Message.error( '操作失败，请您稍后再试！' );
		}
	}
}

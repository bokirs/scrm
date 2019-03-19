import {
  //login,
  logout,
  //getUserInfo,
  getMessage,
  getContentByMsgId,
  hasRead,
  removeReaded,
  restoreTrash,
  getUnreadCount
} from '@/api/user'
//2-12 new
import { login } from '@/api/query.js'
import { 
	setToken, 
	getToken, 
	setRole, 
	getRole, 
	setRealName, 
	getRealName, 
	setAvator, 
	getAvator,
	setCName,
	getCName,
	setAuthority,
	getAuthority
} from '@/libs/util'

export default {
  state: {
    userName: '',
    userId: '',
    avatorImgPath: getAvator(),//头像
    token: getToken(),
    access: '',
    hasGetInfo: false,
    unreadCount: 0,
    messageUnreadList: [],
    messageReadedList: [],
    messageTrashList: [],
    messageContentStore: {},
		RealName: getRealName(), //真实姓名
		Role: getRole(),//角色
		CName: getCName(), //公司名
		Authority: getAuthority(), //账号的权限值
  },
  mutations: {
		setCName (state, CName) {
		  state.CName = CName;
		  setCName(CName);
		},
		setAuthority (state, Authority) {
		  state.Authority = Authority;
		  setAuthority(Authority);
		},
    setRole (state, Role) {
      state.Role = Role;
      setRole(Role);
    },
    setRealName (state, RealName) {
      state.RealName = RealName;
      setRealName(RealName);
    },
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
      setAvator(avatorPath)
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token;
      setToken(token);
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setMessageCount (state, count) {
      state.unreadCount = count
    },
    setMessageUnreadList (state, list) {
      state.messageUnreadList = list
    },
    setMessageReadedList (state, list) {
      state.messageReadedList = list
    },
    setMessageTrashList (state, list) {
      state.messageTrashList = list
    },
    updateMessageContentStore (state, { msg_id, content }) {
      state.messageContentStore[msg_id] = content
    },
    moveMsg (state, { from, to, msg_id }) {
      const index = state[from].findIndex(_ => _.msg_id === msg_id)
      const msgItem = state[from].splice(index, 1)[0]
      msgItem.loading = false
      state[to].unshift(msgItem)
    }
  },
  getters: {
    messageUnreadCount: state => state.messageUnreadList.length,
    messageReadedCount: state => state.messageReadedList.length,
    messageTrashCount: state => state.messageTrashList.length
  },
  actions: {
    // 登录
    handleLogin ({ commit }, {userName, password}) {
      //userName = userName.trim()
		return new Promise((resolve, reject) => {
			login({userName, password}).then(res => {
				resolve(res)
			}).catch(err => {
				reject(err)
			})
		})
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
//         logout(state.token).then(() => {
//           commit('setToken', '')
//           commit('setAccess', [])
//           resolve()
//         }).catch(err => {
//           reject(err)
//         })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        commit('setToken', '')
        commit('setAccess', [])
        resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo({ state, commit }, obj ) {
      return new Promise((resolve, reject) => {
        try {
          login( obj ).then(res => {
						const data = res.data.Data;
            commit("setToken", data.Token);
            commit('setRealName', data.RealName);
            commit('setRole', data.Role);
						commit('setAvator', require('../../assets/images/logox.jpg'));						
            commit('setHasGetInfo', true);
						commit('setCName', data.CName);
						commit('setAuthority', data.Authority);
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    // 此方法用来获取未读消息条数，接口只返回数值，不返回消息列表
    getUnreadMessageCount ({ state, commit }) {
//       getUnreadCount().then(res => {
//         const { data } = res
//         commit('setMessageCount', data)
//       })
    },
    // 获取消息列表，其中包含未读、已读、回收站三个列表
    getMessageList ({ state, commit }) {
      return new Promise((resolve, reject) => {
        getMessage().then(res => {
          const { unread, readed, trash } = res.data
          commit('setMessageUnreadList', unread.sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
          commit('setMessageReadedList', readed.map(_ => {
            _.loading = false
            return _
          }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
          commit('setMessageTrashList', trash.map(_ => {
            _.loading = false
            return _
          }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 根据当前点击的消息的id获取内容
    getContentByMsgId ({ state, commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        let contentItem = state.messageContentStore[msg_id]
        if (contentItem) {
          resolve(contentItem)
        } else {
          getContentByMsgId(msg_id).then(res => {
            const content = res.data
            commit('updateMessageContentStore', { msg_id, content })
            resolve(content)
          })
        }
      })
    },
    // 把一个未读消息标记为已读
    hasRead ({ state, commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        hasRead(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageUnreadList',
            to: 'messageReadedList',
            msg_id
          })
          commit('setMessageCount', state.unreadCount - 1)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 删除一个已读消息到回收站
    removeReaded ({ commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        removeReaded(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageReadedList',
            to: 'messageTrashList',
            msg_id
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 还原一个已删除消息到已读消息
    restoreTrash ({ commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        restoreTrash(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageTrashList',
            to: 'messageReadedList',
            msg_id
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

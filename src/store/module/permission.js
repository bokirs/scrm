// import appAdminRouteData from  '../../router/routers'
import Main from '@/components/main/main.vue'
import { search, _post, _get, _del, _lock, AXIOSrequest } from '@/api/query.js'

// **
//  * 通过meta.role判断是否与当前用户权限匹配
//  * @param roles
//  * @param route
//  */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.indexOf(role) >= 0)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles) {
  	const accessedRouters = asyncRouterMap.filter(route => {
	    if (hasPermission(roles, route)) {
	     	if (route.children && route.children.length) {
		        route.children = filterAsyncRouter(route.children, roles)
	      	}
	      return true
	    }
	    return false
  	})
  	return accessedRouters
}

const permission = {
  	state: {
			addRouters: [
					{
						path: '/login',
						name: 'login',
						meta: {
							title: 'Login - 登录',
							icon: '',
							hideInMenu: true
						},
						component: () => import('@/view/login/login.vue')
					},
					{
						path: '/',
						name: '_home',
						redirect: '/home',
						component: Main,
						meta: {
							hideInMenu: true,
							notCache: true,
							icon: ''
						},
						children: [
							{
								path: '/home',
								name: 'home',
								meta: {
									hideInMenu: true,
									title: '首页',
									notCache: true,
									icon: 'md-home'
								},
								component: () => import('@/view/single-page/home')
							}
						]
					},
					{
						path: '/data',
						name: 'data',
						Id: 30,
						PId: 0,
						component: Main,
						meta: {
							icon: '_icon-yidongduanicon-',
							title: '数据中心'
						},
						children: [
							{
								path: 'report',
								name: 'report',
								Id: 31,
								PId: 30,
								meta: {
									icon: '_baobiao',
									title: '报表管理'
								},
								component: () => import('@/view/data-center/basic_report.vue')        
							}
						]
					},
					{
						path: '/resource',
						name: 'resource',
						component: Main,
						PId: 2,
						Id: 21,
						meta: {
							icon: '_ziyuanguanli',
							title: '资源设置'
						},
						children: [
							{
								path: 'custom_list',
								name: 'custom_list',
								Id: 22,
								PId: 21,
								meta: {
									icon: '_guazhangkehuliebiao',
									title: '客户列表'
								},
								component: () => import('@/view/resource-manage/custom_list.vue')        
							},
							{
								path: 'group_custom',
								name: 'group_custom',
								Id: 29,
								PId: 21,
								meta: {
									icon: '_kehu',
									title: '组内客户'
								},
								component: () => import('@/view/resource-manage/group_custom.vue')        
							},
							{
								path: 'public_resource',
								name: 'public_resource',
								Id: 25,
								PId:21,
								meta: {
									icon: '_tongyongleigongxiangyuan',
									title: '公共资源'
								},
								component: () => import('@/view/resource-manage/public_resource.vue')        
							},
							{
								path: 'signed_custom',
								name: 'signed_custom',
								Id: 28,
								PId:21,
								meta: {
									icon: '_icon_huaban',
									title: '签约客户'
								},
								component: () => import('@/view/resource-manage/signed_custom.vue')        
							},
							{
								path: 'junk_resource',
								name: 'junk_resource',
								Id: 26,
								PId:21,
								meta: {
									icon: '_laji',
									title: '垃圾资源'
								},
								component: () => import('@/view/resource-manage/junk_resource.vue')        
							},
							{
								path: 'batch_import',
								name: 'batch_import',
								Id: 24,
								PId:21,
								meta: {
									icon: '_piliangdaoru',
									title: '批量导入'
								},
								component: () => import('@/view/resource-manage/batch_import.vue')        
							},
							{
								path: 'batch_allot',
								name: 'batch_allot',
								Id: 27,
								PId:21,
								meta: {
									icon: '_zhengshifuwushangliebiao-',
									title: '批量分配'
								},
								component: () => import('@/view/resource-manage/batch_allot.vue')        
							}
						]
					},
					{
						path: '/system',
						name: 'system',
						Id: 1,
						PId: 0,
						component: Main,
						meta: {
							icon: '_xitongpeizhi',
							title: '系统设置'
						},
						children: [
							{
								path: 'account',
								name: 'account',
								Id: 3,
								PId: 1,
								meta: {
									icon: '_yonghuguanli',
									title: '所有员工管理'
								},
								component: () => import('@/view/system-manage/account.vue')        
							},
							{
								path: 'role',
								name: 'role',
								Id: 9,
								PId: 1,
								meta: {
									icon: '_yonghuguanli1',
									title: '系统角色设置'
								},
								component: () => import('@/view/system-manage/role.vue')        
							},
							{
								path: 'custom',
								name: 'custom',
								Id: 15,
								PId: 1,
								meta: {
									icon: '_kehu1',
									title: '客户来源管理'
								},
								component: () => import('@/view/system-manage/custom.vue')        
							},
							{
								path: 'company',
								name: 'company',
								Id: 5,
								PId: 1,
								meta: {
									icon: '_gongsixinxi',
									title: '公司开户管理'
								},
								component: () => import('@/view/system-manage/company.vue')        
							}
						]
					},
					{
						path: '/message',
						name: 'message',
						component: Main,
						meta: {
							icon: '',
							hideInBread: true,
							hideInMenu: true
						},
						children: [
							{
								path: 'message_page',
								name: 'message_page',
								meta: {
									icon: 'md-notifications',
									title: '消息中心'
								},
								component: () => import('@/view/single-page/message/index.vue')
							}
						]
					},
					{
						path: '/error_store',
						name: 'error_store',
						meta: {
							icon: '',
							hideInBread: true,
							hideInMenu: true
						},
						component: Main,
						children: [
							{
								path: 'error_store_page',
								name: 'error_store_page',
								meta: {
									icon: 'ios-bug',
									title: '错误收集'
								},
								component: () => import('@/view/error-store/error-store.vue')
							}
						]
					},
					{
						path: '/error_logger',
						name: 'error_logger',
						meta: {
							hideInBread: true,
							hideInMenu: true,
							icon: ''
						},
						component: Main,
						children: [
							{
								path: 'error_logger_page',
								name: 'error_logger_page',
								meta: {
									icon: 'ios-bug',
									title: '错误收集'
								},
								component: () => import('@/view/single-page/error-logger.vue')
							}
						]
					},
					{
						path: '/401',
						name: 'error_401',
						meta: {
							icon: '',
							hideInMenu: true
						},
						component: () => import('@/view/error-page/401.vue')
					},
					{
						path: '/500',
						name: 'error_500',
						meta: {
							icon: '',
							hideInMenu: true
						},
						component: () => import('@/view/error-page/500.vue')
					},
					{
						path: '*',
						name: 'error_404',
						meta: {
							icon: '',
							hideInMenu: true
						},
						component: () => import('@/view/error-page/404.vue')
					}
			],
			// addButtons: [],
			// initRouters: [],
			// Authority: null
  	},
  	mutations: {
	    // SET_ROUTERS: (state, routers) => {
			// 		console.log(routers, 'routerssss')
			// 		state.addRouters = routers
			// },
			// SET_BUTTONS: (state, data) => {
			// 	state.addButtons = data
			// },
			// SET_AUTHORITY: (state, data) => {
			// 	state.addButtons = data
			// },
  	},
  	actions: {
	    // GenerateRoutes({ commit }, data) {
	    //   	return new Promise(resolve => {     
			// 				commit('SET_ROUTERS', data);
			// 				resolve()
	    //   	})
			// },
			// setButtonList({commit}, data) {
			// 	return new Promise(resolve => {     
			// 		commit('SET_BUTTONS', data);
			// 		resolve()
			// 	})
			// },
			// SetAuthority({commit}, data) {
			// 	return new Promise(resolve => {     
			// 		commit('SET_AUTHORITY', data);
			// 		resolve()
			// 	})
			// }
		},
		getters: {
			// routersInfo: state => {
			// 	return state.addRouters
			// },
			// btnData: state => {
			// 	return state.addButtons 
			// }
		}
}

export default permission


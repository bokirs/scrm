import Cookies from 'js-cookie'
import math from 'mathjs'
import Vue from 'vue'
// cookie保存的天数
import config from '@/config'
import { forEach, hasOneOf, objEqual } from '@/libs/tools'
// import lazyLoading from '../router/lazyLoading'
import xlsx from 'xlsx'
import { AST_Null } from 'terser';
const { title, cookieExpires, useI18n } = config

const TOKEN_KEY = 'token'
const ROLE_KEY = 'role'
const READLNAME_KEY= 'RealName'
const AVATOR_KEY = 'avator'
const COMPANY_NAME_KEY = "CName"
const AUTHORITY_KEY = "Authority"

const ROUTER_KEY = 'router'

// 递归操作树形结构配置 
/**
 * @param {Array} list  数组
 *  @param {Number}   默认父级ID
 * @returns {=result} s递归数组结构
 */
export const fncc = (data, pid) => {
        var result = [], temp;
        for (var i in data) {
            if (data[i].PId == pid) {
                result.push(data[i])
                temp = fncc(data, data[i].Id)
                if (temp.length > 0) {
                  data[i].children = []
                  data[i].children = temp
                }
            }
        }
  return result
}

// 过滤匹配对应的值取出中文名字
/**
 * @param {Array} list  数组
 * @returns {String} rel  中文字段  
 */
export const filterCway = (list, value) => { 
  let rel = null
  list.map(item => {
    if (item.value === value) {
        rel = item.label
      }
    })
  return rel
}


//  兼容获取classname类名
/**
 * @param {object} node  例如 document 
 *  @param {string} className  classname  类名
 * @returns {String} classname  类名
 */
export const getElementsByClassName = (node, classname) => {
  if (node.getElementsByClassName) {
      return node.getElementsByClassName(classname);
  } else {
      var results = new Array()
      var elems = node.getElementsByTagName("*");
      for (var i = 0; i < elems.length; i++) {
          if (elems[i].className.indexOf(classname) != -1) {
              results[results.length] = elems[i]
          }
      }
      return results
  }
}

// 设置权限按钮匹配字段
/**
 * @param {Array} list 数组 
 * @returns {Object} 添加有权限值对应的字段，用来绑定v-author  例如 v-author=“o.add”
 */
export const swicthCase = (list) => {
  let o = {}
  list.map(item => {
    switch(item) {
      case 0:
      o.add = 0 // 则增
      break
      case 1: 
      o.del = 1 // 删
      break
      case 2:
      o.updat = 2 // 修改
      break
      case 3:
      o.dis = 3 // 分配
      break
      case 4:
      o.recover = 4 // 还原
      break
      case 5:
      o.reset = 5 // 重置
      break	
      case 99: //查询
      o.search = 99				
    }
  })
  return o
}

// 取值权限值得计算
/**
 * @param {NuMber} value setAutorArr 里传来的value
 * @param {numeber} Authority 首次请求获取的权限值
 * @param {Array} AuthorArr 默认传来空数组
 * @param {returns} AuthorArr 计算之后的值push空数组
 * 
 */
export const setAuthorFunc = (value) => {
  return math.pow(2, value)
}
export const setAutorArr = (Authority, AuthorArr) => {
    let result = math.log(Authority, 2)
    AuthorArr.push(math.floor(result))
    if (Authority <= 0 || result == 0 || result == 1 || result == 2 || result == 3 || result == 4 || result == 5) {
        return AuthorArr
    } else {
        Authority -= setAuthorFunc(math.floor(result))
        setAutorArr(Authority, AuthorArr)
    }
    return AuthorArr
}

// 数组去重
/**
 * @param {Array} arrays 
 * 
 */
export const uniq = (array) => {
  var temp = []; 
  for(var i = 0; i < array.length; i++){
      if(temp.indexOf(array[i]) == -1){
          temp.push(array[i]);
      }
  }
  return temp
}

// 设置存储本地浏览器路由和删除 
export const setRoute = (route) => {
  window.localStorage.setItem(ROUTER_KEY, route)
}

// 设置获取本地浏览器路由和删除 
export const getRoute = () => {
  const route =  window.localStorage.getItem(ROUTER_KEY)
  if (route) return route
  else return false
}
// 设置删除本地浏览器路由和删除 
export const removeRoute = () => {
  window.localStorage.removeItem(ROUTER_KEY)
}

export const setToken = (token) => {
  Cookies.set(TOKEN_KEY, token, {expires: cookieExpires || 1})
}

export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY)
  if (token) return token
  else return false
}

export const hasChild = (item) => {
  return item.children && item.children.length !== 0
}

// 保存当前登录账号的公司名
export const setCName = CName => Cookies.set(COMPANY_NAME_KEY, CName, { expires: cookieExpires || 1 })

// 获取公司名
export const getCName = () => {
	const CName = Cookies.get(COMPANY_NAME_KEY);
	return !!CName ? CName : "";
}

/* 保存账户的权限值 */
export const setAuthority = Authority => Cookies.set(AUTHORITY_KEY, Authority, { expires: cookieExpires || 1 })

// 获取权限值
export const getAuthority = () => {
	const Authority = Cookies.get(AUTHORITY_KEY);
	return !!Authority ? Authority : 0;
}

// 设置当前登录名保存状态
export const setRealName = (RealName) => {
  Cookies.set(READLNAME_KEY, RealName, {expires: cookieExpires || 1})
}

export const getRealName = () => {
  const RealName = Cookies.get(READLNAME_KEY)
  if (RealName) return RealName
  else return ""
}

export const setRole = (Role) => {
  Cookies.set(ROLE_KEY, Role, {expires: cookieExpires || 1})
}

export const getRole = () => {
  const Role = Cookies.get(ROLE_KEY)
  if (Role) return Role
  else return false
}

export const getAvator = () => {
  const Avator = Cookies.get(AVATOR_KEY)
  if(Avator) return Avator
  else return false
}

export const setAvator = (Avator) => {
  Cookies.set(AVATOR_KEY, Avator, {expires: cookieExpires || 1})
}
const showThisMenuEle = (item, access) => {
  if (item.meta && item.meta.access && item.meta.access.length) {
    if (hasOneOf(item.meta.access, access)) return true
    else return false
  } else return true
}
/**
 * @param {Array} list 通过路由列表得到菜单列表
 * @returns {Array}
 */
export const getMenuByRouter = (list, access) => {
  let res = []
  forEach(list, item => {
    if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
      let obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: item.meta
      }
      if ((hasChild(item) || (item.meta && item.meta.showAlways)) && showThisMenuEle(item, access)) {
        obj.children = getMenuByRouter(item.children, access)
      }
      if (item.meta && item.meta.href) obj.href = item.meta.href
      if (showThisMenuEle(item, access)) res.push(obj)
    }
  })
  return res
}

/**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 */
export const getBreadCrumbList = (route, homeRoute) => {
  let homeItem = { ...homeRoute, icon: homeRoute.meta.icon }
  let routeMetched = route.matched
  if (routeMetched.some(item => item.name === homeRoute.name)) return [homeItem]
  let res = routeMetched.filter(item => {
    return item.meta === undefined || !item.meta.hideInBread
  }).map(item => {
    let meta = {...item.meta}
    if (meta.title && typeof meta.title === 'function') {
      meta.__titleIsFunction__ = true
      meta.title = meta.title(route)
    }
    let obj = {
      icon: (item.meta && item.meta.icon) || '',
      name: item.name,
      meta: meta
    }
    return obj
  })
  res = res.filter(item => {
    return !item.meta.hideInMenu
  })
  return [{...homeItem, to: homeRoute.path}, ...res]
}

export const getRouteTitleHandled = (route) => {
  let router = {...route}
  let meta = {...route.meta}
  let title = ''
  if (meta.title) {
    if (typeof meta.title === 'function') {
      meta.__titleIsFunction__ = true
      title = meta.title(router)
    } else title = meta.title
  }
  meta.title = title
  router.meta = meta
  return router
}

export const showTitle = (item, vm) => {
  let { title, __titleIsFunction__ } = item.meta
  if (!title) return
  if (useI18n) {
    if (title.includes('{{') && title.includes('}}') && useI18n) title = title.replace(/({{[\s\S]+?}})/, (m, str) => str.replace(/{{([\s\S]*)}}/, (m, _) => vm.$t(_.trim())))
    else if (__titleIsFunction__) title = item.meta.title
    else title = vm.$t(item.name)
  } else title = (item.meta && item.meta.title) || item.name
  return title
}

/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = list => {
  localStorage.tagNaveList = JSON.stringify(list)
}
/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export const getTagNavListFromLocalstorage = () => {
  const list = localStorage.tagNaveList
  return list ? JSON.parse(list) : []
}

/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = (routers, homeName = 'home') => {
  let i = -1
  let len = routers.length
  let homeRoute = {}
  while (++i < len) {
    let item = routers[i]
    if (item.children && item.children.length) {
      let res = getHomeRoute(item.children, homeName)
      if (res.name) return res
    } else {
      if (item.name === homeName) homeRoute = item
    }
  }
  return homeRoute
}

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
  const { name, path, meta } = newRoute
  let newList = [...list]
  if (newList.findIndex(item => item.name === name) >= 0) return newList
  else newList.push({ name, path, meta })
  return newList
}

/**
 * @param {*} access 用户权限数组，如 ['super_admin', 'admin']
 * @param {*} route 路由列表
 */
const hasAccess = (access, route) => {
  if (route.meta && route.meta.access) return hasOneOf(access, route.meta.access)
  else return true
}

/**
 * 权鉴
 * @param {*} name 即将跳转的路由name
 * @param {*} access 用户权限数组
 * @param {*} routes 路由列表
 * @description 用户是否可跳转到该页
 */
export const canTurnTo = (name, access, routes) => {
  const routePermissionJudge = (list) => {
    return list.some(item => {
      if (item.children && item.children.length) {
        return routePermissionJudge(item.children)
      } else if (item.name === name) {
        return hasAccess(access, item)
      }
    })
  }

  return routePermissionJudge(routes)
}

/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = url => {
  const keyValueArr = url.split('?')[1].split('&')
  let paramObj = {}
  keyValueArr.forEach(item => {
    const keyValue = item.split('=')
    paramObj[keyValue[0]] = keyValue[1]
  })
  return paramObj
}

/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextRoute = (list, route) => {
  let res = {}
  if (list.length === 2) {
    res = getHomeRoute(list)
  } else {
    const index = list.findIndex(item => routeEqual(item, route))
    if (index === list.length - 1) res = list[list.length - 2]
    else res = list[index + 1]
  }
  return res
}

/**
 * @param {Number} times 回调函数需要执行的次数
 * @param {Function} callback 回调函数
 */
export const doCustomTimes = (times, callback) => {
  let i = -1
  while (++i < times) {
    callback(i)
  }
}

/**
 * @param {Object} file 从上传组件得到的文件对象
 * @returns {Promise} resolve参数是解析后的二维数组
 * @description 从Csv文件中解析出表格，解析成二维数组
 */
export const getArrayFromFile = (file) => {
  let nameSplit = file.name.split('.')
  let format = nameSplit[nameSplit.length - 1]
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.readAsText(file) // 以文本格式读取
    let arr = []
    reader.onload = function (evt) {
      let data = evt.target.result // 读到的数据
      let pasteData = data.trim()
      arr = pasteData.split((/[\n\u0085\u2028\u2029]|\r\n?/g)).map(row => {
        return row.split('\t')
      }).map(item => {
        return item[0].split(',')
      })
      if (format === 'csv') resolve(arr)
      else reject(new Error('[Format Error]:你上传的不是Csv文件'))
    }
  })
}

/**
 * @param {Array} array 表格数据二维数组
 * @returns {Object} { columns, tableData }
 * @description 从二维数组中获取表头和表格数据，将第一行作为表头，用于在iView的表格中展示数据
 */
export const getTableDataFromArray = (array) => {
  let columns = []
  let tableData = []
  if (array.length > 1) {
    let titles = array.shift()
    columns = titles.map(item => {
      return {
        title: item,
        key: item
      }
    })
    tableData = array.map(item => {
      let res = {}
      item.forEach((col, i) => {
        res[titles[i]] = col
      })
      return res
    })
  }
  return {
    columns,
    tableData
  }
}

export const findNodeUpper = (ele, tag) => {
  if (ele.parentNode) {
    if (ele.parentNode.tagName === tag.toUpperCase()) {
      return ele.parentNode
    } else {
      return findNodeUpper(ele.parentNode, tag)
    }
  }
}

export const findNodeUpperByClasses = (ele, classes) => {
  let parentNode = ele.parentNode
  if (parentNode) {
    let classList = parentNode.classList
    if (classList && classes.every(className => classList.contains(className))) {
      return parentNode
    } else {
      return findNodeUpperByClasses(parentNode, classes)
    }
  }
}

export const findNodeDownward = (ele, tag) => {
  const tagName = tag.toUpperCase()
  if (ele.childNodes.length) {
    let i = -1
    let len = ele.childNodes.length
    while (++i < len) {
      let child = ele.childNodes[i]
      if (child.tagName === tagName) return child
      else return findNodeDownward(child, tag)
    }
  }
}

export const showByAccess = (access, canViewAccess) => {
  return hasOneOf(canViewAccess, access)
}

/**
 * @description 根据name/params/query判断两个路由对象是否相等
 * @param {*} route1 路由对象
 * @param {*} route2 路由对象
 */
export const routeEqual = (route1, route2) => {
  const params1 = route1.params || {}
  const params2 = route2.params || {}
  const query1 = route1.query || {}
  const query2 = route2.query || {}
  return (route1.name === route2.name) && objEqual(params1, params2) && objEqual(query1, query2)
}

/**
 * 判断打开的标签列表里是否已存在这个新添加的路由对象
 */
export const routeHasExist = (tagNavList, routeItem) => {
  let len = tagNavList.length
  let res = false
  doCustomTimes(len, (index) => {
    if (routeEqual(tagNavList[index], routeItem)) res = true
  })
  return res
}

export const localSave = (key, value) => {
  localStorage.setItem(key, value)
}

export const localRead = (key) => {
  return localStorage.getItem(key) || ''
}

// scrollTop animation
export const scrollTop = (el, from = 0, to, duration = 500, endCallback) => {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60)
      }
    )
  }
  const difference = Math.abs(from - to)
  const step = Math.ceil(difference / duration * 50)

  const scroll = (start, end, step) => {
    if (start === end) {
      endCallback && endCallback()
      return
    }

    let d = (start + step > end) ? end : start + step
    if (start > end) {
      d = (start - step < end) ? end : start - step
    }

    if (el === window) {
      window.scrollTo(d, d)
    } else {
      el.scrollTop = d
    }
    window.requestAnimationFrame(() => scroll(d, end, step))
  }
  scroll(from, to, step)
}

/**
 * @description 根据当前跳转的路由设置显示在浏览器标签的title
 * @param {Object} routeItem 路由对象
 * @param {Object} vm Vue实例
 */
export const setTitle = (routeItem, vm) => {
  const handledRoute = getRouteTitleHandled(routeItem)
  const pageTitle = showTitle(handledRoute, vm)
  const resTitle = pageTitle ? `${title} - ${pageTitle}` : title
  window.document.title = resTitle
}
export const initRouterNode = function (routers, data) {
  console.log(routers, data, '初始化路由节点')
  for (var item of data) {
    console.log(item, 'item')
    // console.log(item, 'aaa')
    //   let menu = Object.assign({}, item);
    //   console.log(menu, 'menu')
    //   menu.component = lazyLoading(menu.component);

    //   if (item.children && item.children.length > 0) {
    //       menu.children = [];
    //       util.initRouterNode(menu.children, item.children);
    //   }
    //   //添加权限判断
    //   meta.permission = menu.permission ? menu.permission : null;
    //   //添加标题
    //   meta.title = menu.title ? menu.title : null;
    //   menu.meta = meta;
  }
}




/**
* 导出JOSN数据为EXECL文件
*
* @param {*} data 需要导出的JSON数据列表
* @param {*} options 配置参数

* @param {*} options.header  Array 例： [ {label: '姓名'， value: 'name'} ]
* @param {*} options.name  String 默认： sheetjs.xlsx
*/
export const export_execl = function (data, options) {
    options = options ? options : {}

    if (!xlsx) {
        throw new Error('导出失败，请执行 yarn add xlsx 安装依赖包')
        return
    }

    if(!data || !data instanceof Array || !data[0] instanceof Object) {
        throw new Error('导出数据格式错误，请检查传入数据')
        return
    }

    let sheetHeader = []
    let sheeltHeaderValue = []
    let sheetBody = []

    try {
        // 格式化数据
        if(options.header && options.header instanceof Array) {
            sheetHeader = options.header.map(m => {return m.label})
            sheeltHeaderValue = options.header.map(m => {return m.value})
        }else {
            sheetHeader = sheeltHeaderValue = data[0].map(m => {return Object.keys(m)})
        }
        sheetBody = data.map( m => {
            if(m instanceof Object) {
                return sheeltHeaderValue.map( n => {
                    return m[n]
                })
            }
        })
        
        sheetBody.unshift(sheetHeader)

        const ws = xlsx.utils.aoa_to_sheet(sheetBody);
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, "SheetJS");
        xlsx.writeFile(wb, options.name?options.name:'sheetjs.xlsx');

    } catch (error) {
        throw new Error(`执行异常，请检查参数是否正确 ：${error}`)
    }
}
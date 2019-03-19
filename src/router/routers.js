import Main from '@/components/main/main.vue'
/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
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
    PId: 0,
    Id: 2,
    meta: {
      icon: '_ziyuanguanli',
      title: '资源设置'
    },
    children: [
      {
        path: 'custom_list',
        name: 'custom_list',
        Id: 22,
        PId: 2,
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
        PId: 2,
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
        PId:2,
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
        PId:2,
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
        PId:2,
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
        PId:2,
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
        PId:2,
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
    PId: 0,
    Id: 1,
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
          title: '用户列表'
        },
        component: () => import('@/view/system-manage/account.vue')        
      },
      {
        path: 'role',
        name: 'role',
        Id: 10,
        PId: 1,
        meta: {
          icon: '_yonghuguanli1',
          title: '系统角色'
        },
        component: () => import('@/view/system-manage/role.vue')        
      },
      {
        path: 'custom',
        name: 'custom',
        Id: 16,
        PId: 1,
        meta: {
          icon: '_kehu1',
          title: '客户来源'
        },
        component: () => import('@/view/system-manage/custom.vue')        
      },
      {
        path: 'company',
        name: 'company',
        Id: 19,
        PId: 1,
        meta: {
          icon: '_gongsixinxi',
          title: '公司部门'
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
]

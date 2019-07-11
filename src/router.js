import Index from './main.vue'

const mainchild = [{
    path: 'home',
    title: '首页',
    name: 'home_index',
    component: resolve => {
      require(['./views/home/home.vue'], resolve)
    }
  },
  {
    path: 'queryready',
    title: '查询申请进度',
    name: 'queryready',
    component: resolve => {
      require(['./views/query/refer.vue'], resolve)
    }
  },
  {
    path: 'querypage',
    title: '查询',
    name: 'querypage',
    component: resolve => {
      require(['./views/query/querySql.vue'], resolve)
    }
  },
  {
    path: 'querylist',
    title: '查询审计详情',
    name: 'querylist',
    component: resolve => {
      require(['./components/orderExpend.vue'], resolve)
    }
  },
  {
    path: 'orderlist',
    title: '工单详情',
    name: 'orderlist',
    component: resolve => {
      require(['./components/myorderList.vue'], resolve)
    }
  },
  {
    path: 'myorder',
    name: 'myorder',
    title: '我的工单',
    icon: 'person',
    component: resolve => {
      require(['./views/order/myOrder.vue'], resolve)
    }
  }
]

export const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录'
  },
  component: resolve => {
    require(['./login.vue'], resolve)
  }
}

export const locking = {
  path: '/locking',
  name: 'locking',
  component: resolve => {
    require(['./components/locking-page.vue'], resolve)
  }
}

export const page401 = {
  path: '/401',
  meta: {
    title: '401-权限不足'
  },
  name: 'error_401',
  component: resolve => {
    require(['./views/error/401.vue'], resolve)
  }
}

export const appRouter = [{
    path: '/',
    icon: 'md-home',
    name: 'main',
    title: '首页',
    component: Index,
    redirect: '/home',
    children: [
      ...mainchild
    ]
  },
  {
    path: '/order',
    icon: 'md-folder',
    name: 'order',
    title: '工单提交',
    component: Index,
    children: [{
        path: 'ddl',
        name: 'ddl',
        title: 'DDL',
        icon: 'md-git-merge',
        meta: {
          keepAlive: true
        },
        component: resolve => {
          require(['./views/order/ddlOrder.vue'], resolve)
        }
      },
      {
        path: 'dml',
        name: 'dml',
        title: 'DML',
        icon: 'md-code',
        meta: {
          keepAlive: true
        },
        component: resolve => {
          require(['./views/order/dmlOrder.vue'], resolve)
        }
      }
    ]
  },
  {
    path: '/view',
    icon: 'md-search',
    name: 'view',
    title: '查询',
    component: Index,
    children: [{
      path: 'query',
      name: 'query',
      title: 'SQL查询',
      icon: 'ios-podium',
      component: resolve => {
        require(['./views/query/workFlow.vue'], resolve)
      }
    }]
  },
  {
    path: '/audit',
    icon: 'md-open',
    name: 'audit',
    title: '审核',
    component: Index,
    access: 0,
    children: [{
        path: 'audit-order',
        name: 'audit-audit',
        title: '工单',
        icon: 'md-create',
        component: resolve => {
          require(['./views/audit/sqlAudit.vue'], resolve)
        }
      },
      // {
      //   path: 'audit-permissions',
      //   name: 'audit-permissions',
      //   title: '权限',
      //   icon: 'md-share',
      //   component: resolve => {
      //     require(['./views/audit/permissions.vue'], resolve)
      //   }
      // },
      {
        path: 'query-audit',
        name: 'query-audit',
        title: '查询',
        icon: 'logo-rss',
        component: resolve => {
          require(['./views/audit/queryAudit.vue'], resolve)
        }
      }
    ]
  },
  {
    path: '/record',
    icon: 'md-pie',
    name: 'record',
    title: '记录',
    component: Index,
    access: 0,
    children: [
      {
        path: 'audit-record',
        name: 'audit-record',
        title: '工单审计',
        icon: 'md-list',
        component: resolve => {
          require(['./views/assistantManger/record.vue'], resolve)
        }
      },
      {
        path: 'query-review',
        name: 'query-review',
        title: '查询审计',
        icon: 'md-pulse',
        component: resolve => {
          require(['./views/assistantManger/queryRecord.vue'], resolve)
        }
      }

    ]
  },
  {
    path: '/management',
    icon: 'logo-buffer',
    name: 'management',
    title: '管理',
    access: 0,
    component: Index,
    children: [{
        path: 'management-user',
        name: 'management-user',
        title: '用户',
        icon: 'md-people',
        component: resolve => {
          require(['./views/management/userInfo.vue'], resolve)
        }
      },
      {
        path: 'management-database',
        name: 'management-database',
        title: '数据库',
        icon: 'md-medal',
        component: resolve => {
          require(['./views/management/databaseManager.vue'], resolve)
        }
      },
      {
        path: 'authGroup',
        name: 'authGroup',
        title: '用户权限',
        icon: 'ios-switch',
        component: resolve => {
          require(['./views/management/authGroup.vue'], resolve)
        }
      },
      {
        path: 'setting',
        name: 'setting',
        title: '设置',
        icon: 'md-settings',
        component: resolve => {
          require(['./views/management/setting.vue'], resolve)
        }
      }
    ]
  }
]

export const MainRoute = [
  loginRouter,
  locking,
  ...appRouter,
  page401
]

import Login from './components/login/login'
import Home from './components/home/home'
import NotFound from './components/404/404'
import Main from './views/system/main/main'
import HomePage from './views/system/home/home'
import Users from './views/system/users/users'
import Catg from './views/system/catg/catg'
import SchemeLibs from './views/scheme/SchemeLibs/SchemeLibs'
import MaterialLibs from './views/material/materialLibs/materialLibs'
import ProductLibs from './views/product/productLibs/productLibs'
import Exhibition from './views/panorama/exhibition/exhibition'
import DataChart from './views/data/chart/chart'
import DataSurvey from './views/data/survey/survey'

let routes = [
  {
    path: '/login',
    component: Login,
    name: '',
    hidden: true
  },
  {
      path: '/404',
      component: NotFound,
      name: '',
      hidden: true
  },
  {
    path: '/',
    component: Home,
    name: '系统管理',
    iconCls: 'fa fa-cog',
    children: [
      {path: '/home', component: HomePage, name: '首页', hidden: true},
      {path: '/main', component: Main, name: '个人中心'},
      {path: '/users', component: Users, name: '用户管理'},
      // {path: '/catg', component: Catg, name: '栏目管理'}
    ]
  },
  {
    path: '/',
    component: Home,
    name: '方案管理',
    iconCls: 'fa fa-camera',
    children: [
      {path: '/SchemeLibs', component: SchemeLibs, name: '方案库'}
    ]
  },
  // {
  //   path: '/',
  //   component: Home,
  //   name: '素材管理',
  //   iconCls: 'fa fa-picture-o',
  //   children: [
  //     {path: '/materialLibs', component: MaterialLibs, name: '素材库'}
  //   ]
  // },
  {
    path: '/',
    component: Home,
    name: '产品管理',
    iconCls: 'fa fa-cubes',
    children: [
      {path: '/productLibs', component: ProductLibs, name: '产品库'}
    ]
  },
  {
    path: '/',
    component: Home,
    name: '数据',
    iconCls: 'fa fa-pie-chart',
    children: [
      {path: '/data/chart', component: DataChart, name: '推荐表单'},
      {path: '/data/survey', component: DataSurvey, name: '装修意向表'}
    ]
  },
  {
    path: '/',
    component: Home,
    name: '全景',
    iconCls: 'fa fa-globe',
    children: [
      {path: '/exhibition', component: Exhibition, name: '展厅'}
    ]
  },
  {
      path: '*',
      hidden: true,
      redirect: { path: '/404' }
  }

]

export default routes

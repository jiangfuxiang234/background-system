import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  // const hasToken = getToken()
  
  const hasGetUserInfo = store.getters.user; // 获取本地用户信息
  if(to.meta.auth){ // 需要鉴权
    if(hasGetUserInfo){ // 看是否有用户信息，有用户信息就直接进入
      next() 
    }else{ // 没有用户信息，看是否有token
      const hasToken = localStorage.getItem('adminToken'); // 获取token
      if(hasToken){ // 有token，需要进行验证token的有效性
          try{  // 验证成功
               await store.dispatch('user/getInfo')
               next()
          } catch(error){ // 验证失败
               await store.dispatch('user/resetToken'); // 重置无效的token
               Message.error('登录过期，请重新登录');
               next(`/login?redirect=${to.path}`)
               NProgress.done();
          }
      }else{ // 没有token则需要登录跳转到登陆页
        next(`/login?redirect=${to.path}`) // 带上目标地址，登陆后直接跳到该目标地址
        NProgress.done();
      }
    }
  }else{ // 不需要鉴权
    if(to.path === '/login' && hasGetUserInfo){ // 在登录状态进login就跳转到首页
      next({path: '/'})
    }else{
      next() // 直接进
    }
    NProgress.done(); // 结束进度条
  }
  // 下面是 vue-elemement-admin 原本的鉴权流程
  // if (hasToken) {
  //   if (to.path === '/login') {
  //     // if is logged in, redirect to the home page
  //     next({ path: '/' })
  //     NProgress.done()
  //   } else {
  //     const hasGetUserInfo = store.getters.name
  //     if (hasGetUserInfo) {
  //       next()
  //     } else {
  //       try {
  //         // get user info
  //         await store.dispatch('user/getInfo')

  //         next()
  //       } catch (error) {
  //         // remove token and go to login page to re-login
  //         await store.dispatch('user/resetToken')
  //         Message.error(error || 'Has Error')
  //         next(`/login?redirect=${to.path}`)
  //         NProgress.done()
  //       }
  //     }
  //   }
  // } else {
  //   /* has no token*/

  //   if (whiteList.indexOf(to.path) !== -1) {
  //     // in the free login whitelist, go directly
  //     next()
  //   } else {
  //     // other pages that do not have permission to access are redirected to the login page.
  //     next(`/login?redirect=${to.path}`)
  //     NProgress.done()
  //   }
  // }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

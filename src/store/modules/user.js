import { loginApi, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { Message } from 'element-ui'

const getDefaultState = () => {
  return {
    user: null
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // SET_TOKEN: (state, token) => {
  //   state.token = token
  // },
  // SET_NAME: (state, name) => {
  //   state.name = name
  // },
  SET_USER: (state, payload) => {
    state.user = payload
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      loginApi(userInfo).then(res => {
        const { data } = res
        if (data) { // 如果data有数据，说明验证成功
          commit('SET_USER', data) // 将data存进仓库
          resolve()
        } else {
          reject(res)
        }
      }).catch(error => {
        reject(error)
      })
    })

    // const { username, password } = userInfo
    // return new Promise((resolve, reject) => {
    //   login({ username: username.trim(), password: password }).then(response => {
    //     const { data } = response
    //     commit('SET_TOKEN', data.token)
    //     setToken(data.token)
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // 发送请求
      getInfo().then(res => {

        // 验证成功的情况 object
        // {
        //   "code": 0,
        //   "msg": "",
        //   "data": {
        //     "loginId": "yjisme",
        //     "name": "管理员",
        //     "id": "608530d2dfce8783ab52a45d"
        //   }
        // }
        //  验证失败的情况 string
        // {"code":401,"msg":"未登录，或登录已过期","data":null} 

          if(typeof res === 'string'){
            // 未登录，或者 token 已经过期
            res = JSON.parse(res);
            if(res.code === 401){
              reject(res.msg)
            }
          }else{
            // 说明这个 token 是 OK 的，将用户信息放入到仓库
            commit('SET_USER', res.data);
            resolve()
          }
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      resolve()
      // 退出登录不是使用的'logout'api进行退出
      // logout(state.token).then(() => {
      //   removeToken() // must remove  token  first
      //   resetRouter()
      //   commit('RESET_STATE')
      //   resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


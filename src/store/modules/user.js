
import httpRequest from '@/api/http-api'
import { setUser, getUser, removeUser, setRoleIds, removeRoleIds, removeSession, setSession ,removeDataCenterRequestConfig} from '@/utils/auth'
import user_icon from '@/assets/bg/user_icon.png'
import {md5} from 'api/md5'

const user = {
  state: {
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, {userInfo,token}) {
      if (token && !userInfo) {
        return new Promise((resolve, reject) => {
          resolve(token)
        })
      }
      const username = userInfo.Username.trim()
      return new Promise((resolve, reject) => {
        let params = {
          Username: username,
          Password: md5(userInfo.Password),
          grant_type: 'password',
          client_id: 'erp-web',
          client_secret: 'mapsoft123'
        }
        httpRequest.userLogin(params).then(req => {
            resolve(req.access_token)

          // setSession('Bearer ' + req.access_token)
          // 获取用户信息
          // httpRequest.getUserInfo({}).then(res => {
          // if (res.head.result === '200') {
          //     let data = {
          //       user_id: res.context.i_id,
          //       user_name: res.context.c_name,
          //       department_id: res.context.department_id ? Number(res.context.department_id) : '',
          //       join_company: res.context.join_company,
          //       position_name: res.context.position_name,
          //       position_id: res.context.position_id,
          //     }
          //     let date = new Date().getTime()
          //     date = date + 24 * 60 * 60 * 1000
          //     data.date = date
          //     setUser(JSON.stringify(data))
          //     resolve(res)
          //   } else {
          //     reject(res.head.describle)
          //   }
          // }).catch(error => {
          //   reject(error)
          // })
        }).catch(error => {
          reject(error.data.error_description)
        })
      })
    },
    // 获取用户信息
    getUserInfo({ dispatch,commit },{userInfo,token}) {
        return dispatch('Login',{userInfo,token}).then(access_token => {
        setSession('Bearer ' + access_token)
        return new Promise((resolve,reject) => {
          httpRequest.getUserInfo({}).then(res => {
            if (res.head.result === '200') {
              let data = {
                user_id: res.context.i_id,
                user_name: res.context.c_name,
                department_id: res.context.department_id ? Number(res.context.department_id) : '',
                join_company: res.context.join_company,
                position_name: res.context.position_name,
                position_id: res.context.position_id,
                dept_name: res.context.dept_name,
            }
              let date = new Date().getTime()
              date = date + 24 * 60 * 60 * 1000
              data.date = date
              setUser(JSON.stringify(data))
              res.token = access_token
              resolve(res)
            } else {
              reject(res.head.describle)
            }
          }).catch(error => {
            reject(error)
          })
        })
      })

      return new Promise((resolve,reject) => {
        httpRequest.getUserInfo({}).then(res => {
          if (res.head.result === '200') {
            let data = {
              user_id: res.context.i_id,
              user_name: res.context.c_name,
              department_id: res.context.department_id ? Number(res.context.department_id) : '',
              join_company: res.context.join_company,
              position_name: res.context.position_name,
              position_id: res.context.position_id,
            }
            let date = new Date().getTime()
            date = date + 24 * 60 * 60 * 1000
            data.date = date
            setUser(JSON.stringify(data))
            resolve(res)
          } else {
            reject(res.head.describle)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 更新token
    updateToken({ commit }, code) {
      return new Promise((resolve, reject) => {
        httpRequest.updateToken({code :code}).then(req => {
          if (req.head.result === '200') {
            let data = {
              user_id: req.context.basic_info.i_id,
              user_name: req.context.basic_info.c_name,
              login_id: '',
              department_id: req.context.basic_info.department_id ? Number(req.context.basic_info.department_id) : ''
            }
            let date = new Date().getTime()
            date = date + 24 * 60 * 60 * 1000
            data.date = date
            setUser(JSON.stringify(data))
            setSession(req.context.access_token)
            resolve(req)
          } else {
            reject(req.head.describle)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 权限获取
    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (getUser()) {
          let user = JSON.parse(getUser())
          commit('SET_ROLES', 1)
          setRoleIds(1)
          commit('SET_NAME', user.user_name)
          commit('SET_AVATAR', user_icon)
          resolve(user)
        } else {
          reject('登录失败')
        }
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        try {
          commit('SET_ROLES', [])
          removeUser()
          removeRoleIds()
          removeSession()
          removeDataCenterRequestConfig()
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        removeUser()
        removeRoleIds()
        removeSession()
        removeDataCenterRequestConfig()
        resolve()
      })
    }
  }
}

export default user

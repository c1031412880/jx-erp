import Cookies from 'js-cookie'
import {RC4, decryptRC4} from 'api/md5'
import Vue from 'vue'
const AppId = 'ERP-WEB-'

const TokenKey = 'Admin-Token'

const Session = 'Session-id'

const UserInfo = 'Admin-User'

const RoleIds = 'Admin-Role'

const AlarmConfig = 'AlarmConfig'

const alarmAllAlert = 'alarmAllAlert'

// 获取弹窗配置项
export function getAlarmAllAlert() {
  if (getUser()) {
    return Cookies.get(AppId + alarmAllAlert + JSON.parse(getUser()).user_id)
  } else {
    return ''
  }
}

// 设置弹窗配置
export function setAlarmAllAlert(bool) {
  if (getUser()) {
    Cookies.set(AppId + alarmAllAlert + JSON.parse(getUser()).user_id, bool)
  }
}

// 获取报警设置
export function getAlarmConfig() {
  return Cookies.get(AppId + AlarmConfig)
}
// 修改报警设置
export function setAlarmConfig(config) {
  Cookies.set(AppId + AlarmConfig, config)
}

// 获取用户
export function getUser() {
  return decryptRC4(Cookies.get(AppId + UserInfo))
}

// 设置用户
export function setUser(info) {
  return Cookies.set(AppId + UserInfo, RC4(info))
}

// 获取Session-id
export function getSession() {
  return decryptRC4(Cookies.get(AppId + Session))
}

// 设置Session-id
export function setSession(id) {
  return Cookies.set(AppId + Session, RC4(id))
}

// 删除sessionid
export function removeSession() {
  return Cookies.remove(AppId + Session)
}

// 删除用户
export function removeUser() {
  return Cookies.remove(AppId + UserInfo)
}

// 获取Token
export function getToken() {
  return decryptRC4(Cookies.get(AppId + TokenKey))
}

// 设置Token
export function setToken(token) {
  return Cookies.set(AppId + TokenKey, RC4(token))
}

// 删除Token
export function removeToken() {
  return Cookies.remove(AppId + TokenKey)
}

// 获取权限
export function getRoleIds() {
  return decryptRC4(Cookies.get(AppId + RoleIds))
}

// 设置权限
export function setRoleIds(power) {
  return Cookies.set(AppId + RoleIds, RC4(power))
}

// 删除权限
export function removeRoleIds() {
  return Cookies.remove(AppId + RoleIds)
}

// 删除中台数据
export function removeDataCenterRequestConfig() {
  return Vue.prototype.$removeDataCenterRequestConfig()
}
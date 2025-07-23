import { get } from '@/axios'
// const BASE_URL = process.env.BASE_URL
// 获取组织机构根节点
// export const GET_DEPT_ROOT = () => get( BASE_URL + 'depRoot.json' )
export const GET_DEPT_ROOT = () => require('../../public/depRoot.json')
console.log('GET_DEPT_ROOT',GET_DEPT_ROOT)

// 根据部门id获取分页人员信息
// export const GET_PAGE_EMPLOYEE = data => get( BASE_URL + 'userData.json', data )
export const GET_PAGE_EMPLOYEE = () => require('../../public/userData.json')
console.log('GET_PAGE_EMPLOYEE',GET_PAGE_EMPLOYEE)

// 获取组织机构子节点
// export const GET_DEPT_TREE = data => get( BASE_URL + 'depChild.json', data )
export const GET_DEPT_TREE = () => require('../../public/depChild.json')
console.log('GET_DEPT_TREE',GET_DEPT_TREE)

// 获取组织机构下人员信息
// export const GET_USER_BY_DEPT = data => get( BASE_URL + 'userData.json', data )
export const GET_USER_BY_DEPT = () => require('../../public/userData.json')
console.log('GET_USER_BY_DEPT',GET_USER_BY_DEPT)

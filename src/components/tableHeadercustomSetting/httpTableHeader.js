import httpRequest from '../../api/http-api'
import { getUser } from '@/utils/auth'
import { Message, MessageBox } from 'element-ui'

// 获取头部信息
/**
 *
 * @param {String} menu_code  页面标识符code
 * @param {Array} customSettingList  页面全部的表头
 */

export default {
  reqTableHeader(menu_code, customSettingList) {
    let canRendererTableHeaderInfo = {
      titlesId: '',
      canRendererTableHeader: customSettingList,
      customSettingList: customSettingList,
      customSettingShowList: customSettingList
    }
    return new Promise((resolve, reject) => {
      httpRequest.GetTitleTableOrder({ menu_code: menu_code }).then(res => {
        if (res.head.result === '200') {
          canRendererTableHeaderInfo.titlesId = !!res.context.id ? res.context.id : ''
          if (!!res.context.titles) {
            canRendererTableHeaderInfo.canRendererTableHeader = res.context.titles.filter(
              item => item.isSelected
            )
            canRendererTableHeaderInfo.customSettingShowList = res.context.titles
            canRendererTableHeaderInfo.customSettingShowList.forEach((item, index) => {
              item.id = index + 1
              item.signIndex = index
            })
            let exportMultipleSelection = []
            canRendererTableHeaderInfo.canRendererTableHeader.forEach((item, index) => {
              let exportMultipleSelectionObj = {
                id: index + 1,
                label: item.label,
                prop: item.prop,
                width: item.width,
                align: item.align,
                notTooltip: item.notTooltip,
                signIndex: index,
                sortable: false
              }
              if (!!item.nestedTablesHeader) {
                exportMultipleSelectionObj.nestedTablesHeader = item.nestedTablesHeader
              }
              if (item.sortable == 'custom') {
                exportMultipleSelectionObj.sortable = item.sortable
              } else if (item.sortable == 'true' || item.sortable == true) {
                exportMultipleSelectionObj.sortable = true
              } else {
                exportMultipleSelectionObj.sortable = false
              }
              exportMultipleSelection.push(exportMultipleSelectionObj)
            })
            canRendererTableHeaderInfo.canRendererTableHeader = exportMultipleSelection
          }
          resolve(canRendererTableHeaderInfo)
        } else {
          Message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
          reject(res.head.result)
        }
      })
    })
  },

  /**
   *
   * @param {Number} id  表头id
   * @param {String,Number} code  页面标识符code
   *  @param {Array} content  用户当前保存的表头
   */
  saveTableHeader(id, code, content) {
    let user_id = Number(JSON.parse(getUser()).user_id) || '' //当前用户id
    let params = {
      context: {
        id: id,
        code: code,
        content: JSON.stringify(content),
        user_id: user_id
      }
    }
    if (!id) {
      delete params.context.id
    }
    return new Promise((resolve, reject) => {
      httpRequest.AddOrEidtTableOrder(params).then(res => {
        if (res.head.result === '200') {
          Message({
            showClose: true,
            message: res.head.describle,
            type: 'success'
          })
          resolve(res.head.result)
        } else {
          Message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
          reject(res.head.result)
        }
      })
    })
  }
}

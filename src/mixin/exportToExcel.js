import importToExcel from '@/utils/exportToExcel/index'
import { deepCopy } from '@/utils/index'
export default {
  methods: {
    // excel 导出
    /**
     * 
     * @param { string }  table_dom   要导出的表格 dom
     * @param { string }  name        导出的文件名
     * @param { string }  className   要导出的表格class名    用以区分一个页面多个表格的情况
     * @param {  Array }  title_arr   标题 存在多行表头
     * @param {  Array }  sign_arr    落款 存在多行落款
     * @param { string }  style       导出的表格样式
     * @param { string }  page        导出纵向还是横向   暂时没有启用
    */

    // 导出
    exportToExcel(
        table_dom = '',
        name = 'Workbook',
        className = '',
        title_arr= [],
        sign_arr= [],
        style = '',
        page = '',
      ) {
      let table_dom_copy = deepCopy(table_dom)
      let fix_name = '.el-table__fixed'
      let tds_name = '.el-table__footer td'
      let row_name = '.el-table__row'
      // 多表格的情况  根据对应的class 名来获取
      if (className) {
        fix_name = `.${className} .el-table__fixed`
        tds_name = `.${className} .el-table__footer td`
        row_name = `.${className} .el-table__row`
      }
      // 如果有固定列  会导致导出两份  干掉他
      let fix = document.querySelector(fix_name);//如果是都给了fixed样式
      if (fix) {
        table_dom_copy.removeChild(fix);
      }

      // 如果有合计行   可能会有随机的合并情况   全部给他改成 rowspan为 1
      let tds = document.querySelectorAll(tds_name)
      for (let index = 0; index < tds.length; index++) {
        tds[index].setAttribute('rowspan', '1')
      }

      // 计算需要合并的行数 
      let L = document.querySelector(row_name).childElementCount

      let title_dom = this.getTitle(title_arr,L)
      let sign_dom = this.getSignOff(sign_arr,L)
      let excelInfo = {
        name: name,
        style: style,
        page: page,
        sheets: {
          content: table_dom_copy.innerHTML,
          titles: title_dom,
          signOff: sign_dom,
        }
      };
      importToExcel(excelInfo)
      // if (fix) {
      //   // 删完 再补回来
      //   this.$nextTick(() => {
      //     table_dom_copy.appendChild(fix);
      //   })
      // }
    },
    // 设计标题
    getTitle(arr,l) {
      if (arr.length == 0) return ''
      let str = ''
      arr.forEach(item => {
        let dom = `
          <tr style="border-color:#fff">
            <td colspan="${l}" style="text-align:center;font-size:18px;font-weight:Blob;border-color:#fff">${item}</td>
          </tr>
        `
        str += dom
      });
      return str
    },
    // 设计落款 
    getSignOff(arr,l) {
      if (arr.length == 0) return ''
      let str = ''
      arr.forEach(item => {
        let dom = `
          <tr>
            <td colspan="${l}" style="text-align:right;">${item}</td>
          </tr>
        `
        str += dom
      });

      return `<table>${str}</table>`
    },
  }
}
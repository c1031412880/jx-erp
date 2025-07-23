<template>
  <tr-dialog :visible="dialogBool" title="包车详情" @before-close="dialogClose" width="80%" top="0">
    <div class="el-dialog-div">
      <el-form :model="form" ref="form" class="demo-form" size="mini">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="用车单位:" prop="use_uint">
              <el-input v-model="form.use_uint" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用车时间:" prop="user_name">
              <el-date-picker
                v-model="date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                style="width: 100%"
                disabled
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="车型:" prop="car_type">
              <el-select v-model="form.car_type" placeholder="请选择" disabled style="width: 100%">
                <el-option label="大客" :value="1"></el-option>
                <el-option label="中客" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人:" prop="contact_person">
              <el-input v-model="form.contact_person" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话:" prop="contact_phone">
              <el-input v-model="form.contact_phone" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="费用:" prop="sure_fee">
              <el-input v-model="form.sure_fee" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col
            :span="6"
            v-if="
              (haveRule && form.one_fee) ||
              (userInfo.dept_name == '一分公司' && form.dept_name.includes('一分公司'))
            "
          >
            <el-form-item label="一分公司费用:" prop="one_fee">
              <el-input
                v-model="form.one_fee"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                @blur="form.one_fee = $event.target.value"
                disabled
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col
            :span="6"
            v-if="
              (haveRule && form.two_fee) ||
              (userInfo.dept_name == '二分公司' && form.dept_name.includes('二分公司'))
            "
          >
            <el-form-item label="二分公司费用:" prop="two_fee">
              <el-input
                v-model="form.two_fee"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                @blur="form.two_fee = $event.target.value"
                disabled
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col
            :span="6"
            v-if="
              (haveRule && form.three_fee) ||
              (userInfo.dept_name == '三分公司' && form.dept_name.includes('三分公司'))
            "
          >
            <el-form-item label="三分公司费用:" prop="three_fee">
              <el-input
                v-model="form.three_fee"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                @blur="form.three_fee = $event.target.value"
                disabled
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col
            :span="6"
            v-if="
              (haveRule && form.four_fee) ||
              (userInfo.dept_name == '四分公司' && form.dept_name.includes('四分公司'))
            "
          >
            <el-form-item label="四分公司费用:" prop="four_fee">
              <el-input
                v-model="form.four_fee"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                @blur="form.four_fee = $event.target.value"
                disabled
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col
            :span="6"
            v-if="
              (haveRule && form.five_fee) ||
              (userInfo.dept_name == '五分公司' && form.dept_name.includes('五分公司'))
            "
          >
            <el-form-item label="五分公司费用:" prop="five_fee">
              <el-input
                v-model="form.five_fee"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                @blur="form.five_fee = $event.target.value"
                disabled
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="工单说明:" prop="work_order_description">
              <el-input v-model="form.work_order_description" type="textarea" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: 20px">
            <image-file-upload
              :images="form.img_list"
              :isShowFiles="false"
              showTitle="包车合同"
              :isShowBox="false"
            ></image-file-upload>
          </el-col>
          <el-col :span="24" style="margin-bottom: 20px" v-if="tableTabs.length > 0">
            <el-tabs v-model="tabsValue" type="card">
              <el-tab-pane
                v-for="(item, index) in tableTabs"
                :key="item.name"
                :label="item.title"
                :name="item.name"
              >
                <el-button
                  style="margin-bottom: 10px"
                  type="primary"
                  size="small"
                  @click="printTable(form, item)"
                >
                  打印
                </el-button>
                <tx-table
                  :data="item.data"
                  :tableHeaderList="canRendererTableHeader"
                  :TableHeight="TableHeight"
                  :colFields="colFields"
                  :mergekeys="mergekeys"
                  :mergeAgain="mergeAgain"
                  :topKeys="topKeys"
                ></tx-table>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </tr-dialog>
</template>

<script>
import { getUser } from '@/utils/auth'
import imageFileUpload from '@/components/imageFileUpload/index'
import txTable from '@/view/operational-analysis/car-charter-filling/component/tx-table'
import { formatDate, deepCopy, uuid } from '@/utils/index'
import ordinaryPrint from './ordinary-print'
import largecarPrint from './largecar-print'
import Vue from 'vue'
export default {
  components: {
    imageFileUpload,
    txTable
  },
  props: {
    dialogBool: Boolean,
    haveRule: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      date: [],
      userInfo: {},
      form: {
        use_uint: '',
        car_type: '',
        use_start_time: '',
        use_end_time: '',
        contact_person: '',
        contact_phone: '',
        sure_fee: '',
        dept_name: '',
        work_order_description: '',
        img_list: [],
        one_fee: '',
        two_fee: '',
        three_fee: '',
        four_fee: '',
        five_fee: '',
        data: []
      },
      TableHeight: 300,
      canRendererTableHeader: [
        {
          id: 1,
          label: '起点',
          prop: 'start_point',
          width: '120',
          align: 'center',
          signIndex: 0
        },
        {
          id: 2,
          label: '用车时间',
          prop: 'usege_time',
          width: '80',
          align: 'center',
          signIndex: 1
        },
        {
          id: 3,
          label: '终点',
          prop: 'end_point',
          width: '120',
          align: 'center',
          signIndex: 2
        },
        {
          id: 4,
          label: '分公司',
          prop: 'dept_name',
          width: '80',
          align: 'center',
          signIndex: 3
        },
        {
          id: 5,
          label: '用车数',
          prop: 'vehicles_num',
          width: '80',
          align: 'center',
          signIndex: 4
        },
        // {
        //   id: 6,
        //   label: "费用",
        //   prop: "cost",
        //   width: "80",
        //   align: "center",
        //   signIndex: 5,
        // },
        {
          id: 6,
          label: '车号',
          prop: 'vehicle_name',
          width: '120',
          align: 'center',
          signIndex: 5
        },
        {
          id: 7,
          label: '驾驶员',
          prop: 'driver_name',
          width: '120',
          align: 'center',
          signIndex: 6
        },
        {
          id: 8,
          label: '驾驶员电话',
          prop: 'phone',
          width: '120',
          align: 'center',
          signIndex: 7
        },
        {
          id: 9,
          label: '备注',
          prop: 'remark',
          width: '150',
          align: 'center',
          signIndex: 8
        }
      ],
      tableTabs: [],
      tabsValue: '1',
      colFields: [
        'start_point',
        'usege_time',
        'end_point',
        'dept_name',
        'vehicles_num',
        // 'cost',
        'vehicle_name',
        'driver_name',
        'phone',
        'remark'
      ],
      mergekeys: [
        'start_point',
        'usege_time',
        'end_point',
        'dept_name',
        'vehicles_num'
        // 'cost',
      ],
      topKeys: ['start_point', 'usege_time', 'end_point'],
      mergeAgain: true
    }
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data())
      } else {
        this.userInfo = JSON.parse(getUser())
      }
    }
  },
  methods: {
    setData(info) {
      console.log(info, 'feiyongchakan')

      for (const key in info) {
        if (Object.hasOwnProperty.call(this.form, key)) {
          this.form[key] = info[key]
        }
      }
      this.date = [this.form.use_start_time, this.form.use_end_time]
      this.assemblyData(info)
    },
    // 组装数据
    assemblyData(info) {
      let data = info.details
      this.tableTabs = []
      let list = []
      // 根据车辆数 拆分成对应数量的数据
      data.forEach(item => {
        list.push(item)
      })
      // list.forEach(item => {
      //   item.mergekeys = item.start_point + item.dept_name
      // })
      let vehicle_use_time_info = {}
      let i = 0
      // 根据用车时间 生成对应tabs
      list.forEach((item, index) => {
        if (!vehicle_use_time_info[item.vehicle_use_time]) {
          vehicle_use_time_info[item.vehicle_use_time] = 1
          let obj = {
            name: ++i,
            title: this.dateConversion(item.vehicle_use_time),
            vehicle_use_time: item.vehicle_use_time,
            data: []
          }
          obj.name = obj.name + ''
          this.tableTabs.push(obj)
        }
      })

      // 循环匹配
      list.forEach(item => {
        this.tableTabs.forEach(child => {
          if (item.vehicle_use_time == child.vehicle_use_time) {
            child.data.push(item)
          }
        })
      })
    },
    // 日期转换
    dateConversion(date) {
      let month = new Date(date).getMonth() + 1
      let days = new Date(date).getDate()
      return `${month}月${days}日`
    },
    dialogClose() {
      this.$emit('update:dialogBool', false)
    },
    printTable(form, tableData) {
      console.log(form, 'form')
      console.log(tableData, 'tableData')
      let printContent
      let style = ''
      if (this.form.chariot_type == 1) {
        // 普通包车
        printContent = Vue.extend(ordinaryPrint)
        style = ``
      } else {
        // 大型用车
        printContent = Vue.extend(largecarPrint)
        style = `
          * {
            margin: 0;
            padding: 0;
          }
          html,
          body {
            width: 1000px;
            padding: 10px;
          }
          /* 确保表格合并边框，避免重叠 */
          .el-table {
            width: 100%;
            border-collapse: collapse;
            border-right: 1px solid black;
            border-bottom: 1px solid black;
          }

          /* 设置表头和表格主体单元格的边框 */
          .el-table th,
          .el-table td {
            border: 1px solid black; /* 设置每个单元格的边框为 1px */
            box-sizing: border-box; /* 确保边框不影响整体尺寸 */
          }

          /* 单独处理表头的底部边框，避免和主体单元格的边框重叠 */
          .el-table__header-wrapper th {
            border-bottom: 1px solid black; /* 设置表头单元格的底部边框 */
          }

          .el-table__body-wrapper td {
            border-top: 1px solid black; /* 设置主体单元格的顶部边框 */
          }

          .title {
            font-size: 20px;
            color: #000;
            text-align: center;
            margin-top: 20px;
            margin-bottom: 20px;
            font-weight: bold;
          }
        `
      }
      const instance = new printContent({
        propsData: {
          form: form,
          tableData: tableData
        }
      })
      instance.$mount()

      // 创建新窗口
      const printWindow = window.open('', '_blank')
      printWindow.document.write('<html><head><title>打印</title>')
      printWindow.document.write(
        '<link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">'
      )
      printWindow.document.write(`<style>${style}</style>`) // 添加样式

      printWindow.document.write('</head><body>')
      printWindow.document.write('</body></html>')
      printWindow.document.close()
      printWindow.document.body.appendChild(instance.$el)

      // 等待新窗口加载完成后打印
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
        }, 500)
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.text {
  white-space: pre;
}
</style>

<template>
  <el-form ref="form" size="mini" :model="form" :rules="rules" label-suffix=":">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="申请人" prop="user_id">
          <get-department-select
            ref="personalTree"
            v-model="form.user_id"
            :isShowCheckbox="false"
            :placeholder="'请选择申请人'"
            :isContainEmp="true"
            :show_all="true"
            :isExportMultiple="false"
            :disabled="isShowSelectUser || isAgain"
            @on-change="selectedUser"
          ></get-department-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="所在部门" prop="dept_id">
          <el-select
            v-model="form.dept_id"
            style="width: 100%"
            @change="dateChange"
            :disabled="!deptList.length"
            placeholder="请选择所在部门"
          >
            <el-option
              v-for="item in deptList"
              :key="item.dept_id"
              :label="item.dept_name"
              :value="item.dept_id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="配置期" prop="set_date_start">
          <el-date-picker
            style="width: 100%"
            v-model="date"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="selectDateChange"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="配置明细">
          <tr-table
            ref="table"
            :selectionShow="false"
            :indexShow="false"
            :data="tableData"
            :tableHeaderList="customSettingList"
            :TableHeight="TableHeight"
            :frontFixedNum="frontFixedNum"
            :backFixedNum="backFixedNum"
            :highlightCurrentRow="false"
            :customSpanMethodFun="customSpanMethodFun"
          >
            <template slot-scope="scope" slot="type">
              <div class="gray">{{ scope.index < 2 ? '男' : '女' }}</div>
            </template>
            <template slot-scope="scope" slot="num_fee">
              <div class="gray">{{ scope.index % 2 ? '金额' : '数量' }}</div>
            </template>
            <template slot-scope="scope" slot="count">
              <el-input-number
                v-model="scope.data.count"
                :precision="0"
                :min="0"
                placeholder="请输入"
                :controls="false"
                style="width: 100%"
                @change="countChange(scope.data.count, scope.index)"
              ></el-input-number>
            </template>
            <template
              v-for="item in ['one', 'two', 'three', 'four', 'five']"
              slot-scope="scope"
              :slot="item"
            >
              <el-input-number
                v-model="scope.data[item]"
                :precision="scope.index % 2 ? 2 : 0"
                :min="0"
                placeholder="请输入"
                :controls="false"
                style="width: 100%"
                @change="calculatePrice"
              ></el-input-number>
            </template>
            <template slot-scope="scope" slot="subtotal">
              <div class="gray">{{ scope.data.subtotal }}</div>
            </template>
            <template slot-scope="scope" slot="total_fee">
              <div class="gray">{{ scope.data.total_fee }}</div>
            </template>
          </tr-table>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="申请配置说明" prop="remark">
          <el-input
            type="textarea"
            :rows="6"
            placeholder="请输入申请配置说明"
            maxlength="300"
            show-word-limit
            v-model="form.remark"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" style="margin-bottom: 20px">
        <image-file-upload
          :images="form.thumbnail_imgs"
          :files="form.files_list"
          @files-update-success="filesUpdateSuccess"
          @images-update-success="imagesUpdateSuccess"
        ></image-file-upload>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { getUser } from '@/utils/auth'
import { formatTime, deepCopy } from '@/utils/index'
import imageFileUpload from '@/components/imageFileUpload/index'
import getDepartmentSelect from '@/components/base/formModel/tree/get-department-select-tree'
import getSelectDictionaries from '@/components/base/formModel/select/get-select-dictionaries/list'
import common from './common/index'
export default {
  name: 'bus-decoration-maintenance-form',
  components: {
    imageFileUpload,
    getDepartmentSelect,
    getSelectDictionaries
  },
  mixins: [common],
  props: {
    dialogBool: {
      type: Boolean,
      default: false
    },
    isShowSelectUser: {
      type: Boolean,
      default: true
    },
    isAgain: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      date: [],
      form: {
        user_id: null,
        dept_id: null,
        set_date_start: '',
        set_date_end: '',
        remark: '',
        files_list: [],
        thumbnail_imgs: [],
        id: 0
      },
      clothesMap: {
        one: '短袖二件',
        two: '长袖二件',
        three: '夏裤二条',
        four: '西服一衣二裤',
        five: '冬衣一件'
      },
      customSettingList: [
        {
          id: 1,
          label: '类别',
          prop: 'type',
          width: '80',
          align: 'center',
          signIndex: 0,
          notTooltip: true
        },
        {
          id: 2,
          label: '人数',
          prop: 'count',
          width: '130',
          align: 'center',
          signIndex: 1,
          notTooltip: true
        },
        {
          id: 3,
          label: '',
          prop: 'num_fee',
          width: '80',
          align: 'center',
          signIndex: 2,
          notTooltip: true
        },
        {
          id: 4,
          label: '短袖二件',
          prop: 'one',
          width: '130',
          align: 'center',
          signIndex: 3,
          notTooltip: true
        },
        {
          id: 5,
          label: '长袖二件',
          prop: 'two',
          width: '130',
          align: 'center',
          signIndex: 4,
          notTooltip: true
        },
        {
          id: 6,
          label: '夏裤二条',
          prop: 'three',
          width: '130',
          align: 'center',
          signIndex: 5,
          notTooltip: true
        },
        {
          id: 7,
          label: '西服一衣二裤',
          prop: 'four',
          width: '130',
          align: 'center',
          signIndex: 6,
          notTooltip: true
        },
        {
          id: 8,
          label: '冬衣一件',
          prop: 'five',
          width: '130',
          align: 'center',
          signIndex: 7,
          notTooltip: true
        },
        {
          id: 9,
          label: '小计',
          prop: 'subtotal',
          width: '130',
          align: 'center',
          signIndex: 8,
          notTooltip: true
        },
        {
          id: 10,
          label: '总金额(元)',
          prop: 'total_fee',
          width: '130',
          align: 'center',
          signIndex: 9,
          notTooltip: true
        }
      ],
      tableData: [
        {
          count: undefined,
          one: undefined,
          two: undefined,
          three: undefined,
          four: undefined,
          five: undefined,
          subtotal: '',
          total_fee: ''
        },
        {
          count: undefined,
          one: undefined,
          two: undefined,
          three: undefined,
          four: undefined,
          five: undefined,
          subtotal: '',
          total_fee: ''
        },
        {
          count: undefined,
          one: undefined,
          two: undefined,
          three: undefined,
          four: undefined,
          five: undefined,
          subtotal: '',
          total_fee: ''
        },
        {
          count: undefined,
          one: undefined,
          two: undefined,
          three: undefined,
          four: undefined,
          five: undefined,
          subtotal: '',
          total_fee: ''
        }
      ],
      TableHeight: 300,
      frontFixedNum: 0, //前几行固定
      backFixedNum: 0, //后几行固定
      oldForm: null, // 历史草稿数据   用来比较是否修改
      deptList: [],
      rules: {
        user_id: [
          {
            required: true,
            message: '请选择报修人',
            trigger: 'change'
          }
        ],
        dept_id: [
          {
            required: true,
            message: '请选择所在部门',
            trigger: 'change'
          }
        ],
        set_date_start: [
          {
            required: true,
            message: '请选择配置期',
            trigger: 'change'
          }
        ],
        remark: [
          {
            required: true,
            message: '请输入申请配置说明',
            trigger: 'change'
          }
        ]
      },
      dept_id: null,
      changeNum: 0
    }
  },
  watch: {
    dialogBool() {
      if (!this.dialogBool) {
        this.$refs.personalTree.onClear()
        Object.assign(this.$data.form, this.$options.data().form)
      } else {
        this.$nextTick(() => {
          this.$refs['form'].resetFields()
        })
      }
    }
  },
  methods: {
    // 初始化数据
    initSet(info) {
      if (!!info) {
        for (const key in this.form) {
          if (Object.hasOwnProperty.call(info, key) && key != 'dept_id') {
            this.form[key] = info[key]
          }
        }
        this.dept_id = JSON.parse(JSON.stringify(info.dept_id))
        this.getData(info)
      } else {
        this.form.repair_date = formatTime(new Date(), 'yyyy-MM-dd')
        if (getUser()) {
          let userInfo = JSON.parse(getUser())
          this.form.user_id = Number(userInfo.user_id)
          this.dept_id = Number(userInfo.department_id)
        }
      }
    },
    selectDateChange(value) {
      if (value) {
        this.form.set_date_start = value[0]
        this.form.set_date_end = value[1]
      } else {
        this.form.set_date_start = ''
        this.form.set_date_end = ''
      }
    },
    // 保存草稿时的校验   必填项只要有一个填了  即可保存草稿   除申请人和申请部门
    saveDraft() {
      return new Promise((resolve, reject) => {
        let data = []
        for (const key in this.rules) {
          if (key != 'user_id' && key != 'dept_id') {
            data.push(key)
          }
        }
        let validList = []
        this.$refs.form.validateField(data, valid => {
          validList.push(valid)
        })
        // 判断是否有已填写项   只要有一个就可以走保存
        if (validList.includes('')) {
          resolve({
            form: this.setData()
          })
        } else {
          reject({
            msg: '必须填写一项必填项才可保存草稿'
          })
          return false
        }
      })
    },
    // 合并表单值
    outData() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          if (valid) {
            resolve({
              form: this.setData()
            })
          } else {
            reject({
              msg: '获取失败,带星号的为必填项'
            })
            return false
          }
        })
      })
    },
    getData(info) {
      if (info.set_date_start && info.set_date_end) {
        this.date = [info.set_date_start, info.set_date_end]
      }
      try {
        this.tableData = this.$options.data().tableData
        const invertedClothesMap = Object.keys(this.clothesMap).reduce((acc, key) => {
          acc[this.clothesMap[key]] = key
          return acc
        }, {})
        if (info.details && info.details.length) {
          let details = info.details
          this.tableData[0].count = this.tableData[1].count = details[0].count || undefined
          this.tableData[2].count = this.tableData[3].count = details[1].count || undefined
          details[0].details.forEach(item => {
            let key = invertedClothesMap[item.wear_name]
            this.tableData[0][key] = item.receive_count || undefined
            this.tableData[1][key] = item.receive_amount || undefined
          })
          details[1].details.forEach(item => {
            let key = invertedClothesMap[item.wear_name]
            this.tableData[2][key] = item.receive_count || undefined
            this.tableData[3][key] = item.receive_amount || undefined
          })
          this.calculatePrice()
        }
      } catch (error) {
        console.log(error)
      }
    },
    setData() {
      const form = { ...this.form }
      form.details = [
        {
          type: '男',
          count: this.tableData[0].count || 0,
          total_count: this.tableData[0].subtotal || 0,
          total_fee: this.tableData[1].subtotal || 0,
          details: Object.keys(this.clothesMap).map(key => ({
            wear_name: this.clothesMap[key],
            receive_count: this.tableData[0][key] || 0,
            receive_amount: this.tableData[1][key] || 0
          }))
        },
        {
          type: '女',
          count: this.tableData[2].count || 0,
          total_count: this.tableData[2].subtotal || 0,
          total_fee: this.tableData[3].subtotal || 0,
          details: Object.keys(this.clothesMap).map(key => ({
            wear_name: this.clothesMap[key],
            receive_count: this.tableData[2][key] || 0,
            receive_amount: this.tableData[3][key] || 0
          }))
        }
      ]
      return form
    },
    // 选择人员后获取部门信息
    async selectedUser(userIds, nodes, parentNode) {
      let dept_id = null
      this.changeNum++
      if (this.changeNum > 1) {
        if (userIds.length > 0 && !!parentNode) {
          dept_id = parentNode.i_id
        }
      } else {
        // 若有草稿  则部门为草稿中部门   若无草稿 则为主部门
        dept_id = this.dept_id
      }

      this.deptList = await this.GetUserDept(this.form.user_id)
      this.form.dept_id = dept_id
      // 保存一下初始化数据 作为保存草稿时的比对数据
      if (this.changeNum <= 1) {
        this.oldForm = deepCopy(this.form)
      }
      this.dateChange()
    },
    GetUserDept(user_id) {
      return this.$client.GetUserDept({ user_id }).then(res => res.context)
    },
    // 上传文件
    filesUpdate(filesList) {
      this.form.files_list = filesList
    },
    customSpanMethodFun({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
      if (columnIndex === 9) {
        if (rowIndex === 0) {
          return {
            rowspan: 4,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    countChange(value, index) {
      this.tableData[index + 1].count = value
    },
    calculatePrice() {
      try {
        const keys = Object.keys(this.clothesMap)
        this.tableData.forEach(item => {
          item.subtotal = 0
          keys.forEach(key => {
            item.subtotal += Number(item[key] ? item[key] : 0)
          })
          item.subtotal = Number(item.subtotal.toFixed(2))
        })
        this.tableData[0].total_fee =
          this.tableData[1].total_fee =
          this.tableData[2].total_fee =
          this.tableData[3].total_fee =
            Number((this.tableData[1].subtotal + this.tableData[3].subtotal).toFixed(2))
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.gray {
  width: 100%;
  height: 100%;
  background-color: #ebecf0;
  position: absolute;
  top: 0px;
  left: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>

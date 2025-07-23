<template>
  <el-form ref="form" size="mini" :model="form" :rules="rules" label-suffix=":">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="申请人" prop="user_id">
          <get-department-select
            ref="personalTree1"
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
            :disabled="!deptList.length"
            @change="dateChange"
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
        <el-form-item label="申请日期" prop="request_date">
          <el-date-picker
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            v-model="form.request_date"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            show-word-limit
            v-model="form.remark"
            :rows="4"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" class="table-box">
        <div style="display: flex; align-items: center; margin-bottom: 5px">
          <h2 style="margin-right: 10px">退款明细</h2>
          <el-button type="primary" size="small" @click="add()">新增行</el-button>
          <!-- <el-button type="primary" size="small" @click="copy()">复制行</el-button> -->
          <el-button type="primary" size="small" @click="del()">删除</el-button>
        </div>
        <tr-table
          ref="table"
          :selectionShow="true"
          :data="form.details"
          :tableHeaderList="customSettingListCopy"
          :TableHeight="300"
          @on-select-row="selectedRowInfo"
          @on-select-change-row="handleSelectionChange"
          :stripe="false"
          :showRowClass="true"
          :rowClassName="rowClassName"
        >
          <template
            v-for="item in ['phone', 'name', 'card', 'platform', 'running_account', 'remark']"
            slot-scope="scope"
            :slot="item"
          >
            <el-input
              v-model="scope.data[item]"
              placeholder="请输入"
              style="width: 100%"
              clearable
            ></el-input>
          </template>
          <template slot-scope="scope" slot="cost">
            <el-input-number
              v-model="scope.data.cost"
              :min="0"
              placeholder="请输入"
              :controls="false"
              style="width: 100%"
            ></el-input-number>
          </template>
        </tr-table>
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
import common from './common/index'
export default {
  name: 'staff-movement-form',
  components: {
    getDepartmentSelect,
    imageFileUpload
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
      form: {
        id: 0,
        user_id: null,
        replace_user_id: null,
        dept_id: null,
        request_date: '',
        remark: '',
        details: [],
        files_list: [],
        thumbnail_imgs: []
      },
      oldForm: null, // 历史草稿数据   用来比较是否修改
      dept_ids: [],
      deptList: [],
      handDeptList: [],
      rules: {
        user_id: [
          {
            required: true,
            message: '请选择申请人',
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
        request_date: [
          {
            required: true,
            message: '请选择申请日期',
            trigger: 'change'
          }
        ]
      },

      key: null,

      dept_id: null,
      changeNum: 0,
      // copyInfo: null,
      // rowIndex: null,
      ids: [],
      rowClassName: [], //动态添加行类
      customSettingListCopy: [
        {
          id: 1,
          label: '*注册手机号',
          prop: 'phone',
          width: '160',
          align: 'center',
          signIndex: 0
        },
        {
          id: 2,
          label: '*姓名',
          prop: 'name',
          width: '180',
          align: 'center',
          signIndex: 1
        },
        {
          id: 3,
          label: '*身份证号',
          prop: 'card',
          width: '160',
          align: 'center',
          signIndex: 2
        },
        {
          id: 4,
          label: '*押金平台',
          prop: 'platform',
          width: '160',
          align: 'center',
          signIndex: 3
        },
        {
          id: 5,
          label: '*流水号',
          prop: 'running_account',
          width: '160',
          align: 'center',
          signIndex: 4
        },
        {
          id: 6,
          label: '*费用',
          prop: 'cost',
          width: '180',
          align: 'center',
          signIndex: 5
        },
        {
          id: 7,
          label: '备注',
          prop: 'remark',
          width: '180',
          align: 'center',
          signIndex: 6
        }
      ]
    }
  },
  watch: {
    dialogBool() {
      if (!this.dialogBool) {
        this.$refs.personalTree1.onClear()
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
      } else {
        this.form.request_date = formatTime(new Date())
        if (getUser()) {
          let userInfo = JSON.parse(getUser())
          this.form.user_id = Number(userInfo.user_id)
          this.dept_id = Number(userInfo.department_id)
        }
      }
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
    async changeHandUser(userIds, nodes, parentNode) {
      if (userIds.length > 0 && !!parentNode) {
        this.form.handling_dept = parentNode.i_id
      }
      this.handDeptList = await this.GetUserDept(this.form.handling_user)
      this.dateChange()
    },
    GetUserDept(user_id) {
      return this.$client.GetUserDept({ user_id }).then(res => res.context)
    },
    add() {
      const row = {}
      const keys = this.customSettingListCopy.map(x => x.prop)
      keys.forEach(key => {
        row[key] = ''
      })
      this.form.details.push(row)
      this.getTableIndex()
    },
    // 删除
    del() {
      if (this.ids.length == 0) {
        this.$message({
          showClose: true,
          message: '请先选中需要删除的数据',
          type: 'warning'
        })
        return
      }
      this.form.details = this.form.details.filter(item => {
        return this.ids.indexOf(item.index) == -1
      })
      this.ids = []
      this.getTableIndex()
    },
    selectedRowInfo(row, column, event) {
      // this.copyInfo = row;
      // this.rowIndex = row.index;
    },
    handleSelectionChange(rows) {
      this.ids = []
      rows.forEach(item => {
        this.ids.push(item.index)
      })
    },
    // 组装表格获取index下标
    getTableIndex() {
      this.form.details.forEach((item, index) => {
        item.index = index
      })
    },
    // 合并表单值
    outData() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          const requiredProps = this.customSettingListCopy
            .filter(item => item.label.startsWith('*'))
            .map(x => x.prop)
          let bool = this.form.details.some(item => {
            let value = false
            requiredProps.forEach(key => {
              if (item[key] === '') value = true
            })
            return value
          })
          if (bool) {
            reject({
              msg: '获取失败,请检查退款明细信息是否填写完整'
            })
          } else if (valid) {
            resolve({
              form: this.form
            })
          } else {
            reject({
              msg: '获取失败,带星号的为必填项'
            })
          }
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped></style>

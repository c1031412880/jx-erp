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
        <el-form-item label="申请日期" prop="req_date">
          <el-date-picker
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            v-model="form.req_date"
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
          <h2 style="margin-right: 10px">调动员工</h2>
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
          <template slot-scope="scope" slot="user_id">
            <get-department-select
              :ref="'personalTree_' + scope.index"
              v-model="scope.data.user_id"
              :isShowCheckbox="false"
              :placeholder="'请选择'"
              :isContainEmp="true"
              :show_all="true"
              :isExportMultiple="false"
              @on-change="selectedMoveUser(scope.data)"
            ></get-department-select>
          </template>
          <template slot-scope="scope" slot="replace_user_id">
            <get-department-select
              :ref="'replaceTree_' + scope.index"
              v-model="scope.data.replace_user_id"
              :isShowCheckbox="false"
              :placeholder="'请选择'"
              :isContainEmp="true"
              :show_all="true"
              :isExportMultiple="false"
              @on-change="selectedMoveUser(scope.data)"
            ></get-department-select>
          </template>
          <template slot-scope="scope" slot="new_dept_id">
            <get-department-select
              :ref="'baseTree_' + scope.index"
              :isShowCheckbox="false"
              :placeholder="'请选择'"
              :isExportMultiple="false"
              v-model="scope.data.new_dept_id"
              @on-change="selectedMoveDept(scope.index)"
            ></get-department-select>
            <!-- @on-change="selectedDeparment(scope.index)" -->
          </template>
          <template slot-scope="scope" slot="old_deputy_dept_ids">
            <get-department-select
              :ref="'old_deputy_' + scope.index"
              :isShowCheckbox="true"
              :placeholder="'请选择'"
              :isExportMultiple="true"
              v-model="scope.data.old_deputy_dept_ids"
              @on-change="selectedMoveDept(scope.index)"
            ></get-department-select>
            <!-- @on-change="selectedDeparment(scope.index)" -->
          </template>
          <template slot-scope="scope" slot="new_deputy_dept_ids">
            <get-department-select
              :ref="'new_deputy_' + scope.index"
              :isShowCheckbox="true"
              :placeholder="'请选择'"
              :isExportMultiple="true"
              v-model="scope.data.new_deputy_dept_ids"
              @on-change="selectedMoveDept(scope.index)"
            ></get-department-select>
            <!-- @on-change="selectedDeparment(scope.index)" -->
          </template>
          <template slot-scope="scope" slot="old_post">
            <tr-select-dictionaries
              placeholder="请选择"
              class-key="职务"
              v-model="scope.data.old_post"
            ></tr-select-dictionaries>
          </template>
          <template slot-scope="scope" slot="new_post">
            <tr-select-dictionaries
              placeholder="请选择"
              class-key="职务"
              v-model="scope.data.new_post"
            ></tr-select-dictionaries>
          </template>
          <template slot-scope="scope" slot="new_position">
            <el-select
              v-model="scope.data.new_position"
              @change="selectedPosition(scope.data, scope.index)"
              placeholder="请选择"
            >
              <el-option
                v-for="item in scope.data.jobList"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
            <!-- <el-input
              placeholder="请输入职位"
              v-model="scope.data.new_position"
              clearable>
            </el-input> -->
          </template>
          <template slot-scope="scope" slot="handover_id">
            <get-department-select
              :ref="'personal_Tree_' + scope.index"
              v-model="scope.data.handover_id"
              :isShowCheckbox="false"
              :placeholder="'请选择'"
              :isContainEmp="true"
              :show_all="true"
              :isExportMultiple="false"
            ></get-department-select>
          </template>
          <template slot-scope="scope" slot="handover_date">
            <el-date-picker
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
              placeholder="选择变动日期"
              v-model="scope.data.handover_date"
              clearable
              style="width: 100%"
            ></el-date-picker>
          </template>

          <template slot-scope="scope" slot="remark">
            <el-input placeholder="请输入备注" v-model="scope.data.remark" clearable></el-input>
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
        req_date: '',
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
        req_date: [
          {
            required: true,
            message: '请选择日期',
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
          label: '*姓名',
          prop: 'user_id',
          width: '160',
          align: 'center',
          signIndex: 0
        },
        {
          id: 2,
          label: '手机号',
          prop: 'phone',
          width: '180',
          align: 'center',
          signIndex: 1
        },
        {
          id: 3,
          label: '原部门',
          prop: 'old_dept_name',
          width: '160',
          align: 'center',
          signIndex: 2
        },
        {
          id: 4,
          label: '*调动后部门',
          prop: 'new_dept_id',
          width: '160',
          align: 'center',
          signIndex: 3
        },
        {
          id: 5,
          label: '原职位',
          prop: 'old_position',
          width: '160',
          align: 'center',
          signIndex: 4
        },
        {
          id: 6,
          label: '*调动后职位',
          prop: 'new_position',
          width: '180',
          align: 'center',
          signIndex: 5
        },
        {
          id: 7,
          label: '原副部门',
          prop: 'old_deputy_dept_ids',
          width: '180',
          align: 'center',
          signIndex: 6
        },
        {
          id: 8,
          label: '调动后副部门',
          prop: 'new_deputy_dept_ids',
          width: '180',
          align: 'center',
          signIndex: 7
        },
        {
          id: 9,
          label: '原职务',
          prop: 'old_post',
          width: '180',
          align: 'center',
          signIndex: 8
        },
        {
          id: 10,
          label: '调动后职务',
          prop: 'new_post',
          width: '180',
          align: 'center',
          signIndex: 9
        },
        {
          id: 11,
          label: '调动接替人',
          prop: 'replace_user_id',
          width: '160',
          align: 'center',
          signIndex: 10
        },
        {
          id: 12,
          label: '工作交接人',
          prop: 'handover_id',
          width: '160',
          align: 'center',
          signIndex: 11
        },
        {
          id: 13,
          label: '*变动日期',
          prop: 'handover_date',
          width: '160',
          align: 'center',
          signIndex: 12
        },
        {
          id: 14,
          label: '备注',
          prop: 'remark',
          width: '160',
          align: 'center',
          signIndex: 13
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
        this.form.req_date = formatTime(new Date())
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
    // 选中调动人员
    selectedMoveUser(row) {
      this.$client
        .getEmployeeManageDetail({ id: row.user_id })
        .then(res => {
          if (res.head.result == '200') {
            this.form.details[row.index].phone = res.context.phone
            this.form.details[row.index].old_dept_id = res.context.dept_id
            this.form.details[row.index].old_dept_name = res.context.dept_main_name
            this.form.details[row.index].old_position = res.context.position_job
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: 'error'
            })
          }
        })
        .catch(err => {})
    },
    add() {
      this.form.details.push({
        user_id: '',
        replace_user_id: '',
        phone: '',
        old_dept_id: '',
        old_dept_name: '',
        old_position: '',
        new_dept_id: '',
        new_dept_name: '',
        new_position: '',
        handover_id: '',
        handover_date: '',
        remark: '',
        post: '',
        rank: '',
        jobList: []
      })
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
    // 选中部门后获取部门职位
    selectedMoveDept(index) {
      if (!this.form.details[index].new_dept_id) return false
      this.$client
        .GetAllPositionJobDataBase({ dept_id: this.form.details[index].new_dept_id })
        .then(res => {
          if (res.head.result == '200') {
            this.form.details[index].jobList = res.context
          }
        })
    },
    // 选择职位
    selectedPosition(row, index) {
      let info = this.form.details[index].jobList.filter(item => item.name == row.new_position)
      if (info.length) {
        this.form.details[index].rank = info[0].rank
        this.form.details[index].post = info[0].post
      }
    },
    // 合并表单值
    outData() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          let isTrue = this.form.details.some(item => {
            return (
              item.user_id == '' ||
              item.new_dept_id == '' ||
              item.new_position == '' ||
              item.handover_date == ''
            )
          })
          let users = Array.from(new Set(this.form.details.map(item => item.user_id)))
          // console.log(users, this.form.details);

          if (this.form.details.length == 0) {
            reject({
              msg: '请添加调动人员明细'
            })
            return false
          } else if (isTrue) {
            reject({
              msg: '获取失败,请检查调动人员信息是否填写完整'
            })
            return false
          } else if (users.length !== this.form.details.length) {
            reject({
              msg: '调动人员重复，请检查'
            })
            return false
          } else if (valid) {
            resolve({
              form: this.form
            })
            return false
          } else {
            reject({
              msg: '获取失败,带星号的为必填项'
            })
            return false
          }
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped></style>

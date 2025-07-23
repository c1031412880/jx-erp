<template>
  <el-form ref="form" size="mini" :model="form" :rules="rules" label-suffix=":">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="经办人" prop="user_id">
          <get-department-select
            ref="personalTree"
            v-model="form.user_id"
            :isShowCheckbox="false"
            :placeholder="'请选择经办人'"
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
            placeholder="请选择发送部门"
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
        <el-form-item label="用工类型" prop="labor_type_id">
          <get-select-dictionaries
            style="width: 100%"
            v-model="form.labor_type_id"
            :clearable="false"
            @change="dateChange"
            :classKey="'labor_use-type'"
            :placeholder="'请选择用工类型'"
          ></get-select-dictionaries>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="编号">
          <el-input v-model="form.code" placeholder="请输入编号" disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="用工明细">
          <tr-table
            ref="table"
            :selectionShow="false"
            :indexShow="false"
            :data="form.details"
            :tableHeaderList="customSettingList"
            :TableHeight="TableHeight"
            :frontFixedNum="frontFixedNum"
            :backFixedNum="backFixedNum"
          >
            <template slot="count" slot-scope="scope">
              <el-input-number
                v-model="scope.data.count"
                :precision="0"
                :min="0"
                placeholder="请输入"
                :controls="false"
                style="width: 100px"
              ></el-input-number>
            </template>
            <template slot="post" slot-scope="scope">
              <el-input v-model="scope.data.post" placeholder="请输入"></el-input>
            </template>
            <template slot="wage_level" slot-scope="scope">
              <el-input v-model="scope.data.wage_level" placeholder="请输入"></el-input>
            </template>
            <template slot="time_limit" slot-scope="scope">
              <el-input-number
                v-model="scope.data.time_limit"
                :min="0"
                placeholder="请输入"
                :controls="false"
                style="width: 100px"
              ></el-input-number>
            </template>
            <template slot="labor_market_formulation" slot-scope="scope">
              <el-input
                v-model="scope.data.labor_market_formulation"
                placeholder="请输入"
              ></el-input>
            </template>
          </tr-table>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="用工理由" prop="remark">
          <el-input
            type="textarea"
            :rows="6"
            placeholder="请输入用工理由"
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
      form: {
        user_id: null,
        dept_id: null,
        labor_type_id: null,
        code: '',
        files_list: [],
        thumbnail_imgs: [],
        details: [
          {
            gender: '男',
            count: '',
            post: '',
            wage_level: '',
            time_limit: '',
            labor_market_formulation: ''
          },
          {
            gender: '女',
            count: '',
            post: '',
            wage_level: '',
            time_limit: '',
            labor_market_formulation: ''
          }
        ],
        id: 0
      },
      customSettingList: [
        {
          id: 1,
          label: '性别',
          prop: 'gender',
          width: '80',
          align: 'center',
          signIndex: 0,
          notTooltip: true
        },
        {
          id: 2,
          label: '人数',
          prop: 'count',
          width: '120',
          align: 'center',
          signIndex: 1,
          notTooltip: true
        },
        {
          id: 3,
          label: '岗位',
          prop: 'post',
          width: '120',
          align: 'center',
          signIndex: 2,
          notTooltip: true
        },
        {
          id: 4,
          label: '工资水平',
          prop: 'wage_level',
          width: '120',
          align: 'center',
          signIndex: 3,
          notTooltip: true
        },
        {
          id: 5,
          label: '聘用期限',
          prop: 'time_limit',
          width: '120',
          align: 'center',
          signIndex: 4,
          notTooltip: true
        },
        {
          id: 6,
          label: '劳务市场指定机构',
          prop: 'labor_market_formulation',
          width: '130',
          align: 'center',
          signIndex: 5,
          notTooltip: true
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
        labor_type_id: [
          {
            required: true,
            message: '请选择用工类型',
            trigger: 'change'
          }
        ],
        remark: [
          {
            required: true,
            message: '请选择用工类型',
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
      } else {
        this.form.repair_date = formatTime(new Date(), 'yyyy-MM-dd')
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
    GetUserDept(user_id) {
      return this.$client.GetUserDept({ user_id }).then(res => res.context)
    },

    // 上传文件
    filesUpdate(filesList) {
      this.form.files_list = filesList
    }
  }
}
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped></style>

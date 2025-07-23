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
        <el-form-item label="考核月份" prop="request_date">
          <el-date-picker
            value-format="yyyy-MM"
            type="month"
            placeholder="请选择考核月份"
            v-model="form.request_date"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="燃料明细">
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
            <template slot="kilometers" slot-scope="scope">
              <el-input-number
                v-model="scope.data.kilometers"
                :precision="2"
                :min="0"
                placeholder="请输入"
                :controls="false"
                style="width: 100px"
              ></el-input-number>
            </template>
            <template slot="fuel_consume" slot-scope="scope">
              <el-input-number
                v-model="scope.data.fuel_consume"
                :precision="2"
                :min="0"
                placeholder="请输入"
                :controls="false"
                style="width: 100px"
              ></el-input-number>
            </template>
            <template slot="avg_consume" slot-scope="scope">
              <el-input-number
                v-model="scope.data.avg_consume"
                :precision="2"
                :min="0"
                placeholder="请输入"
                :controls="false"
                style="width: 100px"
              ></el-input-number>
            </template>
            <template slot="real_consume" slot-scope="scope">
              <el-input-number
                v-model="scope.data.real_consume"
                :precision="2"
                :min="0"
                placeholder="请输入"
                :controls="false"
                style="width: 100px"
              ></el-input-number>
            </template>
            <template slot="award_amount" slot-scope="scope">
              <el-input-number
                v-model="scope.data.award_amount"
                :precision="2"
                :min="0"
                placeholder="请输入"
                :controls="false"
                style="width: 100px"
              ></el-input-number>
            </template>
            <template slot="remark" slot-scope="scope">
              <el-input v-model="scope.data.remark" placeholder="请输入"></el-input>
            </template>
          </tr-table>
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
import { deepCopy } from '@/utils/index'
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
        request_date: '',
        files_list: [],
        thumbnail_imgs: [],
        details: [
          {
            fuel_name: '燃油',
            kilometers: '',
            fuel_consume: '',
            avg_consume: '',
            real_consume: '',
            award_amount: '',
            remark: ''
          },
          {
            fuel_name: '燃气',
            kilometers: '',
            fuel_consume: '',
            avg_consume: '',
            real_consume: '',
            award_amount: '',
            remark: ''
          },
          {
            fuel_name: '电',
            kilometers: '',
            fuel_consume: '',
            avg_consume: '',
            real_consume: '',
            award_amount: '',
            remark: ''
          },
          {
            fuel_name: '氢气',
            kilometers: '',
            fuel_consume: '',
            avg_consume: '',
            real_consume: '',
            award_amount: '',
            remark: ''
          }
        ],
        id: 0
      },
      customSettingList: [
        {
          id: 1,
          label: '燃料名称',
          prop: 'fuel_name',
          width: '130',
          align: 'center',
          signIndex: 0
        },
        {
          id: 2,
          label: '行驶里程(公里)',
          prop: 'kilometers',
          width: '130',
          align: 'center',
          signIndex: 1
        },
        {
          id: 3,
          label: '燃料消耗(升/公斤)',
          prop: 'fuel_consume',
          width: '130',
          align: 'center',
          signIndex: 2
        },
        {
          id: 4,
          label: '升/百公里 公斤/百公里',
          prop: 'avg_consume',
          width: '160',
          align: 'center',
          signIndex: 3
        },
        {
          id: 5,
          label: '实际净油(升/公斤)',
          prop: 'real_consume',
          width: '130',
          align: 'center',
          signIndex: 4
        },
        {
          id: 6,
          label: '奖励金额',
          prop: 'award_amount',
          width: '130',
          align: 'center',
          signIndex: 5
        },
        {
          id: 7,
          label: '备注',
          prop: 'remark',
          width: '160',
          align: 'center',
          signIndex: 6
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
        request_date: [
          {
            required: true,
            message: '请选择考核月份',
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
        const date = new Date()
        const y = date.getFullYear()
        const m = ('0' + (date.getMonth() + 1)).slice(-2)
        this.form.request_date = `${y}-${m}`
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

<template>
  <el-form ref="form" size="mini" :model="form" :rules="rules" label-suffix=":">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="姓名" prop="user_id">
          <get-department-select
            ref="personalTree1"
            v-model="form.user_id"
            :isShowCheckbox="false"
            :placeholder="'请选择姓名'"
            :isContainEmp="true"
            :show_all="true"
            :isExportMultiple="false"
            :disabled="isShowSelectUser || isAgain"
            @on-change="selectedUser"
          ></get-department-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="所属部门" prop="dept_id">
          <el-select
            v-model="form.dept_id"
            style="width: 100%"
            @change="dateChange"
            placeholder="请选择所属部门"
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
        <el-form-item label="填报日期" prop="request_date">
          <el-date-picker
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            v-model="form.request_date"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="性别" prop="gender">
          <el-select v-model="form.gender" style="width: 100%">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="出生日期" prop="birthday">
          <el-date-picker
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="请选择出生日期"
            v-model="form.birthday"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="工龄" prop="work_ages">
          <el-input
            type="number"
            v-model.number="form.work_ages"
            placeholder="请输入工龄"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="岗位或工种" prop="work_position">
          <el-input
            v-model="form.work_position"
            placeholder="请输入岗位或工种"
            clearable
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="文化程度" prop="education">
          <el-input v-model="form.education" placeholder="请输入文化程度" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="职务或职称" prop="job">
          <el-input v-model="form.job" placeholder="请输入职务或职称" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="培训单位" prop="training_unit">
          <el-input v-model="form.training_unit" placeholder="请输入培训单位" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="申请培训课目" prop="training_subject">
          <el-input
            v-model="form.training_subject"
            placeholder="请输入申请培训课目"
            clearable
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="培训方式" prop="training_type">
          <el-input v-model="form.training_type" placeholder="请输入培训方式" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="培训日期" prop="training_date">
          <el-date-picker
            v-model="training_date"
            value-format="yyyy-MM-dd"
            type="daterange"
            style="width: 100%"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="trainingDateChange"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="应付学费(人民币大写)" prop="tuition_fee">
          <el-input
            v-model="form.tuition_fee"
            placeholder="请输入应付学费"
            clearable
            @change="tuitionFeeChange"
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
import getDepartmentSelect from '@/components/base/formModel/tree/get-department-select-tree'
import imageFileUpload from '@/components/imageFileUpload/index'
import getSelectDictionaries from '@/components/base/formModel/select/get-select-dictionaries/list'
import { getUser } from '@/utils/auth'
import { formatTime, deepCopy, numberToChineseMoney, isChineseMoneyString } from '@/utils/index'
import common from './common/index'
export default {
  name: 'work-contact',
  components: {
    getDepartmentSelect,
    imageFileUpload,
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
        gender: '',
        birthday: '',
        work_ages: null,
        work_position: '',
        education: '',
        job: '',
        training_unit: '',
        training_subject: '',
        training_type: '',
        training_date: '',
        training_end_date: '',
        tuition_fee: '',
        files_list: [],
        thumbnail_imgs: [],
        id: 0
      },
      training_date: [],
      oldForm: null, // 历史草稿数据   用来比较是否修改
      dept_ids: [],
      deptList: [],
      handDeptList: [],
      rules: {
        user_id: [
          {
            required: true,
            message: '请选择发送部门经办人',
            trigger: 'change'
          }
        ],
        dept_id: [
          {
            required: true,
            message: '请选择发送部门',
            trigger: 'change'
          }
        ],
        request_date: [
          {
            required: true,
            message: '请选择填报日期',
            trigger: 'change'
          }
        ],
        gender: [
          {
            required: true,
            message: '请选择性别',
            trigger: 'change'
          }
        ],
        birthday: [
          {
            required: true,
            message: '请选择出生日期',
            trigger: 'change'
          }
        ],
        work_ages: [
          {
            required: true,
            message: '请输入工龄',
            trigger: 'change'
          },
          {
            type: 'number',
            min: 0,
            message: '工龄不能小于0',
            trigger: 'change'
          }
        ],
        work_position: [
          {
            required: true,
            message: '请输入岗位或工种',
            trigger: 'change'
          }
        ],
        education: [
          {
            required: true,
            message: '请输入文化程度',
            trigger: 'change'
          }
        ],
        job: [
          {
            required: true,
            message: '请选择职务或职称',
            trigger: 'change'
          }
        ],
        training_unit: [
          {
            required: true,
            message: '请输入培训单位',
            trigger: 'change'
          }
        ],
        training_subject: [
          {
            required: true,
            message: '请输入申请培训课目',
            trigger: 'change'
          }
        ],
        training_type: [
          {
            required: true,
            message: '请输入培训方式',
            trigger: 'change'
          }
        ],
        training_date: [
          {
            required: true,
            message: '请选择培训日期',
            trigger: 'change'
          }
        ],
        tuition_fee: [
          {
            required: true,
            message: '请输入正确的金额格式或数字',
            trigger: 'change'
          }
        ]
      },
      approvalFormVisible: false,
      key: null,
      dept_id: null,
      changeNum: 0,
      echoInfo: null
    }
  },
  watch: {
    dialogBool() {
      if (!this.dialogBool) {
        this.$refs.personalTree1.onClear()
        this.$refs.personalTree2.onClear()
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
        this.echoInfo = info
        for (const key in this.form) {
          if (Object.hasOwnProperty.call(info, key) && key != 'dept_id') {
            this.form[key] = info[key]
          }
        }
        this.dept_id = JSON.parse(JSON.stringify(info.dept_id))
        if (this.form.training_date && this.form.training_end_date) {
          this.training_date = [this.form.training_date, this.form.training_end_date]
        }
      } else {
        this.form.request_date = formatTime(new Date(), 'yyyy-MM-dd')
        if (getUser()) {
          let userInfo = JSON.parse(getUser())
          this.form.user_id = Number(userInfo.user_id)
          this.dept_id = Number(userInfo.department_id)
        }
      }
    },
    trainingDateChange(value) {
      if (!value) {
        this.form.training_date = ''
        this.form.training_end_date = ''
      } else {
        this.form.training_date = value[0]
        this.form.training_end_date = value[1]
      }
      // this.dateChange()
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
      if (!this.echoInfo) await this.getUserDetailInfo()
      this.dateChange()
    },
    GetUserDept(user_id) {
      return this.$client.GetUserDept({ user_id }).then(res => res.context)
    },
    getUserDetailInfo() {
      return new Promise((resolve, reject) => {
        this.$client
          .getEmployeeManageDetail({
            id: this.form.user_id
          })
          .then(res => {
            if (res.head.result == '200') {
              let staffInfo = res.context
              if (staffInfo) {
                this.form.gender = staffInfo.gender ? '女' : '男'
                this.form.birthday = staffInfo.date_of_birth
                if (staffInfo.enter_unit_time) {
                  let y = this.getAge(staffInfo.enter_unit_time)[0] || 0
                  let m = this.getAge(staffInfo.enter_unit_time)[1] || 0
                  let work_ages = m > 0 ? Math.round((y + m / 12) * 10) / 10 : y
                  this.form.work_ages = work_ages
                }
                this.form.work_position = staffInfo.position_job
                const xlMap = {
                  1: '博士',
                  2: '研究生',
                  3: '大学',
                  4: '大专',
                  5: '中技',
                  6: '中专',
                  7: '高中及以下'
                }
                this.form.education = xlMap[staffInfo.qrz_xl]
                this.form.job = staffInfo.post
              }
            } else {
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: 'error'
              })
            }
          })
          .finally(() => {
            resolve()
          })
      })
    },
    getAge(birthday) {
      if (birthday) {
        let str = birthday
        birthday = birthday.split('-')
        // 新建日期对象
        let date = new Date()
        // 今天日期，数组，同 birthday
        let today = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
        // 分别计算年月日差值
        let age = today.map((val, index) => {
          return val - birthday[index]
        })
        // 当天数为负数时，月减 1，天数加本月总天数
        if (age[2] < 0) {
          // 获取当月总天数的方法
          let curMonth = new Date(today[0], today[1], 0)
          age[1]--
          age[2] += curMonth.getDate()
        }
        // 当月数为负数时，年减 1，月数加上 12
        if (age[1] < 0) {
          age[0]--
          age[1] += 12
        }
        console.log('出生日期：' + str + '  岁数：' + age[0] + '岁' + age[1] + '月' + age[2] + '天')
        return age
      }
    },
    tuitionFeeChange(value) {
      if (!value || isChineseMoneyString(value)) return
      const num = Number(value)
      this.form.tuition_fee = isNaN(num) ? '' : numberToChineseMoney(num)
    }
  }
}
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped></style>

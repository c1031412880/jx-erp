<template>
  <el-form ref="form" size="mini" :model="form" :rules="rules" label-suffix=":">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="反馈人" prop="user_id">
          <get-department-select
            ref="personalTree1"
            v-model="form.user_id"
            :isShowCheckbox="false"
            :placeholder="'请选择反馈人'"
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
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="form.phone"
            disabled
            style="width: 100%"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" style="margin-bottom: 18px">
        <p style="line-height: 28px; color: #606266; font-size: 14px; font-weight: 700">
          反馈内容详情:
        </p>
        <tinymce-Vue :value="form.rich_text" @input="res => (form.rich_text = res)" />
      </el-col>
      <!-- <el-form-item label="反馈描述" prop="remark">
        <el-input type="textarea" show-word-limit v-model="form.remark" :rows="4" placeholder="请输入反馈描述"></el-input>
      </el-form-item> -->
    </el-row>
    <image-file-upload
      :images="form.thumbnail_imgs"
      :files="form.files_list"
      @files-update-success="filesUpdateSuccess"
      @images-update-success="imagesUpdateSuccess"
    ></image-file-upload>
  </el-form>
</template>

<script>
import getDepartmentSelect from '@/components/base/formModel/tree/get-department-select-tree'
import imageFileUpload from '@/components/imageFileUpload/index'
import tinymceVue from '@/components/ueditor/tinyVue.vue'
import { getUser } from '@/utils/auth'
import { formatTime, deepCopy } from '@/utils/index'
import common from './common/index'
export default {
  name: 'rationalization-feedback-form',
  components: {
    getDepartmentSelect,
    imageFileUpload,
    tinymceVue
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
        dept_id: null,
        phone: '',
        remark: '',
        rich_text: '',
        files_list: [],
        thumbnail_imgs: []
      },
      oldForm: null, // 历史草稿数据   用来比较是否修改
      deptList: [],
      rules: {
        user_id: [
          {
            required: true,
            message: '请选择所在部门反馈人',
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
        rich_text: [
          {
            required: true,
            message: '请输入反馈描述',
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
      if (userIds.length > 0) {
        this.selectedUserInfo(userIds)
      }
      // 保存一下初始化数据 作为保存草稿时的比对数据
      if (this.changeNum <= 1) {
        this.oldForm = deepCopy(this.form)
      }
      this.dateChange()
    },
    GetUserDept(user_id) {
      return this.$client.GetUserDept({ user_id }).then(res => res.context)
    },
    // 获取人员详细信息
    selectedUserInfo(id) {
      console.log(id)

      if (!id || !id.length) {
        return
      }
      let params = {}
      params.id = id
      this.$client
        .getEmployeeManageDetail(params)
        .then(res => {
          if (res.head.result == '200') {
            console.log(res.context)
            this.form.phone = res.context.phone
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: 'error'
            })
          }
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: 'error'
          })
        })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>

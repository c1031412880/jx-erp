<template>
  <el-form ref="form" size="mini" :model="form" :rules="rules" label-suffix=":">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="经办人" prop="user_id">
          <get-department-select
            ref="personalTree"
            v-model="form.user_id"
            :isShowCheckbox="false"
            :placeholder="'请选择发送部门经办人'"
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
          <el-select v-model="form.dept_id" :disabled="!deptList.length" style="width:100%" @change="dateChange" placeholder="请选择发送部门">
            <el-option
              v-for="item in deptList"
              :key="item.dept_id"
              :label="item.dept_name"
              :value="item.dept_id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="当前月份" prop="month">
          <el-date-picker
            disabled
            value-format="yyyy-MM"
            type="month"
            placeholder="选择日期"
            v-model="form.month"
            style="width: 100%;">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="下月工作计划" prop="next_plan">
           <el-input type="textarea" v-model="form.next_plan" :rows="4" placeholder="请输入下月工作计划"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" style="margin-bottom: 20px">
        <image-file-upload 
          :images="form.thumbnail_imgs"
          :files="form.files_list"
          @files-update-success="filesUpdateSuccess"
          @images-update-success="imagesUpdateSuccess"></image-file-upload>
      </el-col>
    </el-row>
  </el-form>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import imageFileUpload from "@/components/imageFileUpload/index";
import { getUser } from '@/utils/auth';
import { formatTime, deepCopy } from '@/utils/index';  
import common from './common/index'
export default {
  name: "monthly-work",
  components: {
    getDepartmentSelect,
    imageFileUpload,
  },
  mixins: [common],
  props: {
    dialogBool:{
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
    },
  },
  data() {
    return {
      form: {
        user_id:null,
        dept_id:null,
        month: '',
        next_plan: '',
        files_list: [],
        thumbnail_imgs: [],
        id: 0
      },
      oldForm: null, // 历史草稿数据   用来比较是否修改
      deptList: [],
      rules: {
        user_id: [
          {
            required: true,
            message: "请选择申请人",
            trigger: "change",
          },
        ],
        dept_id: [
          {
            required: true,
            message: "请选择申请部门",
            trigger: "change",
          },
        ],
        month: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        next_plan: [
          {
            required: true,
            message: "请输入下月工作计划",
            trigger: "change",
          },
        ],
      },

      dept_id: null,
      changeNum: 0
    }
  },
  watch:{
    dialogBool() {
      if(!this.dialogBool) {
        this.$refs.personalTree.onClear();
        Object.assign(this.$data.form, this.$options.data().form);
      }else{
        this.$nextTick(() => {
          this.$refs["form"].resetFields();
        })
      }
    }
  },
  methods: {
    // 初始化数据
    initSet(info){
      if (!!info) {
        for (const key in this.form) {
          if (Object.hasOwnProperty.call(info, key) && key != 'dept_id') {
            this.form[key] = info[key];
          }
        }
        this.dept_id = JSON.parse(JSON.stringify(info.dept_id))
      } else {
        this.form.month = formatTime(new Date(),'yyyy-MM')

        if (getUser()) {
          let userInfo = JSON.parse(getUser());
          this.form.user_id = Number(userInfo.user_id);
          this.dept_id = Number(userInfo.department_id);
        }

        this.getlastMonthPlan()
      }
    },
    // 获取上个月的工作计划
    getlastMonthPlan() {
      let params = {
        page_index: 1,
        page_size: 1,
        user_ids: [this.form.user_id],
        month: this.getLastMont()
      }
      this.$client.GetListOaFormNews({context:params}).then(res => {
        if (res.head.result == 200) {
          this.form.next_plan = res.context.list[0].next_plan
        }
      })
    },
    // 获取上个月
    getLastMont() {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth()

      if (month == 0) {
        year -= 1
        month = 12
      }

      return year + '-' + month
    },
    // 选择人员后获取部门信息
    async selectedUser(userIds, nodes,parentNode) {
      let dept_id = null
      this.changeNum ++ 
      if (this.changeNum > 1) {
        if(userIds.length > 0 && !!parentNode) {
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
      return this.$client.GetUserDept({user_id}).then(res => res.context)
    },
  },
   
}
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
</style>

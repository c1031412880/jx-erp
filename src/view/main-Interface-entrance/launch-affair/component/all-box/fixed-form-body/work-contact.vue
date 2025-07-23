<template>
  <el-form ref="form" size="mini" :model="form" :rules="rules" label-suffix=":">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="发送部门经办人" prop="user_id">
          <get-department-select
            ref="personalTree1"
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
        <el-form-item label="发送部门" prop="dept_id">
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
        <el-form-item label="主送部门经办人" prop="handling_user">
          <get-department-select
            ref="personalTree2"
            v-model="form.handling_user"
            :isShowCheckbox="false"
            :placeholder="'请选择主送部门经办人'"
            :isContainEmp="true"
            :isExportMultiple="false"
            @on-change="changeHandUser"
          ></get-department-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="主送部门" prop="handling_dept">
          <el-select v-model="form.handling_dept" style="width:100%" @change="dateChange" placeholder="请选择主送部门">
            <el-option
              v-for="item in handDeptList"
              :key="item.dept_id"
              :label="item.dept_name"
              :value="item.dept_id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="日期" prop="apply_date">
          <el-date-picker
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            v-model="form.apply_date"
            style="width: 100%;">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="单价(元)" prop="price">
          <get-select-dictionaries 
            style="width:100%"
            v-model="form.price" 
            @change="dateChange"
            :classKey="'oa-work-price'" 
            :placeholder="'请选择申请类型'" 
          ></get-select-dictionaries>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="主题" prop="theme">
          <el-input v-model="form.theme" placeholder="请输入主题"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="联系内容" prop="connect_content">
           <el-input type="textarea" show-word-limit v-model="form.connect_content" :rows="4" placeholder="请输入联系内容"></el-input>
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
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries/list";
import { getUser } from '@/utils/auth';
import { formatTime, deepCopy } from '@/utils/index';  
import common from './common/index'
export default {
  name: "work-contact",
  components: {
    getDepartmentSelect,
    imageFileUpload,
    getSelectDictionaries
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
        handling_user: null,
        handling_dept: null,
        apply_date: '',
        price: '',
        theme: '',
        connect_content: '',
        files_list: [],
        thumbnail_imgs: [],
        id: 0
      },
      oldForm: null, // 历史草稿数据   用来比较是否修改
      dept_ids: [],
      deptList: [],
      handDeptList: [],
      rules: {
        user_id: [
          {
            required: true,
            message: "请选择发送部门经办人",
            trigger: "change",
          },
        ],
        dept_id: [
          {
            required: true,
            message: "请选择发送部门",
            trigger: "change",
          },
        ],
        handling_user: [
          {
            required: true,
            message: "请选择主送部门经办人",
            trigger: "change",
          },
        ],
        handling_dept: [
          {
            required: true,
            message: "请选择主送部门",
            trigger: "change",
          },
        ],
        apply_date: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        price: [
          {
            required: true,
            message: "请选择单价",
            trigger: "change",
          },
        ],
        theme: [
          {
            required: true,
            message: "请输入主题",
            trigger: "change",
          },
        ],
        connect_content: [
          {
            required: true,
            message: "请输入联系内容",
            trigger: "change",
          },
        ],
      },

      approvalFormVisible: false,
      key: null,

      dept_id: null,
      changeNum: 0
    }
  },
  watch:{
    dialogBool() {
      if(!this.dialogBool) {
        this.$refs.personalTree1.onClear();
        this.$refs.personalTree2.onClear();
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
        this.form.apply_date = formatTime(new Date())
        if (getUser()) {
          let userInfo = JSON.parse(getUser());
          this.form.user_id = Number(userInfo.user_id);
          this.dept_id = Number(userInfo.department_id);
        }
      }
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
    async changeHandUser(userIds, nodes,parentNode) {
      if(userIds.length > 0 && !!parentNode) {
          this.form.handling_dept = parentNode.i_id
        }
      this.handDeptList = await this.GetUserDept(this.form.handling_user)
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

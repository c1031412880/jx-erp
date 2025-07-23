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
        <el-form-item label="申请日期" prop="date">
          <el-date-picker
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择申请日期"
            v-model="form.date"
            style="width: 100%;">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="申请开户单位" prop="open_unit">
           <el-input v-model="form.open_unit" placeholder="请输入申请开户单位"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="是否业务要求的开户" prop="is_business">
          <el-select v-model="form.is_business" :clearable="false" style="width:100%">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="申请事项" prop="matter">
          <get-select-dictionaries 
            style="width:100%"
            v-model="form.matter" 
            :clearable="false"
            @change="dateChange"
            :classKey="'oa-bank-matter'" 
            :placeholder="'请选择申请事项'" 
          ></get-select-dictionaries>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="是否公开招标" prop="is_public">
          <el-select v-model="form.is_public" :clearable="false" style="width:100%">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="项目编号" prop="item_code">
           <el-input v-model="form.item_code" placeholder="请输入项目编号"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="是否集团决策" prop="is_group">
          <el-select v-model="form.is_group" :clearable="false" style="width:100%">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="会议纪要" prop="summary_files_list">
            <image-file-upload 
            :files="form.summary_files_list"
            :isCompress="true"
            :isShowImages="false"
            :title="''"
            :fileLimit="3"
            @files-update-success="filesUpdate"></image-file-upload>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="开户银行" prop="open_bank">
           <el-input v-model="form.open_bank" placeholder="请输入开户银行"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="开户原因" prop="open_reason">
           <el-input type="textarea" v-model="form.open_reason" :rows="4" placeholder="请输入开户原因"></el-input>
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
  name: "stamp-approval-form",
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
        date: '',
        open_unit: '',
        is_business: '',
        matter: '',
        is_public: '',
        item_code: '',
        is_group: '',
        summary_files_list: [],
        open_bank: '',
        open_reason: '',
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
            message: "请选择经办人",
            trigger: "change",
          },
        ],
        dept_id: [
          {
            required: true,
            message: "请选择所在部门",
            trigger: "change",
          },
        ],
        date: [
          {
            required: true,
            message: "请选择申请日期",
            trigger: "change",
          },
        ],
        open_unit: [
          {
            required: true,
            message: "请选择申请开户单位",
            trigger: "change",
          },
        ],
        is_business: [
          {
            required: true,
            message: "请选择是否业务要求的开户",
            trigger: "change",
          },
        ],
        is_public: [
          {
            required: true,
            message: "请选择是否公开招标",
            trigger: "change",
          },
        ],
        item_code: [
          {
            required: true,
            message: "请输入项目编号",
            trigger: "change",
          },
        ],
        is_group: [
          {
            required: true,
            message: "请选择是否集团决策",
            trigger: "change",
          },
        ],
        summary_files_list: [
          {
            required: true,
            message: "请上传会议纪要",
            trigger: "change",
          },
        ],
        open_bank: [
          {
            required: true,
            message: "请输入开户银行",
            trigger: "change",
          },
        ],
        open_reason: [
          {
            required: true,
            message: "请输入开户原因",
            trigger: "change",
          },
        ],
      },
      options: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 2
        },
      ],
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
        this.form.date = formatTime(new Date(),'yyyy-MM-dd')
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
    GetUserDept(user_id) {
      return this.$client.GetUserDept({user_id}).then(res => res.context)
    },

    // 上传文件
    filesUpdate(filesList) {
      this.form.summary_files_list = filesList;
    },
  },
   
}
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
</style>

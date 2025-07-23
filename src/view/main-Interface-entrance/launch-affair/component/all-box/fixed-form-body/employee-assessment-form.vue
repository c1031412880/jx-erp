<template>
  <el-form ref="form" size="mini" :model="form" :rules="rules" label-suffix=":">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="经办人姓名" prop="user_id">
          <get-department-select
            ref="personalTree1"
            v-model="form.user_id"
            :isShowCheckbox="false"
            :placeholder="'请选择经办人姓名'"
            :isContainEmp="true"
            :show_all="true"
            :isExportMultiple="false"
            :disabled="isShowSelectUser || isAgain"
            @on-change="selectedUser"
          ></get-department-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="所在部门（分公司）" prop="dept_id">
          <el-select v-model="form.dept_id" :disabled="!deptList.length" style="width:100%" @change="dateChange" placeholder="请选择所在部门（分公司）">
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
        <el-form-item label="被考核人姓名" prop="check_user_id">
          <get-department-select
            ref="personalTree2"
            v-model="form.check_user_id"
            :isShowCheckbox="false"
            :placeholder="'请选择被考核人姓名'"
            :isContainEmp="true"
            :isExportMultiple="false"
            @on-change="changeHandUser"
          ></get-department-select>
          <p style="font-size: 12px;color: #999;">注：请于员工(含派遣）试用期满前一周上交公司党群人事部</p>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="被考核人部门（分公司）" prop="check_dept_id">
          <el-select v-model="form.check_dept_id" style="width:100%" @change="dateChange" placeholder="请选择被考核人部门（分公司）">
            <el-option
              v-for="item in handDeptList"
              :key="item.dept_id"
              :label="item.dept_name"
              :value="item.dept_id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="工作任务完成情况" prop="task_finish">
           <el-input type="textarea" show-word-limit v-model="form.task_finish" :rows="4" placeholder="请输入工作任务完成情况"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="尊章守纪情况" prop="respect_situation">
           <el-input type="textarea" show-word-limit v-model="form.respect_situation" :rows="4" placeholder="请输入尊章守纪情况"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="综合评定意见" prop="opinions">
           <el-input type="textarea" show-word-limit v-model="form.opinions" :rows="4" placeholder="请输入综合评定意见"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="是否胜任岗位" prop="is_competent">
          <el-select v-model="form.is_competent" style="width:100%" placeholder="请选择是否胜任岗位">
            <el-option
              v-for="item in competentList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="考评人员签名" prop="evaluate_id">
          <get-department-select
            ref="personalTree3"
            v-model="form.evaluate_id"
            :isShowCheckbox="false"
            :placeholder="'请选择考评人员签名'"
            :isContainEmp="true"
            :isExportMultiple="false"
          ></get-department-select>
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
  name: "employee-assessment-form",
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
        check_user_id: '',
        check_dept_id: '',
        task_finish: '',
        respect_situation: '',
        opinions: '',
        is_competent: '',
        evaluate_id: '',
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
            message: "请选择经办人姓名",
            trigger: "change",
          },
        ],
        dept_id: [
          {
            required: true,
            message: "请选择所在部门（分公司）",
            trigger: "change",
          },
        ],
        check_user_id: [
          {
            required: true,
            message: "请选择被考核人姓名",
            trigger: "change",
          },
        ],
        check_dept_id: [
          {
            required: true,
            message: "请选择被考核人部门（分公司）",
            trigger: "change",
          },
        ],
        task_finish: [
          {
            required: true,
            message: "请输入工作任务完成情况",
            trigger: "change",
          },
        ],
        respect_situation: [
          {
            required: true,
            message: "请输入尊章守纪情况",
            trigger: "change",
          },
        ],
        opinions: [
          {
            required: true,
            message: "请输入综合评定意见",
            trigger: "change",
          },
        ],
        is_competent: [
          {
            required: true,
            message: "请选择是否胜任岗位",
            trigger: "change",
          },
        ],
        evaluate_id: [
          {
            required: true,
            message: "请选择考评人员签名",
            trigger: "change",
          },
        ],
      },

      dept_id: null,
      changeNum: 0,

      competentList: [
        {
          value: 1,
          label: '是'
        },
        {
          value: 2,
          label: '否'
        },
      ]
    }
  },
  watch:{
    dialogBool() {
      if(!this.dialogBool) {
        this.$refs.personalTree1.onClear();
        this.$refs.personalTree2.onClear();
        this.$refs.personalTree3.onClear();
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
          this.form.check_dept_id = parentNode.i_id
        }
      this.handDeptList = await this.GetUserDept(this.form.check_user_id)
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

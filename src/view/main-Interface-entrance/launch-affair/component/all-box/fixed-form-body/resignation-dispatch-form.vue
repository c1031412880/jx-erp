<template>
  <el-form ref="form" size="mini" :model="form" :rules="rules" label-suffix=":">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="经办人" prop="user_id">
          <get-department-select
            ref="personalTree1"
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
          <el-select v-model="form.dept_id" :disabled="!deptList.length" style="width:100%" @change="dateChange" placeholder="请选择所在部门">
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
        <el-form-item label="辞职人员姓名" prop="depart_user">
          <get-all-dept-user-tree
            ref="personalTree2"
            v-model="form.depart_user"
            :isShowCheckbox="false"
            :placeholder="'请选择辞职人员姓名'"
            :isContainEmp="true"
            :isExportMultiple="false"
            @on-change="changeHandUser"
          ></get-all-dept-user-tree>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="部门" prop="depart_dept_name">
          <el-input style="width:100%" disabled v-model="form.depart_dept_name"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="职位" prop="position_name">
          <el-input style="width:100%" disabled v-model="form.position_name"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="进单位日期" prop="join_date">
          <el-date-picker
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择进单位日期"
            v-model="form.join_date"
            style="width: 100%;">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="离职日期" prop="depart_date">
          <el-date-picker
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择离职日期"
            v-model="form.depart_date"
            style="width: 100%;">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注" prop="remark">
           <el-input type="textarea" show-word-limit v-model="form.remark" :rows="4" placeholder="请输入备注"></el-input>
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
import getAllDeptUserTree from "@/components/base/formModel/tree/get-all-dept-user-tree";
import imageFileUpload from "@/components/imageFileUpload/index";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries/list";
import { getUser } from '@/utils/auth';
import { formatTime, deepCopy } from '@/utils/index';  
import common from './common/index'
export default {
  name: "resignation-dispatch-form",
  components: {
    getDepartmentSelect,
    imageFileUpload,
    getSelectDictionaries,
    getAllDeptUserTree
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
        depart_user: '',
        depart_dept_name: '',
        position_name: '',
        join_date: '',
        depart_date: '',
        remark: '',
        files_list: [],
        thumbnail_imgs: [],
        id: 0
      },
      oldForm: null, // 历史草稿数据   用来比较是否修改
      dept_ids: [],
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
        depart_user: [
          {
            required: true,
            message: "请选择辞职人员姓名",
            trigger: "change",
          },
        ],
        depart_dept_name: [
          {
            required: true,
            message: "请选择部门",
            trigger: "change",
          },
        ],
        position_name: [
          {
            required: true,
            message: "请输入职位",
            trigger: "change",
          },
        ],
        join_date: [
          {
            required: true,
            message: "请选择进单位日期",
            trigger: "change",
          },
        ],
        depart_date: [
          {
            required: true,
            message: "请选择离职日期",
            trigger: "change",
          },
        ],
      },

      dept_id: null,
      changeNum: 0,
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

    changeHandUser(userIds, nodes,parentNode) {
      this.getListSysPerson(this.form.depart_user)
    },
    // 获取用户信息
    getListSysPerson(id){
      this.$client.getEmployeeManageDetail({id}).then(req => {
        if (req.head.result === "200") { 
          this.form.position_name = req.context.position_job
          this.form.depart_dept_name = req.context.dept_main_name
          this.form.depart_dept = req.context.dept_id
          this.dateChange()
        }
      })
    },
  },
   
}
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
</style>

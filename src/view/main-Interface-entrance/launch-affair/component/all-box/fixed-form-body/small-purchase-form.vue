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
        <el-form-item label="经办部门" prop="dept_id">
          <el-select v-model="form.dept_id" :disabled="!deptList.length" style="width:100%" placeholder="请选择经办部门">
            <el-option
              v-for="item in deptList"
              :key="item.dept_id"
              :label="item.dept_name"
              :value="item.dept_id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <!-- <el-col :span="12">
        <el-form-item label="经办人" prop="duty_person_id">
          <get-department-select
            ref="personalTree2"
            v-model="form.duty_person_id"
            :isShowCheckbox="false"
            :placeholder="'请选择经办人'"
            :isContainEmp="true"
            :isExportMultiple="false"
          ></get-department-select>
        </el-form-item>
      </el-col> -->
      <el-col :span="12">
        <el-form-item label="经办时间" prop="duty_date">
          <el-date-picker
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            v-model="form.duty_date"
            style="width: 100%;">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="采购类型" prop="purchase_type">
          <get-select-dictionaries
            style="width: 100%"
            v-model="form.purchase_type"
            :placeholder="'请选择采购类型'"
            @change="dateChange"
            :clearable="false"
            :classKey="'small-purchase-type'" 
          ></get-select-dictionaries>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="估算金额(元)" prop="estimated_amount">
          <el-input 
            v-model="form.estimated_amount" 
            placeholder="请输入估算金额" 
            @change="dateChange"
            oninput="value=value.replace(/[^\d.-]/g,'')" 
            @blur="form.estimated_amount = $event.target.value"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="申请事由" prop="apply_reason">
          <el-input type="textarea" show-word-limit v-model="form.apply_reason" :rows="4" placeholder="请输入申请事由"></el-input>
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
import { getUser } from '@/utils/auth';
import { formatTime, deepCopy } from '@/utils/index';  
import imageFileUpload from "@/components/imageFileUpload/index";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries/list";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import common from './common/index'
export default {
  name: "small-purchase-form",
  components: {
    imageFileUpload,
    getDepartmentSelect,
    getSelectDictionaries,
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
        id: 0,
        user_id:null,
        dept_id:null,
        duty_person_id: null,
        duty_date: '',
        purchase_type: '',
        estimated_amount: 0,
        apply_reason: '',
        remark: '',
        files_list: [],
        thumbnail_imgs: [],
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
            message: "请选择经办部门",
            trigger: "change",
          },
        ],
        // duty_person_id: [
        //   {
        //     required: true,
        //     message: "请选择经办人",
        //     trigger: "change",
        //   },
        // ],
        duty_date: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        purchase_type: [
          {
            required: true,
            message: "请选择采购类型",
            trigger: "change",
          },
        ],
        estimated_amount: [
          {
            required: true,
            message: "请输入估算金额",
            trigger: "change",
          },
        ],
        apply_reason: [
          {
            required: true,
            message: "请输入申请事由",
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
        this.form.duty_date = formatTime(new Date())
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
  },
}
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
</style>

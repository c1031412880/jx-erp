<template>
  <el-form ref="form" size="mini" :model="form" :rules="rules" label-suffix=":">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="申请人" prop="user_id">
          <get-department-select
            ref="personalTree"
            v-model="form.user_id"
            :isShowCheckbox="false"
            :placeholder="'请选择拟稿人'"
            :isContainEmp="true"
            :show_all="true"
            :isExportMultiple="false"
            :disabled="isShowSelectUser || isAgain"
            @on-change="selectedUser"
            :clearable="false"
            style="width:100%"
          ></get-department-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="申请部门" prop="dept_id">
           <el-select v-model="form.dept_id" :disabled="!deptList.length" style="width:100%" @change="dateChange" placeholder="请选择申请部门">
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
        <el-form-item prop="adjust_time" label="申报日期">
          <el-date-picker
            :clearable="false"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            v-model="form.adjust_time"
            style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="线路调整类型" prop="type">
          <get-select-dictionaries 
            style="width:100%"
            v-model="form.type" 
            :clearable="false"
            @change="dateChange"  
            :classKey="'oa-line-type'" 
            :placeholder="'请选择线路调整类型'" 
          ></get-select-dictionaries>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="申报理由及下一步实施计划" prop="reason">
          <el-input type="textarea" v-model="form.reason" style="width:100%"></el-input>
        </el-form-item>
      </el-col>
      <h2 style="font-weight: bold;font-size: 16px;">优化调整后营运指标</h2>
      <el-col :span="12">
        <el-form-item label="单趟营运时间（候客时间）" prop="trip_time">
          <el-input v-model="form.trip_time" clearable placeholder="请输入" style="width:100%"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="单趟里程（公里）" prop="trip_mile">
          <el-input v-model="form.trip_mile" clearable placeholder="请输入" style="width:100%"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="总班次（班次）" prop="total_trip">
          <el-input v-model="form.total_trip" clearable placeholder="请输入" style="width:100%"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="代号" prop="code">
          <el-input v-model="form.code" clearable placeholder="请输入" style="width:100%"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="总里程公里（公里）天" prop="day_mile">
          <el-input v-model="form.day_mile" clearable placeholder="请输入" style="width:100%"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="单趟营运时间（分钟）">
          <div style=" display:flex;width:100%">
            <el-form-item label="高峰" label-width="60px" prop="trip_time_high" style="margin-bottom: 0">
              <el-input v-model="form.trip_time_high" clearable placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="平峰" label-width="60px" prop="trip_time_low"  style="margin-bottom: 0">
              <el-input v-model="form.trip_time_low" clearable placeholder="请输入"></el-input>
            </el-form-item>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="总平均代号营运时间与休息时间比值" prop="trip_avg">
          <el-input v-model="form.trip_avg" clearable placeholder="请输入" style="width:100%"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" style="margin-bottom: 20px">
        <image-file-upload 
          :images="form.thumbnail_imgs"
          :files="form.files_list"
          :isEdit="true"
          @files-update-success="filesUpdateSuccess"
          @images-update-success="imagesUpdateSuccess"></image-file-upload>
      </el-col>
    </el-row>
  </el-form>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import multipleFilesUpload from "@/components/multiple-files-upload";
import imageFileUpload from "@/components/imageFileUpload/index";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries/list";
import { getUser } from "@/utils/auth";
import { deepCopy, formatDate } from "@/utils/index";
import common from './common/index'
export default {
  name: "line-adjustment-form",
  components: {
    getDepartmentSelect,
    multipleFilesUpload,
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
      default: false
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
        adjust_time: '',
        type: '',
        reason:'',
        trip_time:'',
        trip_mile:'',
        total_trip:'',
        code:'',
        day_mile:'',
        trip_time_high:'',
        trip_time_low:'',
        trip_avg:'',
        files_list: [],
        thumbnail_imgs: [],
        id: 0
      },
      oldForm: null, // 历史草稿数据   用来比较是否修改
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
        type: [
          {
            required: true,
            message: "请选择线路调整类型",
            trigger: "change",
          },
        ],
        adjust_time: [
          {
            required: true,
            message: "请选择申报日期",
            trigger: "change",
          },
        ],
        reason: [
          {
            required: true,
            message: "请填写申报理由及下一步实施计划",
            trigger: "change",
          },
        ],
        trip_time: [
          {
            required: true,
            message: "请输入单趟营运时间",
            trigger: "change",
          },
        ],
        trip_mile: [
          {
            required: true,
            message: "请输入单趟里程（公里）",
            trigger: "change",
          },
        ],
        total_trip: [
          {
            required: true,
            message: "请输入总班次（班次）",
            trigger: "change",
          },
        ],
        code: [
          {
            required: true,
            message: "请输入代号",
            trigger: "change",
          },
        ],
        day_mile: [
          {
            required: true,
            message: "请输入总里程公里（公里）天",
            trigger: "change",
          },
        ],
        trip_time_high: [
          {
            required: true,
            message: "请输入高峰时间",
            trigger: "change",
          },
        ],
        trip_time_low: [
          {
            required: true,
            message: "请输入平峰时间",
            trigger: "change",
          },
        ],
        trip_avg: [
          {
            required: true,
            message: "请输入总平均代号营运时间与休息时间比值",
            trigger: "change",
          },
        ],

      },

      dept_id: null,
      changeNum: 0,
      deptList: []
    }
  },
  created() {
  },
  mounted() {},
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
        this.form.adjust_time = formatDate(new Date(),'yyyy-MM-dd')
        if (getUser()) {
          let userInfo = JSON.parse(getUser());
          console.log(userInfo);
          this.form.user_id =  Number(userInfo.user_id)
          this.dept_id = Number(userInfo.department_id);
        }
      }
    },
    // 选择人员后获取部门信息
    async selectedUser(userIds, nodes,parentNode) {
      console.log(userIds, nodes,parentNode);
      if(!nodes) {
        this.form.dept_id = ''
        return false
      }
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
  watch:{
    dialogBool() {
      if(!this.dialogBool) {
        this.$refs.personalTree.onClear();
        // this.$refs.departmentlTree.onClear();
        Object.assign(this.$data.form, this.$options.data().form);
      }else{
        this.$nextTick(() => {
          this.$refs["form"].resetFields();
        })
      }
    }
  }
}
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
</style>

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
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="检查类型" prop="check_type">
          <el-input v-model="form.check_type" placeholder="请输入检查类型"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="车辆所属部门" prop="vehicle_dept_id">
          <get-department-select
            ref="baseTree"
            :isShowCheckbox="false"
            :funcType="1"
            v-model="form.vehicle_dept_id"
            @change="dateChange"
            :isExportMultiple="false"
          ></get-department-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="公司车辆总数（辆）" prop="vehicle_total">
          <el-input v-model="form.vehicle_total" placeholder="请输入公司车辆总数" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.vehicle_total = $event.target.value"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" prop="date">
        <el-form-item label="检查日期"> 
          <el-date-picker
            v-model="date"
            type="daterange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="选择开始日期"
            end-placeholder="选择结束日期"
            :picker-options="pickerOptions"
            @change="selectedTime"
            :clearable="false"
          ></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="检查地点" prop="check_address">
          <el-input v-model="form.check_address" placeholder="请选择检查地点"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="实检车辆数（辆）" prop="vehicle_count">
          <el-input v-model="form.vehicle_count" placeholder="请输入实检车辆数" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.count = $event.target.value"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="故障率" prop="fail_rate">
          <el-input v-model="form.fail_rate" placeholder="请输入故障率"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="检查人员" prop="check_name">
          <el-input v-model="form.check_name" placeholder="请输入故障率"></el-input>
          <!-- <get-department-select
            ref="personalTreeThree"
            v-model="form.check_id"
            :isShowCheckbox="true"
            :placeholder="'请选择检查人员'"
            :isContainEmp="true"
            :show_all="true"
            :isExportMultiple="true"
            :isCheckStrictly="false"
          ></get-department-select> -->
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="整改情况" prop="check_sutiation">
          <el-input type="textarea" show-word-limit v-model="form.check_sutiation" :rows="4" placeholder="请输入整改情况"></el-input>
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
  name: "vehicle-safe-inspect",
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
      date: [],
      form: {
        user_id:null,
        dept_id:null,
        check_type: '',
        vehicle_dept_id: '',
        vehicle_total: '',
        start_date:'',
        end_date:'',
        check_address: '',
        vehicle_count: '',
        fail_rate: '',
        check_name: '',
        check_sutiation: '',
        files_list: [],
        thumbnail_imgs: [],
        id: 0
      },
      minDate: new Date(),
      maxDate: new Date(),
      pickerOptions: {
        disabledDate:(time)=> {
          let front = new Date(this.minDate.getTime() - 86400000 * 31)
          let end = new Date(this.maxDate.getTime() + 86400000 * 31)
          // console.log(!(front < time && time < end), formatDateTime(front),formatDateTime(time),formatDateTime(end))
          return !(front < time && time < end);
        },
        onPick:(obj)=> {
          // console.log(obj)
          this.minDate = (!!obj && obj.minDate) || new Date()
          this.maxDate = (!!obj && obj.maxDate) || this.minDate
        }
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
            message: "请选择申请部门",
            trigger: "change",
          },
        ],
        check_type: [
          {
            required: true,
            message: "请选择检查类型",
            trigger: "change",
          },
        ],
        vehicle_dept_id: [
          {
            required: true,
            message: "请选择车辆所属部门",
            trigger: "change",
          },
        ],
        vehicle_total: [
          {
            required: true,
            message: "请输入公司车辆总数",
            trigger: "change",
          },
        ],
        check_address: [
          {
            required: true,
            message: "请输入检查地点",
            trigger: "change",
          },
        ],
        vehicle_count: [
          {
            required: true,
            message: "请输入实检车辆数",
            trigger: "change",
          },
        ],
        fail_rate: [
          {
            required: true,
            message: "请输入故障率",
            trigger: "change",
          },
        ],
        // repair_content: [
        //   {
        //     required: true,
        //     message: "请输入备注",
        //     trigger: "change",
        //   },
        // ],
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
        this.date = [this.form.start_date, this.form.end_date]
        this.dept_id = JSON.parse(JSON.stringify(info.dept_id))
      } else {
        let time = formatTime(new Date())
        this.date = [time, time]
        this.form.start_date = time
        this.form.end_date = time
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
    selectedTime() {
      if(this.date && this.date.length>0) {
        // let date = this.$addTime([this.date[0], this.date[1]])
        this.form.start_date = date[0];
        this.form.end_date = date[1];
      }else{
        this.form.start_date = ''
        this.form.leave_end = ''
      }
    },
  },
   
}
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
</style>

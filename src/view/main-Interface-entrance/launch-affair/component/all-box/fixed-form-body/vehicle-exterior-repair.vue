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
      <el-col :span="12">
        <el-form-item label="日期" prop="date">
          <el-date-picker
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            v-model="form.date"
            style="width: 100%;">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="驾驶员" prop="driver_id">
          <get-all-dept-user-tree
            ref="driverTree"
            v-model="form.driver_id"
            :isShowCheckbox="false"
            :placeholder="'请选择驾驶员'"
            :isContainEmp="true"
            :show_all="true"
            :isExportMultiple="false"
          ></get-all-dept-user-tree>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="自编号（车牌号）" prop="vehicle_id">
          <get-vehicle-select-tree
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="false"
            :codeAndName="true"
            @on-change="onSelectChange"
            v-model="form.vehicle_id">
          </get-vehicle-select-tree>
        </el-form-item>
      </el-col>
      <!-- <el-col :span="12">
        <el-form-item label="车辆部门" prop="vehicle_dept_id">
          <get-department-select
            ref="baseTree"
            :isShowCheckbox="false"
            :funcType="1"
            :placeholder="'车辆部门'"
            :isExportMultiple="false"
            v-model="form.vehicle_dept_id"
            @on-change="dateChange"
          ></get-department-select>
        </el-form-item>
      </el-col> -->
      <el-col :span="12">
        <el-form-item label="预估单价（元）" prop="price">
          <get-select-dictionaries 
            style="width:100%"
            v-model="form.price" 
            :clearable="false"
            @change="dateChange"
            :classKey="'oa-vehicle-price'" 
            :placeholder="'请选择单价'" 
          ></get-select-dictionaries>
          <!-- <el-select v-model="form.price" style="width:100%" @change="dateChange" placeholder="请选择所在部门">
            <el-option
              v-for="item in priceList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select> -->
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="实际维修金额(元)" prop="i_real_amount">
          <el-input-number v-model="form.i_real_amount" style="width: 100%;" :min="0" :precision="2" :controls="false"></el-input-number>
        </el-form-item>
      </el-col>
      <el-col :span="12" v-show="!!isWorkOrder && form.maint_repair_order">
        <el-form-item label="关联维修工单" prop="maint_repair_order">
          <el-input v-model="form.maint_repair_order" disabled placeholder="请输入工单号"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="受托维修单位" prop="repair_unit">
          <get-select-dictionaries 
            style="width:100%"
            v-model="form.repair_unit" 
            :clearable="false"
            :classKey="'oa-vehicle-repair_unit'" 
            :placeholder="'请选择受托维修单位'" 
          ></get-select-dictionaries>
          <!-- <get-repair-unit v-model="form.repair_unit" :width="'100%'"></get-repair-unit> -->
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="维修内容" prop="repair_content">
          <el-input type="textarea" show-word-limit v-model="form.repair_content" :rows="4" placeholder="请输入维修内容"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="验收记录" prop="check_record">
          <el-input type="textarea" show-word-limit v-model="form.check_record" :rows="4" placeholder="请输入验收记录"></el-input>
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
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries/list";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import imageFileUpload from "@/components/imageFileUpload/index";
import getRepairUnit from "@/components/base/formModel/select/get-repair-unit";
import getAllDeptUserTree from "@/components/base/formModel/tree/get-all-dept-user-tree";
import { getUser } from '@/utils/auth';
import { formatTime, deepCopy } from '@/utils/index';  
import common from './common/index'
export default {
  name: "vehicle-exterior-repair",
  components: {
    getSelectDictionaries,
    getDepartmentSelect,
    imageFileUpload,
    getRepairUnit,
    getVehicleSelectTree,
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
    isWorkOrder: {
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
        driver_id: '',
        vehicle_id: '',
        vehicle_dept_id: '',
        price: '',
        repair_unit: '',
        repair_content: '',
        check_record: '',
        maint_repair_order: '',
        i_real_amount: 0,
        files_list: [],
        thumbnail_imgs: [],
        id: 0
      },
      priceList: [
        {label: '单价<=1500',value: 1},
        {label: '单价<=5000',value: 2},
        {label: '单价> 5000',value: 3},
      ],
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
        date: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        // driver_id: [
        //   {
        //     required: true,
        //     message: "请选择驾驶员",
        //     trigger: "change",
        //   },
        // ],
        vehicle_id: [
          {
            required: true,
            message: "请选择车辆",
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
        repair_unit: [
          {
            required: true,
            message: "请选择受委托单位",
            trigger: "change",
          },
        ],
        repair_content: [
          {
            required: true,
            message: "请输入维修内容",
            trigger: "change",
          },
        ],
        // check_record: [
        //   {
        //     required: true,
        //     message: "请输入验收记录",
        //     trigger: "change",
        //   },
        // ]
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
    //选择车辆 绑定所属公司和线路
    onSelectChange(vhe,node) {
        this.$client.GetVehicleInfoById({ id: vhe }).then((res) => {
          if (res.head.result == "200") {
            this.form.vehicle_dept_id = res.context.dept_id
            this.dateChange()
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {});
      // }
    },
    // 初始化数据
    initSet(info){
      if(this.isWorkOrder) return
      if (!!info) {
        for (const key in this.form) {
          if (Object.hasOwnProperty.call(info, key) && key != 'dept_id') {
            this.form[key] = info[key];
          }
        }
        this.dept_id = JSON.parse(JSON.stringify(info.dept_id))
      } else {
        this.form.date = formatTime(new Date())
        if (getUser()) {
          let userInfo = JSON.parse(getUser());
          this.form.user_id = Number(userInfo.user_id);
          this.dept_id = Number(userInfo.department_id);
        }
      }
    },
    // 由工单弹窗打开
    initSetFormData(val) {
      let info = Object.assign({}, val)
      // this.form.work_id = info.id
      this.form.maint_repair_order = info.work_code
      this.form.driver_id = info.driver_id
      this.form.vehicle_id = info.vehicle_id
      this.form.date = info.repair_time
      this.form.repair_content = info.repair_describe
      if (getUser()) {
        let userInfo = JSON.parse(getUser());
        this.form.user_id = Number(userInfo.user_id);
        this.dept_id = Number(userInfo.department_id);
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

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
        <el-form-item label="领用类型">
          <el-select v-model="form.type" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12" v-if="form.type == 1">
        <el-form-item label="车牌号（自编号）" prop="vehicle_id">
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
      <!-- <el-col :span="12" v-if="form.type == 1">
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
      <el-col :span="12" v-if="form.type == 2">
        <el-form-item label="领用部门" prop="receive_dept">
          <el-input v-model="form.receive_dept" placeholder="请输入领用部门" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="配件名称" prop="part_name">
          <!-- <el-input v-model="form.part_name" @focus="materialsVisible=true" placeholder="请选择配件名称"></el-input> -->
          <el-input v-model="form.part_name" placeholder="请输入配件名称"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="单价（元）" prop="price">
          <el-input v-model="form.price" @change="sumTotalFee(1)" placeholder="请输入单价"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="数量" prop="count">
          <el-input v-model="form.count" @change="sumTotalFee(0)" placeholder="请输入数量" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.count = $event.target.value"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="总价（元）" prop="total_fee">
          <el-input disabled v-model="form.total_fee" placeholder="请输入总价"></el-input>
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
    <el-dialog
      center
      title="选择配件"
      fullscreen
      :visible.sync="materialsVisible"
      append-to-body>
      <materials-list
        @on-save="materialsSelectRowList"
        @on-close="materialsVisible = false"/>
    </el-dialog>
  </el-form>
</template>

<script type="text/ecmascript-6">
import materialsList from "./component/materials-list"
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import imageFileUpload from "@/components/imageFileUpload/index";
import { getUser } from '@/utils/auth';
import { formatTime, deepCopy } from '@/utils/index';  
import common from './common/index'
export default {
  name: "auto-parts-removed",
  components: {
    materialsList,
    getDepartmentSelect,
    imageFileUpload,
    getVehicleSelectTree
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
        vehicle_id: '',
        vehicle_dept_id: '',
        // part_id: '',
        part_name: '',
        price: '',
        count: '',
        total_fee: '',
        remark: '',
        receive_dept: '',
        type: 1,
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
        part_name: [
          {
            required: true,
            message: "请输入配件名称",
            trigger: "change",
          },
        ],
        vehicle_id: [
          {
            required: true,
            message: "请选择车牌号",
            trigger: "change",
          },
        ],
        price: [
          {
            required: true,
            message: "请输入单价",
            trigger: "change",
          },
        ],
        count: [
          {
            required: true,
            message: "请输入领用数量",
            trigger: "change",
          },
        ],
        total_fee: [
          {
            required: true,
            message: "请输入总价",
            trigger: "change",
          },
        ],
        remark: [
          {
            required: true,
            message: "请输入备注",
            trigger: "change",
          },
        ],
        receive_dept: [
          {
            required: true,
            message: "请输入领用部门",
            trigger: "change",
          },
        ],
      },
      typeList: [
        {
          value: 1,
          label:'车辆'
        },
        {
          value: 2,
          label:'部门'
        },
      ],
      materialsVisible: false,
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
    // 回显配件
    materialsSelectRowList(val) {
      this.form.part_id = val.id
      this.form.part_name = val.name
      this.form.price = val.price
      this.sumTotalFee(1)
      this.materialsVisible = false
    },
    sumTotalFee(type) {
      this.form.total_fee = Number(this.form.price) * Number(this.form.count)
      if(type && this.form.price) {
        this.dateChange()
      }
    }
  },
   
}
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
</style>

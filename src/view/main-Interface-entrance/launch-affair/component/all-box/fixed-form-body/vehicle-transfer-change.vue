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
        <el-form-item label="调动日期" prop="request_date">
          <el-date-picker
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            v-model="form.request_date"
            style="width: 100%;">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="车牌号（自编号）" prop="vehicle_ids">
          <get-vehicle-select-tree
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            @on-change="onSelectChange"
            v-model="form.vehicle_ids">
          </get-vehicle-select-tree>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="调出部门" prop="out_depts">
          <el-input v-model="form.out_depts" placeholder="请输入调出部门" disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="调出线路" prop="out_lines">
          <el-input v-model="form.out_lines" placeholder="请输入调出线路" disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="调入部门" prop="target_dept_id">
          <get-department-select
            ref="baseEnterTree"
            :isShowCheckbox="false"
            :funcType="1"
            v-model="form.target_dept_id"
            @on-change="changeTarge"
            :isExportMultiple="false"
          ></get-department-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="调入线路" prop="target_line_id">
          <el-select v-model="form.target_line_id" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in lineList"
              :key="item.line_id"
              :label="item.line_name"
              :value="item.line_id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="变更原因" prop="deploy_reason">
          <el-input type="textarea" show-word-limit v-model="form.deploy_reason" :rows="4" placeholder="请输入变更原因"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="车辆附件设备" prop="attachment">
          <el-input type="textarea" show-word-limit v-model="form.attachment" :rows="4" placeholder="请输入车辆附件设备"></el-input>
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
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import imageFileUpload from "@/components/imageFileUpload/index";
import { getUser } from '@/utils/auth';
import { formatTime, deepCopy } from '@/utils/index';  
import common from './common/index'
export default {
  name: "vehicle-transfer-change",
  components: {
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
      date: [],
      form: {
        user_id:null,
        dept_id:null,
        request_date: '',
        vehicle_ids: [],
        target_dept_id: '',
        target_line_id: '',
        deploy_reason: '',
        attachment: '',
        out_depts: '',
        out_lines: '',
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
        request_date: [
          {
            required: true,
            message: "请选择调动日期",
            trigger: "change",
          },
        ],
        vehicle_ids: [
          {
            required: true,
            message: "请选择车辆",
            trigger: "change",
          },
        ],
        // out_depts: [
        //   {
        //     required: true,
        //     message: "请选择调出部门",
        //     trigger: "change",
        //   },
        // ],
        // out_lines: [
        //   {
        //     required: true,
        //     message: "请选择调出线路",
        //     trigger: "change",
        //   },
        // ],
        enter_dept_id: [
          {
            required: true,
            message: "请选择调入部门",
            trigger: "change",
          },
        ],
        deploy_reason: [
          {
            required: true,
            message: "请输入变更原因",
            trigger: "change",
          },
        ],
      },

      dept_id: null,
      changeNum: 0,
      lineList: []
    }
  },
  watch:{
    dialogBool() {
      if(!this.dialogBool) {
        this.$refs.personalTree.onClear();
        this.$refs.vehicleTree.onClear()
        this.$refs.baseEnterTree.onClear()
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
        this.form.request_date = formatTime(new Date())
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
    // 获取车辆信息
    onSelectChange(vehs, nodes) {
      if (vehs.length == 0) {
        this.form.out_depts = ''
        this.form.out_lines = ''
      } else {
        this.GetDeployInfoByVehicles(vehs)
      }
    },
    // 根据车辆ID列表获取调出部门和调出线路信息
    GetDeployInfoByVehicles(ids) {
      this.$client.GetDeployInfoByVehicles({ids}).then(res => {
        if(res.head.result == '200') {
          this.form.out_depts = res.context.list.depts
          this.form.out_lines = res.context.list.lines
        }
      })
    },
    // 获取部门下的线路 
    changeTarge(vehs, nodes, parentNode) {
      if (vehs.length == 0) {
        this.form.target_line_id = ''
      } else {
        this.GetLineInfoByDept(vehs)
      }
    },
    // 根据部门ID获取所属线路列表
    GetLineInfoByDept(id) {
      this.$client.GetLineInfoByDept({id}).then(res => {
        if(res.head.result == '200') {
          this.lineList= res.context.list
        }
      })
    },
  },
}
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
</style>

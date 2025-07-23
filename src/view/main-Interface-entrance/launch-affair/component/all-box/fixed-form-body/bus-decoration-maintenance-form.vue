<template>
  <el-form ref="form" size="mini" :model="form" :rules="rules" label-suffix=":">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="报修人员" prop="user_id">
          <get-department-select
            ref="personalTree"
            v-model="form.user_id"
            :isShowCheckbox="false"
            :placeholder="'请选择发送部门报修人员'"
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
        <el-form-item label="申请类型" prop="apply_type_id">
          <get-select-dictionaries
            style="width: 100%"
            v-model="form.apply_type_id"
            :placeholder="'请选择申请类型'"
            @change="dateChange"
            :clearable="false"
            :classKey="'repair_decoration-type'" 
          ></get-select-dictionaries>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="车号" prop="vehicle_name">
           <el-input v-model="form.vehicle_name" placeholder="请输入车号"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="时间" prop="request_date">
          <el-date-picker
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择时间"
            v-model="form.request_date"
            style="width: 100%;">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="车型" prop="vehicle_model">
           <el-input v-model="form.vehicle_model" placeholder="请输入车型"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="已总行驶里程" prop="vehicle_kilometers">
           <el-input v-model="form.vehicle_kilometers" placeholder="请输入已总行驶里程"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="预计维修/装饰费用（元）" prop="plan_cost">
          <el-input-number v-model="form.plan_cost" @change="dateChange" style="width: 100%;" :min="0" :precision="2" :controls="false"></el-input-number>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="报修/装饰项目" prop="DecorateItem">
           <el-input type="textarea" v-model="form.DecorateItem" :rows="4" placeholder="请输入报修/装饰项目"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="更换材料" prop="change_material">
           <el-input type="textarea" v-model="form.change_material" :rows="4" placeholder="请输入更换材料"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="修复时间" prop="repair_date">
          <el-date-picker
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择修复时间"
            v-model="form.repair_date"
            style="width: 100%;">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="实际维修金额" prop="real_cost">
          <el-input-number v-model="form.real_cost" style="width: 100%;" :min="0" :precision="2" :controls="false"></el-input-number>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="注释" prop="remark">
           <el-input type="textarea" v-model="form.remark" :rows="4" placeholder="请输入注释"></el-input>
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
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries/list";
import common from './common/index'
export default {
  name: "bus-decoration-maintenance-form",
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
        user_id:null,
        dept_id:null,
        apply_type_id: '',
        vehicle_name: '',
        request_date: '',
        vehicle_model: '',
        vehicle_kilometers: '',
        plan_cost: '',
        DecorateItem: '',
        change_material: '',
        repair_date: '',
        real_cost: '',
        remark: '',
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
            message: "请选择报修人",
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
        apply_type_id: [
          {
            required: true,
            message: "请选择申请类型",
            trigger: "change",
          },
        ],
        vehicle_name: [
          {
            required: true,
            message: "请输入车号",
            trigger: "change",
          },
        ],
        request_date: [
          {
            required: true,
            message: "请选择时间",
            trigger: "change",
          },
        ],
        vehicle_model: [
          {
            required: true,
            message: "请输入车型",
            trigger: "change",
          },
        ],
        plan_cost: [
          {
            required: true,
            message: "请输入预计维修/装饰费用（元）",
            trigger: "change",
          },
        ],
        DecorateItem: [
          {
            required: true,
            message: "请输入报修/装饰项目",
            trigger: "change",
          },
        ],
        change_material: [
          {
            required: true,
            message: "请输入更换材料",
            trigger: "change",
          },
        ],
        repair_date: [
          {
            required: true,
            message: "请选择修复时间",
            trigger: "change",
          },
        ],
        real_cost: [
          {
            required: true,
            message: "请输入实际维修金额",
            trigger: "change",
          },
        ],
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
        this.dept_id = JSON.parse(JSON.stringify(info.dept_id))
      } else {
        this.form.request_date = formatTime(new Date(),'yyyy-MM-dd')
        this.form.repair_date = formatTime(new Date(),'yyyy-MM-dd')
        this.form.remark = '1.公务车修理费500-3000(含)元由公司分管领导审批;3000元以上由公司总经理审批。' + '\n' + 
        '2.公务车装饰费500(含)元以下由公司分管领导审批,500元以上由公司总经理审批。' + '\n' + 
        '3.本表一式二份，其中财务处、机务处各一份。'
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
      this.form.files_list = filesList;
    },
  },
   
}
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
</style>

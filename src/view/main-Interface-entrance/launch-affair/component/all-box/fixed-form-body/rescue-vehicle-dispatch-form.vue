<template>
  <el-form ref="form" size="mini" :model="form" :rules="rules" label-suffix=":">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="出车人" prop="user_id">
          <get-department-select
            ref="personalTree"
            v-model="form.user_id"
            :isShowCheckbox="false"
            :placeholder="'请选择出车人'"
            :isContainEmp="true"
            :show_all="true"
            :isExportMultiple="false"
            :disabled="isShowSelectUser || isAgain"
            @on-change="selectedUser"
            :clearable="false"
          ></get-department-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="所在部门" prop="dept_id">
          <!-- <get-department-select
            ref="departmentlTree"
            v-model="form.dept_id"
            :width="'220'"
            :isShowCheckbox="false"
            :placeholder="'请选择所在部门'"
            :isContainEmp="false"
            :isExportMultiple="false"
            :disabled="true"
          ></get-department-select> -->
          <el-select v-model="form.dept_id" :disabled="!deptList.length" style="width:100%" disabled placeholder="请选择申请部门">
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
        <el-form-item label="出车时间" prop="request_date">
          <el-date-picker
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            type="datetime"
            placeholder="选择日期"
            v-model="form.request_date"
            style="width: 100%;">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="支付方式" prop="pay_type">
          <el-select v-model="form.pay_type" style="width: 100%;" placeholder="请选择支付方式">
            <el-option
              v-for="item in payList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select> 
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="施救车型" prop="rescue_vehicle_type">
          <el-select v-model="form.rescue_vehicle_type" style="width: 100%;" placeholder="请选择施救车型">
            <el-option
              v-for="item in modelList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select> 
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="施救地点" prop="rescue_position">
          <el-input v-model="form.rescue_position" placeholder="请输入施救地点"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="form.remark" :rows="4" placeholder="请输入备注" show-word-limit></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="到厂时间" prop="arrived_time">
          <el-date-picker
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            type="datetime"
            placeholder="选择日期"
            v-model="form.arrived_time"
            style="width: 100%;">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="施救费用(元)" prop="rescue_amount">
          <el-input-number v-model="form.rescue_amount" style="width: 100%;" :min="0" :precision="2" :controls="false"></el-input-number>
        </el-form-item>
      </el-col>
      <el-col :span="24" style="margin-bottom: 20px">
        <image-file-upload
          :images="form.thumbnail_imgs"
          :files="form.files_list"
          :isCompress="true"
          :isEdit="true"
          @files-update-success="filesUpdateSuccess"
          @images-update-success="imagesUpdateSuccess"></image-file-upload>
      </el-col>
    </el-row>
  </el-form>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import imageFileUpload from "@/components/imageFileUpload/index-c";
import { getUser } from '@/utils/auth';
import { formatDateTime, deepCopy } from '@/utils/index';
import common from './common/index'
export default {
  name: 'rescue-vehicle-dispatch-form',
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
      form: {
        id: 0,
        user_id:null,
        dept_id:null,
        request_date: '',
        pay_type: 1,
        rescue_vehicle_type: 1,
        rescue_position: '',
        remark: '',
        arrived_time: '',
        rescue_amount: '',
        img_list: [],
        files_list: [],
        thumbnail_imgs: [],
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
        request_date: [
          {
            required: true,
            message: "请选择出车时间",
            trigger: "change",
          },
        ],
        pay_type: [
          {
            required: true,
            message: "请选择支付方式",
            trigger: "change",
          },
        ],
        rescue_vehicle_type: [
          {
            required: true,
            message: "请选择施救车型",
            trigger: "change",
          },
        ],
        rescue_position: [
          {
            required: true,
            message: "请输入施救地点",
            trigger: "change",
          },
        ],
        // arrived_time: [
        //   {
        //     required: true,
        //     message: "请选择到厂时间",
        //     trigger: "change",
        //   },
        // ],
        rescue_amount: [
          {
            required: true,
            message: "请输入施救费用",
            trigger: "change",
          },
        ],
      },

      dept_id: null,
      changeNum: 0,
      deptList: [],

      payList: [
        { value: 1, label: '月结'},
        { value: 2, label: '现结'}
      ],
      modelList: [
        { value: 1, label: '小型车'},
        { value: 2, label: '中型车'},
        { value: 3, label: '大型车'},
      ],
    }
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
        this.form.request_date = formatDateTime(new Date())
        console.log(this.form.request_date);
        
        if (getUser()) {
          let userInfo = JSON.parse(getUser());
          this.form.user_id = Number(userInfo.user_id);
          this.dept_id = Number(userInfo.department_id);
        }
      }
    },
    //  保存草稿时的校验   必填项只要有一个填了  即可保存草稿   除申请人和申请部门
    saveDraft() {
      return new Promise((resolve,reject) => {
        let data = []
        for (const key in this.rules) {
          if (key != "user_id" && key != "dept_id") {
            data.push(key)
          }
        }
        let validList = []
        this.$refs.form.validateField(data,(valid) =>{
          validList.push(valid)
        })
        // 判断是否有已填写项   只要有一个就可以走保存
        if (validList.includes('')) {
          resolve({
            form: this.form
          });
        }else {
          reject({
            msg: '必须填写一项必填项才可保存草稿'
          });
          return false;
        }
      })
    },
    // 选择人员后获取部门信息
    async selectedUser(userIds, nodes,parentNode) {
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
        Object.assign(this.$data, this.$options.data());
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

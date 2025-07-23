<template>
  <el-form ref="form" size="mini" :model="form" :rules="rules" label-suffix=":">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="制表人" prop="user_id">
          <get-department-select
            ref="personalTree1"
            v-model="form.user_id"
            :isShowCheckbox="false"
            :placeholder="'请选择制表人'"
            :isContainEmp="true"
            :show_all="true"
            :isExportMultiple="false"
            :disabled="isShowSelectUser || isAgain"
            @on-change="selectedUser"
          ></get-department-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="检查日期" prop="request_date">
          <el-date-picker
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择检查日期"
            v-model="form.request_date"
            style="width: 100%;">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="受检部门" prop="check_dept_ids">
          <get-department-select
            ref="personalTree2"
            v-model="form.check_dept_ids"
            :isShowCheckbox="true"
            :placeholder="'请选择受检部门'"
            :isContainEmp="false"
            :show_all="false"
            :isExportMultiple="true"
          ></get-department-select>
        </el-form-item>
      </el-col>
      
      <el-col :span="12">
        <el-form-item label="受检部门经办人" prop="be_examined_ids">
          <get-department-select
            ref="personalTree3"
            v-model="form.be_examined_ids"
            :isShowCheckbox="true"
            :placeholder="'请选择受检部门经办人'"
            :isContainEmp="true"
            :isExportMultiple="true"
            :isCheckStrictly="false"
          ></get-department-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="受检车辆" prop="check_vehicle_ids">
          <get-vehicle-select-tree
            ref="vehicleTree"
            :placeholder="'请选择车辆'"
            :isShowCheckbox="true"
            v-model="form.check_vehicle_ids"
            :isExportMultiple="true">
          </get-vehicle-select-tree>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="是否需要整改" prop="whether_change">
          <el-radio-group v-model="form.whether_change">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="参加监督检查单位人员" prop="check_person_ids">
          <get-department-select
            ref="personalTree4"
            v-model="form.check_person_ids"
            :isShowCheckbox="true"
            :placeholder="'请选择人员'"
            :isContainEmp="true"
            :isExportMultiple="true"
            :isCheckStrictly="false"
          ></get-department-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="监督检查主要内容" prop="contents_main">
          <el-input type="textarea" show-word-limit v-model="form.contents_main" :rows="4" placeholder="请输入监督检查主要内容"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="检查中出现的问题" prop="contents_problem">
          <el-input type="textarea" show-word-limit v-model="form.contents_problem" :rows="4" placeholder="请输入检查中出现的问题"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="检查组处理意见" prop="contents_opinion">
          <el-input type="textarea" show-word-limit v-model="form.contents_opinion" :rows="4" placeholder="请输入检查组处理意见"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" style="margin-bottom: 20px">
        <image-file-upload 
          :isShowFiles="false"
          :showTitle="'安全检查照片记录'"
          :images="safe_imgs"
          @images-update-success="imagesUpdateSuccess"></image-file-upload>
      </el-col>
      <el-col :span="24" style="margin-bottom: 20px">
        <image-file-upload 
          :isShowFiles="false"
          :showTitle="'整改前隐患图片'"
          :images="hidden_imgs"
          @images-update-success="imagesUpdateSuccess"></image-file-upload>
      </el-col>
    </el-row>
  </el-form>
</template>

<script type="text/ecmascript-6">
import { getUser } from '@/utils/auth';
import { formatTime, deepCopy } from '@/utils/index';  
import imageFileUpload from "@/components/imageFileUpload/index";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
// import common from './common/index'
export default {
  name: "safety-hazard-form",
  components: {
    imageFileUpload,
    getDepartmentSelect,
    getVehicleSelectTree,
  },
  // mixins: [common],
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
    formId: {
      type: Number,
      default: 0
    },
  },
  data() {
    return {
      form: {
        id: 0,
        user_id: '',
        request_date: '',
        check_dept_ids: [],
        be_examined_ids: [],
        check_vehicle_ids: [],
        whether_change: 1,
        check_person_ids: [],
        contents_main: '',
        contents_problem: '',
        contents_opinion: '',
      },
      safe_imgs: [],
      hidden_imgs: [],
      key: null,
      oldForm: null, // 历史草稿数据   用来比较是否修改
      rules: {
        user_id: [
          {
            required: true,
            message: "请选择制表人",
            trigger: "change",
          },
        ],
        request_date: [
          {
            required: true,
            message: "请选择检查日期",
            trigger: "change",
          },
        ],
        check_dept_ids: [
          {
            required: true,
            message: "请选择受检部门",
            trigger: "change",
          },
        ],
        be_examined_ids: [
          {
            required: true,
            message: "请选择受检部门经办人",
            trigger: "change",
          },
        ],
        contents_main: [
          {
            required: true,
            message: "请输入监督检查主要内容",
            trigger: "change",
          },
        ],
        contents_problem: [
          {
            required: true,
            message: "请输入检查中出现的问题",
            trigger: "change",
          },
        ],
        contents_opinion: [
          {
            required: true,
            message: "请输入检查组处理意见",
            trigger: "change",
          },
        ],
      },
    }
  },
  watch:{
    dialogBool() {
      if(!this.dialogBool) {
        this.$refs.personalTree1.onClear();
        this.$refs.personalTree2.onClear();
        this.$refs.personalTree3.onClear();
        this.$refs.personalTree4.onClear();
        this.$refs.vehicleTree.onClear();
        Object.assign(this.$data.form, this.$options.data().form);
        this.safe_imgs = []
        this.hidden_imgs = []
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
          if (Object.hasOwnProperty.call(info, key)) {
            this.form[key] = info[key];
          }
        }
      } else {
        this.form.date = formatTime(new Date())
        if (getUser()) {
          let userInfo = JSON.parse(getUser());
          this.form.user_id = Number(userInfo.user_id);
        }
      }
    },
    selectedUser(userIds, nodes,parentNode) {
      this.dateChange()
    },
    // 保存草稿时的校验   必填项只要有一个填了  即可保存草稿   除申请人和申请部门
    saveDraft() {
      return new Promise((resolve,reject) => {
        let data = []
        for (const key in this.rules) {
          if (key != "user_id") {
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
    // 合并表单值
    outData() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            resolve({
              form: this.form
            });
          } else {
            reject({
              msg: '获取失败,带星号的为必填项'
            });
            return false;
          }
        });
      });
    },
    // 上传图片
    imagesUpdateSuccess(val) {
      let obj = ''
      let list = []
      val.forEach(item => {
        obj = {
          thumbnail_url: item.thumbnail_url ? item.thumbnail_url : null,
          url: item.url ? item.url : item,
        }
        list.push(obj)
      })
      this.form.thumbnail_imgs = list
    },
    dateChange() {
      this.$emit('out-form', {
        form: this.form,
        code: this.formId
      })
    },
  },
}
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
</style>

<template>
  <el-form ref="form" size="mini" :model="form" :rules="rules" label-suffix=":">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="整改人" prop="user_id">
          <get-department-select
            ref="personalTree"
            v-model="form.user_id"
            :isShowCheckbox="false"
            :placeholder="'请选择整改人'"
            :isContainEmp="true"
            :show_all="true"
            :isExportMultiple="false"
            :disabled="isShowSelectUser || isAgain"
            @on-change="selectedUser"
          ></get-department-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="反馈日期" prop="request_date">
          <el-date-picker
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择反馈日期"
            v-model="form.request_date"
            style="width: 100%;">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="整改结果" prop="modify_result">
          <el-input type="textarea" v-model="form.modify_result" :rows="4" placeholder="请输入整改结果"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" style="margin-bottom: 20px">
        <image-file-upload 
          :isShowFiles="false"
          :showTitle="'隐患整改后图片'"
          :images="form.thumbnail_imgs"
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
// import common from './common/index'
export default {
  name: "corrective-feedback-form",
  components: {
    getDepartmentSelect,
    imageFileUpload,
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
    correlationId: { //安全隐患审批反馈用
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      form: {
        id: 0,
        user_id:null,
        request_date: '',
        modify_result: '',
        thumbnail_imgs: [],
      },
      oldForm: null, // 历史草稿数据   用来比较是否修改
      rules: {
        user_id: [
          {
            required: true,
            message: "请选择整改人",
            trigger: "change",
          },
        ],
        request_date: [
          {
            required: true,
            message: "请选择反馈日期",
            trigger: "change",
          },
        ],
        modify_result: [
          {
            required: true,
            message: "请输入整改结果",
            trigger: "change",
          },
        ],
      },
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
          if (Object.hasOwnProperty.call(info, key)) {
            this.form[key] = info[key];
          }
        }
      } else {
        this.form.request_date = formatTime(new Date(),'yyyy-MM-dd')
        if (getUser()) {
          let userInfo = JSON.parse(getUser());
          this.form.user_id = Number(userInfo.user_id);
        }
      }
    },
    // 选择人员后获取部门信息
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
      if(!this.form.thumbnail_imgs.length) {
        this.$message({
          message: "请上传隐患整改后图片",
          type: "warning",
        });
        return false
      }
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.form.id = this.correlationId
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
          data_type: 3,
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

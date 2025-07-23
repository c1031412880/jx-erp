<template>
  <tr-dialog
    :visible="dialogBool"
    :title="title"
    @before-close="dialogClose"
    width="760px"
    :close-on-click-modal="false"
    top="20px">
    <div class="el-dialog-div">
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
                @on-change="selectedApproveExaminedUser"
              ></get-department-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="受检地点" prop="address">
              <el-input v-model="form.address" placeholder="请输入受检地点" clearable></el-input>
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
              <el-radio-group v-model="form.whether_change" style="width: 100%;">
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
                @on-change="selectedApproveCheckUser"
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
              :showTitle="'* 安全检查照片记录'"
              :images="safe_imgs"
              @images-update-success="safeImagesUpdateSuccess"></image-file-upload>
          </el-col>
          <el-col :span="24" style="margin-bottom: 20px">
            <image-file-upload 
              :isShowFiles="false"
              :showTitle="'* 整改前隐患图片'"
              :images="hidden_imgs"
              @images-update-success="hiddenImagesUpdateSuccess"></image-file-upload>
          </el-col>
        </el-row>
        <!-- 流程节点显示 -->
        <el-card style="margin-top: 10px;max-height: 330px;overflow: auto">
          <approve-step
            ref="approveStep"
            :key="key"
            @on-users="setUsers"
            :form_data="form_data"
            :object_id="7100">
          </approve-step>
        </el-card>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form', 1)">保存草稿</el-button>
      <el-button type="primary" @click="updatePlaybill('form', 2)">提 交</el-button>
    </span>
  </tr-dialog>
</template>

<script type="text/ecmascript-6">
import {getUser} from '@/utils/auth'
import { formatTime, deepCopy } from '@/utils/index';
import approveStep from '@/components/approve-echo/approve-step2'
import imageFileUpload from "@/components/imageFileUpload/index";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: {
    approveStep,
    imageFileUpload,
    getDepartmentSelect,
    getVehicleSelectTree,
  },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "安全隐患审批",
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
        user_id: '',
        request_date: '',
        check_dept_ids: [],
        be_examined_ids: [],
        check_vehicle_ids: [],
        whether_change: 1,
        check_person_ids: [],
        address: '',
        contents_main: '',
        contents_problem: '',
        contents_opinion: '',
        thumbnail_imgs: [],
        data_state: 1, // 1草稿 2提交
      },
      safe_imgs: [],
      hidden_imgs: [],
      key: null,
      nodes: null,
      object_id: 7100,
      form_data: null,
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
    };
  },
  watch: {
    dialogBool(bool) {
      if(!bool) {
        this.$refs.personalTree1.onClear();
        this.$refs.personalTree2.onClear();
        this.$refs.personalTree3.onClear();
        this.$refs.personalTree4.onClear();
        this.$refs.vehicleTree.onClear();
        Object.assign(this.$data.form, this.$options.data().form);
        this.safe_imgs = []
        this.hidden_imgs = []
      }else{
        // this.$nextTick(() => {
          // this.$refs["form"].resetFields();
        // })
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 选中数据
    setDate(info) {
      console.log(info);
      if(info) {
        let list = Object.assign({}, info)
        for(let key in list) {
          if(list[key] && key !== 'thumbnail_imgs' && key !== 'data_state') {
            this.form[key] = list[key]
          }
        }
        this.safe_imgs = list.thumbnail_imgs.filter(item => item.data_type === 1)
        this.hidden_imgs = list.thumbnail_imgs.filter(item => item.data_type === 2)
        this.form.whether_change = list.whether_change ? list.whether_change : 0
        // console.log(this.safe_imgs, this.hidden_imgs);
      }else {
        this.form.request_date = formatTime(new Date())
        if (getUser()) {
          let userInfo = JSON.parse(getUser());
          this.form.user_id = Number(userInfo.user_id);
        }
      }
      this.FormChange()
    },
    updatePlaybill(formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(type === 2 && (!this.safe_imgs.length || !this.hidden_imgs.length)) {
            this.$message({
              message: "请上传安全检查照片记录和整改前隐患图片",
              type: "warning",
            });
            return false
          }
          this.form.thumbnail_imgs = [...this.safe_imgs, ...this.hidden_imgs]
          this.form.data_state = type
          this.$emit("save-add", this.form, this.nodes);
        } else {
          return false;
        }
      });
    },
    // 上传安全图片
    safeImagesUpdateSuccess(val) {
      let obj = ''
      let list = []
      val.forEach(item => {
        obj = {
          thumbnail_url: item.thumbnail_url ? item.thumbnail_url : null,
          url: item.url ? item.url : item,
          data_type: 1,
        }
        list.push(obj)
      })
      this.safe_imgs = list
    },
    // 上传隐患图片
    hiddenImagesUpdateSuccess(val) {
      let obj = ''
      let list = []
      val.forEach(item => {
        obj = {
          thumbnail_url: item.thumbnail_url ? item.thumbnail_url : null,
          url: item.url ? item.url : item,
          data_type: 2,
        }
        list.push(obj)
      })
      this.hidden_imgs = list
    },
    // 设置流程节点
    setUsers(data) {
      this.nodes = data
    },
    selectedApproveExaminedUser(userIds, nodes,parentNode) {
      if(userIds && userIds.length) {
        this.$refs.approveStep.setApproveUsers(nodes, 'be_examined_ids')
      }
    },
    selectedApproveCheckUser(userIds, nodes,parentNode) {
      if(userIds && userIds.length) {
        this.$refs.approveStep.setApproveUsers(nodes, 'check_person_ids')
      }
    },
    FormChange() {
      this.key = new Date().getTime()
      this.form_data = this.form
      this.object_id = 7100
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>


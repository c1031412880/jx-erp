<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="beforeDialogClose"
    width="760px"
    top="20px"
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" :label-position="'top'" ref="form" label-width="140px" size="mini">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="申请人:" prop="user_id">
              <get-department-select
                ref="applyPersonalTree"
                v-model="form.user_id"
                :width="'500'"
                :show_all="true"
                :isShowCheckbox="false"
                :placeholder="'请选择申请人'"
                :isContainEmp="true"
                :isExportMultiple="false"
                :disabled="isShowSelectUser"
                 @on-change="selectedUser"
              ></get-department-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请部门" prop="department">
              <get-department-select
                ref="departmentlTree"
                v-model="form.department"
                :width="'220'"
                :isShowCheckbox="false"
                :placeholder="'请选择申请部门'"
                :isContainEmp="false"
                :isExportMultiple="false"
                :disabled="true"
              ></get-department-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预约借车时间:" prop="req_time">
              <el-date-picker
                v-model="form.req_time"
                value-format="yyyy-MM-dd HH:mm"
                format="yyyy-MM-dd HH:mm"
                type="datetime"
                placeholder="请选择预约时间"
                style="width:100%"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预计还车时间:" prop="back_time">
              <el-date-picker
                v-model="form.back_time"
                value-format="yyyy-MM-dd HH:mm"
                format="yyyy-MM-dd HH:mm"
                type="datetime"
                style="width:100%"
                placeholder="请选择预计还车时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用车类型:" prop="use_type">
              <!-- <el-select v-model="form.use_type" style="width: 100%;" @change="FormChange" placeholder="请选择用车类型">
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select> -->
              <get-select-dictionaries 
                style="width:100%"
                v-model="form.use_type" 
                @change="FormChange"
                :classKey="'oa-vehicle-type'" 
                :placeholder="'请选择用车类型'" 
              ></get-select-dictionaries>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出发地:" prop="from_address">
              <el-input v-model="form.from_address" placeholder="请输入出发地" :disabled="curChangeType =='detail'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目的地:" prop="to_address">
              <el-input v-model="form.to_address" placeholder="请输入目的地" :disabled="curChangeType =='detail'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="申请事由:" prop="purpose">
              <el-input type="textarea" :rows="4" v-model="form.purpose" placeholder="请输入申请事由" :disabled="curChangeType =='detail'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: 20px">
            <image-file-upload
              :images="form.img_list"
              :files="form.file_list"
              :maxUpLoadSize="100"
              :isPreview="false"
              @files-update-success="filesUpdateSuccess"
              @images-update-success="imagesUpdateSuccess"></image-file-upload>
          </el-col>
        </el-row>
        <!-- 流程节点显示 -->
        <el-card v-if="form.is_audit == 1" style="margin-top: 10px;max-height: 330px;overflow: auto">
          <approve-step
            ref="approveStep"
            :key="key"
            @on-users="setUsers"
            :form_data="form_data"
            :object_id="object_id">
          </approve-step>
        </el-card>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer" v-if="curChangeType != 'detail'">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" v-if="form.is_audit == 1"  @click="updateDraft()">保存草稿</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">提 交</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import imageFileUpload from "@/components/imageFileUpload/index";
import approveStep from '@/components/approve-echo/approve-step2'
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries/list";
import {getUser} from '@/utils/auth'
import { deepCopy, isObjectChanged } from "@/utils/index"
export default {
  components: {
    getDepartmentSelect,
    imageFileUpload,
    approveStep,
    getSelectDictionaries
  },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "预约单",
    },
    curChangeType:{
      type: String,
      default: "add",
    },
    isShowSelectUser: {
      type: Boolean,
      default: true
    },
    // bus_id:{
    //   type: String,
    //   default: "",
    // }
    bus_id:null
  },
  mounted() {

  },
  data() {
    return {
      form: {
        bus_id:'',
        name:'',
        department: '',
        code: '',
        user_id: '',
        req_time: '',
        back_time:'',
        use_type: 1,
        purpose: '',
        from_address: '',
        to_address: '',
        is_audit: 0,
        img_list: [],
        file_list: [],
        id: ''
      },
      object_id: 1340,
      form_data: null,
      oldForm: null,
      key: null,
      nodes: null,
      basicRules: {
        user_id: [
          { required: true, message: "请选择申请人", trigger: "change" },
        ],
        department: [
          { required: true, message: "请选择申请部门", trigger: "change" },
        ],
        req_time: [
          { required: true, message: "请选择预约借车时间", trigger: "change" },
        ],
        back_time: [
          { required: true, message: "请选择预还车时间", trigger: "change" },
        ],
        use_type: [
          { required: true, message: "请选择用车类型", trigger: "change" },
        ],
        purpose: [
          { required: true, message: "请输入申请事由", trigger: "change" },
        ],
        from_address: [
          { required: true, message: "请输入出发地", trigger: "change" },
        ],
        to_address: [
          { required: true, message: "请输入目的地", trigger: "change" },
        ],
      },
      typeList: [
        {label: "本地用车", value: 1},
        {label: "出市用车", value: 2},
        {label: "节假日用车", value: 3},
        {label: "过夜用车", value: 4},
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        },
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        this.resetFrom();
      }else{
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
          if(this.curChangeType == 'add') {
            this.setDate();
            if (getUser()) {
              let user_id = Number(JSON.parse(getUser()).user_id)
              this.GetBusRequestDraftByUser(user_id)
            }
          }
        })
      }
    },
  },
  methods: {
    // 获取草稿详情
    GetBusRequestDraftByUser(user_id) {
      let params = {
        user_id: user_id,
        bus_id: this.bus_id
      }
      this.$client.GetBusRequestDraftByUser(params).then(res => {
        if(res.head.result == '200') {
          let info = res.context
          if(!!info) {
            for (const key in this.form) {
              if (Object.hasOwnProperty.call(info, key)) {
                this.form[key] = info[key];
              }
            }
          }
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
        this.form.user_id = Number(JSON.parse(getUser()).user_id)
        this.form.department = Number(JSON.parse(getUser()).department_id)
        this.oldForm = deepCopy(this.form)
        // this.FormChange()
      })
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
     // 点X 关闭前提醒是否需要保存草稿
    beforeDialogClose() {
      // 判断数据是否存在修改
      if (isObjectChanged(this.form,this.oldForm) && this.form.is_audit == 1) {
        this.saveDraft().then(res => {
          this.$confirm('是否需要保存草稿?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$emit("save-add-draft", this.form);
          }).catch(() => {
            this.dialogClose()
          });
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.msg,
            type: "warning",
          });
        })
      } else {
        this.dialogClose()
      }
    },
    // 重置
    resetFrom() {
      this.$refs.applyPersonalTree.onClear()
    },
    // 设置默认日期为当天
    setDate() {
      let date = new Date();
      // date.setTime(new Date().getTime());
      let Y = date.getFullYear()
      let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      let D = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()
      let hours = date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours()
      let minutes = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes()
      // let seconds = date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds()
      this.form.req_time = Y + '-' + M + '-' + D + ' ' + hours + ':' + minutes
    },
    updatePlaybill(formName) {
       this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {...this.form};
          this.$emit("save-add-reserved", info,this.nodes);
        } else {
          return false;
        }
      });
    },
    // 保存草稿
    updateDraft() {
      this.saveDraft().then(res => {
        this.$emit("save-add-draft", this.form);
      })
    },
    //  保存草稿时的校验   必填项只要有一个填了  即可保存草稿   除申请人和申请部门
    saveDraft() {
      return new Promise((resolve, reject) => {
        let data = []
        for (const key in this.basicRules) {
          if (key != "borrow_id" && key != "department") {
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
    // 上传图片
    imagesUpdateSuccess(val) {
      let url = '';let list = [];val.forEach(item => {url = item.url ? item.url : item;list.push(url);});this.form.img_list = list
    },
    // 上传文件
    filesUpdateSuccess(filesList) {
      this.form.file_list = filesList;
      // console.log(this.form, filesList);
    },
    // 选择人员后获取部门信息
    selectedUser(userIds, nodes,parentNode) {
      if(userIds.length > 0 && !!parentNode) {
        this.form.department = parentNode.i_id
      }else{
        this.form.department = ''
        this.$refs.departmentlTree.onClear()
      }
      if(this.form.user_id) {
        this.FormChange()
      }
    },
    // 设置流程节点
    setUsers(data) {
      this.nodes = data
    },
    FormChange() {
      this.key = new Date().getTime()
      this.form_data = this.form
      this.object_id = 1340
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
// .el-dialog-div {
//   height: 400px;
// }

</style>


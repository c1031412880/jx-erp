<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="beforeDialogClose"
    width="760px"
    
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" :label-position="'top'" ref="form" label-width="140px" size="mini">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="还车人:" prop="back_id">
              <get-department-select
                ref="applyPersonalTree"
                v-if="dialogBool"
                v-model="form.back_id"
                :width="'500'"
                :show_all="true"
                :isShowCheckbox="false"
                :placeholder="'请选择还车人'"
                :isContainEmp="true"
                :isExportMultiple="false"
                :disabled="isShowRepayCarUser"
                @on-change="selectedUser"
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
                :placeholder="'请选择申请部门'"
                :isContainEmp="false"
                :isExportMultiple="false"
                :disabled="true"
              ></get-department-select> -->
              <el-select v-model="form.dept_id" style="width:100%" disabled placeholder="请选择申请部门">
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
            <el-form-item label="还车时间:" prop="back_time">
              <el-date-picker
                v-model="form.back_time"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm"
                type="datetime"
                style="width:100%"
                placeholder="请选择还车时间"
                :disabled="repayType=='edit'"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="还车里程:" prop="back_mile">
              <el-input v-model="form.back_mile" :disabled="repayType=='edit'"  placeholder="请输入还车里程" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.back_mile = $event.target.value"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="停放位置:" prop="back_position">
              <el-input v-model="form.back_position" :disabled="repayType=='edit'" placeholder="请输入停放位置"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车辆别名:" prop="name">
              <el-input v-model="form.name" placeholder="请输入车辆别名" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车牌号:" prop="code">
              <el-input v-model="form.code" placeholder="请输入车牌号" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注:" prop="back_remark">
              <el-input type="textarea" :rows="4" :disabled="repayType=='edit'" v-model="form.back_remark" placeholder="请输入备注"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: 20px">
            <image-file-upload
              :images="form.img_list"
              :files="form.file_list"
              @files-update-success="filesUpdateSuccess"
              @images-update-success="imagesUpdateSuccess"></image-file-upload>
          </el-col>
        </el-row>
         <!-- 流程节点显示 -->
        <el-card style="margin-top: 10px;max-height: 330px;overflow: auto" v-if="form.is_audit == 1">
          <approve-step
            :key="key"
            ref="approveStep"
            @on-users="setUsers"
            :form_data="form_data"
            :object_id="object_id">
          </approve-step>
        </el-card>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer" v-if="repayType =='add' || repayType =='update' || repayType =='commit'">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" v-if="form.is_audit == 1 && repayType !='update'" @click="updateDraft()">保存草稿</el-button>
      <el-button v-if="form.is_audit == 1" type="primary" @click="updatePlaybill('form')">提 交</el-button>
      <el-button v-else type="primary" @click="updatePlaybill('form')">提 交</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import imageFileUpload from "@/components/imageFileUpload/index";
import approveStep from '@/components/approve-echo/approve-step2'
import { deepCopy, isObjectChanged } from "@/utils/index"
import {getUser} from '@/utils/auth'
export default {
  components: {
    getDepartmentSelect,
    imageFileUpload,
    approveStep
  },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "还车单",
    },
    isShowRepayCarUser: {
      type: Boolean,
      default: true
    },
    // bus_id: {
    //   type: String,
    //   default: "",
    // },
    bus_id: null,
    repayType: {
      type: String,
      default: "",
    },
  },
  mounted() {

  },
  data() {
    return {
      form: {
        id:null,
        bus_id: '',
        dept_id: null,
        back_id: null,
        back_time: '',
        back_mile: 0,
        back_position: '',

        name: '',
        code: '',
        is_audit: 0,
        back_remark: '',
        img_list: [],
        file_list: [],
      },
      object_id: null,
      form_data: null,
      oldForm: null,
      key: null,
      nodes: null,
      basicRules: {
        back_id: [
          { required: true, message: "请选择还车人", trigger: "change" },
        ],
        dept_id: [
          { required: true, message: "请选择所在部门", trigger: "change" },
        ],
        back_time: [
          { required: true, message: "请选择还车时间", trigger: "change" },
        ],
        // back_mile: [
        //   { required: true, message: "请输入还车里程", trigger: "change" },
        // ],
        back_position: [
          { required: true, message: "请输入停放位置", trigger: "change" },
        ],
        name: [
          { required: true, message: "请输入车辆别名", trigger: "change" },
        ],
        code: [
          { required: true, message: "请输入车牌号", trigger: "change" },
        ],
      },

      dept_id: null,
      changeNum: 0,
      deptList: []
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        this.$refs.form.clearValidate();
        this.resetFrom();
      }else{
        if (this.repayType == "add") {
          this.$nextTick(() => {
            this.setDate();
            this.$refs.form.clearValidate();
          })
          if (getUser()) {
            let user_id = Number(JSON.parse(getUser()).user_id)
            this.form.borrow_id = ''
            this.form.dept_id = ''
            this.changeNum = 0
            this.$nextTick(() => {
              this.getLookBackDraft(user_id)
            })
          }
        }else {
          setTimeout(() => {
            this.$refs.form.clearValidate();
          }, 100);
        }
      }
    },
  },
  methods: {
    // 获取草稿详情
    getLookBackDraft(user_id) {
      let params = {
        user_id: user_id,
        bus_id: this.bus_id
      }
      this.$client.LookBackDraft(params).then(res => {
        if(res.head.result == '200') {
          let info = res.context
          if(!!info) {
            for (const key in this.form) {
              if (Object.hasOwnProperty.call(info, key) && key != 'dept_id') {
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
        // this.form.back_id = Number(JSON.parse(getUser()).user_id)
        // this.form.department = Number(JSON.parse(getUser()).department_id)
        // this.oldForm = deepCopy(this.form)
        // this.FormChange()

        let userInfo = JSON.parse(getUser());
        this.form.back_id = Number(userInfo.user_id);
        this.dept_id = Number(userInfo.department_id);
      })
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 点X 关闭前提醒是否需要保存草稿
    beforeDialogClose() {
      // 判断数据是否存在修改
      if (isObjectChanged(this.form,this.oldForm) && this.form.is_audit == 1 && this.repayType !='update') {
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
    // 数据回显
    setData(val){
      Object.keys(this.form).forEach(key => {
        if (val.hasOwnProperty(key)) {
          this.form[key] = val[key]
        }
      })
      if(this.repayType == 'commit') this.form.id = val.id
      this.dept_id = val.dept_id
      // console.log(val, this.form, '111111111111');
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
      let seconds = date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds()
      this.form.back_time = Y + '-' + M + '-' + D + ' ' + hours + ':' + minutes + ':' + seconds
    },
    updatePlaybill(formName) {
       this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {...this.form};
          this.$emit("save-add-edit", info, this.nodes);
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
          if (key != "borrow_id" && key != "dept_id") {
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
      let url = '';let list = [];
      val.forEach(item => {url = item.url ? item.url : item;list.push(url);});
      this.form.img_list = list
    },
    // 上传文件
    filesUpdateSuccess(filesList) {
      this.form.file_list = filesList;
    },
    // 设置流程节点
    setUsers(data) {
      this.nodes = data
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
      if (this.changeNum <= 1) {
        // 保存一下初始化数据 作为保存草稿时的比对数据
        this.oldForm = deepCopy(this.form)
      }
      this.deptList = await this.GetUserDept(this.form.back_id)
      this.form.dept_id = dept_id
      if(this.form.back_id) {
        this.FormChange()
      }
    },
    GetUserDept(user_id) {
      return this.$client.GetUserDept({user_id}).then(res => res.context)
    },
    FormChange() {
      this.key = new Date().getTime()
      this.form_data = this.form
      this.object_id = 21
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>


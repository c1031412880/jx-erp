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
            <el-form-item label="借车人:" prop="borrow_id">
              <get-department-select
                ref="applyPersonalTree"
                v-if="dialogBool"
                v-model="form.borrow_id"
                :width="'500'"
                :show_all="true"
                :isShowCheckbox="false"
                :placeholder="'请选择借车人'"
                :isContainEmp="true"
                :isExportMultiple="false"
                :disabled="isShowBorrowUser"
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
                :placeholder="'请选择所在部门'"
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
            <el-form-item label="借车时间:" prop="borrow_time">
              <el-date-picker
                v-model="form.borrow_time"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm"
                type="datetime"
                placeholder="请选择出车时间"
                style="width:100%"
                :disabled="borrowType == 'edit'"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预计还车时间:" prop="expect_back_time">
              <el-date-picker
                v-model="form.expect_back_time	"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm"
                type="datetime"
                placeholder="请选择预计还车时间"
                style="width:100%"
                :disabled="borrowType == 'edit'"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="用车类型:" prop="use_type">
              <!-- <el-select v-model="form.use_type" style="width: 100%;" :disabled="borrowType == 'edit'" @change="FormChange" placeholder="请选择用车类型">
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select> -->
              <get-select-dictionaries 
                style="width:100%"
                :disabled="borrowType == 'edit'"
                v-model="form.use_type" 
                @change="FormChange"
                :classKey="'oa-vehicle-type'" 
                :placeholder="'请选择用车类型'" 
              ></get-select-dictionaries>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="驾驶员:" prop="borrow_driver_id">
              <get-department-select
                ref="applyPersonalTree"
                v-if="dialogBool"
                v-model="form.borrow_driver_id"
                :width="'500'"
                :show_all="true"
                :isShowCheckbox="false"
                :placeholder="'请选择驾驶员'"
                :isContainEmp="true"
                :isExportMultiple="false"
              ></get-department-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="乘车人数:" prop="passengers">
              <el-input v-model="form.passengers" placeholder="请输入乘车人数" :disabled="borrowType == 'edit'" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出发地:" prop="from_address">
              <el-input v-model="form.from_address" :disabled="borrowType == 'edit'" placeholder="请输入出发地"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目的地:" prop="to_address">
              <el-input v-model="form.to_address" :disabled="borrowType == 'edit'" placeholder="请输入目的地"></el-input>
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
          <el-col :span="12">
            <el-form-item label="出车里程:" prop="borrow_mile">
              <el-input v-model="form.borrow_mile" placeholder="请输入出车里程" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="停放位置:" prop="borrow_position">
              <el-input v-model="form.borrow_position" placeholder="请输入停放位置" disabled></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="审批人:" prop="audit_person_name" v-if="form.is_audit">
              <el-input v-model="form.audit_person_name" placeholder="请输选择审批人" disabled></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="24">
            <el-form-item label="申请事由:" prop="purpose">
              <el-input type="textarea" :rows="4" :disabled="borrowType == 'edit'" v-model="form.purpose" placeholder="请输入借车用途"></el-input>
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
    <span slot="footer" class="dialog-footer" v-if="borrowType =='add' || borrowType =='update' || borrowType =='commit'">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" v-if="form.is_audit == 1 && borrowType !='update'" @click="updateDraft()">保存草稿</el-button>
      <el-button v-if="form.is_audit == 1" type="primary" @click="updatePlaybill('form')">提 交</el-button>
      <el-button v-else type="primary" @click="updatePlaybill('form')">提 交</el-button>
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
      default: "借车申请单",
    },
    isShowBorrowUser: {
      type: Boolean,
      default: true
    },
    // bus_id: {
    //   type: Number,
    //   default: "",
    // },
    bus_id: null,
    borrowType: {
      type: String,
      default: "",
    },
  },
  mounted() {

  },
  data() {
    return {
      is_audit:0, // 0不需审批 1需要
      form: {
        bus_id:'',
        borrow_id: null,
        borrow_driver_id: null,
        dept_id: null,
        borrow_time: '',
        expect_back_time:'',
        use_type: 1,
        purpose: '',
        from_address: '',
        to_address: '',
        borrow_mile: '',
        borrow_position: '',
        name: '',
        code: '',
        is_audit: 0,
        img_list: [],
        file_list: [],
        passengers: '',
        id: null
      },
      object_id: 20,
      form_data: null,
      oldForm: null,
      key: null,
      nodes: null,
      basicRules: {
        borrow_id: [
          { required: true, message: "请选择借车人", trigger: "change" },
        ],
        dept_id: [
          { required: true, message: "请选择所在部门", trigger: "change" },
        ],
        borrow_driver_id: [
          { required: true, message: "请选择驾驶员", trigger: "change" },
        ],
        borrow_time: [
          { required: true, message: "请选择出车时间", trigger: "change" },
        ],
        expect_back_time:[
          { required: true, message: "请选择预计还车时间", trigger: "change" },
        ],
        use_type: [
          { required: true, message: "请选择用车类型", trigger: "change" },
        ],
        from_address: [
          { required: true, message: "请输入出发地", trigger: "change" },
        ],
        to_address: [
          { required: true, message: "请输入目的地", trigger: "change" },
        ],
        name: [
          { required: true, message: "请输入车辆别名", trigger: "change" },
        ],
        code: [
          { required: true, message: "请输入车牌号", trigger: "change" },
        ],
        borrow_mile: [
          { required: true, message: "请输入出车里程", trigger: "change" },
        ],
        borrow_position: [
          { required: true, message: "请输入停放位置", trigger: "change" },
        ],
        purpose: [
          { required: true, message: "请输入申请事由", trigger: "change" },
        ],
        // passengers: [
        //   { required: true, message: "请输入乘车人员", trigger: "change" },
        // ],
      },
      typeList: [
        // {label: "本地用车", value: 1},
        // {label: "外地用车", value: 2},
        // {label: "多日用车", value: 3},
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

      dept_id: null,
      changeNum: 0,
      deptList: []
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        // Object.assign(this.$data, this.$options.data());
        this.$refs.form.resetFields();
        this.resetFrom();
      }else{
        if (this.borrowType == "add") {
          this.$nextTick(() => {
            this.$refs.form.clearValidate();
            this.setDate();
          })
          if (getUser()) {
            let user_id = Number(JSON.parse(getUser()).user_id)
            this.form.borrow_id = ''
            this.form.dept_id = ''
            this.changeNum = 0
            this.$nextTick(() => {
              this.getLookBorrowDraft(user_id)
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
    getLookBorrowDraft(user_id) {
      let params = {
        user_id: user_id,
        bus_id: this.bus_id
      }
      this.$client.LookBorrowDraft(params).then(res => {
        if(res.head.result == '200') {
          let info = res.context
          if(!!info) {
            for (const key in this.form) {
              if (Object.hasOwnProperty.call(info, key) && key !== 'dept_id') {
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
        let userInfo = JSON.parse(getUser());
        this.form.borrow_id = Number(userInfo.user_id);
        if(!this.form.borrow_driver_id) {
          this.form.borrow_driver_id = Number(userInfo.user_id);
        }
        this.dept_id = Number(userInfo.department_id);
        // this.form.borrow_id = Number(JSON.parse(getUser()).user_id)
        // this.form.department = Number(JSON.parse(getUser()).department_id)
        // this.oldForm = deepCopy(this.form)
        // this.FormChange()
      })
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 点X 关闭前提醒是否需要保存草稿
    beforeDialogClose() {
      // 判断数据是否存在修改
      if (isObjectChanged(this.form,this.oldForm) && this.form.is_audit == 1 && this.borrowType != 'update') {
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
      console.log('val',val);
      Object.keys(this.form).forEach(key => {
        if (val.hasOwnProperty(key) && key !== 'id') {
          this.form[key] = val[key]
        }
      })
      console.log('form',this.form);
      if(this.borrowType == 'commit') this.form.id = val.id
      this.dept_id = val.dept_id
    },
    // 重置
    resetFrom() {
      this.$refs.applyPersonalTree.onClear()
      // this.$refs.departmentlTree.onClear()
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
      this.form.borrow_time = Y + '-' + M + '-' + D + ' ' + hours + ':' + minutes + ':' + seconds
    },
    // 校验
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
      console.log('changeNum',this.changeNum);
      if (this.changeNum > 1) {
        if(userIds.length > 0 && !!parentNode) {
          this.form.borrow_driver_id = userIds[0]
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
      this.deptList = await this.GetUserDept(this.form.borrow_id)
      this.form.dept_id = dept_id
      if(this.form.borrow_id) {
        this.FormChange()
      }
    },
    GetUserDept(user_id) {
      return this.$client.GetUserDept({user_id}).then(res => res.context)
    },
    FormChange() {
      this.key = new Date().getTime()
      this.form_data = this.form
      this.object_id = 20
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>


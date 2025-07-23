<template>
  <div style="height:510px;overflow-x:hidden">
    <el-form :model="form" :rules="basicRules" ref="form" size="mini" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="车辆别名:" prop="name">
            <el-input v-model="form.name" placeholder="请输入车辆别名" style="width:100%"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车牌号:" prop="code">
            <el-input v-model="form.code" placeholder="请输入车牌号" style="width:100%"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车辆状态:" prop="bus_state">
            <el-select v-model="form.bus_state" placeholder="请选择车辆状态" style="width:100%">
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车辆容量:" prop="max_count">
            <el-input v-model="form.max_count" placeholder="请输入车辆容量" style="width:100%" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.max_count = $event.target.value"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车辆停放位置:" prop="last_position">
            <el-input v-model="form.last_position" placeholder="请输入车辆停放位置" style="width:100%"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="管理员:" prop="duty_id">
            <get-department-select
                ref="dutyPersonalTree"
                v-model="form.duty_id"
                :isShowCheckbox="false"
                :placeholder="'请选择管理员'"
                :isContainEmp="true"
                :show_all="true"
                :isExportMultiple="false"
                @on-change="changeDuty"
              ></get-department-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="管理员电话:" prop="duty_phone">
            <el-input v-model="form.duty_phone" placeholder="请输入管理员联系电话" style="width:100%" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.duty_phone = $event.target.value"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="行驶里程/km:" prop="last_mile">
            <el-input v-model="form.last_mile" placeholder="请输入里程/km" style="width:100%" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.last_mile = $event.target.value"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="加油类型:" prop="oil_kind">
            <tr-select-dictionaries v-model="form.oil_kind" style="width:100%" :classKey="'公车加油类型'" :placeholder="'请选择加油类型'" :isMultiple="false"></tr-select-dictionaries>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否需要审批:" prop="is_audit">
            <el-select v-model="form.is_audit" placeholder="请选择是否需要审批" style="width:100%">
              <el-option
                v-for="item in conditionOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公车使用权限:" prop="use_persons">
            <el-select v-model="form.use_persons" placeholder="请选择公车使用权限" @change="changeJurisdiction" style="width:100%">
              <el-option
                v-for="item in jurisdictionOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-show="form.use_persons != -1">
          <el-form-item label="公车权限用户:" prop="use_person_ids">
            <get-user-select-tree ref="busAuthorityUser" :isEcho="true" :key="key" v-model="form.use_person_ids" style="wdith:100%;height:300px" placeholder="请选择公车权限用户"></get-user-select-tree>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="驾驶员:" prop="driver_id">
            <get-department-select
              ref="driverTree"
              v-model="form.driver_id"
              :show_all="true"
              :isShowCheckbox="false"
              :placeholder="'请选择驾驶员'"
              :isContainEmp="true"
              :isExportMultiple="false"
            ></get-department-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="车辆图片:" prop="img_url">
            <div class="show-flex-box-r" style="align-items: center;">
              <el-button size="small" type="primary" @click="uploadFile">{{!!form.img_url?'更换图片':'上传图片'}}</el-button>
              <div class="show-flex-box-r" style="align-items: center;">
                <el-image
                v-if="!!form.img_url"
                style="width: 120px; margin-left: 10px;"
                :src="form.img_url"
                fit="contain"
                :preview-src-list="[form.img_url]"></el-image>
                <el-button size="small" type="text" style="margin-left: 10px;color:red" v-if="!!form.img_url"  @click="deleteImage">删除</el-button>
              </div>
              <span style="font-size: 12px;color: #606266; margin-left:20px;">上传的图片尺寸建议不超过10M</span>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getUserSelectTree from '@/components/base/formModel/tree/get-user-select-tree'
export default {
  components: {getDepartmentSelect, getUserSelectTree},
  props: {
    curSelecedType: [String],
  },
  mounted() {
  },
  data() {
    return {
      date: [],
      conditionOptions:[ //
        { value: 0, name: "无需审批" },
        { value: 1, name: "需要审批" }
      ],
      typeList:[
        {value: 0, label: "正常"},
        {value: 1, label: "需加油"},
        {value: 2, label: "维修中"},
        {value: 3, label: "保养中"},
        {value: 4, label: "年审中"},
      ],
      jurisdictionOptions:[
        { value: -1, name: "全员" },
        { value: 1, name: "指定用户" }
      ],
      form: {
        name: "",
        code: "",
        bus_state: 0,
        max_count: "",
        last_position:'',
        duty_id: "",
        duty_phone: "",
        last_mile:"",
        oil_kind:"",
        driver_id:"",
        use_persons: -1,
        is_audit: 0, //1是0否
        use_person_ids: [],
        img_url: "",
      },
      basicRules: {
        name: [
          { required: true, message: "请输入车辆别名", trigger: "change" },
        ],
        code: [
          { required: true, message: "请输入车牌号", trigger: "change" },
        ],
        bus_state: [
          { required: true, message: "请选择车辆状态", trigger: "change" },
        ],
        last_position: [
          { required: true, message: "请输入车辆停放位置", trigger: "change" },
        ],
        last_mile: [
          { required: true, message: "请输入行驶里程/km", trigger: "change" },
        ],
        oil_kind: [
          { required: true, message: "请选择加油类型", trigger: "change" },
        ],
        is_audit: [
          { required: true, message: "请选择是否需要审批", trigger: "change" },
        ],
        use_persons: [
          { required: true, message: "请选择公车使用权限", trigger: "change" },
        ],
        use_person_ids: [
          { required: true, message: "请选择公车权限用户", trigger: "change" },
        ],
        // driver_id: [
        //   { required: true, message: "请选择驾驶员", trigger: "change" },
        // ],
      },
      key: null,
    };
  },
  watch: {
  },
  methods: {
    changeDuty(vehs, nodes, parentNode) {
      if (vehs[0]) {
        this.getListSysPerson(vehs[0])
      }
    },
    // 获取用户信息
    getListSysPerson(user_id){
      let content = {
        i_id: user_id
      }
      this.$client.listSysPerson(content).then(req => {
        if (req.head.result === "200") {
          this.form.duty_phone = req.context.list[0].c_phone
        } 
      })
    },
    // 初始化数据
    resetData(){
      Object.assign(this.$data.form, this.$options.data().form);
      setTimeout(() => {
        this.$refs.dutyPersonalTree.onClear()
        if (this.form.jurisdiction == 1) {
          this.$refs.busAuthorityUser.onClear()
        }
      }, 30);
    },
    // 数据回显
    setData(val){
      this.$refs.busAuthorityUser.$refs.tree.scapshow = 0
      Object.keys(this.form).forEach(key => {
        if (val.hasOwnProperty(key)) {
          this.form[key] = val[key]
        }
      })
      if (val.use_persons == -1) {
        this.form.use_persons = -1
      } else {
        this.form.use_persons = 1
        this.form.use_person_ids = val.use_person_ids
      }
    },
    changeJurisdiction(val) {
      if (val == 0) {
        this.audit_person = -1
      } else {
        this.audit_person = ''
      }
    },
    // 合并表单值
    outData() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid,object) => {
          if (this.form.use_persons == -1 && Object.keys(object)[0] === "use_person_ids") {
            valid = true
          }
          if (valid) {
            resolve({
              form: this.form
            });
          } else {
            reject({
              msg: '获取失败,带星号的为必填项',
              type: 1
            });
            return false;
          }
        });
      });
    },
    // 自定义上传文件方法
    // :http-request="uploadFile"
    uploadFile() {
      let input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = () => {
        console.log(input.files);
        let reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        let file = input.files[0];
        if(!this.beforeUpload(file)) {
          return
        }
        reader.onload = (ev) => {
          input = undefined;
        };
        let formData = new FormData();
        formData.append("file", file);
        let params = {
          file: formData,
        };
        this.$client.uploadPictureMeetingRoom(params)
        .then(res => {
          if(res.head.result == '200') {
            this.form.img_url = res.context;
            this.$message({
              showClose: true,
              message: "上传成功",
              type: "success"
            });
          }else{
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
       
      };
      input.click();
    },
    deleteImage() {
      this.form.img_url = ''
    },
    // 判断文件大小
    beforeUpload (file) {
      const isLt1M = file.size / 1024 / 1024 < 10
      if (isLt1M) {
        return true
      }
      this.$message({type: 'error', message: '请不要上传大小超过10M的文件', showClose: true})
      return false
    },

    // 判断文件大小
    beforeFileUpload (file) {
      const isLt1M = file.size / 1024 / 1024 < 10
      if (isLt1M) {
        return true
      }
      this.$message({type: 'error', message: '请不要上传大小超过10M的文件', showClose: true})
      return false
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>


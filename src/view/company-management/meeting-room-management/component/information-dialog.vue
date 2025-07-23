<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="700px"
    
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="140px" size="mini">
        <el-form-item label="会议室名称:" prop="name">
          <el-input v-model="form.name" placeholder="请输入会议室名称"></el-input>
        </el-form-item>
        <el-form-item label="会议室位置:" prop="position">
          <el-input v-model="form.position" placeholder="请输入会议室位置"></el-input>
        </el-form-item>
        <el-form-item label="容纳人数:" prop="capacity">
          <!-- <el-input v-model="form.capacity" placeholder="请输入容纳人数" oninput="value=value.replace(/[^\d.-]/g,'')"  @blur="form.capacity = $event.target.value"></el-input> -->
          <el-input-number style="width: 100%;" :min="0" :precision="0" :controls="false" v-model="form.capacity" ></el-input-number>
        </el-form-item>
        <el-form-item label="会议室负责人:" prop="duty_person">
          <get-department-select
              ref="dutyPersonalTree"
              v-model="form.duty_person"
              :width="'420'"
              :show_all="true"
              :isShowCheckbox="false"
              :placeholder="'请选择会议室负责人'"
              :isContainEmp="true"
              :isExportMultiple="false"
              @on-change="selectedDutyPerson"
            ></get-department-select>
        </el-form-item>
        <el-form-item label="负责人联系电话:" prop="duty_phone">
          <el-input v-model="form.duty_phone" placeholder="请输入负责人联系电话" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.duty_phone = $event.target.value"></el-input>
        </el-form-item>
        <el-form-item label="会议室设备:" prop="ex_equipment_ids">
          <!-- <el-checkbox-group v-model="form.equipment">
            <el-checkbox v-for="item in equipmentOptions" :label="item.label" :key="item.value">{{item.label}}</el-checkbox></el-checkbox-group> -->
            <tr-select-dictionaries v-model="form.ex_equipment_ids" :classKey="'会议室设备'" :placeholder="'请选择会议室设备'" :isMultiple="true"></tr-select-dictionaries>
        </el-form-item>
        <el-form-item label="会议室使用权限:" prop="use">
          <el-select v-model="form.use" placeholder="请选择是否需要审批">
            <el-option
              v-for="item in powerOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会议室权限用户:" prop="ex_person_ids" v-if="!!form.use">
          <get-department-select
            ref="personalUseTree"
            v-model="form.ex_person_ids"
            :width="'420'"
            :isShowCheckbox="true"
            :placeholder="'请选择会议室权限用户'"
            :isContainEmp="true"
            :show_all="true"
            :isCheckStrictly="false"
          ></get-department-select>
        </el-form-item>
        <el-form-item label="是否需要审批:" prop="need_check">
          <el-select v-model="form.need_check" placeholder="请选择是否需要审批">
            <el-option
              v-for="item in conditionOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批人:" prop="check_id" v-if="!form.need_check">
          <get-department-select
            ref="personalTree"
            v-model="form.check_id"
            :width="'420'"
            :isShowCheckbox="false"
            :placeholder="'请选择审批人'"
            :isContainEmp="true"
            :show_all="true"
            :isExportMultiple="false"
          ></get-department-select>
        </el-form-item>
        <el-form-item label="会议室图片:" prop="img_url">
          <div class="show-flex-box-r" style="align-items: center;">
          <el-button size="small" type="primary" @click="uploadFile">{{!!form.img_url?'更换图片':'上传图片'}}</el-button>
          <el-image
            v-if="!!form.img_url"
            style="width: 60px; margin-left: 10px;"
            :src="form.img_url"
            fit="contain"
            :preview-src-list="srcList"></el-image>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import {getUser} from '@/utils/auth'
export default {
  components: {getDepartmentSelect},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curSelecedType: [String],
  },
  mounted() {
  },
  data() {
    return {
      date: [],
      equipmentOptions:[
        {
          label: '电视',
          value: 1
        },
        {
          label: '电话',
          value: 2
        },
        {
          label: '投影',
          value: 3
        },
        {
          label: '白板',
          value: 4
        },
        {
          label: '视频投影仪',
          value: 5
        }
      ],
      conditionOptions:[ //
        { value: 1, name: "无需审批" },
        { value: 0, name: "需要审批" }
      ],
      powerOptions: [
        { value: 0, name: "全员" },
        { value: 1, name: "指定用户" }
      ],
      form: {
        id: "",
        name: "",
        position: "",
        capacity: 0,

        duty_person: "",
        duty_phone: "",
        ex_equipment_ids:[],
        
        use: 0,//0全员1指定用户
        ex_person_ids:[], // 多选
        need_check: 0, //0是1否

        check_id: "",
        img_url: "",
        
      },
      basicRules: {
        name: [
          { required: true, message: "请输入会议室名称", trigger: "change" },
        ],
        duty_person: [
          { required: true, message: "请选择会议室负责人", trigger: "change" },
        ],
        duty_phone: [
          { required: true, message: "请输入负责人联系电话", trigger: "change" },
        ],
      },
      srcList:[],
      isFirstLoad: true
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        this.resetFrom();
      }else{
        // 添加自动载入当前用户为审批人
        if(this.curSelecedType == 'add') {
          let userInfo = JSON.parse(getUser());
          // console.log(userInfo)
          this.form.check_id = Number(userInfo.user_id)
          this.form.duty_person = Number(userInfo.user_id)
          this.selectedDutyPerson([userInfo.user_id])
        }
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        })

      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 重置
    resetFrom() {
      this.$refs.dutyPersonalTree.onClear()
      if(!!this.form.use) {
        this.$refs.personalUseTree.onClear()
      }
      if(this.form.need_check) {
        this.$refs.personalTree.onClear()
      }

    },
    // 选择会议室负责人自动带入负责人联系电话
    selectedDutyPerson(val) {
      // console.log(val)
      if(this.curSelecedType != 'add' && this.isFirstLoad) {
        return
      }else{
        this.isFirstLoad = this.curSelecedType == 'add'? true: false;
      }
      if(val && val.length && this.isFirstLoad) {
        let parmas = {
          id: val[0]
        }
        this.$client.getEmployeeManageDetail(parmas).then((res) => {
          if (res.head.result == "200") {
            let staffInfo = res.context;
            if(staffInfo) {
              this.form.duty_phone = staffInfo.phone || '';               
            }
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
      }
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
            this.srcList = [];
            this.srcList.push(res.context)
            console.log(this.form.img_url)
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
    // 判断文件大小
    beforeUpload (file) {
      const isLt1M = file.size / 1024 / 1024 < 4
      if (isLt1M) {
        return true
      }
      this.$message({type: 'error', message: '请不要上传大小超过4M的文件', showClose: true})
      return false
    },
   
    updatePlaybill(formName) {
       this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {...this.form};
          // if(this.form)
          if(!this.form.use) {
            info.ex_person_ids = [0]
          }
          if(this.form.need_check) {
            info.check_id = null
          }

          // console.log(info)
          // return

          this.$emit("save-add-edit", info);
        } else {
          return false;
        }
      });
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div /deep/ .el-input {
  width: 480px;
}
</style>


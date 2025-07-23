<template>
  <el-dialog
    :visible="dialogBool"
    :title="showCasualtiesTitle"
    width="590px"
    :close-on-click-modal="false"
    append-to-body
    :before-close="dialogClose"
  >
    <div class="casualties-dialog" style="height: 400px; overflow-x: hidden">
      <el-form
        :model="formData"
        :rules="rules"
        ref="formData"
        label-width="100px"
        class="demo-formData"
        size="mini"
      >
        <el-form-item label="人员类型:" prop="i_person_type">
          <el-radio-group @change="changeRadio" :disabled="curType == 'edit'" v-model="formData.i_person_type">
            <el-radio :label="1"><span style="color:#606266">对方</span></el-radio>
            <el-radio :label="2"><span style="color:#606266">己方</span></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="人员姓名:" prop="c_person_name" v-if="formData.i_person_type == 1">
          <el-input
            placeholder="请输入人员姓名"
            v-model="formData.c_person_name"
          ></el-input>
        </el-form-item>
        <el-form-item label="人员姓名:" prop="i_person_id" v-else>
          <get-driver-select-tree
            ref="driverTree"
            v-model="formData.i_person_id"
            :width="'380'"
            :isShowCheckbox="false"
            :placeholder="'请选择驾驶员'"
            :isExportMultiple="false"
            @on-change="onSelectDriverChange"
          ></get-driver-select-tree>
        </el-form-item>
        <el-form-item label="性别:" prop="i_person_sex">
          <el-radio-group v-model="formData.i_person_sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄:" prop="i_person_age">
          <el-input
            placeholder="请输入人年龄"
            v-model="formData.i_person_age"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="formData.i_person_age = $event.target.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="身份证号:" prop="c_person_code">
          <el-input
            placeholder="请输入人身份证号"
            v-model="formData.c_person_code"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系方式:" prop="c_person_phone">
          <el-input
            placeholder="请输入人联系方式"
            v-model="formData.c_person_phone"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="formData.c_person_phone = $event.target.value"
          ></el-input>
        </el-form-item>
        <el-form-item label="伤情:" prop="i_injury">
          <get-select-dictionaries v-model="formData.i_injury" :classKey="'伤情'" :placeholder="'请选择伤情'"></get-select-dictionaries>
        </el-form-item>
        <el-form-item label="治疗医院:" prop="c_hospistal">
          <el-input
            placeholder="请输入治疗医院"
            v-model="formData.c_hospistal"
          ></el-input>
        </el-form-item>
        <el-form-item label="单位:" prop="c_work">
          <el-input
            placeholder="请输入单位"
            v-model="formData.c_work"
          ></el-input>
        </el-form-item>
        <el-form-item label="住址:" prop="c_address">
          <el-input
            placeholder="请输入住址"
            v-model="formData.c_address"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="受损物品金额:" prop="n_good_fee">
          <el-input
            placeholder="请输入受损物品金额"
            v-model="formData.n_good_fee"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="formData.n_good_fee = $event.target.value"
          ></el-input>
        </el-form-item> -->

        <el-form-item label="伤情描述:" prop="c_describe">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8 }"
            placeholder="请输入伤情描述"
            v-model="formData.c_describe"
          ></el-input>
        </el-form-item>
        <div class="charge-detail">
          <div class="show-flex-box-r">
            <el-form-item label="医疗费:" prop="n_medical_fee">
              <el-input
                placeholder="请输入医疗费"
                v-model="formData.n_medical_fee"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                @blur="formData.n_medical_fee = $event.target.value"
              ></el-input>
            </el-form-item>
            <el-form-item label="误工费:" prop="n_missed_fee">
              <el-input
                placeholder="请输入误工费"
                v-model="formData.n_missed_fee"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                @blur="formData.n_missed_fee = $event.target.value"
              ></el-input>
            </el-form-item>
            <el-form-item label="护理费:" prop="n_nursing_fee">
              <el-input
                placeholder="请输入护理费"
                v-model="formData.n_nursing_fee"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                @blur="formData.n_nursing_fee = $event.target.value"
              ></el-input>
            </el-form-item>
          </div>
          <div class="show-flex-box-r">
            <el-form-item label="伙食费:" prop="n_food_fee">
              <el-input
                placeholder="请输入伙食费"
                v-model="formData.n_food_fee"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                @blur="formData.n_food_fee = $event.target.value"
              ></el-input>
            </el-form-item>
            <el-form-item label="交通费:" prop="n_traffic_fee">
              <el-input
                placeholder="请输入交通费"
                v-model="formData.n_traffic_fee"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                @blur="formData.n_traffic_fee = $event.target.value"
              ></el-input>
            </el-form-item>
            <el-form-item label="伤残赔偿金:" prop="n_disability_fee">
              <el-input
                placeholder="请输入伤残赔偿金"
                v-model="formData.n_disability_fee"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                @blur="formData.n_disability_fee = $event.target.value"
              ></el-input>
            </el-form-item>
          </div>
          <div class="show-flex-box-r">
            <el-form-item label="死亡赔偿金:" prop="n_death_fee">
              <el-input
                placeholder="请输入死亡赔偿金"
                v-model="formData.n_death_fee"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                @blur="formData.n_death_fee = $event.target.value"
              ></el-input>
            </el-form-item>
            <el-form-item label="丧葬费:" prop="n_funeral_fee">
              <el-input
                placeholder="请输入丧葬费"
                v-model="formData.n_funeral_fee"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                @blur="formData.n_funeral_fee = $event.target.value"
              ></el-input>
            </el-form-item>
            <el-form-item label="精神损失费:" prop="n_mental_fee">
              <el-input
                placeholder="请输入精神损失费"
                v-model="formData.n_mental_fee"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                @blur="formData.n_mental_fee = $event.target.value"
              ></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogClose()">取 消</el-button>
      <el-button type="primary" @click="submitForm('formData')"
        >保 存</el-button
      >
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
export default {
  components: {
    getSelectDictionaries,
    getDriverSelectTree
  },
  props: {
    dialogBool: Boolean,
    showCasualtiesTitle: [String],
    curType:{
      type: String,
      default: 'add'
    },
    curInfo:[Object]
  },
  data() {
    return {
      formData: {
        i_person_type: 1,
        c_person_name: '',
        i_person_id: '',
        i_person_sex: '',
        c_person_code: '',
        i_person_age: '',
        c_person_phone: '',
        i_injury: '',
        c_hospistal: '',
        c_work: '',
        c_address: '',
        n_good_fee: '',
        c_describe: '',
        n_medical_fee:'',
        n_missed_fee:'',
        n_nursing_fee:'',
        n_food_fee:'',
        n_traffic_fee:'',
        n_disability_fee:'',
        n_death_fee:'',
        n_funeral_fee:'',
        n_mental_fee:'',

      },
      rules: {
        i_person_type: [
          { required: true, message: "请选择人员类型", trigger: "blur" },
        ],
        c_person_name: [
          { required: true, message: "请填写人员姓名", trigger: "change" },
        ],
        i_person_id: [
          { required: true, message: "请选择人员", trigger: "change" },
        ],
        i_person_sex: [
          { required: true, message: "请选择性别", trigger: "change" },
        ],
        i_injury: [
          { required: true, message: "请选择伤情", trigger: "change" },
        ],
      },
      isFirstLoad: true
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        this.configCircuitfInfo();
         this.$nextTick(() => {
          this.$refs.formData.clearValidate();
        });
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },

    // 初始化信息
    configCircuitfInfo() {},
    //选择人员类型
    changeRadio(type) {
      if(type == 2 && this.curType == 'add' && this.curInfo) {
        this.formData.i_person_id = this.curInfo.i_driver_id
        console.log(this.curInfo.i_driver_id)
      } else {
        Object.assign(this.$data.formData, this.$options.data().formData);
      }
    },
    // 选择驾驶员
    onSelectDriverChange(drivers, nodes) {
      if(this.isFirstLoad && this.curType == 'edit' && this.formData.i_person_type == 2 && !!this.formData.i_person_id) {
        this.isFirstLoad = false
        return
      }
      // console.log(drivers)
      if(!!drivers && drivers.length == 0) {
        return
      }
      let parmas = {
        id: drivers[0]
      }
      this.$client.getDriverInfo(parmas).then(res => {
        if(res.head.result == '200') {
          let info = res.context;
          this.formData.c_person_name = info.c_name
          this.formData.i_person_sex = info.gender
          this.formData.i_person_age = info.age
          this.formData.c_person_code = info.c_idcord
          this.formData.c_person_phone = info.c_phone
          this.formData.c_address = info.c_home_address
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    setData(val) {
      console.log(val)
      for (const key in this.formData) {
        if (Object.hasOwnProperty.call(this.formData, key)) {
          // const element = this.formData[key];
          this.formData[key] = val[key]
        }
      }
      this.formData.i_person_type = Number(val.i_person_type)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
        //  let info = this.$outFormData(this.formData)
        // console.log(this.formData)
        // return
        if(this.curType == 'add') {
          delete this.formData.i_id
        }
          this.$emit("sure-submit-casualties", this.formData);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.casualties-dialog /deep/ .el-input {
  width: 400px;
}

.casualties-dialog /deep/ .el-input--mini {
  width: 400px;
}

.casualties-dialog /deep/ .el-date-editor {
  width: 410px;
}

.casualties-dialog .charge-detail /deep/ .el-input {
  width: 67px;
}
.casualties-dialog .charge-detailel-input--mini {
  width: 67px;
}
.casualties-dialog .charge-detail /deep/ .el-date-editor {
  width: 67px;
}
</style>

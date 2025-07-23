<template>
  <el-dialog
    :visible="dialogBool"
    :title="showTitle"
    :before-close="dialogClose"
    width="520px"
  >
    <div class="el-dialog-div">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        :label-position="'right'" 
        size="mini"
      >
        <el-form-item label="所属地址:" prop="parents_id" label-width="140px" >
          <el-select v-model="ruleForm.parents_id" placeholder="请选择所属地址" @change="selectedParentsId">
            <el-option
              v-for="item in classifyOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="水表名称:" prop="water_id" label-width="140px" v-if="!!ruleForm.parents_id">
          <el-select v-model="ruleForm.water_id" placeholder="请选择水表名称">
            <el-option
              v-for="item in electricMeterOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="抄表日期:" prop="read_date" label-width="140px" >
          <el-date-picker
            v-model="ruleForm.read_date"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="水表上次底数:" prop="last_value" label-width="140px" >
          <el-input v-model="ruleForm.last_value" placeholder="请输入水表上次底数" oninput="value=value.replace(/[^\d.-]/g,'')" @input="inputNumberChange('last_value')"  @blur="ruleForm.last_value = $event.target.value"></el-input>
        </el-form-item>
        <el-form-item label="水表本月吨数:" prop="this_value" label-width="140px" >
          <el-input v-model="ruleForm.this_value" placeholder="请输入水表本月吨数" oninput="value=value.replace(/[^\d.-]/g,'')"  @input="inputNumberChange('this_value')"  @blur="ruleForm.this_value = $event.target.value"></el-input>
        </el-form-item>
        <el-form-item label="本月用水量:" prop="use" label-width="140px" >
          <el-input v-model="use" placeholder="请输入本月用水量" disabled></el-input>
        </el-form-item>
        <el-form-item label="每吨金额:" prop="price" label-width="140px" >
          <el-input v-model="ruleForm.price" placeholder="请输入每吨金额" oninput="value=value.replace(/[^\d.-]/g,'')"  @input="inputNumberChange('price')"  @blur="ruleForm.price = $event.target.value"></el-input>
        </el-form-item>
        <el-form-item label="总用水金额:" prop="total_fee" label-width="140px" >
          <el-input v-model="total_fee" placeholder="请输入总用水金额" disabled></el-input>
        </el-form-item>
        <el-form-item label="备注:" label-width="140px" prop="remark">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            v-model="ruleForm.remark">
          </el-input>
        </el-form-item>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('ruleForm')" size="mini">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: {getDepartmentSelect},
  props: {
    dialogBool: Boolean,
    curSelecedType: [String],
    classifyOptions:[Array],//所属类别
  },
  data() {
    return {
      electricMeterOptions:[],
      showTitle: "",
      // use:"",
      // total_fee: "",
      ruleForm: {
        parents_id: "",
        id: "",
        water_id: "",
        read_date: "",
        last_value: "",
        this_value: "",
        use: 0,
        price: "",
        total_fee: 0,
        remark: "",

      },
      rules: {
        parents_id: [
          { required: true, message: "请选择所属地址", trigger: "change" },
        ],
        water_id: [
          { required: true, message: "请选择水表名称", trigger: "change" },
        ],
        read_date: [
          { required: true, message: "请输选择抄表日期", trigger: "change" },
        ],
        last_value: [
          { required: true, message: "请输入上次底数", trigger: "change" },
        ],
        this_value: [
          { required: true, message: "请输入本月吨数", trigger: "change" },
        ],
        // use: [
        //   { required: true, message: "请填写本月用水量", trigger: "change" },
        // ],
        price: [
          { required: true, message: "请输入每吨金额", trigger: "change" },
        ],
        // total_fee: [
        //   { required: true, message: "请输入总用水金额", trigger: "change" },
        // ],
       
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        this.configTitle();
        this.$nextTick(() => {
          // this.$refs.ruleForm.resetFields();
          this.$refs.ruleForm.clearValidate();
        })
      }
    },
    "ruleForm.parents_id":{
      deep:true,
      handler:function(newV,oldV){
        this.selectedParentsId(newV,'watch')
      }
    }

  },
  computed: {
    use: function () {
      // if(this.ruleForm.this_value &&  this.ruleForm.last_value) {
      //   this.ruleForm.use = Number((this.ruleForm.this_value * 100 - this.ruleForm.last_value*100)/100).toFixed(2)
      //   return Number((this.ruleForm.this_value *100 - this.ruleForm.last_value*100)/100).toFixed(2)
      // }

      this.ruleForm.use = Number((this.ruleForm.this_value * 100 - this.ruleForm.last_value*100)/100).toFixed(2)
        return Number((this.ruleForm.this_value *100 - this.ruleForm.last_value*100)/100).toFixed(2)
      
    },
    total_fee: function () {
      // if(this.ruleForm.price && this.ruleForm.use) {
      //   this.ruleForm.total_fee =  Number(((this.ruleForm.price*100) * (this.ruleForm.use*100))/10000).toFixed(2)
      //   return Number(((this.ruleForm.price*100) * (this.ruleForm.use*100))/10000).toFixed(2)
      // }
      this.ruleForm.total_fee =  Number(((this.ruleForm.price*100) * (this.ruleForm.use*100))/10000).toFixed(2)
        return Number(((this.ruleForm.price*100) * (this.ruleForm.use*100))/10000).toFixed(2)
      
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    configTitle() {
      if (this.curSelecedType == "add") {
        this.showTitle = "添加水费录入";
      } else{
        this.showTitle = "编辑水费录入";
      }
    },
    // 选择所属地址之后加载地址下所有的水表
    selectedParentsId(val,type) {
      if(type != 'watch') {
        this.ruleForm.water_id = '';
      }
      if(!val) {
        return
      }
      let params = {
        id: val
      }
      this.$client.getWaterUnitChild(params)
      .then(res => {
        console.log(res)
        if(res.head.result == "200") {
          this.electricMeterOptions = res.context
        }else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 监听输入数字变化
    inputNumberChange(type) {
      let re = /([0-9]+.[0-9]{2})[0-9]*/;
      this.ruleForm[type] = this.ruleForm[type].replace(re,"$1");
    },

    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.ruleForm)
          // return
          let info = {...this.ruleForm};
          this.$emit("save-add-edit",info);
        } else {
          return false;
        }
      });

    },

  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog__wrapper {
  // display: flex;
  // flex-direction: row;
  // justify-content: center;
  // align-items: center;
}
.el-dialog-div {
  height: 400px;
  overflow-y: scroll;
}

.el-dialog-div /deep/ .el-input {
  width:320px;
}

.el-dialog-div /deep/ .el-input__inner {
  width:320px;
}
.el-dialog-div /deep/ .el-date-editor .el-range-separator {
  width 10%
}
.el-cascader {
  width: 100% !important;
}
</style>



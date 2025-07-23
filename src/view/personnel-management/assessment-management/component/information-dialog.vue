<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="600px"
    
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="140px" size="mini">
        <el-form-item label="考核名称:" prop="c_name">
          <el-input v-model="form.c_name" placeholder="请输入考核名称"></el-input>
        </el-form-item>
        <el-form-item label="考核开始时间:" prop="c_name">
          <el-date-picker
            v-model="form.c_name"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="考核结束时间:" prop="c_name">
          <el-date-picker
            v-model="form.c_name"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="选择模板:" prop="c_name">
          <el-select v-model="form.c_name" clearable placeholder="请选择">
            <el-option
              v-for="item in templateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考核人员:" prop="c_name">
          <get-department-select
            ref="personalTree"
            v-model="form.created_id"
            :width="380"
            :show_all="true"
            :isShowCheckbox="true"
            :placeholder="'请选考核人员'"
            :isContainEmp="true"
            :isExportMultiple="true"
            :isCheckStrictly="false"
          ></get-department-select>
        </el-form-item>
        <el-form-item label="审核人:" prop="c_name">
          <get-department-select
            ref="checkPersonalTree"
            v-model="form.user_id"
            :width="380"
            :show_all="true"
            :isShowCheckbox="false"
            :placeholder="'请选审核人'"
            :isContainEmp="true"
            :isExportMultiple="false"
          ></get-department-select>
        </el-form-item>
        <el-form-item label="是否需要员工自评:" prop="c_name">
          <el-radio-group v-model="form.radio">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="员工自评分占比:" prop="c_name">
          <el-input v-model="form.c_name" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.n_fee = $event.target.value" placeholder="请输入员工自评分占比">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="审核人评分占比:" prop="c_name">
          <el-input v-model="form.c_name" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.n_fee = $event.target.value" placeholder="请输入审核人评分占比">
            <template slot="append">%</template>
          </el-input>
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
export default {
  components: {
    getDepartmentSelect
  },
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
      form: {
        i_id: "",
        c_name: "",
        c_remark: "",
        created_id:"",
        user_id: "",
        radio: ""
      },
      basicRules: {
        c_name: [
          { required: true, message: "请输入岗位名称", trigger: "change" },
        ],
        c_remark: [
          { required: true, message: "请填写岗位描述", trigger: "change" },
        ],
      },
      templateOptions: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
       }],
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
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
   
    updatePlaybill(formName) {
       this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {...this.form};
          this.$emit("save-add-edit-job", info);
        } else {
          return false;
        }
      });
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div  /deep/ .el-date-editor {
  width: 420px;
}
.el-dialog-div  /deep/.el-select,.el-select--mini {
  width: 420px;
}
.el-dialog-div  /deep/ .el-input,.el-input--mini{
  width: 420px;
}

.el-dialog-div  /deep/ .el-textarea {
  width: 420px;
}

</style>


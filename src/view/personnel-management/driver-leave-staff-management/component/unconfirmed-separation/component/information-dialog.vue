<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="600px"
    
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="140px" size="mini">
        <el-form-item label="员工姓名:" prop="person_id">
          <get-driver-select-tree
            ref="dutyPersonalTree"
            v-model="form.person_id"
            :width="'400'"
            :show_all="true"
            :isShowCheckbox="false"
            :placeholder="'请选择员工姓名'"
            :isContainEmp="true"
            :isExportMultiple="false"
            :disabled="curSelecedType =='detail'"
          ></get-driver-select-tree>
        </el-form-item>
        <el-form-item label="离职类型:" prop="type">
          <el-select v-model="form.type">
            <el-option :value="1" :label="'离职'"></el-option>
            <el-option :value="2" :label="'退休'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预计离职日期:" prop="hope_date">
           <el-date-picker
            v-model="form.hope_date"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :disabled="curSelecedType =='detail'"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="离职原因:" prop="reason">
          <el-input v-model="form.reason" style="width:100%"></el-input>
          <!-- <tr-select-dictionaries v-model="form.reason" :classKey="'离职原因'" :placeholder="'请选择离职原因'" :isMultiple="false" :disabled="curSelecedType =='detail'"></tr-select-dictionaries> -->
        </el-form-item>
        <el-form-item label="工作交接人:" prop="handover_id">
          <div class="show-flex-box-c">
            <get-driver-select-tree
              ref="personalTree"
              v-model="form.handover_id"
              :width="'400'"
              :show_all="true"
              :isShowCheckbox="false"
              :placeholder="'请选工作交接人'"
              :isContainEmp="true"
              :isExportMultiple="false"
              :disabled="curSelecedType =='detail'"
            ></get-driver-select-tree>
            <span style="font-size:12px; color: #909399">该员工待处理的审批单，将会转给工作交接人</span>
          </div>
          
        </el-form-item>
        <el-form-item label="离职备注:" prop="remark">
          <el-input
            v-model="form.remark" 
            type="textarea"
            maxlength="200"
            :rows="4"
            show-word-limit
            placeholder="请输入离职备注"
            :disabled="curSelecedType =='detail'"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer" v-if="curSelecedType != 'detail'">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
export default {
  components: { getDriverSelectTree},
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
        person_id: "",
        hope_date: "",
        reason: "",
        handover_id: "",
        type: '',
        remark: "",
      },
      basicRules: {
        person_id: [
          { required: true, message: "请选择员工姓名", trigger: "change" },
        ],
        type: [
          { required: true, message: "请选择离职类型", trigger: "change" },
        ],
        hope_date: [
          { required: true, message: "请选择预计离职日期", trigger: "change" },
        ],
        reason: [
          { required: true, message: "请选择离职原因", trigger: "change" },
        ],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() <= Date.now();
        },
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        this.$refs.dutyPersonalTree.onClear();
        this.$refs.personalTree.onClear();
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
.el-dialog-div {
  // height: 350px;
  // overflow-y: scroll;
}
.el-dialog-div /deep/ .el-input {
  width: 420px;
}
</style>


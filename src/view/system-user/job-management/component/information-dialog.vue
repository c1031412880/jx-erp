<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="600px"
    
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="140px" size="mini">
        <el-form-item label="职位名称:" prop="c_name">
          <el-input v-model="form.c_name" placeholder="请输入职位名称"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" prop="dept_id">
          <get-department-select
            ref="tree"
            :key="key"
            v-model="form.dept_id"
            :isContainEmp="false"
            :isShowCheckbox="true"
          ></get-department-select>
        </el-form-item>
        <el-form-item label="职务名称:" prop="postition_name">
          <get-select-dictionaries v-model="form.postition_name" :isMultiple="true" :classKey="'岗位级别'" :placeholder="'请选择职务名称'"></get-select-dictionaries>
        </el-form-item>
        <el-form-item label="职级名称:" prop="rank_name">
          <get-select-dictionaries v-model="form.rank_name" :isMultiple="true" :classKey="'职级'" :placeholder="'请选择职级名称'"></get-select-dictionaries>
        </el-form-item>
        <!-- <el-form-item label="职位描述:" prop="c_remark">
          <el-input
            v-model="form.c_remark" 
            type="textarea"
            maxlength="200"
            :rows="4"
            show-word-limit
            placeholder="请输入职位描述"></el-input>
        </el-form-item> -->
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: { getDepartmentSelect, getSelectDictionaries },
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
      form: {
        i_id: "",
        c_name: "",
        dept_id: [],
        postition_name: [],
        rank_name: [],
      },
      basicRules: {
        c_name: [
          { required: true, message: "请输入职位名称", trigger: "change" },
        ],
        dept_id: [
          { required: true, message: "请选择所属部门", trigger: "change" },
        ],
      },
      key: null
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        this.$refs.tree.onClear()
        Object.assign(this.$data, this.$options.data());
      }else{
        this.$nextTick(() => {
          this.key = new Date().getTime()
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
          info.dept_id = info.dept_id.toString()
          info.postition_name = info.postition_name.toString()
          info.rank_name = info.rank_name.toString()
          console.log('info',info);
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
.el-dialog-div /deep/ .el-input {
  width: 420px;
}
</style>


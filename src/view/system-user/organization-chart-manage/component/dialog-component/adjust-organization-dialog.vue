<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="320px"
    
  >
    <div class="el-dialog-div">
     <organization-tree
        :loading="organizationloading"
        :placeholder="placeholder"
        :organizationTreeList="organizationTreeList"
        @on-tree="selectDepartment"
      ></organization-tree>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" size="mini" @click="updatePlaybill()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import organizationTree from "../../component/organization-tree";
export default {
  components: {
    organizationTree
  },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "选择部门",
    },
    organizationTreeList:[Array]
  },
  data() {
    return {
      organizationloading: false,
      placeholder: "搜索",
      // organizationTreeList:[]
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    selectDepartment(departmentInfo) {
      this.departmentId = departmentInfo.dept_id;
    },
    
    updatePlaybill() {

      this.$emit("save-selected-department", this.departmentId);

    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog__wrapper{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-dialog{
  background: red !important;
}

.el-dialog-div {
  height: 300px;
  overflow-y: scroll;
}

</style>



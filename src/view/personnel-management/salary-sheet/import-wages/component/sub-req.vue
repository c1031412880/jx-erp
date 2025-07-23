<template>
  <div class="sub-req">
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="姓名:">
          <!-- <get-user-select-tree
            ref="userTree"
            v-model="form.user_ids"
            placeholder="请选择人员"></get-user-select-tree> -->
          <get-department-select
            ref="userTree"
            v-model="user_indexs"
            :isExportMultiple="true"
            :isCheckStrictly="false"
            :placeholder="'请选择员工'"
            :show_all="true"
            @on-change="onSelectChange"
          ></get-department-select>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary"
            @click="onSubmit"
            icon="el-icon-search" 
            >查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"  
            icon="el-icon-refresh-right"
            @click="resetForm"
            >重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary" 
            @click="onBtn('import')"
            icon="el-icon-download" 
            v-if="$isPowerShow('import')"
            >导入   </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary" 
            @click="onBtn('issue')"
            v-if="$isPowerShow('issue')"
            icon="el-icon-thumb" 
            >下发工资条</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>
<script type="text/ecmascript-6">
import getUserSelectTree from 'components/base/formModel/tree/get-user-select-tree'
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree2";
export default {
  components: { 
    // getUserSelectTree,
    getDepartmentSelect
  },

  data() {
    return {
      form: {
        user_ids: [],
      },
      user_indexs: []
    }
  },
  mounted() {

  },
  methods: {
    onSelectChange(vehs, nodes) {
      if (vehs && vehs.length > 0) {
        this.form.user_ids = vehs.map(item => {
          return Number(item.split('_')[1])
        });
      } else {
        this.form.user_ids = []
      }
    },
    // 查询
    onSubmit () {
      this.$emit("on-ok", this.form);
    },
    
    // 重置
    resetForm() {
      Object.assign(this.$data, this.$options.data())
      this.$refs.userTree.onClear()
      this.onSubmit()
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 100);
    },

    // 导入Excel
    onBtn(type) {
      this.$emit(`on-btn-${type}`);
    },
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
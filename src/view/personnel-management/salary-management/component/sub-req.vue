<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="部门:">
          <get-department-select
            ref="departmentlTree"
            v-model="form.dept_ids"
            :isShowCheckbox="true"
            :placeholder="'请选择部门'"
            :isContainEmp="false"
            :isExportMultiple="true"
            :funcType="''"
          ></get-department-select>
        </el-form-item>
        <el-form-item label="姓名:" v-if="activeName != '2'">
          <get-department-select-tree
            ref="personalTree"
            v-model="user_index"
            :show_all="true"
            :isShowCheckbox="true"
            :placeholder="'请选择人员'"
            :isExportMultiple="true"
            :isCheckStrictly="false"
            @on-change="changeUser"
          ></get-department-select-tree>
        </el-form-item>
        <el-form-item label="姓名" prop="user_id" v-if="activeName == '2' && $isPowerShow('driver')">
          <get-driver-select-tree
            ref="driverTree"
            v-model="form.user_ids"
            :width="'220'"
            :isShowCheckbox="true"
            :placeholder="'请选择姓名'"
            :isExportMultiple="true"
          ></get-driver-select-tree>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" icon="el-icon-refresh-right">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSet()">{{setUpInfo[this.activeName]}}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onAdd()">{{addInfo[this.activeName]}}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onImport()">{{importInfo[this.activeName]}}</el-button>
        </el-form-item>

      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree"
import getDepartmentSelectTree from "@/components/base/formModel/tree/get-department-select-tree2";
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
export default {
   components: {
    getDepartmentSelect,
    getDepartmentSelectTree,
    getDriverSelectTree
  },
  props:{
    activeName: {
      type: String,
      default: "1",
    },
  },
  data() {
    return {
      user_index: [],
      form: {
        dept_ids: [],
        user_ids: []
      },

      setUpInfo: {
        '1': '职级薪资设定',
        '2': '驾照薪资设定',
        '3': '',
        '4': '',
      },
      addInfo: {
        '1': '新增集团员工',
        '2': '新增驾驶员',
        '3': '',
        '4': '',
      },
      importInfo: {
        '1': '导入集团员工',
        '2': '导入驾驶员',
        '3': '',
        '4': '',
      }
    };
  },
  mounted() {
    // this.onSubmit()
  },
  methods: {
    changeUser(vehs) {
       if (vehs && vehs.length > 0) {
        this.form.user_ids = vehs.map(item => {
          return Number(item.split('_')[1])
        });
      } else {
        this.form.user_ids = []
      }
    },
    // 查询
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      this.$refs.departmentlTree.onClear();
      if (this.activeName == '1') {
        this.$refs.personalTree.onClear();
      }
      if (this.activeName == '2') {
        this.$refs.driverTree.onClear();
      }
      Object.assign(this.$data, this.$options.data());
      this.onSubmit();
    },
    onAdd() {
      this.$emit('on-add')
    },
    onSet() {
      this.$emit('on-set')
    },
    onImport() {
      this.$emit('on-import')
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>

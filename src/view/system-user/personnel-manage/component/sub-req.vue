<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="账号:">
          <el-input
            v-model="form.c_login_id"
            placeholder="请输入用户账号"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名:">
          <el-input
            v-model="form.c_name"
            placeholder="请输入用户姓名"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="组织:">
          <get-department-select
            ref="departmentTree"
            v-model="form.i_department_base"
            :isContainEmp="false"
            :isShowCheckbox="false"
            :isExportMultiple="false"
            :placeholder="'请选择组织'"
          ></get-department-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" icon="el-icon-refresh-left"
            >重置</el-button
          >
        </el-form-item>
        <br />
        <el-form-item label="角色:">
          <get-role-select-tree
            ref="roleTree"
            v-model="form.i_role_id"
            :isContainEmp="false"
            :isShowCheckbox="false"
            :isExportMultiple="false"
            :placeholder="'请选择角色'"
          ></get-role-select-tree>
        </el-form-item>
        <el-form-item label="类型:">
          <el-select
            v-model="form.c_not_employee"
            clearable
            placeholder="请选择用户类型"
          >
            <el-option label="显示真实用户" value="0"></el-option>
            <el-option label="显示虚拟用户" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select
            v-model="form.c_state"
            clearable
            placeholder="请选择用户状态"
          >
            <el-option label="全部" value="0"></el-option>
            <el-option label="永久" value="1"></el-option>
            <el-option label="临时" value="2"></el-option>
            <el-option label="停用" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onBtn('add')"
            v-if="$isPowerShow('add')"
            >添加用户</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onBtn('batch-end')"
            v-if="$isPowerShow('stop')"
            >停用用户</el-button
          >
        </el-form-item>
        <!--        <el-form-item>-->
        <!--          <el-button type="text" @click="AdvancedSet">高级筛选</el-button>-->
        <!--        </el-form-item>-->
        <div style="float: right; height: 47px; display: flex">
          <i
            class="el-icon-refresh"
            style="margin-right: 15px; cursor: pointer"
            @click="refreshTableList()"
          ></i>
          <i
            class="el-icon-s-tools"
            style="cursor: pointer"
            @click="openSettingPage()"
          ></i>
        </div>
      </el-row>
      <!-- <el-row>
        <div style="float: right; height: 47px; display: flex">
          <i
            class="el-icon-refresh"
            style="margin-right: 15px; cursor: pointer"
            @click="refreshTableList()"
          ></i>
          <i
            class="el-icon-s-tools"
            style="cursor: pointer"
            @click="openSettingPage()"
          ></i>
        </div>
      </el-row> -->
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getRoleSelectTree from "@/components/base/formModel/tree/get-role-select-tree";
export default {
  components: {
    getDepartmentSelect,
    getRoleSelectTree,
  },
  data() {
    return {
      date: "",
      form: {
        c_login_id: "",
        c_name: "",
        i_department_base: "",
        i_role_id: "",
        c_state: "1",
        c_not_employee: "",
      },
    };
  },
  methods: {
    selectedTime() {
      if (this.date && this.date.length > 0) {
        this.form.check_range = `${this.date[0]}~${this.date[1]}`;
      } else {
        this.form.check_range = "";
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
      Object.assign(this.$data, this.$options.data());
      // 清空组织
      this.$refs.departmentTree.onClear();
      // 清空组织
      this.$refs.roleTree.onClear();
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 300);
    },
    // 添加编辑
    onBtn(com) {
      this.$emit(`on-${com}`);
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
    // 刷新列表
    refreshTableList() {
      Object.assign(this.$data, this.$options.data());
      // 清空组织
      this.$refs.departmentTree.onClear();
      // 清空组织
      this.$refs.roleTree.onClear();
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "刷新成功", type: "success" });
      }, 300);
    },
    // 打开高级筛选
    AdvancedSet() {
      this.$parent.openAdvancedFilterPage();
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>

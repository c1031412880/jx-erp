<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item>
          <el-input v-model="form.name" placeholder="请输入线路名称" clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <get-department-select
            ref="departmentTree"
            v-model="form.group"
            :isContainEmp="isContainEmp"
            :funcType="funcType"
            :placeholder="placeholder"
            @on-change="onSelectChange"
          ></get-department-select>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.usable">显示已停用线路</el-checkbox>
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
        <!-- <el-form-item>
          <el-button type="text" @click="AdvancedSet">高级筛选</el-button>
        </el-form-item> -->
      </el-row>
      <el-row>
        <el-form-item>
          <el-button type="primary" @click="onBtn('add')" icon="el-icon-plus"
          v-if="$isPowerShow('add')"
            >添加线路</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('stop')" icon="el-icon-circle-close" v-if="$isPowerShow('del')"
            >停用线路</el-button
          >
        </el-form-item>
        <el-form-item>
          <!-- <el-button type="danger" @click="onBtn('delete')" icon="el-icon-delete"
            >删除线路</el-button
          > -->
          <el-popconfirm
            @confirm="onBtn('delete')"
            title="确定删除选中的线路吗？"
            v-if="$isPowerShow('del')">
            <el-button slot="reference" type="primary" icon="el-icon-delete" size="mini">删除线路</el-button>
          </el-popconfirm>
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('import')" icon="el-icon-download" v-if="$isPowerShow('import')"
            >导入</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('export')" icon="el-icon-upload2" v-if="$isPowerShow('export')"
            >导出</el-button
          >
        </el-form-item>

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
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: { getDepartmentSelect },
  data() {
    return {
      isContainEmp: false, //是否显示部门下的人员
      placeholder: '请选择线路所属组',
      funcType: 1, // 功能类别 1 运营单元 2 维修单元 3 仓储单元
      carNameOptions:[],
      carFactoryOptions:[],
      form: {
        name: "",
        group: [],
        usable: 0
      },
    };
  },
  mounted() {},
  methods: {
    onSelectChange(vehs, nodes) {
      // alert(JSON.stringify(nodes))
      if (nodes && nodes.length > 0) {
        // nodes.forEach((item, index) => {
        //   delete item.children;
        // });
        // this.ruleForm.reminders = nodes;
      } else {
        // this.ruleForm.reminders = [];
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
      if(info.group.length == 0) {
        delete info.group
      }
      if(this.form.usable) {
        info.usable = 0
      }
      // console.log(info)
      // return
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      this.form.name = "";
      this.form.group = [];
      this.form.usable = 0;
      // 清空组织
      this.$refs.departmentTree.onClear();
      this.$parent.restTableList();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 500);
    },
    // 添加编辑
    onBtn(com) {
      this.$emit("on-add", com);
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
    // 刷新列表
    refreshTableList() {
      // alert("刷新成功")
      this.$parent.informationDialogOk();
      setTimeout(() => {
        this.$message({ message: "刷新成功", type: "success" });
      }, 50);
    },
    // 打开高级筛选
    AdvancedSet() {
      this.$parent.openAdvancedFilterPage();
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>

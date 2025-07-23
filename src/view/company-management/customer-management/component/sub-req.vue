<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="客户名称:">
          <el-input v-model="form.name" placeholder="搜索客户名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="企业类型:">
          <tr-select-dictionaries v-model="form.firm_id" :classKey="'企业类型'" :placeholder="'企业类型'"></tr-select-dictionaries>
        </el-form-item>
        <el-form-item label="对接人:">
          <get-department-select
            ref="personalTree"
            v-model="user_indexs1"
            :isShowCheckbox="true"
            :placeholder="'请选择对接人'"
            :isContainEmp="true"
            :show_all="true"
            :isExportMultiple="true"
            :isCheckStrictly="false"
            @on-change="onDutyChange"
          ></get-department-select>
        </el-form-item>
        <el-form-item label="客户来源:">
          <tr-select-dictionaries v-model="form.source" :classKey="'客户来源'" :placeholder="'客户来源'"></tr-select-dictionaries>
        </el-form-item>

        <el-form-item label="创建人:">
          <get-department-select
            ref="creatPersonalTree"
            v-model="user_indexs2"
            :isShowCheckbox="true"
            :placeholder="'请选择创建人'"
            :isContainEmp="true"
            :show_all="true"
            :isExportMultiple="true"
            :isCheckStrictly="false"
            @on-change="onCreateChange"
          ></get-department-select>
        </el-form-item>
        <el-form-item label="创建时间:">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="选择开始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            end-placeholder="选择结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('reset')" type="primary" icon="el-icon-refresh-right"
            >重置</el-button
          >
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button class="el-icon-plus" @click="addJob()" type="primary" v-if="$isPowerShow('add')"
            >添加客户</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button class="el-icon-upload2" @click="exportExcle()" type="primary" v-if="$isPowerShow('export')"
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
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree2";
export default {
  components: {
    getDepartmentSelect
  },
  data() {
    return {
      date:[],
      form: {
        name:"",
        firm_id:"",
        create_start:"",
        create_end:"",
        duty_ids:[],
        create_ids:[],
        source:"",
      },
      user_indexs1: [],
      user_indexs2: []
    };
  },
  mounted() {
  },
  methods: {
    onDutyChange(vehs, nodes) {
      if (vehs && vehs.length > 0) {
        this.form.duty_ids = vehs.map(item => {
          return Number(item.split('_')[1])
        });
      } else {
        this.form.duty_ids = []
      }
    },
    onCreateChange(vehs, nodes) {
      if (vehs && vehs.length > 0) {
        this.form.create_ids = vehs.map(item => {
          return Number(item.split('_')[1])
        });
      } else {
        this.form.create_ids = []
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
      if(!!this.date && this.date.length > 0) {
        this.date = this.$addTime(this.date);
        info.create_start = this.date[0];
        info.create_end = this.date[1];
      }else{
        this.date = []
        this.form.create_start = ''
        this.form.create_end = ''
      }
      if(this.form.create_ids.length == 0) {
        delete info.create_ids
      }
      if(this.form.duty_ids.length == 0) {
        delete info.duty_ids
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm(type) {
      this.form.name = "";
      this.form.firm_id = "";
      this.form.create_start = "";
      this.form.create_end = "";
      this.form.duty_ids = [];
      this.form.create_ids = [];
      this.form.source = "";
      this.date = [];
      this.$refs.personalTree.onClear();
      this.$refs.creatPersonalTree.onClear();
      this.onSubmit();
      if(type == 'reset') {
        setTimeout(() => {
          this.$message({ message: "重置成功", type: "success" });
        }, 50);
      }
      
    },
    // 添加编辑
    addJob() {
      this.$emit("on-add", 'add');
    },
    exportExcle() {
      this.$emit("export-excle");     
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
    // 刷新列表
    refreshTableList() {
      this.form.c_name = "";
      this.$parent.restTableList();
      setTimeout(() => {
        this.$message({ message: "刷新成功", type: "success" });
      }, 50);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>

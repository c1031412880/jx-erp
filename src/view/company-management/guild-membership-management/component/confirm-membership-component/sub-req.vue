<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="会员姓名:">
          <get-department-select
            ref="personalTree"
            v-model="form.user_ids"
            :width="'180'"
            :isShowCheckbox="true"
            :placeholder="'请选择'"
            :isContainEmp="true"
            :show_all="true"
            :isExportMultiple="true"
            :isCheckStrictly="false"
          ></get-department-select>
          <!-- <el-input v-model="form.name" placeholder="搜索会员姓名" clearable></el-input> -->
        </el-form-item>
        <!-- <el-form-item label="部门:">
          <get-department-select
            ref="tree"
            v-model="form.org_ids"
            :isContainEmp="false"
          ></get-department-select>
        </el-form-item> -->
        <el-form-item label="申请日期:">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="selectedTime"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" type="primary" icon="el-icon-refresh-right"
            >重置</el-button
          >
        </el-form-item>
        <!-- <el-form-item>
          <el-button @click="addJob()" type="primary">办理离职</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="" class="el-icon-upload2"  @click="exportInfo()">导出</el-button>
        </el-form-item> -->
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
export default {
  components: {getDepartmentSelect},
  data() {
    return {
      date:[],
      form: {
        begin_date:"",
        end_date: "",
        user_ids: [],
      },
    };
  },
  mounted() {
  },
  methods: {
    selectedTime: function() {
      if(this.date && this.date.length>0) {
        this.date = this.$addTime(this.date)
        // console.log(this.date)
        this.form.begin_date = this.date[0];
        this.form.end_date = this.date[1];
      }else{
        this.form.begin_date = '';
        this.form.end_date = '';
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
      if(this.form.hope_date && this.form.hope_date.length > 0) {
        info.hope_date = this.$addTime(this.form.hope_date)
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      Object.assign(this.$data, this.$options.data());
      this.$refs.personalTree.onClear();
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 添加编辑
    addJob() {
      this.$emit("on-add", 'add');
    },
    // 导出
    exportInfo() {
      this.$emit("export-file");
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$emit('open-setting-page')
      // this.$parent.openSettingPageEvent();
    },
    // 刷新列表
    refreshTableList() {
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "刷新成功", type: "success" });
      }, 50);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>

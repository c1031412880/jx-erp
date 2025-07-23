<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="考核周期:">
          <get-quarter-select ref="getQuarterSelect" @on-change="funcQuarter"></get-quarter-select>
        </el-form-item>
        <el-form-item label="驾驶员:">
          <get-driver-select-tree
            ref="driverTree"
            v-model="form.driver_id"
            :width="'160'"
            :isShowCheckbox="true"
            :placeholder="'请选择驾驶员'"
            :isExportMultiple="true"
          ></get-driver-select-tree>
        </el-form-item>
        <el-form-item label="本次评定星级:">
          <el-select v-model="form.star" clearable placeholder="请选择">
            <el-option
              v-for="item in starLevelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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
        <el-form-item>
          <el-button @click="exportFile()" icon="el-icon-download" type="primary" v-if="$isPowerShow('export')"
            >导出</el-button
          >
        </el-form-item>

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
import getQuarterSelect from 'components/base/formModel/select/get-quarter-select'
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
export default {
  components: {
    getQuarterSelect,
    getDriverSelectTree
  },
  data() {
    return {
      starLevelOptions:[
        {
          value: 3,
          label: '三星级'
        }, {
          value: 2,
          label: '二星级'
        }, {
          value: 1,
          label: '一星级'
        }, {
          value: 0,
          label: '无星级'
        }
      ],
      form: {
        year: "",
        quarter:"",
        star: "",
        driver_id: []
      },
    };
  },
  mounted() {
  },
  methods: {
    funcQuarter(value){
      console.log(value)
      this.form.year = Number(value.slice(0,4))
      if(value.indexOf('一') > -1) {
        this.form.quarter = 1
      }
      if(value.indexOf('二') > -1) {
        this.form.quarter = 2
      }
      if(value.indexOf('三') > -1) {
        this.form.quarter = 3
      }
      if(value.indexOf('四') > -1) {
        this.form.quarter = 4
      }
    },
    // 查询
    onSubmit() {
      let info = {...this.form};
      if(!this.form.driver_id.length) {
        delete info.driver_id
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      this.form.star = "";
      this.form.driver_id = "";
      this.form.year = "";
      this.form.quarter = "";
      this.$refs.getQuarterSelect.showValue = "";
      this.$refs.driverTree.onClear();
      this.$parent.restTableList();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 导出
    exportFile() {
      this.$emit("export-file");
    },
    deleteJob() {
      this.$emit("delete-Job");     
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
    // 刷新列表
    refreshTableList() {
      this.form.star = "";
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

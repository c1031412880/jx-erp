<template>
  <div>
    <el-form
      ref="elForm"
      :inline="true"
      size="mini"
    >
      <el-row>
        <el-form-item label="日期:">
          <el-date-picker
            size="mini"
            value-format="yyyy-MM"
            v-model="form.repair_date"
            type="month"
            placeholder="选择月"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="维修车间/班组:">
          <get-department-select
            ref="baseTree"
            @on-change="changeType"
            :isShowCheckbox="false"
            :funcType="2"
            :placeholder="'选择维修单元'"
            v-model="form.shop_id"
            :isExportMultiple="false"
          ></get-department-select>
        </el-form-item>
        <el-form-item label="修理工:">
          <el-select
            v-model="form.person_id"
            clearable
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in repair_men"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-refresh-left" @click="reset"
            >重置</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-download" @click="onExport"
            >导出</el-button
          >
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>
<script type="text/ecmascript-6">
import getDepartmentSelect from "./get-department-select-tree";
import { formatDate } from "@/utils/index";
export default {
  components: {
    getDepartmentSelect,
  },
  data() {
    return {
      date: [],
      repair_men: [],
      form: {
        repair_date: formatDate(new Date().getTime(),'yyyy-MM-dd'),
        shop_id: "",
        person_id: "",
        type:'',
      },

    };
  },
  mounted() {
    this.onSubmit()
    this.getRepairperson()
  },
  methods: {
    changeType(val,vhe){
      if(vhe && vhe[0]){
        if(vhe[0].type==4){
        this.form.type =1
        }else{
          this.form.type =2
        }
      }
    },
    //获取维修工人员
    getRepairperson(){
      let params = {};
      this.$client.getPersonsMaintRepairReport(params).then((res) => {
        if (res.head.result == "200") {
          this.repair_men = res.context;
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      });
    },
    onSubmit() {
      let info = { ...this.form };
      this.$emit("on-ok", info);
    },
    onExport() {
      this.$emit("on-export");
    },
    // 重置
    reset() {
      this.form.shop_id = "", 
      this.form.person_id = "";
      this.$refs.baseTree.onClear();
      // this.form.repair_date = []
      this.onSubmit();
    },
  },
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>

.hours_input {
  margin-top: 50px;
  border-bottom: 1px solid #ececec;
  height: 160px;
}
</style>

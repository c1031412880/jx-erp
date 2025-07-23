<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="统计月份：">
          <el-date-picker
            v-model="form.year_month"
            type="month"
            value-format="yyyy-MM"
            placeholder="选择月份"
            :clearable="false"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="品牌型号：">
          <el-select
            v-model="form.vehicle_models_str"
            clearable
            collapse-tags
            multiple
            placeholder="车辆型号"
            style="width: 250px;"
          >
            <el-option
              v-for="item in vehModelData"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆类型：">
          <!-- <tr-select-dictionaries
            v-model="form.car_type_name_str"
            :classKey="'车型信息管理车辆类型'"
            :placeholder="'车辆类型'"
            :isMultiple="true"
            :collapseTags="true"
          ></tr-select-dictionaries> -->
          <el-form-item>
            <el-select
              v-model="form.car_type_name_str"
              clearable
              collapse-tags
              multiple
              placeholder="车辆类型"
            >
            <el-option
              v-for="item in vehTypeData"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" icon="el-icon-search"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="resetForm"
            icon="el-icon-refresh-right"
            >重置</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            v-if="$isPowerShow('export')"
            @click="onBtn('export')"
            icon="el-icon-download"
            >导出</el-button
          >
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>
<script type="text/ecmascript-6">
import { formatDate } from "@/utils/index";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
export default {
  components: {
    getVehicleSelectTree,
  },
  data() {
    return {
      vehTypeData: [],
      vehModelData: [],
      form: {
        year_month: formatDate(this.getLastMonthDate(), "yyyy-MM"),
        car_type_name_str: [],
        vehicle_models_str: [],
      },
    };
  },
  mounted() {
    this.getVehType();
    this.getVehModel()
    this.onSubmit();
  },
  methods: {
    // 查询
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      info.car_type_name_str = info.car_type_name_str.join(",");
      info.vehicle_models_str = info.vehicle_models_str.join(",");
      console.log("info", info);
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      (this.form.year_month = formatDate(this.getLastMonthDate(), "yyyy-MM")),
        (this.form.car_type_name_str = []),
        (this.form.vehicle_models_str = []),
        this.onSubmit();
    },
    //得到上个月时间
    getLastMonthDate() {
      const currentDate = new Date();
      const lastMonthDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1
      );
      return lastMonthDate;
    },
    // 导出Excel
    onBtn(type) {
      this.$emit(`on-btn-${type}`);
    },
    // 获取车辆型号
    getVehType() {
      this.vehTypeData = [];
      this.$client.GetDistinctVehicleType({}).then((req) => {
        if (req.head.result === "200") {
          this.vehTypeData = req.context
        }
      });
    },
    // 获取品牌
    getVehModel() {
      this.vehModelData = [];
      this.$client.GetDistinctVehicleModel({}).then((req) => {
        if (req.head.result === "200") {
          this.vehModelData = req.context
        }
      });
    },
  },
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped></style>
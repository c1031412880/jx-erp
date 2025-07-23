<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="统计月份：">
          <el-date-picker
            v-model="form.year_month"
            type="month"
            value-format="yyyy-MM"
            placeholder="选择月"
            :clearable="false">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="车辆：">
         <get-vehicle-select-tree
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_ids">
          </get-vehicle-select-tree>
        </el-form-item>

        <el-form-item label="车辆型号：">
          <el-select v-model="form.vehicle_models" clearable placeholder="请选择车辆型号" multiple>
            <el-option
              v-for="item in modelList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆类型">
          <el-select v-model="form.vehicle_types" clearable placeholder="请选择车辆类型" multiple>
            <el-option
              v-for="item in vehTypeList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="燃料类型">
          <el-select v-model="form.fuel_type_names" clearable placeholder="请选择燃料类型" multiple>
            <el-option
              v-for="item in fuelTypelList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分公司">
          <el-select v-model="form.dept_ids" clearable placeholder="请选择分公司" multiple>
            <el-option
              v-for="item in branchOffice"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否显示报废车辆:">
          <el-radio-group  v-model="form.is_show_scrap">
            <el-radio :label="0"><span>不显示</span></el-radio>
            <el-radio :label="1"><span>显示</span></el-radio>
          </el-radio-group>
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
            type="" 
            @click="resetForm"
            icon="el-icon-refresh-right"
            >重置</el-button>
        </el-form-item>

        <el-form-item>
          <el-button
            v-if="$isPowerShow('export')"
            @click="onBtn('export')" 
            icon="el-icon-download" 
            >导出</el-button>
        </el-form-item>

        <!-- <div style="float: right; height: 47px; display: flex">
          <i
            class="el-icon-s-tools"
            style="cursor: pointer"
            @click="openSettingPage()"
          ></i>
        </div> -->
      </el-row>
    </el-form>
  </div>
</template>
<script type="text/ecmascript-6">
import { getDate } from "@/utils/index";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
export default {
  components: { 
    getVehicleSelectTree
  },

  data() {
    return {
      form: {
        year_month: '',
        is_show_scrap: 0,
        vehicle_ids: [],
        vehicle_models: [],
        vehicle_types: [],
        fuel_type_names: [],
        dept_ids: []
      },
      branchOffice: [],
      modelList: [],
      vehTypeList: [],
      fuelTypelList: []
    }
  },
  mounted() {
    this.GetDeptInfoCaches()
    this.GetVehModelInfo()
    this.GetVehTypeInfo()
    this.GetFuelTypeInfo()
    this.onSetTime()
    this.$nextTick(() => {
      this.onSubmit()
    })
  },
  methods: {
    onSetTime(type = 'lastOneMonth') {
      let timeObj = getDate(type)
      this.form.year_month = timeObj.startTime.slice(0,7)
    },
    // 查询
    onSubmit () {
      this.$emit("on-ok", this.form);
    },
    
    // 重置
    resetForm() {
      Object.assign(this.$data.form, this.$options.data().form)
      this.onSetTime()
      this.$refs.vehicleTree.onClear()
      this.onSubmit()
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 100);
    },
    GetDeptInfoCaches() {
      this.$client.GetDeptInfoCaches({}).then(res => {
        if (res.head.result === '200') {
          this.branchOffice = res.context 
        }
      })
    },
    GetVehModelInfo() {
      this.$client.GetVehicleModelsErpFuelMonthReport({}).then(res => {
        if (res.head.result === '200') {
          this.modelList = res.context.list 
        }
      })
    },
    GetVehTypeInfo() {
      this.$client.GetVehicleTypesErpFuelMonthReport({}).then(res => {
        if (res.head.result === '200') {
          this.vehTypeList = res.context.list
        }
      })
    },
    GetFuelTypeInfo() {
      this.$client.GetFuelTypesErpFuelMonthReport({}).then(res => {
        if (res.head.result === '200') {
          this.fuelTypelList = res.context.list 
        }
      })
    },
    // 导出Excel
    onBtn(type) {
      this.$emit(`on-btn-${type}`);
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
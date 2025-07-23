<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="统计月份：">
          <el-date-picker
            v-model="form.year_month"
            type="month"
            value-format="yyyy-MM"
            placeholder="选择月">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="车辆：">
          <!-- <get-vehicle-select-tree
            ref="vehicleTree"
            width="200"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_ids">
          </get-vehicle-select-tree> -->
          <get-vehicle-select-dialog
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_ids	"
          >
          </get-vehicle-select-dialog>
        </el-form-item>

        <el-form-item label="燃料类别：">
          <get-select-dictionaries 
            v-model="form.fuel_type" 
            :classKey="'燃料类别'" 
            :placeholder="'请选择'">
          </get-select-dictionaries>
        </el-form-item>

        <el-form-item label="车型：">
          <el-select v-model="form.type_id" clearable placeholder="车辆型号">
            <el-option
              v-for="item in vehTypeData"
              :key="item.id"
              :label="item.name"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据源：">
          <el-select v-model="form.ele_source" placeholder="请选择数据源">
          <el-option label="全部" :value="0"></el-option>
            <el-option label="对接" :value="1"></el-option>
            <el-option label="录入" :value="2"></el-option>
          </el-select>
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
            @click="onBtn('export')" 
            icon="el-icon-download" 
            >导出</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>
<script type="text/ecmascript-6">
import { getDate } from "@/utils/index";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getVehicleSelectDialog from "@/components/base/formModel/tree/get-vehicle-select-dialog";
export default {
  components: { 
    getVehicleSelectTree,
    getSelectDictionaries,
    getVehicleSelectDialog
  },

  data() {
    return {
      vehTypeData: [],
      form: {
        year_month: '',
        vehicle_ids: [],
        fuel_type: '',
        type_id: '',
        ase: false,
        ele_source: 0
      },
    }
  },
  mounted() {
    this.onSetTime()
    this.onSubmit()
    this.getVehType()
  },
  methods: {
    onSetTime(type = 'thisMonth') {
      let timeObj = getDate(type)
      this.form.year_month = timeObj.startTime.slice(0,7)
    },
    // 获取车辆型号
    getVehType(){
      this.vehTypeData = []
      this.$client.GetCarModelVehicleManager({}).then(req => {
        if (req.head.result === '200') {
          this.vehTypeData = req.context.list
        }
      })
    },
    // 查询
    onSubmit () {
      let info = this.$outFormData(this.form)
      if(this.form.vehicle_ids.length === 0) {
        delete info.vehicle_ids
      }
      info.ase = false
      this.$emit("on-ok", info);
    },
    
    // 重置
    resetForm() {
      Object.assign(this.$data, this.$options.data())
      // this.$refs.vehicleTree.onClear()
      this.getVehType()
      this.onSetTime()
      this.onSubmit()
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 100);
    },

    // 导出Excel
    onBtn(type) {
      this.$emit(`on-btn-${type}`);
    },
  // watch: {
  //   value(val) {
  //     this.form.tyreCountState = val
  //   }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
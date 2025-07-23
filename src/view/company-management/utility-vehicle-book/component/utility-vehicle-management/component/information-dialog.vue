<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    :close-on-click-modal="false"
    width="800px"
    
  >
    <div class="el-dialog-div">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="公车基本信息" name="busInformation">
          <bus-information ref="busInformation"></bus-information>
        </el-tab-pane>
        <el-tab-pane label="车辆档案" name="vehicleArchives">
          <vehicle-archives ref="vehicleArchives"></vehicle-archives>
        </el-tab-pane>
        <el-tab-pane label="借车记录" name="carBorrowingRecord" v-if="curSelecedType != 'add'">
          <car-borrowing-record :bus_id="bus_id"  v-if="activeName == 'carBorrowingRecord' "></car-borrowing-record>
        </el-tab-pane>
        <!-- <el-tab-pane label="预约记录" name="appointmentRecord" v-if="curSelecedType != 'add'">
          <appointment-record :bus_id="bus_id" v-if="activeName == 'appointmentRecord' "></appointment-record>
        </el-tab-pane>
        <el-tab-pane label="车辆保险记录" name="vehicleInsurance" v-if="curSelecedType != 'add'">
          <vehicle-insurance :bus_id="bus_id" :bus_code="bus_code" :disabled_show="disabled" v-if="activeName == 'vehicleInsurance'"></vehicle-insurance>
        </el-tab-pane>
        <el-tab-pane label="车辆保养记录" name="vehicleMaintenance" v-if="curSelecedType != 'add'">
          <vehicle-maintenance ref="vehicleMaintenance" :disabled_show="disabled" :bus_info="info" v-if="activeName == 'vehicleMaintenance' "></vehicle-maintenance>
        </el-tab-pane>
        <el-tab-pane label="车辆年审记录" name="annualVehicleReview" v-if="curSelecedType != 'add'">
          <annual-vehicle-review :disabled_show="disabled" :bus_info="info" v-if="activeName == 'annualVehicleReview' "></annual-vehicle-review>
        </el-tab-pane>
        <el-tab-pane label="车辆维修记录" name="vehicleRepair" v-if="curSelecedType != 'add'">
          <vehicle-repair :disabled_show="disabled" :bus_id="bus_id" :bus_code="bus_code" v-if="activeName == 'vehicleRepair' "></vehicle-repair>
        </el-tab-pane>
        <el-tab-pane label="加油统计" name="refuelingStatistics" v-if="curSelecedType != 'add'">
          <refueling-statistics :disabled_show="disabled" :bus_id="bus_id" :bus_code="bus_code" :last_mile="last_mile" v-if="activeName == 'refuelingStatistics' "></refueling-statistics>
        </el-tab-pane> -->
      </el-tabs>
    </div>
    <span slot="footer" class="dialog-footer" v-if="!disabled">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" size="mini" @click="updatePlaybill('form')">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import busInformation from './bus-info/bus-information'
import vehicleArchives from './bus-info/vehicle-archives'
import carBorrowingRecord from './bus-info/car-borrowing-record'
import appointmentRecord from './bus-info/appointment-record'
import vehicleInsurance from './bus-info/vehicle-insurance'
import vehicleMaintenance from './bus-info/vehicle-maintenance'
import annualVehicleReview from './bus-info/annual-vehicle-review'
import vehicleRepair from './bus-info/vehicle-repair'
import refuelingStatistics from './bus-info/refueling-statistics'
export default {
  components: {
    busInformation,
    vehicleArchives,
    carBorrowingRecord,
    appointmentRecord,
    vehicleInsurance,
    vehicleMaintenance,
    annualVehicleReview,
    vehicleRepair,
    refuelingStatistics
  },
  props: {
    dialogBool: Boolean,
    disabled: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curSelecedType: [String],
  },
  mounted() {
  },
  data() {
    return {
      activeName:'busInformation',
      form: {
        id: 0
      },
      info: {},
      bus_id: '',
      bus_code: '',
      last_mile: ""
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        this.resetData()
      }
    },
  },
  methods: {
    handleClick(tab,event) {
    },
    resetData() {
      setTimeout(() => {
        this.$refs['busInformation'].resetData()  // 公交车信息清除
        this.$refs['vehicleArchives'].resetData()  // 车辆档案清除
      }, 100);
    },
    // 编辑时数据回显
    setData(val){
      this.info = JSON.stringify(val)
      this.form.id = val.id
      this.bus_id = val.id
      this.bus_code = val.code
      this.last_mile = val.last_mile
      setTimeout(() => {
        this.$refs['busInformation'].setData(val)
        this.$refs['vehicleArchives'].setData(val)
      }, 100);
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    updatePlaybill() {
      let p1 = this.$refs.busInformation.outData()
      let p2 = this.$refs.vehicleArchives.outData()
      Promise.all([p1,p2])
        .then(res => {
          if (res[0].form.use_persons == -1) {
            res[0].form.use_person_ids = []
          }
          let params = {
            busInfo: res[0].form,
            vehicle: res[1].form
          }
          Object.assign(this.form,params.busInfo)
          Object.assign(this.form,params.vehicle)

          this.$emit("save-add-edit",this.form)
        }).catch(err => {
          console.log(err);
          if (err.type == 1) {
            this.activeName = "busInformation"
          } else {
            this.activeName = "vehicleArchives"
          }
          this.$message.warning(err.msg)
        })
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div{
}
</style>



<template>
  <div class="vehicle-archives-management">
    <vehicle-archives-management-data-center 
      ref="vehicle" 
      @detail-show="detailShow"
      @on-select="selectVehicle"  
    >
      <template slot="车身部件">
        <body-part ref="bodyPart" :info="vehicleInfo" :key="key"></body-part>
      </template>
      <!-- <template slot="生命周期">
        <life-cycle ref="lifeCycle" :info="vehicleInfo" :key="key"></life-cycle>
      </template> -->
      <template slot="车辆保险记录">
        <car-insurance ref="carInsurance" :info="vehicleInfo" :key="key"></car-insurance>
      </template>
      <template slot="车辆年检记录">
        <car-inspection ref="carInspection" :info="vehicleInfo" :key="key"></car-inspection>
      </template>
      <template slot="车辆维修记录">
        <repair ref="repair" :info="vehicleInfo" :key="key" @on-jump="jumpOrderPage"></repair>
      </template>
      <template slot="车辆保养记录">
        <car-maintenance ref="carMaintenance" :info="vehicleInfo" :key="key"></car-maintenance>
      </template>
      <template slot="三包维修记录">
        <third-services ref="onBoardEquipment2" :info="vehicleInfo" :key="key"></third-services>
      </template>
      <template slot="配件领用记录">
        <material-outbound ref="onBoardEquipment3" :info="vehicleInfo" :key="key"></material-outbound>
      </template>
      <template slot="车辆调动记录">
        <car-mobilization ref="carMobilization" :info="vehicleInfo" :key="key"></car-mobilization>
      </template>
      <template slot="事故记录">
        <accident-records ref="carMobilization" :info="vehicleInfo" :key="key"></accident-records>
      </template>
      <template slot="燃料消耗记录">
        <fuel-consumption ref="fuelConsumption" :info="vehicleInfo" :key="key"></fuel-consumption>
      </template>
      <template slot="里程记录">
        <mileage-records ref="mileageRecords" :info="vehicleInfo" :key="key"></mileage-records>
      </template>
    </vehicle-archives-management-data-center>
    <!-- <el-button class="export-box" @click="onExport">导出</el-button> -->
  </div>
</template>
<script type="text/ecmascript-6">
  import lifeCycle from './data-center-component/life-cycle'
  import bodyPart from './data-center-component/body-part'
  import carInsurance from './data-center-component/car-insurance'
  import carInspection from './data-center-component/car-inspection'
  import repair from './data-center-component/repair'
  import carMaintenance from './data-center-component/car-maintenance'
  import thirdServices from './data-center-component/third-services'
  import materialOutbound from './data-center-component/material-outbound'
  import carMobilization from './data-center-component/car-mobilization'
  import accidentRecords from './data-center-component/accident-records'
  import fuelConsumption from './data-center-component/fuel-consumption'
  import mileageRecords from './data-center-component/mileage-records'
  export default {
    name: "vehicle-archives-management",
    components: {
      lifeCycle,
      bodyPart,
      carInsurance,
      carInspection,
      repair,
      carMaintenance,
      thirdServices,
      materialOutbound,
      carMobilization,
      accidentRecords,
      fuelConsumption,
      mileageRecords
    },
    data() {
      return {
        vehicleInfo: null,
        key: null,
        selectIDs: [],
        names: [
        "车辆基本信息",
        "车辆维修记录",
        "车辆保险记录",
        "车辆年检记录",
        "车辆保养记录",
        "三包维修记录",
        "车辆事故记录",
        "燃料消耗记录",
        ]
      }
    },
    methods:{
      detailShow(info) {
        this.vehicleInfo = info
        this.key = new Date().getTime()
      },
      //  页面跳转   
      jumpOrderPage(info) {
        this.$refs.vehicle.$refs.lookDataDialog.dialogClose()
        this.$nextTick(() => {
          this.$router.push({
            path:'/vehicle-maintenance-management-main/workorder-management',
            query:{
              orderId: info.work_code
            }
          })
        })
      },
      // 列表多选  
      selectVehicle(rows) {
        this.selectIDs = []
        rows.forEach(item => {
          this.selectIDs.push(item.id)
        })
      },
      // 导出车辆档案 
      onExport() {
        if (this.selectIDs.length == 0) {
          this.$message({
            showClose: true,
            message: "请勾选要导出的车辆",
            type: "warning",
          });
          return
        }
        let params = {
          names: this.names,
          ids: this.selectIDs
        }
        this.$client.ExportVehicleInfo(params).then((res) => {
          if (res.head.result == "200") {
            window.location.href = res.context;
            this.$message({ type: "success", message: "导出成功" });
          } else {
            this.$message({ type: "error", message: "导出失败" });
          }
        })
        
      },
    }
  }
</script>
<style lang="scss" scoped>
  .vehicle-archives-management {
    width: 100%;
    height: 100%;
    .export-box{
      position: absolute;
      left: 24px;
      bottom: 30px;
    }
  }
</style>
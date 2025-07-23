<template>
  <el-dialog :visible="dialogBool" :title="title" :before-close="dialogClose" width="860px" >
    <div>
      <el-tabs @tab-click="tabClick" v-model="activeName">
        <el-tab-pane label="基础信息" name="基础信息">
          <car-body>
            <base-info :isEdit="false" ref="BaseInfo"></base-info>
          </car-body>
        </el-tab-pane>
        <el-tab-pane label="车载设备" name="车载设备">
          <car-body>
            <on-board-equipment :isEdit="false" ref="onBoardEquipment"></on-board-equipment>
          </car-body>
        </el-tab-pane>
        <el-tab-pane v-if="dialogBool" label="证件信息" name="证件信息">
          <car-body>
            <certificate-infodeil :isEdit="false" ref="certificateInfo"></certificate-infodeil>
          </car-body>
        </el-tab-pane>
        <el-tab-pane v-else label="证件信息" name="证件信息">
          <car-body>
            <certificate-info ref="certificateInfo"></certificate-info>
          </car-body>
        </el-tab-pane>
        <el-tab-pane v-if="dialogBool" lazy label="车身部件" name="车身部件">
          <car-body>
            <table-data v-bind="tableConfig.engineConfig" ></table-data>
            <table-data v-bind="tableConfig.batteryConfig">
              <template slot="bat_type" slot-scope="scope">
                {{scope.data.bat_type == 1 ? '锂电型' : '离子电池'}}
              </template>
            </table-data>
            <table-data v-bind="tableConfig.tyreConfig">
             <template slot="tyre_mode_brand" slot-scope="scope">
               <span v-if="!!scope.data.tyre_mode.brand">{{scope.data.tyre_mode.brand}}</span>
             </template>
             <template slot="tyre_mode_firm" slot-scope="scope">
               <span v-if="!!scope.data.tyre_mode.firm">{{scope.data.tyre_mode.firm}}</span>
             </template>
             <!-- <template slot="tyre_mode_name" slot-scope="scope">
               {{!!scope.data.tyre_mode.name}}
             </template> -->
            </table-data>
          </car-body>
        </el-tab-pane>
        <el-tab-pane v-if="dialogBool" lazy label="事项提醒" name="事项提醒">
          <car-body></car-body>
        </el-tab-pane>
        <el-tab-pane v-if="dialogBool" label="生命周期" name="生命周期">
          <car-body>
            <life-cycle ref="lifeCycle" ></life-cycle>
          </car-body>
        </el-tab-pane>
        <el-tab-pane v-if="dialogBool" lazy label="车辆保险记录" name="车辆保险记录">
          <car-body>
            <table-data v-bind="tableConfig.vehicleInsurance"></table-data>
          </car-body>
        </el-tab-pane>
        <el-tab-pane v-if="dialogBool" lazy label="车辆年检记录" name="车辆年检记录">
          <car-body>
            <table-data v-bind="tableConfig.vehicleYearlyInspection">
              <template slot-scope="scope" slot="img_path">
                <el-image
                  v-for="(src,i) in scope.data.img_path"
                  :key="`i${i}`"
                  style="width: 100px; height: 100px;float: left;margin-bottom: 10px"
                  :src="src"
                  :preview-src-list="scope.data.img_path"
                  fit="contain"></el-image>
                <div style="width: 100px;" v-if="!scope.data.img_path.length">
                  未上传图片
                </div>
              </template>
            </table-data>
          </car-body>
        </el-tab-pane>
        <el-tab-pane v-if="dialogBool"  label="车辆维修记录" name="车辆维修记录">
          <car-body>
            <repair ref="onBoardEquipment1" ></repair>
          </car-body>
        </el-tab-pane>
        <el-tab-pane v-if="dialogBool" lazy label="车辆保养记录" name="车辆保养记录">
          <car-body>
            <table-data v-bind="tableConfig.vehicleMaintain"></table-data>
          </car-body>
        </el-tab-pane>
        <el-tab-pane v-if="dialogBool"  label="三包维修记录" name="三包维修记录">
          <car-body>
            <third-services ref="onBoardEquipment2" ></third-services>
          </car-body>
        </el-tab-pane>
        <el-tab-pane v-if="dialogBool" label="配件领用记录" name="配件领用记录">
          <car-body>
            <material-outbound ref="onBoardEquipment3" ></material-outbound>
          </car-body>
        </el-tab-pane>
        <el-tab-pane v-if="dialogBool" lazy label="车辆调动记录" name="车辆调动记录">
          <car-body>
            <table-data v-bind="tableConfig.vehicleTransfer"></table-data>
          </car-body>
        </el-tab-pane>
        <el-tab-pane v-if="dialogBool" lazy label="事故记录" name="事故记录">
          <car-body>
            <table-data v-bind="tableConfig.accidentRecord"></table-data>
          </car-body>
        </el-tab-pane>
        <el-tab-pane v-if="dialogBool" lazy label="燃料消耗记录" name="燃料消耗记录">
          <car-body>
            <fuel-consumption ref="fuelConsumption"></fuel-consumption>
          </car-body>
        </el-tab-pane>
        <el-tab-pane v-if="dialogBool" lazy label="里程记录" name="里程记录">
          <car-body>
            <mileage-records ref="mileageRecords"></mileage-records>
          </car-body>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div slot="footer" class="dialog-footer" >
      <el-button @click="dialogClose">关  闭</el-button>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import carBody from './car-body'
import baseInfo from '../veh-info/base-info'
import certificateInfo from '../veh-info/certificate-info'
import certificateInfodeil from '../veh-info/certificate-infodeil'
import onBoardEquipment from '../veh-info/on-board-equipment'
import repair from '../veh-info/repair'
import lifeCycle from '../veh-info/life-cycle'
import ThirdServices from '../veh-info/third-services'
import MaterialOutbound from '../veh-info/material-outbound'
import fuelConsumption from '../veh-info/fuel-consumption'
import mileageRecords from '../veh-info/mileage-records'
import TableData from './table-data'
import TableData1 from './table-data1'
import configData from './config-data'
export default {
  components: {MaterialOutbound,ThirdServices,repair,lifeCycle,TableData1,carBody,baseInfo, certificateInfo, onBoardEquipment, TableData,certificateInfodeil, fuelConsumption, mileageRecords},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeName: '基础信息',
      tableConfig: configData,
      form: {
        id: 0
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }
    },
  },
  methods: {
    // 编辑时数据回显
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 查看时数据回显
    setData(val) {
      this.form.id = val.id
      // 事故条件
      this.tableConfig.accidentRecord.apiForm.i_vehicle_id = [val.id]
      // 发动机条件
      this.tableConfig.engineConfig.apiForm.vehicle_ids = [val.id]
      // 轮胎条件
      this.tableConfig.tyreConfig.apiForm.vehicle_ids = [val.id]
      // 电瓶条件
      this.tableConfig.batteryConfig.apiForm.vehicle_id = val.id
      // 保险条件
      this.tableConfig.vehicleInsurance.apiForm.vehicle_ids = [val.id]
      // 车辆调动条件
      this.tableConfig.vehicleTransfer.apiForm.vehicle_id = val.id
      // 车辆年检条件
      this.tableConfig.vehicleYearlyInspection.apiForm.vehicle_id = val.id

      setTimeout(() => {
        // console.log(this.$refs.onBoardEquipment1)
        this.$refs['BaseInfo'].setData(val)
        this.$refs['onBoardEquipment'].setData(val)
        this.$refs['certificateInfo'].loadData(val.v_num)
        this.$refs['onBoardEquipment1'].setData(val.id)
        this.$refs['onBoardEquipment2'].setData(val.id)
        this.$refs['onBoardEquipment3'].setData(val.id)
        
        this.$refs['lifeCycle'].setData(val)
        // this.$refs['certificateInfo'].getImgDataByVehCode(val.v_num)
      }, 100);
    },
    tabClick(tab) {
      console.log(tab.index)
      if (tab.index == 14) {
        this.$nextTick(() => {
          this.$refs['fuelConsumption'].setData(this.form.id)
        })
      } else if (tab.index == 15) {
        this.$nextTick(() => {
          this.$refs['mileageRecords'].setData(this.form.id)
        })
      }
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>

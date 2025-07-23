<template>
  <el-dialog :visible="dialogBool" :title="title" :before-close="dialogClose" width="860px" >
    <div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="基础信息" name="基础信息">
          <car-body>
            <base-info ref="BaseInfo"></base-info>
          </car-body>
        </el-tab-pane>
        <el-tab-pane label="车载设备" name="车载设备">
          <car-body>
            <on-board-equipment ref="onBoardEquipment"></on-board-equipment>
          </car-body>
        </el-tab-pane>
        <el-tab-pane v-if="dialogBool" label="证件信息" name="证件信息">
          <car-body>
            <certificate-infodeil ref="certificateInfo"></certificate-infodeil>
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
                {{scope.data.tyre_mode.brand}}
              </template>
              <template slot="tyre_mode_firm" slot-scope="scope">
                {{scope.data.tyre_mode.firm}}
              </template>
              <template slot="tyre_mode_name" slot-scope="scope">
                {{scope.data.tyre_mode.name}}
              </template>
            </table-data>
          </car-body>
        </el-tab-pane>
        <el-tab-pane v-if="dialogBool" lazy label="事项提醒" name="事项提醒">
          <car-body></car-body>
        </el-tab-pane>
        <el-tab-pane v-if="dialogBool" lazy label="生命周期" name="生命周期">
          <car-body></car-body>
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
        <el-tab-pane v-if="dialogBool" lazy label="车辆维修记录" name="车辆维修记录">
          <car-body>
            <table-data v-bind="tableConfig.vehicleRepair"></table-data>
          </car-body>
        </el-tab-pane>
        <el-tab-pane v-if="dialogBool" lazy label="车辆保养记录" name="车辆保养记录">
          <car-body>
            <table-data v-bind="tableConfig.vehicleMaintain"></table-data>
          </car-body>
        </el-tab-pane>
        <el-tab-pane v-if="dialogBool" lazy label="车辆调动记录" name="车辆调动记录">
          <car-body>
            <table-data v-bind="tableConfig.vehicleTransfer"></table-data>
          </car-body>
        </el-tab-pane>
        <el-tab-pane v-if="dialogBool" lazy label="燃料消耗记录" name="燃料消耗记录">
          <car-body></car-body>
        </el-tab-pane>
        <el-tab-pane v-if="dialogBool" lazy label="事故记录" name="事故记录">
          <car-body>
            <table-data v-bind="tableConfig.accidentRecord"></table-data>
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
import TableData from './table-data'
import configData from './config-data'
export default {
  components: {carBody,baseInfo, certificateInfo, onBoardEquipment, TableData,certificateInfodeil},
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
        console.log(this.$refs.BaseInfo)
        this.$refs['BaseInfo'].setData(val)
        this.$refs['onBoardEquipment'].setData(val)
        this.$refs['certificateInfo'].loadData(val.v_num)
        // this.$refs['certificateInfo'].getImgDataByVehCode(val.v_num)
      }, 100);
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>

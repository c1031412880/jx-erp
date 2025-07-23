
<template>
  <div style="width: 100%;height: 510px;overflow: auto;">
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
    </table-data>
  </div>
</template>

<script>
import configData from './config-data'
import TableData from './table-data'
export default {
  components: {
    TableData
  },
  props: {
    info: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      tableConfig: configData,
    };
  },
  mounted() {
    this.setData(this.info)
  },
  methods: {
    // 
    setData(val) {
      // 发动机条件
      this.tableConfig.engineConfig.apiForm.vehicle_ids = [val.id]
      // 电瓶条件
      this.tableConfig.batteryConfig.apiForm.vehicle_id = val.id
      // 轮胎条件
      this.tableConfig.tyreConfig.apiForm.vehicle_ids = [val.id]
    },
   
  },
};
</script>
<style lang='scss' scoped>
</style>
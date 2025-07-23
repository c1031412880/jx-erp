
<template>
  <div style="width: 100%;height: 510px;overflow: auto;">
    <table-data v-bind="tableConfig.vehicleYearlyInspection" :TableHeight="TableHeight">
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
      TableHeight: 450
    };
  },
  mounted() {
    this.setData(this.info)
  },
  methods: {
    // 
    setData(val) {
      // 车辆年检条件
      this.tableConfig.vehicleYearlyInspection.apiForm.vehicle_id = val.id
    },
   
  },
};
</script>
<style lang='scss' scoped>
</style>
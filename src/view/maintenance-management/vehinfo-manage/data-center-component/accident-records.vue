
<template>
  <div style="width: 100%;height: 510px;overflow: auto;">
    <table-data v-bind="tableConfig.accidentRecord" :TableHeight="TableHeight"></table-data>
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
      // 事故条件
      this.tableConfig.accidentRecord.apiForm.i_vehicle_id = [val.id]
    },
   
  },
};
</script>
<style lang='scss' scoped>
</style>
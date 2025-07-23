<template>
  <el-dialog
    :visible="dialogBool"
    title="查看明细"
    :before-close="dialogClose"
    width="920px"
    
  >
    <div class="timeBox">日期范围：<span style="color:red">{{startTime + '至' + endTime}}</span></div>
    <el-button @click="onExport" type="primary" icon="el-icon-download" size="small">导出</el-button>
    <el-tabs v-model="activeName" >
      <el-tab-pane label="入库明细" name="first">
        <warehousing-table ref="warehousingTable" :type_id="type_id" :year_month="year_month"></warehousing-table>
      </el-tab-pane>
      <el-tab-pane label="出库明细" name="second" lazy>
        <outbound-table ref="outboundTable" :type_id="type_id" :year_month="year_month"></outbound-table>
      </el-tab-pane>
      <el-tab-pane label="盘点明细" name="third" lazy>
        <inventory-table ref="inventoryTable" :type_id="type_id" :year_month="year_month"></inventory-table>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import warehousingTable from "../table-info/warehousing-table";
import outboundTable from "../table-info/outbound-table";
import inventoryTable from "../table-info/inventory-table";
import {formatTime} from '@/utils/index'
export default {
  components: {
    warehousingTable,
    outboundTable,
    inventoryTable,
  },
  props: {
    dialogBool: Boolean,
    type_id: {
      type: Number,
      default: 0
    },
    year_month: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      activeName: 'first',
      startTime: '',
      endTime: '',
    };
  },
  mounted() {
    let start = ''
    let end = ''
    start = new Date(this.year_month);
    start.setDate(1);
    end = new Date(start)
    end.setMonth(start.getMonth()+1);
    end.setDate(0);
    this.startTime = formatTime(start)
    this.endTime = formatTime(end)
  },
  methods: {
    // 取消
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    onExport(){
      switch (this.activeName) {
        case 'first':
          this.$refs.warehousingTable.exportFile(this.type_id,this.year_month)
          break;
        case 'second':
          this.$refs.outboundTable.exportFile(this.type_id,this.year_month)
          break;
        case 'third':
          this.$refs.inventoryTable.exportTable(this.type_id,this.year_month)
          break;
        default:
          break;
      }
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.timeBox {
  position: absolute;
  top: 11px;
  left: 20%;
  font-size: 18px;
  line-height: 24px;
}
</style>



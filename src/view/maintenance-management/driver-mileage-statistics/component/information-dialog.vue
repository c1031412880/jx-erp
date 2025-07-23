<template>
  <el-dialog :visible="dialogBool" :before-close="dialogClose">
    <div slot="title" class="dialog-title">
      <p>里程明细</p>
      <p>
        <span>驾驶员:</span>
        <span style="color: red">{{ form.driver_name }}</span>
      </p>
      <p>
        <span>日期范围:</span>
        <span style="color: red"
          >{{ form.start_time }}至{{ sliceEndTime(form.end_time) }}</span
        >
      </p>
      <el-button size="mini" type="primary" @click="exportOnlyFile"
        >导出</el-button
      >
    </div>
    <div class="dialog-content">
      <tr-table
        :load="load"
        :data="data"
        :loading="loading"
        :TableHeight="TableHeight"
        :selectionShow="false"
        :tableHeaderList="customSettingList"
      >
      </tr-table>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import {uuid} from '@/utils/index'
export default {
  components: {},
  props: {
    dialogBool: Boolean,
  },
  data() {
    return {
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      customSettingList: [
        {
          id: 1,
          label: "日期",
          prop: "Date",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "驾驶员",
          prop: "DriverName",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "线路",
          prop: "LineName",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "自编号",
          prop: "VehicleGrantCode",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "车牌号",
          prop: "VehicleCode",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "躺次",
          prop: "Count",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "公里数(KM)",
          prop: "AvgMile",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "额外里程(KM)",
          prop: "AdditionMile",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "总里程(KM)",
          prop: "TotalMile",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "总用时(h)",
          prop: "TotalCostTime",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        }
      ]
    }
  },
  watch: {
    dialogBool(bool) {
      if(bool) {
        this.loadData()
      }else {
        this.data = []
      }
    }
  },
  mounted() {},
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    loadData() {
      this.loading = true
      let params = Object.assign({}, this.form);
      params.page_index = 1;
      params.page_size = 1000;
      this.$client.DriverDetailMileSummayVehicleOilRecordSummary(params).then(res => {
        this.loading = false;
        if (res.head.result == "200") {
          let info = JSON.parse(JSON.stringify(res.context.list));
          info.forEach((item, index)=> {
            item.id = index + 'mx'
            item.hasChildren = true
          });
          this.data = info
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      }).catch(err => {
        console.log(err);
          this.$message({
          showClose: true,
          message: err.body.message,
          type: "error",
        });
      });
    },
    exportOnlyFile() {
      let params = Object.assign({}, this.form);
      params.page_index = 1;
      params.page_size = 1000;
      this.$client.DriverMileDetailExportVehicleOilRecordSummary(params).then(res => {
        if (res.head.result == "200") {
          window.location.href = res.context;
          this.$message({ type: "success", message: "导出成功" });
        } else {
          this.$message({ type: "error", message: "导出失败" });
        }
      });
    },
    sliceEndTime(time) {
      let date = ''
      if(time) {
        date = time.slice(0, 10)
      }
      return date
    },
    // 懒加载树节点
    load(tree, treeNode, resolve) {
      let params = Object.assign({}, this.form);
      params.page_index = 1;
      params.page_size = 1000;
      this.$client.DriverDetailMileSummayVehicleOilRecordSummary(params).then(res => {
        if (res.head.result == "200") {
          let info = JSON.parse(JSON.stringify(res.context.list));
          info.forEach((item, index)=> {
            item['id'] = uuid()
            delete item.Date
            delete item.DriverName
            delete item.LineName
            delete item.VehicleCode
            delete item.VehicleGrantCode
          });
          // console.log(info);
          resolve(info)
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      }).catch(err => {
        console.log(err);
          this.$message({
          showClose: true,
          message: err.body.message,
          type: "error",
        });
      });
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.dialog-title {
  width: 80%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>

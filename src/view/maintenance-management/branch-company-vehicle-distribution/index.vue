<template>
  <div class="branch-company-vehicle-distribution">
    <sub-req ref="head" @on-ok="onSubmit" @on-btn-export="exportFile"></sub-req>
    <tr-table
      ref="table"
      :indexShow="true"
      :selectionShow="false"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
      :isShowSummary="true"
      :sumTotal="sumTotal"
      :sumColumnIndex="sumColumnIndex"
    >
    </tr-table>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import common from "@/mixin/exportToExcel";
export default {
  name: "branch-company-vehicle-distribution",
  components: {
    subReq,
  },
  mixins: [common],
  data() {
    return {
      data: [],
      form: {},
      loading: false,
      TableHeight: 500,
      newTableHeader: null,
      companyRange: [],
      canRendererTableHeader: null,
      sumTotal: {},
      sumColumnIndex: [6, 7, 8, 9],
      customSettingList: [
        {
          id: 1,
          label: "登记证书日期",
          align: "center",
          prop: "record_date",
          width: "120",
          signIndex: 0,
        },
        {
          id: 2,
          label: "品牌型号",
          align: "center",
          prop: "vehicle_model",
          width: "190",
          signIndex: 1,
        },
        {
          id: 3,
          label: "车辆类型",
          align: "center",
          prop: "car_type_name",
          width: "120",
          signIndex: 2,
        },
        {
          id: 4,
          label: "燃料类型",
          align: "center",
          prop: "fuel_name",
          width: "120",
          signIndex: 3,
        },
        {
          id: 5,
          label: "排放标准",
          align: "center",
          prop: "effluent_standard",
          width: "120",
          signIndex: 4,
        },

        // {
        //   id: 11,
        //   label: "小计",
        //   align: "center",
        //   prop: "car_count_total",
        //   width: '120',
        //   signIndex: 10,
        // },
      ],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead("initialize");
      window.eventOn.$on("view-resize" + this.$route.fullPath, () => {
        this.setHead();
      });
    });
  },
  methods: {
    onSubmit(form) {
      this.form = form;

      this.loadData();
    },
    // 获取数据
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      console.log("params", params);
      this.$client.GetVehicleMonthDistributionReport(params).then((res) => {
        this.loading = false;
        if (res.head.result == "200") {
          this.loading = false;
          this.companyRange = res.context.list.data_dic_total;
          const car_data_list = res.context.list.data_list.map((item) => {
            const mergedData = {
              all_car_count: item.car_count_total,
              ...item.vehicleMonthDistributionReport,
              ...item.data_dic,
              record_date:
                item.vehicleMonthDistributionReport.record_date.slice(0, 10),
            };
            return mergedData;
          });
          this.setTableHead();
          const keysArray = Object.keys(this.companyRange);
          let lastIndex = 6;
          keysArray.forEach((item, index) => {
            this.sumTotal[index + 6] = this.companyRange[item];
            lastIndex++;
          });
          this.sumTotal[lastIndex] = res.context.list.all_car_count;
          this.data = car_data_list;
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      });
    },
    // 导出Excel
    exportFile() {
      let table_dom = this.$refs["table"].$refs.table.$el;
      this.exportToExcel(table_dom, "分公司车辆每月分布情况表");
    },
    setTableHead() {
      this.newTableHeader = JSON.parse(JSON.stringify(this.customSettingList));
      const keysArray = Object.keys(this.companyRange);
      let lastIndex = 0;
      this.sumColumnIndex = [];
      keysArray.forEach((item, index) => {
        this.sumColumnIndex.push(index + 6);
        this.newTableHeader.push({
          id: index + 6,
          label: keysArray[index],
          prop: keysArray[index],
          width: "130",
          align: "center",
          signIndex: index + 5,
          sortable: false,
        });
        lastIndex = index + 7;
      });
      this.newTableHeader.push({
        id: lastIndex,
        label: "小计",
        prop: "all_car_count",
        width: "130",
        align: "center",
        signIndex: 10,
        sortable: false,
      });
      this.sumColumnIndex.push(lastIndex);
      this.updateTableHeader(this.newTableHeader);
    },
    updateTableHeader(newestTableHeaderList) {
      this.canRendererTableHeader = null;
      this.canRendererTableHeader = newestTableHeaderList;
      this.$forceUpdate();
    },
    // 计算表格高度
    setHead() {
      this.canRendererTableHeader = this.newTableHeader;
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        this.TableHeight = maxh - th;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.branch-company-vehicle-distribution {
  height: 100%;
  width: 100%;
}
</style>

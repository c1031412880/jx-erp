<template>
  <div class="vehicle-gas-entry">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-import="openImportPage"
      @on-export="exportExcel"
      paneType="details">
    </sub-req>

    <tr-table
      :selectionShow="false"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      :isShowSummary="true"
      :omitColumnIndex="[1, 2, 3]">
    </tr-table>
    <el-pagination
      style="margin: 5px 0; display: flex; justify-content: flex-end"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      ref="paginationH"
      :current-page="pageInfo.pageIndex"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageInfo.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageInfo.pageCount">
    </el-pagination>
    <file-dialog
      :dialogBool.sync="filedialogVisible"
      :fileData="FileData"
      :typeMessage="'相同车牌号的车'"
      @on-submit-excel="onSubmitExcel">
    </file-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
import { formatTime, getDistanceDays } from "@/utils/index";
import fileDialog from "@/components/fileDialog/file-dialog.vue";
import subReq from "./sub-req";
export default {
  name: "vehicle-gas-entry",
  components: {
    subReq,
    fileDialog
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      days: "",
      form: {},
      data: [],
      loading: false,
      TableHeight: 400,
      customSettingList: [
        {
          id: 1,
          label: "自编号",
          prop: "vehicle_number",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "车牌号",
          prop: "lincense_plate_number",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "线路",
          prop: "line_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
      ],
      frontFixedNum: 3, //前几行固定
      backFixedNum: 2, //后几行固定
      canRendererTableHeader: null,
      daysTableHeader: null,
      FileData: {
        url:
          window.newHttpConfig.URL_EASYMOCK +
          "/Files/TempFiles/车辆气耗明细模板.xlsx",
      },
      filedialogVisible: false,
      dateRange: [],
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
    //根据选择日期计算出所有天数
    countDays() {
      let startDate = this.form.date_start.slice(0, 10),
        endDate = this.form.date_end.slice(0, 10);
      this.days = getDistanceDays(startDate, endDate);
      this.dateRange = [];
      if (this.days) {
        let arr = startDate.split("-");
        let num = 0;
        let date = "";
        for (let k = 0; k < this.days + 1; k++) {
          num = Number(arr[2]) + k;
          date = formatTime(new Date(arr[0], arr[1] - 1, num));
          this.dateRange.push(date);
        }
      } else {
        this.form.hour =
          (new Date(this.form.end_time).getTime() -
            new Date(this.form.start_time).getTime()) /
          1000 /
          3600;
      }
    },
    //创建日期表头
    setTableHead() {
      this.daysTableHeader = JSON.parse(JSON.stringify(this.customSettingList));
      let lastIndex = 0 //用于末尾插入总和列
      for (let i = 0; i < this.dateRange.length; i++) {
        this.daysTableHeader.push({
          id: i + 4,
          label: this.dateRange[i],
          prop: this.dateRange[i],
          width: "130",
          align: "center",
          signIndex: i + 3,
          sortable: false,
        });
        lastIndex = i + 4
      }
      this.daysTableHeader.push({
          id: lastIndex + 1,
          label: "合计（公斤）",
          prop: "total",
          width: "130",
          align: "center",
          signIndex: lastIndex,
          sortable: false,
        },
        {
          id: lastIndex + 2,
          label: "含税金额",
          prop: "amount_total",
          width: "130",
          align: "center",
          signIndex: lastIndex + 1,
          sortable: false,
        })
      this.updateTableHeader(this.daysTableHeader);
    },
    updateTableHeader(newestTableHeaderList) {
      this.canRendererTableHeader = null;
      this.canRendererTableHeader = newestTableHeaderList;
      this.$forceUpdate();
    },
    // 打开导入弹窗
    openImportPage() {
      this.filedialogVisible = true;
    },
    // 导入
    onSubmitExcel(exportInfo) {
      let formData = new FormData();
      formData.append("file", exportInfo.file);
      formData.append("type", exportInfo.radio);
      let params = formData;
      this.$client.ImportVehicleGasDetail(params).then((res) => {
        if (res.head.result == "200") {
          this.loadData();
          this.filedialogVisible = false;
          this.$message({ message: res.head.describle, type: "success" });
        } else {
          this.filedialogVisible = false;
          let errorData = [];
          const h = this.$createElement;
          errorData.push(h("p", null, res.head.describle));
          this.$msgbox({
            title: "提示",
            message: h("div", null, errorData),
            confirmButtonText: "确定",
          });
        }
      });
    },
    // 导出Excel 文件
    exportExcel() {
      let params = {
        context: {},
      };
      params.context = Object.assign({}, this.form);
      this.$client.ExportVehicleGasDetail(params).then((res) => {
        if (res.head.result == "200") {
          window.location.href = res.context;
          this.$message({ type: "success", message: "导出成功" });
        } else {
          this.$message({ type: "error", message: "导出失败" });
        }
      });
    },
    onSubmit(form) {
      this.form = form;
      this.countDays();
      this.setTableHead();
      this.form.vehicle_ids = form.vehicle_ids.join();
      this.form.line_ids = form.line_ids.join();
      this.form.created_ids = form.created_ids.join();
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client
        .GetVehicleGasDetailList(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.loading = false;
            //提取list的数据，将date_value_dic的数据组装到list的每一项中得到新的data
            this.data = res.context.list.map((item) => {
              const extracted = Object.entries(item.date_value_dic).reduce(
                (acc, [date, value], index) => {
                  const key = date.substring(0, 10);
                  acc[key] = value;
                  return acc;
                },
                {}
              );
              return { ...item, ...extracted };
            });
            console.log(this.data);
            this.pageInfo.pageCount = res.context.total;
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        });
    },


    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx;
      this.loadData();
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },

    // 计算表格高度 和初始化表头
    setHead(type) {
      if (type == "initialize") {
        this.canRendererTableHeader = this.daysTableHeader;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        this.TableHeight = maxh - th - 35;
      }, 60);
    },
  },
};
</script>
  
  <style lang="stylus" rel="stylesheet/stylus" scoped>
  .vehicle-gas-entry {
    width: 100%;
    height: 100%;
  }
</style>
  
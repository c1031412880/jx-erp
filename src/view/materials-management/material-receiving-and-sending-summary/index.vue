<template>
  <div class="material-receiving-and-sending-summary">
    <sub-req
      ref="head"
      @on-export="onExport"
      @on-ok="onSubmit"
    ></sub-req>
    <tr-table
      :selectionShow="false"
      :data="data"
      :isShowSummary="false"
      :tableHeaderList="customSettingList"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      :omitColumnIndex='[1,2,3,4,5,7,8,9,10,11]'
    >
    </tr-table>

    <el-pagination
      style="margin: 5px 0;display:flex; justify-content: flex-end;"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      ref="paginationH"
      :current-page="pageInfo.pageIndex"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageInfo.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageInfo.pageCount">
    </el-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
export default {
  name: "material-receiving-and-sending-summary",
  components: {
    subReq,
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      customSettingList: [
        {
          id: 1,
          label: "物料长代码",
          prop: "material_code",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "物料条形码",
          prop: "material_barcode",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "物料名称",
          prop: "material_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "规格型号",
          prop: "specification",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "批次",
          prop: "batch_no",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "期初结存数量(常用)",
          prop: "beginning_inventory_quantity",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "本期收入单位(常用)",
          prop: "current_income_unit_name",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "本期收入单价(常用)",
          prop: "current_income_unit_price",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        {
          id: 9,
          label: "本期收入数量(常用)",
          prop: "current_income_quantity",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: true,
        },
        {
          id: 10,
          label: "本期发出数量(常用)",
          prop: "current_outgoing_quantity",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: true,
        },
        {
          id: 11,
          label: "期末结存数量(常用)",
          prop: "finishing_inventory_quantity",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: true,
        },
        {
          id: 12,
          label: "本期结存金额",
          prop: "finishing_inventory_amount",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: true,
        },
      ],
      frontFixedNum: 2, //前几行固定
      backFixedNum: 0, //后几行固定
      canRendererTableHeader: null,
    };
  },
  mounted() {
    // this.loadData();
    this.$nextTick(() => {
      this.setHead();
    });
  },
  methods: {
    // 查询
    onSubmit(form) {
      this.form = form
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
      this.$client.GetMaterialReceiveList(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list;
            this.pageInfo.pageCount = res.context.total
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    // 导出
    onExport() {
      let params = Object.assign({}, this.form);
      this.$client.ExportMaterialReceiveLis(params).then((res) => {
        if(res.head) {
          if (res.head.result == "200") {
            window.location.href = res.context;
            this.$message({ type: "success", message: "导出成功" });
          } else {
            this.$message({ type: "error", message: "导出失败" });
          }
        }else{
          this.$message({ type: "warning", message: "暂无可导出内容" });
        }
        
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
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        this.TableHeight = maxh - th - 30;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.material-receiving-and-sending-summary {
  width: 100%;
  height: 100%;
}
</style>

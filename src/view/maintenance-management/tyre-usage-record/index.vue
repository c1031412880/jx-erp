<template>
  <div class="tyre-usage-record">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-btn-export="exportFile"
    ></sub-req>

    <tr-table
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
      @on-select-change-row="selectedList"
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
      :total="pageInfo.pageCount"
    >
    </el-pagination>

  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
export default {
  name: "tyre-usage-record",
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
      selectedIds:[], //勾选的ID
      loading: false,
      TableHeight: 500,
      customSettingList: [
        {
          id: 1,
          label: "轮胎编号",
          prop: "tyre_code",
          width: "130",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "轮胎型号",
          prop: "tyre_model_name",
          width: "130",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "轮胎品牌",
          prop: "tyre_model_brand",
          width: "130",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "自编号",
          prop: "vehicle_number",
          width: "130",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "车牌号",
          prop: "vehicle_code",
          width: "130",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "安装日期",
          prop: "install_date",
          width: "130",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "安装位置",
          prop: "position_name",
          width: "130",
          align: "center",
          signIndex: 6,
        },
        {
          id: 8,
          label: "拆卸日期",
          prop: "dismantle_date",
          width: "130",
          align: "center",
          signIndex: 7,
        },
        {
          id: 9,
          label: "拆卸原因",
          prop: "dismantle_reason",
          width: "130",
          align: "center",
          signIndex: 8,
        },
        {
          id: 10,
          label: "随车里程(KM)",
          prop: "mileage",
          width: "130",
          align: "center",
          signIndex: 9,
        },
        {
          id: 11,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 10,
        }
      ],
      canRendererTableHeader: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.head.onSubmit()
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {

    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.getTyreVehicleByPageTyreManage(params)
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

    // 查询
    onSubmit(form) {
      this.form = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      // console.log(this.form);
      this.loadData();
    },

    // 提交
    restTableList() {
      this.form = {};
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },

    // 勾选中的
    selectedList(list) {
      this.selectedIds = [];
      if(list && list.length > 0) {
        list.forEach((item,index) => {
          this.selectedIds.push(item.id)
        });
      }
    },

    // 导出Excel
    exportFile(){
      let params = Object.assign({}, this.form);
      let ids = [ ...this.selectedIds ]
      if (ids.length) {
        params.ids = ids
      }
      this.$client.ExportTyreRecord(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })
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
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.tyre-usage-record {
  width: 100%;
  height: 100%;
}
</style>

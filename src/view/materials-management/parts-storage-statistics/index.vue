<template>
  <div class="parts-storage-statistics">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-btn-export="exportFile"
      @open-setting-page="openSettingPageEvent"
    ></sub-req>
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
      :sumTotal="sumTotal"
      :sumColumnIndex="[6, 7, 8]"
    >
      <template slot-scope="scope" slot="enter_num">
        <el-button type="text" @click="openServerInfo(scope.data)">
          {{ scope.data.enter_num }}
        </el-button>
      </template>
    </tr-table>
    <el-pagination
      style="margin: 5px 0; display: flex; justify-content: flex-end"
      ref="paginationH"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :current-page="pageInfo.pageIndex"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageInfo.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageInfo.pageCount"
    ></el-pagination>
    <custom-setting
      :dialogBool.sync="customSettingVialogVisible"
      :customSettingList="customSettingList"
      :canRendererTableHeader="canRendererTableHeader"
      :customSettingShowList="customSettingShowList"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    ></custom-setting>
    <el-dialog :visible="warehouseLeaveShow" fullscreen :before-close="handleClose">
      <warehouse-leave ref="warehouseLeave"></warehouse-leave>
      <span slot="footer" class="dialog-footer">
        <el-button @click="warehouseLeaveShow = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import warehouseLeave from "./component/warehouse-leave";
export default {
  name: 'parts-storage-statistics',
  components: {
    subReq,
    warehouseLeave
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
      frontFixedNum: 0, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      customSettingVialogVisible: false,
      sumTotal:{ //约定某一列汇总合计自定义数据
        6:'',
        7: '',
        8: ''
      },
      warehouseLeaveShow:false,
      customSettingList: [
        {
          id: 1,
          label: "入库日期",
          prop: "enter_date",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "配件名称",
          prop: "material_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "配件编码",
          prop: "material_code",
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
          label: "单位",
          prop: "measure_unit_name",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "数量",
          prop: "count",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "单价(元)",
          prop: "price",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "金额(元)",
          prop: "total_price",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "供应商",
          prop: "provider_name",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "入库单号",
          prop: "enter_num",
          width: "180",
          align: "center",
          signIndex: 9,
          sortable: false,
        }
      ],
    }
  },
  created() {
    this.menu_code = this.$route.meta.code
    this.reqTitleTable()
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    updateTableHeader(newestTableHeaderList) {
      this.$httpTableHeader.saveTableHeader(this.titlesId,this.menu_code,newestTableHeaderList).then(res => {

        this.reqTitleTable()
      }).catch(err => {

      })
    },
    // 获取表头
    reqTitleTable() {
      this.$httpTableHeader.reqTableHeader(this.menu_code,this.customSettingList).then(res => {
        this.titlesId = res.titlesId;
        this.canRendererTableHeader = res.canRendererTableHeader;
        this.customSettingList = res.customSettingList;
        this.customSettingShowList = res.customSettingShowList;
        this.$forceUpdate();
      }).catch(err => {})
    },
    onSubmit(form) {
      this.form = Object.assign({}, form);
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.GetDataRepairEnterParts(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list;
            this.pageInfo.pageCount = res.context.total
            this.sumTotal = {
              6 : res.context.total_count,
              7 : res.context.total_price,
              8 : res.context.total_money
            }
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
    // 导出Excel
    exportFile() {
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.ExportRepairEnterPartsLiShui(params).then((res) => {
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
    //关闭弹窗
    handleClose() {
      this.warehouseLeaveShow=false
    },
     // 打开工单详情
    openServerInfo(data) {
      this.warehouseLeaveShow = true
      setTimeout(() => {
        this.$refs.warehouseLeave.getdataTable(data.enter_num)
      }, 60);
    },
    // 打开表头设置
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let ph = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - ph;
        // console.log(maxh);
      }, 60);
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.parts-storage-statistics {
  height: 100%
  width: 100%
}
</style>

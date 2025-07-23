<template>
  <div class="spare-parts-delivery-detail">
    <sub-req
      ref="head"
      @on-export="onExport"
      @on-ok="onSubmit"
    ></sub-req>
    <tr-table
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      @on-select-change-row="selectedUpkeepPlanList"
      :isShowSummary="true"
      :sumTotal="sumTotal"
      :sumColumnIndex="[6,8,9]"
    >
      <template slot-scope="scope" slot="leave_num">
        <span style="color:#409EFF;cursor: pointer;" @click="openServerInfo(scope.data.leave_num)">{{scope.data.leave_num}}</span>
      </template>
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


    <custom-setting
      :dialogBool.sync="customSettingVialogVisible"
      :customSettingList="customSettingList"
      :canRendererTableHeader="canRendererTableHeader"
      :customSettingShowList="customSettingShowList"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    ></custom-setting>

     <el-dialog
      :visible="warehouseLeaveShow"
      fullscreen
      :before-close="handleClose"
      >
        <warehouse-leave
        ref="warehouseLeave"
        ></warehouse-leave>
        <span slot="footer" class="dialog-footer">
          <el-button @click="warehouseLeaveShow = false">取 消</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import warehouseLeave from "../warehouse-management/component/warehouse-leave.vue";
export default {
  name: "spare-parts-delivery-detail",
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
      customSettingVialogVisible: false,
      curSelecedType: "",
      informationDialogTitle: "添加",
      drawerdialogVisible: false,
      customSettingList: [
        {
          id: 1,
          label: "日期",
          prop: "leave_date",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "配件名称",
          prop: "material_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "配件编码",
          prop: "material_code",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
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
          sortable: false,
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
          label: "领料类型",
          prop: "pick_type_name",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "单价",
          prop: "price",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "金额",
          prop: "total_price",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "自编号",
          prop: "v_num",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "车牌号",
          prop: "lp_num",
          width: "140",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "所属组织",
          prop: "dept_name",
          width: "140",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "线路",
          prop: "line_name",
          width: "140",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "出库单号",
          prop: "leave_num",
          width: "160",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
      ],
      frontFixedNum: 0, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      filedialogVisible: false,
      selectedIds:[],
      warehouseLeaveShow: false,
      sumTotal:{ //约定某一列汇总合计自定义数据
        6:'',
        8: '',
        9: ''
      },
    };
  },
  mounted() {
    // this.loadData();
    this.$nextTick(() => {
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
          this.setHead()
        })
    });
    
  },
  methods: {
    updateTableHeader(newestTableHeaderList) {
      this.canRendererTableHeader = null;
      this.customSettingShowList = null;
      this.customSettingShowList = newestTableHeaderList;
      this.canRendererTableHeader = newestTableHeaderList.filter(item => item.isSelected).map((sing,index) => {
        let obj = {
          id: index +1,
          label: sing.label,
          prop: sing.prop,
          width: sing.width,
          align: sing.align,
          signIndex: index,
          sortable: sing.sortable,
        }
        return obj
      });
      this.$forceUpdate();
    },
    // 导出
    onExport() {
      let params = Object.assign({}, this.form);
      if (this.selectedIds.length) {
        params.ids = this.selectedIds.toString()
      }
      this.$client.ExportRepairParts(params).then(res => {
        if (res.head.result == "200") {
          window.location.href = res.context;
          this.$message({ type: "success", message: "导出成功" });
        } else {
          this.$message({ type: "error", message: "导出失败" });
        }
      });
    },

    onSubmit(form) {
      this.form = form
      console.log(this.form);
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
      this.$client.GetDataRepairParts(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list;
            this.pageInfo.pageCount = res.context.total
            this.sumTotal = {
              6 : res.context.total_count,
              8 : res.context.total_price,
              9 : res.context.total_money
            }
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

    selectedUpkeepPlanList(list) {
      this.selectedIds = [];
      list.forEach((item,index) => {
        this.selectedIds.push(item.i_id)
      });
      console.log(JSON.stringify(this.selectedIds))
    },
    
    // 打开工单详情
    openServerInfo(info) {
      let params = {
        leave_num: info.leave_num
      }
      this.$client.getByPageLeaveHouse(params)
        .then(res => {
          if (res.head.result == "200") {
            let dataList = res.context.list
            if(dataList.length>0) {
              this.warehouseLeaveShow = true
              setTimeout(() => {
                this.$refs.warehouseLeave.getdataTable(dataList[0].id)
              }, 60);
            }
          } else {
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
    // 计算表格高度 和初始化表头
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
        this.customSettingShowList = this.customSettingList;
      }
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
.spare-parts-delivery-detail {
  width: 100%;
  height: 100%;
}
</style>

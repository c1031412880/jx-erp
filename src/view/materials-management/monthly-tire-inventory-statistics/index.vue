<template>
  <div class="stock-lunar-knot-manage">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-export="exportFile" 
      @on-add="addTire"
      @on-out="outTire"
      @on-inventory="inventoryTire"
      @on-detail="showDetail"
    ></sub-req>
    <tr-table
      ref="table"
      :data="data"
      :tableHeaderList="customSettingList"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      :isShowSummary="true"
      :sumColumnIndex="[5,6,7,8,9,10,11,12,13,14]"
      :sumTotal="sumTotal"
    >
      <template slot-scope="scope" slot="operation">
        <el-button type="primary" size="mini" @click="showDetail(scope.data)">明细</el-button>
      </template>
    </tr-table>
    
    <el-pagination
      style="margin: 15px 0; display: flex; justify-content: flex-end"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      ref="paginationH"
      :current-page="pageInfo.pageIndex"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="pageInfo.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageInfo.pageCount"
    >
    </el-pagination>

    <!-- 入库 -->
    <information-add-dialog
      ref="informationAddDialog"
      :dialogBool.sync="informationAddShow"
      :curSelecedType="'add'"
      :title="'入库单'"
      :tireID="tireID"
    ></information-add-dialog>
    <!-- 出库 -->
    <information-out-dialog
      ref="informationOutDialog"
      :dialogBool.sync="informationOutShow"
      :curSelecedType="'add'"
      :again="true"
      :tireID="tireID"
      :title="'出库单'"
    ></information-out-dialog>
    <add-info-dialog 
      v-if="AddInfoDialogShow"
      :dialogBool.sync="AddInfoDialogShow" 
      ref="AddInfoDialog" 
      :tireID="tireID"
      @on-ok="AddInfoDialogOk"
    ></add-info-dialog>

    <detail-dialog
      :dialogBool.sync="detailDialogShow"
      :type_id="type_id"
      :year_month="form.year_month"
      v-if="detailDialogShow"
    ></detail-dialog>

  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import detailDialog from "./component/detail-dialog";
import informationAddDialog from "@/view/materials-management/stock-management-step/component/information-dialog2";
import informationOutDialog from "@/view/materials-management/warehouse-management-step/component/information-dialog2";
import AddInfoDialog from "@/view/materials-management/inventory-manage/component/add-info-dialog";

export default {
  name: "stock-lunar-knot-manage",
  components: {
    subReq,
    informationAddDialog,
    informationOutDialog,
    AddInfoDialog,
    detailDialog
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      form: {
        year_month: ''
      },
      data:[],
      loading: false,
      TableHeight: 300,
      customSettingList: [
        {
          id: 1,
          label: "型号",
          prop: "model",
          width: "120",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "轮胎名称及类别",
          prop: "name_type",
          width: "200",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "单位",
          prop: "unit_name",
          width: "130",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "单价",
          prop: "price",
          width: "120",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "上月库存",
          prop: "last_count",
          width: "130",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "上月库存金额",
          prop: "last_fee",
          width: "140",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "入库数",
          prop: "enter_count",
          width: "120",
          align: "center",
          signIndex: 6,
        },
        {
          id: 8,
          label: "入库金额",
          prop: "enter_fee",
          width: "140",
          align: "center",
          signIndex: 7,
        },
         {
          id: 9,
          label: "出库数",
          prop: "out_count",
          width: "140",
          align: "center",
          signIndex: 8,
        },
         {
          id: 10,
          label: "出库金额",
          prop: "out_fee",
          width: "140",
          align: "center",
          signIndex: 9,
        },
        {
          id: 11,
          label: "盘点",
          prop: "check_result",
          width: "135",
          align: "center",
          signIndex: 10,
        },
        {
          id: 12,
          label: "盘点金额",
          prop: "check_fee",
          width: "140",
          align: "center",
          signIndex: 11,
        },
        {
          id: 13,
          label: "现库存",
          prop: "actual_count",
          width: "135",
          align: "center",
          signIndex: 12,
        },
        {
          id: 14,
          label: "现库存金额",
          prop: "actual_fee",
          width: "140",
          align: "center",
          signIndex: 13,
        },
        {
          id: 15,
          label: "操作",
          prop: "operation",
          width: "140",
          align: "center",
          signIndex: 14,
        },
      ],
      frontFixedNum: 2, //前几行固定
      backFixedNum: 1, //后几行固定

      informationAddShow: false,
      informationOutShow: false,
      AddInfoDialogShow: false,
      detailDialogShow: false,

      tireID: null,

      sumTotal: {
        5: '',
        6: '',
        7: '',
        8: '',
        9: '',
        10: '',
        11: '',
        12: '',
        13: '',
        14: '',
      },
      type_id: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead();
    });
    this.GetMaterialGroup()
  },
  methods: {
    // 盘点录入
    AddInfoDialogOk(form) {
      this.$client.CreateOrUpdateWarehouseCheck({
        context: form
      }).then(req => {
        if (req.head.result === '200') {
          this.$message({message: req.head.describle, type: 'success'});
          this.AddInfoDialogShow = false
        } else {
          this.$message({message: req.head.describle, type: 'error'});
        }
      })
    },
    // 获取 分类为轮胎的 id
    GetMaterialGroup(){
      // 轮胎分类的code 
      let code = 'tire-key'
      this.$client.GetMaterialGroup({code})
      .then(res => {
        if (res.head.result == "200") {
          this.tireID = res.context[0].children[0].id
        } 
      })
    },
    // 查询
    onSubmit(form){
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
      this.$client.GetByPageTireMonthStatistic(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list;
            this.pageInfo.pageCount = res.context.total
            this.sumTotal = {
              5: res.context.summary['last_count'],
              6: res.context.summary['last_fee'],
              7: res.context.summary['enter_count'],
              8: res.context.summary['enter_fee'],
              9: res.context.summary['out_count'],
              10: res.context.summary['out_fee'],
              11: res.context.summary['check_result'],
              12: res.context.summary['check_fee'],
              13: res.context.summary['actual_count'],
              14: res.context.summary['actual_fee'],
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
    // 导出
    exportFile(){
      let params = {
        type_name : this.form.type_name,
        year_month : this.form.year_month,
      }
      this.$client.ExportTireMonthStatistic(params).then(req => {
        if (req.head.result === '200') {
          window.open(req.context)
          this.$message({message: req.head.describle, type: 'success'});
        } else {
          this.$message({message: req.head.describle, type: 'error'});
        }
      })
    },
    // 入库
    addTire(){
      this.informationAddShow = true;
    },
    // 出库
    outTire(){
      this.informationOutShow = true;
    },
    // 盘点
    inventoryTire(){
      this.AddInfoDialogShow = true
      this.$nextTick(()=> {
        this.$refs.AddInfoDialog.getMaterial()
      })
    },
    // 明细
    showDetail(row){
      this.type_id = row ? row.type_id : 0
      this.$nextTick(() => {
        this.detailDialogShow = true
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
      this.loadData();
    },
    // 计算表格高度
    setHead(type) {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - (th + paginationH + 20)
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.stock-lunar-knot-manage {
  width: 100%;
  height: 100%;
}
</style>

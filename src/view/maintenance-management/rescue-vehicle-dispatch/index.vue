<template>
  <div class="rescue-vehicle-dispatch">
    <sub-req
      ref="head"
      :isRelevance="isRelevance"
      @on-ok="onSubmit"
      @on-export="exportFile"
      @on-add="fixedFormBodyShow = true"
    ></sub-req>
    <tr-table
      :data="data"
      :loading="loading"
      :TableHeight="TableHeight"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      :tableHeaderList="canRendererTableHeader"
      @on-select-row="selectedList">
      <template v-if="!isRelevance" slot-scope="scope" slot="operation">
        <el-button type="text" size="mini"  @click="checkDetail(scope.data)">详情</el-button>
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
      :total="pageInfo.pageCount">
    </el-pagination>
    <custom-setting
      :dialogBool.sync="customSettingVialogVisible"
      :customSettingList="customSettingList"
      :canRendererTableHeader="canRendererTableHeader"
      :customSettingShowList="customSettingShowList"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    ></custom-setting>

    <fixed-form-body :formId="1650" :dialogBool.sync="fixedFormBodyShow" @on-refresh="loadData"></fixed-form-body>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import fixedFormBody from "@/view/main-Interface-entrance/launch-affair/component/all-box/fixed-form-body";
export default {
  name: 'rescue-vehicle-dispatch',
  components: {
    subReq,
    fixedFormBody
  },
  props: {
    isRelevance:{
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      info: {},
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      customSettingList: [
        {
          id: 1,
          label: "审批单编号",
          prop: "flow_code",
          width: "150",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "审批状态",
          prop: "state_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "出车人",
          prop: "user_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "出车时间",
          prop: "request_date",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "到厂时间",
          prop: "arrived_time",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "施救费用（元）",
          prop: "rescue_amount",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "支付方式",
          prop: "pay_type_show",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "施救车型",
          prop: "rescue_vehicle_type_show",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "施救地点",
          prop: "rescue_position",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "操作",
          prop: "operation",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
      ],
      noCustomSettingList: [
        {
          id: 1,
          label: "审批单编号",
          prop: "flow_code",
          width: "150",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "审批状态",
          prop: "state_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "出车人",
          prop: "user_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "出车时间",
          prop: "request_date",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "到厂时间",
          prop: "arrived_time",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "施救费用（元）",
          prop: "rescue_amount",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "支付方式",
          prop: "pay_type_show",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "施救车型",
          prop: "rescue_vehicle_type_show",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "施救地点",
          prop: "rescue_position",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        // {
        //   id: 11,
        //   label: "操作",
        //   prop: "operation",
        //   width: "130",
        //   align: "center",
        //   signIndex: 10,
        //   sortable: false,
        // },
      ],
      frontFixedNum: 2, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      customSettingVialogVisible: false,
      fixedFormBodyShow: false,
    }
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
    // 打开自定义表格头部弹窗
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
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
    onSubmit(form) {
      this.form = form
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.GetPageListRescueVehicle(params)
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
    // 查看
    checkDetail(row) {
      let detail_id = 1650, title = '施救车派工单'
      this.$router.push({
        path: `/news-details/${row.id}/${title}/${detail_id}`
      })
    },
    // 导出Excel
    exportFile(){
      let params = {context: {}} 
      params.context = Object.assign({},this.form);
      this.$client.ExportRescueVehicle(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })
    },
    // 选中行
    selectedList(row) {
      this.info = row
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx
      this.loadData()
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
        this.canRendererTableHeader = !this.isRelevance ? this.customSettingList : this.noCustomSettingList;
        this.customSettingShowList = !this.isRelevance ? this.customSettingList : this.noCustomSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH;
      }, 60);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.rescue-vehicle-dispatch
  height: 100%
  width: 100%
</style>
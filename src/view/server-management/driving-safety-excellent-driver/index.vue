<template>
  <div class="driving-safety-excellent-driver">
    <sub-req 
      ref="head" 
      @on-ok="onSubmit"
      @on-add="fixedFormBodyShow = true"></sub-req>
    <tr-table
      :data="data"
      :loading="loading"
      :indexShow="true"
      :backFixedNum="1"
      :frontFixedNum="2"
      :selectionShow="false"
      :TableHeight="TableHeight"
      :isShowBottomOptions="false"
      :tableHeaderList="customSettingList">
      <template slot-scope="scope" slot="status">
        <span :style="{ color: getApprovalStateColor(scope.data.status).color }">{{getApprovalStateColor(scope.data.status).name}}</span>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button @click="openApplyDetail(scope.data)" type="text" size="mini">查看</el-button>
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

    <fixed-form-body :dialogBool.sync="fixedFormBodyShow" @on-refresh="loadData" :formId="8700" :formName="'行车安全优秀驾驶员审批表'"></fixed-form-body>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import statusUtils from '@/mixin/statusUtils.js'
import fixedFormBody from "@/view/main-Interface-entrance/launch-affair/component/all-box/fixed-form-body";
export default {
  name: "driving-safety-excellent-driver",
  components: {
    subReq,
    fixedFormBody
  },
  mixins: [statusUtils],
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      data: [],
      form: {},
      loading: false,
      TableHeight: 500,
      fixedFormBodyShow: false,
      customSettingList: [
        {
          id: 1,
          label: "驾驶员",
          prop: "driver_name",
          width: "120",
          align: "center",
          signIndex: 0,
          sortable:false
        },
        {
          id: 2,
          label: "准驾车型",
          prop: "driving_license_class",
          width: "130",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "营运线路",
          prop: "line_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable:false
        },
        
        {
          id: 4,
          label: "车辆",
          prop: "vehicle_name",
          width: "120",
          align: "center",
          signIndex: 3,
          sortable:false
        },
        {
          id: 5,
          label: "驾驶证号",
          prop: "driver_license_number",
          width: "180",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "累计安全公里数",
          prop: "total_safe_km",
          width: "180",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "评比年度",
          prop: "assessment_year",
          width: "120",
          align: "center",
          signIndex: 6,
        },
        {
          id: 8,
          label: "驾驶简历",
          prop: "resume",
          width: "120",
          align: "center",
          signIndex: 7,
        },
        {
          id: 9,
          label: "经办人",
          prop: "created_name",
          width: "120",
          align: "center",
          signIndex: 8,
        },
        {
          id: 10,
          label: "经办人部门",
          prop: "dept_name",
          width: "120",
          align: "center",
          signIndex: 9,
        },
        {
          id: 11,
          label: "审批状态",
          prop: "status",
          width: "120",
          align: "center",
          signIndex: 10,
        },
        {
          id: 12,
          label: "操作",
          prop: "operation",
          width: "180",
          align: "center",
          signIndex: 11,
        },
      ],
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead();
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    onSubmit(form) {
      this.form = form
      this.loadData()
    },
    // 获取数据
    loadData() {
      this.loading = true
      let params = {}
      params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex
      params.page_size = this.pageInfo.pageSize
      this.$client.GetListByPageOaDriverSafety(params).then(res => {
        this.loading = false
        if (res.head.result == "200") {
          this.data =  res.context.list;
          this.pageInfo.pageCount = res.context.total
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 添加
    onAddRowData() {
      
    },
    // 提交批量生成
    saveAddRowData(node) {
      let params = {context: {}}
      params.context.ids = this.selectRowsData.map(item => item.driver_id)
      params.context.step_data = node
      this.$client.SetRecordDriverStar(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.isShowSetInfoDialog = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {});
    },
    // 导出Excel 文件
    onExportExcel(){
      let params = {context: {}}
      params.context = Object.assign({}, this.form)
      this.$client.ExportDriverStar(params).then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })
    },
    // 查看详情   
    openApplyDetail(row) {
      let title = '行车安全优秀驾驶员审批表'
      let object_id = 8700
      this.$router.push({
        path: `/news-details/${row.id}/${title}/${object_id}`
      })
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx;
      this.loadData()
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadData()
    },
    // 计算表格高度
    setHead() {
      let maxh = this.$el.offsetHeight;
      let th = this.$refs.head.$el.offsetHeight;
      let paginationH = this.$refs.paginationH.$el.offsetHeight;
      this.TableHeight = maxh - th - paginationH;
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.driving-safety-excellent-driver
  height: 100%
  width: 100%
</style>
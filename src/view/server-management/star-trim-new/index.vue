<template>
  <div class="star-trim">
    <sub-req 
      ref="head" 
      @on-ok="onSubmit"
      @on-add="fixedFormBodyShow = true"
      @on-export="onExportExcel"></sub-req>
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
      <template slot-scope="scope" slot="state_info">
        <span :style="{ color: getStateColor(scope.data.state) }">{{scope.data.state_info}}</span>
      </template>
      <template slot-scope="scope" slot="old_star">
        <div v-if="scope.data.old_star">
          <el-rate v-model="scope.data.old_star" :max="scope.data.old_star" :disabled="true" :colors="['#F56C6C','#F56C6C','#F56C6C']"></el-rate>
        </div>
        <div class="show-flex-box-r show-flex-center" v-else>
          <span>无星级</span>
        </div>
      </template>
      <template slot-scope="scope" slot="now_star">
        <div v-if="scope.data.now_star">
          <el-rate v-model="scope.data.now_star" :max="scope.data.now_star" :disabled="true" :colors="['#F56C6C','#F56C6C','#F56C6C']"></el-rate>
        </div>
        <div class="show-flex-box-r show-flex-center" v-else>
          <span>无星级</span>
        </div>
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

    <fixed-form-body :dialogBool.sync="fixedFormBodyShow" @on-refresh="loadData" :formId="5260" :formName="'驾驶员星级微调审批单'"></fixed-form-body>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import fixedFormBody from "@/view/main-Interface-entrance/launch-affair/component/all-box/fixed-form-body";
export default {
  name: "star-trim",
  components: {
    subReq,
    fixedFormBody
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead();
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
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
          label: "所属组织",
          prop: "dept_name",
          width: "130",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "考核周期",
          prop: "examine_circle",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable:false
        },
        
        {
          id: 4,
          label: "评星日期",
          prop: "evaluate_date",
          width: "120",
          align: "center",
          signIndex: 3,
          sortable:false
        },
        {
          id: 5,
          label: "调整前星级",
          prop: "old_star",
          width: "180",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "调整后星级",
          prop: "now_star",
          width: "180",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "状态",
          prop: "state_info",
          width: "120",
          align: "center",
          signIndex: 6,
        },
        {
          id: 8,
          label: "申请时间",
          prop: "create_time",
          width: "120",
          align: "center",
          signIndex: 7,
        },
        {
          id: 9,
          label: "经办人",
          prop: "user_name",
          width: "120",
          align: "center",
          signIndex: 8,
        },
        {
          id: 10,
          label: "申请理由",
          prop: "reason",
          width: "120",
          align: "center",
          signIndex: 9,
        },
        {
          id: 11,
          label: "操作",
          prop: "operation",
          width: "180",
          align: "center",
          signIndex: 10,
        },
      ],
    }
  },
  methods: {
    onSubmit(form) {
      this.form = form
      this.loadData()
    },
    // 获取数据
    loadData() {
      this.loading = true
      let params = {context: {}}
      params.context = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex
      params.page_size = this.pageInfo.pageSize
      this.$client.GetRecordDriverStarAdjust(params).then(res => {
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
      let title = '驾驶员星级微调审批'
      let object_id = 5260
      this.$router.push({
        path: `/news-details/${row.main_id}/${title}/${object_id}`
      })
    },
    getStateColor(state) {
      switch (state) {
        case 1: //审批中
          return '#E6A23C';
        case 2://审批完成
          return '#67C23A';
        case 3://审批拒绝
          return '#d9001b';
        case 4://审批撤回
          return '#909399';
        default:
          return '#909399';
      }
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
.star-trim {
  height: 100%;
  width: 100%;
}
</style>

<template>
  <div class="driver-evaluation-record">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-export="exportInfo"
      @on-import="importInfo">

    </sub-req>

    <tr-table
      :selectionShow="false"
      :data="data"
      :tableHeaderList="customSettingList"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      @on-select-change-row="selectedRowsList"
    >
      <template slot-scope="scope" slot="check_cancel">
        <el-switch
          v-model="scope.data.check_cancel"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="0"
          @change="cancelOrNot(scope.data, scope.index)">
        </el-switch>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button type="primary" size="mini" @click="getDriverEvaluationDetail(scope.data)">明细</el-button>
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
    <!-- 取消月度考核弹窗 -->
    <el-dialog
      title="取消考核备注"
      width="360px"
      :visible.sync="dialogVisible">
      <el-form size="mini" :model="formData" :rules="rules" label-suffix=":" label-width="100">
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="formData.remark" :rows="4" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitCancel">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 明细弹窗 -->
    <el-dialog
      title="驾驶员考核明细"
      :visible.sync="detailVisible">
      <tr-table
        :selectionShow="false"
        :data="detailData"
        :tableHeaderList="detailCustomSettingList">
        <template slot-scope="scope" slot="content">
          <div v-html="scope.data.content"></div>
        </template>
      </tr-table>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
export default {
  name: 'driver-evaluation-record',
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
      selectedIds:[],
      frontFixedNum: 0, //前几行固定
      backFixedNum: 1, //后几行固定

      index: null,
      dialogVisible: false,
      formData: {
        remark: ''
      },
      rules: {},

      detailVisible: false,
      detailData: [],
      customSettingList: [
        {
          id: 1,
          label: "月份",
          prop: "check_month",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "部门",
          prop: "dept_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "驾驶员",
          prop: "driver_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "当前安全等级",
          prop: "safe_level",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "本月考核分",
          prop: "check_score",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "取消本月考核",
          prop: "check_cancel",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "操作",
          prop: "operation",
          width: "140",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
      ],
      detailCustomSettingList: [
        {
          id: 1,
          label: "部门",
          prop: "dept_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "驾驶员",
          prop: "driver_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "考核月份",
          prop: "check_month",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "分类",
          prop: "sort_name",
          width: "110",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "内容",
          prop: "content",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "变更分值",
          prop: "change_points",
          width: "110",
          align: "center",
          signIndex: 5,
          sortable: false,
        }
      ],
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead()
      // this.loadData();
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    onSubmit(form) {
      this.form = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = {context:{}}
      params.context = Object.assign({}, this.form);
      params.context.page_index = this.pageInfo.pageIndex;
      params.context.page_size = this.pageInfo.pageSize;
      this.$client.GetByPageDriverSafeArchives(params)
        .then(res => {
          // console.log(JSON.stringify(res));
          if (res.head.result == "200") {
            this.loading = false;
            let info = JSON.parse(JSON.stringify(res.context.list))
            this.data = info;
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
    // 取消本月考核
    cancelOrNot(val, index) {
      if(!!val.check_cancel) {
        this.dialogVisible = true
        this.index = index
        this.formData.remark = val.remark ? val.remark : ''
      }
    },
    // 确定取消
    submitCancel() {
      let params = {
        context: {}
      }
      params.context.check_month = this.data[this.index].check_month
      params.context.driver_id = this.data[this.index].driver_id
      params.context.remark = this.formData.remark
      params.context.is_check = 1
      this.$client.UpdateDriverCheckDriverSafeArchives(params).then(res => {
        if(res.head.result == "200") {
          this.dialogVisible = false
          this.formData.remark = ''
          this.loadData()
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success",
          });
        }else {
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
    exportInfo() {
      let params = {context:{}}
      params.context = Object.assign({}, this.form);
      params.context.page_index = this.pageInfo.pageIndex;
      params.context.page_size = this.pageInfo.pageSize;
      this.$client.CheckExportDriverSafeArchives(params).then(res => {
        if(res.head.result == "200") {
          window.location.href = res.context;
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success",
          });
        }else {
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
    // 导入ic卡数据
    importInfo(form) {
    },
    // 获取驾驶员考核明细
    getDriverEvaluationDetail(row) {
      this.detailVisible = true
      let params = {context:{}}
      params.context.check_month = row.check_month;
      params.context.driver_id = row.driver_id;
      params.context.page_index = 1;
      params.context.page_size = 10000;
      this.$client.GetDetailByPageDriverSafeArchives(params).then(res => {
        if(res.head.result == "200") {
          this.detailData = res.context.list
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success",
          });
        }else {
          this.detailData =[]
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      }).catch(err => {
          this.detailData =[]
          this.$message({
          showClose: true,
          message: err.body.message,
          type: "error",
        });
      })
    },
    selectedRowsList(list) {
      this.selectedIds = [];
      list.forEach((item,index) => {
        this.selectedIds.push(item.id)
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
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.driver-evaluation-record
  height: 100%
  width: 100%
</style>
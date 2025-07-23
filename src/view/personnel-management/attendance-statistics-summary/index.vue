<template>
  <div class="attendance-statistics-summary">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-export="onExport"
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
      @on-select-change-row="selectedList"
    >
      <template slot-scope="scope" slot="annual_holiday">
        <span style="color: #409EFF;cursor: pointer;" @click="openDetail(scope.data,1,5)">{{scope.data.annual_holiday}}</span>
      </template>
      <template slot-scope="scope" slot="bs_hour">
        <span style="color: #409EFF;cursor: pointer;" @click="openDetail(scope.data,1,1)">{{scope.data.bs_hour}}</span>
      </template>
      <template slot-scope="scope" slot="kh_hour">
        <span style="color: #409EFF;cursor: pointer;" @click="openDetail(scope.data,1,2)">{{scope.data.kh_hour}}</span>
      </template>
      <template slot-scope="scope" slot="sj_hour">
        <span style="color: #409EFF;cursor: pointer;" @click="openDetail(scope.data,1,3)">{{scope.data.sj_hour}}</span>
      </template>
      <template slot-scope="scope" slot="bj_hour">
        <span style="color: #409EFF;cursor: pointer;" @click="openDetail(scope.data,1,4)">{{scope.data.bj_hour}}</span>
      </template>
      <template slot-scope="scope" slot="qj_count">
        <span style="color: #409EFF;cursor: pointer;" @click="openDetail(scope.data,1,0)">{{scope.data.qj_count}}</span>
      </template>
      <template slot-scope="scope" slot="jjrjb_hour">
        <span style="color: #409EFF;cursor: pointer;" @click="openDetail(scope.data,2,6)">{{scope.data.jjrjb_hour}}</span>
      </template>
      <template slot-scope="scope" slot="sxrjb_hour">
        <span style="color: #409EFF;cursor: pointer;" @click="openDetail(scope.data,2,7)">{{scope.data.sxrjb_hour}}</span>
      </template>
      <template slot-scope="scope" slot="ysjb_hour">
        <span style="color: #409EFF;cursor: pointer;" @click="openDetail(scope.data,2,8)">{{scope.data.ysjb_hour}}</span>
      </template>
      <template slot-scope="scope" slot="jb_count">
        <span style="color: #409EFF;cursor: pointer;" @click="openDetail(scope.data,2,0)">{{scope.data.jb_count}}</span>
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

    <information-dialog
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      :date="form.date"
      :userName="staffName"
      :title="informationDialogTitle"
    ></information-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import informationDialog from "./component/information-dialog";
export default {
  name: "attendance-statistics-summary",
  components: {
    subReq,
    informationDialog,
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
      curSelecedType: "",
      informationDialogTitle: "详情",
      informationDialogShow: false,
      customSettingList: [
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
          label: "姓名",
          prop: "user_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "请假",
          prop: "holiday",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
          nestedTablesHeader:[
            {
              id: 1,
              label: "年假（天）",
              prop: "annual_holiday",
              width: "130",
              align: "center",
              signIndex: 0,
              sortable: false,
            },
            {
              id: 2,
              label: "办事（小时）",
              prop: "bs_hour",
              width: "130",
              align: "center",
              signIndex: 1,
              sortable: false,
            },
            {
              id: 3,
              label: "开会（小时）",
              prop: "kh_hour",
              width: "130",
              align: "center",
              signIndex: 2,
              sortable: false,
            },
            {
              id: 4,
              label: "事假（小时）",
              prop: "sj_hour",
              width: "130",
              align: "center",
              signIndex: 3,
              sortable: false,
            },
            {
              id: 5,
              label: "病假（小时）",
              prop: "bj_hour",
              width: "130",
              align: "center",
              signIndex: 4,
              sortable: false,
            },
          ]
        },
        {
          id: 4,
          label: "请假次数（次）",
          prop: "qj_count",
          width: "160",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "请假总时长（小时）",
          prop: "qj_total_hour",
          width: "180",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "加班",
          prop: "work_overtime",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
          nestedTablesHeader:[
            {
              id: 1,
              label: "节假日加班（小时）",
              prop: "jjrjb_hour",
              width: "180",
              align: "center",
              signIndex: 0,
              sortable: false,
            },
            {
              id: 2,
              label: "双休日加班（小时）",
              prop: "sxrjb_hour",
              width: "180",
              align: "center",
              signIndex: 1,
              sortable: false,
            },{
              id: 3,
              label: "延时加班（小时）",
              prop: "ysjb_hour",
              width: "180",
              align: "center",
              signIndex: 2,
              sortable: false,
            },
          ]
        },
        {
          id: 7,
          label: "加班次数",
          prop: "jb_count",
          width: "160",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "加班时长（小时）",
          prop: "jb_total_hour",
          width: "160",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
      ],
      frontFixedNum: 2, //前几行固定
      backFixedNum: 0, //后几行固定
      canRendererTableHeader: null,
      selectedIds:[],
      staffName:'',
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead()
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    // 导出
    onExport() {
      let params = Object.assign({},this.form);
      let ids = [ ...this.selectedIds ]
      // if(ids.length) {
      //   params.ids = ids.toString()
      // }
       if(this.selectedIds.length) {
        params.user_ids = this.selectedIds
      }
      this.$client.ExportAttendanceStatistics(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })
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
      this.$client.AttendanceStatisticsAttendanceStatistics(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list
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
    openDetail(row,type, type_child) {
      this.informationDialogShow = true
      this.staffName = row.user_name || ''
      this.$refs.informationDialog.form.userId = row.user_id
      this.$refs.informationDialog.form.type = type
      this.$refs.informationDialog.form.type_child = type_child
      this.$refs.informationDialog.setDataInfo()
    },
    selectedList(list) {
      this.selectedIds = [];
      list.forEach((item,index) => {
        this.selectedIds.push(item.user_id)
      });
    },
    // 计算表格高度 和初始化表头
    setHead() {
      this.canRendererTableHeader = this.customSettingList;
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
.attendance-statistics-summary {
  width: 100%;
  height: 100%;
}
</style>

<template>
  <div class="punch-original-record">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-export="onExport"
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
      @on-select-change-row="selectedList"
    >
      <template slot-scope="scope" slot="kqri">
        <span v-if="scope.data.kqri">{{scope.data.kqri.slice(0,10) +' ' + getweekday(scope.data.kqri.slice(0,10))}}</span>
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
      :userName="staffName"
      :deptName="deptName"
      :kqzTime="kqzTime"
      :title="informationDialogTitle"
    ></information-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import informationDialog from "./component/information-dialog";
export default {
  name: "punch-original-record",
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
          label: "姓名",
          prop: "user_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "考勤组",
          prop: "kqz_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "部门",
          prop: "dept_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },

        {
          id: 4,
          label: "工号",
          prop: "work_id",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "岗位",
          prop: "position",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "考勤日期",
          prop: "kqri",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "考勤时间",
          prop: "kqsj",
          width: "160",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "打卡时间",
          prop: "dksj",
          width: "160",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "打卡结果",
          prop: "state",
          width: "200",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "打卡地址",
          prop: "address",
          width: "150",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "打卡备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false,
        }
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 0, //后几行固定
      canRendererTableHeader: null,
      selectedIds:[],
      staffName:'',
      deptName:'',
      kqzTime:'',
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
    getweekday(date){
      // date例如:'2022-03-05'
      const weekArray = new Array("周日","周一", "周二", "周三", "周四", "周五", "周六")
      const week  = weekArray[new Date(date).getDay()]
      return week
    },
    checkState(val,type) {
      let isShowColor = false
        if(!!val[type] && (val[type].includes('缺卡') ||  val[type].includes('迟到') || val[type].includes('早退') || val[type].includes('外勤打卡'))) {
          isShowColor = true
      }
     return isShowColor
    },
    // 导出
    onExport() {
      let params = Object.assign({},this.form);
      let ids = [ ...this.selectedIds ]
      // if(ids.length) {
      //   params.ids = ids.toString()
      // }
       if(this.selectedIds.length) {
        params.users_id = this.selectedIds
      }
      this.$client.ExportDetailKqRecord(params)
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
      this.$client.AttendanceStatisticsKqRecord(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.datas
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
    openDetail(row,type,type_child) {
      if(this.checkState(row,type)) {
        this.informationDialogShow = true
        this.staffName = row.user_name || ''
        this.deptName = row.kqz_name || ''
        this.kqzTime = row.kqbc || ''
        this.$refs.informationDialog.form.userId = row.user_id
        this.$refs.informationDialog.form.date = row.date
        this.$refs.informationDialog.setDateInfo()
      }
      
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
.punch-original-record {
  width: 100%;
  height: 100%;
}
</style>

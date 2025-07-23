<template>
  <div class="monthly-attendance-summary">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-export="onExport"
      @on-open-detail="onOpenDetail"
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
      <!--打卡  0未打卡1正常2迟到3早退4异常打卡5缺卡6外勤7旷工8上班缺卡9下班缺卡   -->
      <template slot-scope="scope" slot="late_count">
        <span style="color: #409EFF;cursor: pointer;" @click="openPunchClockDetail(scope.data,2)">{{scope.data.late_count}}</span>
      </template>
      <template slot-scope="scope" slot="late_time">
        <span style="color: #409EFF;cursor: pointer;" @click="openPunchClockDetail(scope.data,2)">{{scope.data.late_time}}</span>
      </template>
      <template slot-scope="scope" slot="absenteeism_late_day">
        <span style="color: #409EFF;cursor: pointer;" @click="openPunchClockDetail(scope.data,11)">{{scope.data.absenteeism_late_day}}</span>
      </template>
      <template slot-scope="scope" slot="early_count">
        <span style="color: #409EFF;cursor: pointer;" @click="openPunchClockDetail(scope.data,3)">{{scope.data.early_count}}</span>
      </template>
      <template slot-scope="scope" slot="early_time">
        <span style="color: #409EFF;cursor: pointer;" @click="openPunchClockDetail(scope.data,3)">{{scope.data.early_time}}</span>
      </template>
      <template slot-scope="scope" slot="absenteeism_early_day">
        <span style="color: #409EFF;cursor: pointer;" @click="openPunchClockDetail(scope.data,10)">{{scope.data.absenteeism_early_day}}</span>
      </template>
      <template slot-scope="scope" slot="on_lack_count">
        <span style="color: #409EFF;cursor: pointer;" @click="openPunchClockDetail(scope.data,8)">{{scope.data.on_lack_count}}</span>
      </template>
      <template slot-scope="scope" slot="off_lack_count">
        <span style="color: #409EFF;cursor: pointer;" @click="openPunchClockDetail(scope.data,9)">{{scope.data.off_lack_count}}</span>
      </template>
      <template slot-scope="scope" slot="absenteeism_day">
        <span style="color: #409EFF;cursor: pointer;" @click="openPunchClockDetail(scope.data,7)">{{scope.data.absenteeism_day}}</span>
      </template>

      <!-- 出差 -->
      <template slot-scope="scope" slot="business_type">
        <span style="color: #409EFF;cursor: pointer;" @click="openBusinessTravelDetail(scope.data)">{{scope.data.business_type}}</span>
      </template>

      <!-- 请假  1公出 2事假 3丧假 4病假 5年假 6婚假 7产假 8哺乳假 9工伤假-->
      <template slot-scope="scope" slot="offical_leave">
        <span style="color: #409EFF;cursor: pointer;" @click="openDetail(scope.data,1,1)">{{scope.data.offical_leave}}</span>
      </template>
      <template slot-scope="scope" slot="affair_leave">
        <span style="color: #409EFF;cursor: pointer;" @click="openDetail(scope.data,1,2)">{{scope.data.affair_leave}}</span>
      </template>
      <template slot-scope="scope" slot="annual_leave">
        <span style="color: #409EFF;cursor: pointer;" @click="openDetail(scope.data,1,5)">{{scope.data.annual_leave}}</span>
      </template>
      <template slot-scope="scope" slot="marriage_leave">
        <span style="color: #409EFF;cursor: pointer;" @click="openDetail(scope.data,1,6)">{{scope.data.marriage_leave}}</span>
      </template>
      <template slot-scope="scope" slot="maternity_leave">
        <span style="color: #409EFF;cursor: pointer;" @click="openDetail(scope.data,1,7)">{{scope.data.maternity_leave}}</span>
      </template>
      <template slot-scope="scope" slot="breast_feeding_leave">
        <span style="color: #409EFF;cursor: pointer;" @click="openDetail(scope.data,1,8)">{{scope.data.breast_feeding_leave}}</span>
      </template>
      <template slot-scope="scope" slot="sick_leave">
        <span style="color: #409EFF;cursor: pointer;" @click="openDetail(scope.data,1,4)">{{scope.data.sick_leave}}</span>
      </template>
      <template slot-scope="scope" slot="industrial_hurt_leave">
        <span style="color: #409EFF;cursor: pointer;" @click="openDetail(scope.data,1,9)">{{scope.data.industrial_hurt_leave}}</span>
      </template>
      <template slot-scope="scope" slot="funeral_leave">
        <span style="color: #409EFF;cursor: pointer;" @click="openDetail(scope.data,1,3)">{{scope.data.funeral_leave}}</span>
      </template>



      <!-- 加班  1节假日加班，2休息日加班，3工作日加班-->
      <template slot-scope="scope" slot="overwork_time">
        <span style="color: #409EFF;cursor: pointer;" @click="openDetail(scope.data,2,0)">{{scope.data.overwork_time}}</span>
      </template>
      <template slot-scope="scope" slot="overwork_fee">
        <span style="color: #409EFF;cursor: pointer;" @click="openDetail(scope.data,2,0)">{{scope.data.overwork_fee}}</span>
      </template>
      <template slot-scope="scope" slot="work_overwork_time">
        <span style="color: #409EFF;cursor: pointer;" @click="openDetail(scope.data,2,3)">{{scope.data.work_overwork_time}}</span>
      </template>
      <template slot-scope="scope" slot="rest_overwork_time">
        <span style="color: #409EFF;cursor: pointer;" @click="openDetail(scope.data,2,2)">{{scope.data.rest_overwork_time}}</span>
      </template>
      <template slot-scope="scope" slot="holiday_overwork_time">
        <span style="color: #409EFF;cursor: pointer;" @click="openDetail(scope.data,2,1)">{{scope.data.holiday_overwork_time}}</span>
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
      :date="[form.start,form.end]"
      :userName="staffName"
      :title="informationDialogTitle"
    ></information-dialog>
    <monthly-attendance-detail-dialog
      ref="monthlyAttendanceDetailDialog"
      :dialogBool.sync="monthlyAttendanceDetailDialogShow"
      :selectedIds="selectedIds"
      :start="form.start"
      :end="form.end"
    ></monthly-attendance-detail-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import informationDialog from "./component/information-dialog";
import monthlyAttendanceDetailDialog from "./component/monthly-attendance-detail-dialog/index.vue";
export default {
  name: "monthly-attendance-summary",
  components: {
    subReq,
    informationDialog,
    monthlyAttendanceDetailDialog
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
          prop: "group_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "职务",
          prop: "job_level",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "出勤天数",
          prop: "work_day",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "休息天数",
          prop: "rest_day",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "工作时长（分钟）",
          prop: "work_time",
          width: "150",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "迟到次数",
          prop: "late_count",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "迟到时长（分钟）",
          prop: "late_time",
          width: "150",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "旷工迟到天数",
          prop: "absenteeism_late_day",
          width: "150",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "早退次数",
          prop: "early_count",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "早退时长（分钟）",
          prop: "early_time",
          width: "150",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "旷工早退天数",
          prop: "absenteeism_early_day",
          width: "150",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "上班缺卡次数",
          prop: "on_lack_count",
          width: "150",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
        {
          id: 15,
          label: "下班缺卡次数",
          prop: "off_lack_count",
          width: "150",
          align: "center",
          signIndex: 14,
          sortable: false,
        },
        {
          id: 16,
          label: "旷工天数",
          prop: "absenteeism_day",
          width: "130",
          align: "center",
          signIndex: 15,
          sortable: false,
        },
        {
          id: 17,
          label: "出差时长（天）",
          prop: "business_type",
          width: "150",
          align: "center",
          signIndex: 16,
          sortable: false,
        },
        {
          id: 18,
          label: "请假",
          prop: "holiday",
          width: "130",
          align: "center",
          signIndex: 17,
          sortable: false,
          nestedTablesHeader:[
            {
              id: 1,
              label: "公出（小时）",
              prop: "offical_leave",
              width: "130",
              align: "center",
              signIndex: 0,
              sortable: false,
            },
            {
              id: 2,
              label: "事假（天）",
              prop: "affair_leave",
              width: "150",
              align: "center",
              signIndex: 1,
              sortable: false,
            },
            {
              id: 3,
              label: "年假（天）",
              prop: "annual_leave",
              width: "130",
              align: "center",
              signIndex: 2,
              sortable: false,
            },
            {
              id: 4,
              label: "婚假（天）",
              prop: "marriage_leave",
              width: "130",
              align: "center",
              signIndex: 3,
              sortable: false,
            },
            {
              id: 5,
              label: "产假（天）",
              prop: "maternity_leave",
              width: "130",
              align: "center",
              signIndex: 4,
              sortable: false,
            },
            {
              id: 6,
              label: "哺乳假（天）",
              prop: "breast_feeding_leave",
              width: "150",
              align: "center",
              signIndex: 5,
              sortable: false,
            },
            {
              id: 7,
              label: "病假（天）",
              prop: "sick_leave",
              width: "130",
              align: "center",
              signIndex: 6,
              sortable: false,
            },
            {
              id: 8,
              label: "工伤假（天）",
              prop: "industrial_hurt_leave",
              width: "130",
              align: "center",
              signIndex: 7,
              sortable: false,
            },
            {
              id: 9,
              label: "丧假（天）",
              prop: "funeral_leave",
              width: "130",
              align: "center",
              signIndex: 8,
              sortable: false,
            },
            {
              id: 10,
              label: "陪产假（天）",
              prop: "paternal_leave",
              width: "130",
              align: "center",
              signIndex: 8,
              sortable: false,
            },
            {
              id: 11,
              label: "育儿假（天）",
              prop: "parenting_leave",
              width: "130",
              align: "center",
              signIndex: 8,
              sortable: false,
            },
            {
              id: 12,
              label: "独生子女陪护父母假（天）",
              prop: "one_child_leave",
              width: "230",
              align: "center",
              signIndex: 8,
              sortable: false,
            },
            {
              id: 13,
              label: "调休假（天）",
              prop: "day_off_leave",
              width: "130",
              align: "center",
              signIndex: 8,
              sortable: false,
            },
          ]
        },
        // {
        //   id: 4,
        //   label: "请假次数（次）",
        //   prop: "qj_count",
        //   width: "160",
        //   align: "center",
        //   signIndex: 3,
        //   sortable: false,
        // },
        // {
        //   id: 5,
        //   label: "请假总时长（小时）",
        //   prop: "qj_total_hour",
        //   width: "180",
        //   align: "center",
        //   signIndex: 4,
        //   sortable: false,
        // },
        {
          id: 19,
          label: "加班总时长",
          prop: "overwork_time",
          width: "160",
          align: "center",
          signIndex: 18,
          sortable: false,
        },
        {
          id: 20,
          label: "加班费",
          prop: "overwork_fee",
          width: "160",
          align: "center",
          signIndex: 19,
          sortable: false,
        },
        {
          id: 21,
          label: "加班时长",
          prop: "work_overtime",
          width: "130",
          align: "center",
          signIndex: 20,
          sortable: false,
          nestedTablesHeader:[
            {
              id: 1,
              label: "工作日（转加班费）",
              prop: "work_overwork_time",
              width: "180",
              align: "center",
              signIndex: 0,
              sortable: false,
            },
            {
              id: 2,
              label: "休息日（转加班费）",
              prop: "rest_overwork_time",
              width: "180",
              align: "center",
              signIndex: 1,
              sortable: false,
            },{
              id: 3,
              label: "节假日（转加班费）",
              prop: "holiday_overwork_time",
              width: "180",
              align: "center",
              signIndex: 2,
              sortable: false,
            },
          ]
        },
        {
          id: 21,
          label: "加班时长",
          prop: "work_overtime",
          width: "130",
          align: "center",
          signIndex: 20,
          sortable: false,
          nestedTablesHeader:[
            {
              id: 1,
              label: "工作日（转调休）",
              prop: "work_overwork_time_tx",
              width: "180",
              align: "center",
              signIndex: 0,
              sortable: false,
            },
            {
              id: 2,
              label: "休息日（转调休）",
              prop: "rest_overwork_time_tx",
              width: "180",
              align: "center",
              signIndex: 1,
              sortable: false,
            },{
              id: 3,
              label: "节假日（转调休）",
              prop: "holiday_overwork_time_tx",
              width: "180",
              align: "center",
              signIndex: 2,
              sortable: false,
            },
          ]
        }
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 0, //后几行固定
      canRendererTableHeader: null,
      selectedIds:[],
      staffName:'',
      monthlyAttendanceDetailDialogShow: false
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
      this.$client.ExportMonthKqReport(params)
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
      this.$client.GetDataMonthKqReport(params)
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
    // 打开请假、加班详情
    openDetail(row,type, type_child) {
      this.informationDialogShow = true
      this.staffName = row.user_name || ''
      this.$refs.informationDialog.form.userId = row.user_id
      this.$refs.informationDialog.form.type = type
      this.$refs.informationDialog.form.type_child = type_child
      this.$refs.informationDialog.setDataInfo()
    },
    // 打开打卡详情
    openPunchClockDetail(row,state) {
      this.informationDialogShow = true
      this.staffName = row.user_name || ''
      this.$refs.informationDialog.form.userId = row.user_id
      this.$refs.informationDialog.form.state = state
      this.$refs.informationDialog.setDataFirstInfo()
    },
    // 打开出差详情
    openBusinessTravelDetail(row) {
      this.informationDialogShow = true
      this.staffName = row.user_name || ''
      this.$refs.informationDialog.form.userId = row.user_id
      this.$refs.informationDialog.setDataSecondInfo()
    },
    selectedList(list) {
      this.selectedIds = [];
      list.forEach((item,index) => {
        this.selectedIds.push(item.user_id)
      });
    },
    // 打开月考勤详情
    onOpenDetail() {
      if(this.selectedIds.length === 0) {
         this.$message({
            showClose: true,
            message: '请勾选要查看的员工信息',
            type: "warning",
          });
        return
      }
      this.monthlyAttendanceDetailDialogShow = true
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
.monthly-attendance-summary {
  width: 100%;
  height: 100%;
}
</style>

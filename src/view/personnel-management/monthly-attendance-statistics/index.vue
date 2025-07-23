<template>
  <div class="monthly-attendance-statistics">
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
      @on-select-change-row="selectedList">
      <template v-for="item in holidayName" :slot="item" slot-scope="scope">
        <div :key="item + 'holidayName'">
          <el-button type="text" @click="onOpenDetail(scope.data[item])">{{ scope.data[item] ? scope.data[item] : 0 }}</el-button>
        </div>
      </template>
      <template v-for="item in [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]" slot-scope="scope" :slot="item + ''">
        <div :key="item + 'dayKqResults'" 
        :style="{
          background: scope.data.DayKqResults[item] &&scope.data.DayKqResults[item].result === '休息' ? '#b6f5a8' : 
          scope.data.DayKqResults[item] && scope.data.DayKqResults[item].result === '请假' ? '#ffd59e' : 
          scope.data.DayKqResults[item] && scope.data.DayKqResults[item].result === '出差' ? '#8fd6ff' : ''}">
          {{ scope.data.DayKqResults[item] && scope.data.DayKqResults[item].day ? scope.data.DayKqResults[item].result : '' }}
        </div>
      </template>
      <!-- 这里可根据实际需求调整slot内容 -->
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
    <information-dialog
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      :title="informationDialogTitle"
    ></information-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import informationDialog from "./component/information-dialog";
import { getDaysInMonth, getWeekDay } from '@/utils/index';
import holidays from './component/holidays';
export default {
  name: "monthly-attendance-statistics",
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
      curSelectedType: "",
      informationDialogTitle: "详情",
      informationDialogShow: false,
      holidayName: [
        'BusinessTripDays', 'LeaveDaysTotal', 'AdjustedLeaveDays', 'LeaveDays', 'AnnualLeaveDays', 'SickLeaveDays', 'WorkInjuryLeaveDays',
        'MarriageLeaveDays', 'MaternityLeaveDays', 'NursingLeaveDays', 'BereavementLeaveDays', 'ParentingLeaveDays', 'OnlyChildLeaveDays',
        'overwork_time', 'WorkdayOvertimeToPay', 'RestdayOvertimeToPay', 'HolidayOvertimeToPay', 'WorkdayOvertimeToAdjust', 'RestdayOvertimeToAdjust',
        'HolidayOvertimeToAdjust',
      ],
      customSettingList: [
        {
          id: 1,
          label: "姓名",
          prop: "Name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "部门",
          prop: "Department",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "职务",
          prop: "Position",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "出勤天数",
          prop: "AttendanceDays",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "作业天数",
          prop: "WorkDays",
          width: "150",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "休息天数",
          prop: "RestDays",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "出差天数",
          prop: "BusinessTripDays",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "请假天数",
          prop: "LeaveDaysTotal",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "请假(天)",
          prop: "holiday",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
          nestedTablesHeader:[
            {
              id: 1,
              label: "调休假",
              prop: "AdjustedLeaveDays",
              width: "130",
              align: "center",
              signIndex: 0,
              sortable: false,
            },
            {
              id: 2,
              label: "事假",
              prop: "LeaveDays",
              width: "150",
              align: "center",
              signIndex: 1,
              sortable: false,
            },
            {
              id: 3,
              label: "年假",
              prop: "AnnualLeaveDays",
              width: "130",
              align: "center",
              signIndex: 2,
              sortable: false,
            },
            {
              id: 4,
              label: "病假",
              prop: "SickLeaveDays",
              width: "130",
              align: "center",
              signIndex: 3,
              sortable: false,
            },
            {
              id: 5,
              label: "工伤假",
              prop: "WorkInjuryLeaveDays",
              width: "130",
              align: "center",
              signIndex: 4,
              sortable: false,
            },
            {
              id: 6,
              label: "婚假",
              prop: "MarriageLeaveDays",
              width: "150",
              align: "center",
              signIndex: 5,
              sortable: false,
            },
            {
              id: 7,
              label: "产假",
              prop: "MaternityLeaveDays",
              width: "130",
              align: "center",
              signIndex: 6,
              sortable: false,
            },
            {
              id: 8,
              label: "哺乳假",
              prop: "NursingLeaveDays",
              width: "130",
              align: "center",
              signIndex: 7,
              sortable: false,
            },
            {
              id: 9,
              label: "丧假",
              prop: "BereavementLeaveDays",
              width: "130",
              align: "center",
              signIndex: 8,
              sortable: false,
            },
            {
              id: 10,
              label: "育儿假",
              prop: "ParentingLeaveDays",
              width: "130",
              align: "center",
              signIndex: 9,
              sortable: false,
            },
            {
              id: 11,
              label: "独生子女陪护父母假",
              prop: "OnlyChildLeaveDays",
              width: "230",
              align: "center",
              signIndex: 10,
              sortable: false,
            },
          ]
        },
        {
          id: 10,
          label: "加班总时长（小时）",
          prop: "overwork_time",
          width: "150",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "加班时长（小时）",
          prop: "TotalOvertimeHours",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false,
          nestedTablesHeader:[
            {
              id: 1,
              label: "工作日（转加班费）",
              prop: "WorkdayOvertimeToPay",
              width: "180",
              align: "center",
              signIndex: 0,
              sortable: false,
            },
            {
              id: 2,
              label: "休息日（转加班费）",
              prop: "RestdayOvertimeToPay",
              width: "180",
              align: "center",
              signIndex: 1,
              sortable: false,
            },{
              id: 3,
              label: "节假日（转加班费）",
              prop: "HolidayOvertimeToPay",
              width: "180",
              align: "center",
              signIndex: 2,
              sortable: false,
            },
          ]
        },
        {
          id: 12,
          label: "加班时长（小时）",
          prop: "work_overtime_tx",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: false,
          nestedTablesHeader:[
            {
              id: 1,
              label: "工作日（转调休）",
              prop: "WorkdayOvertimeToAdjust",
              width: "180",
              align: "center",
              signIndex: 0,
              sortable: false,
            },
            {
              id: 2,
              label: "休息日（转调休）",
              prop: "RestdayOvertimeToAdjust",
              width: "180",
              align: "center",
              signIndex: 1,
              sortable: false,
            },{
              id: 3,
              label: "节假日（转调休）",
              prop: "HolidayOvertimeToAdjust",
              width: "180",
              align: "center",
              signIndex: 2,
              sortable: false,
            },
          ]
        },
        
      ], // 这里可根据实际需求调整表头
      frontFixedNum: 1,
      backFixedNum: 0,
      canRendererTableHeader: [],
      staffName: '',
    };
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
    onSubmit(form) {
      this.form = form
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      
      this.generateAttendanceHeaders();
      this.loadData();
    },
    generateAttendanceHeaders() {
      // 生成考勤结果二级表头
      const yearMonth = this.form.year_month;
      if (!yearMonth) return;
      const [year, month] = yearMonth.split('-').map(Number);
      const days = getDaysInMonth(year, month);
      const headers = [];
      for (let i = 1; i <= days.length; i++) {
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        // 获取节假日名称（英文）
        const holidayName = holidays[dateStr]; // "New Year's Day"
        const week = getWeekDay(dateStr);
        console.log(dateStr,holidayName,'holidayName');
        
        headers.push({
          id: 2000 + i,
          label: `${i}（${week}）${holidayName ? ' ' + holidayName : ''}`,
          width: holidayName ? '180' : '120',
          align: 'center',
          sortable: false,
          prop: i + '',
        });
      }
      this.canRendererTableHeader = [
        ...this.customSettingList,
        {
          id: 13,
          label: '考勤结果',
          prop: 'holiday',
          width: '130',
          align: 'center',
          signIndex: 12,
          sortable: false,
          nestedTablesHeader: headers
        }
      ];
      console.log(this.canRendererTableHeader,'canRendererTableHeader');
      
    },
    loadData() {
      this.loading = true;
      let params = {
        pageIndex: this.pageInfo.pageIndex,
        pageSize: this.pageInfo.pageSize,
        ...this.form
      }
      this.$client.GetDataMonthKqReport(params)
        .then(res => {
          this.loading = false;
          this.data = res.context.list.slice(0, 10);
        })
        .catch(err => {
          this.loading = false;
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    onOpenDetail(row) {
      this.informationDialogShow = true
      this.informationDialogTitle = row.Name || ''
    },
    onExport() {},
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
    setHead(type = 'initialize') {
      // if(type == 'initialize') {
      //   this.canRendererTableHeader = this.customSettingList;
      // }
      this.$nextTick(() => {
        const maxh = this.$el.offsetHeight;
        const th = this.$refs.head ? this.$refs.head.$el.offsetHeight : 0;
        const ph = this.$refs.paginationH ? this.$refs.paginationH.$el.offsetHeight : 0;
        this.TableHeight = maxh - th - ph - 10;
      });
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.monthly-attendance-statistics {
  width: 100%;
  height: 100%;
}
</style> 
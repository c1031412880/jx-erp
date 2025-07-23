<template>
  <div class="daily-attendance-summary">
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
      :spanMethodType="['column']"
      :rowspanObj="rowspanObj"
      :mergekeys="mergekeys"
      :stripe="false"
      @on-select-change-row="selectedList"
      @on-select-row="onSelectRow"
    >
      <template slot-scope="scope" slot="date">
        <span>{{scope.data.date +' ' + getweekday(scope.data.date)}}</span>
      </template>

      <template slot-scope="scope" slot="on_work_result1">
        <span :style="`${checkState(scope.data,'on_work_result1')? 'color:#F59A23;cursor: pointer;':''}`" @click.stop="openDetail(scope.data,'on_work_result1')">{{scope.data.on_work_result1}}</span>
      </template>
   
      <template slot-scope="scope" slot="off_work_result1">
        <span :style="`${checkState(scope.data,'off_work_result1')? 'color:#F59A23;cursor: pointer;':''}`" @click.stop="openDetail(scope.data,'off_work_result1')">{{scope.data.off_work_result1}}</span>
      </template>
    
      <template slot-scope="scope" slot="on_work_result2">
        <span :style="`${checkState(scope.data,'on_work_result2')? 'color:#F59A23;cursor: pointer;':''}`" @click.stop="openDetail(scope.data,'on_work_result2')">{{scope.data.on_work_result2}}</span>
      </template>
     
      <template slot-scope="scope" slot="off_work_result2">
        <span :style="`${checkState(scope.data,'off_work_result2')? 'color:#F59A23;cursor: pointer;':''}`" @click.stop="openDetail(scope.data,'off_work_result2')">{{scope.data.off_work_result2}}</span>
      </template>

      
      <template slot-scope="scope" slot="on_work_result3">
        <span :style="`${checkState(scope.data,'on_work_result3')? 'color:#F59A23;cursor: pointer;':''}`" @click.stop="openDetail(scope.data,'on_work_result3')">{{scope.data.on_work_result3}}</span>
      </template>
     
      <template slot-scope="scope" slot="off_work_result3">
        <span :style="`${checkState(scope.data,'off_work_result3')? 'color:#F59A23;cursor: pointer;':''}`" @click.stop="openDetail(scope.data,'off_work_result3')">{{scope.data.off_work_result3}}</span>
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
  name: "daily-attendance-summary",
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
          label: "日期",
          prop: "date",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "班次",
          prop: "kqbc",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "上班打卡时间1",
          prop: "on_work_time1",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "上班打卡结果1",
          prop: "on_work_result1",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "下班打卡时间1",
          prop: "off_work_time1",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "下班打卡结果1",
          prop: "off_work_result1",
          width: "150",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "上班打卡时间2",
          prop: "on_work_time2",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "上班打卡结果2",
          prop: "on_work_result2",
          width: "150",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "下班打卡时间2",
          prop: "off_work_time2",
          width: "130",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "下班打卡结果2",
          prop: "off_work_result2",
          width: "150",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
        {
          id: 15,
          label: "上班打卡时间3",
          prop: "on_work_time3",
          width: "130",
          align: "center",
          signIndex: 14,
          sortable: false,
        },
        {
          id: 16,
          label: "上班打卡结果3",
          prop: "on_work_result3",
          width: "130",
          align: "center",
          signIndex: 15,
          sortable: false,
        },
        {
          id: 17,
          label: "下班打卡时间3",
          prop: "off_work_time3",
          width: "130",
          align: "center",
          signIndex: 16,
          sortable: false,
        },
        {
          id: 18,
          label: "下班打卡结果3",
          prop: "off_work_result3",
          width: "150",
          align: "center",
          signIndex: 17,
          sortable: false,
        },
        {
          id: 19,
          label: "关联的审批单",
          prop: "relate_content",
          width: "130",
          align: "center",
          signIndex: 18,
          sortable: false,
        },
        {
          id: 20,
          label: "出勤天数",
          prop: "work_day",
          width: "130",
          align: "center",
          signIndex: 19,
          sortable: false,
        },
        {
          id: 21,
          label: "休息天数",
          prop: "rest_day",
          width: "130",
          align: "center",
          signIndex: 20,
          sortable: false,
        },
        {
          id: 22,
          label: "工作时长（分钟）",
          prop: "work_time",
          width: "160",
          align: "center",
          signIndex: 21,
          sortable: false,
        },
        {
          id: 23,
          label: "迟到次数",
          prop: "late_count",
          width: "130",
          align: "center",
          signIndex: 22,
          sortable: false,
        },
        {
          id: 24,
          label: "迟到时长（分钟）",
          prop: "late_time",
          width: "160",
          align: "center",
          signIndex: 23,
          sortable: false,
        },
        {
          id: 25,
          label: "旷工迟到天数",
          prop: "absenteeism_late_day",
          width: "130",
          align: "center",
          signIndex: 24,
          sortable: false,
        },
        {
          id: 26,
          label: "早退次数",
          prop: "early_count",
          width: "130",
          align: "center",
          signIndex: 25,
          sortable: false,
        },
        {
          id: 27,
          label: "早退时长（分钟）",
          prop: "early_time",
          width: "160",
          align: "center",
          signIndex: 26,
          sortable: false,
        },
        {
          id: 28,
          label: "旷工早退天数",
          prop: "absenteeism_early_day",
          width: "130",
          align: "center",
          signIndex: 27,
          sortable: false,
        },
        {
          id: 29,
          label: "上班缺卡次数",
          prop: "on_lack_count",
          width: "130",
          align: "center",
          signIndex: 28,
          sortable: false,
        },
        {
          id: 30,
          label: "下班缺卡次数",
          prop: "off_lack_count",
          width: "130",
          align: "center",
          signIndex: 29,
          sortable: false,
        },
        {
          id: 31,
          label: "旷工天数",
          prop: "absenteeism_day",
          width: "130",
          align: "center",
          signIndex: 30,
          sortable: false,
        },
        {
          id: 32,
          label: "出差时长",
          prop: "business_type",
          width: "130",
          align: "center",
          signIndex: 31,
          sortable: false,
        },
        {
          id: 33,
          label: "请假",
          prop: "holiday",
          width: "130",
          align: "center",
          signIndex: 32,
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
              width: "130",
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
              width: "130",
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
        {
          id: 34,
          label: "加班总时长",
          prop: "overwork_time",
          width: "160",
          align: "center",
          signIndex: 33,
          sortable: false,
        },
        {
          id: 35,
          label: "总加班费",
          prop: "overwork_fee",
          width: "180",
          align: "center",
          signIndex: 34,
          sortable: false,
        },
        {
          id: 36,
          label: "加班时长（小时）",
          prop: "work_overtime",
          width: "130",
          align: "center",
          signIndex: 35,
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
        }
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 0, //后几行固定
      canRendererTableHeader: null,
      selectedIds:[],
      staffName:'',
      deptName:'',
      kqzTime:'',
      onWorkArr:[
        'on_work_time1',
        'on_work_result1',
        'off_work_time1',
        'off_work_result1',
        'on_work_time2',
        'on_work_result2',
        'off_work_time2',
        'off_work_result2',
        'on_work_time3',
        'on_work_result3',
        'off_work_time3',
        'off_work_result3',
      ],
      // 要纵向合并的单元格的key数组
      mergekeys: ['user_name','kqz_name','group_name','job_level'],
      rowspanObj:{},
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
        if(!!val[type] && (val[type].includes('缺卡') ||  val[type].includes('迟到') || val[type].includes('早退') || val[type].includes('外勤打卡') || val[type].includes('未打卡'))) {
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
        params.user_ids = this.selectedIds
      }
      this.$client.ExportDayKqReport(params)
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
      this.$client.GetDataDayKqReport(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list
            this.rowspanObj = this.$handleTableSpan(this.mergekeys, this.data,'user_name',true)
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
    // 点击当前行 查看打卡详情
    onSelectRow(row) {
      this.informationDialogShow = true
      this.staffName = row.user_name || ''
      this.deptName = row.kqz_name || ''
      this.kqzTime = row.kqbc || ''
      this.$refs.informationDialog.form.userId = row.user_id
      this.$refs.informationDialog.form.date = row.date
      this.$refs.informationDialog.setDateInfo()
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
.daily-attendance-summary {
  width: 100%;
  height: 100%;
}
</style>

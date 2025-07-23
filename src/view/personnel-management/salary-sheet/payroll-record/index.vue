<template>
  <div ref="payrollRecord" class="payroll-record">
    <div class="top">
      <el-button size="mini" @click="backDetail">返回</el-button>
      <p>发放详情</p>
    </div>
    <sub-req ref="recordHead" @on-ok="onSubmit" @on-btn-export="exportFile"></sub-req>
    <p style="margin-bottom: 17px; color: #02A7F0; ">已上传 {{ count || 0 }} 条工资条，总实发金额 {{ money.toFixed(2) || 0 }} 元</p>
    <tr-table
      :data="data"
      :selectionShow="true"
      :tableHeaderList="canRendererTableHeader"
      @on-select-change-row="selectedList"
      :TableHeight="TableHeight"
      :backFixedNum="1"
      :loading="loading">
    </tr-table>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
export default {
  name: "payrollRecord",
  components: {
    subReq
  },
  mounted() {
    this.loadData()
    this.$nextTick(() => {
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  props: {
    main_id: ''
  },
  data() {
    return {
      data: [],
      count: 0,
      money: 0,
      loading: false,
      TableHeight: 500,
      queryform: {},
      selectedIds:[], //勾选的ID
      customSettingList: [
        {
          id: 1,
          label: "姓名",
          prop: "user_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable:false
        },
        {
          id: 2,
          label: "手机号",
          prop: "phone",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable:false
        },
        {
          id: 3,
          label: "账号",
          prop: "account",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable:false
        },
        {
          id: 4,
          label: "基本工资",
          prop: "basic_salary",
          width: "120",
          align: "center",
          signIndex: 3,
          sortable:false
        },
        {
          id: 5,
          label: "工龄工资",
          prop: "seniority_pay",
          width: "160",
          align: "center",
          signIndex: 4,
          sortable:false
        },
        {
          id: 6,
          label: "职称补贴",
          prop: "title_subsidies",
          width: "120",
          align: "center",
          signIndex: 5,
          sortable:false
        },
        {
          id: 7,
          label: "预发数",
          prop: "pretest_number",
          width: "145",
          align: "center",
          signIndex: 6,
          sortable:false
        },

        {
          id: 8,
          label: "奖金",
          prop: "bonus",
          width: "145",
          align: "center",
          signIndex: 7,
          sortable:false
        },
        {
          id: 9,
          label: "加班费",
          prop: "overtime_pay",
          width: "145",
          align: "center",
          signIndex: 8,
          sortable:false
        },
        {
          id: 10,
          label: "代发工资",
          prop: "agency_salary",
          width: "145",
          align: "center",
          signIndex: 9,
          sortable:false
        },
        {
          id: 11,
          label: "应发工资",
          prop: "should_pay",
          width: "145",
          align: "center",
          signIndex: 10,
          sortable:false
        },
        {
          id: 12,
          label: "扣基本养老金",
          prop: "pension",
          width: "145",
          align: "center",
          signIndex: 11,
          sortable:false
        },
        {
          id: 13,
          label: "扣医保基本金",
          prop: "health_care",
          width: "145",
          align: "center",
          signIndex: 12,
          sortable:false
        },
        {
          id: 14,
          label: "扣住房公积金",
          prop: "accumulation_fund",
          width: "145",
          align: "center",
          signIndex: 13,
          sortable:false
        },
        {
          id: 15,
          label: "扣失业保险金",
          prop: "unemployment_insurance",
          width: "145",
          align: "center",
          signIndex: 14,
          sortable:false
        },
        {
          id: 16,
          label: "工会费",
          prop: "union_fee",
          width: "145",
          align: "center",
          signIndex: 15,
          sortable:false
        },
        {
          id: 17,
          label: "房租水电费",
          prop: "rent_hydropower",
          width: "145",
          align: "center",
          signIndex: 16,
          sortable:false
        },
        {
          id: 18,
          label: "考勤扣款",
          prop: "attendance_deductions",
          width: "145",
          align: "center",
          signIndex: 17,
          sortable:false
        },
        {
          id: 19,
          label: "应扣合计",
          prop: "should_deduct",
          width: "145",
          align: "center",
          signIndex: 18,
          sortable:false
        },
        {
          id: 20,
          label: "补扣20%工资",
          prop: "fill_deduct",
          width: "145",
          align: "center",
          signIndex: 19,
          sortable:false
        },
        {
          id: 21,
          label: "计税工资",
          prop: "plan_duty_salary",
          width: "145",
          align: "center",
          signIndex: 20,
          sortable:false
        },
        {
          id: 22,
          label: "扣个税",
          prop: "income_tax",
          width: "145",
          align: "center",
          signIndex: 21,
          sortable:false
        },
        {
          id: 23,
          label: "实发工资",
          prop: "real_wages",
          width: "145",
          align: "center",
          signIndex: 22,
          sortable:false
        }
      ],
      canRendererTableHeader: null
    }
  },
  methods: {
    // 查询
    onSubmit(form) {
      this.queryform.user_ids = form
      this.loadData();
    },
    // 返回详情
    backDetail() {
      this.$emit('on-back')
    },
    // 加载数据
    loadData() {
      this.loading = true
      let params = {
        main_id: this.main_id,
        user_ids: this.queryform.user_ids,
        page_index: 1,
        page_size: 0
      }
      this.$client.GetSendDetailOaWage(params).then(req => {
        this.loading = false
        if (req.head.result == "200") {
            this.data = req.context.list.records
            this.count = req.context.summary.count
            this.money = req.context.summary.money
          } else {
            this.$message({
              showClose: true,
              message: req.head.describle,
              type: "error",
            });
          }
      }).catch(err => {
        this.loading = false
        return false
        // this.$message({
        //   showClose: true,
        //   message: err,
        //   type: "error",
        // });
      })
    },
    // 勾选中的
    selectedList(list) {
      this.selectedIds = [];
      if(list && list.length > 0) {
        list.forEach((item,index) => {
          this.selectedIds.push(item.id)
        });
      }
    },
    // 导出Excel
    exportFile(){
      let params = {
        main_id: this.main_id,
        user_ids: this.queryform.user_ids,
        page_index: 1,
        page_size: 0
      }
      let ids = [ ...this.selectedIds ]
      if(ids.length) {
        params.ids = ids.toString()
      }
      this.$client.ExportOaWage(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })

    },
    // 计算表格高度 和初始化表头
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$refs.payrollRecord.offsetHeight;
        let th = this.$refs.recordHead.$el.offsetHeight;
        this.TableHeight = maxh - th - 70;
      }, 60);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.payroll-record {
  height: 100%;
  width: 100%;

  .top {
    display: flex;
    height: 30px;

    p {
      width: calc(100% - 56px);
      display: flex;
      align-items: center;
      justify-content: center;
    }

  }
}
</style>

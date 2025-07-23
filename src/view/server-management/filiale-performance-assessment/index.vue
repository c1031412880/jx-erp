<template>
  <div class="filiale-performance-assessment">
    <sub-req
        ref="head"
        @export-file="exportFile"
        @on-ok="onSubmit"></sub-req>
    <tr-table
      :data="data"
      :tableHeaderList="customSettingList"
      :TableHeight="TableHeight"
      :loading="loading">
    </tr-table>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
export default {
  name: "filiale-performance-assessment",
  components: {
    subReq
  },
  mounted() {
    this.setHead();
    window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
      this.setHead()
    })
  },
  data() {
    return {
      data: [],
      loading: false,
      TableHeight: 500,
      customSettingList: [
        {
          id: 1,
          label: "考核周期",
          prop: "period",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable:false
        },
        {
          id: 2,
          label: "分公司",
          prop: "company_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable:false
        },
        {
          id: 3,
          label: "营运收入",
          prop: "income",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable:false
        },
        {
          id: 4,
          label: "发车班次数",
          prop: "classes",
          width: "120",
          align: "center",
          signIndex: 3,
          sortable:false
        },
        {
          id: 5,
          label: "发车准点率",
          prop: "on_time_rate",
          width: "160",
          align: "center",
          signIndex: 4,
          sortable:false
        },
        {
          id: 6,
          label: "有责投诉数",
          prop: "duty_count",
          width: "120",
          align: "center",
          signIndex: 5,
          sortable:false
        },
        {
          id: 6,
          label: "有责事故车损费用",
          prop: "fee_sum",
          width: "140",
          align: "center",
          signIndex: 5,
          sortable:false
        },
        {
          id: 6,
          label: "交通违法数量",
          prop: "traffic_count",
          width: "120",
          align: "center",
          signIndex: 5,
          sortable:false
        }
      ],
    }
  },
  methods: {
    onSubmit(form) {
      this.form = form;
      // this.pageInfo.pageIndex = 1;
      // this.pageInfo.pageCount = 0;
      this.loadData()
    },
    // 加载数据
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      this.$client.ListBranchCompanyPerformanceAssessment(params)
        .then(res => {
          this.loading = false;
          if (res.head.result == "200") {
            this.data = res.context
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
           this.loading = false;
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    // 导出
    exportFile() {
      let params = Object.assign({},this.form);
        this.$client.ExportBranchCompanyPerformanceAssessment(params)
        .then(res => {
          if(res.head.result == '200') {
            window.location.href = res.context
            this.$message({type: 'success', message: '导出成功'})
          }else{
            this.$message({type: 'error', message: '导出失败'})
          }
        })
    },
    // 计算表格高度
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let th = this.$refs.head.$el.offsetHeight
        this.TableHeight = maxh - th;
        // console.log(maxh, th);
      }, 60)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.filiale-performance-assessment {
  height: 100%;
  width: 100%;
}
</style>

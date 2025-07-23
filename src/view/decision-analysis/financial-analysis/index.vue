<template>
  <div class="financial-analysis">
    <sub-req ref="head"
      @on-add="addInfo"
      @on-ok="onSubmit"
      @on-import="openfiledialog"
      @on-export="exportFile"
    ></sub-req>
    <div style="margin-bottom: 25px;">
      <overview-info
      :toolData="toolData"
      @on-ok="onSubmit"></overview-info>
    </div>
    <h1 style="text-align:center;margin-bottom: 20px; font-size: 24px;" ref="titleTable">{{!!form.department_name? form.department_name:'温州长安集团'}}财务分析表<span v-if="!!form.month">({{form.month}})</span></h1>
    <tr-table
      ref="table"
      :selectionShow="false"
      :indexShow="false"
      :data="data"
      :stripe="false"
      :spanMethodType="['column']"
      :rowspanObj="rowspanObj"
      :mergekeys="mergekeys"
      :tableHeaderList="canRendererTableHeader"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      :isShowSummary="true"
      :summaryText="'利润总额'"
      :sumTotal="sumTotal"
      :sumColumnIndex="[2,3,7]"
      @on-select-change-row="selectedCurList">
      <template slot-scope="scope" slot="cur_rate">
        <span v-if="!!scope.data.cur_rate">{{scope.data.cur_rate}}%</span>
        <span v-else>0</span>
      </template>
      <template slot-scope="scope" slot="year_on_year">
        <span v-if="!!scope.data.year_on_year">{{scope.data.year_on_year}}%</span>
        <span v-else>0</span>
      </template>
      <template slot-scope="scope" slot="last_year_on_year">
        <span v-if="!!scope.data.last_year_on_year">{{scope.data.last_year_on_year}}%</span>
        <span v-else>0</span>
      </template>
      <template slot-scope="scope" slot="project">
        <span v-if="scope.data.project === '管理费用'" style="color: #409EFF;cursor: pointer;" @click="openAdministrativeExpensesDialog()">{{scope.data.project}}</span>
        <span v-else>{{scope.data.project}}</span>
      </template>
    </tr-table>
    <information-dialog
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      @save-administrative-expenses="saveAdministrativeExpenses"
    ></information-dialog>
   <administrative-expenses-dialog
      ref="administrativeExpensesDialog"
      :org_id="form.org_id"
      :month="form.month"
      :dialogBool.sync="administrativeExpensesDialogShow"
    ></administrative-expenses-dialog>
    <file-dialog
      :dialogBool.sync="filedialogVisible"
      :fileData="FileData"
      :typeMessage ="typeMessage"
      @on-submit-excel ="importExcel"
    ></file-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import overviewInfo from './component/overview-info'
  import subReq from './component/sub-req'
  import informationDialog from './component/information-dialog'
  import fileDialog from './component/file-dialog.vue'
  import administrativeExpensesDialog from './component/administrative-expenses-dialog'
  export default {
    name: "financial-analysis",
    components: {
      subReq,
      informationDialog,
      fileDialog,
      overviewInfo,
      administrativeExpensesDialog
    },
    data() {
      return {
        toolData: [
          {
            rate: 0,
            total: 0
          },
          {
            rate: 0,
            total: 0
          },
          {
            rate: 0,
            total: 0
          },
          {
            rate: 0,
            total: 0
          },
        ],
        vehDialogTitle: '',
        typeMessage: '公司同年-月份财务指标记录',
        filedialogVisible: false,
        FileData: {
          url:  `${window.newHttpConfig.URL_EASYMOCK}/Files/TempFiles/财务分析模板.xlsx`,
        },
        form: {
          month: '',
          org_id:'',
          department_name:''
        },
        data: [],
        loading: false,
        TableHeight: 500,
        informationDialogShow: false,
        administrativeExpensesDialogShow: false,
        curVehInfoList: [], //当前勾选中车辆信息
        customSettingList:[
          {
            id: 1,
            label: "",
            prop: "type",
            width: "120",
            align: "center",
            signIndex:0,
            sortable:false
          },
          {
            id: 2,
            label: "项目",
            prop: "project",
            width: "120",
            align: "center",
            signIndex:1,
            sortable:false
          },
          {
            id: 3,
            label: "指标数",
            prop: "index",
            width: "150",
            align: "center",
            signIndex:2,
            sortable:false
          },
          {
            id: 4,
            label: "本月数",
            prop: "cur_month",
            width: "150",
            align: "center",
            signIndex:3,
            sortable:false
          },
          {
            id: 5,
            label: "本月占比(%)",
            prop: "cur_rate",
            width: "130",
            align: "center",
            signIndex:4,
            sortable:false
          },
          {
            id: 6,
            label: "去年同期数",
            prop: "last_year",
            width: "120",
            align: "center",
            signIndex:5,
            sortable:false
          },
          {
            id: 7,
            label: "同比增减率(%)",
            prop: "year_on_year",
            width: "160",
            align: "center",
            signIndex:6,
            sortable:false
          },
          {
            id: 8,
            label: "本年累计数",
            prop: "cur_year_total",
            width: "150",
            align: "center",
            signIndex:7,
            sortable:false
          },
          {
            id: 9,
            label: "去年同期累计数",
            prop: "last_year_total",
            width: "150",
            align: "center",
            signIndex:8,
            sortable:false
          },
          {
            id: 10,
            label: "同比增减率(%)",
            prop: "last_year_on_year",
            width: "150",
            align: "center",
            signIndex:9,
            sortable:false
          },
        ],
        frontFixedNum:1, //前几行固定
        backFixedNum:0, //后几行固定
        canRendererTableHeader: null,
        // 要纵向合并的单元格的key数组
        mergekeys: ['type'],
        rowspanObj:{},
        sumTotal:{ //约定某一列汇总合计自定义数据
          2:'',
          3: '',
          7: '',
        },
      }
    },
    mounted() {
      this.$nextTick(() => {
        window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
          this.setHead()
        })
        this.setHead('initialize')
      })
    },
    methods: {
      // 导入Excel
      importExcel(exportInfo){
        let formData = new FormData();
        formData.append("file", exportInfo.file);
        formData.append("type", exportInfo.radio);
        formData.append("org_id", exportInfo.org_id);
        formData.append("month", exportInfo.month);
        let params = formData
        this.$client.ImportFinanceAnalysis(params)
          .then(res => {
            if(res.head.result == "200") {
              this.filedialogVisible = false;
              this.$message({ message: res.head.describle, type: "success" });
            }else{
              this.filedialogVisible = false;
              let errorData = [];
              const h = this.$createElement;
              errorData.push(h('p',null,res.head.describle));
              this.$msgbox({
                title: '提示',
                message: h('div',null, errorData),
                confirmButtonText: '确定',
              })
              // this.$message({ message: res.head.describle, type: "error" });
            }
          })
      },
      // 导出Excel 文件
      exportFile(){
        let params = Object.assign({}, this.form);
        this.$client.ExportFinanceAnalysis(params).then(res => {
          if(res.head.result == '200') {
            window.location.href = res.context
            this.$message({type: 'success', message: '导出成功'})
          }else{
            this.$message({type: 'error', message: '导出失败'})
          }
        })
      },
      // 打开导入文件弹窗
      openfiledialog(){
        this.filedialogVisible = true
      },
      onSubmit(form) {
        this.form = form
        this.loadData()
      },
      // 数据加载
      loadData() {
        this.loading = true
        let params = Object.assign({},this.form);
        this.$client.ListFinanceAnalysis(params).then(req => {
          this.loading = false
          if (req.head.result === '200') {
            if(!!req.context.tables){
              this.data = req.context.tables
              let lastInfo = this.data.pop();
              this.sumTotal = {
                  2 : lastInfo.index,
                  3 : lastInfo.cur_month,
                  7 : lastInfo.cur_year_total,
                }
              this.rowspanObj = this.$handleTableSpan(this.mergekeys, this.data)
            }
            if(!!req.context.summary && req.context.summary.length) {
              this.toolData = req.context.summary
            }
          }else{
            this.data = [];
            this.$message({
              showClose: true,
              message: req.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
          this.loading = false
          this.data = [];
          console.log(err)
        })
      },
      // 统计数据查询
      loadOverview() {
        this.$client.GetCountVehicleManager({}).then(req => {
          if (req.head.result === '200') {
            this.toolData = req.context
            this.toolData.car_num = this.toolData.car_num - this.toolData.scrap_num
          }
        })
      },
      // 打开经营指标设定
      addInfo() {
        this.informationDialogShow = true;
      },
      // 勾选中当前的车辆信息
      selectedCurList(val) {
        console.log(val)
        this.curVehInfoList = val;
      },
      // 打开费用管理
      openAdministrativeExpensesDialog() {
        this.administrativeExpensesDialogShow = true
      },
      //保存经营指标设定
      saveAdministrativeExpenses(form) {
        let params = {context: form};
        this.$client.AddOrEditFinanceAnalysis(params).then(req => {
          if (req.head.result === '200') {
            this.loadData()
            this.informationDialogShow = false
            this.$message({type: 'success', message: '操作成功'})
          }
          else{
            this.$message({type: 'error', message: '操作失败'})
          }
        })

      },
      // 计算表格高度
      setHead(type) {
        if(type == 'initialize') {
          this.canRendererTableHeader = this.customSettingList;
        }
        setTimeout(() => {
          let maxh = this.$el.offsetHeight
          let th = this.$refs.head.$el.offsetHeight
          // let titleTableTh = this.$refs.titleTable.$el.offsetHeight
          this.TableHeight = maxh - th - 163 - 50
          console.log(this.TableHeight)
        }, 60)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .financial-analysis
    width 100%
    height 100%
</style>

<template>
  <div class="passenger-complaint-prasie-statistics">
    <sub-req ref="head" @on-ok="onSubmit" @on-export="onExportForm"></sub-req>
    <el-card style="margin-bottom: 10px" v-loading="chartLoading" shadow="hover">
      <div slot="header" class="clearfix">
        <span>{{form.begin}} 至 {{form.end}}
          共受理工单: {{summary.total_acceptance}}件
          包含投诉：{{summary.total_complaint}}件
        </span>
        <!-- 已处理 ：{{summary.total_dispose}}件 -->
      </div>
      <div class="show-flex-box-r" style="width: 100%;">
        <div style="width: 30%; margin-right: 5%" :style="`${index == 2? 'margin-right: 0%':''}`" v-for="(item,index) in pieDataList" :key="index">
          <pie-chart :ref="`pieChart_${index}`" :seriesData="item" @item-click="itemClick"></pie-chart>
        </div>
      </div>
    </el-card>
    <el-tabs v-model="activeName">
      <el-tab-pane label="工单数据总览" name="first">
        <tr-table
          :selectionShow="false"
          :data="workOrderData"
          :tableHeaderList="firstTableHeaderList"
          :TableHeight="firstTableHeight"
          :loading="chartLoading"
          :isShowSummary="true"
          :omitColumnIndex="[1]"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="backFixedNum"
          :isFixedEmptyPlaceholder="false">
          <template slot-scope="scope" slot="duty_count">
            <el-link type="primary" @click="jumpQuery(scope.data, 'duty_count')">{{scope.data.duty_count}}</el-link>
          </template>
          <template slot-scope="scope" slot="unduty_count">
            <el-link type="primary" @click="jumpQuery(scope.data, 'unduty_count')">{{scope.data.unduty_count}}</el-link>
          </template>
          <template slot-scope="scope" slot="consult_count">
            <el-link type="primary" @click="jumpQuery(scope.data, 'consult_count')">{{scope.data.consult_count}}</el-link>
          </template>
          <template slot-scope="scope" slot="suggest_count">
            <el-link type="primary" @click="jumpQuery(scope.data, 'suggest_count')">{{scope.data.suggest_count}}</el-link>
          </template>
          <template slot-scope="scope" slot="prise_count">
            <el-link type="primary" @click="jumpQuery(scope.data, 'prise_count')">{{scope.data.prise_count}}</el-link>
          </template>
        </tr-table>
      </el-tab-pane>
      <el-tab-pane label="有责投诉明细" name="second">
        <tr-table
          :selectionShow="false"
          :loading="loading"
          :data="dutyComplaintData"
          :tableHeaderList="secondTableHeaderList"
          :isShowBottomOptions="false"
          :TableHeight="secondTableHeight"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="backFixedNum"
          :isFixedEmptyPlaceholder="false"
        >
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
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from './component/sub-req'
import pieChart from './component/pie-chart'
export default {
  name: "passenger-complaint-prasie-statistics",
  components: {subReq, pieChart},
  data() {
    return {
      activeName: 'first',
      workOrderData: [],
      dutyComplaintData: [],
      firstTableHeight: 500,
      secondTableHeight: 458,
      chartLoading: false,
      loading: false,
      frontFixedNum: 1,
      backFixedNum: 1,
      // chartChange: true,
      form: {
        begin: '',
        end: ''
      },
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      summary: {
        total_acceptance: 0,
        total_complaint: 0,
        total_dispose: 0
      },
      pieDataList:[], //图标数据
      firstTableHeaderList: [
        {
          id: 1,
          label: "所属组织",
          prop: "department_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "投诉",
          prop: "complaint_count",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "超速",
          prop: "speed_count",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "寻物",
          prop: "lost_count",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "咨询",
          prop: "consult_count",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "建议",
          prop: "suggest_count",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "表扬",
          prop: "prise_count",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "国鸿",
          prop: "guohong_count",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "反映情况",
          prop: "reflect_count",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "其他",
          prop: "other_count",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        }        
      ],
      secondTableHeaderList: [
        {
          id: 1,
          label: "驾驶员",
          prop: "driver_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "所属组织",
          prop: "duty_department_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "线路",
          prop: "line_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "车牌号",
          prop: "lincense_plate_number",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "事发时间",
          prop: "year_month_str",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "事件简述",
          prop: "order_content",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "调查结果",
          prop: "result",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },       
        {
          id: 8,
          label: "奖罚依据",
          prop: "punish_str",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },       
        {
          id: 9,
          label: "加减分",
          prop: "score",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },       
        {
          id: 10,
          label: "奖罚款",
          prop: "fee",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        }    
      ]
    }
  },
  mounted() {
    this.$nextTick(() => {
      // this.setHead();
      // window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
      //     this.setHead()
      // })
    });
  },
  methods: {
    onSubmit(form) {
      this.form = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData()
      this.loadDutyComplaintData()
    },
    // 数据加载
    loadData() {
      this.pieDataList = [];
      this.chartLoading = true;
      let content = {};
      Object.assign(content, this.form)
      this.$client.GetPassengerServiceSummary(content).then(req => {
        this.chartLoading = false;
        if (req.head.result === "200") {
          let info = req.context;
          Object.assign(this.summary, info.chart_title)
          for (let key in info) {
            if (Object.hasOwnProperty.call(info, key)) {
              if(key == 'work_order_types' || key == 'complaint_rate' || key == 'duty_orgs') {
                let obj = {};
                switch (key) {
                  case 'work_order_types':
                    obj.title = '工单类型';
                    break;
                  case 'complaint_rate':
                    obj.title = '投诉占比';
                    break;
                  case 'duty_orgs':
                    obj.title = '责任部门';
                    break;
                }
                // obj.type = key

                if(!!info[key] && info[key].length > 0) {
                  info[key].forEach(element => {
                    element.type = key
                  });
                }

                obj.data = info[key]
                this.pieDataList.push(obj)
              }
            }
          }
          this.workOrderData = info.summary_table;

          console.log(this.pieDataList)

        } else {
          // this.data = [];
        }
      }).catch(err => {
        this.chartLoading = false;
      })

    },
    // 加载明细数据
    loadDutyComplaintData() {
      let params = Object.assign({},this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      params.order_type = [22908];  // 不知道哪个聪明蛋写的
      params.duty = 1;
      this.loading = true
      this.$client.listPassengerServiceManage(params).then(req => {
        this.loading = false
        if(req.head.result === "200") {
          this.dutyComplaintData = req.context.list
          this.pageInfo.pageCount = req.context.total
        }else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      }).catch(err => {
        this.loading = false;
      })
    },
    // 图形跳转查询
    itemClick(val) {
      let info = val.data;
      console.log(info);
      if(!!info) {
        if(info.name == "暂无数据") {
          this.$message({type: 'warning', message: '暂无数据,不支持跳转'})
          return
        }

        let query = {
          type: info.type || '',
          id: info.id || '',
          date: !!this.form.begin? [this.form.begin, this.form.end] :[],
          duty_department: this.form.duty_department
        }
        this.$router.push({
          name:'passenger-server-management',
          params: query
        })
      }
    },
    // 表格跳转查询
    jumpQuery(info,type) {
      console.log(info, type);
      let typeNum = '';
      let order_type = '';
      switch (type) {
        case 'duty_count':
          typeNum = 1;
          order_type = 22908;
          break;
        case 'unduty_count':
          typeNum = 2;
          order_type = 22908;
          break;
        case 'consult_count':
          order_type = 42268;
          break;
        case 'suggest_count':
          order_type = 42269;
          break;
        case 'prise_count':
          order_type = 22909;
          break;
      }
      let query = {
        type: 'tableJump',
        duty: typeNum,
        date: !!this.form.begin? [this.form.begin, this.form.end] :[],
        order_type: order_type,
        duty_department: info.department_id
      }
      this.$router.push({
        name:'passenger-server-management',
        params: query
      })
    },
    onExportForm() {
      const clineMap = {
        'first': 'exportPassengerServiceAnalysis',
        'second': 'exportDetailPassengerServiceAnalysis'
      }
      let params = Object.assign({},this.form);
      if(this.activeName === 'second') {
        params.duty = 1
        params.order_type = 22908;
        params.page_index = this.pageInfo.pageIndex
        params.page_size = this.pageInfo.pageSize
      }
      this.$client[clineMap[this.activeName]](params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx;
      this.loadDutyComplaintData();
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadDutyComplaintData();
    },
    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        // let maxh = this.$el.offsetHeight;
        // let th = this.$refs.head.$el.offsetHeight;
        // switch (this.activeName) {
        //   case 'first':
        //     this.firstTableHeight = maxh - th - 143
        //     break;
        //   case 'second':
        //     let ph = this.$refs.paginationH.$el.offsetHeight;
        //     this.secondTableHeight = maxh - th - ph - 143
        //     break;
        // }
      }, 60);
    },
  }
}
</script>

<style lang="scss" rel="stylesheet/stylus" scoped>
.passenger-complaint-prasie-statistics{
  width: 100%;
  height: 100%
}
$NumWidth: 100vw / 1920px;

  .show-flex-box-r{
    height: 300px * $NumWidth;
  }
</style>

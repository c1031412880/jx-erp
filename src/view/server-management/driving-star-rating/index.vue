<template>
  <div class="driving-star-rating">
    <sub-req
      ref="head"
      @export-file="exportFile"
      @on-ok="onSubmit"
    ></sub-req>
    <div class="show-flex-box-r" style="width: 100%; height: 400px">
      <div class="show-flex-box-r show-flex-center" style="width: 50%; flex-shrink: 0;" v-if="sourceData.series && sourceData.series.length">
        <bar-chart ref="barChart" :sourceData="sourceData"></bar-chart>
      </div>
      <div class="show-flex-box-r show-flex-center" style="width: 50%; flex-shrink: 0; padding-bottom: 50px;" v-if="seriesData.data && seriesData.data.length">
        <pie-chart ref="pieChart" :seriesData="seriesData"></pie-chart>
      </div>
      
    </div>
    <tr-table
      :selectionShow="false"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      :isFixedEmptyPlaceholder="false"
    >
      <template slot-scope="scope" slot="up_star">
        <div v-if="scope.data.up_star">
          <el-rate v-model="scope.data.up_star" :max="scope.data.up_star" :disabled="true" :colors="['#F56C6C','#F56C6C','#F56C6C']"></el-rate>
        </div>
        <div class="show-flex-box-r show-flex-center" v-else>
          <span>无</span>
        </div>
        
      </template>
      <template slot-scope="scope" slot="star">
        <div v-if="scope.data.star">
          <el-rate v-model="scope.data.star" :max="scope.data.star" :disabled="true" :colors="['#F56C6C','#F56C6C','#F56C6C']"></el-rate>
        </div>
        <div class="show-flex-box-r show-flex-center" v-else>
          <span>无</span>
        </div>
      </template>
      <template slot-scope="scope" slot="ex_change">
        <div v-if="scope.data.ex_change" :style="`color:${checkExChangeColor(scope.data)}`">{{scope.data.ex_change}}</div>

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
    <custom-setting
      :dialogBool.sync="customSettingVialogVisible"
      :customSettingList="customSettingList"
      :canRendererTableHeader="canRendererTableHeader"
      :customSettingShowList="customSettingShowList"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    ></custom-setting>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import pieChart from './component/pie-chart'
import barChart from './component/bar-chart'
export default {
  name: "driving-star-rating",
  components: {
    subReq,
    pieChart,
    barChart
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
      informationDialogShow: false,
      customSettingVialogVisible: false,
      curSelecedType: "",
      informationDialogTitle: "添加",
      drawerdialogVisible: false,
      customSettingList: [
        {
          id: 1,
          label: "考核周期",
          prop: "ex_str_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "驾驶员",
          prop: "ex_driver_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "所属组织",
          prop: "ex_company_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "上次星级",
          prop: "up_star",
          width: "130",
          align: "left",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "持续季度",
          prop: "keep",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "本次评定星级",
          prop: "star",
          width: "160",
          align: "left",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "变化情况",
          prop: "ex_change",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "入职天数",
          prop: "entry_day",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        {
          id: 9,
          label: "月均出勤天数",
          prop: "attend_day",
          width: "160",
          align: "center",
          signIndex: 8,
          sortable: true,
        },
        {
          id: 10,
          label: "考评得分",
          prop: "score",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: true,
        },
        {
          id: 11,
          label: "有责投诉数量",
          prop: "complaint_count",
          width: "180",
          align: "center",
          signIndex: 10,
          sortable: true,
        },
        {
          id: 12,
          label: "交通违法数量",
          prop: "violation_count",
          width: "180",
          align: "center",
          signIndex: 11,
          sortable: true,
        },
        {
          id: 13,
          label: "事故车损费用",
          prop: "accident_fee",
          width: "180",
          align: "center",
          signIndex: 12,
          sortable: true,
        },
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 0, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      filedialogVisible: false,
      seriesData:{
        title:'驾驶员星级比例',
        data:[]
      },
      sourceData:{
        source:[
          ['product', '无星', '1星', '2星', '3星'],

        ],
        series:[]
      },
      isFirstLoad: true
    };
  },
  mounted() {
    this.loadData();
    this.$nextTick(() => {
      this.setHead();
    });
  },
  methods: {
    updateTableHeader(newestTableHeaderList) {
      this.canRendererTableHeader = null;
      this.customSettingShowList = null;
      this.customSettingShowList = newestTableHeaderList;
      this.canRendererTableHeader = newestTableHeaderList.filter(item => item.isSelected).map((sing,index) => {
        let obj = {
          id: index +1,
          label: sing.label,
          prop: sing.prop,
          width: sing.width,
          align: sing.align,
          signIndex: index,
          sortable: sing.sortable,
        }
        return obj
      });
      this.$forceUpdate();
    },
    exportFile() {
      let params = Object.assign({},this.form);
        this.$client.ExportDriverStartSummary(params)
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
      this.$client.GetDriverStarSummaryDriverStartSummary(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            let info = res.context;
            this.data = info.table.list;
            this.pageInfo.pageCount = info.table.total;
            if(this.isFirstLoad) {
              this.seriesData.data = info.pie && info.pie.length? info.pie: [];
              this.bulidBarChart(info.chart)
              this.isFirstLoad = false
            }
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
    bulidBarChart(list) {
      if(list && list.length) {
        list.forEach(element => {
          let numberObj = { type: 'bar' }
          let num = Object.keys(element).length - 1;
          for (let index = 0; index < num; index++) {
            this.sourceData.series.push(numberObj)
          }
          let singleList = []
          Object.keys(element).forEach(keys => {
            singleList.push(element[keys])
          })
          this.sourceData.source.push(singleList)
        });

      }
      console.log(this.sourceData)
    },
    // 颜色
    checkExChangeColor(row) {
      let color = '';
      if(row.up_star < row.star) {
        color = '#70B603';
      }
      if(row.up_star > row.star) {
        color = '#F56C6C';
      }
      return color
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx;
      this.loadData();
    },
    restTableList() {
      this.form = {};
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
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
      this.canRendererTableHeader = this.customSettingList;
      // setTimeout(() => {
      //   let maxh = this.$el.offsetHeight;
      //   let th = this.$refs.head.$el.offsetHeight;
      //   this.TableHeight = maxh - th - 30 -300;
      // }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.driving-star-rating {
  width: 100%;
  height: 100%;
}
</style>

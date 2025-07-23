<template>
  <div class="accident-analysis">
    <sub-req @on-ok="onSubmit"></sub-req>
    <tool-list :toolData="toolData" @on-ok="toolClick"></tool-list>
    <el-row :gutter="20">
      <el-col :span="item.span || 24" v-for="(item,i) in data" :key="i" style="margin-bottom: 20px">
        <el-card v-loading="item.loading">
          <div
            slot="header"
            class="clearfix show-flex-box-r"
            style="height: 37px; flex-wrap: nowrap; align-items:center;">
            <h2 style="white-space:nowrap;font-size: 20px;font-weight: 700">{{item.title}}</h2>
          </div>
          <div class="card-box-item">
            <model-chart :data="item" :ref="item.refs" @on-chart-click="chartClickItem"></model-chart>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script type="text/ecmascript-6">
import toolList from './component/tool-list'
import modelChart from './component/model-chart'
import subReq from './component/sub-req'
import keyConfig from "../../../components/base/formModel/select/get-select-dictionaries/config";
export default {
  name: "accident-analysis",
  components: {toolList, modelChart, subReq},
  data() {
    return {
      data: [
        {
          title: '事故责任分析',
          span: 12,
          refs: 'getAccidentDutyAnalysisAccidentAnalysis',
          tage: 'play-chart',
          label: '',
          loading: false
        },
        {
          title: '事故原因分析',
          span: 12,
          refs: 'getAccidentReasonAnalysisAccidentAnalysis',
          tage: 'bar-chart',
          loading: false
        },
        {
          title: '事故驾驶员分析',
          span: 24,
          refs: 'getAccidentDriverAnalysisAccidentAnalysis',
          tage: '',
          loading: false,
          children: [
            {
              label: '驾龄分析',
              refs: 'driving_years',
              tage: 'play-chart'
            },
            {
              label: '年龄分析',
              refs: 'ages',
              tage: 'play-chart'
            },
            {
              label: '工龄分析',
              refs: 'working_years',
              tage: 'play-chart'
            }
          ]
        },
        {
          title: '事故易发时段',
          span: 12,
          refs: 'getAccidentTimeAnalysisAccidentAnalysis',
          tage: 'online-chart',
          loading: false
        },
        {
          title: '事故易发路段',
          span: 12,
          refs: 'getAccidentRoadAnalysisAccidentAnalysis',
          tage: 'bar-chart',
          loading: false
        }
      ],
      toolData: {},
      form: {},
      docOptionsMap: {}
    }
  },
  mounted() {
    this.loadDoc()
  },
  methods: {
    onSubmit(form) {
      this.form = form
      this.loadData()
    },
    chartClickItem(ref, item) {
      // 事故责任
      if (ref === 'getAccidentDutyAnalysisAccidentAnalysis') {
        let query = {
          accident_duty: item.name,
          date: [this.form.begin, this.form.end]
        }
        Object.assign(query, this.form)
        this.$router.push({
          name:'accident-manage',
          params: query
        })
      }
      // 事故发生时段
      if (ref === 'getAccidentTimeAnalysisAccidentAnalysis') {
        let query = {
          accident_hour: item.name,
          date: [this.form.begin, this.form.end]
        }
        Object.assign(query, this.form)
        this.$router.push({
          name:'accident-manage',
          params: query
        })
      }
    },
    loadDoc() {
      let context = []
      context.push('accident-zr')
      this.$client.getDictionaryDataBase({context: context}).then(req => {
        if (req.head.result === '200') {
          if (req.context.length) {
            let docOptions = req.context[0].dic_detls;
            docOptions.forEach(item => {
              this.docOptionsMap[item.c_name] = item.c_code
            })
          }
        }
      })
    },
    // 汇总跳转
    toolClick(item) {
      if (item.label === '事故总数') {
        let query = {
          date: [this.form.begin, this.form.end]
        }
        Object.assign(query, this.form)
        this.$router.push({
          name:'accident-manage',
          params: query
        })
      }
      if (item.label === '无责次数') {
        let query = {
          date: [this.form.begin, this.form.end],
          i_accident_duty: this.docOptionsMap['无责']
        }
        Object.assign(query, this.form)
        this.$router.push({
          name:'accident-manage',
          params: query
        })
      }
      if (item.label === '有责事故') {
        let query = {
          date: [this.form.begin, this.form.end],
          i_accident_duty: [this.docOptionsMap['全责'], this.docOptionsMap['主要责任'], this.docOptionsMap['次要责任'], this.docOptionsMap['同责']]
        }
        Object.assign(query, this.form)
        this.$router.push({
          name:'accident-manage',
          params: query
        })
      }
      if (item.label === '伤亡人数') {
        let query = {
          state: 2,
          date: [this.form.begin, this.form.end]
        }
        Object.assign(query, this.form)
        this.$router.push({
          name:'accident-manage',
          params: query,
          date: [this.form.begin, this.form.end]
        })
      }
    },
    loadData() {
      // 获取总数
      this.$client.getAccidentSummaryAccidentAnalysis(this.form).then(req => {
        console.log(req)
        if (req.head.result === '200') {
          let data = []
          let obj = {}
          data = req.context
          data.forEach(item => {
            obj[item.title] = item.count
          })
          this.toolData = obj
        }
      })
      this.data[0].loading = true
      // 获取事故责任分析
      this.$client.getAccidentDutyAnalysisAccidentAnalysis(this.form).then(req => {
        console.log(req, '获取事故责任分析')
        this.data[0].loading = false
        if (req.head.result === '200') {
          let data = []
          let label = []
          let num = 0
          data = req.context
          data.forEach(item => {
            label.push(item.name)
            num = item.value + num
          })
          this.$refs['getAccidentDutyAnalysisAccidentAnalysis'][0].setData({
            refs: 'getAccidentDutyAnalysisAccidentAnalysis',
            obj: {
              label: label,
              data: data,
              num: num,
              title: '事故总数'
            }
          })
        }
      })

      this.data[1].loading = true
      // 获取事故原因分析
      this.$client.getAccidentReasonAnalysisAccidentAnalysis(this.form).then(req => {
        console.log(req)
        this.data[1].loading = false
        if (req.head.result === '200') {
          let data = []
          let label = []
          req.context.forEach(item => {
            label.push(item.name)
            data.push(item.value)
          })
          this.$refs['getAccidentReasonAnalysisAccidentAnalysis'][0].setData({
            refs: 'getAccidentReasonAnalysisAccidentAnalysis',
            obj: {
              label: label,
              data: data
            }
          })
        }
      })

      this.data[2].loading = true
      // 获取事故驾驶员分析
      this.$client.getAccidentDriverAnalysisAccidentAnalysis(this.form).then(req => {
        console.log(req, '事故驾驶员')
        this.data[2].loading = false
        if (req.head.result === '200') {
          let obj = req.context
          Object.keys(req.context).forEach(key => {
            let data = []
            let label = []
            let num = obj[key].average
            data = obj[key].summary
            data.forEach(item => {
              label.push(item.name)
            })
            this.$refs['getAccidentDriverAnalysisAccidentAnalysis'][0].setData({
              refs: 'getAccidentDriverAnalysisAccidentAnalysis',
              obj: {
                refs: key,
                label: label,
                data: data,
                num: num,
                title: key === 'driving_years' ? '平均驾龄' : key === 'ages' ? '平均年龄' : '平均工龄'
              }
            })
          })
        }
      })

      this.data[3].loading = true
      // 获取事故易发时间分析
      this.$client.getAccidentTimeAnalysisAccidentAnalysis(this.form).then(req => {
        console.log(req)
        this.data[3].loading = false
        if (req.head.result === '200') {
          let data = []
          let label = []
          req.context.forEach(item => {
            label.push(item.name)
            data.push(item.value)
          })
          this.$refs['getAccidentTimeAnalysisAccidentAnalysis'][0].setData({
            refs: 'getAccidentTimeAnalysisAccidentAnalysis',
            obj: {
              label: label,
              data: data
            }
          })
        }
      })

      this.data[4].loading = true
      // 获取事故易发路段分析
      this.$client.getAccidentRoadAnalysisAccidentAnalysis(this.form).then(req => {
        console.log(req)
        this.data[4].loading = false
        if (req.head.result === '200') {
          let data = []
          let label = []
          req.context.forEach(item => {
            label.push(item.name)
            data.push(item.value)
          })
          this.$refs['getAccidentRoadAnalysisAccidentAnalysis'][0].setData({
            refs: 'getAccidentRoadAnalysisAccidentAnalysis',
            obj: {
              label: label,
              data: data
            }
          })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$NumWidth: 100vw / 1920px;
.accident-analysis{
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  padding: 0 5px;
  .card-box-item{
    height: 300px * $NumWidth;
  }
}
</style>

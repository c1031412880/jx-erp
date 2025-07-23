<template>
  <div class="personnel-analysis">
    <el-row span="24" ref="head">
      <el-radio-group ref="elRadioGroup" v-model="showCollapse" style="margin-bottom: 20px;" size="mini">
        <el-radio-button :label="'first'">员工分析</el-radio-button>
        <el-radio-button :label="'second'">驾驶员分析</el-radio-button>
      </el-radio-group>
    </el-row>
    <div>
      <!-- :style="`height:${TableHeight}px;overflow-y: scroll;overflow-x: hidden;`" -->
      <el-row :gutter="10">
        <el-col style="margin-bottom: 10px" :span="12">
          <el-card v-loading="data[0].loading">
            <div slot="header"  class="clearfix">
              <span style="flex:1; flex-wrap: nowrap; font-weight: 600;">{{data[0].title}}</span>
              <sub-req ref="head" @on-ok="onSubmit" :employmentlist="employmentlist" :type="'1'"></sub-req>
            </div>
            <model-chart :data="data[0]" ref="personnelChart"></model-chart>
          </el-card>
        </el-col>
        <el-col style="margin-bottom: 10px" :span="12">
          <el-card v-loading="data[1].loading">
            <div slot="header"  class="clearfix">
              <span style="flex:1; flex-wrap: nowrap; font-weight: 600;">{{data[1].title}}</span>
            </div>
            <model-chart :data="data[1]" ref="manAndWomanNum"></model-chart>
          </el-card>
        </el-col>
        <el-col style="margin-bottom: 10px" :span="12">
          <el-card v-loading="data[2].loading">
            <div slot="header"  class="clearfix">
              <span style="flex:1; flex-wrap: nowrap; font-weight: 600;">{{data[2].title}}</span>
            </div>
            <model-chart :data="data[2]" ref="AgeRangeDistribute"></model-chart>
          </el-card>
        </el-col>
        <el-col style="margin-bottom: 10px" :span="12">
          <el-card v-loading="data[3].loading">
            <div slot="header"  class="clearfix">
              <span style="flex:1; flex-wrap: nowrap; font-weight: 600;">{{data[3].title}}</span>
            </div>
            <model-chart :data="data[3]" ref="personVehicleNum"></model-chart>
          </el-card>
        </el-col>
      </el-row>
      <staff-person-analysis :showCollapse="showCollapse"></staff-person-analysis>
    </div>
    
  </div>
</template>

<script type="text/ecmascript-6">
import modelChart from './component/model-chart'
import staffPersonAnalysis from './component/staff-person-analysis'
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import subReq from "./component/sub-req";
export default {
  name: "personnel-analysis",
  components: { modelChart, getDepartmentSelect,staffPersonAnalysis,subReq },
  data() {
    return {
      showCollapse: 'first',
      form: {
        is_driver: 0,
        type: 1,
        query_condition: ''
      },
      data: [
        {
          title: '人员情况图',
          span: 12,
          refs: 'personnelChart',
          tage: 'play-chart',
          loading: false
        },
        {
          title: '男女数量图',
          span: 12,
          refs: 'manAndWomanNum',
          tage: 'bar-chart',
          loading: false
        },
        {
          title: '年龄范围分布图',
          span: 12,
          refs: 'AgeRangeDistribute',
          tage: 'online-chart',
          loading: false
        },
        {
          title: '人车数量图',
          span: 12,
          refs: 'personVehicleNum',
          tage: 'bar-chart',
          loading: false
        },
      ],
      TableHeight: 500,
      employmentlist: []
    }
  },
  watch:{
    showCollapse() {
      this.loadData()
    }
  },
  mounted() {
    this.getDictionaryDataBase()

    this.QueryEmpTypeEmployeeAnalysis(this.form)
    this.QueryEmpGenderEmployeeAnalysis()
    this.QueryEmpAgeEmployeeAnalysis()
    this.QueryEmpVehicleEmployeeAnalysis()
  },
  methods: {
    onSubmit(form,type) {
      let params = Object.assign({},form)
      params.is_driver = this.showCollapse == 'first'? 0:1
      switch (type) {
        case '1':
          this.QueryEmpTypeEmployeeAnalysis(params)
          break;
        case '2':
          this.QueryEmpGenderEmployeeAnalysis()
          break;
        case '3':
          this.QueryEmpAgeEmployeeAnalysis()
          break;
        case '4':
          this.QueryEmpVehicleEmployeeAnalysis()
          break;
        default:
          break;
      }
    },
    loadData() {
      let params = Object.assign({},this.form)
      params.is_driver = this.showCollapse == 'first'? 0:1
      this.QueryEmpTypeEmployeeAnalysis(params)
      this.QueryEmpGenderEmployeeAnalysis()
      this.QueryEmpAgeEmployeeAnalysis()
      this.QueryEmpVehicleEmployeeAnalysis()
    },
    // 人员情况图
    QueryEmpTypeEmployeeAnalysis(params) {
      this.data[0].loading = true
      this.$client.QueryEmpTypeEmployeeAnalysis(params).then(req => {
        // console.log(req,'获取人员情况图');
        this.data[0].loading = false
        if (req.head.result === '200') {
          let data = []
          let label = []
          let num = 0
          data = req.context
          req.context.forEach(item => {
            item.rate = item.value
            item.value = item.count
            num = item.count + num
            label.push(item.name)
          })
          this.$refs['personnelChart'].setData({
            refs: 'personnelChart',
            obj: {
              data: data,
              label: label,
              num: num,
              title: '总数'
            }
          })
        }
      })
    },
    // 男女数量图
    QueryEmpGenderEmployeeAnalysis() {
      let params = {
        is_driver: this.showCollapse == 'first'? 0:1
      }
      this.data[1].loading = true
      this.$client.QueryEmpGenderEmployeeAnalysis(params).then(req => {
        // console.log(req, '男女数量图')
        this.data[1].loading = false
        if (req.head.result === '200') {
          let label = [];
          let man_count =  [];
          let woman_count = [];
          req.context.forEach(item => {
            label.push(item.month);
            man_count.push(item.man_count);
            woman_count.push(item.woman_count);
          });
          this.$refs['manAndWomanNum'].setData({
            refs: 'manAndWomanNum',
            obj: {
              label: label,
              data1: man_count,
              data2: woman_count,
              title: [ '男生', '女生']
            }
          })
        }
      })
    },
    // 年龄范围分布图
    QueryEmpAgeEmployeeAnalysis() {
      let params = {
        is_driver: this.showCollapse == 'first'? 0:1
      }
      this.data[2].loading = true
      this.$client.QueryEmpAgeEmployeeAnalysis(params).then(req => {
        // console.log(req, '年龄范围分布图')
        this.data[2].loading = false
        if (req.head.result === '200') {
          let data = []
          let label = []
          req.context.forEach(item => {
            label.push(item.name)
            data.push(item.value)
          })
          this.$refs['AgeRangeDistribute'].setData({
            refs: 'AgeRangeDistribute',
            obj: {
              label: label,
              data: data,
              title: '人数'
            }
          })
        }
      })
    },
    // 人车数量图
    QueryEmpVehicleEmployeeAnalysis() {
      let params = {
        is_driver: this.showCollapse == 'first'? 0:1
      }
      this.data[3].loading = true
      this.$client.QueryEmpVehicleEmployeeAnalysis(params).then(req => {
        // console.log(req, '年龄范围分布图')
        this.data[3].loading = false
        if (req.head.result === '200') {
          let label = [];
          let people =  [];
          let car = [];
          req.context.forEach(item => {
            label.push(item.month);
            people.push(item.emp_cout);
            car.push(item.car_cout);
          });
          this.$refs['personVehicleNum'].setData({
              refs: 'personVehicleNum',
              obj: {
                label: label,
                data1: people,
                data2: car,
                title: [ '司机', '车辆']
              }
            })
        }
      })
    },
    //  获取数据字典 
    getDictionaryDataBase() {
      // 用工性质 
      let params = { 
        tenant_id: 0,
        key: 'employment_nature'
      }
      this.$client.byDictKey_center(params).then(req => {
        console.log('===',req);
        if (req.errcode == 200) {
          this.employmentlist = req.data
        }
      })
    },
    // 计算表格高度 和初始化表头
    setHead(type) {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        if(type =='first') {
          this.TableHeight = maxh - th + 30
        }else {
          this.TableHeight = maxh - th
        }
      }, 60);
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$NumWidth: 100vw / 1920px;
.personnel-analysis{
  width: 100%;

  /deep/ .el-card__body {
    height: 360px * $NumWidth;
    
  }
}

// /deep/ .el-input__inner {
//   height: 28px;
//   width: 160px;
// }

/deep/ .el-card__header {
  padding:  0 20px;
  height: 70px * $NumWidth;
  line-height: 70px * $NumWidth;
}

.clearfix {
  display: flex;
  align-items: center;
}
.searchSelect {
  display: flex;

  .btn-l {
    width: 180px * $NumWidth;
  }

  .btn-r {
    width: 270px * $NumWidth;
  }
}
</style>

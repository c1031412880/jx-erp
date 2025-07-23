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
      <el-row :gutter="10" v-if="showCollapse == 'first'">
        <el-col :span="item.span || 24" v-for="(item,i) in data" :key="i" style="margin-bottom: 10px" v-if="item.refs != 'personVehicleNum'">
          <el-card v-loading="item.loading">
            <div slot="header"  class="clearfix">
              <span style="flex:1; flex-wrap: nowrap; font-weight: 600;">{{item.title}}</span>
              <div class="searchSelect" v-if="item.refs === 'indicateTotalSalary'">
                <el-date-picker
                  v-model="form.year_month"
                  type="month"
                  class="btn-l"
                  @change="changeLoadData"
                  :value-format="'yyyy-MM'"
                  placeholder="选择月">
                </el-date-picker>
                <get-department-select
                    ref="departmenTree"
                    class="btn-r"
                    v-model="form.org_id"
                    @on-change="changeLoadData"
                    :isShowCheckbox="false"
                    :placeholder="'请选择部门'"
                    :isContainEmp="false"
                    :isExportMultiple="false"
                  ></get-department-select>
              </div>
            </div>
            <model-chart :data="item" :ref="item.refs"></model-chart>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="10" v-if="showCollapse == 'second'">
        <el-col :span="item.span || 24" v-for="(item,i) in data" :key="i" style="margin-bottom: 10px" v-if="item.refs != 'socialSecurityInsuredRate'">
          <el-card v-loading="item.loading">
            <div slot="header"  class="clearfix">
              <span style="flex:1; flex-wrap: nowrap; font-weight: 600;">{{item.title}}</span>
              <div class="searchSelect" v-if="item.refs === 'indicateTotalSalary'">
                <el-date-picker
                  v-model="form.year_month"
                  type="month"
                  class="btn-l"
                  @change="changeLoadData"
                  :value-format="'yyyy-MM'"
                  placeholder="选择月">
                </el-date-picker>
                <get-department-select
                    ref="departmenTree"
                    class="btn-r"
                    v-model="form.org_id"
                    @on-change="changeLoadData"
                    :isShowCheckbox="false"
                    :placeholder="'请选择部门'"
                    :isContainEmp="false"
                    :isExportMultiple="false"
                  ></get-department-select>
              </div>
            </div>
            <model-chart :data="item" :ref="item.refs"></model-chart>
          </el-card>
        </el-col>
      </el-row>
      <staff-person-analysis :showCollapse="showCollapse"></staff-person-analysis>
      <el-card class="card-box-t">
        <el-col :span="24" style="height: 360px; width: 100%">
          <onlines-chart ref="staffPersonAnalysis" v-loading="loading"></onlines-chart>
        </el-col>
      </el-card>
    </div>
    
  </div>
</template>

<script type="text/ecmascript-6">
import onlinesChart from './component/onlines-chart'
import modelChart from './component/model-chart'
import staffPersonAnalysis from './component/staff-person-analysis'
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  name: "personnel-analysis",
  components: { modelChart, getDepartmentSelect,staffPersonAnalysis,onlinesChart },
  data() {
    return {
      showCollapse: 'first',
      form: {
        year_month: new Date().getFullYear() + '-0' + (new Date().getMonth() + 1),
        org_id: ''
      },
      loading: false,
      data: [
        {
          title: '人员情况图',
          span: 12,
          refs: 'personnelChart',
          tage: 'play-chart',
          loading: false
        },
        // {
        //   title: '薪资支出总额',
        //   span: 12,
        //   refs: 'indicateTotalSalary',
        //   tage: 'play-chart',
        //   loading: false
        // },
        {
          title: '人车数量图',
          span: 12,
          refs: 'personVehicleNum',
          tage: 'bar-chart',
          loading: false
        },
        {
          title: '男女数量图',
          span: 12,
          refs: 'manAndWomanNum',
          tage: 'bar-chart',
          loading: false
        },
        // {
        //   title: '薪资范围分布图',
        //   span: 12,
        //   refs: 'SalaryRangeDistribute',
        //   tage: 'online-chart',
        //   loading: false
        // },
        {
          title: '年龄范围分布图',
          span: 12,
          refs: 'AgeRangeDistribute',
          tage: 'online-chart',
          loading: false
        },
        // {
        //   title: '社保参保率',
        //   span: 12,
        //   refs: 'socialSecurityInsuredRate',
        //   tage: 'online-chart',
        //   loading: false
        // }
      ],
      TableHeight: 500
    }
  },
  watch:{
    showCollapse() {
      // alert(111)
      this.changeLoadData()
      this.loadData()
    }
  },
  mounted() {
    this.changeLoadData()
    this.loadData()
    // this.$nextTick(() => {
    //   this.setHead('first');
    //   window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
    //     this.setHead('second')
    //   })
    // });
  },
  methods: {
    changeLoadData() {
      let params = Object.assign({}, this.form)
      params.is_driver = this.showCollapse == 'first'? 0:1
      this.data[1].loading = true
      this.$client.QueryEmpPayExpendEmployeeAnalysis(params).then(req => {
        // console.log(req,'获取薪资支出总额');
        this.data[1].loading = false
        if (req.head.result === '200') {
          let data = []
          let label = []
          let num = 0
          data = req.context
          req.context.forEach(item => {
            num = item.value + num
            label.push(item.name)
          })
          this.$refs['indicateTotalSalary'][0].setData({
            refs: 'indicateTotalSalary',
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
    loadData() {
      this.data[0].loading = true
      let params = {
        is_driver : this.showCollapse == 'first'? 0:1
      }
      this.$client.QueryEmpTypeEmployeeAnalysis(params).then(req => {
        // console.log(req,'获取人员情况图');
        this.data[0].loading = false
        if (req.head.result === '200') {
          let data = []
          let label = []
          let num = 0
          data = req.context
          req.context.forEach(item => {
            num = item.value + num
            label.push(item.name)
          })
          this.$refs['personnelChart'][0].setData({
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

      this.data[2].loading = true
      this.$client.QueryEmpVehicleEmployeeAnalysis().then(req => {
        // console.log(req, '人车数量图')
        this.data[2].loading = false
        if (req.head.result === '200') {        
          let label = [];
          let people =  [];
          let car = [];
          req.context.forEach(item => {
            label.push(item.month);
            people.push(item.emp_cout);
            car.push(item.car_cout);
          });
          if(this.showCollapse == 'second') {
            this.$refs['personVehicleNum'][0].setData({
              refs: 'personVehicleNum',
              obj: {
                label: label,
                data1: people,
                data2: car,
                title: [ '司机', '车辆']
              }
            })
          }
          
        }
      })

      this.data[3].loading = true
      this.$client.QueryEmpGenderEmployeeAnalysis(params).then(req => {
        // console.log(req, '男女数量图')
        this.data[3].loading = false
        if (req.head.result === '200') {
          let label = [];
          let man_count =  [];
          let woman_count = [];
          req.context.forEach(item => {
            label.push(item.month);
            man_count.push(item.man_count);
            woman_count.push(item.woman_count);
          });
          this.$refs['manAndWomanNum'][0].setData({
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

      this.data[4].loading = true
      this.$client.QueryEmpSalaryEmployeeAnalysis(params).then(req => {
        // console.log(req, '薪资范围分布图')
        this.data[4].loading = false
        if (req.head.result === '200') {
          let data = []
          let label = []
          req.context.forEach(item => {
            label.push(item.name)
            data.push(item.value)
          })
          this.$refs['SalaryRangeDistribute'][0].setData({
            refs: 'SalaryRangeDistribute',
            obj: {
              label: label,
              data: data,
              title: '人数',
              reg: 30
            }
          })
        }
      })

      this.data[5].loading = true
      this.$client.QueryEmpAgeEmployeeAnalysis(params).then(req => {
        // console.log(req, '年龄范围分布图')
        this.data[5].loading = false
        if (req.head.result === '200') {
          let data = []
          let label = []
          req.context.forEach(item => {
            label.push(item.name)
            data.push(item.value)
          })
          this.$refs['AgeRangeDistribute'][0].setData({
            refs: 'AgeRangeDistribute',
            obj: {
              label: label,
              data: data,
              title: '人数'
            }
          })
        }
      })

      this.data[6].loading = true
      this.$client.QueryEmpSocialRateEmployeeAnalysis(params).then(req => {
        // console.log(req, '社保参保率')
        this.data[6].loading = false
        if (req.head.result === '200') {
          let data = []
          let label = []
          req.context.forEach(item => {
            label.push(item.name)
            data.push(item.value)
          })
          if(this.showCollapse == 'first') {
            this.$refs['socialSecurityInsuredRate'][0].setData({
              refs: 'socialSecurityInsuredRate',
              obj: {
                label: label,
                data: data,
                title: '参保率'
              }
            })
          }
          
        }
      })

      this.loading = true
      this.$client.QueryEmpDimissionAnalysisEmployeeAnalysis(params).then(req => {
        this.loading = false
        if(req.head.result === '200') {
          // console.log('离职分析', req);
          let label = [];
          let dimission =  [];
          let join = [];
          req.context.forEach(item => {
            label.push(item.month);
            dimission.push(item.dimission_count);
            join.push(item.join_count);
          });
          // console.log(label, dimission, join);
          this.$refs.staffPersonAnalysis.setOptions({
            label: label,
            data1: dimission,
            data2: join,
            title: [ '离职人数/人', '入职人数/人']
          })
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
        // console.log(th)
        // console.log(this.TableHeight)
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

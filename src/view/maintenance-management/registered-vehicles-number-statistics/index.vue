<template>
  <div class="registered-vehicles-number-statistics">
    <sub-req 
      ref="head" 
      @on-ok="onSubmit" 
      @on-btn-export="exportFile"
      @on-btn-population="population">
    </sub-req>
    <tr-table
      ref="table"
      :indexShow="true"
      :selectionShow="false"
      :data="data"
      :tableHeaderList="customSettingList"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
      :spanMethodType="['column']"
      :rowspanObj="rowspanObj"
      :mergekeys="mergekeys"
      :isShowSummary="true"
      :omitColumnIndex='omitColumnIndex'
      >
    </tr-table>
    <p style="height: 30px; font-size: 12px; color: #999999; text-align: center;padding: 5px 0;">{{`标台折算方法: < 7 按 0.7 计算; >= 7 且 < 10 按 1 计算; >= 10 且 < 13 按 1.3 计算; 双层按 1.9 计算; `}}</p>

    <el-dialog
      title="常住人口数"
      :visible.sync="dialogVisible"
      width="760px">
      <div>
        <el-button type="primary" size="mini" @click="addPersonCount">添加</el-button>
        <tr-table
          :selectionShow="false"
          :data="settingData"
          :tableHeaderList="canRendererTableHeader"
          :isShowBottomOptions="false"
          :TableHeight="500"
          :loading="false">
          <template slot-scope="scope" slot="operation">
            <el-button type="text" size="mini" @click="editPersonCount(scope.data)">编辑</el-button>
              <!-- @confirm="deleteRowInfo(scope.data)" -->
            <!-- <el-popconfirm
              title="确定删除此条记录吗？">
              <el-button slot="reference" type="text" size="mini" style="margin-left: 10px;">移除</el-button>
            </el-popconfirm> -->
          </template>
        </tr-table>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="UpdatePerson">保 存</el-button>
      </span> -->
    </el-dialog>
    <el-dialog
      width="530px"
      title="添加常住人口数"
      :visible.sync="innerVisible"
      append-to-body>
      <el-form ref="formData" :model="formData" :rules="rules" size="mini" label-width="140px" label-suffix=":">
        <el-form-item label="日期" prop="date">
          <el-date-picker
            v-model="date"
            type="daterange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="选择开始日期"
            end-placeholder="选择结束日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="常住人口数(万人)" prop="person_count">
          <el-input v-model="formData.person_count" placeholder="请输入常住人口数"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="formData.person_count = $event.target.value"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="innerVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveForm">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { getDate } from "@/utils/index";
import subReq from "./component/sub-req";
import common from '@/mixin/exportToExcel'
export default {
  name: "registered-vehicles-number-statistics",
  components: {
    subReq,
  },
  mixins: [common],
  data() {
    return {
      data: [],
      form: {},
      loading: false,
      TableHeight: 500,
      isShowSummary: true,
      customSettingList: [],
      settingData: [],
      customSettingList1: [
        {
          id: 1,
          label: "部门",
          align: "center",
          prop: "dept_name",
          width: '120',
          signIndex: 0,
        },
        {
          id: 2,
          label: "车辆数量",
          align: "center",
          prop: "vehicle_count_start",
          width: '120',
          signIndex: 1,
        },
        {
          id: 3,
          label: "调整",
          align: "center",
          prop: "vehicle_count_end",
          width: '120',
          signIndex: 2,
        },
      ],
      // 大客 
      customSettingList2: [],
      // 中客 
      customSettingList3:[],
      customSettingList4:[
        {
          label: "合计标准台",
          prop: "all_car_standard",
          width: "120",
          align: "center",
          id: 6,
          signIndex: 5,
        },
        {
          label: "汇总统计",
          prop: "all_max_car_total",
          width: "120",
          align: "center",
          id: 6,
          signIndex: 5,
          nestedTablesHeader: [
            {
              label: "大型车(数量)",
              prop: "all_max_car_total",
              width: "120",
              align: "center",
              id: 601,
              signIndex: 600,
              nestedTablesHeader: [
                {
                  label: "≥7米",
                  prop: "all_max_car_total",
                  width: "120",
                  align: "center",
                  id: 6011,
                  signIndex: 6010,
                },
              ]
            },
            {
              label: "大型车(标准台)",
              prop: "all_max_car_standard",
              width: "140",
              align: "center",
              id: 602,
              signIndex: 601,
              nestedTablesHeader: [
                {
                  label: "≥7米",
                  prop: "all_max_car_standard",
                  width: "140",
                  align: "center",
                  id: 6021,
                  signIndex: 6020,
                },
              ]
            },
            {
              label: "小型车(数量)",
              prop: "all_middle_car_total",
              width: "120",
              align: "center",
              id: 603,
              signIndex: 602,
              nestedTablesHeader: [
                {
                  label: "＜7米",
                  prop: "all_middle_car_total",
                  width: "120",
                  align: "center",
                  id: 6031,
                  signIndex: 6030,
                },
              ]
            },
            {
              label: "小型车(标准台)",
              prop: "all_middle_car_standard",
              width: "140",
              align: "center",
              id: 604,
              signIndex: 603,
              nestedTablesHeader: [
                {
                  label: "＜7米",
                  prop: "all_middle_car_standard",
                  width: "140",
                  align: "center",
                  id: 6041,
                  signIndex: 6040,
                },
              ]
            },
          ]
        },
        {
          label: "常住人口数(万人)",
          prop: "resident_population",
          width: "150",
          align: "center",
          id: 7,
          signIndex: 6,
        },
        {
          label: "每万人拥有车辆(标台)",
          prop: "person_10000_car_standard",
          width: "180",
          align: "center",
          id: 8,
          signIndex: 7,
        }
      ],
      rowspanObj: {},
      mergekeys: ['all_max_car_total','all_max_car_standard','all_middle_car_total','all_middle_car_standard','resident_population','person_10000_car_standard'],
      dialogVisible: false,
      innerVisible: false,
      omitColumnIndex: [1,2,3],
      canRendererTableHeader: [
        {
          id: 1,
          label: "人口数量(万人)",
          prop: "person_count",
          width: "100",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "开始日期",
          prop: "date_start",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "结束日期",
          prop: "date_end",
          width: "150",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "操作",
          prop: "operation",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
      ],
      date: '',
      formData: {
        person_count: '',
        date_start: '',
        date_end: '',
      },
      rules: {
        person_count: [
          { required: true, message: "请输入常住人口数", trigger: "change" },
        ],
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一年',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    }
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
      this.loadData()
    },
    // 获取数据
    loadData() {
      this.loading = true
      let params = Object.assign({}, this.form);
      this.$client.GetRegisteredVehicleReports(params).then(req => {
        this.loading = false
        if (req.head.result == "200") {
            let data = req.context.list            
            this.getNewData(data)
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      })
    },
    // 数据组装
    getNewData(data) {
      this.customSettingList2 = [
        {
          id: 4,
          label: "大客(0辆)",
          align: "center",
          prop: "oil_consume",
          signIndex: 3,
          nestedTablesHeader: []
        },
      ]
      this.customSettingList3 = [
        {
          id: 5,
          label: "中客(0辆)",
          align: "center",
          prop: "oil_consume",
          signIndex: 4,
          nestedTablesHeader: []
        },
      ]
      let obj = data.dept_reports_dic
      let daptName = []

      let maxCar = [] // 大客
      let midCar = [] // 中客
      for (const key in obj) {
        daptName.push(key)
        let childObj = obj[key]
        let reports = childObj.reports

        reports.forEach((item,index) => {
          // 如果长度大于6  归类于大客
          if (item.car_length > 6) {
            this.customSettingList2[0].label = `大客(${data.max_vehicle_total}辆)`
            let obj = {
              car_name_show: item.car_name_show,
              car_length_show: item.car_length_show,
              id: item.id,
              flag: item.flag,
              key: item.car_name_show + item.car_length_show
            }
            maxCar.push(obj)
          }else {
            this.customSettingList3[0].label = `中客(${data.small_vehicle_total}辆)`
            // 否则归类于 中客
            let obj = {
              car_name_show: item.car_name_show,
              car_length_show: item.car_length_show,
              id: item.id,
              flag: item.flag,
              key: item.car_name_show + item.car_length_show
            }
            midCar.push(obj)
          }
        });
      }
      // // 去重  
      maxCar = this.unique(maxCar)
      midCar = this.unique(midCar)
      this.getCustoms(maxCar,midCar)
      this.getList(maxCar,midCar,data)
    },
    // 组装表头
    getCustoms(maxCar,midCar) {
      // 大客数据
      let maxInfo = {}
      let customSettingList2 = []
      maxCar.forEach((item,index) => {
        if (maxInfo[item.car_name_show]) {
          customSettingList2.forEach(child => {
            if (child.label == item.car_name_show) {
              child.nestedTablesHeader.push({
                label: item.car_length_show,
                // prop: 'maxcar' + item.id,
                prop: item.flag,
                width: "120",
                align: "center",
                id: index + '011',
                signIndex: index + '010',
              })
            }
          })
        } else {
          let obj = {
            label: item.car_name_show,
            prop: "car_name_show",
            width: "120",
            align: "center",
            id: index + '01',
            signIndex: index + '00',
            nestedTablesHeader: [
              {
                label: item.car_length_show,
                // prop: 'maxcar' + item.id,
                prop: item.flag,
                width: "120",
                align: "center",
                id: index + '011',
                signIndex: index + '010',
              },
            ]
          }
          maxInfo[item.car_name_show] = true
          customSettingList2.push(obj)
        }
      })
      let maxList = [
        {
          id: customSettingList2.length + 4,
          label: "小计(辆)",
          align: "center",
          prop: "max_car_total",
          width: "120",
          signIndex: customSettingList2.length + 3,
        },
        {
          id: customSettingList2.length + 5,
          label: "大客标准台",
          align: "center",
          prop: "max_car_standard",
          width: "120",
          signIndex: customSettingList2.length + 4,
        },
      ]
      customSettingList2 = [...customSettingList2,...maxList]
      this.customSettingList2[0].nestedTablesHeader = customSettingList2
      // 中客数据
      let midInfo = {}
      let customSettingList3 = []
      midCar.forEach((item,index) => {
        if (midInfo[item.car_name_show]) {
          customSettingList3.forEach(child => {
            if (child.label == item.car_name_show) {
              child.nestedTablesHeader.push({
                label: item.car_length_show,
                // prop: 'midcar' + item.id,
                prop: item.flag,
                width: "120",
                align: "center",
                id: index + '011',
                signIndex: index + '010',
              })
            }
          })
        } else {
          let obj = {
            label: item.car_name_show,
            prop: "car_name_show",
            width: "120",
            align: "center",
            id: index + '01',
            signIndex: index + '00',
            nestedTablesHeader: [
              {
                label: item.car_length_show,
                // prop: 'midcar' + item.id,
                prop: item.flag,
                width: "120",
                align: "center",
                id: index + '011',
                signIndex: index + '010',
              },
            ]
          }
          midInfo[item.car_name_show] = true
          customSettingList3.push(obj)
        }
      })
      let midList = [
        {
          id: customSettingList3.length + 4,
          label: "小计(辆)",
          align: "center",
          prop: "middle_car_total",
          width: "120",
          signIndex: customSettingList3.length + 3,
        },
        {
          id: customSettingList3.length + 5,
          label: "中客标准台",
          align: "center",
          prop: "middle_car_standard",
          width: "120",
          signIndex: customSettingList3.length + 4,
        },
      ]
      customSettingList3 = [...customSettingList3,...midList]
      this.customSettingList3[0].nestedTablesHeader = customSettingList3

      this.customSettingList = [
        ...this.customSettingList1,
        ...this.customSettingList2,
        ...this.customSettingList3,
        ...this.customSettingList4,
      ]
      
      let L = this.flatArr(this.customSettingList).length
      this.omitColumnIndex = [1,2,3,L-5,L-4,L-3,L-2,L-1,L]
      console.log('customSettingList',JSON.parse(JSON.stringify(this.customSettingList)));
    },
    // 组装列表数据
    getList(maxCar,midCar,info) {
      let objStart = {
        dept_name: '',
        vehicle_count_start: '',
        vehicle_count_end: '',
      }
      let objEnd = {
        all_car_standard: '',
        all_max_car_total: info.all_max_car_total,
        all_max_car_standard: info.all_max_car_standard,
        all_middle_car_total: info.all_middle_car_total,
        all_middle_car_standard: info.all_middle_car_standard,
        resident_population: info.resident_population,
        person_10000_car_standard: info.person_10000_car_standard,
      }

      
      let maxObj = {}
      let midObj = {}
      maxCar.forEach((item,index) => {
        // maxObj['maxcar' + item.id] = ''
        maxObj[item.flag] = 0
      })
      let maxAmountObj = {
        max_car_total: '',
        max_car_standard: '',
      } 
      midCar.forEach((item,index) => {
        // midObj['midcar' + item.id] = ''
        midObj[item.flag] = 0
      })
      let midAmountObj = {
        middle_car_total: '',
        middle_car_standard: '',
      } 

      let carInfo = info.dept_reports_dic
      this.data = []
      for (const key in carInfo) {
        let obj = {...objStart,...maxObj,...maxAmountObj,...midObj,...midAmountObj,...objEnd}
        let t = carInfo[key]
        let reports = t.reports
        reports.forEach((item,index) => {
          obj.dept_name = item.dept_name
          obj.vehicle_count_start = item.vehicle_count_start
          obj.vehicle_count_end = item.vehicle_count_end

            // 根据唯一标识  flag 来赋值 
            for (const key in obj) {
              if (item.flag == key) {
                obj[key] += item.car_count
              }
            }

          // 根据字段名后面的id来匹配 动态赋值
          // for (const k in obj) {
          //   if (k.indexOf('maxcar') != -1 || k.indexOf('midcar') != -1) {
          //     let nameIndex = k.slice(-1)
          //     if (item.id == nameIndex) {
          //       obj[k] = item.car_count
          //     }
          //   }
          // }
        })
        obj.all_car_standard = t.all_car_standard
        obj.max_car_total = t.max_car_total
        obj.max_car_standard = t.max_car_standard
        obj.middle_car_total = t.middle_car_total
        obj.middle_car_standard = t.middle_car_standard

        this.data.push(obj)
      }
      console.log('data',JSON.parse(JSON.stringify(this.data)));

      this.rowspanObj = this.$handleTableSpan(this.mergekeys, this.data,'resident_population')
    },
    //去重
    unique(arr) {
      let map = new Map();
      for (let i of arr) {
        if (!map.has(i.key)) {
          map.set(i.key, i);
        }
      }
      return[...map.values()];
    },
    // 获取所有子类
    flatArr(arr,list = []) {
      arr.forEach(item => {
        if (item.nestedTablesHeader && item.nestedTablesHeader.length > 0) {
          return this.flatArr(item.nestedTablesHeader,list)
        } else {
          list.push(item)
        }
      })
      return list
    },
    // 导出Excel
    exportFile() {
      let table_dom = this.$refs['table'].$refs.table.$el
      this.exportToExcel(table_dom,'在册车辆标台数统计')
    },
    // 计算表格高度
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        this.TableHeight = maxh - th - 30;
      }, 60);
    },
    onSetTime(type = 'lastOneMonth') {
      let timeObj = getDate(type)
      this.formData.date_start = timeObj.startTime
      this.formData.date_end = timeObj.endTime
      this.date = [this.formData.date_start, this.formData.date_end]
    },
    // 获取常住人口数
    population() {
      this.$client.GetPersonRegisteredVehicleReport().then(res => {
        if (res.head.result == "200") {
          this.settingData = res.context
          this.dialogVisible = true
        } else {
          this.$message({ type: "error", message: res.head.describle });
        }
      });
    },
    addPersonCount() {
      this.innerVisible = true
      this.formData.id = 0
      this.onSetTime()
    },
    editPersonCount(row) {
      this.innerVisible = true
      this.formData.person_count = row.person_count
      this.formData.date_start = row.date_start
      this.formData.date_end = row.date_end
      this.formData.id = row.id
      this.date = [row.date_start, row.date_end]
    },
    saveForm() {
      if(!!this.date && this.date.length) {
        this.formData.date_start = this.date[0]
        this.formData.date_end = this.date[1]
      }else {
        this.$message({ type: "warning", message: '请选择日期' });
        return
      }
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          this.$client.UpdatePersonRegisteredVehicleReport(this.formData).then(res => {
            if (res.head.result == "200") {
              this.$message({ type: "success", message: res.head.describle });
              this.innerVisible = false
              this.population()
            } else {
              this.$message({ type: "error", message: res.head.describle });
            }
          });
        } else {
          return false;
        }
      });
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.registered-vehicles-number-statistics {
  height: 100%;
  width: 100%;
}
</style>

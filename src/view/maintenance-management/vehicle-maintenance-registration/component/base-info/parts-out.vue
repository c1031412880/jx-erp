<template>
  <div class="parts-out" style="height:50vh;overflow-x:hidden">
    <el-form ref="elForm" :model="formData"  size="mini" :inline="true">
      <el-form-item label="车牌号:">
        <p style="width:138px"> {{formData.vehicle_name}}</p>
      </el-form-item>
      <el-form-item label="出库日期:">
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="请选择日期范围"
          end-placeholder="请选择日期范围"
          @change="selectedTime"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label=" 出库单:" prop="d_be_elected">
        <el-select v-model="leave_num" clearable placeholder="请选择出库单">
          <el-option
            v-for="item in stockOutList"
            :key="item.id"
            :label="item.work_code"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getMaterialOrderList">查询</el-button>
      </el-form-item>
    </el-form>
    <tr-table
      ref="table"
      :data="data"
      :indexShow="true"
      :TableHeight="425"
      :selectionShow="false"
      :tableHeaderList="tableHeaderList"
      :isFixedEmptyPlaceholder="false">
      <!-- <template slot-scope="scope" slot="operation" >
        <el-button type="text">移除</el-button>
      </template> -->
    </tr-table>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getDate } from "@/utils/index";
  export default {
    props:{
      curChangeType:{
        type: String,
        default: 'add'
      }
    },
    data() {
      return {    
        data: [],
        date: [],
        work_code: '',
        leave_num: '',
        stockOutList: [],
        formData: {
          vehicle_name: '',
          start_date: '',
          end_date: '',
          lp_num: ''
        },
        tableHeaderList: [
          {
            id: 1,
            label: "出库日期",
            prop: "leave_date",
            width: "150",
            align: "center",
            signIndex: 0,
            sortable: true,
          },
          {
            id: 2,
            label: "物料编码",
            prop: "material_code",
            width: "120",
            align: "center",
            signIndex: 1,
            sortable: true,
          },
          {
            id: 3,
            label: "物料名称",
            prop: "material_name",
            width: "120",
            align: "center",
            signIndex: 1,
            sortable: true,
          },
          {
            id: 4,
            label: "规格型号",
            prop: "specification",
            width: "120",
            align: "center",
            signIndex: 1,
            sortable: true,
          },
          {
            id: 5,
            label: "计量单位",
            prop: "measure_unit_name",
            width: "120",
            align: "center",
            signIndex: 1,
            sortable: true,
          },
          {
            id: 6,
            label: "品牌",
            prop: "brand",
            width: "120",
            align: "center",
            signIndex: 1,
            sortable: false,
          },
          {
            id: 7,
            label: "出库数量",
            prop: "count",
            width: "120",
            align: "center",
            signIndex: 1,
            sortable: false,

          },
          {
            id: 8,
            label: "单价",
            prop: "price",
            width: "120",
            align: "center",
            signIndex: 1,
            sortable: false,

          },
            {
            id: 9,
            label: "总金额",
            prop: "total_price",
            width: "120",
            align: "center",
            signIndex: 1,
            sortable: false,

          },
          {
            id: 10,
            label: "批次",
            prop: "batch_no",
            width: "120",
            align: "center",
            signIndex: 1,
            sortable: false,

          },
          {
            id: 11,
            label: "备注",
            prop: "remark",
            width: "160",
            align: "center",
            signIndex: 1,
            sortable: false,

          },
          {
            id: 12,
            label: "出库单号",
            prop: "leave_num",
            width: "130",
            align: "center",
            signIndex: 1,
            sortable: false
          },
          {
            id: 13,
            label: "出库类型",
            prop: "leave_type",
            width: "130",
            align: "center",
            signIndex: 1,
            sortable: false
          },
          {
            id: 14,
            label: "出库仓库",
            prop: "house_name",
            width: "130",
            align: "center",
            signIndex: 1,
            sortable: false
          },
          {
            id: 15,
            label: "操作",
            prop: "operation",
            width: "130",
            align: "center",
            signIndex: 1,
            sortable: false
          }
        ],
      }
    },
    mounted() {
      this.onSetTime()
    },
    methods: {
      onSetTime(type = 'lastOneWeek') {
        let timeObj = getDate('lastOneWeek')
        this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
        this.formData.start_date = this.date[0]
        this.formData.end_date = this.date[1]
      },
      //设置时间
      selectedTime() {
        if (this.date && this.date.length > 0) {
          if(this.date[1].toString().length>12) {
            this.formData.start_date = this.date[0];
            this.formData.end_date = this.date[1]
          }else{
            this.formData.start_date = this.date[0];
            this.formData.end_date = `${this.date[1]} 23:59:59`
          }
        } else {
          this.formData.start_date = "";
          this.formData.end_date = "";
        }
        this.getMaterialByVehList()
      },
      // 回显设置
      setData(val) {
        this.formData.vehicle_name = val.vehicle_info ? val.vehicle_info.vehicle_name : ''
        this.formData.lp_num = val.vehicle_info ? val.vehicle_info.vehicle_id : ''
        setTimeout(() => {
          this.getMaterialByVehList()
        }, 30);
      },
      //获取车辆出库单
      getMaterialByVehList(){
        this.$client.getMaterialByVehMaintRepairOrder(this.form)
          .then(res => {
            if (res.head.result == "200") {
              this.stockOutList = res.context
            } else {
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error",
              });
            };
          })
      },
      // 获取工单物料
      getMaterialOrderList() {
        this.$client.getMaterialByOrderMaintRepairOrder({work_code: this.leave_num})
          .then(res => {
          if (res.head.result == "200") {
            if(res.context.leave_nums.length==0){
              this.data = res.context.list
            }
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          };
        })
      },
    },
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>

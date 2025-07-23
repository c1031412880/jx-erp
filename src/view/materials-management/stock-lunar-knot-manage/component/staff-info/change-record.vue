
<template>
  <div style="height: 500px; overflow-x: hidden">
    <el-form ref="elForm" :model="formData" size="mini" label-width="115px">
      <div class="show-flex-box-r">
        <el-col :span="6">
          <el-form-item label="仓库:" prop="age">
            <p>{{ formData.house_name }}</p>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="起始日期:" prop="age">
            <p>{{ formData.dateTime }}</p>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="期初库存:" prop="age">
            <p>{{ formData.init_num }}</p>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="当前库存:" prop="age">
            <p>{{ formData.current_num }}</p>
          </el-form-item>
        </el-col>
      </div>
      <div class="show-flex-box-r">
        <el-col :span="6">
          <el-form-item label="上月结存:" prop="age">
            <p>{{ formData.last_remain_num }}</p>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="本月入库:" prop="age">
            <p>{{ formData.enter_num }}</p>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="本月出库:" prop="age">
            <p>{{ formData.leave_num }}</p>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="本月退货:" prop="age">
            <p>{{ formData.reject_counts }}</p>
          </el-form-item>
        </el-col>
      </div>
      <div class="show-flex-box-r">
        <el-form-item style="margin-left: -80px" prop="">
          <el-radio-group
            ref="elRadioGroup"
            v-model="type"
            style="margin-bottom: 20px"
            size="mini"
          >
            <el-radio-button :label="'0'">全部</el-radio-button>
            <el-radio-button :label="'1'">入库</el-radio-button>
            <el-radio-button :label="'2'">出库</el-radio-button>
            <el-radio-button :label="'3'">退货</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="日期:">
          <el-date-picker
            size="mini"
            v-model="date"
            type="daterange"
            :clearable="false"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            range-separator="至"
            @change="getChangeDate()"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item style="margin-left: -80px">
          <el-button @click="exportFile()"  v-if="$isPowerShow('export')" type="primary">导出</el-button>
        </el-form-item>
      </div>
    </el-form>
    <tr-table
      :indexShow="false"
      v-show="type == 0"
      ref="table"
      :selectionShow="false"
      :data="data"
      :tableHeaderList="tableHeaderList"
      :TableHeight="TableHeight"
      :loading="loading"
      :isShowSummary="true"
      :omitColumnIndex='[1,2,3,4,5,6,7,10]'
    >
      <template slot-scope="scope" slot="enter_leave_num">
        <el-button @click="staffRowInfo(scope.data)" type="text" size="mini">{{
          scope.data.enter_leave_num
        }}</el-button>
      </template>
    </tr-table>
    <el-pagination
      v-show="type == 0"
      ref="paginationH"
      style="margin: 5px 0; display: flex; justify-content: flex-end"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :current-page="pageInfo1.pageIndex"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageInfo2.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageInfo1.pageCount"
    >
    </el-pagination>
    <tr-table
      v-show="type == 1"
      ref="table"
      :selectionShow="false"
      :data="data1"
      :tableHeaderList="tableHeaderList1"
      :TableHeight="TableHeight"
      :loading="loading"
      :isShowSummary="true"
      :omitColumnIndex='[1,2,3,4,5,6,7,8,10]'
    >
     <template slot-scope="scope" slot="enter_leave_num">
        <el-button @click="staffRowInfo(scope.data)" type="text" size="mini">{{
          scope.data.enter_leave_num
        }}</el-button>
      </template>
    </tr-table>
    <el-pagination
      v-show="type == 1"
      ref="paginationH"
      style="margin: 5px 0; display: flex; justify-content: flex-end"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :current-page="pageInfo2.pageIndex"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageInfo2.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageInfo2.pageCount"
    >
    </el-pagination>
    <tr-table
      v-show="type == 2"
      ref="table"
      :selectionShow="false"
      :data="data2"
      :tableHeaderList="tableHeaderList2"
      :TableHeight="TableHeight"
      :loading="loading"
      :isShowSummary="true"
      :omitColumnIndex='[1,2,3,4,5,6,7,8,9,10,11,13]'
    >
     <template slot-scope="scope" slot="enter_leave_num">
        <el-button @click="staffRowInfo(scope.data)" type="text" size="mini">{{
          scope.data.enter_leave_num
        }}</el-button>
      </template>
    </tr-table>
    <el-pagination
      v-show="type == 2"
      ref="paginationH"
      style="margin: 5px 0; display: flex; justify-content: flex-end"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :current-page="pageInfo3.pageIndex"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageInfo3.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageInfo3.pageCount"
    >
    </el-pagination>
    <tr-table
      v-show="type == 3"
      ref="table"
      :selectionShow="false"
      :data="data3"
      :tableHeaderList="tableHeaderList3"
      :TableHeight="TableHeight"
      :loading="loading"
      :isShowSummary="true"
      :omitColumnIndex='[1,2,3,4,5,6,7,8,10]'
    >
      <template slot-scope="scope" slot="enter_leave_num">
        <el-button @click="staffRowInfo(scope.data)" type="text" size="mini">{{
          scope.data.enter_leave_num
        }}</el-button>
      </template>
    </tr-table>
    <el-pagination
      v-show="type == 3"
      ref="paginationH"
      style="margin: 5px 0; display: flex; justify-content: flex-end"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :current-page="pageInfo4.pageIndex"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageInfo4.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageInfo4.pageCount"
    >
    </el-pagination>
  </div>
</template>

<script>
import { formatDateTime} from "@/utils/index";
export default {
  data() {
    return {
      pageInfo1: {
        //普通员工列表分页
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      pageInfo2: {
        //驾驶员工列表分页
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      pageInfo3: {
        //驾驶员工列表分页
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      pageInfo4: {
        //驾驶员工列表分页
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      data3: [],
      date: "",
      formData: {},
      backup_date: '',
      type: "0",
      data: [],
      data1: [],
      data2: [],
      house_id: "",
      material_id: "",
      frontFixedNum: 0,
      backFixedNum: 0,
      TableHeight: 300,
      loading: false,
      tableHeaderList: [
        {
          id: 1,
          label: "物料编码",
          prop: "material_code",
          width: "120",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "物料名称",
          prop: "material_name",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "规格型号",
          prop: "specification",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "单位",
          prop: "measure_unit_name",
          width: "120",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "批次号",
          prop: "batch_no",
          width: "170",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "日期",
          prop: "date",
          width: "120",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "入库/出库类型",
          prop: "enter_leave_type",
          width: "140",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "入库/出库单号",
          prop: "enter_leave_num",
          width: "140",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "收入",
          prop: "enter_num",
          width: "80",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "发出",
          prop: "leave_num",
          width: "80",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "结存",
          prop: "remain_num",
          width: "80",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
      ],
      tableHeaderList1: [
        {
          id: 1,
          label: "物料编码",
          prop: "material_code",
          width: "120",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "物料名称",
          prop: "material_name",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "规格型号",
          prop: "specification",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "单位",
          prop: "measure_unit_name",
          width: "120",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "入库批次号",
          prop: "batch_no",
          width: "170",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "日期",
          prop: "date",
          width: "120",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "入库类型",
          prop: "enter_leave_type",
          width: "120",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "入库单号",
          prop: "enter_leave_num",
          width: "120",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "入库数量",
          prop: "enter_num",
          width: "100",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "入库单价",
          prop: "price",
          width: "100",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "金额",
          prop: "total_price",
          width: "135",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
      ],
      tableHeaderList2: [
        {
          id: 1,
          label: "物料编码",
          prop: "material_code",
          width: "120",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "物料名称",
          prop: "material_name",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "规格型号",
          prop: "specification",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "单位",
          prop: "measure_unit_name",
          width: "120",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "出库批次号",
          prop: "batch_no",
          width: "170",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "关联工单号",
          prop: "relate_num",
          width: "120",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 6,
          label: "车辆自编号",
          prop: "v_nun",
          width: "120",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 6,
          label: "车牌号",
          prop: "lp_num",
          width: "120",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 6,
          label: "日期",
          prop: "date",
          width: "120",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "出库类型",
          prop: "enter_leave_type",
          width: "120",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "出库单号",
          prop: "enter_leave_num",
          width: "150",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "出库数量",
          prop: "leave_num",
          width: "100",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "出库单价",
          prop: "price",
          width: "100",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "金额",
          prop: "total_price",
          width: "135",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
      ],
      tableHeaderList3: [
        {
          id: 1,
          label: "物料编码",
          prop: "material_code",
          width: "120",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "物料名称",
          prop: "material_name",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "规格型号",
          prop: "specification",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "单位",
          prop: "unit",
          width: "120",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "供应商",
          prop: "supplier_name",
          width: "170",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "退货批次号",
          prop: "batch_no",
          width: "120",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 6,
          label: "日期",
          prop: "return_date",
          width: "120",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 6,
          label: "退货单号",
          prop: "return_order",
          width: "120",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 6,
          label: "退货数量",
          prop: "count",
          width: "120",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "退货单价",
          prop: "price",
          width: "120",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "金额",
          prop: "total_price",
          width: "150",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
      ],
    };
  },
  watch: {
    type(bool) {},
  },
   mounted() {
    // this.onSetTime()
  },
  methods: {
    setData(val) {
      console.log(val);
      setTimeout(() => {
        this.house_id = val.house_id;
        this.material_id = val.material_id;
        this.backup_date = val.backup_date
        let year = val.backup_date.slice(0, 4)
        let month = val.backup_date.slice(5, 7)
        let start = val.backup_date + '-01'
        let end = formatDateTime(new Date(year, month, 0))
        this.date = this.$addTime([start, end])
        this.getdetilCount(val);
        // this.$refs['baseInfo'].setData(val)
      }, 60);
    },
         // 分页切换事件
      handleCurrentChange(idx) {
        if(this.type == '0') {
          this.pageInfo1.pageIndex = idx
          this.getdetilData()
        }
        if(this.type == '1') {
          this.pageInfo2.pageIndex = idx
          this.getdetilData1()
        }
        if(this.type == '2') {
          this.pageInfo3.pageIndex = idx
          this.getdetilData2()
        }
        if(this.type == '3') {
          this.pageInfo4.pageIndex = idx
          this.getdetilData3()
        }
      },
     // 切换每页条数
      handleSizeChange(sizes) {
        if(this.type == '0') {
          this.pageInfo1.pageIndex = 1;
          this.pageInfo1.pageSize = sizes;
          this.pageInfo1.pageCount = 0;
          this.getdetilData()
        }
        if(this.type == '1') {
          this.pageInfo2.pageIndex = 1;
          this.pageInfo2.pageSize = sizes;
          this.pageInfo2.pageCount = 0;
          this.getdetilData1()
        }
        if(this.type == '2') {
          this.pageInfo3.pageIndex = 1;
          this.pageInfo3.pageSize = sizes;
          this.pageInfo3.pageCount = 0;
          this.getdetilData2()
        }
        if(this.type == '3') {
          this.pageInfo4.pageIndex = 1;
          this.pageInfo4.pageSize = sizes;
          this.pageInfo4.pageCount = 0;
          this.getdetilData3()
        }
      },
    staffRowInfo(data){
      if(data.type==1){
       this.$router.push({
        path:'/warehouse-warrant',
         query: {
            enter_num: data.enter_leave_num
          }
      })
      }else{
          this.$router.push({
        name:'warehouse-leave',
         params: {
            leave_num: data.enter_leave_num
          }
      })
      }
    },
    //导出
    exportFile() {
      // let params = Object.assign({}, this.firstQueryform);
      // params.i_is_driver = this.showCollapse == 'first'? 0 : 1;
      if(this.type == 3) {
        this.returnOrderExport()
        return false
      }
      this.$client
        .Export2TimerBackup({
          house_id: this.house_id,
          material_id: this.material_id,
          backup_date: this.backup_date,
          type: this.type,
          start: this.date[0],
          end: this.date[1],
        })
        .then((res) => {
          if (res.head.result == "200") {
            window.location.href = res.context;
            this.$message({ type: "success", message: "导出成功" });
          } else {
            this.$message({ type: "error", message: "导出失败" });
          }
        });
    },
    returnOrderExport() {
      this.$client
        .ExportDetailReturnsOrder({
          house_id: this.house_id,
          material_id: this.material_id,
          return_date_start	: this.date[0],
          return_date_end: this.date[1],
          page_index: this.pageInfo4.pageIndex,
          page_size: this.pageInfo4.pageSize,
        })
        .then((res) => {
          if (res.head.result == "200") {
            window.location.href = res.context;
            this.$message({ type: "success", message: "导出成功" });
          } else {
            this.$message({ type: "error", message: "导出失败" });
          }
        });
    },
    getChangeDate() {
      this.date =[`${this.date[0]} 00:00:00`, `${this.date[1]} 23:59:59`]
      // this.formData.dateTime = this.date[0] + '~' + this.date[1]
      this.getdetilData();
      this.getdetilData1();
      this.getdetilData2();
      this.getdetilData3();
    },
    getdetilData() {
      this.$client
        .GetDetailDataTimerBackup({
          house_id: this.house_id,
          material_id: this.material_id,
          backup_date: this.backup_date,
          type: "0",
          start: this.date[0],
          end: this.date[1],
          page_index: this.pageInfo1.pageIndex,
          page_size: this.pageInfo1.pageSize,
        })
        .then((res) => {
          if (res.head.result == "200") {
            this.data = res.context.list;
            this.pageInfo1.pageCount = res.context.total;
          } else {
            this.$message({ type: "error", message: res.head.describle });
          }
        });
    },
    getdetilData1() {
      this.$client
        .GetDetailDataTimerBackup({
          house_id: this.house_id,
          material_id: this.material_id,
          backup_date: this.backup_date,
          type: "1",
          start: this.date[0],
          end: this.date[1],
          page_index: this.pageInfo2.pageIndex,
          page_size: this.pageInfo2.pageSize,
        })
        .then((res) => {
          // console.log(res)
          if (res.head.result == "200") {
            this.data1 = res.context.list;
            this.pageInfo2.pageCount = res.context.total;
          } else {
            this.$message({ type: "error", message: res.head.describle });
          }
        });
    },
    getdetilData2() {
      this.$client
        .GetDetailDataTimerBackup({
          house_id: this.house_id,
          material_id: this.material_id,
          backup_date: this.backup_date,
          type: "2",
          start: this.date[0],
          end: this.date[1],
          page_index: this.pageInfo3.pageIndex,
          page_size: this.pageInfo3.pageSize,
        })
        .then((res) => {
          // console.log(res)
          if (res.head.result == "200") {
            this.data2 = res.context.list;
            this.pageInfo3.pageCount = res.context.total;
          } else {
            this.$message({ type: "error", message: res.head.describle });
          }
        });
    },
    getdetilData3() {
      this.$client
        .GetReturnsOrderDetailReturnsOrder({
          house_id: this.house_id,
          material_id: this.material_id,
          return_date_start: this.date[0],
          return_date_end: this.date[1],
          page_index: this.pageInfo4.pageIndex,
          page_size: this.pageInfo4.pageSize,
        })
        .then((res) => {
          if (res.head.result == "200") {
            this.data3 = res.context.list ? res.context.list : [];
            this.pageInfo4.pageCount = res.context.total;
          } else {
            this.$message({ type: "error", message: res.head.describle });
          }
        });
    },
    getdetilCount(val) {
      this.$client
        .GetDetailCountTimerBackup({
          house_id: val.house_id,
          material_id: val.material_id,
          backup_date: this.backup_date,
        })
        .then((res) => {
          // console.log(res)
          if (res.head.result == "200") {
            this.formData = res.context;
            this.formData.dateTime = this.date[0] + '~' + this.date[1]
            this.getdetilData()
            this.getdetilData1()
            this.getdetilData2()
            this.getdetilData3()
          } else {
            this.$message({ type: "error", message: res.head.describle });
          }
        });
    },
    resetData() {
      this.house_id = "";
      this.material_id = "";
      this.date = "";
    },
  },
};
</script>
<style lang='scss' scoped>
</style>

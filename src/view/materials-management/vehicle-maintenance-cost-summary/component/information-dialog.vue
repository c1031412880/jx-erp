<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="900px"
  >
    <div slot="title">
      <div class="show-flex-box-r" style="align-items: center">
        <h2 style="font-size: 20px; font-weight: 600;margin-right: 80px">查看明细</h2>
        <div class="show-flex-box-r">
          <strong style="margin-right: 15px">当前车辆:</strong>
          <span style="margin-right: 30px;color:#D9001B">{{form.vehicle_name}}</span>
          <strong style="margin-right: 15px">日期范围:</strong>
          <span style="color:#D9001B">{{form.start_date}}至{{form.end_date.slice(0,10)}}</span>
        </div>
      </div>
    </div>
    <el-button size="mini" type="primary" @click="exportExcel" :disabled="exportLoading">
      <i class="el-icon-loading" v-show="exportLoading"></i>导出
    </el-button>
    <div class="el-dialog-div">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="item.lable" :name="item.value" v-for="(item,index) in activeNameList" :key="index">
          <tr-table
            v-if="tableHeaderData[item.value]"
            :selectionShow="false"
            :data="dataMap[item.value]"
            :tableHeaderList="tableHeaderData[item.value]"
            :isShowBottomOptions="false"
            :TableHeight="390"
            :loading="loadingMap[item.value]"
            :frontFixedNum="1"
            :backFixedNum="0"
          >
            <template slot-scope="scope" slot="work_code" v-if="item.value == 'first'">
                <el-button  type="text" size="mini" @click="jumpOrderPage(scope.data)">{{scope.data.work_code}}</el-button>
            </template>
            <template slot-scope="scope" slot="state_detail_name" v-if="item.value == 'first'">
                    <div  v-if="scope.data.state == 1">
                <div style="color: #d71345;">
                <p class = "mark" style="background-color: #d71345;"></p> <span>{{scope.data.state_detail_name}}</span>
              </div>
            </div>
              <div  v-else-if="scope.data.state == 2">
                <div style="color: #18BE6B;">
                <p class = "mark" style="background-color: #18BE6B;"></p> <span>{{scope.data.state_detail_name}}</span>
              </div>
            </div>
              <div   v-else-if="scope.data.state == 3">
              <div style="color: #c88400;">
                <p class = "mark" style="background-color: #c88400;"></p> <span>{{scope.data.state_detail_name}}</span>
              </div>
            </div>
              <div   v-else-if="scope.data.state == 4">
              <div style="color: #ffc20e;">
                <p class = "mark" style="background-color: #ffc20e;"></p> <span>{{scope.data.state_detail_name}}</span>
              </div>
            </div>
              <div   v-else-if="scope.data.state == 5">
              <div style="color: #409EFF;">
                <p class = "mark" style="background-color: #409EFF;"></p> <span>{{scope.data.state_detail_name}}</span>
              </div>
            </div>
              <div   v-else-if="scope.data.state == 7" >
              <div style="color: #77787b;">
                <p class = "mark" style="background-color: #77787b;"></p> <span>{{scope.data.state_detail_name}}</span>
              </div>
            </div>
            </template>
            <!-- <template slot-scope="scope" slot="vehicle_number" v-if="item.value == 'first'">
              <span v-if="scope.data.vehicle_info == null" ></span>
                <el-button v-else type="text" size="mini">{{scope.data.vehicle_info.vehicle_number}}</el-button>
            </template>
            <template slot-scope="scope" slot="vehicle_name" v-if="item.value == 'first'">
              <span v-if="scope.data.vehicle_info == null" ></span>
              <span v-else>{{scope.data.vehicle_info.vehicle_name}}</span>
            </template>
            <template slot-scope="scope" slot="department_name" v-if="item.value == 'first'">
              <span v-if="scope.data.vehicle_info == null" ></span>
              <span v-else>{{scope.data.vehicle_info.department_name}}</span>
            </template>
            <template slot-scope="scope" slot="vehicle_kind_name" v-if="item.value == 'first'">
              <span v-if="scope.data.vehicle_info == null" ></span>
              <span v-else>{{scope.data.vehicle_info.vehicle_kind_name}}</span>
            </template> -->
            <template slot-scope="scope" slot="item_name" v-if="item.value == 'first'">
              <el-button type="text" @click="onSelectRow(scope.data, scope.data.maint_dept_name)">{{scope.data.item_name}}</el-button>
            </template>
            <template slot-scope="scope" slot="person_name" v-if="item.value == 'first'">
              <el-button type="text" @click="onSelectRow(scope.data, scope.data.maint_dept_name)">{{scope.data.person_name}}</el-button>
            </template>

            <template slot-scope="scope" slot="leave_num" v-if="item.value == 'second'">
                <el-button  type="text" size="mini" @click="jumpWarehouseManagement(scope.data)">{{scope.data.leave_num}}</el-button>
            </template>

          </tr-table>

          <el-pagination
            style="margin: 5px 0;display:flex; justify-content: flex-end;"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            ref="paginationH"
            :current-page="pageInfoMap[item.value].pageIndex"
            :page-sizes="[10, 20, 30, 40, 50, 100]"
            :page-size="pageInfoMap[item.value].pageSize"
            layout="total,sizes, prev, pager, next, jumper"
            :total="pageInfoMap[item.value].pageCount"
          >
          </el-pagination>

        </el-tab-pane>

      </el-tabs>

      <div>
        <information-dialog
          :data="tableData"
          ref="informationDialog"
          :dialogBool.sync="isShowInformationDialogDetail"
        ></information-dialog>
      </div>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import tableHeader from './table-header'
import informationDialog from "@/view/maintenance-management/vehicle-maintenance-statistics/component/information-dialog";
export default {
  components: {informationDialog},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "查看明细",
    },
    accidentLiabilityType:{
      type: Array,
      default: () => []
    },
    workOrderType:{
      type: [String,Number],
      default: "",
    }
  },
  mounted() {
  },
  data() {
    return {
      activeName: 'first',
      activeNameList:[
        {
          id: 1,
          lable: "维修明细",
          value: 'first',
        },
        {
          id: 2,
          lable: "物料明细",
          value: 'second',
        },
        {
          id: 3,
          lable: "里程明细",
          value: 'third',
        }
      ],
      tableHeaderData:{},
      form: {
        start_date: "",
        end_date: "",
        vehicle_id: "",
        vehicle_name: "",
        pick_depatment_id:""
      },
      dataMap:{
        'first':[],
        'second':[],
        'third':[],
      },
      pageInfoMap:{
        'first':{
          pageIndex: 1,
          pageSize: 20,
          pageCount: 0,
        },
        'second':{
          pageIndex: 1,
          pageSize: 20,
          pageCount: 0,
        },
        'third':{
          pageIndex: 1,
          pageSize: 20,
          pageCount: 0,
        },
      },
      loadingMap: {
        'first': false,
        'second':false,
        'third': false,
      },
      // 维修人员，项目明细
      tableData: [],
      isShowInformationDialogDetail: false,
      exportLoading: false
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        this.tableHeaderData = tableHeader
        this.handleClick({name: this.activeName})
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    handleClick(tab) {
      // console.log(tab.name);
      this.loadingMap[tab.name] = true
      switch (tab.name) {
        case 'first':
          this.reqViolationRecord()
          break;
        case 'second':
          this.reqResponsibleComplaint()
          break;
        case 'third':
          this.reqListViolationRecord()
          break;
      }
    },
    // 获取维修明细记录
    reqViolationRecord() {
      let params = {
        date_type: "1",
        car_type: "1",
        start_date: this.form.start_date,
        end_date: this.form.end_date,
      }
      if(!!this.form.vehicle_id) {
        params.vehicle_ids = [Number(this.form.vehicle_id)]
      }
      params.page_index = this.pageInfoMap[this.activeName].pageIndex;
      params.page_size = this.pageInfoMap[this.activeName].pageSize;
      this.$client.getByPageSimpletMaintRepairOrder(params).then(res => {
        if (res.head.result === "200") {
          this.loadingMap[this.activeName] = false;
          this.dataMap[this.activeName] = res.context.list;
          this.pageInfoMap[this.activeName].pageCount = res.context.total

          if(this.activeName == 'first' && !!this.dataMap[this.activeName] && this.dataMap[this.activeName].length) {
            this.dataMap[this.activeName].forEach(ele => {
              if(ele.repair_items.length>0){
                const itemList =[]
                const person_name =[]
                ele.repair_items.forEach(element => {
                  itemList.push(element.item_name)
                  person_name.push(element.person_name)
                });
                var i = this.dataMap[this.activeName].findIndex(item=>{return item.id == ele.id})
                this.$set(this.dataMap[this.activeName][i],'item_name',itemList.toString())
                let person_name1 = this.unique(person_name);
                this.$set(this.dataMap[this.activeName][i],'person_name',person_name1.toString())
              }
            });
          }
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error"
          });
        }
        this.loadingMap[this.activeName] = false;
      });
    },
    // 导出
    exportExcel(){
      this.exportLoading = true;
      let params = {
        date_type: "1",
        car_type: "1",
        start_date: this.form.start_date,
        end_date: this.form.end_date,
      }
      if(!!this.form.vehicle_id) {
        params.vehicle_ids = [Number(this.form.vehicle_id)]
      }
      params.page_index = this.pageInfoMap[this.activeName].pageIndex;
      params.page_size = this.pageInfoMap[this.activeName].pageSize;
      this.$client.exportCarFeeDetail(params).then(res => {
        if (res.head.result == "200") {
          let a = document.createElement('a');
          a.href = res.context;
          a.target = '_blank';
          a.download = '单车维修费用汇总明细.xls';
          a.click();
          this.$message({ type: "success", message: "导出成功" });
        } else {
          this.$message({ type: "error", message: "导出失败" });
        }
        this.exportLoading = false;
      })
    },
    //去重
    unique(arr) {
      const res = new Map();
      return arr.filter((arr) => !res.has(arr) && res.set(arr, 1));
    },
    // 查看维修项目 ， 维修人员明细
    onSelectRow(val, info) {
      this.tableData = val.repair_items
      this.tableData.forEach(item => {
        item.maint_dept_name = info
      })
      this.isShowInformationDialogDetail = true
    },
    // 获取物料明细
    reqResponsibleComplaint(){
      let params = {
        leave_date_end: this.form.end_date,
        leave_date_start: this.form.start_date,
        state: "2",
        leave_type:'WXCK',
      }
      if(!!this.form.vehicle_id && Number(this.form.vehicle_id)) {
        params.vehicle_ids = [Number(this.form.vehicle_id)]
      }else{
        params.lp_num = this.form.vehicle_id
        params.pick_depatment_id = this.form.pick_depatment_id
      }

      params.page_index = this.pageInfoMap[this.activeName].pageIndex;
      params.page_size = this.pageInfoMap[this.activeName].pageSize;
      this.$client.getByPageLeaveHouse(params).then(res => {
        if (res.head.result == "200") {
          this.loadingMap[this.activeName] = false;
          this.dataMap[this.activeName] = res.context.list;
          this.pageInfoMap[this.activeName].pageCount = res.context.total
        } else {
          this.loadingMap[this.activeName] = false;
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
    // 获取里程明细
    reqListViolationRecord() {
      let params = {
        end: this.form.end_date.slice(0,10),
        from: this.form.start_date,
      }
      if(!!this.form.vehicle_id) {
        params.vehicle_ids = [Number(this.form.vehicle_id)]
      }
      params.page_index = this.pageInfoMap[this.activeName].pageIndex;
      params.page_size = this.pageInfoMap[this.activeName].pageSize;
       this.$client.getVehicleMileManage(params).then(res => {
        if (res.head.result === "200") {
          this.loadingMap[this.activeName] = false;
          this.dataMap[this.activeName] = res.context.list;
          this.pageInfoMap[this.activeName].pageCount = res.context.total
        } else {
          this.loadingMap[this.activeName] = false;
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        };
      })
    },
     // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfoMap[this.activeName].pageIndex = idx;
      this.handleClick({name: this.activeName})
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfoMap[this.activeName].pageIndex = 1;
      this.pageInfoMap[this.activeName].pageSize = sizes;
      this.pageInfoMap[this.activeName].pageCount = 0;
      this.handleClick({name: this.activeName})
    },

    // 跳转到工单管理
    jumpOrderPage(info){
      this.$router.push({
        name:'workorder-management',
        params:{
          orderId: info.work_code,
          start_date: this.form.start_date,
          end_date: this.form.end_date
        }
      })
    },
    // 跳转到出库管理
    jumpWarehouseManagement(info){
      this.$router.push({
        name:'warehouse-management',
        params:{
          leave_num: info.leave_num,
          leave_date_start: this.form.start_date,
          leave_date_end: this.form.end_date
        }
      })
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div{
  height: 500px;
}
</style>


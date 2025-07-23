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
          <strong style="margin-right: 15px" v-if="!!form.end_date">报修日期:</strong>
          <span style="color:#D9001B" v-if="!!form.end_date">{{form.start_date}}</span>
        </div>
      </div>
    </div>
    <div class="el-dialog-div">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="item.lable" :name="item.value" v-for="(item,index) in activeNameList" :key="index" :disabled="loadingMap[activeName]">
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
            <template slot-scope="scope" slot="state_detail_name">
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
            <template slot-scope="scope" slot="vehicle_number">
              <span v-if="scope.data.vehicle_info == null" ></span>
                <el-button v-else type="text" size="mini">{{scope.data.vehicle_info.vehicle_number}}</el-button>
            </template>
            <template slot-scope="scope" slot="vehicle_name">
              <span v-if="scope.data.vehicle_info == null" ></span>
              <span v-else>{{scope.data.vehicle_info.vehicle_name}}</span>
            </template>
            <template slot-scope="scope" slot="department_name">
              <span v-if="scope.data.vehicle_info == null" ></span>
              <span v-else>{{scope.data.vehicle_info.department_name}}</span>
            </template>
            <template slot-scope="scope" slot="vehicle_kind_name">
              <span v-if="scope.data.vehicle_info == null" ></span>
              <span v-else>{{scope.data.vehicle_info.vehicle_kind_name}}</span>
            </template>
            <template slot-scope="scope" slot="check_time">
              <span v-if="scope.data.repair_check == null" ></span>
              <span v-else>{{scope.data.repair_check.check_time}}</span>
            </template>
            <template slot-scope="scope" slot="check_describe">
              <span v-if="scope.data.repair_check == null" ></span>
              <span v-else>{{scope.data.repair_check.check_describe}}</span>
            </template>
            <template slot-scope="scope" slot="state_child">
              <span v-if="scope.data.repair_check == null" ></span>
              <span v-else>{{scope.data.repair_check.state_child}}</span>
            </template>
            <template slot-scope="scope" slot="total_hours">
              <span v-if="scope.data.repair_items == null" ></span>
              <span v-else>{{scope.data.total_hours}}</span>
            </template>
            <template slot-scope="scope" slot="material_fee">
              <span v-if="scope.data.repair_items == null" ></span>
              <span v-else>{{scope.data.material_fee}}</span>
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

    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import tableHeader from './table-header'
export default {
  components: {},
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
          lable: "保养工单记录",
          value: 'first',
        },
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
        }
      },
      loadingMap: {
        'first': false,
        'second':false,
      },
      // 维修人员，项目明细
      tableData: [],
      isShowInformationDialogDetail: false
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
      // this.loadingMap[tab.name] = true
      this.dataMap[this.activeName] = []
      switch (tab.name) {
        case 'first':
          this.reqViolationRecord()
          break;
        // case 'second':
        //   this.reqResponsibleComplaint()
        //   break;
      }
    },
    // 获取工单记录记录
    reqViolationRecord() {
      this.loadingMap[this.activeName] = true
      let params = {
        date_type: 1,
        vehicle_ids: [Number(this.form.vehicle_id)],
        start_date: this.form.start_date,
        end_date: this.form.end_date,
      }
      if(!!this.form.vehicle_id) {
        params.vehicle_ids = [Number(this.form.vehicle_id)]
      }
      params.page_index = this.pageInfoMap[this.activeName].pageIndex;
      params.page_size = this.pageInfoMap[this.activeName].pageSize;
      this.$client.getrOrderList(params).then(res => {
        if (res.head.result === "200") {
          this.dataMap[this.activeName] = res.context.list;
          this.pageInfoMap[this.activeName].pageCount = res.context.total
          this.$nextTick(() => {
            this.$forceUpdate()
            this.loadingMap[this.activeName] = false;
          })
        } else {
          this.dataMap[this.activeName] = [];
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error"
          });
        }
        this.loadingMap[this.activeName] = false;
      });
    },
    //去重
    unique(arr) {
      const res = new Map();
      return arr.filter((arr) => !res.has(arr) && res.set(arr, 1));
    },
    // 获取物料明细
    reqResponsibleComplaint(){
      this.loadingMap[this.activeName] = true
      let params = {
        begin: this.form.start_date,
        end: this.form.end_date,
        i_vehicle_id:[Number(this.form.vehicle_id)]
      }
      params.page_index = this.pageInfoMap[this.activeName].pageIndex;
      params.page_size = this.pageInfoMap[this.activeName].pageSize;
      this.$client.getAccidentRecordList(params).then(res => {
        if (res.head.result == "200") {
          this.dataMap[this.activeName] = res.context.list;
          this.pageInfoMap[this.activeName].pageCount = res.context.total
          this.$nextTick(() => {
            this.$forceUpdate()
            this.loadingMap[this.activeName] = false;
          })
        } else {
          this.loadingMap[this.activeName] = false;
          this.dataMap[this.activeName] = [];
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
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div{
  height: 500px;
}
</style>


<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    :close-on-click-modal="false"
    width="900px"
  >
    <div slot="title">
      <div class="show-flex-box-r" style="align-items: center">
        <h2 style="font-size: 20px; font-weight: 600;margin-right: 80px">查看明细</h2>
        <!-- <div class="show-flex-box-r">
          <strong style="margin-right: 15px">当前车辆:</strong>
          <span style="margin-right: 30px;color:#D9001B">{{form.vehicle_name}}</span>
          <strong style="margin-right: 15px" v-if="!!form.end_date">日期范围:</strong>
          <span style="color:#D9001B" v-if="!!form.end_date">{{form.start_date}}至{{form.end_date.slice(0,10)}}</span>
        </div> -->
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
          <template slot-scope="scope" slot="cancel_star">
              <!-- {{scope.data.service_code}} -->
              <span >{{scope.data.cancel_star == 1? '是':'否'}}</span>
            </template>

            <template slot-scope="scope" slot="images">
              <div style="width:150px;height:80px;" class="show-flex-box-r show-flex-center" v-if="scope.data.images && scope.data.images.length > 0">
                <el-carousel height="80px" width="150px" style="width:150px;">
                  <el-carousel-item v-for="(item,index) in scope.data.images" :key="index">
                    <el-image
                      style="width: 150px; height: 80px"
                      :src="item.url"
                      :preview-src-list="[item.url]">
                    </el-image>
                  </el-carousel-item>
                </el-carousel>
              </div>
              <span v-else style="color:#909399">暂无图片</span>
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
  },
  mounted() {
  },
  data() {
    return {
      activeName: 'first',
      activeNameList:[
        {
          id: 1,
          lable: "违规记录",
          value: 'first',
        },
        {
          id: 2,
          lable: "乘客投诉",
          value: 'second',
        }
      ],
      tableHeaderData:{},
      form: {
        date_type:"",
        day:"",
        month: "",
        year: "",
        quarter: "",
        group_id: "",
        line_id:"",
        driver_id:"",
        data_type:""
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
        case 'second':
          this.reqResponsibleComplaint()
          break;
      }
    },
    // 获取驾驶员违规明细记录
    reqViolationRecord() {
      this.loadingMap[this.activeName] = true
      let params = this.$outFormData(this.form)
      params.page_index = this.pageInfoMap[this.activeName].pageIndex;
      params.page_size = this.pageInfoMap[this.activeName].pageSize;
      this.$client.GetDriverDetailViolationSummary(params).then(res => {
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
    // 获取乘客投诉明细记录
    reqResponsibleComplaint(){
      this.loadingMap[this.activeName] = true
      let params = this.$outFormData(this.form)
      params.page_index = this.pageInfoMap[this.activeName].pageIndex;
      params.page_size = this.pageInfoMap[this.activeName].pageSize;
      this.$client.GetPassengerDetailViolationSummary(params).then(res => {
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


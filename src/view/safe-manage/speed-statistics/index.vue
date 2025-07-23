<template>
  <div class="speed-statistics">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="超速明细" name="first">
        <sub-req
          ref="firstHead"
          @on-ok="onSubmit"
          @on-export="onExport"
          :activeName="'first'"></sub-req>
        <tr-table
          :backFixedNum="3"
          :data="firstData"
          :frontFixedNum="1"
          :loading="loading"
          :selectionShow="false"
          :TableHeight="firstTableHeight"
          :isShowBottomOptions="false"
          :tableHeaderList="firstCustomSettingList"></tr-table>
        <el-pagination
            style="margin: 5px 0;display:flex; justify-content: flex-end;"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            ref="firstPaginationH"
            :current-page="pageInfo.pageIndex"
            :page-sizes="[10, 20, 30, 40, 50, 100]"
            :page-size="pageInfo.pageSize"
            layout="total,sizes, prev, pager, next, jumper"
            :total="pageInfo.pageCount"></el-pagination>
      </el-tab-pane>
      <el-tab-pane label="按车辆汇总" name="second">
        <sub-req
          ref="secondHead"
          @on-ok="onSubmit"
          @on-export="onExport"
          :activeName="'second'"></sub-req>
        <tr-table
          :backFixedNum="1"
          :data="secondData"
          :frontFixedNum="2"
          :loading="loading"
          :selectionShow="false"
          :TableHeight="secondTableHeight"
          :isShowBottomOptions="false"
          :tableHeaderList="secondCustomSettingList">
          <template slot-scope="scope" slot="operation">
            <el-button type="text" size="mini" @click="onClickDetails(scope.data, 'second')">查看明细</el-button>
          </template>
        </tr-table>
      </el-tab-pane>
      <el-tab-pane label="按驾驶员汇总" name="third">
        <sub-req
          ref="thirdHead"
          @on-ok="onSubmit"
          @on-export="onExport"
          :activeName="'third'"></sub-req>
        <tr-table
          :backFixedNum="1"
          :data="thirdData"
          :frontFixedNum="2"
          :loading="loading"
          :selectionShow="false"
          :TableHeight="thirdTableHeight"
          :tableHeaderList="thirdCustomSettingList">
          <template slot-scope="scope" slot="operation">
            <el-button type="text" size="mini" @click="onClickDetails(scope.data, 'third')">查看明细</el-button>
          </template>
        </tr-table>
      </el-tab-pane>
    </el-tabs>
    <div>
      <information-dialog 
        ref="infoDialog"
        :begin="info.begin"
        :end="info.end"
        :funcType="activeName"
        :veh="info.veh"
        :driver="info.driver"
        @on-export="onExportDetails"
        :dialogBool.sync="isShowDialog"></information-dialog>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import subReq from './component/sub-req'
import informationDialog from './component/information-dialog'
export default {
  name: 'speed-statistics',
  components: {
    subReq,
    informationDialog
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 100,
        pageCount: 0,
      },
      info:{
        begin: '',
        end: '',
        funcType: 'second',
        veh: '',
        driver: ''
      },
      form: {},
      loading: false,
      firstData: [],
      secondData: [],
      thirdData: [],
      isShowDialog: false,
      firstTableHeight: 500,
      secondTableHeight: 500,
      thirdTableHeight: 500,
      activeName: 'first',
      firstCustomSettingList: [
        {
          id: 1,
          label: "自编号",
          prop: "vNum",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "车牌号",
          prop: "vcode",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "所属组织",
          prop: "department",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "线路",
          prop: "linename",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "驾驶员",
          prop: "driverName",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "速度(km/h)",
          prop: "speed",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "限速(km/h)",
          prop: "icspeed",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "开始时间",
          prop: "string_fdate",
          width: "160",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        {
          id: 9,
          label: "结束时间",
          prop: "string_tdate",
          width: "160",
          align: "center",
          signIndex: 8,
          sortable: true,
        },
        {
          id: 10,
          label: "超速持续时长(S)",
          prop: "continue_time",
          width: "160",
          align: "center",
          signIndex: 9,
          sortable: true,
        },
        {
          id: 11,
          label: "限速区域",
          prop: "limit_area",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "超速路段",
          prop: "station_to_station",
          width: "220",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "地址",
          prop: "Address",
          width: "130",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "报警类型",
          prop: "atype_name",
          width: "130",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
      ],
      secondCustomSettingList: [
        {
          id: 1,
          label: "自编号",
          prop: "vNum",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "车牌号",
          prop: "vcode",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "所属组织",
          prop: "department",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "线路",
          prop: "linename",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "驾驶员",
          prop: "driverName",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "超速次数",
          prop: "count",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "平均速度(km/h)",
          prop: "avr_speed",
          width: "160",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "超速总时长(km/h)",
          prop: "total_time",
          width: "180",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        {
          id: 9,
          label: "操作",
          prop: "operation",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        }
      ],
      thirdCustomSettingList:[
        {
          id: 1,
          label: "驾驶员",
          prop: "driverName",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "车牌号",
          prop: "vcode",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "所属组织",
          prop: "department",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "超速次数",
          prop: "count",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "平均速度(km/h)",
          prop: "avr_speed",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "超速总时长(S)",
          prop: "total_time",
          width: "180",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "操作",
          prop: "operation",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        }
      ],
    };
  },
  mounted() {
    this.$refs.firstHead.onSubmit();
    this.$nextTick(() => {
      this.setHead();
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    onSubmit(form) {
      this.form = form
      this.loadData();
    },
    // 加载明细
    loadData() {
      // switch (this.activeName) {
      //   case 'first':
      //     params.page_index = this.pageInfo.pageIndex;
      //     params.page_size = this.pageInfo.pageSize;
      //     break;
      //   case 'second':
      //     delete params.min;
      //     delete params.type;
      //     break;
      //   case 'third':
      //     delete params.min;
      //     delete params.type;
      //     break;
      // }
      this.loading = true
      let params = Object.assign({}, this.form);
      if(this.activeName === 'first') {
        params.page_index = this.pageInfo.pageIndex;
        params.page_size = this.pageInfo.pageSize;
      }
      let clientMap = {
        'first': 'GetOverSpeedOverSpeed', //超速明细
        'second': 'getOverSpeedStatisticsByVehicle', //超速明细
        'third': 'getOverSpeedStatisticsByDriver', //超速明细
      }
      console.log(params, [clientMap[this.activeName]]);
      this.$client[clientMap[this.activeName]](params).then(res => {
        if(res.head.result == '200') {
          this.loading = false
          switch (this.activeName) {
            case 'first':
              this.firstData = res.context.list;
              this.pageInfo.pageCount = res.context.total
              break;
            case 'second':
              this.secondData = res.context;
              break;
            case 'third':
              this.thirdData = res.context;
              break;
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
        this.loading = false
        this.$message({
          showClose: true,
          message: err.body.message,
          type: "error",
        })
      })
    },
    // 导出
    onExport() {
      let info = Object.assign({}, this.form);
      let type = 0  
      switch (this.activeName) {
        case 'first':
          type = 0
          info.page_index = this.pageInfo.pageIndex;
          info.page_size = this.pageInfo.pageSize;
          break;
        case 'second':
          type = 1
          break;
        case 'third':
          type = 2
          break;
      }
      let params = {
        data: info,
        export_type: type
      }
      this.$client.ExportOverSpeedStatistics(params).then(res => {
        if (res.head.result == "200") {
          window.location.href = res.context;
          this.$message({ type: "success", message: "导出成功" });
        } else {
          this.$message({ type: "error", message: "导出失败" });
        }
      });
    },
    // 导出明细
    onExportDetails(val) {
      let info = Object.assign({}, this.form);
      info.page_index = val.pageIndex;
      info.page_size = val.pageSize;
      if(this.activeName === 'second') {
        info.vehicle_ids = val.vehId;
      }
      if(this.activeName === 'third') {
        info.driver_ids = val.vehId;
      }
      let params = {
        data: info,
        export_type: 0
      }
      this.$client.ExportOverSpeedStatistics(params).then(res => {
        if (res.head.result == "200") {
          window.location.href = res.context;
          this.$message({ type: "success", message: "导出成功" });
        } else {
          this.$message({ type: "error", message: "导出失败" });
        }
      });
    },
    // 切换标签页
    handleClick(tab, event) {
      // console.log(tab, event);
      switch (tab.name) {
        case 'first':
          this.$refs.firstHead.onSubmit();
          this.setHead()
          break;
        case 'second':
          this.$refs.secondHead.onSubmit();
          this.setHead()
          break;
        case 'third':
          this.$refs.thirdHead.onSubmit();
          this.setHead()
          break;
      }
    },
    // 点击明细详情
    onClickDetails(val, type) {   
      this.isShowDialog = true
      // this.info.funcType = type
      this.info.end = this.form.end_time  ? this.form.end_time.slice(0, 10) : ''
      this.info.begin = this.form.begin_time ? this.form.begin_time.slice(0, 10) : ''
      if(this.activeName === 'second') {
        this.info.veh = val.vcode
        // this.info.vehId = val.vid
      }
      if(this.activeName === 'third') {
        this.info.driver = val.driverName
        // this.info.vehId = val.driverID
      }
      let data = val.details ? val.details : []     
      this.$refs.infoDialog.setTableData(data)
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx;
      this.loadData();
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 计算高度
    setHead() {
      switch (this.activeName) {
        case 'first':
          let maxh1 = this.$el.offsetHeight;
          let th1 = this.$refs.firstHead.$el.offsetHeight;
          let ph1 = this.$refs.firstPaginationH.$el.offsetHeight;
          this.firstTableHeight = maxh1 - th1 - ph1 - 55
          break;
        case 'second':
          let maxh2 = this.$el.offsetHeight;
          let th2 = this.$refs.secondHead.$el.offsetHeight;
          // let ph2 = this.$refs.secondPaginationH.$el.offsetHeight;
          this.secondTableHeight = maxh2 - th2 - 55
          break;
        case 'third':
          let maxh3 = this.$el.offsetHeight;
          let th3 = this.$refs.thirdHead.$el.offsetHeight;
          // let ph3 = this.$refs.thirdPaginationH.$el.offsetHeight;
          this.thirdTableHeight = maxh3 - th3 - 55
          break;
      }
    },
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.speed-statistics
  width 100%
  height 100%

  /deep/ .el-tabs__item
    width 160px
    text-align center

  /deep/ .el-tabs__nav-wrap::after
    height 0px
</style>

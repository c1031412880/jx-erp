<template>
  <el-dialog
    :visible="dialogBool"
    :before-close="dialogClose"
    width="800px"
    :close-on-click-modal="false"
  >
    <div slot="title" class="dialog-header">
      <p>超速明细</p>
      <p>当前日期范围是：<span>{{ begin }}</span> 至 <span>{{ end }}</span></p>
      <p v-if="this.funcType === 'second'">当前车辆：<span>{{ veh }}</span></p>
      <p v-if="this.funcType === 'third'">当前驾驶员：<span>{{ driver }}</span></p>
    </div>
    <div class="el-dialog-div">
      <tr-table
        :backFixedNum="0"
        :data="data"
        :frontFixedNum="0"
        :loading="loading"
        :selectionShow="false"
        :TableHeight="firstTableHeight"
        :isShowBottomOptions="false"
        :tableHeaderList="customSettingList"></tr-table>
    </div>

    <div slot="footer" class="dialog-footer" >
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
      <div class="btn"><el-button type="primary" @click="onExportFile">导出</el-button></div>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">

export default {
  components: {
    
  },
  props: {
    funcType: String,
    dialogBool: Boolean,
    begin: {
      type: String,
      default: ''
    },
    end: {
      type: String,
      default: ''
    },
    veh: {
      type: String,
      default: ''
    },
    driver: {
      type: String,
      driver: ''
    },
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      data: [],
      vehId: '',
      dataInfo: [],
      loading: false,
      customSettingList: [],
      firstTableHeight: 500,
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
          sortable: false,
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
          label: "超速类型",
          prop: "atype_name",
          width: "130",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
      ],
      secondCustomSettingList: [
        {
          id: 1,
          label: "驾驶员",
          prop: "driverName",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "自编号",
          prop: "vNum",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "车牌号",
          prop: "vcode",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "所属组织",
          prop: "department",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "线路",
          prop: "linename",
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
          label: "超速类型",
          prop: "atype_name",
          width: "130",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
      ],
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    setTableData(val) {
      this.customSettingList = this.funcType === 'second' ? this.firstCustomSettingList : this.secondCustomSettingList
      this.loading = true
      if(!!val && val.length) {
        this.dataInfo = val
        // this.vehId = this.funcType === 'second' ? val[0].vid : val[0].driverID
        this.vehId = ''
        if(this.funcType === 'second' && val[0].vid) {
          this.vehId = val[0].vid 
        }
        if(this.funcType === 'third' && val[0].driverID) {
          this.vehId = val[0].driverID 
        }
      }
      let arr = []
      for(let i = (this.pageInfo.pageIndex - 1) * this.pageInfo.pageSize; i < this.pageInfo.pageSize * this.pageInfo.pageIndex; i++){
        if(this.dataInfo[i]){
          arr.push(this.dataInfo[i])
        } else {
          break
        }
      }
      this.data = arr 
      this.pageInfo.pageCount = this.dataInfo.length
      setTimeout(() => {      
        this.loading = false
      }, 300);
    },
    onExportFile() {
      let info = {};
      for (let i in this.pageInfo) {
        if (this.pageInfo[i]) {
          info[i] = this.pageInfo[i];
        }
      }
      info.vehId = [ this.vehId ]
      // console.log(info);
      this.$emit("on-export", info);
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx;
      this.setTableData();
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.setTableData();
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
/deep/ .el-dialog__body {
  padding-top: 10px;
  padding-bottom: 10px;
}
/deep/ .el-dialog__header {
  background-color: #E0F3FF;

  .dialog-header {
    display: flex;
    p~p {
      margin-left: 80px;
    }

    span {
      color: red;
    }
  }
}
/deep/ .el-dialog__footer {
  padding-top: 0;

  .dialog-footer {
    display: flex;
    justify-content: space-between;
  }
}
</style>



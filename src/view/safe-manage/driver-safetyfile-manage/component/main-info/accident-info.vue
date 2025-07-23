<template>
  <div class="install-info" style="height: 470px; overflow-x: hidden">
    <div class="use-table-record show-flex-box-c" style="margin: 0 20px">
      <el-form :inline="true" size="mini">
        <el-row>
          <el-form-item label="事故日期范围:">
            <el-date-picker
              v-model="date"
              type="daterange"
              range-separator="至"
              start-placeholder="选择事故开始日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              end-placeholder="选择事故结束日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="reqAccidentRecordList"
              >查询</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button @click="Reset" icon="el-icon-refresh-left"
              >重置</el-button
            >
          </el-form-item>
        </el-row>
      </el-form>
      <div class="table">
        <tr-table
          :selectionShow="true"
          :data="dataList"
          :tableHeaderList="canRendererTableHeader"
          :isShowBottomOptions="false"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="0"
          :backFixedNum="0"
        >
        </tr-table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    curChangeType: {
      type: String,
      default: "add",
    },
  },
  data() {
    return {
      date: [],
      canRendererTableHeader: [
        {
          id: 1,
          label: "事故发生时间",
          prop: "d_accident_date",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "驾驶员",
          prop: "driver_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "自编号",
          prop: "vehicle_number",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "车牌号",
          prop: "lincense_plate_number",
          width: "165",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "所属组织",
          prop: "department_name",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "线路",
          prop: "line",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "事故原因",
          prop: "accident_reason",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "事故地点",
          prop: "c_accident_address",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "事故类型",
          prop: "accident_type",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "事故责任",
          prop: "accident_duty",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "事故类别",
          prop: "accident_category",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "事故性质",
          prop: "accident_nature",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "经办人",
          prop: "agent",
          width: "130",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "扣减安全里程",
          prop: "n_result_mile",
          width: "140",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
        {
          id: 15,
          label: "罚款",
          prop: "n_result_cost",
          width: "130",
          align: "center",
          signIndex: 14,
          sortable: false,
        },
        {
          id: 16,
          label: "处理人",
          prop: "disposer",
          width: "130",
          align: "center",
          signIndex: 15,
          sortable: false,
        },
        {
          id: 17,
          label: "处理日期",
          prop: "d_result_date",
          width: "130",
          align: "center",
          signIndex: 16,
          sortable: false,
        },
        {
          id: 18,
          label: "处理意见",
          prop: "c_result_remark",
          width: "130",
          align: "center",
          signIndex: 17,
          sortable: false,
        },
      ],
      TableHeight: 400,
      curInfo: {}, //当前操作的记录
      dataList: [],
      loading: false,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 初始化数据
    resetData() {
      this.date = [];
    },
    // 数据回显
    setData(val) {
      this.curInfo = val;
      this.reqAccidentRecordList();
    },
    // 获取事故记录
    reqAccidentRecordList() {
      this.date = this.$addTime(this.date)
      this.loading = true;
      let parmas = {
        i_driver_id: [],
      };
      if (this.date.length > 0) {
        parmas.begin = this.date[0];
        parmas.end = this.date[1];
      }
      parmas.i_driver_id.push(this.curInfo.i_id);
      this.$client.getAccidentRecordList(parmas).then((res) => {
        if (res.head.result == "200") {
          this.dataList = res.context.list;
          this.loading = false;
        } else {
          this.loading = false;
          this.dataList = [];
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
        this.loading = false;
      });
    },
    // 重置
    Reset() {
      this.date = [];
      this.reqAccidentRecordList();
    },
  },
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.install-info /deep/ .el-input {
  width: 420px;
}

.install-info /deep/ .el-input--mini {
  width: 420px;
}

.install-info/deep/ .el-date-editor {
  width: 420px;
}
</style>


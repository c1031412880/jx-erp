<template>
  <div class="install-info" style="height: 470px; overflow-x: hidden">
    <div class="use-table-record show-flex-box-c" style="margin: 0 20px">
      <el-form :inline="true" size="mini">
        <el-row>
          <el-form-item label="违规日期范围:">
            <el-date-picker
              v-model="date"
              type="daterange"
              range-separator="至"
              start-placeholder="选择违规开始日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              end-placeholder="选择违规结束日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="reqIllegalRecordList"
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
      default: "edit",
    },
    info: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      date: [],
      canRendererTableHeader: [
        {
          id: 1,
          label: "违规日期",
          prop: "d_violation_date",
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
          prop: "v_num",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "车牌号",
          prop: "lp_num",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "所属组织",
          prop: "department",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "来源",
          prop: "source_name",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "责任部门",
          prop: "department",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "违规项目",
          prop: "violation_item_name",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "处罚依据",
          prop: "check_item",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "奖罚金额",
          prop: "check_amount",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "加减分数",
          prop: "check_core",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "相关图片",
          prop: "images",
          width: "150",
          align: "center",
          signIndex: 11,
          sortable: false
        },
        {
          id: 13,
          label: "是否取消本季星级考核",
          prop: "cancel_star",
          width: "190",
          align: "center",
          signIndex: 12,
          sortable: false
        },
        {
          id: 14,
          label: "备注",
          prop: "c_remark",
          width: "130",
          align: "center",
          signIndex: 13,
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
  mounted() {
    this.setData(this.info)
  },
  methods: {
    // 初始化数据
    resetData() {
      this.date = [];
    },
    // 数据回显
    setData(val) {
      this.curInfo = val;
      this.reqIllegalRecordList();
    },
    // 获取违规记录
    reqIllegalRecordList() {
      this.loading = true;
      let parmas = {
        driver_id: [],
      };
      if (this.date.length > 0) {
        parmas.violation_date_start = this.date[0] + ' 00:00:00';
        parmas.violation_date_end = this.date[1]+ ' 23:59:59';
      }
      parmas.driver_id.push(this.curInfo.id);
      this.$client.getDriverRecord(parmas).then((res) => {
        if (res.head.result == "200") {
          this.dataList = res.context.list;
          // this.dataList = [{id:1,}]
          // this.dataList[0].images = [
          //   {
          //     url:'http://122.225.198.118:5000/Files/Employee/Images/71b29805698b4f158f5e8a87b4d112a4.jpg'
          //   },
          //   {
          //     url:'http://122.225.198.118:5000/Files/Employee/Images/71b29805698b4f158f5e8a87b4d112a4.jpg'
          //   },
          //   {
          //     url:'http://122.228.7.75:7000/Files/Employee/Images/20211216002506.jpg'
          //   },
            
          // ]
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
      this.reqIllegalRecordList();
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


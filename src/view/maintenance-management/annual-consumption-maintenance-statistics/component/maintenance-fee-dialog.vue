<template>
  <el-dialog
    :visible="dialogBool"
    :before-close="dialogClose"
    width="800px"
  >
    <div slot="title">
      <p style="margin-bottom: 10px;">消耗明细</p>
      <p>
        <span>日期范围:</span>
        <span style="color: red">{{ form.start_date }}至{{ form.end_date }}</span>
      </p>
    </div>
    <div class="el-dialog-div">
      <el-form :inline="true" size="mini">
        <el-form-item>
          <get-vehicle-select-tree
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_ids">
          </get-vehicle-select-tree>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="loadData"
            >查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" icon="el-icon-refresh-right"
            >重置</el-button>
        </el-form-item>
      </el-form>
      <tr-table
        ref="table"
        :indexShow="true"
        :selectionShow="false"
        :data="data"
        :tableHeaderList="customSettingList"
        :isShowBottomOptions="false"
        :TableHeight="TableHeight"
        :loading="loading"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum"
        :isShowSummary="true">
      </tr-table>
      <el-pagination
        style="margin: 5px 0;display:flex; justify-content: flex-end;"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        ref="paginationH"
        :current-page="pageInfo.pageIndex"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        :page-size="pageInfo.pageSize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="pageInfo.pageCount">
      </el-pagination>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
export default {
  components: {getVehicleSelectTree},
  props: {
    dialogBool: Boolean,
  },
  mounted() {
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      data: [],
      form: {
        start_date: '',
        end_date: '',
        fuel_type: '',
        vehicle_ids: [],
      },
      loading: false,
      TableHeight: 500,
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      // 维保费用
      customSettingList: [
        {
          id: 1,
          label: "日期",
          align: "center",
          prop: "date",
          width: '120',
          signIndex: 0,
        },
        {
          id: 2,
          label: "自编号",
          align: "center",
          prop: "number",
          width: '120',
          signIndex: 1,
        },
        {
          id: 3,
          label: "车牌号",
          align: "center",
          prop: "plate_number",
          width: '120',
          signIndex: 2,
        },
        {
          id: 4,
          label: "里程(KM)",
          align: "center",
          prop: "total_mileage",
          width: '120',
          signIndex: 3,
        },
        {
          id: 5,
          label: "趟数",
          align: "center",
          prop: "count",
          width: '120',
          signIndex: 4,
        },
        {
          id: 6,
          label: "停保里程(KM)",
          align: "center",
          prop: "stop_mileage",
          width: '120',
          signIndex: 5,
        },
        {
          id: 7,
          label: "运送里程(KM)",
          align: "center",
          prop: "transfer_mileage",
          width: '120',
          signIndex: 6,
        },
        {
          id: 8,
          label: "合计(KM)",
          align: "center",
          prop: "total_mileage",
          width: '120',
          signIndex: 7,
        },
      ],
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        this.customSettingList = null
        Object.assign(this.$data, this.$options.data());
        this.$refs.vehicleTree.onClear();
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    setData(val) {
      this.form.start_date = val.begin_time
      this.form.end_date = val.end_time
      this.form.fuel_type = val.type
      this.loadData()
    },
     // 数据加载
    loadData() {
      this.loading = true;
      let content = JSON.parse(JSON.stringify(this.form));
      content.page_index = this.pageInfo.pageIndex;
      content.page_size = this.pageInfo.pageSize;
      content.vehicle_ids = this.form.vehicle_ids.join()
      this.$client[this.loadKey](content).then(req => {
        console.log(req);
        this.loading = false;
        if (req.head.result === "200") {
          this.data = req.context.list;
          this.pageInfo.pageCount = req.context.total;
        } else {
          this.data = [];
          this.pageInfo.pageCount = 0;
          this.$message({
            showClose: true,
            message: req.head.describle,
            type: "error",
          });
        }
      })
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
    resetForm() {
      this.form.vehicle_ids = []
      this.$refs.vehicleTree.onClear();
      this.loadData()
    }
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>


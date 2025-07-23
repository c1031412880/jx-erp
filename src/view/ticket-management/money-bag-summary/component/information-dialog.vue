<template>
  <el-dialog
    fullscreen
    title="日钱袋录入明细"
    :visible="dialogBool"
    :before-close="dialogClose">
    <tr-table
      :selectionShow="false"
      :data="data"
      :tableHeaderList="customSettingList"
      :TableHeight="TableHeight"
      :loading="loading">
    </tr-table>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    dialogBool: Boolean,
    requestData: [Object]
  },
  data() {
    return {
      data: [],
      TableHeight: 800,
      loading: false,
      customSettingList: [
        {
          id: 1,
          label: "线路",
          prop: "line_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "线路首末站",
          prop: "line_start_end",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "车牌号",
          prop: "lp_num",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "日期",
          prop: "date",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "总计金额",
          prop: "total_fee",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "录入人",
          prop: "created_name",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "录入时间",
          prop: "created_date",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "审核状态",
          prop: "state_name",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "审核人",
          prop: "check_name",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "审核时间",
          prop: "check_time",
          width: "160",
          align: "center",
          signIndex: 9,
          sortable: true,
        }
      ],
    }
  },
  watch: {
    dialogBool(bool) {
      if(bool) {
        this.loadData()
      }else {
        Object.assign(this.$data, this.$options.data());
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    loadData() {
      this.loading = true
      this.$client.GetByPageDayPurse(this.requestData).then(res => {
        this.loading = false;
        if (res.head.result == "200") {
          this.data = res.context.list
        }else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
      .catch((err) => {
        this.loading = false;
        this.$message({
          showClose: true,
          message: err.body.message,
          type: "error",
        });
      });
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
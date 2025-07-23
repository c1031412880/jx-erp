<template>
  <el-dialog
    :title="date + '加班转调休明细'"
    :visible="dialogBool"
    append-to-body
    width="700px"
    :before-close="dialogClose">
    <tr-table
      :data="data"
      :loading="loading"
      :selectionShow="false"
      :TableHeight="TableHeight"
      :backFixedNum="backFixedNum"
      :frontFixedNum="frontFixedNum"
      :tableHeaderList="customSettingList">
      <template slot-scope="scope" slot="operation">
        <!-- <el-button @click="openApplyInfo(scope.data)" type="text" size="mini">查看</el-button> -->
        <el-popconfirm
          v-if="scope.data.form_name != '管理员添加'"
          @confirm="openApplyInfo(scope.data)"
          title="是否确认关闭当前页所有弹窗并查看该审批单？">
          <el-button slot="reference" type="text" size="mini">查看</el-button>
        </el-popconfirm>
      </template>
    </tr-table>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    dialogBool: Boolean,
    // date: {
    //   type: String,
    //   default: ''
    // },
    // data: {
    //   type: Array,
    //   default: () => []
    // }
  },
  data() {
    return {
      date: '',
      data: [],
      frontFixedNum:0, //前几行固定
      backFixedNum:1, //后几行固定
      loading: false,
      TableHeight: 500,
      customSettingList: [
        {
          id: 1,
          label: "审批单",
          prop: "form_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "起止日期",
          prop: "start_end_time",
          width: "180",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "时长",
          prop: "hour",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "操作",
          prop: "operation",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        }
      ],
    }
  },
  watch: {
    dialogBool(bool) {
      if(bool === false) {
        this.data = []
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    setDate(info) {
      this.date = info.finish_date
      let params = {context: info.overtime_id}
      this.loading = true
      this.$client.GetOverCompensatoryDetailsRestManage(params)
        .then(res => {
          this.loading = false
          if (res.head.result == "200") {
            this.data = res.context
          } else {
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
    openApplyInfo(row) {
      this.$emit('on-close')
      this.$nextTick(() => {
        let detail_id = row.form_name == '加班单' ? 5010 : 5000
        let id = row.form_name == '加班单' ?  row.over_time_id : row.rest_main_id
        this.$router.push({
          path: `/news-details/${id}/${row.form_name}/${detail_id}`
        })
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
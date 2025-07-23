<template>
  <tr-dialog
    :visible="dialogBool"
    title="查看驾驶员星级"
    @before-close="dialogClose"
    width="860px"
  >
    <div class="el-dialog-div">
      <tr-table
      :data="data"
      :TableHeight="TableHeight"
      :backFixedNum="0"
      :frontFixedNum="0"
      :tableHeaderList="customSettingList"
      >
      <template slot-scope="scope" slot="last_star">
        <div v-if="scope.data.last_star">
          <el-rate v-model="scope.data.last_star" :max="scope.data.last_star"  :colors="['#F56C6C','#F56C6C','#F56C6C']"></el-rate>
        </div>
        <div class="show-flex-box-r show-flex-center" v-else>
          <span>无</span>
        </div>
      </template>
      <template slot-scope="scope" slot="now_star">
        <div v-if="scope.data.now_star">
          <el-rate v-model="scope.data.now_star" :max="scope.data.now_star" disabled :colors="['#F56C6C','#F56C6C','#F56C6C']"></el-rate>
        </div>
        <div class="show-flex-box-r show-flex-center" v-else>
          <span>无</span>
        </div>
      </template>
      <template slot-scope="scope" slot="change"> 
        <div v-if="scope.data.change > 0" style="color:#70B603">
          <i class="el-icon-top"></i>升星
        </div>
        <div v-else-if="scope.data.change < 0" style="color:#F56C6C">
          <i class="el-icon-bottom"></i>降星
        </div>
        <div v-else></div>
      </template>
      </tr-table>
    </div>
  </tr-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  components: {},
  props: {
    dialogBool: Boolean,
  },
  data() {
    return {
      data: [],
      TableHeight: 300,
      customSettingList: [
        {
          id: 1,
          label: "姓名",
          prop: "driver_name",
          width: "120",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "所属组织",
          prop: "dept_name",
          width: "120",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "原星级",
          prop: "last_star",
          width: "160",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "原星级持续季度",
          prop: "quarter",
          width: "160",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "评定后星级",
          prop: "now_star",
          width: "160",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "评定后星级持续季度",
          prop: "now_quarter",
          width: "160",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "评定季度",
          prop: "year_quarter",
          width: "150",
          align: "center",
          signIndex: 6,
        },
        {
          id: 8,
          label: "变化情况",
          prop: "change",
          width: "120",
          align: "center",
          signIndex: 7,
        },
        {
          id: 9,
          label: "备注（申请理由）",
          prop: "remark",
          width: "150",
          align: "center",
          signIndex: 8,
        },
        {
          id: 10,
          label: "评星日期",
          prop: "star_time",
          width: "150",
          align: "center",
          signIndex: 9,
        },
        {
          id: 11,
          label: "审批单编号",
          prop: "flow_code",
          width: "150",
          align: "center",
          signIndex: 10,
        },
        {
          id: 12,
          label: "经办人",
          prop: "create_name",
          width: "150",
          align: "center",
          signIndex: 11,
        },
        {
          id: 13,
          label: "经办时间",
          prop: "created_date",
          width: "150",
          align: "center",
          signIndex: 12,
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
    // 数据加载
    loadData(id) {
      this.$client.GetChangeRecordDriverStar({driver_id:id})
        .then(res => {
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
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div /deep/ .el-input {
  width: 420px;
}
</style>


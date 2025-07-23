<template>
  <el-dialog
    :visible="dialogBool"
    title="抄送记录"
    :before-close="dialogClose"
    width="760px"
    top="80px"
  >
    <div class="el-dialog-div">
      <tr-table
      :data="data"
      :tableHeaderList="customSettingList"
      :TableHeight="TableHeight"
      :frontFixedNum="0"
      :backFixedNum="0"
    >
      <template slot-scope="scope" slot="is_read">
        <span :style="{color:scope.data.is_read ? '#70B603' : '#D9001B'}">{{scope.data.is_read ? '已读' : '未读'}}</span>
      </template>
    </tr-table>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  components: {
  },
  props: {
    dialogBool: Boolean,
  },
  data() {
    return {
      data: [],
      customSettingList: [
        {
          id: 1,
          label: "抄送人员",
          prop: "copy_name",
          width: "80",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "抄送时间",
          prop: "create_time",
          width: "150",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "操作人",
          prop: "create_name",
          width: "130",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "状态",
          prop: "is_read",
          width: "80",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "阅读时间",
          prop: "read_time",
          width: "150",
          align: "center",
          signIndex: 4,
        },
      ],
      TableHeight: 300
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
      }
    },
  },
  methods: {
    // 获取抄送记录 
    loadData(id) {
      this.$client.GetCopyRecordsAssessManage({context:id})
      .then(res => {
        if (res.head.result == "200") {
          this.data = res.context;
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      })
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>



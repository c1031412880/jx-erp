<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="900px"
    append-to-body>
    <div class="el-dialog-div">
      <!-- 这里可根据实际需求调整弹窗内容 -->
      <tr-table
        :data="data"
        :loading="loading"
        :TableHeight="TableHeight"
        :tableHeaderList="canRendererTableHeader">

      </tr-table>
    </div>
  </el-dialog>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "详情",
    },
  },
  data() {
    return {
      data: [],
      loading: false,
      TableHeight: 500,
      canRendererTableHeader: [
        {
          id: 1,
          label: "审批单",
          prop: "approval_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "时长(天)",
          prop: "duration",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "起止时间",
          prop: "start_end_time",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "审批编号",
          prop: "approval_number",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
      ],
    };
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    }
  }
};
</script>
<style scoped>
.el-dialog-div {
  padding: 20px;
}
</style> 
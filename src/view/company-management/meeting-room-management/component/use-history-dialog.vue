<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="810px"
    
  >
    <div class="el-dialog-div">
      <tr-table
        :selectionShow="false"
        :data="listReserveHistoryData"
        :tableHeaderList="canRendererTableHeader"
        :isShowBottomOptions="false"
        :TableHeight="TableHeight"
        :loading="loading"
        :frontFixedNum="0"
        :backFixedNum="0"
      >
      <template slot-scope="scope" slot="time">
        <span v-if="scope.data.begin_time && scope.data.end_time">{{scope.data.begin_time}}~{{scope.data.end_time}}</span>
        <span v-else>--</span>
      </template>
      </tr-table>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  components: {},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "历史记录",
    },
    curSelecedType: [String],
    listReserveHistoryData:[Array]
  },
  mounted() {
  },
  data() {
    return {
      loading: false,
      TableHeight: 400,
      data:[],
      canRendererTableHeader:[
        {
          id: 1,
          label: "审批单编号",
          prop: "flow_code",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "使用人姓名",
          prop: "ex_apply_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "会议室名称",
          prop: "ex_meeting_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "预约时间",
          prop: "time",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "使用情况",
          prop: "ex_state",
          width: "160",
          align: "center",
          signIndex: 4,
          sortable: false,
        }
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

  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div{
  height: 400px;
}
</style>


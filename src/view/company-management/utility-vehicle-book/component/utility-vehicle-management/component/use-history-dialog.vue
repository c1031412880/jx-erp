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
      <template slot-scope="scope" slot="state">
        <span>{{scope.data.state === 1?'进行中':'已结束'}}</span>
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
          label: "借车人",
          prop: "borrow_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "借车部门",
          prop: "borrow_dept",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "车辆别名",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "出车时间",
          prop: "borrow_time",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "还车时间",
          prop: "back_time",
          width: "160",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "使用时间/小时",
          prop: "use_time",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "出车里程/KM",
          prop: "borrow_mile",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "还车里程/KM",
          prop: "back_mile",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "出发地",
          prop: "from_address",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "目的地",
          prop: "to_address",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "用途",
          prop: "purpose",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "状态",
          prop: "state",
          width: "130",
          align: "center",
          signIndex: 11,
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


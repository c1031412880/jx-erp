<template>
  <div class="install-info" style="height:470px;overflow-x:hidden">
      
      <div class="use-table-record show-flex-box-c" style="margin:0 20px;">
        <div class="table">
          <tr-table
              :selectionShow="false"
              :data="data"
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
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
export default {
  components: {getVehicleSelectTree},
  props: {
    curChangeType: {
      type: String,
      default: "add",
    },
    info: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      canRendererTableHeader: [
        {
          id: 1,
          label: "姓名",
          prop: "ex_driver_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "原组织",
          prop: "ex_dept_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "新组织",
          prop: "ex_new_dept_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "调动日期",
          prop: "change_date",
          width: "165",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "调动原因",
          prop: "reason",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "操作人",
          prop: "ex_opor_name",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "操作时间",
          prop: "created_date",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: true,
        }
      ],
      TableHeight:430,
      curInfo:{}, //当前操作的事故
      isShowAddDialog: false,
      selectedIds:[], //勾选的ids
      data:[], //人员调动记录列表
      loading: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.setData(this.info)
  },
  methods: {
    // 初始化数据
    resetData(){ 
      this.data = [];
    },
    // 数据回显
    setData(val){
      this.curInfo = val;
      this.reqTransferRecordList();
    },
    // 获取调动记录
    reqTransferRecordList() {
      this.loading = true
      let parmas = {
        user_id: this.curInfo.id,
      }
      this.$client.DriverChangeListDriverSafeArchives(parmas)
        .then(res => {
          if (res.head.result == "200") {
            this.data = res.context.list;
            this.loading = false
          } else {
            this.loading = false
            this.data = [];
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          };
          this.loading = false;
        })
    },
    onSubmit() {
      
    },
    Reset() {

    },
    
  }
}

</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>

  .install-info /deep/ .el-input{
    width: 420px;
  }

  .install-info /deep/ .el-input--mini{
    width: 420px;
  }

  .install-info/deep/ .el-date-editor {
    width: 420px;
  }
</style>


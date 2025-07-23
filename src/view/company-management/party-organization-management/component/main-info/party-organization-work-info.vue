<template>
  <div style="height: 470px; overflow-x: hidden" class="show-flex-box-c">
    <div class="party-organization-work-info show-flex-box-c">
      <tr-table
        :selectionShow="false"
        :data="dataList"
        :tableHeaderList="canRendererTableHeader"
        :isShowBottomOptions="false"
        :TableHeight="TableHeight"
        :loading="loading"
        :frontFixedNum="1"
        :backFixedNum="0"
      >
      </tr-table>
    </div>

  </div>
</template>
<script>
export default {
  components: {},
  props: {
    curChangeType: {
      type: String,
      default: "add",
    }
  },
  data() {
    return {
      canRendererTableHeader: [
        {
          id: 1,
          label: "活动名称",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },{
          id: 2,
          label: "组织名称",
          prop: "ex_organ_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },{
          id: 3,
          label: "活动类别",
          prop: "ex_type",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },{
          id: 4,
          label: "活动属性",
          prop: "ex_nature",
          width: "165",
          align: "center",
          signIndex: 3,
          sortable: false,
        },{
          id: 5,
          label: "状态",
          prop: "ex_state",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },{
          id: 6,
          label: "开始时间",
          prop: "start_date",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },{
          id: 7,
          label: "结束时间",
          prop: "end_date",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },{
          id: 8,
          label: "是否为培训活动",
          prop: "ex_is_px",
          width: "150",
          align: "center",
          signIndex: 6,
          sortable: false,
        },{
          id: 9,
          label: "是否为三会一课",
          prop: "ex_is_shyk",
          width: "160",
          align: "center",
          signIndex: 8,
          sortable: false,
        }
      ],
     
      TableHeight: 400,
      loading: false,
      dataList:[], //车损记录
    };
  },
  methods: {
    // 初始化数据
    resetData() {
     this.dataList = [];
    },
    // 数据回显
    setData(val) {
      this.curInfo = val;
      this.reqDamageRecordList();
    },
     // 获取记录
    reqDamageRecordList() {
      this.loading = true
      let parmas = {
        party_id: this.curInfo.id
      }
      this.$client.ListPartyActivity(parmas)
        .then(res => {
          if (res.head.result == "200") {
            this.dataList = res.context.list;
            this.loading = false
          } else {
            this.loading = false
            this.dataList = [];
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          };
        })
    },

  },
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>

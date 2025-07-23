<template>
  <div style="height: 470px; overflow-x: hidden" class="show-flex-box-c">
    <div class="car-damage show-flex-box-c">
      <tr-table
        :selectionShow="false"
        :data="recordList"
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
          label: "姓名",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },{
          id: 2,
          label: "党内职务",
          prop: "position",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },{
          id: 3,
          label: "手机号",
          prop: "phone",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },{
          id: 4,
          label: "身份证号",
          prop: "idcode",
          width: "165",
          align: "center",
          signIndex: 3,
          sortable: false,
        },{
          id: 5,
          label: "性别",
          prop: "sex",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },{
          id: 6,
          label: "民族",
          prop: "nation",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },{
          id: 7,
          label: "人员类别",
          prop: "ex_type",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },{
          id: 8,
          label: "所在党组织",
          prop: "ex_party_branch",
          width: "160",
          align: "center",
          signIndex: 7,
          sortable: false,
        }
      ],
      TableHeight: 400,
      curInfo: {},
      loading: false,
      recordList:[], //记录
    };
  },
  mounted() {},
  methods: {
    // 初始化数据
    resetData() {
      this.recordList = []
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
        organ_id: this.curInfo.id
      }
      this.$client.ListPartyRecord(parmas)
        .then(res => {
          if (res.head.result == "200") {
            this.recordList = res.context.list;
            this.loading = false
          } else {
            this.loading = false
            this.recordList = [];
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

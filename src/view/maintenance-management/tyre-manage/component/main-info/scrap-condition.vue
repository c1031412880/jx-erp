<template>
  <div style="height:400px;overflow-x:hidden" class="show-flex-box-c">
    <tr-table
      :selectionShow="false"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    >
    </tr-table>
  </div>
</template>
<script>
export default {
  components: {},
  props: {},
  data() {
    return {
     frontFixedNum: 0, //前几行固定
      backFixedNum: 0, //后几行固定
      canRendererTableHeader: [
         {
          id: 1,
          label: "轮胎编号",
          prop: "tyre_number",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "车辆自编号",
          prop: "vehicle_number",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "车牌号",
          prop: "vehicle_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "所属组织",
          prop: "department",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "轮胎品牌",
          prop: "brand",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "轮胎型号",
          prop: "tyre_model_name",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "轮胎损坏情况",
          prop: "fail_describe",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "日期",
          prop: "date",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        {
          id: 9,
          label: "轮胎里程",
          prop: "mileage",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: true,
        },
        {
          id: 10,
          label: "位置",
          prop: "position_name",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "更换场站",
          prop: "replace_station",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "处理方式",
          prop: "treatment_method_name",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "提交人",
          prop: "created_name",
          width: "130",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
        {
          id: 15,
          label: "提交时间",
          prop: "created_time",
          width: "130",
          align: "center",
          signIndex: 14,
          sortable: true,
        },
        {
          id: 16,
          label: "审核状态",
          prop: "state_name",
          width: "130",
          align: "center",
          signIndex: 15,
          sortable: false,
        },
        {
          id: 17,
          label: "审核人",
          prop: "audit_user_name",
          width: "130",
          align: "center",
          signIndex: 16,
          sortable: false,
        },
        {
          id: 18,
          label: "审核时间",
          prop: "audit_time",
          width: "130",
          align: "center",
          signIndex: 17,
          sortable: true,
        },
        {
          id: 19,
          label: "审核备注",
          prop: "audit_remark",
          width: "130",
          align: "center",
          signIndex: 18,
          sortable: false,
        },
        
      ],
      data:[], 
      TableHeight:350,
      loading:false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 初始化数据
    resetData(){ 
      this.data = []
    },
    // 数据回显
    setData(val){
      let params = {
          tyre_id: val.id,
          treatment_method: [1]
        };
        this.$client.getTyreFailByPage(params).then(res => {
          if (res.head.result == "200") {
            this.data = res.context.list;
          } else {
            this.data = [];
            this.$message({ type: "error", message: res.head.describle });
          }
        });
    },
  }
}

</script>
<style>
</style>

<template>
  <div style="height: 400px; overflow-x: hidden" class="show-flex-box-c">
    <span
      style="
        font-weight: 400;
        font-style: normal;
        color: rgb(102, 102, 102);
        margin-bottom: 20px;
      "
    >
      历史大修记录:</span
    >
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
          label: "自编号",
          prop: "c_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "车牌号",
          prop: "group_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "故障原因",
          prop: "c_code",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "维修项目",
          prop: "i_hours",
          width: "115",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "报修时间",
          prop: "n_price",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 5,
          label: "完工时间",
          prop: "n_price",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 5,
          label: "维修车间",
          prop: "n_price",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 5,
          label: "维修班组",
          prop: "n_price",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 5,
          label: "维修人员或公司",
          prop: "n_price",
          width: "140",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
      ],
      data: [], //历史车辆使用记录
      TableHeight: 350,
      loading: false,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 初始化数据
    resetData() {
     
    },
    // 数据回显
    setData(val) {
      
    },
  },
};
</script>
<style>
</style>

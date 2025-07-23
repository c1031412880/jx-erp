
<template>
  <div style="height: 400px; overflow-x: hidden">
    <tr-table
      ref="table"
      :selectionShow="false"
      :data="data"
      :tableHeaderList="tableHeaderList"
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
  data() {
    return {
      data: [],
      frontFixedNum: 0,
      backFixedNum: 0,
      TableHeight: 400,
      loading: false,
      tableHeaderList: [
        {
          id: 1,
          label: "姓名",
          prop: "group",
          width: "120",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "部门",
          prop: "v_num",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "岗位级别",
          prop: "c_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "所属类别",
          prop: "year",
          width: "120",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "奖惩情形",
          prop: "en_date",
          width: "170",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "奖惩种类",
          prop: "kind",
          width: "120",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "奖惩条款",
          prop: "factory",
          width: "170",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "备注",
          prop: "seats_num",
          width: "100",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "关联条约",
          prop: "permit_num",
          width: "100",
          align: "center",
          signIndex: 8,
          sortable: false,
        },

      ],
    };
  },

  methods: {

  },
};
</script>
<style lang='scss' scoped>
</style>

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
      <template slot-scope="scope" slot="operation">
        <el-button type="primary" size="mini" @click="staffRowInfo(scope.data)"
          >详情</el-button
        >
        <el-button type="primary" size="mini" @click="editStaffInfo(scope.data)"
          >编辑</el-button
        >
        <el-popconfirm
          @confirm="tableDel(scope.data)"
          title="是否人确认员工离职？"
        >
          <el-button
            slot="reference"
            type="danger"
            size="mini"
            style="margin-left: 10px"
            >离职</el-button
          >
        </el-popconfirm>
      </template>
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
          sortable: true,
        },
        {
          id: 2,
          label: "入职日期",
          prop: "v_num",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "正式调动日期",
          prop: "c_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "调出部门",
          prop: "year",
          width: "120",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "调出部门岗位",
          prop: "en_date",
          width: "170",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "调入部门",
          prop: "kind",
          width: "120",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "调入部门岗位",
          prop: "factory",
          width: "170",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "调动原因",
          prop: "seats_num",
          width: "100",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "审批结果",
          prop: "permit_num",
          width: "100",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "审批状态",
          prop: "displacement",
          width: "100",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "当前节点",
          prop: "standard",
          width: "135",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "当前负责人",
          prop: "length",
          width: "150",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "创建人",
          prop: "color",
          width: "90",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "创建时间",
          prop: "fuel",
          width: "150",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
      ],
    };
  },

  methods: {},
};
</script>
<style lang='scss' scoped>
</style>
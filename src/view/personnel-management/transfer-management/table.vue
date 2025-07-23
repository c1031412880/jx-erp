<template>
  <tr-vxe-table
    ref="trVxeTable"
    numberAlign="center"
    :selectionShow="false"
    :data="data"
    :tableHeaderList="tableHeaderList"
    :TableHeight="TableHeight"
    :pageInfo="pageInfo"
    :loading="loading"
  >
    <template slot="operation" slot-scope="scope">
      <el-button size="mini" type="text" @click="detailShow(scope.data)">查看</el-button>
    </template>
  </tr-vxe-table>
</template>

<script>
export default {
  components: {},
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => []
    },
    TableHeight: {
      type: Number,
      default: 300
    },
    pageInfo: {
      type: Object
    }
  },
  data() {
    return {
      tableHeaderList: [
        {
          label: '申请人',
          prop: 'user_name',
          width: '130',
          align: 'center'
        },
        {
          label: '所在部门',
          prop: 'dept_name',
          width: '130',
          align: 'center'
        },
        {
          label: '申请日期',
          prop: 'req_date',
          width: '130',
          align: 'center'
        },
        {
          label: '调动人员',
          prop: 'transfer_names',
          width: '250',
          align: 'center'
        },
        {
          label: '备注',
          prop: 'remark',
          width: '250',
          align: 'center'
        },
        {
          label: '操作',
          prop: 'operation',
          width: '80',
          align: 'center',
          fixed: 'right'
        }
      ]
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 导出当前表格
    exportDataEvent(fileName) {
      this.$refs.trVxeTable.exportDataEvent(fileName)
    },
    detailShow(row) {
      this.$emit('detail-show', row)
    }
  },
  beforeDestroy() {}
}
</script>

<style lang="scss" scoped></style>

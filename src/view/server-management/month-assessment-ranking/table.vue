<template>
  <tr-vxe-table
    ref="trVxeTable"
    :selectionShow="false"
    :data="data"
    :tableHeaderList="tableHeaderList"
    :TableHeight="TableHeight"
    :loading="loading"
  ></tr-vxe-table>
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
    }
  },
  data() {
    return {
      tableHeaderList: [
        {
          label: '姓名',
          prop: 'driver_name',
          width: '130',
          align: 'center'
        },
        {
          label: '所属组织',
          prop: 'dept_name',
          width: '130',
          align: 'center'
        },
        {
          label: '当前星级',
          prop: 'star',
          width: '130',
          align: 'center'
        },
        {
          label: '考核总分',
          prop: 'score',
          width: '130',
          align: 'center'
        },
        {
          label: '最高星级',
          prop: 'max_star',
          width: '130',
          align: 'center'
        },
        {
          label: '最高星级月份',
          prop: 'Date',
          width: '130',
          align: 'center'
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
    }
  },
  beforeDestroy() {}
}
</script>

<style lang="scss" scoped></style>

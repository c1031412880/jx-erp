<template>
  <el-dialog
    :title="title"
    :visible="dialogVisible"
    width="60%"
    :before-close="handleClose"
    top="0vh"
    :close-on-click-modal="false"
  >
    <tr-table
      :selectionShow="false"
      :data="data"
      :tableHeaderList="tableHeaderList"
      :isShowBottomOptions="false"
      :TableHeight="420"
      :loading="loading"
      :frontFixedNum="1"
      :backFixedNum="0"
    ></tr-table>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      title: '违法明细',
      data: [],
      loading: false,
      tableHeaderList: [
        {
          id: 1,
          label: '驾驶员',
          prop: 'driver_name',
          width: '130',
          align: 'center',
          signIndex: 0,
          sortable: true
        },
        {
          id: 2,
          label: '自编号',
          prop: 'vehicle_number',
          width: '130',
          align: 'center',
          signIndex: 1,
          sortable: false
        },
        {
          id: 3,
          label: '车牌号',
          prop: 'lincense_plate_number',
          width: '130',
          align: 'center',
          signIndex: 2,
          sortable: false
        },
        {
          id: 4,
          label: '所属组织',
          prop: 'department_name',
          width: '165',
          align: 'center',
          signIndex: 3,
          sortable: true
        },
        {
          id: 5,
          label: '线路',
          prop: 'line',
          width: '130',
          align: 'center',
          signIndex: 4,
          sortable: true
        },
        {
          id: 6,
          label: '违法日期',
          prop: 'd_violation_date',
          width: '130',
          align: 'center',
          signIndex: 5,
          sortable: false
        },
        {
          id: 7,
          label: '违法地点',
          prop: 'c_place',
          width: '160',
          align: 'center',
          signIndex: 6,
          sortable: true
        },
        {
          id: 8,
          label: '违法项目',
          prop: 'violation_name',
          width: '160',
          align: 'center',
          signIndex: 7,
          sortable: true
        },
        {
          id: 9,
          label: '扣分',
          prop: 'score',
          width: '130',
          align: 'center',
          signIndex: 8,
          sortable: false
        },
        {
          id: 10,
          label: '罚款',
          prop: 'money',
          width: '130',
          align: 'center',
          signIndex: 9,
          sortable: false
        },
        {
          id: 11,
          label: '交警处理结果',
          prop: 'state',
          width: '130',
          align: 'center',
          signIndex: 10,
          sortable: false
        },
        {
          id: 12,
          label: '备注',
          prop: 'c_remark',
          width: '130',
          align: 'center',
          signIndex: 11,
          sortable: false
        }
      ]
    }
  },
  watch: {
    dialogVisible(bool) {
      if (!bool) {
        Object.assign(this.$data, this.$options.data())
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false)
    },
    loadData(params) {
      this.loading = true
      this.$client
        .getListViolationManage({
          context: params
        })
        .then(res => {
          if (res.head.result === '200') {
            this.data = res.context.list
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: 'error'
            })
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  },
  beforeDestroy() {}
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
>>>.el-dialog {
  top: 30%;
  transform: translateY(-30%);
}
</style>

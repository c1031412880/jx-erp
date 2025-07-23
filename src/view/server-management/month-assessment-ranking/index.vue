<template>
  <div class="month-assessment-ranking">
    <sub-req ref="subReq" @on-submit="onSubmit" @on-export="exportData" />
    <table-data ref="table" :loading="loading" :data="data" :TableHeight="TableHeight" />
  </div>
</template>

<script>
import subReq from './sub-req'
import tableData from './table'
export default {
  name: 'month-assessment-ranking',
  components: { subReq, tableData },
  props: {},
  data() {
    return {
      form: {},
      data: [],
      loading: false,
      TableHeight: 300
    }
  },
  created() {},
  mounted() {
    this.setTableHeight()
  },
  methods: {
    onSubmit(form) {
      this.form = form
      this.loadData()
    },
    loadData() {
      this.data = []
      this.loading = true
      this.$client
        .DriverStarGetMonthSort({ context: this.form })
        .then(res => {
          if (res.head.result == '200') {
            this.data = res.context.list
            if (this.data.length) {
              let max_month = this.data[0].max_month
              if (max_month && max_month.length) {
                let tableHeaderList = this.$refs.table.$options.data().tableHeaderList
                max_month.forEach(item => {
                  tableHeaderList.push({
                    label: item,
                    prop: item,
                    width: '130',
                    align: 'center'
                  })
                })
                this.$refs.table.tableHeaderList = tableHeaderList
                this.data.forEach(item => {
                  item.max_month.forEach(m => {
                    item[m] = item.history_score[m] || ''
                  })
                })
              }
            }
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
    },
    exportData() {
      if (this.data.length) {
        this.$refs.table1.exportDataEvent(this.form.year_month + '驾驶员星级排名')
      } else {
        this.$message({ message: '请先查询数据', type: 'warning' })
      }
    },
    setTableHeight() {
      this.$nextTick(() => {
        this.TableHeight = this.$el.offsetHeight - this.$refs.subReq.$el.offsetHeight
      })
    }
  },
  beforeDestroy() {}
}
</script>

<style lang="scss" scoped>
.month-assessment-ranking {
  width: 100%;
  height: 100%;
}
</style>

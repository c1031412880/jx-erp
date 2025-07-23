<template>
  <div class="transfer-management">
    <sub-req
      ref="subReq"
      @on-submit="onSubmit"
      @on-add="showTransferDialog"
      @on-export="exportData"
    />
    <table-data
      ref="table"
      :loading="loading"
      :data="data"
      :TableHeight="TableHeight"
      :pageInfo="pageInfo"
      @detail-show="detailShow"
    />
    <el-pagination
      style="margin: 5px 0; display: flex; justify-content: flex-end"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      ref="paginationH"
      :current-page="pageInfo.pageIndex"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageInfo.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageInfo.pageCount"
    />
    <transfer-dialog ref="transferDialog" :dialogVisible.sync="transferDialogVisible" />
  </div>
</template>

<script>
import subReq from './sub-req'
import tableData from './table'
import transferDialog from './dialog'
export default {
  name: 'transfer-management',
  components: { subReq, tableData, transferDialog },
  props: {},
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      form: {},
      data: [],
      loading: false,
      TableHeight: 300,
      transferDialogVisible: false
    }
  },
  created() {},
  mounted() {
    this.setTableHeight()
  },
  methods: {
    onSubmit(form) {
      this.pageInfo.pageIndex = 1
      this.pageInfo.pageCount = 0
      this.form = {
        ...form,
        page_index: this.pageInfo.pageIndex,
        page_size: this.pageInfo.pageSize
      }
      this.loadData()
    },
    loadData() {
      this.data = []
      this.loading = true
      this.$client
        .GetByPageOaPersonTransfer({ context: this.form })
        .then(res => {
          if (res.head.result == '200') {
            this.data = res.context.list
            this.pageInfo.pageCount = res.context.total
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
    detailShow(data) {
      this.$refs.transferDialog.data = data
      this.$refs.transferDialog.type = 'detail'
      this.showTransferDialog()
    },
    showTransferDialog() {
      this.transferDialogVisible = true
    },
    exportData() {
      if (this.data.length) {
        this.$refs.table1.exportDataEvent(this.form.year_month + '驾驶员星级排名')
      } else {
        this.$message({ message: '请先查询数据', type: 'warning' })
      }
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx
      this.loadData()
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1
      this.pageInfo.pageSize = sizes
      this.pageInfo.pageCount = 0
      this.loadData()
    },
    setTableHeight() {
      this.$nextTick(() => {
        this.TableHeight =
          this.$el.offsetHeight -
          this.$refs.subReq.$el.offsetHeight -
          this.$refs.paginationH.$el.offsetHeight
      })
    }
  },
  beforeDestroy() {}
}
</script>

<style lang="scss" scoped>
.transfer-management {
  width: 100%;
  height: 100%;
}
</style>

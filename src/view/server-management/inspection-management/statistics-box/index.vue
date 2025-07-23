<template>
  <div class="inspection-management">
    <sub-req ref="head" @on-ok="onSubmit" @on-export="exportFile"></sub-req>
    <tr-table
      :indexShow="true"
      :selectionShow="false"
      :data="data"
      :tableHeaderList="customSettingList"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
    ></tr-table>
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
    ></el-pagination>
  </div>
</template>

<script>
import subReq from './component/sub-req'
export default {
  name: 'inspection-management',
  components: {
    subReq
  },

  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      data: [],
      form: {},
      loading: false,
      TableHeight: 500,
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      customSettingList: [
        {
          id: 1,
          label: '稽查状态',
          prop: 'state_name',
          width: '130',
          align: 'center',
          signIndex: 0
        },
        {
          id: 2,
          label: '车牌号',
          prop: 'vehicle_code',
          width: '130',
          align: 'center',
          signIndex: 1
        },
        {
          id: 3,
          label: '自编号',
          prop: 'vehicle_number',
          width: '130',
          align: 'center',
          signIndex: 2
        },
        {
          id: 4,
          label: '所属线路',
          prop: 'line_name',
          width: '120',
          align: 'center',
          signIndex: 3
        },
        {
          id: 5,
          label: '所属组织',
          prop: 'dept_name',
          width: '120',
          align: 'center',
          signIndex: 4
        },
        {
          id: 6,
          label: '当班驾驶员',
          prop: 'driver_name',
          width: '120',
          align: 'center',
          signIndex: 5
        },
        {
          id: 7,
          label: '检查时间',
          prop: 'check_time	',
          width: '180',
          align: 'center',
          signIndex: 6
        },
        {
          id: 8,
          label: '检查员',
          prop: 'check_user',
          width: '180',
          align: 'center',
          signIndex: 7
        }
      ],
      menu_code: ''
    }
  },
  created() {
    this.menu_code = this.$route.meta.code
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead()
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    })
  },
  methods: {
    onSubmit(form) {
      this.form = form
      this.loadData()
    },
    // 获取数据
    loadData() {
      this.loading = true
      let params = Object.assign({}, this.form)
      params.page_index = this.pageInfo.pageIndex
      params.page_size = this.pageInfo.pageSize
      params.menu_code = this.menu_code
      this.$client.GetInspectManageTotal({ context: params }).then(res => {
        this.loading = false
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
    // 导出
    exportFile() {
      let params = Object.assign({}, this.form)
      this.$client.total_exportInspectManage({ context: params }).then(res => {
        if (res.head.result == '200') {
          window.location.href = res.context
          this.$message({ type: 'success', message: '导出成功' })
          this.$refs.trTable.toggleSelection([])
        } else {
          this.$message({ type: 'error', message: '导出失败' })
        }
      })
    },
    // 计算表格高度
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let th = this.$refs.head.$el.offsetHeight
        let paginationH = this.$refs.paginationH.$el.offsetHeight
        this.TableHeight = maxh - th - paginationH - 5
      }, 60)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.inspection-management {
  height: 100%;
  width: 100%;
}
</style>

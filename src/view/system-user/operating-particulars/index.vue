<template>
  <div class="operating-particulars">
    <sub-req ref="header" @on-export="exportExcel" @on-query="loadData"></sub-req>
    <tr-table 
     :data="tableData"
     :TableHeight="TableHeight"
     :loading="loading"
     :selectionShow="true"
     @on-select-change-row="selectedList"
     :tableHeaderList="canRendererTableHeader">
     <template slot-scope="scope" slot="content">
         <p v-html="scope.data.content"></p>
      </template>
    </tr-table>
    <el-pagination
      style="margin-top: 15px;text-align: end;"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      ref="paginationH"
      :current-page="pageInfo.page_index"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageInfo.page_size"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageInfo.page_count">
    </el-pagination>
  </div>
</template>
<script>
import subReq from "./component/sub-req.vue"
export default {
  data() {
    return {
      pageInfo: {
        page_index: 1,
        page_size: 100,
        page_count: 0
      },
      tableData: [],
      param: {},
      selectedIds:[], //勾选的ID
      TableHeight: 400,
      loading: false,
      canRendererTableHeader: [{
        id: 1,
        label: "功能名称",
        prop: "entire_func_name",
        align: "center"
      }, {
        id: 2,
        label: "操作类型",
        prop: "type_name",
        align: "center"
      }, {
        id: 3,
        label: "操作内容",
        prop: "content",
        width: '200',
        align: "center"
      }, {
        id: 4,
        label: "用户账号",
        prop: "user_login_id",
        align: "center"
      }, {
        id: 5,
        label: "用户姓名",
        prop: "user_name",
        align: "center"
      }, {
        id: 6,
        label: "操作时间",
        prop: "created_date",
        align: "center"
      }, {
        id: 7,
        label: "操作平台",
        prop: "platform",
        align: "center"
      }, {
        id: 8,
        label: "IP地址",
        prop: "client_ip",
        align: "center"
      }, {
        id: 9,
        label: "IP来源",
        prop: "client_address",
        align: "center"
      }, {
        id: 10,
        label: "设备型号",
        prop: "version",
        align: "center"
      }]
    }
  },
  components: {
    subReq
  },
  mounted() {
    this.$nextTick(() => {
      this.setHeight()
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHeight()
      })
    })
  },
  methods: {
    loadData(form) {
      if (form) {
        this.param = {...this.pageInfo, ...form, page_count: null}
      } else {
        this.param = {...this.param, ...this.pageInfo}
      }
      this.loading = true
      this.$client.getSysOpLog(this.param).then(res => {
        this.loading = false
        if (res.head.result === '200') {
          this.pageInfo.page_count = res.context.total
          this.tableData = res.context.list
        } else {
          this.tableData = []
          this.pageInfo.page_count = 0
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error"
          })
        }
      }).catch(err => {
        this.loading = false
      })
    },
    exportExcel(form) {
      let param = {...form}
      param.page_index = this.pageInfo.page_index
      param.page_size = this.pageInfo.page_size
      let ids = [ ...this.selectedIds ]
      if(ids.length) {
        param.ids = ids.toString()
      }
      console.log(param);
      return
      this.$client.exportSysOpLog(param).then(res => {
        if (res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        } else {
          this.$message({type: 'error', message: '导出失败'})
        }
      })
    },
    // 勾选中的
    selectedList(list) {
      this.selectedIds = [];
      if(list && list.length > 0) {
        list.forEach((item,index) => {
          this.selectedIds.push(item.id)
        });
      }
    },
    setHeight() {
      let th = this.$refs.header.$el.offsetHeight
      let paginationH = this.$refs.paginationH.$el.offsetHeight
      this.TableHeight = this.$el.offsetHeight - th - paginationH - 20
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.page_index = idx
      this.loadData()
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.page_index = 1
      this.pageInfo.page_size = sizes
      this.pageInfo.page_count = 0
      this.loadData()
    },
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.operating-particulars {
  width: 100%;
  height: 100%;
}
</style>
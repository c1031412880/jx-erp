<template>
  <div class="safety-training-record">
    <sub-req
      ref="Head"
      @on-ok="onSubmit"
      @on-del="onDelRowData"
      @on-add="onAddEditRowData"
      @on-export="onExportRowData"
      @on-print="onPrintRowData"
    ></sub-req>
    <tr-table
      :data="data"
      :loading="loading"
      :sumTotal="sumTotal"
      :sumColumnIndex="[8]"
      :isShowSummary="true"
      :selectionShow="false"
      :TableHeight="TableHeight"
      :isShowBottomOptions="false"
      :backFixedNum="backFixedNum"
      :frontFixedNum="frontFixedNum"
      :tableHeaderList="customSettingList"
      @on-select-change-row="selectedList"
    >
      <template slot-scope="scope" slot="img_list">
        <el-button
          type="text"
          size="mini"
          @click="showImage(scope.data.img_list)"
          :disabled="!scope.data.img_list.length"
          v-if="!!scope.data.img_list && scope.data.img_list.length > 0"
        >
          图片({{ scope.data.img_list.length }})
        </el-button>
        <el-button type="text" size="mini" disabled v-else>图片(0)</el-button>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button @click="onAddEditRowData('detail', scope.data)" type="text" size="mini">
          查看
        </el-button>
        <el-button
          @click="onAddEditRowData('edit', scope.data)"
          v-if="$isPowerShow('edit')"
          type="text"
          size="mini"
        >
          编辑
        </el-button>
        <el-popconfirm
          @confirm="onDelRowData('del', scope.data)"
          title="是否确删除此条记录？"
          v-if="$isPowerShow('del')"
        >
          <el-button slot="reference" type="text" size="mini" style="margin-left: 10px">
            删除
          </el-button>
        </el-popconfirm>
        <el-button
          @click="onCopyRowData('copy', scope.data)"
          v-if="$isPowerShow('copy')"
          type="text"
          size="mini"
        >
          抄送培训记录
        </el-button>
      </template>
    </tr-table>
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

    <informationDialog
      ref="informationDialog"
      @save-add-edit-row="saveAddEditRowData"
      :dialogBool.sync="isShowInformationDialog"
      :curSelectedType="curSelectedType"
    ></informationDialog>

    <el-image-viewer
      v-if="showViewer"
      :on-close="closeViewer"
      :url-list="srcList"
    ></el-image-viewer>
  </div>
</template>

<script>
import subReq from './component/sub-req'
import informationDialog from './component/information-dialog'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
  name: 'safety-training-record',
  components: {
    subReq,
    ElImageViewer,
    informationDialog
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      srcList: [],
      showViewer: false,
      sumTotal: {
        8: ''
      },
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      frontFixedNum: 1, //前几行固定
      backFixedNum: 2, //前几行固定
      selectedListIds: [], //勾选的所有ID
      curSelectedType: 'add',
      isShowInformationDialog: false,
      customSettingList: [
        {
          id: 1,
          label: '培训(演练)名称或主要议题',
          prop: 'name',
          width: '130',
          align: 'center',
          signIndex: 0,
          sortable: false
        },
        {
          id: 2,
          label: '培训(演练)日期',
          prop: 'date',
          width: '130',
          align: 'center',
          signIndex: 1,
          sortable: false
        },
        {
          id: 3,
          label: '培训(演练)地点',
          prop: 'place_name',
          width: '130',
          align: 'center',
          signIndex: 2,
          sortable: false
        },
        {
          id: 4,
          label: '培训(演练)开始时间',
          prop: 'start',
          width: '130',
          align: 'center',
          signIndex: 3,
          sortable: false
        },
        {
          id: 5,
          label: '培训(演练)结束时间',
          prop: 'end',
          width: '130',
          align: 'center',
          signIndex: 4,
          sortable: false
        },
        {
          id: 6,
          label: '结束日期',
          prop: 'end_date',
          width: '130',
          align: 'center',
          signIndex: 5,
          sortable: false
        },
        {
          id: 7,
          label: '主持人',
          prop: 'compere',
          width: '130',
          align: 'center',
          signIndex: 6,
          sortable: false
        },
        {
          id: 8,
          label: '记录人',
          prop: 'recorder',
          width: '130',
          align: 'center',
          signIndex: 7,
          sortable: false
        },
        {
          id: 9,
          label: '出席人',
          prop: 'attendance',
          width: '130',
          align: 'center',
          signIndex: 8,
          sortable: false
        },
        {
          id: 10,
          label: '培训(演练)内容记录',
          prop: 'message',
          width: '130',
          align: 'center',
          signIndex: 9,
          sortable: false
        },
        {
          id: 11,
          label: '培训(演练)照片',
          prop: 'img_list',
          width: '130',
          align: 'center',
          signIndex: 10,
          sortable: false
        },
        {
          id: 12,
          label: '操作',
          prop: 'operation',
          width: '260',
          align: 'center',
          signIndex: 11,
          sortable: false
        }
      ]
    }
  },
  mounted() {
    // this.loadData();
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
    // 数据加载
    loadData() {
      this.loading = true
      let params = { context: {} }
      params.context = Object.assign({}, this.form)
      params.page_index = this.pageInfo.pageIndex
      params.page_size = this.pageInfo.pageSize
      this.$client
        .GetByPageSafeTrainMain(params)
        .then(res => {
          if (res.head.result == '200') {
            this.loading = false
            this.data = res.context.list
            this.pageInfo.pageCount = res.context.total
            this.sumTotal = {
              8: res.context.summary.people_count
            }
          } else {
            this.loading = false
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: 'error'
            })
          }
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: 'error'
          })
        })
    },
    // 添加、编辑
    onAddEditRowData(type, row) {
      this.isShowInformationDialog = true
      this.curSelectedType = type
      if (type !== 'add') {
        this.$refs['informationDialog'].setData(row)
      }
    },
    // 保存添加、编辑
    saveAddEditRowData(form) {
      let params = {
        context: form
      }
      let obj = {
        add: 'InsertSafeTrainMain',
        edit: 'UpdateSafeTrainMain'
      }
      this.$client[obj[this.curSelectedType]](params)
        .then(res => {
          if (res.head.result == '200') {
            this.loadData()
            this.isShowInformationDialog = false
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: 'success'
            })
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: 'error'
            })
          }
        })
        .catch(err => {})
    },
    // 删除
    onDelRowData(type, row) {
      let params = {}
      params = {
        context: row ? [row.id] : this.selectedListIds
      }
      if (params.context.length == 0) {
        this.$message({
          showClose: true,
          message: '请勾选至少一条要删除的记录',
          type: 'warning'
        })
        return
      }
      this.$client.DeleteSafeTrainMain(params).then(res => {
        if (res.head.result == '200') {
          this.loadData()
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'success'
          })
        }
      })
    },
    // 导出
    onExportRowData() {
      let params = { context: {} }
      params.context = Object.assign({}, this.form)
      params.page_index = this.pageInfo.pageIndex
      params.page_size = this.pageInfo.pageSize
      this.$client.ExportSafeTrainMain(params).then(res => {
        if (res.head.result == '200') {
          window.location.href = res.context
          this.$message({ type: 'success', message: '导出成功' })
        } else {
          this.$message({ type: 'error', message: '导出失败' })
        }
      })
    },
    // 记录打印
    onPrintRowData(type) {
      this.$message({
        showClose: true,
        message: '功能完善中，敬请期待！',
        type: 'warning'
      })
      return
    },
    // 抄送会议纪要
    onCopyRowData(type, row) {
      this.$message({
        showClose: true,
        message: '功能完善中，敬请期待！',
        type: 'warning'
      })
      return
    },
    // 查看签到记录
    onCheckRowRecord(row) {
      this.$message({
        showClose: true,
        message: '功能完善中，敬请期待！',
        type: 'warning'
      })
      return
    },
    // 勾选中的
    selectedList(list) {
      this.selectedListIds = list.map(item => {
        return item.id
      })
    },
    // 查看图片
    showImage(path) {
      this.srcList = path
      this.showViewer = true
    },
    // 关闭查看器
    closeViewer() {
      this.showViewer = false
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
    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let th = this.$refs.Head.$el.offsetHeight
        let ph = this.$refs.paginationH.$el.offsetHeight
        this.TableHeight = maxh - th - ph
      }, 60)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.safety-training-record {
  width: 100%;
  height: 100%;
}
</style>

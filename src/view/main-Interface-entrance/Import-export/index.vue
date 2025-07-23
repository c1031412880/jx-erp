<template>
  <div class="import-export-records">
    <div class="header" ref="header">
      <el-form :model="form" inline size="mini">
        <el-form-item label="功能:">
          <menu-tree ref="menuTree" @node-click="nodeClick"></menu-tree>
        </el-form-item>
        <el-form-item label="操作日期:">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="请选择日期范围"
            end-placeholder="请选择日期范围"
            @change="selectedTime"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="操作类型:">
          <el-select v-model="form.type">
            <el-option
              v-for="(item,index) in options"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="loadData" type="primary">查询</el-button>
          <!-- <el-button icon="el-icon-setting" @click="standardSet" type="primary">标准设置</el-button> -->
        </el-form-item>
        <div class="tip">说明：此功能只针对大数量的导入导出进行记录。</div>
      </el-form>
    </div>
    <tr-table
      :data="tableData"
      :TableHeight="TableHeight"
      :loading="loading"
      :tableHeaderList="canRendererTableHeader">
      <template slot-scope="scope" slot="state">
        <span v-if="scope.data.state == '1'">处理中</span>
        <span v-else-if="scope.data.state == '2'">成功</span>
        <span v-else>失败</span>
      </template>
      <template slot-scope="scope" slot="state_child">
        <span v-if="scope.data.state == '3'" v-html="linefeed(scope.data.state_child)"></span>
        <span v-else>--</span>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button v-if="scope.data.type == '导出'" type="text" size="mini" @click="download(scope.data.file_url)">下载</el-button>
      </template>
    </tr-table>
    <!-- <el-pagination
      style="margin-top: 15px;text-align: end;"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      ref="paginationH"
      :current-page="pageInfo.page_index"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageInfo.page_size"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageInfo.page_count">
    </el-pagination> -->
    <standard-set-dialog :dialogBool.sync="dialogBool"></standard-set-dialog>
  </div>
</template>
<script>
import menuTree from "./component/menu-tree.vue"
import standardSetDialog from "./component/standard-set-dialog.vue"
import { getDate } from "@/utils/index"
export default {
  name: "import-export",
  components: {
    menuTree,
    standardSetDialog
  },
  data() {
    return {
      dialogBool: false,
      form: {
        menu_code: '',
        start_time: '',
        end_time: '',
        type: ''
      },
      date: [],
      options: [{
        value: '',
        label: '全部'
      }, {
        value: '1',
        label: '导入'
      }, {
        value: '2',
        label: '导出'
      }],
      pageInfo: {
        page_index: 1,
        page_size: 1000,
        page_count: 0
      },
      tableData: [],
      TableHeight: 400,
      loading: false,
      canRendererTableHeader: [{
        id: 1,
        label: "功能",
        prop: "menu_name",
        width: '160',
        align: "center"
      }, {
        id: 2,
        label: "文件名",
        prop: "file_name",
        width: '160',
        align: "center"
      }, {
        id: 3,
        label: "操作类型",
        prop: "type",
        align: "center"
      }, {
        id: 4,
        label: "操作人",
        prop: "user_name",
        align: "center"
      }, {
        id: 5,
        label: "操作时间",
        prop: "start_time",
        width: '160',
        align: "center"
      }, {
        id: 6,
        label: "结束时间",
        prop: "finish_time",
        width: '160',
        align: "center"
      }, {
        id: 7,
        label: "时长",
        prop: "deal_time",
        align: "center"
      }, {
        id: 8,
        label: "操作结果",
        prop: "state",
        align: "center"
      }, {
        id: 9,
        label: "失败原因",
        prop: "state_child",
        width: '300',
        align: "center"
      }, {
        id: 10,
        label: "操作",
        prop: "operation",
        align: "center"
      }],
    }
  },
  mounted() {
    this.onSetTime()
    let id = this.$route.params.id
    if (id) {
      Object.assign(this.$data, this.$options.data())
      this.form.id = id
    }
    this.loadData()
    this.$nextTick(() => {
      this.setHeight()
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHeight()
      })
    })
  },
  activated() {
    let id = this.$route.params.id
    if (id) {
      Object.assign(this.$data, this.$options.data())
      this.form.id = id
      this.loadData()
    }
  },
  methods: {
    onSetTime() {
      let time = getDate("lastOneYear")
      this.date = this.$addTime([time.startTime, time.endTime])
      this.form.start_time = this.date[0]
      this.form.end_time = this.date[1]
    },
    selectedTime() {
      if(this.date && this.date.length > 0) {
        this.date = this.$addTime(this.date)
        this.form.start_time = this.date[0]
        this.form.end_time = this.date[1]
      }else{
        this.form.start_time = ''
        this.form.end_time = ''
      }
    },
    nodeClick(codes) {
      this.form.menu_code = codes.length ? codes[0] : ''
    },
    setHeight() {
      let t = setTimeout(() => {
        let th = this.$refs.header.offsetHeight
        let paginationH = 0
        // let paginationH = this.$refs.paginationH.$el.offsetHeight
        this.TableHeight = this.$el.offsetHeight - th - paginationH - 20
        clearTimeout(t)
      }, 60)
    },
    // 文件下载
    download(url) {
      // window.location.href = url
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
    standardSet() {
      this.dialogBool = true
    },
    loadData() {
      this.loading = true
      let param = {...this.form, ...this.pageInfo}
      this.$client.GetImportExport(param).then(res => {
        this.loading = false
        if (res.head.result == '200') {
          // this.pageInfo.page_count = res.context.total
          this.tableData = res.context
        } else {
          this.tableData = []
          this.pageInfo.page_count = 0
        }
      }).catch(err => {
        this.loading = false
      })
    },
    linefeed (strs) {
      if (strs && strs.length) {
        return strs.split('<br/>').slice(0, 30).join('<br/>')
      } else {
        return strs
      }
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.import-export-records{
  width 100%
  height 100%
  .tip {
    font-size: 12px;
    color: #d3d3d3;
    transform: translateY(-20px);
  }
}
</style>

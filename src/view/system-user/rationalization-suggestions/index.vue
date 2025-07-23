<template>
  <div class="rationalization-suggestions">
    <sub-req ref="head" @on-add="openAddPage" @on-ok="onSubmit"></sub-req>
    <tr-table
      :selectionShow="false"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      @on-select-change-row="selectedUpkeepPlanList"
    >
      <template slot="abstract" slot-scope="scope">
        <span>{{ extractTextFromHtmlStr(scope.data.rich_text) }}</span>
      </template>
      <template slot-scope="scope" slot="state_name">
        <span :style="{ color: outColor(scope.data.state) }">{{ scope.data.state_name }}</span>
      </template>
      <template slot-scope="scope" slot="form_img">
        <span
          class="show-flex-box-r show-flex-center"
          v-if="scope.data.thumbnail_imgs && scope.data.thumbnail_imgs.length > 0"
        >
          <el-image
            style="width: 40px; height: 40px"
            :src="scope.data.thumbnail_imgs"
            :preview-src-list="scope.data.thumbnail_imgs"
          ></el-image>
          <span style="color: red">({{ scope.data.thumbnail_imgs.length }})</span>
        </span>
        <span v-else>暂无图片</span>
      </template>

      <template slot-scope="scope" slot="operation">
        <el-button type="primary" size="mini" @click="detailRowInfo(scope.data)">查看</el-button>
        <!-- <el-button type="primary" size="mini" @click="editRowInfo(scope.data)" v-if="$isPowerShow('edit')">编辑</el-button> -->
        <!-- <el-popconfirm
            @confirm="deleteRowInfo(scope.data)"
            title="确定删除此条记录吗？"
            v-if="$isPowerShow('del')">
            <el-button slot="reference" type="danger" size="mini">删除</el-button>
          </el-popconfirm> -->
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

    <fixed-form-body
      :formType="formType"
      :formId="6700"
      :formName="'合理化意见反馈表'"
      :dialogBool.sync="fixedFormBodyShow"
      @on-refresh="loadData"
    ></fixed-form-body>

    <information-dialog
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      :curSelecedType="curSelecedType"
      :title="informationDialogTitle"
      @subimit-suggestions="saveAddEdit"
    ></information-dialog>

    <custom-setting
      :dialogBool.sync="customSettingVialogVisible"
      :customSettingList="customSettingList"
      :canRendererTableHeader="canRendererTableHeader"
      :customSettingShowList="customSettingShowList"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    ></custom-setting>
  </div>
</template>

<script>
import subReq from './component/sub-req'
import informationDialog from './component/information-dialog'
import fixedFormBody from '../../main-Interface-entrance/launch-affair/component/all-box/fixed-form-body'
import customSetting from '@/components/tableHeadercustomSetting/custom-setting'
export default {
  name: 'rationalization-suggestions',
  components: {
    subReq,
    informationDialog,
    fixedFormBody,
    customSetting
  },
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
      TableHeight: 500,
      informationDialogShow: false,
      customSettingVialogVisible: false,
      curSelecedType: '',
      informationDialogTitle: '添加',
      drawerdialogVisible: false,
      customSettingList: [
        {
          id: 1,
          label: '状态',
          prop: 'state_name',
          width: '130',
          align: 'center',
          signIndex: 0,
          sortable: false
        },
        {
          id: 2,
          label: '反馈人',
          prop: 'user_name',
          width: '130',
          align: 'center',
          signIndex: 1,
          sortable: false
        },
        {
          id: 3,
          label: '所属部门',
          prop: 'dept_name',
          width: '130',
          align: 'center',
          signIndex: 2,
          sortable: false
        },
        {
          id: 4,
          label: '手机号',
          prop: 'phone',
          width: '200',
          align: 'center',
          signIndex: 3,
          sortable: false
        },
        {
          id: 5,
          label: '反馈内容摘要',
          prop: 'abstract',
          width: '360',
          align: 'left',
          signIndex: 4,
          sortable: false
        },
        {
          id: 6,
          label: '厂家预计完成时间',
          prop: 'plan_finish_date',
          width: '150',
          align: 'center',
          signIndex: 5,
          sortable: true
        },
        {
          id: 7,
          label: '厂家回复',
          prop: 'replay_content',
          width: '130',
          align: 'center',
          signIndex: 6,
          sortable: false
        },
        {
          id: 8,
          label: '反馈提交时间',
          prop: 'request_date',
          width: '150',
          align: 'center',
          signIndex: 7,
          sortable: true
        },

        {
          id: 9,
          label: '完成时间',
          prop: 'completed_date',
          width: '130',
          align: 'center',
          signIndex: 8,
          sortable: false
        },
        // {
        //   id: 11,
        //   label: "反馈渠道",
        //   prop: "type_name",
        //   width: "130",
        //   align: "center",
        //   signIndex: 10,
        //   sortable: false,
        // },
        {
          id: 10,
          label: '操作',
          prop: 'operation',
          width: '140',
          align: 'center',
          signIndex: 9,
          sortable: false
        }
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      filedialogVisible: false,
      selectedIds: [],
      formType: '',
      fixedFormBodyShow: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead('initialize')
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    })
  },
  methods: {
    updateTableHeader(newestTableHeaderList) {
      this.canRendererTableHeader = null
      this.customSettingShowList = null
      this.customSettingShowList = newestTableHeaderList
      this.canRendererTableHeader = newestTableHeaderList
        .filter(item => item.isSelected)
        .map((sing, index) => {
          let obj = {
            id: index + 1,
            label: sing.label,
            prop: sing.prop,
            width: sing.width,
            align: sing.align,
            signIndex: index,
            sortable: sing.sortable
          }
          return obj
        })
      this.$forceUpdate()
    },

    onSubmit(form) {
      this.form = form
      console.log(this.form)
      this.pageInfo.pageIndex = 1
      this.pageInfo.pageCount = 0
      this.loadData()
    },
    // 数据加载
    loadData() {
      this.loading = true
      let params = Object.assign({}, this.form)
      params.page_index = this.pageInfo.pageIndex
      params.page_size = this.pageInfo.pageSize
      this.$client
        .GetPageListCustomSuggestion(params)
        .then(res => {
          if (res.head.result == '200') {
            this.loading = false
            this.data = res.context.list
            this.pageInfo.pageCount = res.context.total
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
    // 编辑、添加
    saveAddEdit(form) {
      let successrMessage = ''
      let parmas = {
        context: form
      }
      if (this.curSelecedType == 'add') {
        delete parmas.context.i_id
        successrMessage = '添加成功'
      } else {
        successrMessage = '编辑成功'
      }
      this.$client
        .addSysPositionInfo(parmas)
        .then(res => {
          if (res.head.result == '200') {
            this.loadData()
            this.informationDialogShow = false
            this.$message({
              showClose: true,
              message: successrMessage,
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
    restTableList() {
      this.form = {}
      this.pageInfo.pageIndex = 1
      this.pageInfo.pageCount = 0
      this.loadData()
    },
    openAddPage(type) {
      // this.curSelecedType = type;
      // this.informationDialogTitle = "添加";
      // this.informationDialogShow = true;
      this.formType = 'rationalizationFeedbackForm'
      this.fixedFormBodyShow = true
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

    selectedUpkeepPlanList(selectedList) {
      this.selectedIds = []
      selectedList.forEach((item, index) => {
        this.selectedIds.push(item.i_id)
      })
    },

    // 编辑
    editRowInfo(form) {
      this.curSelecedType = 'edit'
      this.$refs.informationDialog.form.i_id = form.i_id
      this.$refs.informationDialog.form.c_name = form.c_name
      this.$refs.informationDialog.form.c_remark = form.c_remark
      this.informationDialogTitle = '编辑'
      this.informationDialogShow = true
    },
    // 删除
    deleteRowInfo(info) {
      let params = {
        context: [info.id]
      }
      this.$client
        .BatchDeleteAdviceRecord(params)
        .then(res => {
          if (res.head.result == '200') {
            this.loadData()
            this.$message({
              showClose: true,
              message: '删除成功',
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
        .catch(err => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: 'error'
          })
        })
    },
    detailRowInfo(val) {
      let detail_id = 6700,
        title = '合理化意见反馈表'
      this.$router.push({
        path: `/news-details/${val.id}/${title}/${detail_id}`
      })
    },
    // 审批单状态
    outColor(state) {
      switch (state) {
        case 0:
          return '#00ccff'
          break
        case 1:
          return '#F58A40'
          break
        case 2:
          return '#0CB780'
          break
        case 3:
          return '#F2260E'
          break
        case 4:
          return '#999999'
          break
      }
    },
    // 计算表格高度 和初始化表头
    setHead(type) {
      if (type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList
        this.customSettingShowList = this.customSettingList
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let th = this.$refs.head.$el.offsetHeight
        this.TableHeight = maxh - th - 30
      }, 60)
    },
    extractTextFromHtmlStr(htmlString) {
      if (!htmlString) return ''
      const tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span']
      // 使用 DOMParser 将 HTML 字符串转换为 DOM 树
      const parser = new DOMParser()
      const doc = parser.parseFromString(htmlString, 'text/html')
      // 定义一个辅助函数来递归地收集文本内容
      function collectText(node) {
        let textContent = ''
        if (node.nodeType === Node.TEXT_NODE) {
          // 如果是文本节点，则直接返回其文本内容
          return node.textContent.trim()
        }
        if (node.nodeType === Node.ELEMENT_NODE && tags.includes(node.tagName.toLowerCase())) {
          // 如果是目标标签之一，则收集其子节点的文本内容
          for (const child of node.childNodes) {
            textContent += collectText(child)
          }
        } else {
          // 否则递归处理所有子节点
          for (const child of node.childNodes) {
            textContent += collectText(child)
          }
        }
        return textContent
      }
      // 开始从整个文档的 body 收集文本
      return collectText(doc.body).trim()
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.rationalization-suggestions {
  width: 100%;
  height: 100%;
}
</style>

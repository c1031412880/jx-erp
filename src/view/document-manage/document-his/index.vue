<template>
  <div class="document-his">
    <sub-req ref="head" @on-add="infoDialogShow = true" @on-ok="onSubmit"></sub-req>
    <tr-table
      ref="table"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="0"
      :backFixedNum="0">
      <template slot="step_name" slot-scope="scope">
        <el-button type="text" @click="onDowLoad(scope.data)">下载</el-button>
        <el-popconfirm
          title="确定删除此文件吗？"
          @confirm="onDelete(scope.data)"
        >
          <el-button type="text" slot="reference">删除</el-button>
        </el-popconfirm>
      </template>
    </tr-table>
    <el-pagination
      style="margin: 5px 0;display:flex; justify-content: flex-end;"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      ref="paginationH"
      :current-page="pageInfo.pageIndex"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageInfo.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageInfo.pageCount"
    >
    </el-pagination>
    <info-dialog ref="infoDialog" :dialogBool.sync="infoDialogShow" @on-ok="InfoDialogOk"></info-dialog>
  </div>
</template>

<script>
import subReq from "./component/sub-req";
import infoDialog from "./component/info-dialog";
import {getUser, getSession} from '@/utils/auth'
export default {
  name: "document-his",
  components: {subReq, infoDialog},
  data() {
    return {
      data: [],
      TableHeight: 400,
      customSettingList:[
        {
          id: 1,
          label: "文件类型",
          prop: "type_name",
          width: "120",
          align: "center",
          signIndex:0,
          sortable:false
        },
        {
          id: 2,
          label: "文件名称",
          prop: "name",
          width: "120",
          align: "center",
          signIndex:0,
          sortable:false
        },
        {
          id: 3,
          label: "上传时间",
          prop: "created_date",
          width: "120",
          align: "center",
          signIndex:1,
          sortable:false
        },
        {
          id: 4,
          label: "操作",
          prop: "step_name",
          width: "150",
          align: "center",
          signIndex:2,
          sortable:false
        }
      ],
      frontFixedNum:2, //前几行固定
      backFixedNum:1, //后几行固定
      canRendererTableHeader: null,
      loading: false,
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      infoDialogShow: false,
      form: {}
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead()
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
      this.form.page_index = this.pageInfo.pageIndex
      this.form.page_size = this.pageInfo.pageSize
      this.$client.GetByPageDocumentHis(this.form).then(req => {
        this.loading = false
        if (req.head.result === '200') {
          this.data = req.context.list
          this.pageInfo.pageCount = req.context.total
        } else {
          this.data = []
          this.pageInfo.pageCount = 0
        }
      })
    },
    // 上传文件
    InfoDialogOk(form,type) {
      this.infoDialogShow = false
      let params = {
        doc_his: form,
        type: type
      }
      this.$client.AddDocumentHis({context: params}).then(req => {
        this.loadData()
        if (req.head.result === '200') {
          this.$message({
            message: req.head.describle,
            type: 'success'
          });
        } else {
          this.$message.error(req.head.describle);
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
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    onDowLoad(item) {
      // fetch(item.url).then(res => {
      //   if(res.code === 0) {
      //     let aEle = document.createElement("a");// 创建a标签
      //     aEle.href = item.url;// content为后台返回的下载地址
      //     aEle.download = item.name;// 设置下载文件的文件名
      //     aEle.click();// 设置点击事件
      //   }else {
      //     alert('You have no permission to download the file')
      //   }
      // })
      let token = getSession()
      let xml = new XMLHttpRequest()
      xml.open('GET', item.url, true)
      xml.setRequestHeader('Authorization', token)
      xml.responseType = 'blob'
      let that = this
      xml.onload = function() {
        let url = window.URL.createObjectURL(xml.response)
        let a = document.createElement('a')
        a.href = url
        a.download = item.name
        a.click()
        that.disLoad()
      }
      xml.send()
    },
    disLoad() {
      this.$message.closeAll()
      this.$message({type: 'success', message: '下载成功'})
    },
    onDelete(form) {
      this.$client.DeleteDocumentHis({context: [form.id]}).then(req => {
        this.loadData()
        if (req.head.result === '200') {
          this.$message({
            message: req.head.describle,
            type: 'success'
          });
        } else {
          this.$message.error(req.head.describle);
        }
      })
    },
    // 计算表格高度
    setHead() {
      this.canRendererTableHeader = this.customSettingList;
      setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let th = this.$refs.head.$el.offsetHeight
        this.TableHeight = maxh - (th) - 42
      }, 60)
    }
  }
}
</script>

<style style rel="stylesheet/scss" lang="scss" scoped>
.document-his{
  width: 100%;
  height: 100%;
}
</style>

<template>
  <div class="audit-log">
    <sub-req ref="head" @on-add="tableSetShow('','add')" @on-ok="onSubmit"></sub-req>
    <tr-table
      ref="table"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="0"
      :backFixedNum="0">
      <template slot="flow_type" slot-scope="scope">
        {{scope.data.flow_type === 1 ? '表单流程' : '固定流程'}}
      </template>
      <template slot="enable" slot-scope="scope">
        <el-switch
          v-model="scope.data.enable"
          :active-value="1"
          :inactive-value="2"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="changeEnable(scope.data)"
          :disabled="!$isPowerShow('edit')">
        </el-switch>
      </template>
      <template  slot="operation" slot-scope="scope">
        <el-button type="text" size="mini" @click="tableSetShow(scope.data,'edit')" v-if="$isPowerShow('edit')">编辑</el-button>
        <el-button type="text" size="mini" @click="tableSetShow(scope.data,'show')" v-if="$isPowerShow('search')">预览</el-button>
        <el-popconfirm
          @confirm="tableDel(scope.data)"
          title="确定删除此条记录吗？"
          v-if="$isPowerShow('del')"
        >
          <el-button slot="reference" :disabled="scope.data.enable === 1 " type="text" size="mini">删除</el-button>
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
    <add-process-dialog 
      ref="AddProcessDialog" 
      :title="title"
      :disabled="disabled"
      :fieidList="fieidList"
      :suffix="suffix"
      :processType="processType"
      :dialogBool.sync="addProcessDialogShow">
    </add-process-dialog>
  </div>
</template>

<script>
import subReq from "./component/sub-req";
import AddProcessDialog from './component/add-process-dialog'
export default {
  name: "audit-log",
  components: {subReq, AddProcessDialog},
  data() {
    return {
      data: [],
      TableHeight: 400,
      title: "新增打印模板",
      disabled: false,
      customSettingList:[
        {
          id: 1,
          label: "打印模板名称",
          prop: "temp_name",
          width: "120",
          align: "center",
          signIndex:0,
          sortable:false
        },
        {
          id: 2,
          label: "表单类型",
          prop: "flow_type",
          width: "150",
          align: "center",
          signIndex:2,
          sortable:false
        },
        {
          id: 3,
          label: "关联表单",
          prop: "object_name",
          width: "160",
          align: "center",
          signIndex:1,
          sortable:false
        },
        {
          id: 4,
          label: "启用状态",
          prop: "enable",
          width: "150",
          align: "center",
          signIndex:3,
          sortable:false
        },
        {
          id: 5,
          label: "操作",
          prop: "operation",
          width: "150",
          align: "center",
          signIndex:4,
          sortable:false
        }
      ],
      canRendererTableHeader: null,
      loading: false,
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      form: {},
      addProcessDialogShow: false,
      fieidList: [],
      suffix:"",
      processType: ''
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead()
      window.SignalDom.on('PrintSave', req => {
        this.$message.success('保存成功');
        this.addProcessDialogShow = false
        this.loadData()
      })
    })
  },
  methods: {
    onSubmit(form) {
      this.form = form
      this.loadData()
    },
    // getConFlowFieid() {
    //   this.$client.GetConFlowFieid().then(res => {
    //     if (res.head.result === "200") {
    //       this.fieidList = res.context
    //     }
    //   })
    // },
    // 获取数据
    loadData() {
      this.loading = true
      this.form.page_index = this.pageInfo.pageIndex
      this.form.page_size = this.pageInfo.pageSize
      this.$client.GetByPage({context:this.form}).then(req => {
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
     // 开关启用状态
    changeEnable(row) {
      this.$client.UpdatePrintTemp({context: row}).then(req => {
        if (req.head.result === "200") {
          this.$message.success(req.head.describle);
        } else {
          this.$message.error(req.head.describle);
        }
        this.loadData()
      })
    },
    // 数据删除
    tableDel(form) {
      this.$client.DeletePrintTemp({context:form.id}).then(req => {
        this.loadData()
        if (req.head.result === "200") {
          this.$message.success(req.head.describle);
        } else {
          this.$message.error(req.head.describle);
        }
      })
    },
    tableSetShow(row,type) {
      if (type === 'add') {
        this.title ='新增打印模板'
        this.suffix = "/designer/designer"
        // this.getConFlowFieid()
        this.disabled = false
      } else if (type === 'edit') {
        this.title = "编辑打印模板"
        this.disabled = false
        this.suffix = "/designer/designer?_u=" + row.file_name
        this.$refs.AddProcessDialog.initData({
          formData:row
        });
      } else {
        this.title = "预览打印模板"
        this.disabled = true
        this.suffix = "/html/preview?_u=" + row.file_name
        this.$refs.AddProcessDialog.initData({
          formData:row
        });
      }
      this.addProcessDialogShow = true
      this.processType = type
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
.audit-log{
  width: 100%;
  height: 100%;
}
</style>

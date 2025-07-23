<template>
  <div class="asset-storage-management">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-export="exportFile"
      @on-add="openAddPage"
      >
    </sub-req>
    <tr-table
      :data="data" 
      :loading="loading"
      :selectionShow="false"
      :TableHeight="TableHeight"
      :isShowBottomOptions="false"
      :backFixedNum="backFixedNum"
      :tableHeaderList="canRendererTableHeader">
      <template slot-scope="scope" slot="operation">
        <el-button style="margin-right: 10px;" type="text" size="mini" @click="openAddPage('edit', scope.data)">编辑</el-button>
        <el-popconfirm
          title="是否确定删除？"
          @confirm="DeleteSupplierManage(scope.data)">
          <el-button slot="reference" type="text" size="mini">删除</el-button>
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
      :total="pageInfo.pageCount">
    </el-pagination>

    <add-info-dialog
      ref="addInfo"
      :curEventType="curEventType"
      :dialogBool.sync="isShowAddInfoDialog"
      @save-add-edit="SetInfoSupplierManage"></add-info-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import addInfoDialog from "./component/add-info-dialog";
export default {
  name: 'asset-storage-management',
  components: {
    subReq,
    addInfoDialog
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
      backFixedNum: 1,
      selectedIds:[], //勾选的ID
      curEventType: 'add',
      isShowAddInfoDialog: false,
      canRendererTableHeader: [
        {
          id: 1,
          label: "供应商名称",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "供应商简称",
          prop: "simple_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "供应商编号",
          prop: "code",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "资产种类",
          prop: "total_count",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "供应商类型",
          prop: "type_name",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "社会信用代码",
          prop: "social_code",
          width: "150",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "企业性质",
          prop: "enterprise_name",
          width: "170",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "地址",
          prop: "address",
          width: "170",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "法人代表",
          prop: "legal",
          width: "170",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "联系人",
          prop: "contacts",
          width: "170",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "电话",
          prop: "contacts_phone",
          width: "170",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "税号",
          prop: "duty_code",
          width: "170",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "备注",
          prop: "remark",
          width: "170",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "操作",
          prop: "operation",
          width: "180",
          align: "center",
          signIndex: 13,
          sortable: false,
        }
      ]
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead();
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    // 查询
    onSubmit(form) {
      this.form = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 加载数据
    loadData() {
      this.loading = true
      let params = {
        context: {}
      };
      params.context = Object.assign({},this.form);
      params.context.page_index = this.pageInfo.pageIndex;
      params.context.page_size = this.pageInfo.pageSize;
      this.$client.GetByPageSupplierManage(params)
      .then(res => {
        this.loading = false;
        if (res.head.result === "200") {
          this.data = res.context.list;
          this.pageInfo.pageCount = res.context.total
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        };  
      })
    },
    // 添加、编辑、查看
    openAddPage(type, row) {
      this.curEventType = type
      this.isShowAddInfoDialog = true
      if(!!row) {
        this.$refs.addInfo.setData(row)
      }
    },
    // 保存、编辑 + 校验
    SetInfoSupplierManage(info) {
      let params = {}
      params.context = info
      this.$client.SetInfoSupplierManage(params)
      .then(res => {
        if(res.head.result == '200') {
          this.isShowAddInfoDialog = false
          this.loadData()
          this.$message({type: 'success', message: res.head.describle})
        }else{
          if (res.head.result == '202') {
            this.$confirm(res.head.describle, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.DirectSetInfoSupplierManage(params)
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消新增'
              });          
            });
          } else {
            this.$message({type: 'error', message: res.head.describle})
          }
        }
      })
    },
    // 保存、编辑
    DirectSetInfoSupplierManage(params) {
      this.$client.DirectSetInfoSupplierManage(params)
      .then(res => {
        if(res.head.result == '200') {
          this.isShowAddInfoDialog = false
          this.loadData()
          this.$message({type: 'success', message: res.head.describle, type: 'success'})
        }else{
          this.isShowAddInfoDialog = false
          this.$message({showClose: true,message: res.head.describle,type: "error"});
        }
      })
    },
    // 删除 + 校验
    DeleteSupplierManage(row) {
      let params = {}
      params.context = row.id
      this.$client.DeleteSupplierManage(params)
      .then(res => {
        if(res.head.result == '200') {
          this.loadData()
          this.$message({type: 'success', message: res.head.describle, type: 'success'})
        }else{
          if (res.head.result == '202') {
            this.$confirm(res.head.describle, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.DirectDeleteSupplierManage(params)
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });          
            });
          } else {
            this.$message({showClose: true,message: res.head.describle,type: "error"});
          }
        }
      })
    },
    // 删除
    DirectDeleteSupplierManage(params) {
      this.$client.DirectDeleteSupplierManage(params).then(res => {
         if(res.head.result == '200') {
          this.loadData()
          this.$message({type: 'success', message: res.head.describle, type: 'success'})
        }else{
          this.$message({showClose: true,message: res.head.describle,type: "error"});
        }
      })
    },
    // 导出Excel
    exportFile(){
      let params = {
        context: {}
      };
      params.context = Object.assign({},this.form);
      this.$client.ExportSupplierManage(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: res.head.describle})
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
    // 计算表格高度
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH;
      }, 60);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.asset-storage-management
  height: 100%
  width: 100%
</style>
<template>
  <div class="advanced-driver">
    <sub-req 
      ref="head" 
      :type="1"
      @on-ok="onSubmit"
      @on-add="addRowInfo"
      @on-batch-delete="batchDelete"
      @on-export="exportData"
      @on-import="importData"
    >
    </sub-req>
    <tr-table
      :data="data"
      :loading="loading"
      :TableHeight="TableHeight"
      :backFixedNum="backFixedNum"
      :frontFixedNum="frontFixedNum"
      :tableHeaderList="customSettingList"
      :selectionShow="true"
      @on-select-change-row="onSelectChangeRow"
      >
      <template slot-scope="scope" slot="publish_date">
        {{ scope.data.publish_date ? scope.data.publish_date.slice(0, 10) : '-' }}
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button type="text" size="mini" @click="editRowInfo(scope.data, 'detail')">查看</el-button>
        <el-button type="text" size="mini" @click="editRowInfo(scope.data, 'edit')" v-if="$isPowerShow('update')">编辑</el-button>
        <el-popconfirm v-if="$isPowerShow('del')" @confirm="deleteCurRowInfo(scope.data)" title="是否确认删除此条记录？">
          <el-button slot="reference" type="text" size="mini" style="margin-left: 10px;">删除</el-button>
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

    <information-dialog
      ref="information"
      @on-save="saveEditRowInfo"
      :curSelectedType="curSelectedType"
      :dialogBool.sync="informationVisible"
      :dialogTitle="dialogTitle"
    ></information-dialog>

    <!-- 上传文件 导入文件弹窗组件 -->
    <file-dialog
      :dialogBool.sync="fileDialogVisible"
      :fileData="FileData"
      :typeMessage="'先进驾驶员信息'"
      @on-submit-excel="importAdvancedDriverExcel"
    ></file-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./sub-req";
import informationDialog from './information-dialog'
import fileDialog from "@/components/fileDialog/file-dialog";
export default {
  name: 'advanced-driver',
  components: {
    subReq,
    informationDialog,
    fileDialog
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      customSettingList: [
        {
          id: 1,
          label: "姓名",
          prop: "driver_name",
          width: "120",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "工号",
          prop: "work_id",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "所属组织",
          prop: "dept_name",
          width: "160",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "评定单位",
          prop: "evaluate_unit_name",
          width: "160",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "评定年份",
          prop: "year",
          width: "120",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "公示日期",
          prop: "publish_date",
          width: "150",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "操作",
          prop: "operation",
          width: "200",
          align: "center",
          signIndex: 6,
        },
      ],
      informationVisible: false,
      curSelectedType: 'add',
      selectRowsData: [], // 选中的行数据
      fileDialogVisible: false,
      FileData: {
        url: `${window.newHttpConfig.URL_EASYMOCK}/Files/TempFiles/先进驾驶员导入模板.xlsx`,
      },
      dialogTitle: '编辑先进驾驶员',
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead();
    });
    this.loadData()
  },
  methods: {
    onSubmit(form) {
      this.form = form
      this.pageInfo.pageIndex = 1
      this.pageInfo.pageCount = 0
      this.loadData()
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      // 使用正确的API接口
      this.$client.GetDriverAdvancedList({context:params})
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context || [];
            this.pageInfo.pageCount = res.context.length || 0
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
          this.loading = false;
          this.$message({
            showClose: true,
            message: err.body.message || '数据加载失败',
            type: "error",
          });
        })
    },
    // 新增先进驾驶员
    addRowInfo() {
      this.curSelectedType = 'add'
      this.dialogTitle = '新增先进驾驶员'
      this.informationVisible = true
      this.$nextTick(() => {
        this.$refs.information.setData({}) // 传入空对象用于新增
      })
    },
    // 导出先进驾驶员
    exportData() {
      let params = Object.assign({}, this.form);
      this.loading = true
      this.$client.ExportDriverAdvanced({context: params})
        .then(res => {
          this.loading = false
          if (res.head.result == "200") {
            // 通过返回的URL下载文件
            window.location.href = res.context
            this.$message({
              showClose: true,
              message: '导出成功',
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
          this.loading = false
          this.$message({
            showClose: true,
            message: err.body.message || '导出失败',
            type: "error",
          });
        })
    },
    // 导入先进驾驶员 - 打开文件选择对话框
    importData() {
      this.fileDialogVisible = true;
    },
    // 导入先进驾驶员Excel处理
    importAdvancedDriverExcel(val) {
      let formData = new FormData();
      formData.append("file", val.file);
      this.loading = true
      this.$client.ImportDriverAdvanced(formData)
        .then(res => {
          this.loading = false
          if (res.head.result == "200") {
            // 重置表单并重新加载数据
            this.$refs.head.Reset();
            this.loadData();
            this.fileDialogVisible = false;
            this.$message({
              message: res.head.describle || '导入成功',
              type: "success"
            });
          } else {
            this.fileDialogVisible = false;
            // 显示详细错误信息
            const h = this.$createElement;
            let errorData = [];
            errorData.push(h("p", null, res.head.describle));
            this.$msgbox({
              title: "导入失败",
              message: h("div", null, errorData),
              confirmButtonText: "确定",
            });
          }
        }).catch(err => {
          this.loading = false
          this.fileDialogVisible = false;
          this.$message({
            showClose: true,
            message: err.body.message || '导入失败',
            type: "error",
          });
        })
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx;
      this.loadData();
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 编辑信息
    editRowInfo(row, type) {
      this.curSelectedType = type
      this.dialogTitle = type == 'detail' ? '查看先进驾驶员' : '编辑先进驾驶员'
      this.informationVisible = true
      this.$nextTick(() => {
        this.$refs.information.setData(row)
      })
    },
    // 保存编辑信息
    saveEditRowInfo(form) {
      let params = {
        context: form
      };
      if (this.curSelectedType == "add") {
        delete params.context.id;
      }
      
      this.$client.AddOrUpdateAdvancedDriver(params)
        .then(res => {
          if (res.head.result == "200") {
            this.informationVisible = false
            this.loadData()
            this.$message({
              showClose: true,
              message: this.curSelectedType === 'add' ? '新增成功' : '编辑成功',
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.body.message || '操作失败',
            type: "error",
          });
        })
    },
    // 单个删除
    deleteCurRowInfo(row) {
      let params = {
        context: [row.id]
      };
      this.$client.BatchDeleteDriverAdvanced(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loadData();
            this.$message({
              showClose: true,
              message: res.head.describle || '删除成功',
              type: "success"
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error"
            });
          }
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.body.message || '删除失败',
            type: "error",
          });
        })
    },
    // 表格选择变化
    onSelectChangeRow(selection) {
      this.selectRowsData = selection;
    },
    // 批量删除
    batchDelete() {
      if (!this.selectRowsData.length) {
        this.$message({
          message: '请选择要删除的记录',
          type: 'warning'
        });
        return;
      }
      
      this.$confirm(`确定要删除选中的 ${this.selectRowsData.length} 条记录吗？`, '批量删除确认', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = this.selectRowsData.map(item => item.id);
        let params = {
          context: ids
        };
        this.loading = true;
        this.$client.BatchDeleteDriverAdvanced(params)
          .then(res => {
            this.loading = false;
            if (res.head.result == "200") {
              // 清空选择
              this.selectRowsData = [];
              this.loadData();
              this.$message({
                showClose: true,
                message: res.head.describle || `成功删除 ${ids.length} 条记录`,
                type: "success"
              });
            } else {
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error"
              });
            }
          }).catch(err => {
            this.loading = false;
            this.$message({
              showClose: true,
              message: err.body.message || '批量删除失败',
              type: "error",
            });
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let ph = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - ph - 5;
      }, 60);
    },
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.advanced-driver
  height: 100%
  width: 100%
</style> 
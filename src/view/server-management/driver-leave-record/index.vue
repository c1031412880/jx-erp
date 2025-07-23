<template>
  <div class="driver-leave-record">
    <div class="department-detail show-flex-box-c" v-loading="loading">
      <sub-req
        ref="head"
        @on-ok="onSubmit"
        @on-add="onAdd"
        @on-export="onExport"
        @on-delete="deleteSelectedUserInfo"
      ></sub-req>
      <div>
        <tr-table
          :selectionShow="true"
          :data="data"
          :tableHeaderList="canRendererTableHeader"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="backFixedNum"
          @on-select-change-row="selectedUserList">
          <template slot-scope="scope" slot="start_date">
            <span>{{ scope.data.start_date ? scope.data.start_date.slice(0, 10) : '-' }}</span>
          </template>
          <template slot-scope="scope" slot="end_date">
            <span>{{ scope.data.end_date ? scope.data.end_date.slice(0, 10) : '-' }}</span>
          </template>
          <template slot-scope="scope" slot="operation">
            <el-button type="text" size="mini" @click="editRow(scope.data, 'detail')">查看</el-button>
            <el-button type="text" size="mini" @click="editRow(scope.data, 'edit')">编辑</el-button>
            <el-button type="text" size="mini" @click="deleteRow(scope.data)">删除</el-button>
          </template>
        </tr-table>
      </div>
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
    </div>

    <show-info-dialog
      ref="showInfoDialog"
      :dialogBool.sync="isShowSetInfoDialog"
      :curChangeType="curChangeType"
      @save-form="saveForm">
    </show-info-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import showInfoDialog from "./component/show-info-dialog"

export default {
  name: "driver-leave-record",
  components: {
    subReq,
    showInfoDialog
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      data: [], //列表
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: [
        {
          id: 1,
          label: "姓名",
          prop: "driver_name",
          width: "120",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "所属组织",
          prop: "dept_name",
          width: "150",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "开始时间",
          prop: "start_date",
          width: "120",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "结束时间",
          prop: "end_date",
          width: "120",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "天数",
          prop: "leave_days",
          width: "80",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "类型",
          prop: "leave_type_name",
          width: "100",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "扣分",
          prop: "de_score",
          width: "80",
          align: "center",
          signIndex: 6,
        },
        {
          id: 8,
          label: "是否取消月考核",
          prop: "is_cancle_star_name",
          width: "120",
          align: "center",
          signIndex: 7,
        },
        {
          id: 9,
          label: "录入人",
          prop: "created_name",
          width: "100",
          align: "center",
          signIndex: 8,
        },
        {
          id: 10,
          label: "录入时间",
          prop: "created_date",
          width: "150",
          align: "center",
          signIndex: 9,
        },
        {
          id: 11,
          label: "备注",
          prop: "remark",
          width: "150",
          align: "center",
          signIndex: 10,
        },
        {
          id: 12,
          label: "操作",
          prop: "operation",
          width: "150",
          align: "center",
          signIndex: 11,
        },
      ],
      loading: false,
      TableHeight: 500,
      form: {}, //查询表单数据
      isShowSetInfoDialog: false,
      selectedProjectIds: [],
      curChangeType: 'add',
    };
  },
  mounted() {
    this.setHead();
    // 初始化加载数据
    this.loadData();
  },
  methods: {
    // 计算高度
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight
        this.TableHeight = maxh - 35 - th;
      }, 60);
    },
    
    // 查询
    onSubmit(form) {
      this.form = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    
    /**
     * 获取列表数据
     */
    loadData() {
      this.loading = true;
      let params = {
        context: Object.assign({}, this.form),
      }
      params.context.page_index = this.pageInfo.pageIndex;
      params.context.page_size = this.pageInfo.pageSize;
      this.$client.GetDriverQualityCheck(params)
      .then(res => {
        if (res.head.result == "200") {
          this.data = res.context || [];
          // 根据API文档，应该是数组形式返回
          this.pageInfo.pageCount = res.context ? res.context.length : 0;
          this.loading = false;
        } else {
          this.loading = false;
          this.$message({
            showClose: true,
            message: res.head.describle || '查询失败',
            type: "error",
          });
        }
      }).catch(err => {
        this.loading = false;
        this.$message({
          showClose: true,
          message: '网络异常，请稍后重试',
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
    
    // 添加
    onAdd() {
      this.curChangeType = 'add';
      this.isShowSetInfoDialog = true;
      this.$nextTick(() => {
        this.$refs.showInfoDialog.showDialog();
      })
    },
    
    // 编辑
    editRow(row, type) {
      this.curChangeType = type;
      this.isShowSetInfoDialog = true;
      this.$nextTick(() => {
        this.$refs.showInfoDialog.showDialog(row);
      })
    },
    
    // 删除单行
    deleteRow(row) {
      this.$confirm('确定要删除这条记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          context: [row.id]
        }
        this.$client.DeleteDriverLeaveRecord(params)
        .then(res => {
          if (res.head.result == "200") {
            this.$message.success('删除成功');
            this.loadData();
          } else {
            this.$message.error(res.head.describle || '删除失败');
          }
        }).catch(err => {
          this.$message.error('网络异常，请稍后重试');
        })
      })
    },
    
    // 选中行
    selectedUserList(list) {
      this.selectedProjectIds = list.map(item => item.id);
    },
    
    // 批量删除
    deleteSelectedUserInfo() {
      if (this.selectedProjectIds.length === 0) {
        this.$message.warning('请选择要删除的记录');
        return;
      }
      this.$confirm('确定要删除选中的记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          context: this.selectedProjectIds
        }
        this.$client.DeleteDriverLeaveRecord(params)
        .then(res => {
          if (res.head.result == "200") {
            this.$message.success('删除成功');
            this.loadData();
          } else {
            this.$message.error(res.head.describle || '删除失败');
          }
        }).catch(err => {
          this.$message.error('网络异常，请稍后重试');
        })
      })
    },
    
    // 导出
    onExport() {
      let params = {
        context: Object.assign({}, this.form),
      }
      params.context.page_index = this.pageInfo.pageIndex;
      params.context.page_size = this.pageInfo.pageSize;
      this.$client.ExportDriverLeaveRecord(params).then((res) => {
        if(res.head) {
          if (res.head.result == "200") {
            window.location.href = res.context;
            this.$message({ type: "success", message: "导出成功" });
          } else {
            this.$message({ type: "error", message: res.head.describle || "导出失败" });
          }
        } else {
          this.$message({ type: "warning", message: "暂无可导出内容" });
        }
      }).catch(err => {
        this.$message({ type: "error", message: "网络异常，请稍后重试" });
      });
    },
    
    /**
     * 保存表单数据
     */
    saveForm(formData) {
      let params = {context: formData}
      this.$client.SaveDriverLeaveRecord(params)
      .then(res => {
        if (res.head.result == "200") {
          this.$message.success('保存成功');
          this.isShowSetInfoDialog = false;
          this.loadData();
        } else {
          this.$message.error(res.head.describle || '保存失败');
        }
      }).catch(err => {
        this.$message.error('网络异常，请稍后重试');
      })
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.driver-leave-record {
  width: 100%;
  height: 100%;
}
</style> 
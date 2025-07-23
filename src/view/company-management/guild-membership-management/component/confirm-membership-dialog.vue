<template>
  <el-dialog
    :visible="dialogBool"
    fullscreen
    :before-close="dialogClose"
    center
  >
    <!-- <el-page-header slot="title" @back="dialogClose" :content="showTitle" class="show-flex-box-r show-flex-center"></el-page-header> -->
    <tr-page-header ref="trPageHeader" slot="title" :content="showTitle" @back="dialogClose"></tr-page-header>
    <div class="confirm-membership-component">
      <div class="search-content">
        <sub-req
          ref="head"
          @on-ok="onSubmit"
          @on-export="exportFile"
         ></sub-req>
      </div>
      <div class="table-content">
        <tr-table
          ref="table"
          :selectionShow="false"
          :data="data"
          :tableHeaderList="canRendererTableHeader"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="backFixedNum"
          @on-select-change-row="selectedUpkeepPlanList"
        >
          <template slot-scope="scope" slot="operation">
            <el-button
              type="primary"
              size="mini"
              @click.stop="openSelectRowPage(scope.data)"
              :disabled="scope.data.state != 3"
              >确认入会</el-button
            >
            <el-button
              type="danger"
              size="mini"
              @click.stop="revokeJoin(scope.data)"
              :disabled="scope.data.state != 3"
              >撤 销</el-button
            >
          </template>
        </tr-table>

        <!-- <el-pagination
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
        </el-pagination> -->
      </div>
      <div class="dialog-content-box">
        <!-- 确认弹窗 -->
        <el-dialog
          :visible.sync="confirmDialogShow"
          width="400px"
          center
          append-to-body
          >
          <span style="display: block; text-align: center; font-size:20px;font-weight:700">是否确认会员入会</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="confirmEnter(1)">确认，并完善信息</el-button>
            <el-button type="primary" @click="confirmEnter(2)">确认，下次完善</el-button>
          </span>
        </el-dialog>
        <!-- 党员档案信息 -->
        <information-dialog
          ref="informationDialog"
          :dialogBool.sync="informationDialogShow"
          :curSelecedType="'edit'"
          :title="'完善公会会员信息'"
          @save-add-edit="saveAddEdit"
        ></information-dialog>
      </div>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import subReq from "./confirm-membership-component/sub-req";
import informationDialog from "./information-dialog.vue";
export default {
  components: {
    subReq,
    informationDialog
  },
  props: {
    dialogBool: Boolean,
  },
  data() {
    return {
      showTitle: "确认入会",
      TableHeight: 500,
      loading: false,
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        pageCount: 0,
      },
      frontFixedNum: 1,
      backFixedNum: 1,
      data: [
        {
          id:1,
          group:'龙劲舞'
        }
      ],
      canRendererTableHeader: null,
      customSettingList: [
        {
          id: 1,
          label: "会员姓名",
          prop: "name",
          width: "120",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "部门",
          prop: "group",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "岗位",
          prop: "position",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "政治面貌",
          prop: "politics_status",
          width: "120",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "籍贯",
          prop: "hometown",
          width: "120",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "申请时间",
          prop: "created_date",
          width: "120",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "来源",
          prop: "source",
          width: "120",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "操作",
          prop: "operation",
          width: "180",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
      ],
      joinTypeDialogShow: false,
      confirmDialogShow: false,
      curRowInfo:{}, // 当前要确认的入会会员信息
      informationDialogShow: false
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        this.loadData();
        this.$nextTick(() => {
          this.setHead();
        });
      }
    },
  },
  mounted() {
    this.loadData();
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    onSubmit(form) {
      this.form = form
      this.loadData()
    },
    // 加载数据
    loadData() {
      this.loading = true
      let params = Object.assign({},this.form);
      // params.page_index = this.pageInfo.pageIndex;
      // params.page_size = this.pageInfo.pageSize;
      this.$client.GetReqErpTradeMainManage(params)
        .then(res => {
          if (res.head.result == "200") {
            console.log(res)
            this.loading = false;
            this.data = res.context;
            // this.pageInfo.pageCount = res.context.total
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
    },
    selectedUpkeepPlanList(selectedId) {},
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
    // 撤销入会
    revokeJoin(row) {
      this.$confirm('是否确认撤销入会，确认后将不可撤回', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          reqId: row.id
        }
        this.$client.RevokeErpTradeMainManage(params).then(res => {
          if (res.head.result == "200") {
            this.loadData();
            this.$message({
              type: 'success',
              message: '撤销成功!'
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消撤销'
        });          
      });
    },
    // 导出Excel 文件
    exportFile(){
     let params = {
        i_emp_state : 0
      };
      params = Object.assign(params,this.form);
      
      this.$client.exportStaffInfo(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })
    },
    // 打开确认入会弹窗
    openSelectRowPage(row) {
      // console.log(row)
      this.curRowInfo = row
      this.confirmDialogShow = true;
    },
    // 确认入会
    confirmEnter(type) {
      let params = {
        reqId: this.curRowInfo.id
      }
      this.$client.ConfirmErpTradeMainManage(params)
      .then(res => {
        if(res.head.result == '200') {
          // window.location.href = res.context
          if(type == 1) {
            let form = res.context
            setTimeout(() => {
              this.$refs.informationDialog.setData(form);
            },60)
            this.informationDialogShow = true;
            this.$message({type: 'success', message: '入会成功并完善信息'})

          }else{
            this.$message({type: 'success', message: res.head.describle})
          }
          this.loadData();
          this.confirmDialogShow = false;
        }else{
         this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 保存会员信息
    saveAddEdit(form){
      let parmas = {
        context: form
      };
      this.$client
        .CreateOrUpdateErpTradeMainManage(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.informationDialogShow = false;
            this.$message({
              showClose: true,
              message: '完善会员信息成功',
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {});
    },
    // 计算表格高度
    setHead() {
      this.canRendererTableHeader = this.customSettingList;
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        // let paginationH = this.$refs.paginationH.$el.offsetHeight;
        let trPageHeader = this.$refs.trPageHeader.$el.offsetHeight;
        this.TableHeight = maxh - th - 100 - trPageHeader;
        // console.log(this.TableHeight);
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>

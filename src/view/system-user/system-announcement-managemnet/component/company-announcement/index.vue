<template>
  <div class="system-announcement-managemnet">
    <sub-req
      ref="head"
      @on-add="openAddPage"
      @on-ok="onSubmit"
    ></sub-req>

    <div class="box-table">
      <table-box
        :data="data"
        @on-edit="openEditPage"
        @on-delete="deleteInfo"
        @on-top="edit"
        @on-unTop="edit"
        @show-preview="checkRowInfo"
        @show-read="showUnread"
      >
      </table-box>
    </div>

    <information-dialog
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      :curSelecedType="curSelecedType"
      :title="informationDialogTitle"
      @save-add-edit="saveAddEdit"
      @show-preview="showPreview"
    ></information-dialog>

    <read-or-not-dialog
      ref="readOrNotDialog"
      :dialogBool.sync="readOrNotDialogShow"
      :formType="'company-announcement'"
    ></read-or-not-dialog>

    <info-dialog 
      ref="infoDialog" 
      :dialogBool.sync="infoDialogShow" 
    ></info-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./sub-req";
import informationDialog from "./information-dialog";
import tableBox from "./table";
import readOrNotDialog from "../dialog/read-or-not-dialog";
import infoDialog from "./info-dialog";
import { getSession } from '@/utils/auth'
export default {
  name: "system-announcement-managemnet",
  components: {
    subReq,
    informationDialog,
    readOrNotDialog,
    infoDialog,
    tableBox
  },
  props: {
    TableHeight: [Number],
  },
  data() {
    return {
      token: getSession(),
      pageInfo: {
        pageIndex: 1,
        pageSize: 9999,
      },
      form: {},
      data: [],
      loading: false,
      informationDialogShow: false,
      curSelecedType: "",
      informationDialogTitle: "添加",
      canRendererTableHeader: null,
      readOrNotDialogShow: false,
      infoDialogShow: false
    };
  },
  mounted() {
  },
  methods: {
    // 预览详情
    showPreview(data) {
      this.$refs.infoDialog.setData(data)
      this.infoDialogShow = true
    },
    // 控制toopltip   换行超过两次
    showTooltip(row) {
      return !(row.split("</p>").length > 2)
    },
    updateTableHeader(newestTableHeaderList) {
      this.canRendererTableHeader = null;
      this.canRendererTableHeader = newestTableHeaderList;
      this.$forceUpdate();
      console.log(JSON.stringify(this.canRendererTableHeader));
    },
    showUnread(row){
      this.readOrNotDialogShow = true
      setTimeout(() => {
        this.$refs.readOrNotDialog.loadData(row.id)
      }, 100);
    },
    onSubmit(form) {
      this.form = form
      console.log(this.form);
      this.pageInfo.pageIndex = 1;
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.GetRecordCompanyMessage(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context;
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    // 添加或编辑
    saveAddEdit(form){
      if (this.curSelecedType == "add") {
        this.save(form)
      } else { 
        this.edit(form)
      }
    },
    // 添加
    save(form) {
      let parmas = {
        context: form
      };
      this.$client
        .AddCompanyMessage(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.informationDialogShow = false;
            this.$message({
              showClose: true,
              message: "新增成功",
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
    // 编辑
    edit(form) {
      let parmas = {
        context: form
      };
      this.$client
        .EditCompanyMessage(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.informationDialogShow = false;
            this.$message({
              showClose: true,
              message: "修改成功",
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
    // 删除
    deleteInfo(form) {
      this.$confirm('此操作将永久删除该公司公告, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        this.deleteRowInfo(form);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    openEditPage(form) {
      this.curSelecedType = "edit";
      this.informationDialogTitle = "编辑公司公告";
      setTimeout(() => {
        this.$refs.informationDialog.setData(form)
      }, 300);
      this.informationDialogShow = true;
    },
    openAddPage(type) {
      this.curSelecedType = type;
      this.informationDialogTitle = "添加公司公告";
      this.informationDialogShow = true;
    },
    // 查看
    checkRowInfo(row) {
      let url = newHttpConfig.previewFile + '/new.html' + `?&token=${this.token}&id=${row.id}&type=company`
        window.open(url, '_blank')
      if (!row.is_read) {
        this.setNewsRead(row.id)
      }
    },
    setNewsRead(id) {
      let params = {
          context: [id]
        }
        this.$client
          .AddSignCompanyMessage(params)
          .then(res => {
            if (res.head.result == '200' || res.head.result == '201') {
              this.loadData()
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
    // 删除
    deleteRowInfo(info) {
      let params = {
       context: [info.id]
     };
      this.$client.DeleteCompanyMessage(params)
      .then(res => {
        if (res.head.result == "200") {
          this.loadData();
          this.$message({
            showClose: true,
            message: "删除成功",
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
            message: err.body.message,
            type: "error",
          });
      })
    },
    // 计算表格高度 和初始化表头
    setHead() {
      this.canRendererTableHeader = this.customSettingList;
      // setTimeout(() => {
      //   let maxh = this.$el.offsetHeight;
      //   let th = this.$refs.head.$el.offsetHeight;
      //   this.TableHeight = maxh - th;
      // }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.system-announcement-managemnet {
  width: 100%;
  height: 100%;
  .tr-table /deep/ .el-table__empty-text {
    // position: absolute;
    position: relative;
    width: 100%;
    height: 100%;
  }

  .show-flex-box-c {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .over-hidden {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}

// .system-announcement-managemnet /deep/ .el-table td, .el-table th {
//   font-size: 13px;
//   padding: 4px 0;
// }
</style>

<template>
  <div class="system-announcement-managemnet">
    <sub-req
      ref="head"
      @on-add="openAddPage"
      @on-ok="onSubmit"
      @delete-row="deleteInfo"
    ></sub-req>

    <el-table
      :height="TableHeight"
      border
      :data="data"
      ref="multipleTable"
      v-loading="loading"
      style="width: 100%"
      highlight-current-row
      :header-cell-style="{background:'#E0F3FF',color:'#333333',fontSize:'16px',padding: '2px 0px',fontWeight: '700'}"
      :cell-style="{fontSize: '13px', padding: '2px 0px'}"
      :row-key="getRowKeys"
      @selection-change="selectedUpkeepPlanList"
    >
      <!-- <template slot="empty">
        <div style="height:180px; align-items: center; justify-content: center;" class="show-flex-box-c" v-if="Number(TableHeight) > 249">
          <img :src="emptyPlaceholder" alt="" style="width:180px;height: 152px;display: block;">
          <div style="height: 28px;">暂无数据</div>
        </div>
      </template>  -->
      <el-table-column type="selection" align="center" width="40"></el-table-column>
      <el-table-column type="index" align="center" label="#" width="120"></el-table-column>
      <el-table-column prop="title" show-overflow-tooltip label="标题" align="center"></el-table-column>
      <el-table-column prop="user_type" show-overflow-tooltip label="通知人员" align="center">
        <template slot-scope="scope" >
          <div v-if="scope.row.user_type == 0">{{全部成员}}</div>
          <div v-else>{{scope.row.user_name}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="unread_count" label="未读人数" v-if="$isPowerShow('admin')" align="center" >
        <template slot-scope="scope" >
          <div v-if="scope.row.unread_count == 0" style="color:#aaa">{{"全部已读"}}</div>
          <div v-else @click="showUnread(scope.row)" style="color:#027DB4;cursor: pointer">{{scope.row.unread_count + '人未读'}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="create_name" label="发布者" align="center" ></el-table-column>
      <el-table-column prop="send_time" label="发布时间" align="center" ></el-table-column>
      <el-table-column prop="state" label="发布状态" v-if="$isPowerShow('admin')" align="center" >
        <template slot-scope="scope" >
          {{scope.row.state === 0 ? '定时发布' : '已发布'}}
        </template>
      </el-table-column>
      <el-table-column prop="content" width="250" show-overflow-tooltip v-if="$isPowerShow('ordinary')" label="内容" align="center" >
        <template slot-scope="scope" >
          <el-tooltip :disabled="showTooltip(scope.row.content)" class="item" effect="dark" placement="top">
            <div slot="content" v-html="scope.row.content">多行信息<br/>第二行信息</div>
            <p class="over-hidden" v-html="scope.row.content"></p>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="operation" label="操作" align="center" >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="checkRowInfo(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <information-dialog
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      :curSelecedType="curSelecedType"
      :title="informationDialogTitle"
      @save-add-edit="saveAddEdit"
    ></information-dialog>

    <system-announcement-popup
      ref="systemAnnouncementPopup"
      :dialogBool.sync="systemAnnouncementPopupShow"
      @show-unRead="showUnread"
    ></system-announcement-popup>

    <read-or-not-dialog
      ref="readOrNotDialog"
      :dialogBool.sync="readOrNotDialogShow"
      :formType="'work-notice'"
    ></read-or-not-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./sub-req";
import informationDialog from "./information-dialog";
import readOrNotDialog from "../dialog/read-or-not-dialog";
import systemAnnouncementPopup from "./system-announcement-popup";
import placeholderImage from "@/assets/home-image/placeholder-1.png";
export default {
  name: "system-announcement-managemnet",
  components: {
    subReq,
    informationDialog,
    systemAnnouncementPopup,
    readOrNotDialog
  },
  props: {
    TableHeight: [Number],
  },
  data() {
    return {
      getRowKeys(row){
        return row.id || row.i_id
      },
      emptyPlaceholder: placeholderImage,
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
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      selectedIds:[],
      systemAnnouncementPopupShow: false,
      readOrNotDialogShow: false,
    };
  },
  mounted() {
    // this.setHead()
    this.$nextTick(() => {
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        // this.setHead()
      })
    })
  },
  methods: {
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
      this.$client.GetRecordWorkMessage({context:params})
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list
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
    // 编辑、添加
    saveAddEdit(form) {
      let parmas = {
        context: form
      };
      this.$client
        .AddWorkMessage(parmas)
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
    // 批量删除
    deleteInfo() {
      if(this.selectedIds.length == 0) {
        this.$message({
          showClose: true,
          message: '请勾选要删除的工作通知',
          type: "warning",
        });
        return
      }
      this.$confirm('此操作将永久删除该通知, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        this.deleteRowInfo(null);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    restTableList() {
      this.form = {};
      this.pageInfo.pageIndex = 1;
      this.loadData();
    },
    openAddPage(type) {
      this.curSelecedType = type;
      this.informationDialogTitle = "添加工作通知";
      this.informationDialogShow = true;
    },
    selectedUpkeepPlanList(list) {
      this.selectedIds = [];
      list.forEach((item,index) => {
        this.selectedIds.push(item.id)
      });
    },
    
    // 查看
    checkRowInfo(form) {
      if(!form.is_read) {
        let params = {
          context: form.id
        }
        this.$client.AddSignWorkMessage(params).then(res => {
          if (res.head.result == "200") {
            this.$refs.systemAnnouncementPopup.setData(form)
            this.systemAnnouncementPopupShow = true;
            this.loadData();
            
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
      }else{
        this.$refs.systemAnnouncementPopup.setData(form)
        this.systemAnnouncementPopupShow = true;
      }
    },
    // 删除
    deleteRowInfo(info) {
      let params = {
       context: []
     };
      if(info) {
        params.context[0] = info.id
      }else{
        params.context = this.selectedIds
      }
      this.$client.DeleteWorkMessage(params)
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

<template>
  <div class="system-announcement-managemnet">
    <sub-req
      ref="head"
      @on-add="openAddPage"
      @on-ok="onSubmit"
      @delete-row="deleteInfo"
    ></sub-req>
    <tr-table
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      @on-select-change-row="selectedUpkeepPlanList"
    >
      <template slot-scope="scope" slot="type">
        <span>{{scope.data.type == 1? 'web版本升级':scope.data.type == 2?'系统维护':'app版本升级'}}</span>
      </template>
      <template slot-scope="scope" slot="is_popover">
        <span>{{scope.data.is_popover == 1? '是':'否'}}</span>
      </template>
      <template slot-scope="scope" slot="is_read">
        <div class="show-flex-box-r show-flex-center" style="align-items: center;">
          <em style="width: 8px;height: 8px;margin-right: 3px;border-radius: 50%;" :style="`${scope.data.is_read?'background: #4BD863':'background:#D9001B'}`"></em>
          <span>{{scope.data.is_read? '已读':'未读'}}</span>
        </div>
        
      </template>
      <template slot-scope="scope" slot="unRead">
          <div v-if="scope.data.unRead == 0" style="color:#aaa">{{"全部已读"}}</div>
          <div v-else @click="showUnread(scope.data)" style="color:#027DB4;cursor: pointer">{{scope.data.unRead + '人未读'}}</div>
        </template>
      <template slot-scope="scope" slot="operation">
          <el-button type="primary" size="mini" @click="checkRowInfo(scope.data)">查看</el-button>
      </template>
    </tr-table>

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
    ></system-announcement-popup>

    <read-or-not-dialog
      ref="readOrNotDialog"
      :dialogBool.sync="readOrNotDialogShow"
      :formType="'system-announcement'"
    ></read-or-not-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./sub-req";
import informationDialog from "./information-dialog";
import systemAnnouncementPopup from "./system-announcement-popup";
import readOrNotDialog from "../dialog/read-or-not-dialog";

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
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      form: {},
      data: [],
      loading: false,
      informationDialogShow: false,
      curSelecedType: "",
      informationDialogTitle: "添加",
      customSettingList: [
        {
          id: 1,
          label: "标题",
          prop: "title",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "发布时间",
          prop: "created_date",
          width: "150",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "公告类别",
          prop: "type",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "版本号",
          prop: "version",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "生效开始日期",
          prop: "start_date",
          width: "150",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "生效结束日期",
          prop: "end_date",
          width: "150",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "发布者",
          prop: "created_name",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "是否强制弹窗",
          prop: "is_popover",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "是否已读",
          prop: "is_read",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "未读人数",
          prop: "unRead",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "操作",
          prop: "operation",
          width: "140",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      selectedIds:[],
      systemAnnouncementPopupShow: false,
      readOrNotDialogShow: false
    };
  },
  mounted() {
    this.setHead()
    this.$nextTick(() => {
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    })
  },
  methods: {

    showUnread(row){
      this.readOrNotDialogShow = true
      setTimeout(() => {
        this.$refs.readOrNotDialog.loadData(row.id)
      }, 100);
    },

    updateTableHeader(newestTableHeaderList) {
      this.canRendererTableHeader = null;
      this.canRendererTableHeader = newestTableHeaderList;
      this.$forceUpdate();
      console.log(JSON.stringify(this.canRendererTableHeader));
    },

    onSubmit(form) {
      this.form = form
      console.log(this.form);
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 数据加载
    loadData() {
      console.log("123")
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.GetRecordSysVersion(params)
        .then(res => {
          if (res.head.result == "200") {
            console.log("res.context",res.context)
            this.loading = false;
            this.data = res.context
            // this.pageInfo.pageCount = res.context.total
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
      let successrMessage = "";
      let parmas = {
        context: form
      };
      if (this.curSelecedType == "add") {
        delete parmas.context.id;
        successrMessage = "添加成功";
      } else {
        successrMessage = "编辑成功";
      }
      this.$client
        .AddSysVersion(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.informationDialogShow = false;
            this.$message({
              showClose: true,
              message: successrMessage,
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
          message: '请勾选要删除的系统公告',
          type: "warning",
        });
        return
      }
      this.deleteRowInfo(null);
    },
    restTableList() {
      this.form = {};
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    openAddPage(type) {
      this.curSelecedType = type;
      this.informationDialogTitle = "添加系统公告";
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
      console.log(form)
      if(!form.is_read) {
        console.log("未读")
        let params = {
          context:[form.id]
        }
        this.$client.AddSignSysVersion(params).then(res => {
          if (res.head.result == "200") {
            console.log("成功")
            this.$refs.systemAnnouncementPopup.setData(form)
            this.systemAnnouncementPopupShow = true;
            this.loadData();
            
          } else {
            console.log("失败")
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
        console.log("成功")
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
      this.$client.DeleteSysVersion(params)
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
  // watch:{
  //   systemAnnouncementPopupShow(){
  //     if(this.systemAnnouncementPopupShow) {
  //       this.loadData();
  //     }
  //   }
  // }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.system-announcement-managemnet {
  width: 100%;
  height: 100%;
}
</style>

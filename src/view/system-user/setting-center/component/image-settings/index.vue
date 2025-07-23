<template>
  <div class="el-dialog-div">
    <sub-req
      ref="head"
      @on-add="openAddPage"
      @on-ok="loadData"
    ></sub-req>
    <tr-table
      ref="imageTable"
      :selectionShow="false"
      :data="data"
      :tableHeaderList="customSettingList"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
    > 
      <template slot-scope="scope" slot="url">
        <span class="show-flex-box-r show-flex-center" v-if="!!scope.data.url">
          <el-image
            style="width: 40px; height: 40px"
            :src="scope.data.url"
            :preview-src-list="[scope.data.url]">
          </el-image>
        </span>
        <span v-else>暂无图片</span>

      </template>
      <template slot-scope="scope" slot="operation">
          <el-button type="primary" size="mini" @click="editRowInfo(scope.data)">编辑</el-button>
          <el-popconfirm
            @confirm="deleteRowInfo(scope.data)"
            title="确定删除此条记录吗？">
            <el-button slot="reference" type="danger" size="mini">删除</el-button>
          </el-popconfirm>
      </template>
    </tr-table>

    <information-dialog
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      :curSelecedType="curSelecedType"
      :title="informationDialogTitle"
      :imagesNum="data.length"
      @subimit-imgae="saveAddEdit"
    ></information-dialog>

  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import informationDialog from "./component/information-dialog";
export default {
  components: {
    subReq,
    informationDialog,
  },
  data() {
    return {
      data: [],
      loading: false,
      TableHeight: 500,
      informationDialogShow: false,
      curSelecedType: "",
      informationDialogTitle: "添加",
      customSettingList: [
        {
          id: 1,
          label: "图片顺序",
          prop: "sort",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "图片",
          prop: "url",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "操作",
          prop: "operation",
          width: "120",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
      ],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead();
    });
  },
  methods: {
    // 数据加载
    loadData() {
      this.loading = true;
      this.$client.getBackgroundImages({})
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
          this.loading = false;
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
      if (this.curSelecedType == "add") {
        delete parmas.context.id;
        this.$client
        .AddLoginImage(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.informationDialogShow = false;
            this.$message({
              showClose: true,
              message: "添加成功",
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
      } else {
        this.$client
        .EditLoginImage(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.informationDialogShow = false;
            this.$message({
              showClose: true,
              message: "编辑成功",
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
      }
    },
    //打开添加弹出框
    openAddPage() {
      this.curSelecedType = 'add';
      this.informationDialogTitle = "添加";
      this.informationDialogShow = true;
    },
    // 编辑
    editRowInfo(form) {
      this.curSelecedType = "edit";
      this.informationDialogShow = true;
      this.$nextTick(()=>{
        this.$refs.informationDialog.form.id = form.id;
        this.$refs.informationDialog.form.sort = form.sort;
        this.$refs.informationDialog.form.url = form.url;
      })
      this.informationDialogTitle = "编辑";
    },
    //刷新table
    refresh(){
      this.setHead();
      this.$refs.imageTable.doLayout();
    },
    // 删除
    deleteRowInfo(info) {
      if(this.data.length ==1){
        this.$message({type: 'warning', message: "至少保留一张图片！", showClose: true})
        return
      }
      let params = {
        context: info.id
      }
      this.$client.DelLoginImage(params)
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
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;     
        this.TableHeight = maxh - th;
        console.log(this.TableHeight)
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div {
  height: 800px;
  /deep/ .el-table > .el-table__fixed{
    height: 100% !important;
  }
}
</style>

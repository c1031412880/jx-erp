<template>
  <div class="honor-wall">
    <sub-req
      ref="head"
      @on-add="openAddPage"
      @on-ok="onSubmit"
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
    >
      <template slot-scope="scope" slot="ex_pics">
        <span class="show-flex-box-r show-flex-center" v-if="scope.data.ex_pics && scope.data.ex_pics.length > 0">
          <el-image
            style="width: 40px; height: 40px"
            :src="scope.data.ex_pics[0].url"
            :preview-src-list="scope.data.ex_pics.map(item => {return item.url})">
          </el-image>
          <span style="color:red">({{scope.data.ex_pics.length}})</span>
        </span>
        <span v-else>暂无荣誉图片</span>

      </template>
      <template slot-scope="scope" slot="ex_files">
        <span v-if="scope.data.ex_files && scope.data.ex_files.length > 0">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              查看附件预览<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="item.url" v-for="(item, index) in scope.data.ex_files" :key="index">{{item.name}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
        <span v-else>暂无附件</span>
      </template>
      <template slot-scope="scope" slot="operation">
          <el-button type="primary" size="mini" @click="editRowInfo(scope.data)" v-if="$isPowerShow('edit')">编辑</el-button>
          <el-popconfirm
            v-if="$isPowerShow('del')"
            @confirm="deleteRowInfo(scope.data)"
            title="确定删除此条记录吗？">
            <el-button slot="reference" type="danger" size="mini">删除</el-button>
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

    <el-dialog title="文件预览" :visible.sync="dialogTableVisible" append-to-body width="800px">
      <div class="previewable-content-box">
        <iframe class="iframe-box"
          v-if="curFilesUrl"
          :src="curFilesUrl"
          frameborder="0"
          ref="iframe"
          allowfullscreen="true" allowtransparency="true"
          scrolling="no"/>
        <el-empty v-else description="暂无文件"></el-empty>

      </div>
    </el-dialog>

    <information-dialog
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      :curSelecedType="curSelecedType"
      :title="informationDialogTitle"
      @save-add-edit="saveAddEdit"
    ></information-dialog>

    <custom-setting
      :dialogBool.sync="customSettingVialogVisible"
      :customSettingList="customSettingList"
      :canRendererTableHeader="canRendererTableHeader"
      :customSettingShowList="customSettingShowList"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    ></custom-setting>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import informationDialog from "./component/information-dialog";
export default {
  name: "honor-wall",
  components: {
    subReq,
    informationDialog,
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
      informationDialogShow: false,
      customSettingVialogVisible: false,
      curSelecedType: "",
      informationDialogTitle: "新增荣誉",
      customSettingList: [
        {
          id: 1,
          label: "荣誉类型",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "荣誉级别",
          prop: "level",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "批准机关",
          prop: "organ",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "获奖党组织",
          prop: "ex_organ_names",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "获奖党员",
          prop: "ex_user_names",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "批准时间",
          prop: "ratify_date",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "荣誉截图",
          prop: "ex_pics",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "附件",
          prop: "ex_files",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "操作",
          prop: "operation",
          width: "140",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      curFilesUrl: '',
      dialogTableVisible:false
    };
  },
  mounted() {
    this.loadData();
    this.$nextTick(() => {
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    updateTableHeader(newestTableHeaderList) {
      this.canRendererTableHeader = null;
      this.customSettingShowList = null;
      this.customSettingShowList = newestTableHeaderList;
      this.canRendererTableHeader = newestTableHeaderList.filter(item => item.isSelected).map((sing,index) => {
        let obj = {
          id: index +1,
          label: sing.label,
          prop: sing.prop,
          width: sing.width,
          align: sing.align,
          signIndex: index,
          sortable: sing.sortable,
        }
        return obj
      });
      this.$forceUpdate();
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
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.ListPartyHonor(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list;
            this.pageInfo.pageCount = res.context.total
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
        .AddPartyHonorPartyHonor(parmas)
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
    restTableList() {
      this.form = {};
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    openAddPage(type) {
      this.curSelecedType = type;
      this.informationDialogTitle = "新增荣誉";
      this.informationDialogShow = true;
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
    // 编辑
    editRowInfo(form) {
      // console.log(form);
      this.curSelecedType = "edit";
      let newForm = {...form}
      for (const key in this.$refs.informationDialog.form) {
        if (Object.hasOwnProperty.call(newForm, key)) {
          this.$refs.informationDialog.form[key] = newForm[key];
        }
      }
      if(!form.ex_files) {
        this.$refs.informationDialog.form.ex_files = []
      }
      if(!form.ex_pics) {
        this.$refs.informationDialog.form.ex_pics = []
      }
      this.informationDialogTitle = "修改荣誉";
      this.informationDialogShow = true;
    },
    // 删除
    deleteRowInfo(info) {
       let params = {
        context: [info.id]
      };
      this.$client.BatchDeletePartyHonor(params)
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
    // 查看附件预览
    handleCommand(command) {
      // this.$message('click on item ' + command);
      this.curFilesUrl = 'http://view.xdocin.com/xdoc?_pdf=true&_xdoc=' + command;
      this.dialogTableVisible = true
    },
    // 计算表格高度 和初始化表头
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
        this.customSettingShowList = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        this.TableHeight = maxh - th - 30;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.honor-wall {
  width: 100%;
  height: 100%;
}

.previewable-content-box{
  width:100%;
  height:550px;
  .iframe-box{
    width: 100%;
    height: calc(100% - 65px);
    padding: 0;
    margin: 0;
    border: none;
  }
}
</style>

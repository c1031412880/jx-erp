<template>
  <div class="common-language-management">
    <sub-req
      ref="head"
      @on-add="openAddFormPage"
      @on-ok="onSubmit"
      :formList="formList"
    ></sub-req>
    <tr-table
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :isShowBottomOptions="false"
      :indexShow="false"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    >
      <template slot="is_enable" slot-scope="scope">
        <el-switch
          v-model="scope.data.is_enable"
          :active-value="1"
          :inactive-value="0"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="changeState(scope.data)">
        </el-switch>
      </template>
      <template slot="form_names" slot-scope="scope">
        <div>{{scope.data.is_all == 1 ? '全部审批单' : scope.data.form_names}}</div>
      </template>
      <template slot-scope="scope" slot="operation">
          <el-button type="primary" size="mini" @click="editRowInfo(scope.data)">编辑</el-button>
          <el-popconfirm
            @confirm="deleteRowInfo(scope.data.id)"
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
    <information-dialog
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      :curSelecedType="curSelecedType"
      :title="informationDialogTitle"
      :formList="formList"
      @save-add-edit-form="saveOrEdit"
    ></information-dialog>

  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import informationDialog from "./component/information-dialog";
export default {
  name: "common-language-management",
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
      curSelecedType: "",
      informationDialogTitle: "添加",
      drawerdialogVisible: false,
      customSettingList: [
        {
          id: 1,
          label: "序号",
          prop: "sort",
          width: "60",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "类型",
          prop: "type_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "常用语", 
          prop: "language",
          width: "250",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        // {
        //   id: 4,
        //   label: "关联审批单",
        //   prop: "form_names",
        //   width: "100",
        //   align: "center",
        //   signIndex: 3,
        //   sortable: false,
        // },
        {
          id: 5,
          label: "关联按键",
          prop: "button_name",
          width: "100",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "是否启用",
          prop: "is_enable",
          width: "100",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "操作",
          prop: "operation",
          width: "140",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      FormIds:[],
      departmentInfo: null,

      formList: [],
    };
  },
  mounted() {
    this.loadData();
    this.getAllForm()
    this.$nextTick(() => {
      this.setHead();
    });
  },
  methods: {
    // 获取所有表单
    getAllForm() {
      this.formList = []
      this.$client.GetFormTypeFlowManage({}).then(req => {
        if (req.head.result === "200") {
          Object.keys(req.context).forEach(key => {
            this.formList.push({
              id: Number(key),
              label: req.context[key]
            })
          })
        }else {
          this.$message({
            showClose: true,
            message: req.head.describle,
            type: "error",
          });
        }
      });
    },
    changeState(row) {
      this.curSelecedType = 'edit'
      this.editForm(row)
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
      this.$client.GetListCommonPhrase({context:params})
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
    saveOrEdit(form,type) {
      if (this.curSelecedType == 'add') {
        this.saveForm(form,type)
      } else {
        this.editForm(form)
      }
    },
    // 添加常用语
    saveForm(form,type) {
      let parmas = {
        context: form
      };
      this.$client
        .AddCommonPhrase(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            if (type == 2) {
              this.informationDialogShow = false;
            }else {
              this.$refs.informationDialog.form.language = ''
              this.$refs.informationDialog.form.sort = form.sort + 1
            }
            this.$message({
              showClose: true,
              message: '添加成功',
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
    // 编辑常用语
    editForm(form) {
      let parmas = {
        context: form
      };
      this.$client
        .EditCommonPhrase(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.informationDialogShow = false;
            this.$message({
              showClose: true,
              message: '编辑成功',
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
    openAddFormPage(type) {
      this.curSelecedType = type;
      this.informationDialogTitle = "添加常用语";
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
      this.curSelecedType = "edit";
      this.informationDialogShow = true;
      this.informationDialogTitle = "编辑常用语";
      setTimeout(() => {
        this.$refs.informationDialog.form.sort = form.sort;
        this.$refs.informationDialog.form.type = form.type;
        this.$refs.informationDialog.form.language = form.language;
        this.$refs.informationDialog.form.is_all = form.is_all;
        this.$refs.informationDialog.form.buttons = form.buttons;
        this.$refs.informationDialog.form.id = form.id;

        this.$refs.informationDialog.form.form_ids = form.form_ids;

      }, 100);
    },
    // 删除
    deleteRowInfo(context) {
      this.$client.DeleteCommonPhrase({context})
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
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH ;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.common-language-management {
  width: 100%;
  height: 100%;
}
</style>

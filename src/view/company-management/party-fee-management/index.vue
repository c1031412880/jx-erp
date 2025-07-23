<template>
  <div class="renting-house-management">
    <sub-req
      ref="head"
      @on-add="openAddPage"
      @on-ok="onSubmit"
      @on-set-proportion="openSetProportion"
      @onbtn-import="openFiledialog"
      @onbtn-export="exportExcel"
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
      @on-select-change-row="selectedList"
    >
      <!-- <template slot-scope="scope" slot="state">
        <span v-if="!!scope.data.state">{{scope.data.state === 1? '未出租':'已出租'}}</span>
      </template> -->
      <template slot-scope="scope" slot="operation">
          <el-button type="primary" size="mini" @click="editRowInfo(scope.data)" v-if="$isPowerShow('edit')">编辑</el-button>
          <el-popconfirm
            @confirm="deleteRowInfo(scope.data)"
            v-if="$isPowerShow('del')"
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
    <!-- 添加编辑党费 -->
    <information-dialog
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      :curSelecedType="curSelecedType"
      :title="informationDialogTitle"
      @save-add-edit="saveAddEdit"
    ></information-dialog>
    <!-- 设置比例 -->
    <set-proportion-dialog
      ref="setProportionDialog"
      :dialogBool.sync="isShowProportionSet"
      @save-set-proportion="saveSetProportion"
    ></set-proportion-dialog>

    <custom-setting
      :dialogBool.sync="customSettingVialogVisible"
      :customSettingList="customSettingList"
      :canRendererTableHeader="canRendererTableHeader"
      :customSettingShowList="customSettingShowList"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    ></custom-setting>

    <file-dialog
      :dialogBool.sync="filedialogVisible"
      :fileData="FileData"
      :typeMessage="'同名党员'"
      @on-submit-excel="onSubmitExcel"
    ></file-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import informationDialog from "./component/information-dialog";
import setProportionDialog from "./component/set-proportion-dialog";
import fileDialog from "@/components/fileDialog/file-dialog.vue";
export default {
  name: "party-fee-management",
  components: {
    subReq,
    informationDialog,
    setProportionDialog,
    fileDialog,
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
      selectedIds:[], //勾选的ID
      loading: false,
      TableHeight: 500,
      informationDialogShow: false,
      customSettingVialogVisible: false,
      curSelecedType: "",
      informationDialogTitle: "添加",
      customSettingList: [
        {
          id: 1,
          label: "姓名",
          prop: "ex_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "手机号",
          prop: "ex_phone",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "所在党组织",
          prop: "ex_party_branch",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "应发工资",
          prop: "should_wage",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        // {
        //   id: 4,
        //   label: "缴纳党费标准",
        //   prop: "ex_standard",
        //   width: "130",
        //   align: "center",
        //   signIndex: 3,
        //   sortable: false,
        // },

        {
          id: 5,
          label: "实发工资",
          prop: "wage",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "缴纳基数",
          prop: "base_pay",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "党费计算比例",
          prop: "ratio",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "应缴党费（元）",
          prop: "should_fee",
          width: "160",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "本次缴纳党费月份（月）",
          prop: "month",
          width: "205",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "本次缴纳金额（元）",
          prop: "actual_fee",
          width: "170",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "缴纳日期",
          prop: "submit_date",
          width: "170",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "操作人",
          prop: "ex_opor",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "备注",
          prop: "remark",
          width: "160",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "操作",
          prop: "operation",
          width: "140",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      isShowProportionSet: false,
      FileData: {
        url: window.newHttpConfig.URL_EASYMOCK +  "/Files/TempFiles/党费记录模板.xlsx",
      },
      filedialogVisible: false
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
    // 导出
    exportExcel() {
      let params = Object.assign({}, this.form);
      let ids = [ ...this.selectedIds ]
      if(ids.length) {
        params.ids = ids.toString()
      }
      this.$client.ExportPartyFee(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })
    },
    // 勾选中的
    selectedList(list) {
      this.selectedIds = [];
      if(list && list.length > 0) {
        list.forEach((item,index) => {
          this.selectedIds.push(item.id)
        });
      }
    },
    // 打开导入弹窗
    openFiledialog() {
      this.filedialogVisible = true;
    },
    // 导入党费管理记录
    onSubmitExcel(exportInfo) {
      let formData = new FormData();
      formData.append("file", exportInfo.file);
      formData.append("type", exportInfo.radio);

      let params = formData;
      // console.log(params)
      this.$client.ImportPartyFee(params)
      .then(res => {
        if(res.head.result == "200") {
          this.form = {};
          this.pageInfo.pageIndex = 1;
          this.pageInfo.pageCount = 0;
          this.loadData();
          this.filedialogVisible = false;
          this.$message({ message: res.head.describle, type: "success" });
        }else{
          this.filedialogVisible = false;
          let errorData = [];
          const h = this.$createElement;
          errorData.push(h('p',null,res.head.describle));
          this.$msgbox({
            title: '提示',
            message: h('div',null, errorData),
            confirmButtonText: '确定',
          })

          // this.$message({ message: res.head.describle, type: "error" });
        }
      })
    },
    // 添加党费比例设置
    saveSetProportion(setProportionList) {
      let parmas = {
        context: setProportionList
      }
      this.$client
        .PartyFeeSetPartyFee(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.isShowProportionSet = false;
            this.$message({
              showClose: true,
              message: '设置比例成功',
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
      this.$client.ListPartyFee(params)
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
        .AddPartyFeePartyFee(parmas)
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
      this.informationDialogTitle = "新增党费缴纳";
      this.informationDialogShow = true;
    },
    // 打开比例设置
    openSetProportion() {
      this.isShowProportionSet = true;
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
      for (const key in this.$refs.informationDialog.formData) {
        if (Object.hasOwnProperty.call(this.$refs.informationDialog.formData, key)) {
          this.$refs.informationDialog.formData[key] = newForm[key];
        }
      }
      this.informationDialogTitle = "修改党费缴纳";
      this.informationDialogShow = true;
    },
    // 删除
    deleteRowInfo(info) {
       let params = {
        context: [info.id]
      };
      this.$client.BatchDeletePartyFee(params)
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
.renting-house-management {
  width: 100%;
  height: 100%;
}
</style>

<template>
  <div class="money-reconcilia">
    <sub-req
      ref="head"
      @on-add="openAddJobPage"
      @on-ok="onSubmit"
      @is-check="isCheck"
      @delete-select="deleteSelect"
      @on-btn-export="exportFile"
      @on-btn-import="importFile"
    ></sub-req>
    <tr-table
      ref="trTable"
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :isShowBottomOptions="false"
      :isShowSummary="true"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      :sumTotal="sumTotal"
      :sumColumnIndex="sumColumnIndex"
      @on-select-change-row="selectedUpkeepPlanList"
    >
      <template slot-scope="scope" slot="operation">
        <!-- <el-button type="primary" size="mini" @click="checkStatus(scope.data)">审核</el-button> -->
        <el-button
          type="primary"
          size="mini"
          :disabled="scope.data.state === 1"
          @click="editRowInfo(scope.data, 'edit')"
          v-if="$isPowerShow('edit')"
        >
          编辑
        </el-button>
        <!-- <el-button type="primary" size="mini" @click="editRowInfo(scope.data,'detail')">查看</el-button> -->
        <el-popconfirm
          @confirm="deleteRowInfo(scope.data)"
          title="确定删除此条记录吗？"
          v-if="$isPowerShow('del')"
        >
          <el-button slot="reference" type="danger" size="mini" style="margin-left: 10px">
            删除
          </el-button>
        </el-popconfirm>
      </template>
    </tr-table>

    <el-pagination
      style="margin: 5px 0; display: flex; justify-content: flex-end"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      ref="paginationH"
      :current-page="pageInfo.pageIndex"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageInfo.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageInfo.pageCount"
    ></el-pagination>

    <information-dialog
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      :curSelecedType="curSelecedType"
      :title="informationDialogTitle"
      @save-add-edit="saveAddEdit"
    ></information-dialog>

    <!-- 上传文件 导出文件弹窗组件 -->
    <file-dialog
      :dialogBool.sync="filedialogVisible"
      :fileData="FileData"
      :typeMessage="'相同日期现金对账记录'"
      @on-submit-excel="importExcel"
    ></file-dialog>

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
import fileDialog from "@/components/fileDialog/file-dialog";
export default {
  name: "money-reconcilia",
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
      informationDialogShow: false,
      customSettingVialogVisible: false,
      curSelecedType: "",
      informationDialogTitle: "添加",
      drawerdialogVisible: false,
      customSettingList: [
        {
          id: 1,
          label: "日期",
          prop: "date",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "值班人员",
          prop: "duty_names",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "存款人员",
          prop: "entry_names",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "点钞人员",
          prop: "reckon_names",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "五元及以上纸币",
          prop: "five",
          width: "160",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "一元纸币",
          prop: "one_notes",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "一元硬币",
          prop: "one_coins",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "五角硬币",
          prop: "half_coins",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        {
          id: 9,
          label: "五角纸币",
          prop: "half_notes",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: true,
        },
        {
          id: 10,
          label: "零头",
          prop: "fraction",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: true,
        },
        {
          id: 11,
          label: "合计",
          prop: "total",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: true,
        },
        {
          id: 12,
          label: "录入人",
          prop: "create_name",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "录入时间",
          prop: "created",
          width: "130",
          align: "center",
          signIndex: 12,
          sortable: true,
        },
        {
          id: 14,
          label: "审核状态",
          prop: "state_name",
          width: "130",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
        {
          id: 15,
          label: "审核人",
          prop: "check_name",
          width: "130",
          align: "center",
          signIndex: 14,
          sortable: false,
        },
        {
          id: 16,
          label: "审核时间",
          prop: "check_time",
          width: "130",
          align: "center",
          signIndex: 15,
          sortable: true,
        },
        {
          id: 18,
          label: "操作",
          prop: "operation",
          width: "160",
          align: "center",
          signIndex: 17,
          sortable: false,
        },
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      filedialogVisible: false,
      FileData: {
        url: `${window.newHttpConfig.URL_EASYMOCK}/Files/TempFiles/现金对账模板.xlsx`,
      },
      selectedIds:[],
      sumTotal:{ //约定某一列汇总合计自定义数据
        5: '',
        6: '',
        7: '',
        8: '',
        9: '',
        10: '',
        11: '',
      },
      sumColumnIndex:[6,7,8,9,10,11,12], //要定义的列的索引
      totalColumnProps:['half_coins','one_coins','half_notes','one_notes','five','fraction','total'],
      titlesId:'', //当前表头的id
      menu_code:'',
      pageInfoData: null, //当前页面所有数据
      selectedCountingRecordList: []
    };
  },
  created() {
    this.menu_code = this.$route.meta.code
    this.reqTitleTable()
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
     updateTableHeader(newestTableHeaderList) {
      this.$httpTableHeader.saveTableHeader(this.titlesId,this.menu_code,newestTableHeaderList).then(res => {

        this.reqTitleTable()
      }).catch(err => {

      })
    },
    // 获取表头
    reqTitleTable() {
      this.loading = true;
      this.$httpTableHeader.reqTableHeader(this.menu_code,this.customSettingList).then(res => {
        this.titlesId = res.titlesId;
        this.canRendererTableHeader = res.canRendererTableHeader;
        this.customSettingList = res.customSettingList;
        this.customSettingShowList = res.customSettingShowList;
        this.bulidSumColumnTotalInfo();
        this.$forceUpdate();
        setTimeout(() =>{
          this.loading = false;
        },600)
      }).catch(err => {
        setTimeout(() =>{
          this.loading = false;
        },600)
      })
    },
    // 构建和合计的自动计算
    bulidSumColumnTotalInfo() {
      this.sumColumnIndex = [];
      this.sumTotal = {};
      if(!!this.canRendererTableHeader && this.canRendererTableHeader.length > 0) {
        this.canRendererTableHeader.forEach(element => {
          this.totalColumnProps.forEach(item => {
            if(element.prop == item) {
              this.sumTotal[element.signIndex+1] = ''
              this.sumColumnIndex.push(element.signIndex+1)
            }
          });
        });
      }
      this.bulidTotalData()
    },
    // 导入信息Excel
    importExcel(val) {
      // alert(JSON.stringify(val))
      let formData = new FormData();
      formData.append("file", val.file);
      formData.append("type", val.radio);
      let params = formData;
      // console.log(params)
      this.$client.importCashEnter(params).then((res) => {
        if (res.head.result == "200") {
          this.form = {};
          // 重置信息
          // this.pageInfo.pageIndex = 1;
          // this.pageInfo.pageCount = 0;
          this.$refs.head.resetForm();
          // this.loadData();
          this.filedialogVisible = false;
          this.$message({ message: res.head.describle, type: "success" });
        } else {
          this.filedialogVisible = false;
          let errorData = [];
          const h = this.$createElement;
          errorData.push(h("p", null, res.head.describle));
          this.$msgbox({
            title: "提示",
            message: h("div", null, errorData),
            confirmButtonText: "确定",
          });

          // this.$message({ message: res.head.describle, type: "error" });
        }
      });
    },
    onSubmit(form) {
      this.form = Object.assign({}, form);
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
      this.$client.getByPageCashEnter(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            let list = res.context.list;
            list.forEach(item => {
              if(!item.check_time) {
                item.check_time = undefined
              }
              if(!item.check_name) {
                item.check_name = undefined
              }
            });
            this.data = list;
            this.pageInfo.pageCount = res.context.total;
            this.pageInfoData = res.context;
            this.bulidTotalData();
            // this.sumTotal = {
            //   5: res.context.total_five,
            //   6 : res.context.total_one_notes,
            //   7 : res.context.total_one_coin,
            //   8 : res.context.total_half_coin,
            //   9 : res.context.total_half_notes,
            //   10 : res.context.total_fraction,
            //   11 : res.context.total_cash,
            // }
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
     //构建底部合计展示数据
    bulidTotalData() {
      if(this.sumColumnIndex.length > 0 && !!this.pageInfoData) {
        this.sumColumnIndex.forEach(item => {
          this.canRendererTableHeader.forEach(element =>{
            if(item == element.signIndex+1) {
              switch (element.prop) {
                case 'half_coins':
                  this.sumTotal[item] = this.pageInfoData.total_half_coin
                  break;
                case 'one_coins':
                  this.sumTotal[item] = this.pageInfoData.total_one_coin
                  break;
                case 'half_notes':
                  this.sumTotal[item] = this.pageInfoData.total_half_notes
                  break;
                case 'one_notes':
                  this.sumTotal[item] = this.pageInfoData.total_one_notes
                  break;
                case 'five':
                  this.sumTotal[item] = this.pageInfoData.total_five
                  break;
                case 'fraction':
                  this.sumTotal[item] = this.pageInfoData.total_fraction
                  break;
                case 'total':
                  this.sumTotal[item] = this.pageInfoData.total_cash
                  break;
              }
            }
          })
        })
      }
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
        .setRecordCashEnter(parmas)
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
    deleteSelect() {
      if(this.selectedIds.length == 0) {
        this.$message({
          showClose: true,
          message: '请勾选要删除的选项',
          type: "warning",
        });
        return
      }
      this.deleteRowInfo(null);
    },
    //打开导入文件弹窗
    importFile() {
      this.filedialogVisible = true;
    },

    // 导出Excel
    exportFile(){
      let params = Object.assign({}, this.form);
      let ids = [ ...this.selectedIds ]
      if(ids.length) {
        params.ids = ids.toString()
      }
      this.$client.exportCashEnter(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })

    },
    // 审核 、取消审核
    isCheck(type) {
      if(this.selectedCountingRecordList.length == 0) {
        this.$message({
          showClose: true,
          message: "请先勾选表格记录",
          type: "warning",
        });
        return
      }
      let isCanGo = true;
      this.selectedCountingRecordList.forEach(item => {
        if(type == 'sure') {
          console.log(item)
          if(item.state === 1) {
            isCanGo = false
          }
        }
        if(type == 'cancle') {
          console.log(item)
          if(item.state === 0 || item.state === 2) {
             isCanGo = false
          }
        }

      })
      switch (type) {
        case "sure":
          if(!isCanGo) {
            this.$message({
              showClose: true,
              message: "只允许勾选未审核和取消审核状态下的记录",
              type: "warning",
            });
            return
          }
          this.goReviewAndCancelRecordRecKon(type)

          break;
        case "cancle":
          if(!isCanGo) {
            this.$message({
              showClose: true,
              message: "只允许勾审核通过状态下的记录",
              type: "warning",
            });
            return
          }
          this.goReviewAndCancelRecordRecKon(type)
          break;
      }
    },
    // 取消审核或者审核
    goReviewAndCancelRecordRecKon(type) {
      let params = {
        context: this.selectedIds
      };
      if(type == 'cancle') {
        this.$client.reviewCancelRecordCashEnter(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.selectedIds = [];
            this.selectedCountingRecordList = [];
            this.$refs.trTable.handleSelectionChange([]);
            this.$message({
              showClose: true,
              message: "取消审核成功",
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
        .catch((err) => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        });
      }

      if(type == 'sure') {
        this.$client.reviewRecordCashEnter(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.selectedIds = [];
            this.selectedCountingRecordList = [];
            this.$refs.trTable.handleSelectionChange([]);
            this.$message({
              showClose: true,
              message: "审核成功",
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
      }

    },
    restTableList() {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    openAddJobPage(type) {
      this.curSelecedType = type;
      this.informationDialogTitle = "现金对账录入";
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
    openAdvancedFilterPage() {
      this.drawerdialogVisible = true;
    },

    selectedUpkeepPlanList(list) {
      this.selectedCountingRecordList = list;
      this.selectedIds = [];
      list.forEach((item,index) => {
        this.selectedIds.push(item.id)
      });
      console.log(JSON.stringify(this.selectedIds))
    },

    // 编辑
    editRowInfo(form,type) {
      // console.log(form);
      this.curSelecedType = type;
      let newForm = {...form};
      this.$refs.informationDialog.allMoneynumber = newForm.total || 0;
      setTimeout(() => {
        for (const key in this.$refs.informationDialog.form) {
          if (Object.hasOwnProperty.call(newForm, key)) {
            if(key == 'duty_ids' || key == 'entry_ids' || key == 'reckon_ids') {
              newForm[key] = newForm[key].split(',').map(Number)
            }
              this.$refs.informationDialog.form[key] = newForm[key]
          }
        }
      },100)

      if(type == 'edit') {
        this.informationDialogTitle = "现金录入";
      }else{
        this.informationDialogTitle = "现金录入";
      }

      this.informationDialogShow = true;
    },
    // 删除
    deleteRowInfo(info) {
       let params = {
        context: []
      };
      if(!!info) {
        params.context[0] = info.id
      }else{
        params.context = this.selectedIds
      }
      this.$client.deleteRecordCashEnter(params)
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
    // 审核
    checkStatus(form) {

    },
    // 计算表格高度 和初始化表头
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.money-reconcilia {
  width: 100%;
  height: 100%;
}
</style>

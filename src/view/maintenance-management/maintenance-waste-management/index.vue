<template>
  <div class="site-information-management">
    <sub-req
      ref="head"
      @on-add="openAddPage"
      @on-export="exportFile"
      @on-ok="onSubmit"
      @on-import="openFiledialog"
    ></sub-req>
    <!-- <tr-table
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :isShowBottomOptions="false"
      :isShowSummary="true"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    >
      <template slot-scope="scope" slot="operation">
        <el-button type="primary" size="mini" @click="editRowInfo(scope.data, 'detail')">查看</el-button>
          <el-button type="primary" size="mini" @click="editRowInfo(scope.data, 'edit')" v-if="$isPowerShow('edit')">编辑</el-button>
          <el-popconfirm
            @confirm="deleteRowInfo(scope.data)"
            title="确定删除此条记录吗？"
            v-if="$isPowerShow('del')">
            <el-button slot="reference" type="danger" size="mini">删除</el-button>
          </el-popconfirm>
      </template>
    </tr-table> -->

     <el-table
      :data="data"
      border
      stripe
      ref="table"
      :height="TableHeight"
      :summary-method="getSummaries"
      show-summary
      style="width: 100%"
      highlight-current-row
      :header-cell-style="{background:'#E0F3FF',color:'#333333',fontSize:'16px',padding: '2px 0px',fontWeight: '700'}"
      :cell-style="{fontSize: '13px', padding: '2px 0px'}"
      >
      <el-table-column type="index" fixed="left" width="60" label="序号" align="center"></el-table-column>
      <el-table-column prop="type_name" label="回收项目" width="130" align="center"></el-table-column>
      <el-table-column prop="recycle_date" label="回收日期" width="130" align="center"></el-table-column>
      <el-table-column prop="recycle_unit_name" label="回收单位" width="300" align="center"></el-table-column>
      <el-table-column prop="specifications" label="规格型号" width="160" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.type === 6">
            <p v-for="(item, index) in scope.row.waste_details" :key="index">
              {{item.specifications}}
            </p>
          </div>
          <div v-else>
            {{scope.row.specifications}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="reduced" label="折合" align="center"></el-table-column>
      <el-table-column prop="recycle_count" width="130" label="入库数" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.type === 6">
            <p v-for="(item, index) in scope.row.waste_details" :key="index">
              {{item.recycle_count + quantityType[6]}}
            </p>
          </div>
          <div v-else>
            {{scope.row.recycle_count + quantityType[scope.row.type]}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="recycle_weight" width="130" label="回收重量" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.type === 6">
            <p v-for="(item, index) in scope.row.waste_details" :key="index">
              {{item.recycle_weight + weightType[6]}}
            </p>
          </div>
          <div v-else>
            {{scope.row.recycle_weight + weightType[scope.row.type]}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="recycle_weight" width="130" label="回收重量合计" align="center">
        <template slot-scope="scope">
          {{scope.row.recycle_weight + weightType[scope.row.type]}}
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" align="center"></el-table-column>
      <el-table-column prop="operation" label="操作" fixed="right" align="center" width="250">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="editRowInfo(scope.row, 'detail')">查看</el-button>
            <el-button type="primary" size="mini" @click="editRowInfo(scope.row, 'edit')" v-if="$isPowerShow('edit')">编辑</el-button>
            <el-popconfirm
              @confirm="deleteRowInfo(scope.row)"
              title="确定删除此条记录吗？"
              v-if="$isPowerShow('del')">
              <el-button slot="reference" type="danger" size="mini">删除</el-button>
            </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

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
    <file-dialog
      :dialogBool.sync="filedialogVisible"
      :fileData="FileData"
      :isShowImportState="false"
      @on-submit-excel="onSubmitExcel"
    ></file-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import informationDialog from "./component/information-dialog";
import fileDialog from "@/components/fileDialog/file-dialog.vue";
export default {
  name: "site-information-management",
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
      selectedIds:[], //勾选的ID
      customSettingList: [
        {
          id: 1,
          label: "回收项目",
          prop: "type_name",
          width: "160",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "回收日期",
          prop: "recycle_date",
          width: "160",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "回收单位",
          prop: "recycle_unit_name",
          width: "200",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "规格型号",
          prop: "specifications",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        // {
        //   id: 5,
        //   label: "单位",
        //   prop: "unit",
        //   width: "130",
        //   align: "center",
        //   signIndex: 4,
        //   sortable: false,
        // },
        {
          id: 5,
          label: "折合",
          prop: "reduced",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "入库数",
          prop: "recycle_count",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "回收重量",
          prop: "recycle_weight",
          width: "150",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "备注",
          prop: "remark",
          width: "250",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "操作",
          prop: "operation",
          width: "220",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      quantityType: {
        1: '只',
        2: '升',
        3: '条',
        4: '',
        5: 'kg',
        6: '个',
        7: 'kg',
      },
      weightType: {
        1: '吨',
        2: 'kg',
        3: '吨',
        4: '吨',
        5: 'kg',
        6: 'kg',
        7: 'kg',
      },
      sumQuantity: 0,
      sumWeight: 0,

      FileData: {
        url: window.newHttpConfig.URL_EASYMOCK +  "/Files/TempFiles/维修废料导入模板.xlsx",
      },
      filedialogVisible: false
    };
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
    openFiledialog() {
      this.filedialogVisible = true;
    },
    // 导入
    onSubmitExcel(exportInfo) {
      let formData = new FormData();
      formData.append("file", exportInfo.file);
      formData.append("type", exportInfo.radio);

      let params = formData;
      // console.log(params)
      this.$client.ImportInfoMaintRepairWaste(params)
      .then(res => {
        if(res.head.result == "200") {
          this.pageInfo.pageIndex = 1;
          this.pageInfo.pageCount = 0;
          this.loadData();
          this.filedialogVisible = false;
          this.$message({ message: res.head.describle, type: "success" });
        }else{
          this.filedialogVisible = false;
          this.$message({ message: res.head.describle, type: "error" });
        }
      })
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        if (index === 6) {
          sums[index] = this.sumQuantity
        } else if (index === 7) {
          sums[index] = this.sumWeight
        }
        // const values = data.map(item => Number(item[column.property]));
        // if (!values.every(value => isNaN(value)) && (index === 6 || index === 7)) {
        //   sums[index] = values.reduce((prev, curr) => {
        //     const value = Number(curr);
        //     if (!isNaN(value)) {
        //       return prev + curr;
        //     } else {
        //       return prev;
        //     }
        //   }, 0);
        // }
      });

      return sums;
    },
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
    // 导出Excel
    exportFile(){
      let params = Object.assign({},this.form);
      let ids = [ ...this.selectedIds ]
      if (ids.length) {
        params.ids = ids.toString()
      }
      this.$client.ExportMaintRepairWaste(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })
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
      this.$client.GetByPageMaintRepairWaste(params)
        .then(res => {
          // console.log(JSON.stringify(res));
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list;
            this.data.forEach(item => {
              item.reduced = item.reduced || ''
              item.recycle_count = item.recycle_count || ''
              item.recycle_weight = item.recycle_weight || ''

              if (item.type == 6) {
                item.recycle_weight = item.waste_details.reduce((prev,item) => {
                  prev += Number(item.recycle_weight)
                  return prev
                },0)
              }
            })
            this.pageInfo.pageCount = res.context.total
            this.sumQuantity = res.context.summary['count_total']
            this.sumWeight = res.context.summary['weight_total']
            this.$nextTick(() => {
              this.$refs.table.doLayout()
            })
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
      this.$client.CreateOrUpdateMaintRepairWaste(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.informationDialogShow = false;
            this.$message({
              showClose: true,
              message: successrMessage,
              type: "success",
            });
          sessionStorage.setItem('wasteType',form.type)
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
    openAddPage(type) {
      this.curSelecedType = type;
      this.informationDialogTitle = "添加回收废料";
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
    editRowInfo(row,type) {
      let form = Object.assign({}, row)
      this.curSelecedType = type;
      setTimeout(() => {
        for (const key in this.$refs.informationDialog.form) {
          if (Object.hasOwnProperty.call(form, key)) {
            this.$refs.informationDialog.form[key] = form[key];
            if(form.Kind == '0') {
              this.$refs.informationDialog.form.Kind = ''
            }
          }
        }
        if(!!form.waste_details && !!form.waste_details.length) {
          this.$refs.informationDialog.form.waste_details = JSON.parse(JSON.stringify(form.waste_details))
        }
      }, 200);
      this.informationDialogTitle = `${type == 'edit'? '编辑回收废料':'回收废料详情'}`;
      this.informationDialogShow = true;
    },
    // 删除
    deleteRowInfo(info) {
       let params = {
        context: [info.id]
      };
      this.$client.DeleteMaintRepairWaste(params)
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
    // 勾选中的
    selectedList(list) {
      this.selectedIds = [];
      if(list && list.length > 0) {
        list.forEach((item,index) => {
          this.selectedIds.push(item.id)
        });
      }
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
.site-information-management {
  width: 100%;
  height: 100%;
}
</style>

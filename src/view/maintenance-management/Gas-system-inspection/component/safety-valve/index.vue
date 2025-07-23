<template>
  <div class="safety-valve">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-btn="onBtn"
    ></sub-req>

    <tr-table
      :selectionShow="true"
      :data="data"
      :loading="loading"
      :TableHeight="TableHeight"
      :backFixedNum="backFixedNum"
      :frontFixedNum="frontFixedNum"
      :tableHeaderList="customSettingList"
      :rowspanObj="rowspanObj"
      :mergekeys="mergekeys"
      :spanMethodType="['column']"
      @on-select-change-row="selectedUserList"
      >
      <template slot-scope="scope" slot="operation">
        <el-button type="text" size="mini" @click="editInfo(scope.data, 'detail')">查看</el-button>
        <el-button type="text" size="mini" @click="editInfo(scope.data, 'edit')" v-if="$isPowerShow('edit')">编辑</el-button>
        <el-popconfirm
          @confirm="deleteRowInfo(scope.data)"
          title="确定删除此条记录吗？"
          v-if="$isPowerShow('del')">
          <el-button slot="reference" type="text" size="mini" style="margin-left: 10px;color:red" >删除</el-button>
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
      :total="pageInfo.pageCount">
    </el-pagination>


    <information-dialog
      ref="information"
      :dialogBool.sync="informationVisible"
      :curSelecedType="curSelecedType"
      @on-save="addOrEditInformation">
    </information-dialog>

    <inspect-dialog
      ref="inspectInfo"
      :dialogBool.sync="inspectVisible"
      @on-save="saveInspect">
    </inspect-dialog>

    <file-dialog
      :dialogBool.sync="filedialogVisible"
      :fileData="FileData"
      typeMessage ="安全阀"
      @on-submit-excel ="importExcel"
    ></file-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import informationDialog from "./component/information-dialog";
import inspectDialog from "./component/inspect-dialog";
import fileDialog from '@/components/fileDialog/file-dialog'

export default {
  name: 'safety-valve',
  components: {
    subReq,
    fileDialog,
    informationDialog,
    inspectDialog,
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
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      customSettingList: [
        {
          id: 1,
          label: "自编号",
          prop: "vehicle_number",
          width: "120",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "车牌号",
          prop: "vehicle_code",
          width: "120",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "组织",
          prop: "vehicle_dept",
          width: "160",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "车辆型号",
          prop: "vehicle_model",
          width: "160",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "安全阀类型",
          prop: "valve_type_name",
          width: "120",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "安全阀型号",
          prop: "valve_model",
          width: "120",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "要求整定压力(Mpa)",
          prop: "working_pressure",
          width: "150",
          align: "center",
          signIndex: 6,
        },
        {
          id: 8,
          label: "安全阀编号",
          prop: "code",
          width: "150",
          align: "center",
          signIndex: 7,
        },
        {
          id: 9,
          label: "校验日期",
          prop: "recently_check_date",
          width: "150",
          align: "center",
          signIndex: 8,
        },
        {
          id: 10,
          label: "校验报告编号",
          prop: "last_check_code",
          width: "150",
          align: "center",
          signIndex: 9,
        },
        {
          id: 11,
          label: "下次校验日期",
          prop: "next_check_date",
          width: "150",
          align: "center",
          signIndex: 10,
        },
        {
          id: 12,
          label: "操作",
          prop: "operation",
          width: "160",
          align: "center",
          signIndex: 11,
        },
      ],
      informationVisible: false,
      curSelecedType: 'add',

      filedialogVisible: false,
      FileData: {
        url: window.newHttpConfig.URL_EASYMOCK +  "/Files/TempFiles/安全阀导入模板.xlsx",
      },

      projectList: [],
      selectedProjectIds: [],
      inspectVisible: false,

      rowspanObj: {},
      mergekeys: ['vehicle_id','vehicle_number','vehicle_code','vehicle_dept','vehicle_model'],
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead()
    });
  },
  methods: {
    // 按钮事件 
    onBtn(type) {
      switch (type) {
        case 'add':
          this.informationVisible = true
          this.curSelecedType = 'add'
          this.$nextTick(() => {
            this.$refs.information.setData(null)
          })
          break;
          // 检验 
        case 'inspect':
          if(this.projectList.length == 0) {
            this.$message({
              showClose: true,
              message: '请勾选至少一条要检验的',
              type: "warning",
            });
            return
          }
          this.inspectVisible = true
          this.$nextTick(() => {
            this.$refs.inspectInfo.setData(this.projectList)
          })
          break;
        case 'del':
          if(this.selectedProjectIds.length == 0) {
            this.$message({
              showClose: true,
              message: '请勾选至少一条要移除的',
              type: "warning",
            });
            return
          }
          this.deleteRowInfo(null)
          break;
        case 'import':
          this.filedialogVisible = true
          break;
        case 'export':
          this.onExport()
          break;
        default:
          break;
      }
    },
    // 查询
    onSubmit(form) {
      this.form = form
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
      this.$client.GetSafetyValveByPage({context:params})
        .then(res => {
          // console.log(JSON.stringify(res));
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list;
            this.rowspanObj = this.$handleTableSpan(this.mergekeys, this.data,'vehicle_id',true)
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
    // 选中表格勾选框
    selectedUserList(projectList) {
      this.projectList = projectList
      this.selectedProjectIds = [];
      projectList.forEach((item,index) => {
        this.selectedProjectIds.push(item.id)
      });
    },
    editInfo(row,type) {
      this.curSelecedType = type
      this.informationVisible = true
      this.$nextTick(() => {
        this.$refs.information.setData(row)
      })
    },
    // 新增或 编辑 
    addOrEditInformation(form) {
      let successrMessage = "";
      let parmas = {
        context: form,
      };
      if (this.curSelecedType == "add") {
        delete parmas.context.id;
        successrMessage = "添加成功";
      } else {
        successrMessage = "编辑成功";
      }
      this.$client
        .AddOrUpdateSafetyValve(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.informationVisible = false;
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
    // 删除
    deleteRowInfo(info) {
      let params = {};
      params.context = [];
      if(!!info) {
        params.context.push(info.id)
      }else{
        params.context = this.selectedProjectIds;
      }
      this.$client.DeleteSafetyValve(params)
      .then(res => {
        if (res.head.result == "200") {
          this.loadData()
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
    saveInspect(data) {
      this.$client.BatchCheckSafetyValve({context:data}).then((res) => {
        if(res.head) {
          if (res.head.result == "200") {
            this.inspectVisible = false
            this.loadData()
            this.$message({ type: "success", message: "检验成功" });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }else{
        }
      });
    },
    onExport() {
      let params = Object.assign({}, this.form);
      this.$client.SafetyValveExportGasManage({context:params}).then((res) => {
        if(res.head) {
          if (res.head.result == "200") {
            window.location.href = res.context;
            this.$message({ type: "success", message: "导出成功" });
          } else {
            this.$message({ type: "error", message: "导出失败" });
          }
        }else{
          this.$message({ type: "warning", message: "暂无可导出内容" });
        }
        
      });
    },
    importExcel(val){
      let formData = new FormData();
      formData.append("file", val.file);
      formData.append("type", val.radio);
      let params = formData;
      // console.log(params)
      this.$client.SafetyValveImportGasManage(params)
      .then(res => {
        if(res.head.result == "200") {
          this.loadData()
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
        }
      })
    },
    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let ph = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - ph - 14;
      }, 60);
    },
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.safety-valve
  height: 100%
  width: 100%
</style>
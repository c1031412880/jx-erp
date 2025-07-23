<template>
  <div class="maintenance-schedule">
    <sub-req ref="head" @on-add="openAddVemodelPage" @on-ok="onSubmit"></sub-req>
    <tr-table
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :TableHeight="TableHeight"
      :loading="loading || headerLoading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      @on-select-change-row="selectedUpkeepPlanList"
    >
      <!-- <template slot-scope="scope" slot="upkeep_type">
      <span>{{scope.data.upkeep_type == "1"? '一保':'二保'}}</span>
    </template> -->
      <!-- <template slot-scope="scope" slot="date_range">
      <span v-if="scope.data.plan_start">{{scope.data.plan_start}} 至 {{scope.data.plan_end}}</span>
      <span v-else>--</span>
    </template>
    <template slot-scope="scope" slot="allot_state">
      <span>{{!!scope.data.allot_state? '未下发':'已下发'}}</span>
    </template>
     <template slot-scope="scope" slot="confirm_state">
      <span>{{!!scope.data.confirm_state? '未确认':'已确认'}}</span>
    </template>
    <template slot-scope="scope" slot="create_type">
      <span>{{!!scope.data.create_type? '人工录入':'系统生产'}}</span>
    </template> -->
      <template slot-scope="scope" slot="v_num">
        <el-link type="primary" @click="vehicle_name(scope.data.v_num)">
          {{ scope.data.v_num }}
        </el-link>
      </template>
      <template slot-scope="scope" slot="lp_num">
        <el-link type="primary" @click="vehicle_name(scope.data.lp_num)">
          {{ scope.data.lp_num }}
        </el-link>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button
          type="primary"
          size="mini"
          @click="issueRowInfo(scope.data)"
          v-if="$isPowerShow('issue')"
        >
          {{ scope.data.state == 2 || scope.data.state == 3 ? '退回' : '下发' }}
        </el-button>
        <el-button
          type="primary"
          size="mini"
          @click="editRowInfo(scope.data, 'edit')"
          v-if="$isPowerShow('edit')"
          :disabled="scope.data.state == 2 || scope.data.state == 3"
        >
          编辑
        </el-button>
        <el-button type="primary" size="mini" @click="editRowInfo(scope.data, 'detail')">
          查看
        </el-button>
        <el-popconfirm
          @confirm="deleteRowInfo(scope.data)"
          title="确定删除此条记录吗？"
          v-if="$isPowerShow('del')"
        >
          <el-button
            slot="reference"
            type="danger"
            size="mini"
            :disabled="scope.data.state == 2 || scope.data.state == 3"
          >
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
      @save-add-edit-upKeep-plan="saveAddEditUpKeepPlan"
    ></information-dialog>

    <file-dialog
      :dialogBool.sync="filedialogVisible"
      :fileData="FileData"
      :typeMessage="'同名车牌'"
      @on-submit-excel="onSubmitExcel"
    ></file-dialog>

    <custom-setting
      :dialogBool.sync="customSettingVialogVisible"
      :customSettingList="customSettingList"
      :canRendererTableHeader="canRendererTableHeader"
      :customSettingShowList="customSettingShowList"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    ></custom-setting>

    <drawer-dialog :drawer.sync="drawerdialogVisible" @on-ok="onSubmit"></drawer-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import informationDialog from "./component/information-dialog";
import drawerDialog from "./component/drawer-dialog";
import fileDialog from "@/components/fileDialog/file-dialog.vue";

export default {
  name: "maintenance-schedule",
  components: {
    subReq,
    informationDialog,
    drawerDialog,
    fileDialog,
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      FileData: {
        url: window.newHttpConfig.URL_EASYMOCK +  "/Files/TempFiles/保养计划导入模板.xlsx",
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
          label: "自编号",
          prop: "v_num",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "车牌号",
          prop: "lp_num",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "所属组织",
          prop: "group_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "登记证书日期",
          prop: "reg_date",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "车辆型号",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "燃料类型",
          prop: "kind",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "车辆累积里程",
          prop: "total_mile",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "保养周期里程",
          prop: "time_mile",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "里程更新日期",
          prop: "odometer",
          width: "150",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "本次保养类型",
          prop: "upkeep_type_name",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "最近保养日期(一保)",
          prop: "last_keep_time",
          width: "180",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "最近保养日期(二保)",
          prop: "last_keep_time2",
          width: "180",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "本次计划保养日期",
          prop: "plan_date",
          width: "150",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "计划状态",
          prop: "state_name",
          width: "150",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
        {
          id: 15,
          label: "下发人员",
          prop: "send_person",
          width: "150",
          align: "center",
          signIndex: 14,
          sortable: false,
        },
        {
          id: 16,
          label: "下发时间",
          prop: "send_time",
          width: "150",
          align: "center",
          signIndex: 15,
          sortable: false,
        },
        {
          id: 17,
          label: "确认人员",
          prop: "receive_person",
          width: "150",
          align: "center",
          signIndex: 16,
          sortable: false,
        },
        {
          id: 18,
          label: "确认时间",
          prop: "receive_time",
          width: "150",
          align: "center",
          signIndex: 17,
          sortable: false,
        },
        {
          id: 19,
          label: "计划生成情况",
          prop: "create_type",
          width: "150",
          align: "center",
          signIndex: 18,
          sortable: false,
        },
         {
          id: 20,
          label: "计划创建时间",
          prop: "create",
          width: "150",
          align: "center",
          signIndex: 19,
          sortable: false,
        },
        {
          id: 21,
          label: "计划最后修改时间",
          prop: "modify",
          width: "150",
          align: "center",
          signIndex: 20,
          sortable: false,
        },
        {
          id: 22,
          label: "操作",
          prop: "operation",
          width: "280",
          align: "center",
          signIndex: 21,
          sortable: false,
        },
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      filedialogVisible: false,
      upkeepPlanId:[],
      titlesId:'', //当前表头的id
      menu_code:'',
      headerLoading: false
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
      this.headerLoading = true;
      this.$httpTableHeader.reqTableHeader(this.menu_code,this.customSettingList).then(res => {
        this.titlesId = res.titlesId;
        this.canRendererTableHeader = res.canRendererTableHeader;
        this.customSettingList = res.customSettingList;
        this.customSettingShowList = res.customSettingShowList;
        this.$forceUpdate();
        setTimeout(() =>{
          this.headerLoading = false;
        },600)
      }).catch(err => {
        setTimeout(() =>{
          this.headerLoading = false;
        },600)
      })
    },
    // 跳转到车辆信息管理
    vehicle_name(lp_num) {
       this.$router.push({
        name:'vehinfo-manage',
        params:{
          numberId: lp_num
        }
      })
    },

    onSubmit(form) {
      this.form = Object.assign(this.form, form);
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      // console.log(this.form);
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.getUpkeepPlan(params)
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
    // 编辑、添加保养计划
    saveAddEditUpKeepPlan(form) {
      let successrMessage = "";
      let parmas = {context:form};
      if (this.curSelecedType == "add") {
        delete parmas.context.id;
        successrMessage = "添加成功";
      } else {
        successrMessage = "编辑成功";
      }

      this.$client
        .setUpKeepPlan(parmas)
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
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    openAddVemodelPage(type) {
      this.curSelecedType = type;
      switch (type) {
        case "setting":
          this.$router.push({
            name:'maintenance-rules-setting',
            params:{
              ruleType:"second"
            }
          })
          break;
        case "add":
            this.informationDialogTitle = "添加保养计划详情";
            this.informationDialogShow = true;
            break;
        case "issue":  //批量下发
            if(this.upkeepPlanId.length > 0) {
              let isCanIssue = true;
              this.upkeepPlanId.forEach(id => {
                this.data.forEach((item,index) => {
                  if(item.id == id) {
                    if(item.state == 2 || item.state == 3) {
                      isCanIssue = false
                    }
                  }
                });
              });
              if(!isCanIssue) {
                this.$message({
                  message: '不能勾选已下发或者已确认的保养计划',
                  type: 'warning'
                });
                return
              }
              this.issueRowInfo({state: 4});
            }else{
              this.$message({
                  message: '请勾选保养计划',

                  type: 'warning'
                });
            }
          break;
        case "import":
          this.filedialogVisible = true;
          break;
        case "export":
          this.exportExcel();
          break;

        default:
          break;
      }
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

    selectedUpkeepPlanList(upkeepPlanList) {
      this.upkeepPlanId = [];
      upkeepPlanList.forEach((item,index) => {
        this.upkeepPlanId.push(item.id)
      });
      console.log(JSON.stringify(this.upkeepPlanId))
    },
    // 导入
    onSubmitExcel(exportInfo) {
      let formData = new FormData();
      formData.append("file", exportInfo.file);
      formData.append("type", exportInfo.radio);

      let params = formData;
      // console.log(params)
      this.$client.ImportUpKeepPlan(params)
      .then(res => {
        if(res.head.result == "200") {
          this.form = {};
          this.pageInfo.pageIndex = 1;
          this.pageInfo.pageCount = 0;
          this.loadData();
          this.filedialogVisible = false;
          this.$message({ message: res.head.describle, type: "success" });
        }else if(res.head.result == "205") {
          this.filedialogVisible = false;
          if(!!res.context && res.context.length > 0) {
            let errorData = [];
            let list = [];
            if(res.context.length > 20) {
              list = res.context.slice(0, 20);
            }else{
              list = res.context
            }
            let h = this.$createElement;
            list.forEach(element => {
              errorData.push(h('p',null,element));
            });
            this.$msgbox({
              title: `导入错误提示(共${list.length}条)`,
              message: h('div',null, errorData),
              confirmButtonText: '确定',
            })
          }
        } else{
          this.filedialogVisible = false;
          // let errorData = [];
          // const h = this.$createElement;
          // errorData.push(h('p',null,res.head.describle));
          // this.$msgbox({
          //   title: '提示',
          //   message: h('div',null, errorData),
          //   confirmButtonText: '确定',
          // })

          this.$message({ message: res.head.describle, type: "error" });
        }
      })
    },
    // 导出Excel 文件
    exportExcel(){
      let params = Object.assign({}, this.form);
      let ids = [ ...this.upkeepPlanId ]
      if (ids.length) {
        params.ids = ids.toString()
      }
      this.$client.ExportUpKeepPlan(params).then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })
    },

    //下发，退回
    issueRowInfo(form) {
      let parmas = {
        context: []
      };
      if(form.state == 4) {
        parmas.context = this.upkeepPlanId;
      }else{
        parmas.context[0] = form.id
      }
      // alert(JSON.stringify(parmas))
      // return
      // 状态;0未下发1下发退回2已下发 3已确认 (state == 4 是批量下发前端自己做的标记)
      if(form.state == 2 || form.state == 3) {
        // 退回
        this.$client.BackPlanUpKeepPlan(parmas).then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.$message({
              showClose: true,
              message: res.head.describle,
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
      }else{
        // 下发
        this.$client.allotUpkeepPlan(parmas).then((res) => {
          if (res.head.result == "200") {
            if(!form) {
              this.upkeepPlanId = [];
            }
            this.loadData();
            this.$message({
              showClose: true,
              message: res.head.describle,
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
    // 编辑 、查看详情
    editRowInfo(form,type) {
      // console.log(form);
      this.curSelecedType = type;
      this.informationDialogShow = true;
      setTimeout(() => {
        for (const key in this.$refs.informationDialog.form) {
          if (Object.hasOwnProperty.call(form, key)) {
            this.$refs.informationDialog.form[key] = form[key];
          }
        }
        this.$refs.informationDialog.form.upkeep_type = form.upkeep_type
        this.$refs.informationDialog.form.plan_date = form.plan_date
        if(!this.$refs.informationDialog.form.odometer) {
          this.$refs.informationDialog.reqCurTimeDate();
        }
      },200)

      this.informationDialogTitle = `${type == 'edit'? '编辑保养计划详情':'保养计划详情'}`;
    },
    // 删除
    deleteRowInfo(info) {
      let params = {
        context: [info.id]
      };
      this.$client.deleteUpkeepPlan(params)
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
.maintenance-schedule {
  width: 100%;
  height: 100%;
}
</style>

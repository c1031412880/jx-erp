<template>
  <div class="tyre-maintain">
    <sub-req
      ref="head"
      @on-add="openAddJobPage"
      @on-ok="onSubmit"
      @is-check="isCheck"
      @delete-select="deleteSelect"
      @on-btn-export="exportFile"
    ></sub-req>
    <tr-table
      ref="table"
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
    <!-- <template slot-scope="scope" slot="state">
      <span>{{checkrefShow(scope.data.state)}}</span>
    </template> -->
    <template slot-scope="scope" slot="state_name">
      <span :style="`color: ${scope.data.state === 0? '#F59A23':scope.data.state === 1? '#02A7F0':'#D9001b'}`">{{scope.data.state_name}}</span>
    </template>
    <template slot-scope="scope" slot="operation">
        <el-button type="primary" size="mini" @click="editRowInfo(scope.data,'edit')" :disabled="scope.data.state === 1" v-if="$isPowerShow('edit')">编辑</el-button>
        <el-button type="primary" size="mini" @click="checkStatus(scope.data)">{{scope.data.state !== 1?'审核':'反审核'}}</el-button>
        <el-button type="primary" size="mini" @click="editRowInfo(scope.data,'detail')">查看</el-button>
        <!-- <el-popconfirm
          v-if="$isPowerShow('del')"
          @confirm="deleteRowInfo(scope.data)"
          title="确定删除此条记录吗？">
          <el-button slot="reference" type="danger" size="mini" style="margin-left: 10px;">删除</el-button>
        </el-popconfirm> -->
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
      @save-add-edit="saveAddEdit"
    ></information-dialog>

    <!-- 审核弹窗 -->
    <audit-dialog
      ref="auditDialog"
      :showAuditTitle="showAuditTitle"
      :dialogBool.sync="auditDialogShow"
      @sure-submit-audit="sureSubmitAudit"
    ></audit-dialog>

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
import auditDialog from './component/audit-dialog'
export default {
  name: "tyre-maintain",
  components: {
    subReq,
    informationDialog,
    auditDialog
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
          label: "轮胎编号",
          prop: "tyre_number",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "车辆自编号",
          prop: "vehicle_number",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "车牌号",
          prop: "vehicle_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "所属组织",
          prop: "department",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "轮胎品牌",
          prop: "brand",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "轮胎型号",
          prop: "tyre_model_name",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "轮胎损坏情况",
          prop: "fail_describe",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "日期",
          prop: "date",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        {
          id: 9,
          label: "轮胎里程",
          prop: "mileage",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: true,
        },
        {
          id: 10,
          label: "位置",
          prop: "position_name",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "更换场站",
          prop: "replace_station",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "处理方式",
          prop: "treatment_method_name",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "提交人",
          prop: "created_name",
          width: "130",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
        {
          id: 15,
          label: "提交时间",
          prop: "created_time",
          width: "130",
          align: "center",
          signIndex: 14,
          sortable: true,
        },
        {
          id: 16,
          label: "审核状态",
          prop: "state_name",
          width: "130",
          align: "center",
          signIndex: 15,
          sortable: false,
        },
        {
          id: 17,
          label: "审核人",
          prop: "audit_user_name",
          width: "130",
          align: "center",
          signIndex: 16,
          sortable: false,
        },
        {
          id: 18,
          label: "审核时间",
          prop: "audit_time",
          width: "130",
          align: "center",
          signIndex: 17,
          sortable: true,
        },
        {
          id: 19,
          label: "审核备注",
          prop: "audit_remark",
          width: "130",
          align: "center",
          signIndex: 18,
          sortable: false,
        },
        {
          id: 20,
          label: "操作",
          prop: "operation",
          width: "290",
          align: "center",
          signIndex: 19,
          sortable: false,
        },
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      filedialogVisible: false,
      tyreFailIds:[],
      auditDialogShow: false,
      showAuditTitle:'',
      curCheckType: '', //当前审核类型
    };
  },
  mounted() {
    // this.loadData();
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
      this.form = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      console.log(this.form);
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.getTyreFailByPage(params)
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

    checkrefShow(state) {
      let showText = '';
      switch (state) {
        case 0:
          showText = '未审核';
          break;
        case 1:
          showText = '成功';
          break;
        case 2:
          showText = '失败';
          break;
      }
      return showText
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
        .AddTyreFailModel(parmas)
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
      if(this.tyreFailIds.length == 0) {
        this.$message({
          showClose: true,
          message: '请勾选要删除的轮胎审核、翻新、修补',
          type: "warning",
        });
        return
      }
      let isCanDel = true;
      if(this.tyreFailIds.length > 0) {
        try {
          this.data.forEach(item => {
            if(item.state === 1 && this.tyreFailIds.indexOf(item.id) > -1) {
              throw new Error('end')
            }
          });
        } catch (err) {
          isCanDel = false
        }
        if(!isCanDel) {
          this.$message({
            showClose: true,
            message: '已经审核通过的记录无法删除',
            type: "warning",
          });
          return
        }
      }
      this.deleteRowInfo(null);
    },

    // 导出Excel
    exportFile(){
      let params = Object.assign({}, this.form);
      this.$client.exportTyreFailModel(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })

    },

    // 审核 、反审核  type: 1审核 2反审核
    isCheck(type) {
      this.curCheckType = type;
      switch (type) {
        case 1:
          this.forwardAudit();
          break;
        case 2:
          this.reverseAudit();
          break;
      }
    },
    // 正向审核
    forwardAudit() {
      let isCanAudit = true; //是否可以审核
      if(this.tyreFailIds.length == 0) {
        this.$message({
          showClose: true,
          message: '请勾选至少一条要审核的轮胎',
          type: "warning",
        });
        return
      }
      this.tyreFailIds.forEach(id => {
        this.data.forEach(item => {
          if(id == item.id) {
            if(item.state === 1) {
              isCanAudit = false;
              return
            }
          }
        });
      });
      if(!isCanAudit) {
        this.$message({
          showClose: true,
          message: '只有未审核的轮胎才能审核',
          type: "warning",
        });
        return
      }
      this.auditDialogShow = true;
      this.showAuditTitle = `批量审核(当前选中个数：${this.tyreFailIds.length})`
    },
    //反向审核
    reverseAudit() {
      let isCanAudit = true; //是否可以审核
      if(this.tyreFailIds.length == 0) {
        this.$message({
          showClose: true,
          message: '请勾选至少一条要反审核的轮胎',
          type: "warning",
        });
        return
      }
      this.tyreFailIds.forEach(id => {
        this.data.forEach(item => {
          if(id == item.id) {
            if(item.state !== 1) {
              isCanAudit = false;
              return
            }
          }
        });
      });
      if(!isCanAudit) {
        this.$message({
          showClose: true,
          message: '只有已审核的轮胎才能反审核',
          type: "warning",
        });
        return
      }
      this.auditDialogShow = true;
      this.showAuditTitle = `批量反审核(当前选中个数：${this.tyreFailIds.length})`
    },
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    openAddJobPage(type) {
      this.curSelecedType = type;
      this.informationDialogTitle = "添加轮胎审核、翻新、修补";
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
    // 勾选记录
    selectedUpkeepPlanList(tyreFailList) {
      this.tyreFailIds = [];
      tyreFailList.forEach((item,index) => {
        this.tyreFailIds.push(item.id)
      });
      // console.log(JSON.stringify(this.tyreFailIds))
    },

    // 编辑
    editRowInfo(form,type) {
      this.curSelecedType = type;
      for (const key in this.$refs.informationDialog.form) {
        if (Object.hasOwnProperty.call(form, key)) {
          this.$refs.informationDialog.form[key] = form[key];
        }
      }
      if(form.img_paths && form.img_paths.length > 0) {
        form.img_paths.forEach((item,index) => {
          this.$refs.informationDialog.form.ImgPaths.push(item.img_path)
          this.$refs.informationDialog.picturePathList.push(item.img_path)
          let Obj = {
            id: index +1,
            image_path: item.img_path,
            isStore: false, // 是否存储到数据表里   如果只是新增图片，则isStore 为 false
          };
          this.$refs.informationDialog.tyreMaintainData.push(Obj)
        });
      }
      if(type == 'edit') {
        this.informationDialogTitle = "编辑轮胎审核、翻新、修补";
      }else{
        this.informationDialogTitle = "轮胎审核、翻新、修补详情";
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
        params.context = this.tyreFailIds
      }
      this.$client.deleteTyreFailModel(params)
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
    checkStatus(row) {
      this.tyreFailIds = [];
        // 清除勾选
      this.$refs.table.handleSelectionChange([]);
      this.tyreFailIds.push(row.id);
      if(row.state !== 1) {
        this.showAuditTitle = `审核(轮胎编号：${row.tyre_number || '暂无'})`
        this.curCheckType = 1
      }else{
        this.showAuditTitle = `反审核(轮胎编号：${row.tyre_number || '暂无'})`
        this.curCheckType = 2
      }
      this.auditDialogShow = true
    },
    // 批量提交审核
    sureSubmitAudit(info) {
      let parmas = {
        context: {
          type: this.curCheckType,
          audit_remark: info.audit_remark,
          ids: this.tyreFailIds
        }
      };

      this.$client.checkTyreFail(parmas)
      .then(res => {
        if(res.head.result == '200') {
          this.loadData();
          this.auditDialogShow = false;
          this.tyreFailIds = [];
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success",
          });
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
          this.auditDialogShow = false;
          this.tyreFailIds = [];
        }

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
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH;
      }, 60);
    },
  },
  watch:{
    auditDialogShow() {
      if(!this.auditDialogShow) {
        this.tyreFailIds = [];
        // 清除勾选
        this.$refs.table.handleSelectionChange([]);
      }
    },
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.tyre-maintain {
  width: 100%;
  height: 100%;
}
</style>

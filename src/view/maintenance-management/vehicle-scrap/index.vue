<template>
  <div class="vehicle-scrap">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane el-tab-pane :label="`待报废(${firstVehicleData.length})`" name="first">
         <sub-req
          ref="head"
          :firstVehicleData="firstVehicleData"
          @on-ok="onSubmit"
          @on-batch-set="onBatchSetShow"
          @on-add-scrap="onAddScrap"
          @on-batch-scrap="onBatchScrap"
          @on-export="exportExcel"
        ></sub-req>
        <tr-table
          ref="trTable"
          :selectionShow="true"
          :data="dataMap[this.activeName]"
          :tableHeaderList="canRendererTableHeader"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="backFixedNum"
          @on-select-change-row="selectChange"
        > 
          <!-- 1未发起处理2处理中3处理完成4已驳回5已撤回 -->
          <template slot-scope="scope" slot="operation">
            <el-button type="primary" size="mini" @click="submitExamineShow(scope.data)" v-if="$isPowerShow('submit')" :disabled="scope.data.state == 2 || scope.data.state == 3">报废提交</el-button>
           <el-button type="primary" size="mini" @click="examineDialogShow(scope.data)" v-if="scope.data.state != 1">查看</el-button>
            <el-popconfirm @confirm="deleteScrapVehicle(scope.data)" title="是否确删除此条记录？" v-if="$isPowerShow('del')">
              <el-button slot="reference" type="danger" size="mini" style="margin-left: 10px;" :disabled="scope.data.state == 2 || scope.data.state == 3">删除</el-button>
            </el-popconfirm>
          </template>
        </tr-table>
      </el-tab-pane>
      <el-tab-pane label="已报废" name="second">
        <second-sub-req
          ref="secondHead"
          :activeName="activeName"
          :secondVehicleData="secondVehicleData"
          @on-ok="onSubmit"
          @on-export="exportExcel"
        ></second-sub-req>
        <tr-table
          :selectionShow="false"
          :data="dataMap[this.activeName]"
          :tableHeaderList="secondCanRendererTableHeader"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="backFixedNum"
          @on-select-change-row="selectChange"
        >
          <template slot-scope="scope" slot="operation">
            <el-button type="primary" size="mini" @click="examineDialogShow(scope.data)" v-if="!!scope.data.flow_id">查看</el-button>
          </template>
        </tr-table>
      </el-tab-pane>
    </el-tabs>

    <batch-set-dialog
      :dialogBool.sync="batchSetDialog"
      ref="batchSetDialog"
      :curSelecedType="curSelecedType"
      @save-add-edit="batchSetDialogOk"
    ></batch-set-dialog>

    <add-scrap-vehicle
      :dialogBool.sync="addScrapVehicleDialog"
      ref="addScrapVehicle"
      @on-ok="addScrapVehicleOk"
    ></add-scrap-vehicle>
    
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import secondSubReq from "./component/second-sub-req";

import batchSetDialog from './component/batch-set-dialog'
import addScrapVehicle from './component/add-scrap-vehicle'
export default {
  name: "vehicle-scrap",
  components: {
    subReq,
    secondSubReq,
    batchSetDialog,
    addScrapVehicle
  },
  data() {
    return {
      activeName: 'first',
      selectList: [],
      examineDialog: false,
      batchSetDialog:false,
      form: {
        'first': {},
        'second': {}
      },
      dataMap:{
        'first': [],
        'second': []
      },
      loading: false,
      TableHeight: 500,
      informationDialogShow: false,
      curSelecedType: "add",
      informationDialogTitle: "添加",
      customSettingList: [
        {
          id: 1,
          label: "自编号",
          prop: "v_num",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "车牌号",
          prop: "lp_num",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "所属组织",
          prop: "group",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "登记证书日期",
          prop: "reg_date",
          width: "150",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "车龄",
          prop: "vheicle_age",
          width: "150",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        
        {
          id: 6,
          label: "车辆型号",
          prop: "name",
          width: "150",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "燃料类别",
          prop: "fuel_name",
          width: "150",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "当前状态",
          prop: "check_state_name",
          width: "150",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        {
          id: 9,
          label: "报废日期",
          prop: "dis_date",
          width: "150",
          align: "center",
          signIndex: 8,
          sortable: true,
        },
        {
          id: 10,
          label: "报废原因",
          prop: "reason",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "流程状态",
          prop: "state_name",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "流程发起人",
          prop: "created_name",
          width: "150",
          align: "center",
          signIndex: 11,
          sortable: true,
        },
        {
          id: 13,
          label: "流程发起时间",
          prop: "created_date",
          width: "150",
          align: "center",
          signIndex: 12,
          sortable: true,
        },
        {
          id: 14,
          label: "流程完成时间",
          prop: "finish_date",
          width: "150",
          align: "center",
          signIndex: 13,
          sortable: true,
        },
        {
          id: 15,
          label: "操作",
          prop: "operation",
          width: "260",
          align: "center",
          signIndex: 14,
          sortable: false,
        }
      ],
      frontFixedNum: 2, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      secondCanRendererTableHeader:[
        {
          id: 1,
          label: "自编号",
          prop: "v_num",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "车牌号",
          prop: "lp_num",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "所属组织",
          prop: "group",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "登记证书日期",
          prop: "reg_date",
          width: "150",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "车龄",
          prop: "vheicle_age",
          width: "150",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        
        {
          id: 6,
          label: "车辆型号",
          prop: "name",
          width: "150",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "燃料类别",
          prop: "fuel_name",
          width: "150",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "当前状态",
          prop: "check_state_name",
          width: "150",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        {
          id: 9,
          label: "报废日期",
          prop: "dis_date",
          width: "150",
          align: "center",
          signIndex: 8,
          sortable: true,
        },
        {
          id: 10,
          label: "报废原因",
          prop: "reason",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "流程状态",
          prop: "state_name",
          width: "150",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "流程发起人",
          prop: "created_name",
          width: "150",
          align: "center",
          signIndex: 11,
          sortable: true,
        },
        {
          id: 13,
          label: "流程发起时间",
          prop: "created_date",
          width: "150",
          align: "center",
          signIndex: 12,
          sortable: true,
        },
        {
          id: 14,
          label: "流程完成时间",
          prop: "finish_date",
          width: "150",
          align: "center",
          signIndex: 13,
          sortable: true,
        },
        {
          id: 15,
          label: "报废方式",
          prop: "scrap_type",
          width: "110",
          align: "center",
          signIndex: 14,
          sortable: false,
        },
        {
          id: 16,
          label: "操作",
          prop: "operation",
          width: "110",
          align: "center",
          signIndex: 15,
          sortable: false,
        },
      ],
      addScrapVehicleDialog: false,
      isFirstEnter: true,
      isSecondtEnter: true,
      firstVehicleData:[],
      secondVehicleData:[],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
      // 审批后更新表格
      eventOn.$on('update-upcoming-vehicle-scrap', () => {
        this.loadData()
      })
    });
  },
  methods: {
    handleClick(tab, event) {
      this.setHead();
      // console.log(tab, event);
      if(tab.name == "second") {
        this.$refs.secondHead.onSubmit()
      }else{
        this.$refs.head.onSubmit()
      }
      this.selectList = []
      this.$refs.trTable.toggleSelection(null)
    },

    onSubmit(form) {
      this.form[this.activeName] = form;
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let content = this.form[this.activeName];
      this.$client.GetDiscarPlanDiscardPlan(content).then(req => {
        this.loading = false;
        if (req.head.result === "200") {
          this.dataMap[this.activeName] = req.context.list;
          this.reqToBeScrappedInfo(this.form[this.activeName].check_state);
          // if(this.isFirstEnter && this.activeName == 'first') {
          //   this.firstVehicleData = req.context.list;
          //   this.isFirstEnter = false
          // }

          // if(this.isSecondtEnter && this.activeName == 'second') {
          //   this.secondVehicleData = req.context.list;
          //   this.isSecondtEnter = false
          // }
        } else {
          this.dataMap[this.activeName] = [];
        }
      })
    },

    selectChange(list) {
      this.selectList = list
      // console.log(list)
    },
    // 提交审核初始化
    submitExamineShow(item) {
      this.$refs.batchSetDialog.titleType = 'single'
      this.curSelecedType = 'add'
      this.batchSetDialog = true
      this.$refs.batchSetDialog.form.ids = [item.id]
      this.$refs.batchSetDialog.vehicleNames = item.lp_num
      // this.submitExamineDialog = true
    },
    // 提交报废数据
    submitExamineDialogOk(form) {
      this.$client.SubmitVoucherDiscardPlan(form).then(req => {
        this.submitExamineDialog = false
        this.loadData()
        if (req.head.result === "200") {
          this.$message.success(req.head.describle);
        } else {
          this.$message.error(req.head.describle);
        }
      })
    },
    // 查看
    examineDialogShow(info) {
       this.$router.push({
        path: `/news-details/${info.flow_id}/车辆报废审批详情/110`,
        params: {id: info.flow_id, model: 110}
      })
    },

    // 审核提交
    examineDialogOk(form) {
      this.$client.checkRecordDiscardPlan(form).then(req => {
        this.examineDialog = false
        this.loadData()
        if (req.head.result === "200") {
          this.$message.success(req.head.describle);
        } else {
          this.$message.error(req.head.describle);
        }
      })
    },
    // 删除报废记录
    deleteScrapVehicle(item) {
       let parmas = {
        context: [item.id]
      };
      this.$client.DeleteDiscardPlan(parmas).then(res => {
        if (res.head.result == "200") {
          if(this.$refs.head.form.vehicle_id == item.vehicle_id) {
            this.$refs.head.form.vehicle_id  = ''
          }
          this.$refs.head.onSubmit()
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success"
          });
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success"
          });
        }
      });
    },

    // 导出
    exportExcel() {
      let params = Object.assign({}, this.form[this.activeName])
      if(!!this.selectList && this.selectList.length) {
        params.ids = (this.selectList.map(item => {return item.id})).join(',')
      }
      this.$client.ExportDiscardPlan(params).then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.selectList = []
          this.$refs.trTable.toggleSelection(null)
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message : res.head.describle})
        }
      })
    },

    // 生成待报废车辆
    onBatchSetShow() {
     this.$client.BuildPlansDiscardPlan().then(res => {
        if(res.head.result == '200') {
          this.loadData()
          this.$message({type: 'success', message: '已重新根据报废规则生成'})
        }else{
          this.$message({type: 'error', message : res.head.describle})
        }
      })
    },
    // 添加待报废车辆
    onAddScrap() {
      this.addScrapVehicleDialog = true
    },
    // 批量报废申请
    onBatchScrap() {
      let isCanApplay = true;
      if(this.selectList.length === 0) {
        this.$message({type: 'warning', message: '请勾选待报废的车辆记录'})
        return
      }
      if(this.selectList.length > 0) {
        this.selectList.forEach(item => {
          if(item.state == 2) {
            isCanApplay = false
          }
        })
      }
      if(!isCanApplay) {
        this.$message({type: 'warning', message: '已在审批中报废事项的不能再次发起报废申请'})
        return
      }
      this.curSelecedType = 'add'
      this.$refs.batchSetDialog.titleType = 'batch'
      this.batchSetDialog = true
      this.$refs.batchSetDialog.form.ids = this.selectList.map(item => {
        return item.id
      })
      this.$refs.batchSetDialog.vehicleNames = this.selectList.map(item => {
        return item.lp_num
      }).join(',')
    },


    // 批量报废提交申请
    batchSetDialogOk(form, approveStepList) {
     if(approveStepList.length > 0) {
        let params = {
          context: approveStepList
        }
        this.$client.StartFlowRecord(params).then(res => {
          if(res.head.result == '200') {
            form.flow_id = res.context.id
            form.flow_code = res.context.code
            if(!!form.flow_id && !!form.flow_code) {
              this.canSubmitInfo(form);
            }
          }else{
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
      }else{
        delete form.flow_id
        delete form.flow_code
        this.canSubmitInfo(form);
      }
    },
    // 提交
    canSubmitInfo(form) {
      let params = {
        context: form
      };
      this.$client.SubmitRecordDiscardPlan(params).then(res => {
        if (res.head.result == "200") {
          this.loadData();
          this.batchSetDialog = false;
          this.$message({
            showClose: true,
            type: "success",
            message: "保存成功"
          });
        } else {
          this.$message({
            showClose: true,
            type: "error",
            message: res.head.describle
          });
        }
      });
    },
    // 确定添加待报废车辆
    addScrapVehicleOk(ids) {
      // console.log(ids)
       let parmas = {
        context: ids
      };
      this.$client.AddDiscardPlan(parmas).then(res => {
        if (res.head.result == "200") {
          this.loadData();
          this.addScrapVehicleDialog = false
          this.$message({
            showClose: true,
            message: '添加成功',
            type: "success"
          });
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error"
          });
        }
      });
    },
    // 重新获取报废信息
    reqToBeScrappedInfo(check_state) {
       let content = {
         check_state: check_state
       }
       this.$client.GetDiscarPlanDiscardPlan(content).then(req => {
        this.loading = false;
        if (req.head.result === "200") {
            if(check_state === 0) {
              this.firstVehicleData = req.context.list;
            }
            if(check_state === 1) {
              this.secondVehicleData = req.context.list;
            }
        }
      })
    },
    // 计算表格高度 和初始化表头
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = 0
        if(this.activeName == 'first') {
           th = this.$refs.head.$el.offsetHeight;
        }
        if(this.activeName == 'second') {
          th = this.$refs.secondHead.$el.offsetHeight;
        }
        this.TableHeight = maxh - th  - 60; 
      }, 60);
    },
  },
  watch:{
    batchSetDialog() {
      if(!this.batchSetDialog) {
        this.selectList = []
        this.$refs.trTable.toggleSelection(null)
      }
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.vehicle-scrap {
  width: 100%;
  height: 100%;
}

.vehicle-scrap /deep/ .el-tabs__item {
  width: 160px;
  text-align: center;
}

.vehicle-scrap /deep/ .el-tabs__nav-wrap::after {
  height: 0px;
}

</style>

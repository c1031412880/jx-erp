<template>
  <div class="repair-time-details">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-check="onCheckData"
      @on-btn-export="exportFile"
      @open-setting-page="openSettingPageEvent"
    ></sub-req>
    <tr-vxe-table
      ref="trVxeTable"
      :selectionShow="false"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      :mergeCells="mergeCells"
    >
      <template slot-scope="scope" slot="total_hours">
        <el-input v-model="scope.data.total_hours" v-if="scope.data.isEdit == true"></el-input>
        <span v-else>{{ scope.data.total_hours }}</span>
      </template>
      <template slot-scope="scope" slot="hour">
        <span v-show="scope.data.repair_person !== '合计'" :style="{'color': scope.data.is_red ? 'red' : ''}">{{ scope.data.hour }}</span>
      </template>
      <template slot-scope="scope" slot="is_check">
        <span v-show="scope.data.repair_person !== '合计'">{{ scope.data.is_check ? '已审核' : '未审核' }}</span>
      </template>
      <template slot-scope="scope" slot="work_code">
        <el-button type="text" @click="openServerInfo(scope.data)">
          {{ scope.data.work_code }}
        </el-button>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button @click="checkRowInfo([scope.data.id], 'check')" type="primary" size="mini" v-show="scope.data.repair_person !== '合计' && !scope.data.is_check">审核</el-button>
        <el-button @click="checkRowInfo([scope.data.id], 'recheck')" type="primary" size="mini" v-show="scope.data.repair_person !== '合计' && scope.data.is_check">反审核</el-button>
        <el-button @click="editRowHourInfo(scope.data, scope)" type="primary" size="mini" v-show="scope.data.repair_person !== '合计'">{{!!scope.data.isEdit ? '保存工时' : '编辑工时'}}</el-button>
      </template>
    </tr-vxe-table>
    <custom-setting
      :dialogBool.sync="customSettingVialogVisible"
      :customSettingList="customSettingList"
      :canRendererTableHeader="canRendererTableHeader"
      :customSettingShowList="customSettingShowList"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    ></custom-setting>
    <!-- 添加普通员工、驾驶员信息 -->
    <add-staff-dialog
      ref="addStaffDialog"
      :dialogBool.sync="addStaffDialogShow"
      :showCollapse="showCollapse"
      :curChangeType="curChangeType"
    ></add-staff-dialog>
    <el-dialog :visible="warehouseLeaveShow" fullscreen :before-close="handleClose">
      <warehouse-leave ref="warehouseLeave"></warehouse-leave>
      <span slot="footer" class="dialog-footer">
        <el-button @click="warehouseLeaveShow = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import warehouseLeave from "./component/warehouse-leave";
import addStaffDialog from '../../maintenance-management/workorder-management/component/dialog/add-staff-dialog.vue'
export default {
  name: 'repair-time-details',
  components: {
    subReq,
    warehouseLeave,
    addStaffDialog
  },
  data() {
    return {
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      frontFixedNum: 0, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      customSettingVialogVisible: false,
      warehouseLeaveShow:false,
      addStaffDialogShow: false, //添加员工信息
      showCollapse: 'first',
      curChangeType: 'detail', //add添加  edit编辑  detail详情
      mergeCells: [],
      customSettingList: [
        {
          id: 1,
          label: "状态",
          prop: "is_check",
          width: "120",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "自编号",
          prop: "vehicle_number",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "车牌号",
          prop: "vehicle_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "所属组织",
          prop: "group_name",
          width: "150",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "维修项目",
          prop: "repair_item",
          width: "150",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "维修工",
          prop: "repair_person",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "工时",
          prop: "hour",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "总工时",
          prop: "total_hours",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        {
          id: 9,
          label: "接修时间",
          prop: "receive_time",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: true,
        },
        {
          id: 10,
          label: "完工时间",
          prop: "finish_time",
          width: "160",
          align: "center",
          signIndex: 9,
          sortable: true,
        },
        {
          id: 11,
          label: "维修车间",
          prop: "repair_shop",
          width: "160",
          align: "center",
          signIndex: 10,
          sortable: true,
        },
        {
          id: 12,
          label: "维修工单号",
          prop: "work_code",
          width: "150",
          align: "center",
          signIndex: 11,
          sortable: true,
        },
        {
          id: 13,
          label: "操作",
          prop: "operation",
          width: "200",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
      ]
    }
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
      this.$httpTableHeader.reqTableHeader(this.menu_code,this.customSettingList).then(res => {
        console.log('title', res)
        this.titlesId = res.titlesId;
        this.canRendererTableHeader = res.canRendererTableHeader;
        this.customSettingList = res.customSettingList;
        this.customSettingShowList = res.customSettingShowList;
        this.$forceUpdate();
      }).catch(err => {})
    },
    onSubmit(form) {
      this.form = Object.assign({}, form);
      this.loadData();
    },
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      this.$client.GetRepairHourDetailsMaintRepairOrder({context: params})
        .then((res) => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context;
            this.data = this.data.map(item => {
              item.isEdit = false;
              return item;
            })
            this.getMergeCellList();
          } else {
            this.loading = false;
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
    },
    editRowHourInfo(val, data) {
      if(val.isEdit) {
        this.data[data.rowIndex].isEdit = false;
        // 保存工时
        let params = {context: {item_id: val.item_id, total_hours: val.total_hours}};
        this.$client.UpdateItemHoursMaintRepairOrder(params).then(res => {
          if (res.head.result == "200") {
            this.loadData()

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
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        });
      }else {
        this.data[data.rowIndex].isEdit = true;
        // 聚焦input
        this.$nextTick(() => {
          let input = this.$refs.trVxeTable.$el.querySelector('.vxe-table--body .vxe-body--row .vxe-body--column .vxe-input');
          if(input) {
            input.focus();
          }
        });
      }
    },
    // 根据获取的数据生成合并行并排除项目维修工和工时列 
    getMergeCellList() {
      this.mergeCells = [];
      let currentWorkCode = null;
      let startIndex = 0;

      this.data.forEach((item, index) => {
        if (item.work_code !== currentWorkCode) {
          if (currentWorkCode !== null) {
            this.canRendererTableHeader.forEach((header, headerIndex) => {
              if (header.prop !== 'repair_item' && header.prop !== 'hour' && header.prop !== 'repair_person') {
                this.mergeCells.push({
                  row: startIndex,
                  col: headerIndex + 1,
                  rowspan: index - startIndex,
                  colspan: 1,
                });
              }
            });
          }
          currentWorkCode = item.work_code;
          startIndex = index;
        }
      });

      // Handle the last group
      if (currentWorkCode !== null) {
        this.canRendererTableHeader.forEach((header, headerIndex) => {
          if (header.prop !== 'repair_item' && header.prop !== 'hour' && header.prop !== 'repair_person') {
            this.mergeCells.push({
              row: startIndex,
              col: headerIndex + 1,
              rowspan: this.data.length - startIndex,
              colspan: 1,
            });
          }
        });
      }
    },
    // 批量审核
    onCheckData(val) {
      // 获取审核或反审核数据id
      const checkData = this.data.filter(item => {
        if (val === 'check') {
          return !item.is_check;
        } else if (val === 'recheck') {
          return item.is_check;
        }
        return false;
      }).map(item => item.id);
      this.checkRowInfo(checkData, val)
    },
    // 审核、反审核
    checkRowInfo(val, type) {
      let obj = {
        'check': 'CheckDetailRepairOrder',
        'recheck': 'BackCheckDetailRepairOrder'
      }
      let params = {
        context: val
      }
      this.$client[obj[type]](params).then((res) => {
        if (res.head.result == "200") {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success",
          });
          this.loadData();
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 导出Excel
    exportFile() {
      let params = Object.assign({}, this.form);
      this.$client.ExportRepairDetailMaintRepairOrder({context: params}).then((res) => {
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
    //关闭弹窗
    handleClose() {
      this.warehouseLeaveShow=false
    },
     // 打开工单详情
    openServerInfo(data) {
      let params = {
        work_code: data.work_code
      }
      params.page_index = 1;
      params.page_size = 1;
      this.$client.getrOrderList(params).then(res => {
        if (res.head.result === "200") {
          let data = res.context.list;
          this.addStaffDialogShow = true
          this.curChangeType = 'detail'
          this.$refs['addStaffDialog'].setData(data[0])
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error"
          });
        }
      });

    },
    // 打开表头设置
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        this.TableHeight = maxh - th;
        // console.log(maxh);
      }, 60);
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.repair-time-details {
  height: 100%
  width: 100%
}
</style>

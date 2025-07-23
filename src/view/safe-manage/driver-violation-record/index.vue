<template>
  <div class="accident-manage">
    <div class="accident-manage-content">
      <sub-req
        ref="head"
        :isCanDelete="isCanDelete"
        @on-add="addInfo"
        @on-ok="onSubmit"
        @on-export="exportFile"
        @on-delete="onDelete"
      ></sub-req>

      <tr-table
        ref="table"
        :selectionShow="true"
        :data="engineData"
        :tableHeaderList="canRendererTableHeader"
        :TableHeight="TableHeight"
        :loading="loading || titleTableLoading"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum"
        @on-select-change-row="selectedList"
      >
        <template slot-scope="scope" slot="driver_name">
          <el-link type="primary" @click="jumpDriverSafetyfileManage(scope.data.driver_name)">
            {{ scope.data.driver_name }}
          </el-link>
        </template>
        <template slot-scope="scope" slot="state">
          <span>{{ showStateText(scope.data) }}</span>
        </template>
        <template slot-scope="scope" slot="service_code">
          <!-- {{scope.data.service_code}} -->
          <span style="color: #409eff; cursor: pointer" @click="openServerInfo(scope.data)">
            {{ scope.data.service_code }}
          </span>
        </template>
        <template slot-scope="scope" slot="cancel_star">
          <!-- {{scope.data.service_code}} -->
          <span>{{ scope.data.cancel_star == 1 ? '是' : '否' }}</span>
        </template>

        <template slot-scope="scope" slot="images">
          <div
            style="width: 150px; height: 80px"
            class="show-flex-box-r show-flex-center"
            v-if="scope.data.images && scope.data.images.length > 0"
          >
            <el-carousel height="80px" width="150px" style="width: 150px">
              <el-carousel-item v-for="(item, index) in scope.data.images" :key="index">
                <el-image
                  style="width: 150px; height: 80px"
                  :src="item.url"
                  :preview-src-list="[item.url]"
                ></el-image>
              </el-carousel-item>
            </el-carousel>
          </div>
          <span v-else style="color: #909399">暂无图片</span>
        </template>
        <template slot-scope="scope" slot="operation">
          <el-button
            type="text"
            size="mini"
            @click="editInfo(scope.data, 'edit')"
            v-if="$isPowerShow('edit')"
            :disabled="scope.data.state == 2 || scope.data.state == 3"
          >
            编辑
          </el-button>
          <el-button type="text" size="mini" @click="editInfo(scope.data, 'detail')">
            查看
          </el-button>
          <el-popconfirm
            @confirm="deleteViolationInfo(scope.data)"
            title="是否确删除此条记录？"
            v-if="$isPowerShow('del')"
          >
            <el-button
              slot="reference"
              type="text"
              size="mini"
              style="margin: 0 10px"
              :disabled="scope.data.state == 2 || scope.data.state == 3"
            >
              删除
            </el-button>
          </el-popconfirm>
          <el-button
            type="text"
            size="mini"
            @click="dealWithInfo(scope.data)"
            v-if="
              $isPowerShow('handle') && scope.data.user_ids && scope.data.user_ids.includes(userId)
            "
          >
            处理
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="cancellation(scope.data)"
            v-if="$isPowerShow('to_void') && scope.data.created_id == userId"
          >
            撤销
          </el-button>
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
    </div>

    <div class="dialog-box">
      <!-- 添加信息 -->
      <add-dialog
        ref="addDialog"
        :dialogBool.sync="addDialogShow"
        :curChangeType="curChangeType"
        @sure-save-info="sureSaveInfo"
      ></add-dialog>

      <!-- 乘客服务投诉详情弹窗 -->
      <information-dialog
        ref="informationDialog"
        :dialogBool.sync="informationDialogShow"
        :curSelecedType="'detail'"
        :title="'乘客投诉记录详情'"
      ></information-dialog>

      <!-- 表格自定义组件 -->
      <custom-setting
        :dialogBool.sync="customSettingVialogVisible"
        :customSettingList="customSettingList"
        :canRendererTableHeader="canRendererTableHeader"
        :customSettingShowList="customSettingShowList"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum"
      ></custom-setting>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import addDialog from "./component/dialog/add-dialog";
import fileDialog from "@/components/fileDialog/file-dialog";
import informationDialog from "../../server-management/passenger-server-management/component/information-dialog.vue";
import { getUser } from "@/utils/auth";

export default {
  name: "driver-violation-record",
  components: {
    subReq,
    addDialog,
    fileDialog,
    informationDialog,
  },
  data() {
    return {
      curChangeType: "add", //add添加  edit编辑  detail详情
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      queryform: {}, //查询表单
      engineData: [], //列表
      loading: false,
      titleTableLoading: false,
      TableHeight: 500,
      addDialogShow: false, //添加信息
      isShowDrawerDialog: false, //是否显示高级筛选
      customSettingVialogVisible: false,
      customSettingList: [
        {
          id: 1,
          label: "自编号",
          prop: "v_num",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: true
        },
        {
          id: 2,
          label: "车牌号",
          prop: "lp_num",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true
        },
        {
          id: 3,
          label: "所属组织",
          prop: "group_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false
        },
        {
          id: 4,
          label: "日期",
          prop: "d_violation_date",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: true
        },
        {
          id: 5,
          label: "驾驶员",
          prop: "driver_name",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: true
        },
        {
          id: 6,
          label: "来源",
          prop: "source_name",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false
        },
        {
          id: 7,
          label: "责任部门",
          prop: "department",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false
        },
        {
          id: 8,
          label: "违规项目",
          prop: "violation_item_name",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: true
        },
        {
          id: 9,
          label: "处罚依据",
          prop: "check_item",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false
        },
        {
          id: 10,
          label: "安全等级",
          prop: "i_leavel",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false
        },
        {
          id: 11,
          label: "加减分数",
          prop: "check_core",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false
        },
        {
          id: 12,
          label: "相关图片",
          prop: "images",
          width: "150",
          align: "center",
          signIndex: 11,
          sortable: false
        },
        {
          id: 13,
          label: "是否取消本季星级考核",
          prop: "cancel_star",
          width: "190",
          align: "center",
          signIndex: 12,
          sortable: false
        },
        {
          id: 14,
          label: "备注",
          prop: "c_remark",
          width: "190",
          align: "center",
          signIndex: 13,
          sortable: false
        },
        {
          id: 15,
          label: "处理流程状态",
          prop: "state",
          width: "150",
          align: "center",
          signIndex: 14,
          sortable: false
        },
        {
          id: 16,
          label: "工单编号",
          prop: "service_code",
          width: "150",
          align: "center",
          signIndex: 15,
          sortable: false
        },
        {
          id: 17,
          label: "操作",
          prop: "operation",
          width: "220",
          align: "center",
          signIndex: 16,
          sortable: false
        }
      ],
      // detailLoading: false,
      frontFixedNum: 2, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      curSelectedId: "", // 当前选中的ID
      selectedIds: [], //勾选的可删除ID
      selectedListIds: [], //勾选的所有ID
      isCanDelete: true,
      userId:'',
      titlesId:'', //当前表头的id
      menu_code:'',
      informationDialogShow: false
    };
  },
  created() {
    this.menu_code = this.$route.meta.code
    this.reqTitleTable()
  },
  mounted() {
    this.userId = JSON.parse(getUser()).user_id;
    this.$nextTick(() => {
      this.setHead('initialize')
      this.loadData();
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
      eventOn.$on('update-upcoming-matter', () => {
        this.loadData()
      })
    });
  },
  methods: {
    // 打开自定一表头弹窗
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    // 更新表格头部
    updateTableHeader(newestTableHeaderList) {
      this.$httpTableHeader.saveTableHeader(this.titlesId,this.menu_code,newestTableHeaderList).then(res => {

        this.reqTitleTable()
      }).catch(err => {

      })
    },
    // 获取表头
    reqTitleTable() {
      this.titleTableLoading = true;
      this.$httpTableHeader.reqTableHeader(this.menu_code,this.customSettingList).then(res => {
        this.titlesId = res.titlesId;
        this.canRendererTableHeader = res.canRendererTableHeader;
        this.customSettingList = res.customSettingList;
        this.customSettingShowList = res.customSettingShowList;
        this.$forceUpdate();
        setTimeout(() =>{
          this.titleTableLoading = false;
        },600)
      }).catch(err => {
        setTimeout(() =>{
          this.titleTableLoading = false;
        },600)
      })
    },
    // 跳转到驾驶员档案安全管理
    jumpDriverSafetyfileManage(driver_name){
      this.$router.push({
        name:'driver-safetyfile-manage',
        params:{
          driverName: driver_name
        }
      })
    },
    showStateText(row) {
      let showText = '';
      switch (row.state) {
        case 1:
          showText = '未发起处理'
          break;
        case 2:
          showText = row.user_names  +'处理中'
         break;
        case 3:
          showText = '处理完成'
          break;

        case 4:
          showText = '已驳回'
          break;

         case 5:
           showText = '已作废'
          break;
      }
      return showText
    },
    // 导出Excel
    exportFile(command) {
      let params = Object.assign({}, this.queryform);
      params.type = Number(command)
      let ids = [ ...this.selectedListIds ]
      if(ids.length) {
        params.ids = ids.toString()
      }
      this.$client.exportDriverRecord(params).then(res => {
        if (res.head.result == "200") {
          window.location.href = res.context;
          this.$message({ type: "success", message: "导出成功" });
        } else {
          this.$message({ type: "error", message: res.head.describle });
        }
      });
    },

    // 添加信息
    addInfo() {
      this.addDialogShow = true;
      this.curChangeType = "add";
      this.$refs['addDialog'].resetData()
    },
    // 表格上点击编辑、查看 获取详情
    editInfo(val, type) {
      this.addDialogShow = true;
      this.curChangeType = type;
      this.$refs["addDialog"].setData(val);
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
    // 查询
    onSubmit(form) {
      this.queryform = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 加载数据
    loadData() {
      this.loading = true;
      let params = {};
      params = Object.assign({}, this.queryform);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.getDriverRecord(params).then(res => {
        if (res.head.result === "200") {
          this.engineData = res.context.list ? res.context.list : [];
          // this.engineData[0].images = [
          //   {
          //     url:'http://122.225.198.118:5000/Files/Employee/Images/71b29805698b4f158f5e8a87b4d112a4.jpg'
          //   },
          //   {
          //     url:'http://122.225.198.118:5000/Files/Employee/Images/71b29805698b4f158f5e8a87b4d112a4.jpg'
          //   },
          //   {
          //     url:'http://122.228.7.75:7000/Files/Employee/Images/20211216002506.jpg'
          //   },

          // ]
          this.pageInfo.pageCount = res.context.total;
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error"
          });
        }
        this.loading = false;
      });
    },
    // 编辑、保存信息
    sureSaveInfo(form,approveStepList) {
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
      this.$client.addDriverRecord(params).then(res => {
        if (res.head.result == "200") {
          // this.form = {};
          if (this.curChangeType == "add") {
            this.queryform = {};
            this.pageInfo.pageCount = 0;
            this.pageInfo.pageIndex = 1;
          }
          this.loadData();
          this.addDialogShow = false;
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
    // 勾选中的
    selectedList(list) {
      this.selectedIds = [];
      this.selectedListIds = [];
      this.isCanDelete = true;
      if (list && list.length > 0) {
        list.forEach((item, index) => {
          this.selectedListIds.push(item.i_id)
          if(item.state == 2 || item.state == 3) {
            this.isCanDelete = false
          }else{
            this.selectedIds.push(item.i_id);
          }
        });
      }
    },
    // 删除
    deleteViolationInfo(row) {
      this.selectedIds = [];
      this.selectedIds.push(row.i_id);
      if (this.selectedIds.length == 1) {
        this.onDelete();
      }
    },
    // 批量删除
    onDelete() {
      if (this.selectedIds.length == 0) {
        this.$message({
          showClose: true,
          message: "请勾选至少一条要移除的",
          type: "warning"
        });
        return;
      }

      let parmas = {
        context: this.selectedIds
      };
      this.$client.deleteDriverRecord(parmas).then(res => {
        if (res.head.result == "200") {
          this.selectedIds = [];
          this.loadData();
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
    // 处理
    dealWithInfo(info) {
      this.$router.push({
        path: `/news-details/${info.i_id}/稽查处理详情${info.source_name}/80`,
        params: {id: info.id, model: 80}
      })
    },
    // 申请流程作废
    cancellation(info) {
      let params = {
        context: [info.i_id]
      }
      this.$client.InvalidRecordDriverViolation(params)
      .then(res => {
        if(res.head.result == '200') {
          this.loadData();
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success",
          });
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success",
          });
        }
      })
    },
    // 打开乘客投诉记录详情
    openServerInfo(info){
      if(!!info.service_code) {
        let params = {
          order_code: info.service_code
        }
        this.$client.listPassengerServiceManage(params).then(res => {
          if (res.head.result == "200") {
            let dataList = res.context.list;
            if(dataList.length > 0) {
              let info = dataList[0]
              this.$refs.informationDialog.setData(info);

              this.informationDialogShow = true;
            }
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

      }
    },
    // 计算表格高度
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH;
        console.log(this.TableHeight);
      }, 60);
    },

  },
  watch: {
    scrapDialogShow() {
      if (!this.scrapDialogShow) {
        this.selectedIds = [];
        // 清除勾选
        this.$refs.table.handleSelectionChange([]);
      }
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.accident-manage {
  width: 100%;
  height: 100%;
}
</style>

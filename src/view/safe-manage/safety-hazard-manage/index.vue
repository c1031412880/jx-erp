<template>
  <div class="safety-hazard-manage">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-add="addEditRowData"
      @on-del="deleteRowsData"
      @on-export="exportRowsData"
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
      @on-select-change-row="selectedRowsData">
    <template slot-scope="scope" slot="data_state">
      <span :style="{ color: getStateNameColor(scope.data.data_state).color }">{{getStateNameColor(scope.data.data_state).name}}</span>
    </template>
    <template slot-scope="scope" slot="operation">
        <el-button type="primary" size="mini" @click="lookDetailRowData(scope.data)" v-if="scope.data.data_state !== 1">查看</el-button>
        <el-button type="primary" size="mini" @click="auditRowData(scope.data, 1)" v-if="$isPowerShow('audit') && scope.data.id &&  scope.data.data_state !== 1">记录审核</el-button>
        <el-button type="primary" size="mini" @click="auditRowData(scope.data, 2)" v-if="$isPowerShow('fbaudit') && scope.data.detail">反馈审核</el-button>
        <el-button type="primary" size="mini" @click="addEditRowData(scope.data,'edit')" v-if="$isPowerShow('edit') && scope.data.data_state === 1">编辑</el-button>
        <el-button type="primary" size="mini" @click="openApplyForm(scope.data,'feedback')" v-if="$isPowerShow('feedback') && scope.data.data_state === 3 && scope.data.whether_change && getUserInfo(scope.data.be_examined_ids) && !scope.data.detail">反馈</el-button>
        <el-popconfirm
          @confirm="deleteRowsData(scope.data)"
          title="确定删除此条记录吗？"
          v-if="$isPowerShow('del') && scope.data.data_state == 1">
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
      :total="pageInfo.pageCount">
    </el-pagination>

    <custom-setting
      :dialogBool.sync="customSettingVialogVisible"
      :customSettingList="customSettingList"
      :canRendererTableHeader="canRendererTableHeader"
      :customSettingShowList="customSettingShowList"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    ></custom-setting>

    <set-info-dialog 
      ref="setInfoDialog" 
      @save-add="saveAddRowData"
      :dialogBool.sync="isShowSetInfoDialog"></set-info-dialog>

    <detail-info-dialog 
      ref="detailInfoDialog" 
      :curSelectedType="curSelectedType"
      :dialogBool.sync="isShowDetailInfoDialog"></detail-info-dialog>

    <fixed-form-body 
      :dialogBool.sync="fixedFormBodyShow" 
      @on-refresh="loadData" 
      :formId="7200" 
      :correlationId="correlationId"
      :formName="'整改意见反馈'"></fixed-form-body>
  </div>
</template>

<script type="text/ecmascript-6">
import { getUser } from "@/utils/auth"
import subReq from "./component/sub-req";
import setInfoDialog from "./component/set-info-dialog";
import detailInfoDialog from "./component/detail-info-dialog";
import fixedFormBody from "@/view/main-Interface-entrance/launch-affair/component/all-box/fixed-form-body";
export default {
  name: "safety-hazard-manage",
  components: {
    subReq,
    setInfoDialog,
    detailInfoDialog,
    fixedFormBody
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      correlationId: 0,
      form: {},
      data: [],
      selectedIds:[],
      loading: false,
      TableHeight: 500,
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      curSelectedType: false,
      isShowDetailInfoDialog: false,
      fixedFormBodyShow: false,
      isShowSetInfoDialog: false,
      canRendererTableHeader: null,
      customSettingShowList: null,
      customSettingVialogVisible: false,
      customSettingList: [
        {
          id: 1,
          label: "状态",
          prop: "data_state",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "检查日期",
          prop: "request_date",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "制表人",
          prop: "user_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "受检部门",
          prop: "check_dept_names",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "受检部门经办人",
          prop: "be_examined_names",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "受检车辆",
          prop: "check_vehicle_names",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "是否需要整改",
          prop: "whether_change_name",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "参加监督检查单位(部门)及人员",
          prop: "check_person_names",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "监督检查主要内容",
          prop: "contents_main",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "检查中出现的问题",
          prop: "contents_problem",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "检查组处理意见",
          prop: "contents_opinion",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "整改人",
          prop: "feed_back_person",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "反馈日期",
          prop: "feedback_date",
          width: "130",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "整改结果",
          prop: "contents_result",
          width: "130",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
        {
          id: 15,
          label: "操作",
          prop: "operation",
          width: "360",
          align: "center",
          signIndex: 14,
          sortable: false,
        },
      ],
      
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead('initialize')
      this.loadData();
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
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.GetPageListHiddenDanger(params)
        .then(res => {
          // console.log(JSON.stringify(res));
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
    // 编辑，添加
    addEditRowData(row, type) {
      if(!type) {
        this.isShowSetInfoDialog = true
        this.$refs.setInfoDialog.setDate(row)
        return false
      }
      let params = {id: row.id}
      this.$client.GetDetailHiddenDanger(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.isShowSetInfoDialog = true
            this.$refs.setInfoDialog.setDate(res.context)
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
    // 保存安全隐患
    saveAddRowData(info, node) {
      let params = {context: {}}
      params.context.form_data = info
      params.context.step_data = node
      this.$client.CreateHiddenDanger(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.isShowSetInfoDialog = false;
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
        .catch((err) => {});
    },
    // 删除
    deleteRowsData(row) {
      let params = {context: []}
      params.context = row ? [row.id] : this.selectedIds
      if(!params.context.length) {
        this.$message({ message: "请选择未发起审批数据删除", type: "warning" });
        return false
      }
      this.$client.DeleteHiddenDanger(params)
        .then((res) => {
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
        .catch((err) => {});
    },
    // 导出
    exportRowsData() {
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.ExportHiddenDanger(params).then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })
    },
    // 列表选中
    selectedRowsData(list) {
      this.selectedIds = [];
      list.forEach((item,index) => {
        if(item.data_state === 1) {
          this.selectedIds.push(item.id)
        }
      });
    },
    // 反馈
    openApplyForm(row) {
      this.correlationId = row.detail_id
      this.fixedFormBodyShow = true
    },
    // 查看
    lookDetailRowData(row) {
      this.curSelectedType = row.detail ? true : false
      this.isShowDetailInfoDialog = true
      let obj = {
        id: row.id,
        detail_id: row.detail_id,
        contents_result: row.contents_result,
      }
      this.$refs.detailInfoDialog.setDate(obj)
      // this.$message({ message: "功能完善中，敬请期待", type: "warning" });
    },
    // 审核
    auditRowData(row, type) {
      let title = type === 1 ? '安全隐患整改记录' : '安全隐患整改反馈'
      let object_id = type === 1 ? 7100 : 7200
      let id = type === 1 ? row.id : row.detail_id
      this.$router.push({
        path: `/news-details/${id}/${title}/${object_id}`
      })
    },
    getStateNameColor(state) {
      let obj = {
        color: '',
        name: '',
      }
      switch (state) {
        case -2: //审批撤回
          obj.color =  '#909399';
          obj.name =  '审批撤回';
          break
        case -1: //审批拒绝
          obj.color =  '#d9001b';
          obj.name =  '审批拒绝';
          break
        case 1: //草稿
          obj.color =  '#909399';
          obj.name =  '草稿';
          break
        case 2: //审批中
          obj.color =  '#E6A23C';
          obj.name =  '审批中';
          break
        case 3: //待整改
          obj.color =  '#0000ff';
          obj.name =  '待整改';
          break
        case 4: //整改完成
          obj.color =  '#67C23A';
          obj.name =  '整改完成';
          break
      }
      return obj
    },
    // 获取用户信息
    getUserInfo(list) {
      this.userId = Number(JSON.parse(getUser()).user_id)
      return list.includes(this.userId)
    },
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
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
.safety-hazard-manage {
  width: 100%;
  height: 100%;
}
</style>

<template>
  <div class="guild-membership-audit">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
    ></sub-req>
    <el-tabs v-model="activeName" @tab-click="handleClick" ref="elTabs">
      <el-tab-pane label="全部" name="0">
         <!-- <div slot="label" style="height: 50px;"> 
           <span><el-badge :value="12" class="item">全部</el-badge></span></div> -->
      </el-tab-pane>
      <el-tab-pane label="审核中" name="2">
        <div slot="label" style="height: 50px;"> 
           <span><el-badge :value="summaryTotal.inChenk" class="item">审核中</el-badge></span></div>
      </el-tab-pane>
      <el-tab-pane label="审核通过" name="3">
        <div slot="label" style="height: 50px;"> 
           <span><el-badge :value="summaryTotal.finishChenk" class="item">审核通过</el-badge></span></div>
      </el-tab-pane>
      <el-tab-pane label="待提交" name="1">
        <div slot="label" style="height: 50px;"> 
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              <el-badge v-if="commandValue == 1" :value="summaryTotal.noSubmit" class="item">{{showDropDownText}} </el-badge >
              <el-badge v-if="commandValue == 4" :value="summaryTotal.refuseChenk" class="item">{{showDropDownText}} </el-badge >
              <el-badge v-if="commandValue == 5" :value="summaryTotal.revoke" class="item">{{showDropDownText}} </el-badge >
              <!-- <span v-else>{{showDropDownText}}</span> -->
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="1"><el-badge :value="summaryTotal.noSubmit" class="item">待提交</el-badge></el-dropdown-item>
              <el-dropdown-item :command="4"><el-badge :value="summaryTotal.refuseChenk" class="item">审批拒绝</el-badge></el-dropdown-item>
              <el-dropdown-item :command="5"><el-badge :value="summaryTotal.revoke" class="item">已撤销</el-badge></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-tab-pane>
      <el-tab-pane label="待我处理" name="6">
        <div slot="label" style="height: 50px;"> 
            <span>待我处理</span>
           <!-- <span><el-badge :value="summaryTotal.noSubmit" class="item">待我处理</el-badge></span> -->
           </div>
      </el-tab-pane>
    </el-tabs>
    <tr-table
      :selectionShow="false"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    >
      <template slot-scope="scope" slot="state_name">
        <!-- 1待提交 2审核中 3审核完成 4审核拒绝 5已撤销 -->
        <span :style="`color: ${showColor(scope.data.state)}`">{{scope.data.state_name}}</span>
      </template>

      <template slot-scope="scope" slot="operation">
          <el-button type="primary" size="mini" @click="editRowInfo(scope.data, 'deal_with')" v-if="$isPowerShow('deal_with') && scope.data.user_ids.includes(userId)">处理</el-button>
          <el-button type="primary" size="mini" @click="editRowInfo(scope.data, 'detail')" v-else>查看</el-button>
          <!-- <el-popconfirm
            @confirm="deleteRowInfo(scope.data)"
            title="确定删除此条记录吗？">
            <el-button slot="reference" type="danger" size="mini" v-if="$isPowerShow('del')">删除</el-button>
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
    ></information-dialog>

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
import {getSession, getUser} from '@/utils/auth'
export default {
  name: "guild-membership-audit",
  components: {
    subReq,
    informationDialog,
  },
  data() {
    return {
      activeName: '0',
      commandValue: 1,
      showDropDownText:'待提交',
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      form: {
        state: '',
      },
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
          label: "审批编号",
          prop: "floe_code",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "会员姓名",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "审核状态",
          prop: "state_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "联系电话",
          prop: "phone",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "出生日期",
          prop: "birthday",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "出生地点",
          prop: "address",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "民族",
          prop: "nation",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "工资",
          prop: "wages",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "政治面貌",
          prop: "politics_status",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "学历",
          prop: "top_education",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "工作单位及职务",
          prop: "position",
          width: "145",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "籍贯",
          prop: "hometown",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "家庭主要成员及其工作单位",
          prop: "home_position",
          width: "260",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "个人工作简历",
          prop: "work_resume",
          width: "130",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
        {
          id: 15,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 14,
          sortable: false,
        },
        {
          id: 16,
          label: "操作",
          prop: "operation",
          width: "140",
          align: "center",
          signIndex: 15,
          sortable: false,
        },
      ],
      frontFixedNum: 2, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      summaryTotal:{},
      userId:'', //当前用户id
      curFitterState:0
    };
  },
  mounted() {
    this.loadData();
    this.reqUserInfo();
    this.$nextTick(() => {
      this.setHead('initialize');
      // 审批后更新表格
      eventOn.$on('update-upcoming-guild-membership-audit', () => {
        this.loadData()
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
    reqUserInfo() {
      this.userId = JSON.parse(getUser()).user_id;
      // console.log(this.userId)
    },
    // 1待提交 2审核中 3审核完成 4审核拒绝 5已撤销
    showColor(state) {
      let color = '';
      switch (state) {
        case 1:
          color = '#67C23A';
          break;
        case 2:
          color = '#FF9900';
          break;
        case 3:
          color = '#1ABC9C';
          break;
        case 4:
          color = '#d9001b76';
          break;
        case 5:
          color = '#f2f2f2';
          break;
      }
      return color
    },
    // 切换菜单栏
    handleClick(tab, event) {
      // console.log(tab, event);
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.curFitterState = Number(tab.name)
      switch (this.curFitterState) {
        case 0:
          this.form.state = '';
          delete this.form.state
          this.loadData();
          break;
        case 1:
          if(this.curFitterState != this.commandValue) {
            this.$refs.head.form.state = this.commandValue
            this.form.state = this.commandValue
          }else{
            this.$refs.head.form.state = this.curFitterState
            this.form.state = this.curFitterState
          }
          this.loadData();
          break;
        case 2:
        case 3:
          this.$refs.head.form.state = this.curFitterState
          this.form.state = this.curFitterState
          this.loadData();
          break;
        case 6:
          this.form.state = 2
          this.$refs.head.form.state =2;
          this.reqWaitReqByPage();
          break;
      }
    },
    // 切换菜单选项
    handleCommand(command) {
      this.commandValue = command;
      this.form.state = command;
      this.$refs.head.form.state = Number(command);
      switch (this.commandValue) {
        case 1:
          this.showDropDownText = '待提交';
          break;
        case 4:
          this.showDropDownText = '审批拒绝';
          break;
        case 5:
          this.showDropDownText = '已撤销';
          break;
      }
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
      
    },

    onSubmit(form) {
      this.form = form
      // console.log(this.form);
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      if(this.curFitterState == 6) {
        this.form.state = 2
        this.$refs.head.form.state =2;
        this.reqWaitReqByPage();
      }else{
        this.loadData();
      }
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.GetReqByPageErpTradeMainManage(params)
        .then(res => {
          // console.log(JSON.stringify(res));
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list;
            this.pageInfo.pageCount = res.context.total
            this.summaryTotal = res.context.summary
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
    // 获取待我处理的会员申请
    reqWaitReqByPage() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.GetWaitReqByPageErpTradeMainManage(params)
        .then(res => {
          // console.log(JSON.stringify(res));
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list;
            this.pageInfo.pageCount = res.context.total
            this.summaryTotal = res.context.summary
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
    restTableList() {
      this.form = {};
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      if(this.curFitterState == 6) {
        this.form.state = 2
        this.$refs.head.form.state =2;
        this.reqWaitReqByPage();
      }else{
        this.loadData();
      }
    },
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx;
      if(this.curFitterState == 6) {
        this.form.state = 2
        this.$refs.head.form.state =2;
        this.reqWaitReqByPage();
      }else{
        this.loadData();
      }
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      if(this.curFitterState == 6) {
        this.form.state = 2
        this.$refs.head.form.state =2;
        this.reqWaitReqByPage();
      }else{
        this.loadData();
      }
    },
    
    // 编辑
    editRowInfo(form,type) {
      this.curSelecedType = type;
      this.$refs.informationDialog.setData(form)
      this.informationDialogTitle = "会员申请详情";
      this.informationDialogShow = true;
    },
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
        this.customSettingShowList = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let elTabsTh = this.$refs.elTabs.$el.offsetHeight;
        this.TableHeight = maxh - th - 30- elTabsTh;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.guild-membership-audit {
  width: 100%;
  height: 100%;
}
.guild-membership-audit /deep/ .el-badge__content.is-fixed {
  top: 10px;
}
</style>

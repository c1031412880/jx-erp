<template>
  <div class="car-charter-filling">
    <div class="department-detail show-flex-box-c" v-loading="loading">
      <sub-req
        ref="head"
        @on-add="openAddPage"
        @on-ok="onSubmit"
      ></sub-req>
      <tr-table
        :data="data"
        :tableHeaderList="canRendererTableHeader"
        :selectionShow="true"
        :TableHeight="TableHeight"
        :loading="loading"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum"
        :isShowSummary="true"
        :sumTotal="sumTotal"
        :sumColumnIndex="[6,9]"
        @on-select-change-row="selectedUserList"
      >
        <template slot-scope="scope" slot="type">
          <div>
            <span :style="{'color': outColor(scope.data.type)}"> ● </span>
            <span>{{ getState(scope.data.type) }}</span>
          </div>
        </template>
        <template slot-scope="scope" slot="cost_settlement">
          <span>{{ haveRule ? scope.data.cost_settlement :  getCost(scope.data) }}</span>
        </template>
        <template slot-scope="scope" slot="chariot_type">
          <span>{{ getChariotType(scope.data.chariot_type) }}</span>
        </template>
        <template slot-scope="scope" slot="settlement_mode">
          <span>{{ getSettlementMode(scope.data.settlement_mode) }}</span>
        </template>
        <template slot-scope="scope" slot="operation">
          <el-button type="text" size="mini" @click="editRowInfo(scope.data,'detail')">查看</el-button>
          <el-button type="text" v-if="scope.data.type != 4 && scope.data.type != 2 && $isPowerShow('edit')" size="mini" @click="editRowInfo(scope.data,'edit')">编辑</el-button>
          <el-button type="text" v-if="scope.data.type == 2 && $isPowerShow('edit')" size="mini" @click="editRowInfo(scope.data,'edit')">填报</el-button>
          <el-popconfirm
            @confirm="deleteRowInfo(scope.data)"
            title="确定删除选中的包车信息吗？"
            v-if="$isPowerShow('del') && scope.data.type == 1">
            <el-button slot="reference" style="margin-left: 10px;" type="text" size="mini">删除</el-button>
          </el-popconfirm>
        </template>
      </tr-table>
      <el-pagination
        style="margin: 5px 0;display:flex; justify-content: flex-end;"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        ref="paginationH"
        :current-page="pageInfo.pageIndex"
        :page-sizes="[10, 20, 30, 40, 50,]"
        :page-size="pageInfo.pageSize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="pageInfo.pageCount"
      >
      </el-pagination>
    </div>
    <div class="organization-project-dialog">
      <add-classify-dialog
        ref="addClassifyDialog"
        :dialogBool.sync="isShowAddClassifyDialog"
        :curType="curType"
        :haveRule="haveRule"
        :driverTree="driverTree"
        :vehicleTree="vehicleTree"
        @save-add-edit-organization="saveOrEdit"
      ></add-classify-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { getUser } from '@/utils/auth';
import subReq from "./component/sub-req";
import addClassifyDialog from "./component/add-classify-dialog"

export default {
  name: "car-charter-filling",
  components: {
    subReq,
    addClassifyDialog,
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 30,
        pageCount: 0,
      },
      visible: false,
      placeholder: "请输入关键词",
      curType: 'add', //添加分类
      isShowRulesDialog: false,
      isShowAddClassifyDialog: false,
      data:[], //列表
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: [
        {
          id: 1,
          label: "工单状态",
          prop: "type",
          width: "120",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "用车时间",
          prop: "use_start_time",
          width: "120",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "包车类型",
          prop: "chariot_type",
          width: "130",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "用车单位",
          prop: "use_uint",
          width: "130",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "用车人数",
          prop: "use_people",
          width: "130",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "投放台数",
          prop: "deployment_units",
          width: "130",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "联系人",
          prop: "contact_person",
          width: "130",
          align: "center",
          signIndex: 6,
        },
        {
          id: 8,
          label: "联系电话",
          prop: "contact_phone",
          width: "130",
          align: "center",
          signIndex: 7,
        },
        {
          id: 9,
          label: "费用结算",
          prop: "cost_settlement",
          width: "130",
          align: "center",
          signIndex: 8,
        },
        {
          id: 10,
          label: "结算方式",
          prop: "settlement_mode",
          width: "130",
          align: "center",
          signIndex: 9,
        },
        {
          id: 11,
          label: "工单说明",
          prop: "work_order_description",
          width: "130",
          align: "center",
          signIndex: 10,
        },
        {
          id: 12,
          label: "操作",
          prop: "operation",
          width: "200",
          align: "center",
          signIndex: 11,
        },
      ],
      loading: false,
      TableHeight:500,

      form:{}, //查询表单数据
      driverTree: [],
      vehicleTree: [],
      selectedProjectIds: [],
      projectList: [],
      sumTotal: {
        6: '',
        9: ''
      }
    };
  },
  computed: {
    haveRule: function() {
      return this.$isPowerShow('all') ? true : false
    }
  },
  mounted() {
    this.getDeptDriverTree()
    this.getVehicleTree()
    this.setHead()
  },
  methods: {
    
    // 获取列表
    loadData() {
      this.loading = true;
      let params = Object.assign({},this.form)
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.GetByPageChariotManage({context:params})
      .then(res => {
        // console.log(JSON.stringify(res))
        if (res.head.result == "200") {
          this.data = res.context.list;
          // 总分类下需要分页
          this.pageInfo.pageCount = res.context.total
          let total_fee = 0
          this.data.forEach(item => {
            total_fee += this.getCost(item)
          })
          this.sumTotal = {
            6 : res.context.total_deployment_units || 0,
            9 : this.haveRule ? res.context.total_cost_settlement : total_fee,
          }
          this.loading = false;
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      }).catch(err => {
        this.loading = false;
      })
    },
    // 查询
    onSubmit(form) {
      this.form = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 头部事件抛出
    openAddPage(type) {
      switch (type) {
        case "add":
          this.curType = 'add'
          this.isShowAddClassifyDialog = true;
          break;
        case "delete":
          this.deleteSelectedUserInfo()
          break;
        case "end":
          let list = this.projectList.filter(item => {
            return item.type == 3
          })
          if(list == 0) {
            this.$message({
              showClose: true,
              message: '请勾选至少一条已填报完成的数据',
              type: "warning",
            });
            return
          }
          list.forEach((item,index) => {
            this.selectedProjectIds.push(item.id)
          });
          this.update()
        break;
        case "export":
          this.onExport()
        break;
      }
    },
    // 新增或编辑指标 
    saveOrEdit(form) {
      let successrMessage = '';
      if (this.curType == "add") {
        successrMessage = "添加成功";
        delete form.id
      } else{
        successrMessage = "编辑成功";
      }
      let params = {
        context: form
      }
      this.$client.AddOrUpdateChariotReport(params)
      .then((res) => {
        if (res.head.result == "200") {
          this.loadData();
          this.isShowAddClassifyDialog = false;
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
    // 查看 编辑
    editRowInfo(info,type) {
      this.isShowAddClassifyDialog = true
      this.curType = type 
      this.$nextTick(() => {
        this.$refs.addClassifyDialog.setData(info)
      }, 300)
    },
    // 确定批量移除勾选
    deleteSelectedUserInfo() {
      if(this.selectedProjectIds.length == 0) {
        this.$message({
          showClose: true,
          message: '请勾选至少一条要移除的',
          type: "warning",
        });
        return
      }
      this.deleteRowInfo(null)
    },
    // 完结 
    update() {
      this.$client.UpdateEndChariotManage({context:this.selectedProjectIds})
      .then(res => {
        if (res.head.result == "200") {
          // 重新加载列表详情
          this.loadData();
          this.$message({
            showClose: true,
            message: "完结成功",
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
    // 移除
    deleteRowInfo(info) {
       let params = {
        context: []
      };
      if(!!info) {
        params.context[0] = info.id
      }else{
        params.context = this.selectedProjectIds
      }
      this.$client.DeleteChariotReport(params)
      .then(res => {
        if (res.head.result == "200") {
          // 重新加载列表详情
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
    // 选中表格勾选框
    selectedUserList(projectList) {
      this.projectList = projectList
      this.selectedProjectIds = [];
      projectList.forEach((item,index) => {
        this.selectedProjectIds.push(item.id)
      });
    },
     // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx;
      this.loadData(true);
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadData(true);
    },
    onExport() {
      let params = Object.assign({}, this.form);
      this.$client.ExportChariotTotal({context:params}).then((res) => {
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
    // 获取驾驶员树  
    getDeptDriverTree() {
      this.$client.getDeptDriverTree().then((res) => {
        if (res.head.result === "200") {
          this.driverTree = res.context
        }
      })
    },
    // 获取车辆树 
    getVehicleTree() {
      let params = {
        oil_type: 0
      }
      this.$client.getVehicleTree(params).then((res) => {
        if (res.head.result === "200") {
          this.vehicleTree = res.context
        }
      })
    },
    // 审批单状态
    outColor(state) {
      switch (state) {
        case 1:
          return '#80ffff'
        case 2:
          return '#ffff00'
        case 3:
          return '#ffff00'
        case 4:
          return '#85ce61'
      }
    },
    getState(type) {
      switch (type) {
        case 1:
          return '草稿'
        case 2:
          return '填报中'
        case 3:
          return '填报完成'
        case 4:
          return '完结'
      }
    },
    getChariotType(type) {
      switch (type) {
        case 1:
          return '普通包车'
        case 2:
          return '大型用车'
        default:
          return ''
      }
    },
    getSettlementMode(type) {
      switch (type) {
        case 1:
          return '转账'
        case 2:
          return '现金'
        default:
          return ''
      }
    },
    // 总费用结算
    getCost(row) {
      let userInfo = JSON.parse(getUser());
      let fee = 0
      switch (userInfo.dept_name) {
        case '一分公司':
          fee = row.one_fee || 0
          break;
        case '二分公司':
          fee = row.two_fee || 0
          break;
        case '三分公司':
          fee = row.three_fee || 0
          break;
        case '四分公司':
          fee = row.four_fee || 0
          break;
        case '五分公司':
          fee = row.five_fee || 0
          break;
      
        default:
          break;
      }
      return fee
    },
    // 计算高吨
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight
        this.TableHeight = maxh -th - 35;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.car-charter-filling{
  width: 100%;
  height: 100%;
}
</style>

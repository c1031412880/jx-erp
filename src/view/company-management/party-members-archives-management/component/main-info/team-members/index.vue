<template>
  <div class="install-info" style="height:470px;overflow-x:hidden">
    <el-card class="box-card" shadow="hover" style="margin-bottom: 10px;">
      <div slot="header" class="clearfix" style="padding: 0px;">
        <span style="line-height: 28px;">党内职务信息</span>
        <el-button style="float: right;" type="primary" @click="onBtn('add')" icon="el-icon-plus" size="mini" v-if="curChangeType != 'detail'">新增</el-button>
      </div>
      <div class="use-table-record show-flex-box-c" style="margin:0 20px;">
        <div class="table">
          <tr-table
            :selectionShow="false"
            :data="ListPositionPartyRecordData"
            :tableHeaderList="canRendererTableHeader"
            :isShowBottomOptions="false"
            :TableHeight="TableHeight"
            :loading="loading"
            :frontFixedNum="0"
            :backFixedNum="1"
            :isFixedEmptyPlaceholder="false"
          >
            <template slot-scope="scope" slot="operation">
              <el-button type="primary" size="mini" :disabled="curChangeType=='detail'" @click="editInfo(scope.data)">编辑</el-button>
              <el-popconfirm
                @confirm="deletePositionPartyRecord(scope.data)"
                title="是否确删除此条记录？">
                <el-button slot="reference" :disabled="curChangeType=='detail'" type="danger" size="mini" style="margin-left: 10px;">删除</el-button>
              </el-popconfirm>
              <!-- <el-button type="primary" size="mini" :disabled="curChangeType=='detail'" @click="addTeamMembersInfo(scope.data)">新增班子成员</el-button> -->
            </template>
          </tr-table>
        </div>
      </div>
    </el-card>
    <el-card class="box-card" shadow="hover" style="margin-bottom: 10px;">
      <div slot="header" class="clearfix" style="padding: 0px;">
        <span style="line-height: 28px;">“两代表一委员”信息</span>
         <el-button style="float: right;" type="primary" @click="addTeamMembersInfo('add')" icon="el-icon-plus" size="mini" v-if="curChangeType != 'detail'">新增</el-button>
      </div>
      <div class="use-table-record show-flex-box-c" style="margin:0 20px;">
        <div class="table">
          <tr-table
            :selectionShow="false"
            :data="ListMemberPartyRecordData"
            :tableHeaderList="canRendererSecondTableHeader"
            :isShowBottomOptions="false"
            :TableHeight="TableHeight"
            :loading="loading"
            :frontFixedNum="0"
            :backFixedNum="1"
            :isFixedEmptyPlaceholder="false"
          >
            <template slot-scope="scope" slot="operation">
              <el-button type="primary" size="mini" :disabled="curChangeType=='detail'" @click="editTeamMembersInfo(scope.data)">编辑</el-button>
              <el-popconfirm
                @confirm="deleteTeamMembersInfo(scope.data)"
                title="是否确删除此条记录？">
                <el-button slot="reference" :disabled="curChangeType=='detail'" type="danger" size="mini" style="margin-left: 10px;">删除</el-button>
              </el-popconfirm>
            </template>
          </tr-table>
        </div>
      </div>
    </el-card>
    <!-- 弹窗 -->
    <div>
      <!-- 添加弹窗 -->
      <set-change-period-dialog
        ref="setChangePeriodDialog"
        :curType="curType"
        :showCasualtiesTitle="showCasualtiesTitle"
        :dialogBool.sync="isShowAddDialog"
        @sure-submit-change-period="sureSubmitChangePeriod"
      ></set-change-period-dialog>
      <!-- 添加弹窗 -->
      <set-team-members-dialog
        ref="setTeamMembersDialog"
        :curType="curSecondType"
        :showCasualtiesTitle="showTeamMembersTitle"
        :dialogBool.sync="isShowTeamMembersInfo"
        @sure-submit-team-members="sureSubmitTeamMembers"
      ></set-team-members-dialog>
    </div>
  </div>
</template>
<script>
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import setChangePeriodDialog from './set-change-period-dialog'
import setTeamMembersDialog from './set-team-members-dialog'
export default {
  components: {getVehicleSelectTree,setChangePeriodDialog,setTeamMembersDialog},
  props: {
    curChangeType: {
      type: String,
      default: "add",
    },
  },
  data() {
    return {
      formData: {
        type: 1,
      },
      canRendererTableHeader: [
        {
          id: 1,
          label: "任职党组织",
          prop: "organ_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "党内职务名称",
          prop: "position_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "任职日期",
          prop: "entry_date",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "是否还在职",
          prop: "ex_is_onjob",
          width: "165",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "离职日期",
          prop: "leave_date",
          width: "165",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "操作",
          prop: "operation",
          width: "160",
          align: "center",
          signIndex: 5,
          sortable: false,
        }
      ],
      canRendererSecondTableHeader: [
        {
          id: 1,
          label: "“两代表一委员”类别",
          prop: "name",
          width: "190",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "届次",
          prop: "period",
          width: "170",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "该届起始时间",
          prop: "start_date",
          width: "190",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "该届届满时间",
          prop: "end_date",
          width: "180",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "操作",
          prop: "operation",
          width: "230",
          align: "center",
          signIndex: 4,
          sortable: false,
        }
      ],
      TableHeight:200,
      curType: 'add',
      curInfo:{}, //当前操作的党员档案记录
      isShowAddDialog: false,
      showCasualtiesTitle:'新增职务信息',
      ListPositionPartyRecordData:[], //职务列表
      loading: false,
      curSecondType: 'add',
      isShowTeamMembersInfo: false,
      showTeamMembersTitle: '新增两代表一委员',
      ListMemberPartyRecordData: [], //两代表一委员
      rowId:'', // 编辑选中的（职务信息 || 两代表一委员） 的ID
    }
  },
  methods: {
    // 初始化数据
    resetData(){ 
      this.data = [];
    },
    // 数据回显
    setData(val){
      this.curInfo = val;
      this.reqListPositionPartyRecord();
      this.reqListMemberPartyRecord();
    },
    // 获取职务信息
    reqListPositionPartyRecord() {
      this.loading = true
      let parmas = {
        id: this.curInfo.id,
      }
      this.$client.ListPositionPartyRecord(parmas)
        .then(res => {
          if (res.head.result == "200") {
            this.ListPositionPartyRecordData = res.context.list;
            this.loading = false
          } else {
            this.loading = false
            this.ListPositionPartyRecordData = [];
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          };
          this.loading = false;
        })
    },
    // 获取两代表一委员信息
    reqListMemberPartyRecord() {
      this.loading = true
      let parmas = {
        id: this.curInfo.id,
      }
      this.$client.ListMemberPartyRecord(parmas)
        .then(res => {
          if (res.head.result == "200") {
            this.ListMemberPartyRecordData = res.context.list;
            this.loading = false
          } else {
            this.loading = false
            this.ListMemberPartyRecordData = [];
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          };
          this.loading = false;
        })
    },
    // 操作
    onBtn(type) {
      switch (type) {
        case 'add':
          this.curType = 'add';
          this.showCasualtiesTitle = '新增职务信息'
          this.isShowAddDialog = true
          break;
      }
    },
    // 编辑党内职务信息
    editInfo(row) {
      this.curType = 'edit';
      this.showCasualtiesTitle = '编辑职务信息'
      // this.rowId = row.id;
      this.$refs.setChangePeriodDialog.setData(row)
      this.isShowAddDialog = true;
    },
    // 确定党内职务信息添加
    sureSubmitChangePeriod(info) {
      info.party_user = this.curInfo.id;
      let params = {
        context: info
      }
      this.$client.AddPartyPositionPartyRecord(params).then(res => {
        if(res.head.result == '200') {
          this.isShowAddDialog = false
          this.reqListPositionPartyRecord();
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
        }
      })
    },
    // 删除党内职务信息
    deletePositionPartyRecord(row) {
      let parmas = {
        context: [row.id],
      };
      this.$client.BatchDeletePositionPartyRecord(parmas)
      .then(res => {
        if(res.head.result == '200') {
          this.reqListPositionPartyRecord();
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
    // 添加党内职务信息
    addTeamMembersInfo(type) {
      this.curSecondType = 'add';
      this.isShowTeamMembersInfo = true;
      this.showTeamMembersTitle = '添加两代表一委员'
    },
    // 编辑两代表一委员
    editTeamMembersInfo(row) {
      this.curSecondType = 'edit';
      // this.rowId = row.id;
      this.showTeamMembersTitle = '编辑两代表一委员'
      this.$refs.setTeamMembersDialog.setData(row)
      this.isShowTeamMembersInfo = true;
    },

    // 确定“两代表一委员”信息添加
    sureSubmitTeamMembers(info) {
      // console.log(info)
      // if(this.curSecondType == 'edit') {
      //   info.id = this.rowId
      // }
      info.party_user = this.curInfo.id;
      let params = {
        context: info
      }
      this.$client.AddPartyMemberPartyRecord(params).then(res => {
        if(res.head.result == '200') {
          this.isShowTeamMembersInfo = false
          this.reqListMemberPartyRecord();
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
        }
      })
    },
    // 删除删除两代表一委员信息
    deleteTeamMembersInfo(row) {
      let parmas = {
        context: [row.id],
      };
      this.$client.BatchDeleteMemberPartyRecord(parmas)
      .then(res => {
        if(res.head.result == '200') {
          this.reqListMemberPartyRecord();
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
    }
    
  }
}

</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .install-info /deep/ .el-card__header {
    padding: 5px 20px;
    background: #F2F2F2;
  }

  .install-info /deep/ .el-input{
    width: 420px;
  }

  .install-info /deep/ .el-input--mini{
    width: 420px;
  }

  .install-info/deep/ .el-date-editor {
    width: 420px;
  }
</style>


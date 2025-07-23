<template>
  <div class="install-info" style="height:470px;overflow-x:hidden">
    <el-card class="box-card" shadow="hover" style="margin-bottom: 10px;">
      <div slot="header" class="clearfix" style="padding: 0px;">
        <span style="line-height: 28px;">家庭成员信息</span>
        <el-button style="float: right;" type="primary" @click="openAddMemberFamilyPop('add')" icon="el-icon-plus" size="mini" v-if="curChangeType != 'detail'">新增</el-button>
      </div>
      <div class="use-table-record show-flex-box-c" style="margin:0 20px;">
        <div class="table">
          <tr-table
            :selectionShow="false"
            :data="memberFamilyData"
            :tableHeaderList="canRendererTableHeader"
            :isShowBottomOptions="false"
            :TableHeight="TableHeight"
            :loading="loading"
            :frontFixedNum="0"
            :backFixedNum="1"
          >
            <template slot-scope="scope" slot="sex">
              <span v-if="scope.data.sex">{{scope.data.sex == 1?'男':'女'}}</span>
            </template>
            <template slot-scope="scope" slot="operation">
              <el-button type="primary" size="mini" :disabled="curChangeType=='detail'" @click="editInfo(scope.data)">编辑</el-button>
              <el-popconfirm
                @confirm="deleteInfo(scope.data)"
                title="是否确删除此条记录？">
                <el-button slot="reference" :disabled="curChangeType=='detail'" type="danger" size="mini" style="margin-left: 10px;">删除</el-button>
              </el-popconfirm>
            </template>
          </tr-table>
        </div>
      </div>
    </el-card>
    <div>
      <!-- 添加弹窗 -->
      <set-change-period-dialog
        ref="setChangePeriodDialog"
        :curType="curType"
        :showMemberFamilyTitle="showMemberFamilyTitle"
        :dialogBool.sync="isShowAddDialog"
        @sure-submit-save="sureSubmitSave"
      ></set-change-period-dialog>
    </div>
  </div>
</template>
<script>
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import setChangePeriodDialog from './set-info-dialog'
export default {
  components: {getVehicleSelectTree,setChangePeriodDialog},
  props: {
    curChangeType: {
      type: String,
      default: "add",
    },
  },
  data() {
    return {
      canRendererTableHeader: [
        {
          id: 1,
          label: "成员姓名",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "关系称呼",
          prop: "relation",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "性别", 
          prop: "sex",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "身份证号",
          prop: "idcode",
          width: "165",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "政治面貌",
          prop: "politics_status",
          width: "165",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "家庭成员及社会关系人员单位及职务",
          prop: "position",
          width: "165",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "联系电话",
          prop: "phone",
          width: "165",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "操作",
          prop: "operation",
          width: "160",
          align: "center",
          signIndex: 7,
          sortable: false,
        }
      ],
      TableHeight:360,
      curType: 'add',
      curInfo:{}, //当前党员档案记录
      isShowAddDialog: false,
      showMemberFamilyTitle:'新增成员',
      memberFamilyData:[], //党员家庭成员信息
      loading: false,
    }
  },
  methods: {
    // 初始化数据
    resetData(){ 
      this.memberFamilyData = [];
    },
    // 数据回显
    setData(val){
      this.curInfo = val;
      this.reqMemberFamilyRecordList();
    },
    // 获取家庭成员信息
    reqMemberFamilyRecordList() {
      this.loading = true
      let parmas = {
        id: this.curInfo.id,
      }
      this.$client.ListUserHomePartyRecord(parmas)
        .then(res => {
          if (res.head.result == "200") {
            this.memberFamilyData = res.context.list;
            this.loading = false
          } else {
            this.loading = false
            this.memberFamilyData = [];
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          };
          this.loading = false;
        })
    },
    // 打开添加家庭成员信息
    openAddMemberFamilyPop() {
      this.curType = 'add';
      this.showMemberFamilyTitle = '新增成员'
      this.isShowAddDialog = true
    },
    // 编辑家庭成员信息
    editInfo(row) {
      this.curType = 'edit';
      this.showMemberFamilyTitle = '修改成员'
      // this.rowId = row.id;
      this.$refs.setChangePeriodDialog.setData(row)
      this.isShowAddDialog = true;
    },
    // 确定添加
    sureSubmitSave(info) {
      info.party_user = this.curInfo.id;
      let params = {
        context: info
      }
      this.$client.AddPartyUserHomePartyRecord(params).then(res => {
        if(res.head.result == '200') {
          this.reqMemberFamilyRecordList();
          this.isShowAddDialog = false
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
    // 删除
    deleteInfo(row) {
      let parmas = {
        context: [row.id],
      };
      this.$client.BatchDeleteUserHomePartyRecord(parmas)
      .then(res => {
        if(res.head.result == '200') {
          this.selectedIds = [];
          this.reqMemberFamilyRecordList();
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


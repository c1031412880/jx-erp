<template>
  <div class="install-info" style="height:470px;overflow-x:hidden">
    <el-card class="box-card" shadow="hover" style="margin-bottom: 10px;">
      <div slot="header" class="clearfix" style="padding: 0px;">
        <span style="line-height: 28px;">党组织换届信息</span>
        <el-button style="float: right;" type="primary" @click="onBtn('add')" icon="el-icon-plus" size="mini" v-if="curChangeType != 'detail'">新增</el-button>
      </div>
      <div class="use-table-record show-flex-box-c" style="margin:0 20px;">
        <div class="table">
          <tr-table
            :selectionShow="false"
            :data="casualtiesRecordList"
            :tableHeaderList="canRendererTableHeader"
            :isShowBottomOptions="false"
            :TableHeight="TableHeight"
            :loading="loading"
            :frontFixedNum="0"
            :backFixedNum="1"
            @on-select-row="onSelectRow"
            :isFixedEmptyPlaceholder="false"
          >
            <template slot-scope="scope" slot="now">
              <span>{{scope.data.now == 1? '是':'否'}}</span>
            </template>
            <template slot-scope="scope" slot="operation">
              <el-button type="primary" size="mini" :disabled="curChangeType=='detail'" @click="editInfo(scope.data)">编辑</el-button>
              <el-popconfirm
                @confirm="deleteInfo(scope.data)"
                title="是否确删除此条记录？">
                <el-button slot="reference" :disabled="curChangeType=='detail'" type="danger" size="mini" style="margin-left: 10px;">删除</el-button>
              </el-popconfirm>
              <el-button type="primary" size="mini" :disabled="curChangeType=='detail'" @click="addTeamMembersInfo(scope.data)">新增班子成员</el-button>
            </template>
          </tr-table>
        </div>
      </div>
    </el-card>
    <el-card class="box-card" shadow="hover" style="margin-bottom: 10px;">
      <div slot="header" class="clearfix" style="padding: 0px;">
        <span style="line-height: 28px;">党组织班子成员信息</span>
      </div>
      <div class="use-table-record show-flex-box-c" style="margin:0 20px;">
        <div class="table">
          <tr-table
            :selectionShow="false"
            :data="teamMembersInfoData"
            :tableHeaderList="canRendererSecondTableHeader"
            :isShowBottomOptions="false"
            :TableHeight="TableHeight"
            :loading="loading"
            :frontFixedNum="0"
            :backFixedNum="1"
            :isFixedEmptyPlaceholder="false"
          >
            <template slot-scope="scope" slot="ex_is_inoffice">
              <span>{{scope.data.ex_is_inoffice == 1? '是':'否'}}</span>
            </template>

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
        @sure-submit-casualties="sureSubmitAddperiod"
      ></set-change-period-dialog>
      <!-- 添加弹窗 -->
      <set-team-members-dialog
        ref="setTeamMembersDialog"
        :curType="curSecondType"
        :showCasualtiesTitle="showMembersTitle"
        :dialogBool.sync="isShowTeamMembersInfo"
        @sure-submit-info="sureSubmitTeamMembers"
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
          label: "班子届次",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "班子当选日期",
          prop: "elect_start",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "班子届满日期", 
          prop: "elect_end",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "是否为当前届次",
          prop: "now",
          width: "165",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "操作",
          prop: "operation",
          width: "240",
          align: "center",
          signIndex: 4,
          sortable: false,
        }
      ],
      canRendererSecondTableHeader: [
        {
          id: 1,
          label: "姓名",
          prop: "ex_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "身份证号码",
          prop: "ex_idcode",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "职务名称", 
          prop: "ex_post_name_pro",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "任职日期",
          prop: "entry_date",
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
          label: "是否在任",
          prop: "ex_is_inoffice",
          width: "165",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "操作",
          prop: "operation",
          width: "160",
          align: "center",
          signIndex: 6,
          sortable: false,
        }
      ],
      TableHeight:200,
      curType: 'add',
      curInfo:{}, //当前操作
      isShowAddDialog: false,
      showCasualtiesTitle:'新增换界信息',
      casualtiesRecordList:[], //党组织换届信息记录
      curTeamRow: {}, //当前选中的班子信息

      curSecondType: 'add',
      loading: false,
      isShowTeamMembersInfo: false,
      showMembersTitle: "新增党组织班子成员",
      teamMembersInfoData:[],
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 初始化数据
    resetData(){ 
      this.data = [];
      this.curInfo = {};
      this.teamMembersInfoData = [];
      this.curTeamRow = {};
    },
    // 数据回显
    setData(val){
      this.curInfo = val;
      this.reqCasualtiesRecordList();
    },
    // 获取换届信息
    reqCasualtiesRecordList() {
      this.loading = true
      let parmas = {
        id: this.curInfo.id,
      }
      this.$client.ListClassPartyOrgan(parmas)
        .then(res => {
          if (res.head.result == "200") {
            this.casualtiesRecordList = res.context.list;
            // 更新党组织基本信息中的党支部书记和身份证号
            if(this.casualtiesRecordList && this.casualtiesRecordList.length > 0) {
              this.onSelectRow(this.casualtiesRecordList[0])
              // this.upDateBaseInfo()
            }
            this.loading = false
          } else {
            this.loading = false
            this.casualtiesRecordList = [];
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          };
          this.loading = false;
        })
    },
    // 更新党组织基本信息中的党支部书记和身份证号
    upDateBaseInfo() {
      this.casualtiesRecordList.forEach(row => {
        if(row.now === 1) {
          let parmas = {
            id: row.organ_id,
            class_id: row.id,
          }
          this.$client.ListClassUserPartyOrgan(parmas)
            .then(res => {
              if (res.head.result == "200") {
                let teamMembersInfolist = res.context.list;
                teamMembersInfolist.forEach(element => {
                  if(element.post_id === 1) {
                    console.log(element.ex_name)
                    this.$emit('update-base-info', element.ex_name, element.ex_idcode)
                  }
                });
              } 
            })
              // this.$parent.$refs.baseInfo.formData.
        }
      });
    },
    // 操作
    onBtn(type) {
      this.curType = type;
      this.showCasualtiesTitle = '新增换界信息'
      this.isShowAddDialog = true
    },
    // 编辑换界信息
    editInfo(row) {
      this.curType = 'edit';
      this.showCasualtiesTitle = '编辑换界信息'
      this.rowId = row.id;
      // this.$refs.damageDialog.setData(row)
      this.$refs['setChangePeriodDialog'].setData(row)
      this.isShowAddDialog = true;
    },
    // 确定添加
    sureSubmitAddperiod(info) {
      // console.log(info)
      if(this.curType == 'edit') {
        info.id = this.rowId
      }
      info.organ_id = this.curInfo.id;
      let params = {
        context: info
      }
      this.$client.AddPartyClassPartyOrgan(params).then(res => {
        if(res.head.result == '200') {
          this.isShowAddDialog = false
          this.reqCasualtiesRecordList();
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

    // 删除信息
    deleteInfo(row) {
      let parmas = {
        context: [row.id],
      };
      this.$client.BatchDeleteClassPartyOrgan(parmas)
      .then(res => {
        if(res.head.result == '200') {
          this.reqCasualtiesRecordList();
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
    onSelectRow(row) {
      this.curSecondType = 'add';
      this.curTeamRow = row;
      // 获取当前换届信息的班子成员
      this.$refs.setTeamMembersDialog.configCircuitfInfo(row.organ_id);
      this.$refs.setTeamMembersDialog.formData.organ_id = row.organ_id;
      this.$refs.setTeamMembersDialog.formData.class_id = row.id;
      this.$refs.setTeamMembersDialog.formData.ex_class_name = row.name;
      this.reqTeamMembersInfo(row);
    },
    // 获取党组织班子成员
    reqTeamMembersInfo(row) {
       let parmas = {
        id: row.organ_id,
        class_id: row.id,
      }
      this.$client.ListClassUserPartyOrgan(parmas)
        .then(res => {
          if (res.head.result == "200") {
            this.teamMembersInfoData = res.context.list;
            this.loading = false
          } else {
            this.loading = false
            this.teamMembersInfoData = [];
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          };
          this.loading = false;
        })
    },
    // 添加党组织班子成员信息
    addTeamMembersInfo(row) {
      this.curTeamRow = row;
      this.showMembersTitle = '新增党组织班子成员';
      this.isShowTeamMembersInfo = true;
      // 获取当前换届信息的班子成员
      this.$refs.setTeamMembersDialog.configCircuitfInfo(row.organ_id);
      this.$refs.setTeamMembersDialog.formData.organ_id = row.organ_id;
      this.$refs.setTeamMembersDialog.formData.class_id = row.id;
       this.$refs.setTeamMembersDialog.formData.ex_class_name = row.name;
      // this.reqTeamMembersInfo(row);
    },
    // 编辑党组织班子成员信息
    editTeamMembersInfo(row) {
      this.$refs.setTeamMembersDialog.configCircuitfInfo(row.organ_id);
      this.curSecondType = 'edit';
      this.showMembersTitle = '修改党组织班子成员'
      this.isShowTeamMembersInfo = true;
      this.$refs['setTeamMembersDialog'].setData(row)

    },
    // 确认添加班子成员
    sureSubmitTeamMembers(info) {
      let params = {
        context: info
      }
      this.$client.AddPartyClassUserPartyOrgan(params).then(res => {
        if(res.head.result == '200') {
          this.isShowTeamMembersInfo = false
          this.reqTeamMembersInfo({id: info.class_id,organ_id: info.organ_id});
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
    // 删除党组织班子成员信息
    deleteTeamMembersInfo(info) {
      let parmas = {
          context: [info.id],
        };
        this.$client.BatchDeleteClassUserPartyOrgan(parmas)
        .then(res => {
          if(res.head.result == '200') {
            this.reqTeamMembersInfo({id: info.class_id,organ_id: info.organ_id});
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


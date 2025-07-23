<template>
  <div class="claim-settlement" style="height:470px;overflow-x:hidden">
      
      <div class="use-table-record show-flex-box-c" style="margin:0 20px;">
        <div class="show-flex-box-r" style="margin-bottom:20px;">
          <el-button type="primary" @click="onBtn('add')" icon="el-icon-plus" size="mini" v-if="curChangeType != 'detail'">添加</el-button>
          <el-button type="primary" @click="onBtn('delete')" icon="el-icon-delete" size="mini" v-if="curChangeType != 'detail'">删除</el-button>
          <el-button type="primary" @click="onBtn('export')" icon="el-icon-download" size="mini">导出</el-button>
        </div>
        <span style="margin-bottom:20px; color:#33333385; font-size: 14px;">说明：必须保存事故基本信息后才能编辑理赔信息。事故结案后将无法再次编辑。</span>
        <div class="table">
          <tr-table
            :selectionShow="true"
            :data="claimsettlementRecordList"
            :tableHeaderList="canRendererTableHeader"
            :isShowBottomOptions="false"
            :TableHeight="TableHeight"
            :loading="loading"
            :frontFixedNum="0"
            :backFixedNum="1"
            @on-select-change-row="selectedList"
          >
            <template slot-scope="scope" slot="insurance_code">
              <span>{{scope.data.insurance_code? (scope.data.insurance_code + scope.data.type_name) : scope.data.type_name}}</span>
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
      <!-- 弹窗 -->
      <div>
        <!-- 添加弹窗 -->
        <claimsettlement-dialog
          ref="claimsettlementDialog"
          :curType="curType"
          :insuranceMumberList="insuranceMumberList"
          :showCasualtiesTitle="showCasualtiesTitle"
          :dialogBool.sync="isShowAddDialog"
          @sure-submit-claimsettlement="sureSubmitClaimsettlement"
        ></claimsettlement-dialog>
      </div>
  </div>
</template>
<script>
import claimsettlementDialog from '../dialog/claimsettlement-dialog.vue'
export default {
  components: {claimsettlementDialog},
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
          label: "关联保单号",
          prop: "insurance_code",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "保险公司",
          prop: "company",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "保险种类", 
          prop: "type_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "保险有效期",
          prop: "insurance_end",
          width: "165",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "保单金额",
          prop: "insure_fee",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "理赔提交金额",
          prop: "actual_fee",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "理赔完成日期",
          prop: "finish_date",
          width: "160",
          align: "center",
          signIndex: 6,
          sortable: true,
        },{
          id: 8,
          label: "保险赔付金额",
          prop: "insurance_fee",
          width: "160",
          align: "center",
          signIndex: 7,
          sortable: true,
        },{
          id: 9,
          label: "理赔进度",
          prop: "state_name",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },{
          id: 10,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },{
          id: 11,
          label: "操作",
          prop: "operation",
          width: "150",
          align: "center",
          signIndex: 10,
          sortable: false,
        }
      ],
      TableHeight:380,
      curType: 'add',
      curInfo:{}, //当前操作的事故
      isShowAddDialog: false,
      showCasualtiesTitle:'添加理赔详情',
      selectedIds:[], //勾选的ids
      claimsettlementRecordList:[], //人员理赔记录列表
      loading: false,
      insuranceMumberList:[], //保险单号列表
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
    },
    // 数据回显
    setData(val){
      this.curInfo = val;
      console.log(val)
      this.reqListCostAccidentManage();
      if(!!val.i_vehicle_id) {
        this.reqInsuranceMumberList()
      }
      
    },
    // 获取理赔记录
    reqListCostAccidentManage() {
      this.loading = true
      let parmas = {
        id: this.curInfo.i_id,
      }
      this.$client.listCostAccidentManage(parmas)
        .then(res => {
          if (res.head.result == "200") {
            this.claimsettlementRecordList = res.context.list;
            this.loading = false
          } else {
            this.loading = false
            this.claimsettlementRecordList = [];
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          };
          this.loading = false;
        })
    },
    // 获取车辆保险单号
    reqInsuranceMumberList() {
      let params = {
        vehicle_ids: [this.curInfo.i_vehicle_id]
      };
      this.$client.getByPageVehicleInsurance(params)
        .then(res => {
          if (res.head.result == "200") {
            console.log(res)
            this.insuranceMumberList = res.context.list;
            this.insuranceMumberList.forEach(element => {
              if(!!element.insurance_code) {
                element.insurance_code = element.insurance_code + element.type_name
              }else{
                element.insurance_code = element.type_name
              }
              
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
    // 操作
    onBtn(type) {
      switch (type) {
        case 'add':
          this.curType = 'add';
          this.showCasualtiesTitle = '添加理赔详情'
          this.isShowAddDialog = true
          break;
        case 'delete':
          this.deleteClaimsettlementRecode()
          break;
        case 'export':
          this.exportFile();
          break;
      }
    },
    // 导出Excel
    exportFile(){
      let parmas = {
        id: this.curInfo.i_id
      }
      this.$client.exportCostAccidentManage(parmas)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })
    },
    // 编辑理赔信息
    editInfo(row) {
      this.curType = 'edit';
      this.showCasualtiesTitle = '编辑理赔详情'
      this.rowId = row.id;
      // this.$refs.damageDialog.setData(row)
      this.$refs['claimsettlementDialog'].setData(row)
      this.isShowAddDialog = true;
    },
    // 确定添加
    sureSubmitClaimsettlement(info) {
      // console.log(info)
      if(this.curType == 'edit') {
        info.id = this.rowId
      }
      info.accident_id = this.curInfo.i_id;
      let params = {
        context: info
      }
      // console.log(params)
      // return
      if(!params.context.id) {
        this.$client.addCostAccidentManage(params).then(res => {
          if(res.head.result == '200') {
            this.isShowAddDialog = false
            this.reqListCostAccidentManage();
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
      }else{
        this.$client.EditCostAccidentManage(params).then(res => {
          if(res.head.result == '200') {
            this.isShowAddDialog = false
            this.reqListCostAccidentManage();
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
      }
    },
    // 勾选
    selectedList(list) {
      this.selectedIds = [];
      if(list && list.length > 0) {
        list.forEach((item,index) => {
          this.selectedIds.push(item.id)
        });
      }
    },
    // 删除车损信息
    deleteInfo(row) {
      this.selectedIds = [];
      this.selectedIds.push(row.id)
      if(this.selectedIds.length > 0) {
        this.deleteClaimsettlementRecode()
      }
    },
    // 删除理赔记录
    deleteClaimsettlementRecode() {
      if(this.selectedIds.length == 0) {
          this.$message({
            showClose: true,
            message: '请勾选至少一条要移除的',
            type: "warning",
          });
          return
        }

        let parmas = {
          context: this.selectedIds,
        };
        this.$client.deleteCostAccidentManage(parmas)
        .then(res => {
          if(res.head.result == '200') {
            this.selectedIds = [];
            this.reqListCostAccidentManage();
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

  .claim-settlement /deep/ .el-input{
    width: 420px;
  }

  .claim-settlement /deep/ .el-input--mini{
    width: 420px;
  }

  .claim-settlement/deep/ .el-date-editor {
    width: 420px;
  }
</style>


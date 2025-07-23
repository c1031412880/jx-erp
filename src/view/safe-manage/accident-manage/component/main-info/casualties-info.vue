<template>
  <div class="install-info" style="height:470px;overflow-x:hidden">
      
      <div class="use-table-record show-flex-box-c" style="margin:0 20px;">
        <div class="show-flex-box-r" style="margin-bottom:20px;">
          <el-button type="primary" @click="onBtn('add')" icon="el-icon-plus" size="mini" v-if="curChangeType != 'detail'">添加</el-button>
          <el-button type="primary" @click="onBtn('delete')" icon="el-icon-delete" size="mini" v-if="curChangeType != 'detail'">删除</el-button>
          <el-button type="primary" @click="onBtn('export')" icon="el-icon-download" size="mini">导出</el-button>
        </div>
        <span style="margin-bottom:20px; color:#33333385; font-size: 14px;">说明：必须保存事故基本信息后才能编辑人伤信息。事故结案后将无法再次编辑。</span>
        <div class="table">
          <tr-table
            :selectionShow="true"
            :data="casualtiesRecordList"
            :tableHeaderList="canRendererTableHeader"
            :isShowBottomOptions="false"
            :TableHeight="TableHeight"
            :loading="loading"
            :frontFixedNum="0"
            :backFixedNum="1"
            @on-select-change-row="selectedList"
          >
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
        <casualties-dialog
          ref="casualtiesDialog"
          :curType="curType"
          :curInfo="curInfo"
          :showCasualtiesTitle="showCasualtiesTitle"
          :dialogBool.sync="isShowAddDialog"
          @sure-submit-casualties="sureSubmitCasualties"
        ></casualties-dialog>
      </div>
  </div>
</template>
<script>
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import casualtiesDialog from '../dialog/casualties-dialog.vue'
export default {
  components: {getVehicleSelectTree,casualtiesDialog},
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
          label: "姓名",
          prop: "c_person_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "年龄",
          prop: "i_person_age",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "人员类型", //1对方 2己方
          prop: "person_type",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "身份证号",
          prop: "c_person_code",
          width: "165",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "联系方式",
          prop: "c_person_phone",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "单位",
          prop: "c_work",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "住址",
          prop: "c_address",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },{
          id: 8,
          label: "治疗医院",
          prop: "c_hospistal",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        // {
        //   id: 9,
        //   label: "受损物品金额",
        //   prop: "n_good_fee",
        //   width: "160",
        //   align: "center",
        //   signIndex: 8,
        //   sortable: true,
        // },
        {
          id: 9,
          label: "伤情描述",
          prop: "c_describe",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "医疗费",
          prop: "n_medical_fee",
          width: "160",
          align: "center",
          signIndex: 9,
          sortable: true,
        },
        {
          id: 11,
          label: "误工费",
          prop: "n_missed_fee",
          width: "160",
          align: "center",
          signIndex: 10,
          sortable: true,
        },
        {
          id: 12,
          label: "护理费",
          prop: "n_nursing_fee",
          width: "160",
          align: "center",
          signIndex: 11,
          sortable: true,
        },
        {
          id: 13,
          label: "伙食费",
          prop: "n_food_fee",
          width: "160",
          align: "center",
          signIndex: 12,
          sortable: true,
        },
        {
          id: 14,
          label: "交通费",
          prop: "n_traffic_fee",
          width: "160",
          align: "center",
          signIndex: 13,
          sortable: true,
        },
        {
          id: 15,
          label: "伤残赔偿金",
          prop: "n_disability_fee",
          width: "160",
          align: "center",
          signIndex: 14,
          sortable: true,
        },
        {
          id: 16,
          label: "死亡赔偿金",
          prop: "n_death_fee",
          width: "160",
          align: "center",
          signIndex: 15,
          sortable: true,
        },
        {
          id: 17,
          label: "丧葬费",
          prop: "n_funeral_fee",
          width: "160",
          align: "center",
          signIndex: 16,
          sortable: true,
        },
        {
          id: 18,
          label: "精神损失费",
          prop: "n_mental_fee",
          width: "160",
          align: "center",
          signIndex: 17,
          sortable: true,
        },
        {
          id: 19,
          label: "操作",
          prop: "operation",
          width: "150",
          align: "center",
          signIndex: 18,
          sortable: false,
        }
      ],
      TableHeight:380,
      curType: 'add',
      curInfo:{}, //当前操作的事故
      isShowAddDialog: false,
      showCasualtiesTitle:'添加人伤详情',
      selectedIds:[], //勾选的ids
      casualtiesRecordList:[], //人员人伤记录列表
      loading: false
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
      this.reqCasualtiesRecordList();
    },
    // 获取人伤记录
    reqCasualtiesRecordList() {
      this.loading = true
      let parmas = {
        i_id: this.curInfo.i_id,
      }
      this.$client.getCasualtiesRecordList(parmas)
        .then(res => {
          if (res.head.result == "200") {
            this.casualtiesRecordList = res.context.list;
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
    // 操作
    onBtn(type) {
      switch (type) {
        case 'add':
          this.curType = 'add';
          this.showCasualtiesTitle = '添加人伤详情'
          this.isShowAddDialog = true
          break;
        case 'delete':
          this.deleteCasualtiesRecode()
          break;
        case 'export':
          this.exportFile();
          break;
      }
    },
    // 导出Excel
    exportFile(){
      let parmas = {
        i_id: this.curInfo.i_id
      }
      this.$client.exportCasualties(parmas)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })
    },
    // 编辑人伤信息
    editInfo(row) {
      this.curType = 'edit';
      this.showCasualtiesTitle = '编辑人伤详情'
      this.rowId = row.i_id;
      // this.$refs.damageDialog.setData(row)
      this.$refs['casualtiesDialog'].setData(row)
      this.isShowAddDialog = true;
    },
    // 确定添加
    sureSubmitCasualties(info) {
      // console.log(info)
      if(this.curType == 'edit') {
        info.i_id = this.rowId
      }
      info.i_main_id = this.curInfo.i_id;
      let params = {
        context: info
      }

      if(!params.context.i_id) {
        this.$client.addCasualtiesRecordInfo(params).then(res => {
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
      }else{
        this.$client.EditCasualtiesAccidentManage(params).then(res => {
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
      }
      
    },
    // 勾选
    selectedList(list) {
      this.selectedIds = [];
      if(list && list.length > 0) {
        list.forEach((item,index) => {
          this.selectedIds.push(item.i_id)
        });
      }
    },
    // 删除车损信息
    deleteInfo(row) {
      this.selectedIds = [];
      this.selectedIds.push(row.i_id)
      if(this.selectedIds.length > 0) {
        this.deleteCasualtiesRecode()
      }
    },
    // 删除人伤记录
    deleteCasualtiesRecode() {
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
        this.$client.deleteCasualtiesInfo(parmas)
        .then(res => {
          if(res.head.result == '200') {
            this.selectedIds = [];
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
    }
    
  }
}

</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>

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


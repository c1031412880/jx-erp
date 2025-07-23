<template>
  <div class="install-info" style="height:470px;overflow-x:hidden">
    <el-card class="box-card" shadow="hover" style="margin-bottom: 10px;">
      <div slot="header" class="clearfix" style="padding: 0px;">
        <span style="line-height: 28px;">党费缴纳信息</span>
        <el-button style="float: right;" type="primary" @click="onBtn('add')" icon="el-icon-plus" size="mini" v-if="curChangeType != 'detail'">新增</el-button>
      </div>
      <div class="use-table-record show-flex-box-c" style="margin:0 20px;">
        <div class="table">
          <tr-table
            :selectionShow="false"
            :data="partyDeeData"
            :tableHeaderList="canRendererTableHeader"
            :isShowBottomOptions="false"
            :TableHeight="TableHeight"
            :loading="loading"
            :frontFixedNum="0"
            :backFixedNum="1"
          >
            <template slot-scope="scope" slot="ratio">
              <span v-if="scope.data.ratio">{{scope.data.ratio? (scope.data.ratio + '%'): '0%'}}</span>
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
      <set-pay-dues-dialog
        ref="setPayDuesDialog"
        :curType="curType"
        :showPartyDeeTitle="showPartyDeeTitle"
        :dialogBool.sync="isShowAddDialog"
        @sure-submit-casualties="sureSubmitCasualties"
      ></set-pay-dues-dialog>
    </div>
  </div>
</template>
<script>
import setPayDuesDialog from './set-pay-dues-dialog'
export default {
  components: {setPayDuesDialog},
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
          label: "缴纳党费标准",
          prop: "ex_standard",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "实发工资",
          prop: "wage",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "缴纳基数", 
          prop: "base_pay",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "党费计算比例",
          prop: "ratio",
          width: "165",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "应缴党费（元）",
          prop: "should_fee",
          width: "165",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "本次缴纳月份（月）",
          prop: "submit_date",
          width: "165",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "本次缴纳金额（元）",
          prop: "actual_fee",
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
      curInfo:{}, //当前党员记录
      isShowAddDialog: false,
      showPartyDeeTitle:'新增党费缴纳',
      partyDeeData:[], //党费
      loading: false,
    }
  },
  methods: {
    // 初始化数据
    resetData(){ 
      this.partyDeeData = [];
    },
    // 数据回显
    setData(val){
      this.curInfo = val;
      this.reqPartyFeeRecordList();
    },
    // 获取党费记录
    reqPartyFeeRecordList() {
      this.loading = true
      let parmas = {
        party_user_id: this.curInfo.id,
      }
      this.$client.ListPartyFee(parmas).then(res => {
        if (res.head.result == "200") {
          this.partyDeeData = res.context.list;
          this.loading = false
        } else {
          this.loading = false
          this.partyDeeData = [];
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        };
        this.loading = false;
      })
    },
    // 打开添加弹窗
    onBtn(type) {
      this.curType = type;
      this.showPartyDeeTitle = '新增党费缴纳'
      this.isShowAddDialog = true
    },
    // 编辑职务
    editInfo(row) {
      this.curType = 'edit';
      this.showPartyDeeTitle = '修改党费缴纳'
      this.$refs['setPayDuesDialog'].setData(row)
      this.isShowAddDialog = true;
    },
    // 确定添加
    sureSubmitCasualties(info) {
      info.party_user_id = this.curInfo.id;
      let params = {
        context: info
      }
      this.$client.AddPartyFeePartyFee(params).then(res => {
        if(res.head.result == '200') {
          this.isShowAddDialog = false
          this.reqPartyFeeRecordList();
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
      this.$client.BatchDeletePartyFee(parmas)
      .then(res => {
        if(res.head.result == '200') {
          this.reqPartyFeeRecordList();
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


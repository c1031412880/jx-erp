<template>
  <div class="transfer-balance-details">
    <div class="content-header">
      <span class="title">余额：{{day}}天</span>
      <!-- <el-button @click="modifyBalanceInfoShow = true" size="mini" type="primary">修改余额</el-button>
      <el-button @click="ruleDialogShow = true" v-if="$isPowerShow('rule')" size="mini" type="primary">设置规则</el-button> -->
    </div>
    <tr-table
      :data="data"
      :loading="loading"
      :selectionShow="false"
      :TableHeight="TableHeight"
      :backFixedNum="backFixedNum"
      :frontFixedNum="frontFixedNum"
      :tableHeaderList="customSettingList">
      <template slot-scope="scope" slot="expire_date">
        <span v-if="scope.data.is_expire == 0">{{ scope.data.expire_date }}</span>
        <span v-else>
          {{ scope.data.expire_date }}
          <span style="color: red;">(已过期)</span>
        </span>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button @click="openDetailInfo(scope.data)" type="text" size="mini">查看</el-button>
          <!-- <el-popconfirm
            v-if="$isPowerShow('delete')"
            @confirm="onDelete(scope.data.id)"
            title="确定删除吗？">
            <el-button slot="reference" type="text" size="mini" style="margin-left: 10px;">删除</el-button>
          </el-popconfirm> -->
      </template>
    </tr-table>

    <!-- 修改年假余额 -->
    <modify-balance-info
      ref="modifyBalanceInfo"
      :title="showTitle"
      @save-add-edit="saveAddEdit"
      :dialogBool.sync="modifyBalanceInfoShow"
    >
    </modify-balance-info>

    <!-- 设置规则 -->
    <rule-dialog
      :dialogBool.sync="ruleDialogShow">
    </rule-dialog>

    <!-- 查看明细 -->
    <detail-dialog
      ref="detailInfo"
      :date="date"
      @on-close="onCloseDialog"
      :dialogBool.sync="detailDialogShow">
    </detail-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { getUser } from "@/utils/auth";
import ruleDialog from './component/rule-dialog'
import detailDialog from './component/detail-dialog'
import modifyBalanceInfo from './component/modify-balance-info'
export default {
  components: {
    ruleDialog,
    detailDialog,
    modifyBalanceInfo
  },
  props: {
    day: {
      type: Number,
      default: 0
    },
    user_id: {
      type: Number,
      default: 0
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      date: '',
      form: {},
      data: [],
      frontFixedNum:0, //前几行固定
      backFixedNum:1, //后几行固定
      loading: false,
      TableHeight: 660,
      showTitle:'修改年假余额',
      modifyBalanceInfoShow: false,
      ruleDialogShow: false,
      detailDialogShow: false,
      customSettingList: [
        {
          id: 1,
          label: "加班时间",
          prop: "finish_date",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "有效期",
          prop: "expire_date",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "转调休天数",
          prop: "compensatory_day",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "已使用天数",
          prop: "use_day",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "剩余调休",
          prop: "leave_day",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "操作",
          prop: "operation",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        }
      ],
    }
  },
  mounted() {
    // let userInfo = JSON.parse(getUser())
    // this.user_id = Number(userInfo.user_id)
    this.LoadDetailData()
  },
  watch: {
    visible(bool) {
      if(bool) {
        this.LoadDetailData()
      }else {
        this.data = []
      }
    }
  },
  methods: {
    LoadDetailData() {
      if(!this.user_id) return false
      this.loading = true
      let params = {context:{user_id: this.user_id}}
      this.$client.GetCompensatoryDetailRestManage(params).then(res => {
          this.loading = false
          if(res.head.result == '200') {
            this.data = res.context.list
          }else{
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {this.loading = false; console.log(err);})
    },
    // 保存修改年假余额
    saveAddEdit(form) {
      let params = Object.assign({}, form)
      params.type = 13
      params.user_id = this.user_id
      this.$client.UpdateYearBalanceLeaveBalance(params)
      .then(res => {
        if (res.head.result == "200") {
          this.LoadDetailData()
          this.modifyBalanceInfoShow = false
          this.$message({
            showClose: true,
            message: '修改成功',
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
    // 打开审批单
    openDetailInfo(row) {
      this.detailDialogShow = true
      setTimeout(() => {
        this.$refs.detailInfo.setDate(row)
      }, 300);
      // let params = {context: row.overtime_id}
      // this.$client.GetOverCompensatoryDetailsRestManage(params)
      //   .then(res => {
      //     if (res.head.result == "200") {
      //       this.date = row.finish_date
      //       this.detailDialogShow = true
      //       this.$refs.detailInfo.data = res.context
      //     } else {
      //       this.$message({
      //         showClose: true,
      //         message: res.head.describle,
      //         type: "error",
      //       });
      //     }
      //   }).catch(err => {
      //       this.$message({
      //       showClose: true,
      //       message: err.body.message,
      //       type: "error",
      //     });
      //   })
    },
    onCloseDialog() {
      this.detailDialogShow = false
      this.$emit('on-close')
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.transfer-balance-details {
  height: 75vh;
  width: 100%;
  .content-header {
    margin-bottom: 10px;
    .title {
      font-size: 16px;
      font-weight: 600;
      margin-right: 20px;
      color: #333333
    }
  }
}
</style>
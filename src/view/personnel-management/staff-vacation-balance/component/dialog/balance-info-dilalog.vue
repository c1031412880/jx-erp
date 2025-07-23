<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="900px"
  >
    <div slot="title">
      <div class="show-flex-box-r show-flex-center" style="height: 50px; background: #f5f5f5f5; padding-left: 15px;">
      <span>{{title}}</span>
      </div>
    </div>
    <div class="el-dialog-div">
      <div class="show-flex-box-c show-flex-center">
        <span>{{userName}}</span>
        <span style="margin: 8px 0">{{deptName}}&nbsp; {{EntryTime}}&nbsp; 入职  </span>
      </div>
      <div style="">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="item.label" :name="item.name" v-for="(item,index) in activeNameList" :key="item.name">
            <div>
              <div class="show-flex-box-r" style="align-items: center;">
                <strong>余额： {{item.remainingDays}}天</strong>
                <el-button type="primary" plain size="mini" style="margin: 14px;" @click="openModifyPop(item)" v-if="isUpdate">修改余额</el-button>
                <span v-if="!!oaLeaveDetailInfo && activeName === 'first'">{{oaLeaveDetailInfo.rule}}</span>
              </div>
              <div style="height:280px;padding: 0 5px;" :style="item.data.length > 2 ? 'overflow-y: scroll':''" v-if="!!item.data.length">
                <el-timeline>
                  <el-timeline-item :type="ele.model==1?'primary': ele.model==2?'danger':'info'" :timestamp="ele.created_date" placement="top" v-for="(ele,index) in item.data" :key="index + 'mx'">
                    <el-card>
                      <h4 style="margin-bottom: 10px;">{{ele.model==1?'+':'-'}}{{ele.value}}天 <span>&nbsp; &nbsp;有效期: &nbsp;{{ele.start_time}}至{{ele.end_time}}</span></h4>
                      <p>{{ele.content}}</p>
                    </el-card>
                  </el-timeline-item>
                </el-timeline>
              </div>
              <div style="height:280px;padding: 0 5px;" v-else>
                <el-empty description="暂无记录"></el-empty>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!-- 修改年假余额 -->
    <modify-balance-info
      ref="modifyBalanceInfo"
      :title="showTitle"
      :dialogBool.sync="modifyBalanceInfoShow"
      @save-add-edit="saveAddEdit"
    >
    </modify-balance-info>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import modifyBalanceInfo from './modify-balance-info'
export default {
  components: {modifyBalanceInfo},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "个人假期管理",
    },
    userName:[String],
    deptName:[String],
    EntryTime:[String],
    curSelecedType: [String],
    userId:[String,Number]
  },
  mounted() {},
  data() {
    return {
      activeNameList:[
        {
          id: 1,
          name:'first',
          label:'年假',
          remainingDays: 0,
          data: [],
          type: 5
        },
        {
          id: 4,
          name:'fourth',
          label:'调休假',
          remainingDays: 0,
          data: [],
          type: 13
        },
        {
          id: 5,
          name:'fifth',
          label:'婚假',
          remainingDays: 0,
          data: [],
          type: 6
        },
        {
          id: 3,
          name:'third',
          label:'育儿假',
          remainingDays: 0,
          data: [],
          type: 11
        },
        {
          id: 2,
          name:'second',
          label:'独生子女假',
          remainingDays: 0,
          data: [],
          type: 12
        },
        {
          id: 4,
          name:'sixth',
          label:'护理假',
          remainingDays: 0,
          data: [],
          type: 14
        },
      ],
      activeName:'first',
      activeNameMap:{
        'first': 5,
        'second': 12,
        'third': 11,
        'fourth': 13,
        'fifth': 6,
        'sixth': 14,
      },
      
      showTitle:'修改年假余额',
      modifyBalanceInfoShow: false,
      loading: false,
      oaLeaveDetailInfo:{},
      type: 5,
      isUpdate: false,
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        this.$nextTick(() => {
          // this.reqBusRequest()
          this.isUpdate = this.$parent.$isPowerShow('update')
        })
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    handleClick(tab, event) {
      // console.log(tab, event);
      // this.reqYearBalanceDetail(this.userId,this.activeNameMap[tab.name])
    },
    reqYearBalanceByUser(user_id, type) {
      let params = {
        user_id: user_id,
        type: type,
      }
      this.$client.GetYearBalanceByUserLeaveBalance(params)
      .then(res => {
        if (res.head.result == "200") {
          this.activeNameList.forEach(item => {
            if (item.type == type) {
              item.remainingDays = res.context
            }
          })
          // switch (type) {
          //   case 5:
          //     this.activeNameList[0].remainingDays = res.context
          //     break;
          //   case 11:
          //     this.activeNameList[2].remainingDays = res.context
          //     break;
          //   case 12:
          //     this.activeNameList[1].remainingDays = res.context
          //     break;
          //   case 13:
          //     this.activeNameList[1].remainingDays = res.context
          //     break;
          //   default:
          //     break;
          // }
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
    // 获取假期余额明细详情
    reqYearBalanceDetail(user_id,type) {
      if(!!type) {
        this.loading = true
        let params = {
          user_id: user_id,
          type: type,
        }
        this.$client.GetDetailLeaveBalance(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.activeNameList.forEach(item => {
              if (item.type == type) {
                item.data = res.context
              }
            })
            // switch (type) {
            //   case 5:
            //     this.activeNameList[0].data = res.context
            //     break;
            //   case 11:
            //     this.activeNameList[2].data = res.context
            //     break;
            //   case 12:
            //     this.activeNameList[1].data = res.context
            //     break;
            //   case 13:
            //     this.activeNameList[3].data = res.context
            //     break;
            //   default:
            //     break;
            // }
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
            this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
      }else{
        this.data = []
      }
    },
    // 获取年假明细
    reqOaLeaveDetailById(id){
      let params = {
        id: id,
      }
      this.$client.GetOaLeaveDetailByIdLeaveBalance(params)
      .then(res => {
        if (res.head.result == "200") {
          this.oaLeaveDetailInfo = res.context;
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
    // 打开修改弹窗
    openModifyPop(val) {
      this.modifyBalanceInfoShow = true
      switch (val.type) {
        case 5:
          this.showTitle = "修改年假余额"
          break;
        case 6:
          this.showTitle = "修改婚假余额"
          break;
        case 11:
          this.showTitle = "修改育儿假余额"
          break;
        case 12:
          this.showTitle = "修改独生子女假余额"
          break;
        case 13:
          this.showTitle = "修改调休假余额"
          break;
        case 14:
          this.showTitle = "修改护理假余额"
          break;
        default:
          break;
      }
      this.type = this.activeNameMap[val.name]
      this.$refs.modifyBalanceInfo.form.user_id = this.userId
    },
    // 保存修改年假余额
    saveAddEdit(form) {
      let params = Object.assign({}, form)
      params.type = this.type
       this.$client.UpdateYearBalanceLeaveBalance(params)
      .then(res => {
        if (res.head.result == "200") {
          this.reqYearBalanceByUser(this.userId, this.type)
          this.reqYearBalanceDetail(this.userId, this.activeNameMap[this.activeName])
          this.modifyBalanceInfoShow = false
          this.$parent.loadData()
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
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog__wrapper /deep/ .el-dialog__header{
  padding: 0 !important;
}
.el-dialog__wrapper /deep/ .el-dialog__body{
  padding: 10px 20px !important;
}
.el-dialog-div{
  height: 450px;
  // overflow-y: scroll;
}
.el-dialog-div /deep/ .el-input {
  width: 420px;
}
</style>


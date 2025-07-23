<template>
  <div class="receipt-document-audit">
    <div v-loading="loading">
      <div class="head-image">
        <img :src="require('../../launch-affair/component/tableData/img/zhang1.png')" v-if="formData.state === 3" alt="">
        <img :src="require('../../launch-affair/component/tableData/img/zhang2.png')" v-if="formData.state === 5" alt="">
        <img :src="require('../../launch-affair/component/tableData/img/zhang3.png')" v-if="formData.state === 4" alt="">
      </div>
      <title-box-new :title="formData.ex_apply_name + '提出的会议室申请'">
        <div class="head-content">
          <p style="color: #BBBBBB;">审批编号:{{formData.flow_code}}</p>
          <p :style="{'color': outColor(formData.state)}">
            {{formData.state === 0  ? '发起审批' : formData.state_name}}
          </p>
        </div>
        <!-- <div slot="head"> -->
          <!-- <div v-if="formData.user_ids && formData.user_ids.includes(userId)"> -->
            <!-- <el-dropdown style="float: right;"  trigger="click" @command="handleCommand">
              <el-button size="mini">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="3">退  回</el-dropdown-item>
                <el-dropdown-item command="4">转  交</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button style="float: right; margin: 0 10px;" type="" size="mini" @click="openOpinionDialog(2)">拒绝</el-button>
            <el-button style="float: right; " type="primary" size="mini" @click="openOpinionDialog(1)">同意</el-button>
          </div> -->
          <!-- <div> -->
            <!-- 1未发起处理2处理中3处理完成4已驳回5已作废 -->
            <!-- <el-button style="float: right; margin: 0 10px;" type="primary" size="mini" @click="cancellation()" v-if="formData.created_id === userId && formData.state <= 2">撤销</el-button> -->
          <!-- </div> -->
        <!-- </div> -->
        <!-- <el-descriptions >
          <el-descriptions-item label="审批编号">{{formData.flow_code}}</el-descriptions-item>
          <el-descriptions-item label="处理流程状态">
            <el-tag size="medium" :type="formData.state === 4 ? 'danger' : ''">
              {{(formData.state === 2 && formData.user_names) ? `${formData.user_names}` : formData.state_name}}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions> -->
      </title-box-new>
      <item-box-new title="基本信息">
        <el-row :gutter="20">
          <el-col :span="12">
            <p>会议室申请人</p>
            <em>{{formData.ex_apply_name}}</em>
          </el-col>
          <el-col :span="12">
            <p>参会人员</p>
            <em>{{formData.ex_person_name_str}}</em>
          </el-col>
          <el-col :span="12">
            <p>会议室名称</p>
            <em>{{formData.ex_meeting_name}}</em>
          </el-col>
          <el-col :span="12">
            <p>会议内容</p>
            <em>{{formData.content}}</em>
          </el-col>
          <el-col :span="12">
            <p>开始时间</p>
            <em>{{formData.begin_time}}</em>
          </el-col>
          <el-col :span="12">
            <p>结束时间</p>
            <em>{{formData.end_time}}</em>
          </el-col>
          <!-- <el-col :span="24">
            <image-file-upload
              :images="formData.img_list"
              :files="formData.file_list"
              :isShowBox="false"></image-file-upload>
          </el-col> -->
        </el-row>
      </item-box-new>
      <item-box-new title="审核流程">
        <div v-if="!!formData.flow_id && !loading">
          <approve-schedule style="margin-left: 10px;" :isFlow="false" :flow_id="formData.flow_id" @out-data="getStepData"></approve-schedule>
        </div>
      </item-box-new>
      <div class="bottom-box">
        <div class="btn-left show-flex-box-r">
          <!-- <div class="btn-item show-flex-box-r"  v-if="formData.created_id === userId && formData.state < 2" @click="openUrgeDialog()">
            <img :src="require('../../../../assets/approverStepIcon/cuiban.png')" alt="">
            <span>催办</span>
          </div> -->
          <div class="btn-item show-flex-box-r"  v-if="formData.created_id === userId && formData.state <= 2" @click="cancellation()">
            <i class="el-icon-remove-outline"></i>
            <span>撤销</span>
          </div>
          <!-- <div class="btn-item show-flex-box-r" @click="openCommentDialog()">
            <img :src="require('../../../../assets/approverStepIcon/pinglun(1).png')" alt="">
            <span>评论</span>
          </div>
          <div class="btn-item show-flex-box-r" @click="onPrintAudit">
            <i class="el-icon-printer"></i>
            <span>打印</span>
          </div>
          <div class="btn-item show-flex-box-r" @click="markApply">
            <i class="el-icon-s-flag" :style="{'color': setColor(this.markState)}"></i>
            <span>标记</span>
          </div> -->
        </div>
        <div  v-if="formData.user_ids && formData.user_ids.includes(userId)">
          <!-- <el-dropdown trigger="click"  @command="handleCommand">
            <el-button size="small">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="3">退  回</el-dropdown-item>
              <el-dropdown-item command="4">转  交</el-dropdown-item>
              <el-dropdown-item command="5" v-if="!!isAddCheck">加  签</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
          <el-button size="small" @click="openOpinionDialog(2)">拒 绝</el-button>
          <el-button size="small" type="primary" @click="openOpinionDialog(1)">同 意</el-button>
        </div>
        <!-- <div v-show="formData.created_id === userId && formData.state == 7">
          <el-button size="small" type="primary" @click="UpdateContract(1)">重新发起</el-button>
        </div> -->
        <!-- <div v-show="formData.created_id === userId && formData.state == 1">
          <el-button size="small" type="primary" @click="UpdateContract(0)">重新提交</el-button>
        </div> -->
      </div>
      <el-dialog
        width="500px"
        title="审核意见"
        :visible.sync="opinionShow"
        append-to-body
      >
        <el-form label-width="80px">
          <el-form-item label="意见: ">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              v-model="subForm.remark">
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="opinionShow = false">取 消</el-button>
          <el-button type="primary" @click="submitFormData">确 定</el-button>
        </span>
      </el-dialog>
      <return-forward-dialog
        :subForm="subForm"
        :returnUsers="returnUsers"
        :isReturnToOriginator="isReturnToOriginator"
        :dialogBool.sync="returnShow"
        @on-load="loadData"
        @on-opinion="opinionShow = false"
      ></return-forward-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import titleBoxNew from "../component/title-box-new";
import itemBoxNew from "../component/item-box-new";
import approveSchedule from "../../../../components/approve-echo/approve-schedule2";
import returnForwardDialog from '../component/return-forward-dialog';

import { getUser } from "@/utils/auth";
export default {
  name: "meetting-detail-audit",
  components: {
    itemBoxNew,
    titleBoxNew,
    approveSchedule,
    returnForwardDialog
  },
  data() {
    return {
      loading: false,
      formData: {
        flow_id:0
      },
      subForm:{
        flow_id:'', //流程记录id
        step_id:'', //节点id
        state:'', //状态(0待处理1通过2拒绝3退回4转交)
        object_id:'', //对象id(退回节点id/转交用户id)
        remark:'', //备注
      },
      opinionShow: false,
      userId:'',
      returnShow: false,
      isReturnToOriginator: true , //是否允许退回到发起人
      returnUsers:[]
    };
  },
  props: {
    id: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    id() {
      if (this.id) {
        this.loadData();
      }
    },
    opinionShow() {
      if(!this.opinionShow) {
        this.subForm.remark = '';
      }
    },
    returnShow() {
      if(!this.returnShow) {
        this.subForm.object_id = '';
        // this.$refs.personalTree.onClear()
        this.subForm.remark = '';
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.loadData();
    });
  },
  methods: {
    outColor(state) {
      switch (state) {
        case 1:
          return '#F58A40'
          break;
        case 3:
          return '#0CB780'
          break;
        case 4:
          return '#F2260E'
          break;
        case 5:
          return '#999999'
          break;
      }
    },
    loadData() {
      if (!this.id) {
        return false;
      }
      this.userId = JSON.parse(getUser()).user_id;
      this.loading = true;
      this.$client.DetailMeetingRoom({ id: this.id}).then((res) => {
        this.loading = false;
        // console.log(res)
        eventOn.$emit('update-upcoming-matter')
        eventOn.$emit('update-upcoming-meeting-room')
        if(res.head.result == '200') {
          this.formData = res.context
          this.subForm.flow_id = res.context && res.context.flow_id
        }else{
          this.loading = false;
          this.$message({
            type: 'error',
            message: res.head.describle,
            showClose: true
          })
        }

      });
    },
    // 0待处理1通过2拒绝3退回4转交
    handleCommand(command) {
      // 3退回, 4转交
      this.subForm.state = command
      // alert(this.subForm.state)
      console.log(this.returnUsers)
      if(this.subForm.state == 3 && !this.returnUsers.length) {
        this.$message({ message: '没有审核成功退回节点,不能退回!', type: "warning"});
        return
      }
      this.returnShow = true
    },
    // 打开填写理由弹窗
    openOpinionDialog(type) {
      this.opinionShow = true
      this.subForm.state = type
      // this.subForm.state = 1
      // this.form.flow_id = this.formSubObj.id
    },
    // 选择转交用户
    userChange(users,nodes) {
      this.subForm.object_id = users.toString()
    },
    // 获取节点数据
    getStepData(data){
      console.log(data)
      let isFirst = true;
      if(data && !!data.length) {
        data.forEach((item,index) => {
          if(isFirst && item.state === 1) {
            this.subForm.step_id = item.id
            isFirst = false
          }
          if (index== 0 && item.oper_type==4) {
            this.isReturnToOriginator = item.return_back == 0 ? false : true
          }
          if (this.formData.state == 0 && item.state === 10) {
            this.subForm.step_id = item.id
          }
        });
      }
      this.buildReturnStep(data);
    },
    // 构建转交节点
    buildReturnStep(data) {
      this.returnUsers = [];
      if(data && !!data.length) {
        data.forEach((item,index) => {
          if(item.state === 3 && item.oper_type === 1) {
            let obj = {
              seq: item.id,
              title: item.users && item.users[0].name
            }
            this.returnUsers.push(obj)
          }
        });
      }
      // 如果允许退回到发起人
      if (this.isReturnToOriginator) {
        this.returnUsers.unshift({
          seq: 0,
          title: "退回到发起人"
        })
      }
    },
    // 提交同意和拒绝
    submitFormData() {
      // if(!this.subForm.remark) {
      //   this.$message({
      //     message: '请填写意见',
      //     type: 'warning'
      //   });
      //   return
      // }
      this.suerSubmitInfo();
    },
    // 转交、退回
    returnOk() {
      // if(!this.subForm.remark && this.subForm.state === 3) {
      //   this.$message({
      //     message: '请填写退回理由',
      //     type: 'warning'
      //   });
      //   return
      // }
      this.suerSubmitInfo();
    },
    // 确定提交
    suerSubmitInfo() {
      let info = this.$outFormData(this.subForm)
      this.$client.checkFlowRecord({ context: info }).then((req) => {
        setTimeout(() => {
          this.loadData();
        }, 100)
        if (req.head.result === "200") {
          if(this.subForm.state === 1 || this.subForm.state === 2) {
            this.opinionShow = false
          }else{
            this.returnShow = false
          }
          this.$message({
            message: req.head.describle,
            type: "success",
          });
        } else {
          this.$message.error(req.head.describle);
        }
      });
    },
    // 申请流程撤销（作废）
    cancellation() {

      this.$confirm('此操作将撤会这条审批记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$client.CancelFlowRecord({ context: this.formData.flow_id }).then((req) => {
          if (req.head.result === "200") {
            this.loadData();
            // eventOn.$emit('update-upcoming-matter')
            this.$message({
              message: req.head.describle,
              type: "success",
            });
          } else {
            this.$message.error(req.head.describle);
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消撤回'
        });
      });

    },


  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.receipt-document-audit {
  .head-image {
    position: absolute;
    top: 32px;
    right: 38px;
    img {
      height: 98px;
      width: 98px;
    }
  }
  .head-content {
    position: relative;
    width: 100%;
    p {
      font-size: 12px;
      font-weight: 400;
      margin-top: 15px;
    }
  }
  .el-row {
    .el-col {
      margin-bottom: 22px;
    }
    p {
      font-family: Source Han Sans SC-Medium, Source Han Sans SC;
      font-size: 12px;
      font-weight: 400;
      color: #999999;
      margin-bottom: 6px;
    }
    em, /deep/ .el-textarea__inner {
      font-size: 14px;
      font-weight: 500;
      color: #333333;
    }
  }
  .image-box {
    margin-bottom: 0px;
  }

  .bottom-box {
    height: 72px;
    width: 915px;
    position: fixed;
    bottom: 12px;
    z-index: 666;
    display: flex;
    justify-content: space-between;
    padding: 13px;
    background: #FFFFFF;
    box-shadow: 0px -1px 5px 1px rgba(0,0,0,0.2);
    .btn-item {
      flex-direction: column;
      margin-right: 12px;
      cursor: pointer;
      img {
        height: 22px;
        width: 22px;
      }
      i {
        font-size: 22px;
      }
      span {
        font-size: 12px;
        font-weight: 400;
        color: #333333;
      }
    }
  }
  .richText {
    width: 100%;
    /deep/ {
      .el-textarea__inner {
        background-color: #fff; 
        border: none;
        cursor: auto;
        padding: 0;
      }
    }
  }
}
.itemBox {
  .commonWords {
    .box {
      padding: 10px;  
      cursor: pointer;
      margin: 5px;
      word-break: keep-all;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: left;
      border-radius: 5px;
      background: #E8E7E7;
      color: #333333;
    }
  }
}
</style>

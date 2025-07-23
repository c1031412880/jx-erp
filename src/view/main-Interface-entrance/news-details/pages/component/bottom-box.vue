<template>
  <div class="bottom-box">
    <div class="btn-left show-flex-box-r">
      <div class="btn-item show-flex-box-r"  v-if="created_id === userId && state < 2 && state != 0 && !user_ids.includes(userId)" @click="openUrgeDialog()">
        <i class="el-icon-bell"></i>
        <span>催办</span>
      </div>
      <div class="btn-item show-flex-box-r"  v-if="created_id === userId && state <= 2 && state != 0" @click="cancelFlow()">
        <i class="el-icon-remove-outline"></i>
        <span>撤销</span>
      </div>
      <div class="btn-item show-flex-box-r" @click="openCommentDialog()">
        <i class="el-icon-chat-dot-square"></i>
        <span>评论</span>
      </div>
      <div class="btn-item show-flex-box-r" @click="onPrintAudit">
        <i class="el-icon-printer"></i>
        <span>打印</span>
      </div>
      <div class="btn-item show-flex-box-r" @click="markApply">
        <i class="el-icon-s-flag" :style="{'color': setColor(this.markState)}"></i>
        <span>标记</span>
      </div>
    </div>
    <div v-if="user_ids && user_ids.includes(userId)">
      <el-dropdown trigger="click"  @command="handleCommand">
        <el-button size="small">
          更多<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="3">退  回</el-dropdown-item>
          <el-dropdown-item command="4">转  交</el-dropdown-item>
          <el-dropdown-item command="5" v-if="!!isAddCheck">加  签</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button size="small" @click="openOpinionDialog(2)">拒 绝</el-button>
      <el-button size="small" type="primary" @click="openOpinionDialog(1)">同 意</el-button>
    </div>
    <!-- 退回到发起人重新提交 -->
    <div v-if="created_id === userId && state == 0 && ![1490,7000,8300].includes(model)">
      <el-button size="small" type="primary" @click="UpdateContract(true)">重新提交</el-button>
    </div>
    <!-- 撤回重新发起 -->
    <div v-if="created_id === userId && state == 4 && ![1490,7000,8300].includes(model)">
      <el-button size="small" type="primary" @click="UpdateContract(false)">重新发起</el-button>
    </div>
    <el-dialog
      width="550px"
      :title="opinionTitle"
      :visible.sync="opinionShow"
      append-to-body
      :close-on-click-modal="false"	
    >
      <el-form>
        <el-form-item>
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            v-model="subForm.remark">
          </el-input>
        </el-form-item>
        <!-- 同意时要签名  -->
        <el-form-item 
          label="同意签名:" 
          prop="sign_img" 
          v-if="opinionTitle == '审核同意意见' && configInfo.write_sign == 1"
          :rules="[
            { required: true, message: '请同意签名', trigger: 'change' },
          ]"
        >
          <handwritten-signature
            ref="signature"
            width="150"
            height="100"        
            @get-img="getSign"
          >
          </handwritten-signature>
        </el-form-item>
      </el-form>
      <div class="itemBox">
        <el-row>
          <el-col :span="24" style="margin-bottom:10px">
            <span>审批常用语：</span> 
            <el-select v-model="wordIds" @change="getWordsList" filterable multiple collapse-tags placeholder="请选择">
              <el-option
                v-for="item in commonWordsList"
                :key="item.id"
                :label="item.language"
                :value="item.language">
                <span style="float: left;max-width:110px;overflow: hidden;text-overflow: ellipsis;">{{ item.language }}</span>
              </el-option>
            </el-select>
            <el-button style="margin-left:10px" type="primary" @click="saveForm">设为常用语</el-button>
          </el-col>
          <el-col :span="6" v-for="(item,index) in wordsList" :key="index" class="commonWords">
              <div class="box" @click="addCommonWords(item.language)">
                {{item.language}}
              </div>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="opinionShow = false">取 消</el-button>
        <el-button type="primary" @click="submitFormData">确 定</el-button>
      </span>
    </el-dialog>
    <edit-mark
      :markForm="markInfo"
      :markState="markState"
      :markTitle="markTitle"
      :dialogBool.sync="isShowMarkDialog"
      @on-edit="saveMarkForm"
      @on-del="delMarkForm"
      @on-save="saveMarkForm"
      ></edit-mark>
    <!-- 打印弹窗 -->
    <el-dialog
      width="360px"
      title="选泽打印模板"
      append-to-body
      :visible.sync="printShow">
      <el-form ref="printForm" size="mini" :model="printForm" :rules="printRules" label-suffix=":">
        <el-form-item label="打印模板" prop="print_name">
          <el-select v-model="printForm.print_name" placeholder="请选择打印模板">
            <el-option
              v-for="item in printList"
              :key="item.file_name"
              :label="item.temp_name"
              :value="item.file_name">
            </el-option>
          </el-select> 
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="selectPrintForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import handwrittenSignature from '@/components/handwritten-signature'
import editMark from '../../../launch-affair/component/tableData/edit-mark'
import returnForwardDialog from '../../component/return-forward-dialog';
import itemBoxNew from "../../component/item-box-new";
import { getUser } from '@/utils/auth'
export default {
  name: "base-info",
  components: {editMark, returnForwardDialog ,itemBoxNew,handwrittenSignature},
  props: {
    model: {
      type: Number,
      default: 0,
    },
    created_id: {
      type: Number,
      default: 0,
    },
    user_ids: {
      type: Array,
      default: () => [],
    },
    state: {
      type: Number,
      default: -1,
    },
    flow_id: {
      type: Number,
      default: 0,
    },
    markInfo: {
      type: Object,
      default: {}
    },
    markState: {
      type: [Number, String],
      default: 0,
    },
  },
  data() {
    return {
      formData: {
        created_id: '',
        user_ids: '',
        state: '',
      },
      subForm:{
        flow_id:'', //流程记录id
        step_id:'', //节点id
        state:'', //状态(0待处理1通过2拒绝3退回4转交)
        object_id:'', //对象id(退回节点id/转交用户id)
        remark:'', //备注
        sign_img: '',   //签名
      },
      opinionTitle: '审核意见',
      userId: Number(JSON.parse(getUser()).user_id),
      opinionShow: false,
      returnShow: false,
      // returnUsers:[],
      cancelShow: false,  // 是否可以撤回
      // isReturnToOriginator: true , //是否允许退回到发起人
      isAddCheck:0, //是否允许加签 0否  1是
      flowFields: {
        apply_content: 1
      },
      markTitle: '添加标记',
      isShowMarkDialog: false,
      
      commonWordsList: [],
      wordsList: [],
      wordIds: [],
      buttons: '',

      printList: [],
      printShow: false,
      printForm: {
        print_name: '',

      },
      printRules: {
        print_name: [
          {
            required: true,
            message: "请选择打印模板",
            trigger: "change",
          },
        ],
      },
      configInfo: {}
    }
  },
  watch: {
    opinionShow() {
      if(!this.opinionShow) {
        this.subForm.remark = '';
      }
    },
    returnShow() {
      if(!this.returnShow) {
        this.subForm.object_id = '';
        this.subForm.remark = '';
      }
    },
    printShow() {
      if(!this.printShow) {
        // this.printForm.print_name = ''
        this.$refs.printForm.resetFields()
      }
    }
  },
  mounted() {
  
  },
  methods: {
    // 添加常用语
    saveForm() {
      if (!this.subForm.remark) {
        this.$message({
          showClose: true,
          message: "常用语不能为空，请输入内容",
          type: "warning",
        });
        return
      }
      let parmas = {
        context: {
          sort: -1,
          type: -1,
          buttons: [1,2,3,4],
          is_all: 1,
          form_ids: [],
          language: this.subForm.remark,
        }
      };
      this.$client.AddCommonPhrase(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.$message({
              showClose: true,
              message: '添加成功',
              type: "success",
            });
            this.GetListCommonPhrase(this.buttons)
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
    // 获取常用语列表
    getWordsList(list) {
      let info = ''
      list.forEach(item => {
        info += item
      })
      this.subForm.remark += info
      this.wordIds = []
    },
    addCommonWords(info){
      this.subForm.remark += info
    },
    // 获取常用语
    GetListCommonPhrase(buttons) {
      let params = {
        context: {
          page_index: 1,
          page_size: 999,
          buttons: [buttons],
          form_ids: [Number(this.model)],
          is_enable: 1
        }
      }
      this.wordIds = []
      this.$client.GetListCommonPhrase(params)
        .then(res => {
          if (res.head.result == "200") {
            this.commonWordsList = res.context.list;
            this.wordsList = this.commonWordsList.slice(0,8)
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
    },
    getStepData(id,isAddCheck){
      this.subForm.step_id = id
      this.isAddCheck = isAddCheck
    },
    loadData(){
      this.$emit('on-loading')
    },
    // 打开填写理由弹窗
    openOpinionDialog(type) {
      let isPass = true
      console.log(isPass);
      if(!isPass) {
        return false
      }
      if (type == 2) {
        this.buttons = 3
      } else {
        this.buttons = 4
      }
      this.GetListCommonPhrase(this.buttons)
      this.opinionShow = true
      this.subForm.state = type
      this.opinionTitle = type == 1 ? '审核同意意见' : '审核驳回意见'
    },
    // 0待处理1通过2拒绝3退回4转交5其他人处理6撤销7加签
    handleCommand(command) {
      // 3退回, 4转交, 5,加签
      this.subForm.state = command
      this.$emit('show-approveSchedule','command',command)
    },
    // 撤回
    cancelFlow() {
      this.$confirm('此操作将撤回这条审批记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$client.CancelFlowRecord({ context: this.flow_id }).then((req) => {
          setTimeout(() => {
            this.loadData();
          }, 100)
          if (req.head.result === "200") {
            this.cancelShow = false
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
    // 提交同意和拒绝
    submitFormData() {
      this.suerSubmitInfo();
    },
    // 打开评论弹窗
    openCommentDialog() {
      this.$emit('show-approveSchedule','commentDialogVisible')
    },
    //  打开催办弹窗
    openUrgeDialog() {
      this.$emit('show-approveSchedule','urgeDialogVisible')
    },
    // 确定提交
    suerSubmitInfo() {
      if(this.opinionTitle == '审核同意意见' && this.configInfo.write_sign == 1 && !this.subForm.sign_img) {
        this.$message({
          showClose: true,
          message: '请填写手写签名',
          type: "warning",
        });
        return
      }
      this.subForm.flow_id = this.flow_id
      let info = this.$outFormData(this.subForm)
      this.$client.checkFlowRecord({ context: info }).then((req) => {
        // setTimeout(() => {
        //   this.loadData();
        // }, 100)
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
          this.loadData();
        } else {
          this.$message.error(req.head.describle);
        }
      });
    },
    // 打印
    onPrintAudit() {
      // this.$PrintTemplate(this.model,this.flow_id)
      let params = {
        context: {
          object_id: this.model,
          enable: 1
        }
      }
      this.$client.GetByPage(params).then((req) => {
        let data = req.context.list
        if(!data.length) {
          this.$message({
            showClose: true,
            message: '暂无该表单打印模板,请到打印模板管理确认.',
            type: "error",
          });
          return false
        }
        if(data.length > 1) {
          this.printList = JSON.parse(JSON.stringify(data))
          this.printShow = true
        }else {
          let url = window.newHttpConfig.printUrl + '/html/preview?appid=' + window.newHttpConfig.printUrl_appid +'&_u=' + data[0].file_name + '&flow_id=' + this.flow_id
          window.open(url, '_blank')
        }
      }).catch(err => {
        console.log(err);
        this.$message({
          showClose: true,
          message: '服务出错,请联系开发人员.',
          type: "error",
        });
      })
    },
    selectPrintForm() {
      this.$refs.printForm.validate((valid) => {
        if (valid) {
          let url = window.newHttpConfig.printUrl + '/html/preview?appid=' + window.newHttpConfig.printUrl_appid +'&_u=' + this.printForm.print_name + '&flow_id=' + this.flow_id
          window.open(url, '_blank')
        } else {
          return false;
        }
      });
    },
    // 更新审批单
    UpdateContract(state) {
      this.$emit('on-updateContract',state)
    },
    // 标记审批单
    markApply() {
      this.markTitle = this.markState ? '取消标记' : '添加标记'
      this.isShowMarkDialog = true
    },
    setColor(state) {
      switch (state) {
        case 1:
          return '#F2260E'
          break;
        case 2:
          return '#ff9900'
          break;
        case 3:
          return '#0CB780'
          break;
        default:
          return '#999999'
      }
    },
    saveMarkForm(val) {
      if(!val.state || !val.remark) {
        this.$message.warning('请填写标记状态及备注')
        return
      }
      let params = {
        context: {
          flow_id: this.flow_id,
          user_id: this.userId
        }
      }
      params.context = Object.assign({}, params.context, val)
      this.$client.AddFormMarkCopyFlowRecord(params).then(res => {
        if(res.head.result == "200") {
          this.isShowMarkDialog = false
          // console.log(this,this.$parent);
          this.$parent.$refs['approveSchedule'].loadData()
          this.$message.success(res.head.describle)
        }else {
          this.$message.error(res.head.describle)
        }
      }).catch(e => {
        this.$message.error(e)
      })
    },
    delMarkForm() {
      let params = {
        context: this.flow_id,
      }
      this.$client.DelFormMarkCopyFlowRecord(params).then(res => {
        if(res.head.result == "200") {
          this.isShowMarkDialog = false
          this.$parent.$refs['approveSchedule'].loadData()
          this.$message.success(res.head.describle)
        }else {
          this.$message.error(res.head.describle)
        }
      }).catch(e => {
        this.$message.error(e)
      })
    },
    // 签字 
    getSign(url) {
      this.subForm.sign_img = url
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.bottom-box {
  width: 915px;
  position: fixed;
  bottom: 12px;
  z-index: 666;
  display: flex;
  justify-content: space-between;
  padding: 13px;
  background: #FFFFFF;
  box-shadow: 0px -1px 5px 1px rgba(0,0,0,0.2);
  border-radius: 4px;
  .btn-item {
    flex-direction: column;
    margin-right: 12px;
    cursor: pointer;
    &:hover {
      transform: scale(1.20);
    }
    // img {
    //   height: 22px;
    //   width: 22px;
    // }
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

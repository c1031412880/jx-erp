<template>
  <div class="receipt-document-audit">
    <title-box :title="'收文审批'">
      <!-- <div slot="head">
        <el-button type="primary" size="mini" v-if="state < 2 && is_audit" @click="submitFormData">提交</el-button>
      </div> -->
      <el-descriptions>
        <el-descriptions-item label="公文标题">
          {{formData.title}}
        </el-descriptions-item>
        <el-descriptions-item label="公文编号">
          {{formData.code}}
        </el-descriptions-item>
        <el-descriptions-item label="处理流程状态">
          <el-tag size="medium" :type="state === 3 ? 'danger' : ''">
            {{(state === 1 && user_names) ? `${user_names}` : state_name}}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </title-box>
    <item-box title="拟稿表单">
      <receipt-base ref="receiptBase"></receipt-base>
    </item-box>
    <item-box title="正文">
      <content-box style="height: 500px;" ref="contentBox"></content-box>
    </item-box>
    <item-box title="附件">
      <enclosure ref="enclosure"></enclosure>
    </item-box>
    <item-box title="流程">
      <div>
        <approve-schedule
          ref="approveSchedule"
          style="margin-left: 10px;"
          :flow_record_id="subForm.flow_record_id"
          :type="1" :isFlow="true"
          :flow_id="formData.flow_id"
          :doc_id="formData.id"
          @out-data="getStepData"
          @on-get="loadData"
          ></approve-schedule>
      </div>
    </item-box>
    <div class="bottom-box">
      <div class="btn-left show-flex-box-r">
        <div class="btn-item show-flex-box-r"  v-if="formData.register_id === userId && this.state < 2 && this.state != 0" @click="openUrgeDialog()">
          <i class="el-icon-bell"></i>
          <span>催办</span>
        </div>
        <div class="btn-item show-flex-box-r"  v-if="formData.register_id === userId && this.state <= 2 && this.state != 0" @click="cancelFlow()">
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
      <div v-if="state < 2 && is_audit">
        <el-dropdown trigger="click" @command="handleCommand">
          <el-button size="small">
            更多<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="3">退  回</el-dropdown-item>
            <el-dropdown-item command="4">转  交</el-dropdown-item>
            <el-dropdown-item command="5" v-if="!!isAddCheck">加  签</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button size="small" v-if="state < 2 && is_audit" @click="openOpinionDialog(1)">拒 绝</el-button>
        <el-button size="small" v-if="state < 2 && is_audit" type="primary" @click="openOpinionDialog(0)">同 意</el-button>
      </div>
    </div>
      <!-- 同意拒绝 -->
    <el-dialog
      width="500px"
      title="审核意见"
      :visible.sync="opinionShow">
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
        <el-button v-if="!!this.subForm.result" @click="subState(1)">驳回</el-button>
        <el-button v-else @click="subState(0)">通过</el-button>
      </span>
    </el-dialog>
    <!-- 退回转发 -->
    <return-forward-dialog
      :subForm="stepForm"
      :returnUsers="returnUsers"
      :isReturnToOriginator="isReturnToOriginator"
      :dialogBool.sync="returnShow"
      @on-load="loadData"
      @on-opinion="opinionShow = false"
    ></return-forward-dialog>
    <!-- 标记 -->
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
import itemBox from "../component/document/item-box";
import titleBox from "../component/document/title-box";
import editMark from "../../launch-affair/component/tableData/edit-mark"; 
// import receiptBase from "../../../document-manage/document-main/component/main-content/component/draft-dialog/receipt-base";
import receiptBase from "./component/receipt-base";
import approveSchedule from "../../../../components/approve-echo/approve-schedule2";
import contentBox from "../../../document-manage/document-main/component/main-content/component/draft-dialog/content-box";
import enclosure from "../../../document-manage/document-main/component/main-content/component/draft-dialog/enclosure";
import returnForwardDialog from '../component/return-forward-dialog';
import {getUser, getSession} from '@/utils/auth'
export default {
  name: "receipt-document-audit",
  components: {editMark,itemBox, receiptBase, approveSchedule, contentBox, enclosure, titleBox,returnForwardDialog},
  data() {
    return {
      loading: false,
      formData: {
        id: 0,
        code: '',
        font_number: '',
        title: '',
        department_id: 0,
        department_name: '',
        type: 1,
        type_name: '',
        post_id: 0,
        register_id: 0,
        post_count: 0,
        posy_time: '',
        degree: 1,
        secret: 1,
        keyword: '',
        content: '',
        doc_id: 0,
        is_sms: 1,
        flow_id: '',
        flow_name: '',
        post_name: '',
        degree_name: '',
        secret_name: '',
        main_department_name: '',
        main_person_names: '',
        copy_department_names: '',
        copy_person_names: '',
        post_count_view: 0,
        posy_time_view: 0,
        degree_view: 0,
        secret_view: 0,
        main_department_view: 0,
        copy_department_view: 0,
        user_ids: [],
      },
      subForm: {
        flow_record_id: 0,
        document_id: 0,
        flow_id: 0,
        remark: '',
        result: 0,
        state: 0,
        state_name: '',
        document_code: '',
        head_id: 0,
        count: 0,
        document_seals: [],
        code: ''
      },
      stepForm:{
        flow_id:'', //流程记录id
        step_id:'', //节点id
        state:'', //状态(0待处理1通过2拒绝3退回4转交)
        object_id:'', //对象id(退回节点id/转交用户id)
        remark:'', //备注
      },
      opinionTitle: '审核意见',
      opinionShow: false,
      type: 1,
      state: -1,
      user_names: '',
      state_name: '',
      is_audit: false,
      returnShow: false,
      returnUsers:[],
      isAddCheck:0, //是否允许加签 0否  1是
      cancelShow: false,  // 是否可以撤回
      isReturnToOriginator: true , //是否允许退回到发起人
      userId: Number(JSON.parse(getUser()).user_id),
      markState: 0,
      markInfo: {},
      isShowMarkDialog: false,
      markTitle: '添加标记',

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
      }
    }
  },
  props: {
    id: {
      type: Number,
      default: 0
    },
    model: {
      type: Number,
      default: 0,
    }
  },
  watch: {
    id() {
      if (this.id) {
        this.loadData()
      }
    },
    printShow() {
      if(!this.printShow) {
        // this.printForm.print_name = ''
        this.$refs.printForm.resetFields()
      }
    },
    'stepForm.step_id'(id) {
      setTimeout(() => {
        if(this.formData.user_ids && this.formData.user_ids.includes(this.userId)) {
          this.getFlowFields(id)
        }else {
          Object.assign(this.$refs.receiptBase.flowFields, this.$refs.receiptBase.$options.data().flowFields)
        }
        // this.$refs.approveSchedule.loadData()
      }, 30);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.loadData()
    })
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
    // 获取表单字段控制
    getFlowFields(id) {
      let params = {
        flow_step_id: id
      }
      this.$client.GetFlowFieid(params).then((res) => {
        if (res.head.result == "200") {
          let data = res.context
          let fields = Object.keys(this.$refs.receiptBase.flowFields)
          if(data && data.length) {
            data.forEach(item => {
              if(fields.indexOf(item.fieid_code) > -1) {
                this.$refs.receiptBase.flowFields[item.fieid_code] = item.type
              }
            })
          }
        }
      }).catch((err) => {});
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
    loadData() {
      if (this.id === 0) {
        return false
      }
      let userInfo = JSON.parse(getUser())
      this.loading = true
      this.$client.GetByIdDocumentMain({id: this.id, type: 2}).then(req => {
        this.loading = false
        eventOn.$emit('update-upcoming-matter')
        if (req.head.result === '200') {
          let item = req.context.accept
          this.$refs.enclosure.data = item.files
          Object.keys(item).forEach(key => {
            console.log(key,this.$refs.receiptBase.formData.hasOwnProperty(key));
            if(this.$refs.receiptBase.formData.hasOwnProperty(key)) {
              this.formData[key] = item[key]
              this.$refs.receiptBase.formData[key] = item[key]
              if(key = 'type') {
                this.$refs.receiptBase.type = item[key] ?  Number(item[key]) : ''
              }
            }
          })
          this.state = item.state
          this.user_names = item.user_names
          this.state_name = item.state_name
          this.subForm.flow_record_id = item.flow_record_id
          this.subForm.document_id = this.formData.id
          this.subForm.flow_id = this.formData.flow_id
          this.subForm.state = item.step_id
          this.subForm.state_name = item.step_name || ''
          this.subForm.document_code = this.formData.code || ''
          this.subForm.count = item.post_count

          this.stepForm.flow_id = item.flow_record_id
          let token = getSession()
          let file_extension = (item.content.split('.')).pop().toLowerCase()
          let url = ''
          let fileType = ['png','jpg','jpeg','jpe','gif','dxf','dwg','jp2','tif','tiff']
          if(fileType.indexOf(file_extension) > -1){
            url = this.formData.content
          } else if (file_extension === 'rar' || file_extension === 'zip'){
            url = newHttpConfig.previewUrl +  '/onlinePreview?url='+encodeURIComponent(this.$Base64.encode(this.formData.content))
          }else {
            url = newHttpConfig.previewFile + '/index.html' + `?isEdit=false&user=${userInfo.user_id}&token=${token}&file_id=${this.formData.doc_id}&type=${file_extension}`
          }
          this.$refs.contentBox.content_file = url
          this.$refs.contentBox.content = item.content
          this.$refs.contentBox.file_id = item.doc_id
          this.$refs.contentBox.content_url = item.content_url
          this.is_audit = item.user_ids.indexOf(userInfo.user_id) > -1
        }
        console.log(this.formData.flow_id,this.subForm.flow_id, '2315465456456');
        setTimeout(() => {
          this.$refs.approveSchedule.loadData()
        }, 300);
      })
    },
    // 保存公文和附件
    saveFormData() {
      let formObj = {
        content: this.content || this.formData.content,
        files: this.$refs.enclosure.data,
        id: this.formData.id
      }
      this.$client.UpdateContentDocumentMain({context: formObj}).then(req => {
        if (req.head.result === '200') {
          this.$message({
            message: req.head.describle,
            type: 'success'
          });
        } else {
          this.$message.error(req.head.describle);
        }
      })
    },
    // 提交审核
    subState() {
      setTimeout(() => {
        this.$client.UpdateStateDocumentAccept({context: this.subForm}).then(req => {
          if (req.head.result === '200') {
            this.opinionShow = false
            this.loadData()
            this.$message({
              message: req.head.describle,
              type: 'success'
            });
          } else {
            this.$message.error(req.head.describle);
          }
        });
      }, 100)
    },
    // 提交
    submitFormData() {
      if (this.state === 1) {
        this.subForm.remark = ''
        this.opinionShow = true
      } else {
        this.$message.warning('当前记录已审核');
      }
    },
    // 获取节点数据
    getStepData(data){
      console.log('-----------',data, this.userId)
      try{
        console.log(this.userId == data[0].users[0].id)
        if (this.userId == data[0].users[0].id) {
          this.cancelShow = true
        }
        if (data[data.length - 1].state == 8) {
          this.cancelShow = false
        }
      } catch (e) {}
      let isFirst = true;
      if(data && !!data.length) {
        data.forEach((item,index) => {
          if(isFirst && item.state == 1) {
            this.subForm.state = item.id
            this.stepForm.step_id = item.id
            isFirst = false
          }
          if(index== 0 && item.oper_type==4) {
            this.isAddCheck = item.is_add_check
          }
          if (index== 0 && item.oper_type==4) {
            this.isReturnToOriginator = !item.return_back ? false : true
          }
          if (this.state == 0 && item.state == 10) {
            this.subForm.state = item[0].id
            this.stepForm.step_id = item[0].id
          }
        });
      }
      setTimeout(() => {
        this.reqReturnStepData();
      }, 30);
    },
    // 获取节点数据
    reqReturnStepData() {
      if(!!this.stepForm.flow_id && !!this.stepForm.step_id) {
        let params = {
          flow_id: this.stepForm.flow_id,
          step_id: this.stepForm.step_id,
        };
        this.$client.GetBackStepFlowRecord(params).then((res) => {
          if(res.head.result == '200') {
            let retureList = res.context? res.context : []
            this.buildReturnStep(retureList)
          }else{
            this.$message({
              type: 'error',
              message: res.head.describle,
              showClose: true
            })
          }
        });
      }
    },
    // 构建转交节点
    buildReturnStep(data) {
      this.returnUsers = [];
      if(data && !!data.length) {
        data.forEach((item,index) => {
          let obj = {
            seq: item.id,
            title: item.title
          }
          this.returnUsers.push(obj)
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
    openOpinionDialog(type) {
      if (type == 2) {
        this.buttons = 3
      } else {
        this.buttons = 4
      }
      this.GetListCommonPhrase(this.buttons)

      this.subForm.result = type
      if (this.state === 1) {
        this.subForm.remark = ''
        this.opinionShow = true
      } else {
        this.$message.warning('当前记录已审核');
      }
    },
    //  打开催办弹窗
    openUrgeDialog() {
      this.$refs.approveSchedule.urgeDialogVisible = true
    },
    // 撤回
    cancelFlow() {
      this.$confirm('此操作将撤回这条审批记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$client.CancelFlowRecord({ context: this.stepForm.flow_id }).then((req) => {
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
    // 打开评论弹窗
    openCommentDialog() {
      this.$refs.approveSchedule.commentDialogVisible = true
    },
    // 打印
    onPrintAudit() {
      // PrintTemplate(40,this.subForm.flow_record_id)
      let params = {
        context: {
          object_id: 40,
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
          let url = window.newHttpConfig.printUrl + '/html/preview?appid=' + window.newHttpConfig.printUrl_appid +'&_u=' + data[0].file_name + '&flow_id=' + this.subForm.flow_record_id
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
          let url = window.newHttpConfig.printUrl + '/html/preview?appid=' + window.newHttpConfig.printUrl_appid +'&_u=' + this.printForm.print_name + '&flow_id=' + this.subForm.flow_record_id
          window.open(url, '_blank')
        } else {
          return false;
        }
      });
    },
    // 0待处理1通过2拒绝3退回4转交5其他人处理6撤销7加签
    handleCommand(command) {
      // 3退回, 4转交, 5,加签
      this.stepForm.state = command
      if(command == 5) {
        // 打开加签弹窗
        this.$refs.approveSchedule.countersignDialogVisible = true
        return
      }
      // alert(this.subForm.state)
      console.log(this.returnUsers)
      if(this.subForm.state == 3 && !this.returnUsers.length) {
        this.$message({ message: '没有审核成功退回节点,不能退回!', type: "warning"});
        return
      }
      this.returnShow = true
    },
    // 标记审批单
    markApply() {
      this.markTitle = this.markState ? '取消标记' : '添加标记'
      this.isShowMarkDialog = true
    },
    // 添加编辑标记
    saveMarkForm(val) {
      if(!val.state || !val.remark) {
        this.$message.warning('请填写标记状态及备注')
        return
      }
      let params = {
        context: {
          flow_id: this.subForm.flow_record_id,
          user_id: this.userId
        }
      }
      params.context = Object.assign({}, params.context, val)
      this.$client.AddFormMarkCopyFlowRecord(params).then(res => {
        if(res.head.result == "200") {
          this.isShowMarkDialog = false
          this.$refs.approveSchedule.loadData()
          this.$message.success(res.head.describle)
        }else {
          this.$message.error(res.head.describle)
        }
      }).catch(e => {
        this.$message.error(e)
      })
    },
    // 取消标记
    delMarkForm() {
      let params = {
        context: this.subForm.flow_record_id,
      }
      this.$client.DelFormMarkCopyFlowRecord(params).then(res => {
        if(res.head.result == "200") {
          this.isShowMarkDialog = false
          this.$refs.approveSchedule.loadData()
          this.$message.success(res.head.describle)
        }else {
          this.$message.error(res.head.describle)
        }
      }).catch(e => {
        this.$message.error(e)
      })
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.receipt-document-audit{
  .head-image {
    position: absolute;
    top: 32px;
    right: 38px;
    img {
      height: 98px;
      width: 98px
    }
  }
  .bottom-box {
    width: 915px;
    position: fixed;
    bottom: 12px;
    z-index: 666;
    display: flex
    justify-content: space-between
    padding: 13px
    background: #FFFFFF
    box-shadow: 0px -1px 5px 1px rgba(0,0,0,0.2)
    border-radius: 4px;
    .btn-item {
      flex-direction: column
      margin-right: 12px
      cursor: pointer
      img {
        height: 22px
        width: 22px
      }
      i {
        font-size: 22px
      }
      span {
        font-size: 12px;
        font-weight: 400;
        color: #333333;
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

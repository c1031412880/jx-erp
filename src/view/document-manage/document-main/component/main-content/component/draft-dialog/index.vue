<template>
  <el-dialog :visible="dialogBool" :title="curChangeType === 'apply' ? '审批' : '查看'" :before-close="dialogClose" width="1020px"  :close-on-click-modal="false">
    <div v-loading="baseLoading">
      <el-form
        :inline="true"
        :model="formData"
        ref="formData"
        label-width="120px"
      >
        <el-col :span="12">
          <el-form-item label-width="0px">
            <el-button-group>
              <el-button v-if="type === 1" :type="activeName === 1 ? 'primary' : ''" @click="activeName = 1">拟稿表单</el-button>
              <el-button v-else :type="activeName === 5 ? 'primary' : ''" @click="activeName = 5">拟稿表单</el-button>
              <el-button :type="activeName === 2 ? 'primary' : ''" @click="activeName = 2">流程</el-button>
              <el-button :type="activeName === 4 ? 'primary' : ''" @click="activeName = 4">附件</el-button>
              <el-button v-if="type === 1"  @click="openDocument">正文</el-button>
              <el-button v-else :type="activeName === 6 ? 'primary' : ''" @click="activeName = 6">正文</el-button>
            </el-button-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="state < 2 && is_audit">
            <el-button type="primary"  @click="submitFormData">提交</el-button>
          </el-form-item>
          <el-form-item v-if="type === 1 && !formData.font_number && subForm.state_name !== '编号' && (state == 0 || state == 1)">
            <el-button type="primary" @click="saveFormData">保存</el-button>
          </el-form-item>
          <el-form-item v-if="state > 1 && type === 1 && activeName === 3">
            <el-button type="primary" @click="documentPrints">打印</el-button>
          </el-form-item>
          <div v-if="activeName === 2" style="display:inline-block">
            <el-form-item  v-if="user_ids.indexOf(userId) !== -1">
              <el-button type="primary"  @click="openCountersign()">加签</el-button>
            </el-form-item>
            <el-form-item v-if="formData.post_id === userId">
              <el-button type="primary"  @click="openCommentDialog()">评论</el-button>
            </el-form-item>
          </div>
          <el-form-item>
            <el-button type="primary" @click="dialogClose">关闭</el-button>
          </el-form-item>
        </el-col>
      </el-form>
      <div class="content-box">
        <get-seal-select @change="AddSeal" v-if="subForm.state_name === '签章' && activeName === 3"></get-seal-select>
        <get-overprint-select v-if="subForm.state_name === '套红' && activeName === 3" v-model="subForm.head_id" @change="overprintSelectChange"></get-overprint-select>
        <base-info @on-flow-change="baseFlowChange" ref="baseInfo" v-show="activeName === 1" :isNumber="subForm.state_name === '编号'"></base-info>
        <receipt-base ref="receiptBase" v-show="activeName === 5"></receipt-base>
        <content-model :isSeal="subForm.state_name === '签章'" :isSet="state < 2" :height="505" :isModel="true" ref="contentModel" v-show="activeName === 3"></content-model>
        <content-box ref="contentBox" v-show="activeName === 6"></content-box>
        <approve-schedule
          ref="approveSchedule"
          :flow_record_id="subForm.flow_record_id"
          v-if="activeName === 2"
          :type="type"
          :isFlow="true"
          :flow_id="formData.flow_id"
          :doc_id="formData.id"
          @out-update="onSetData"/>
        <enclosure v-show="activeName === 4" ref="enclosure"></enclosure>
      </div>
    </div>
    <el-dialog
      width="500px"
      title="审核意见"
      :visible.sync="opinionShow"
      append-to-body>
      <el-form label-width="80px">
        <el-form-item label="意见: ">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            v-model="subForm.remark">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="subState(1)">驳回</el-button>
          <el-button @click="subState(0)">通过</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelectTree from '@/components/base/formModel/tree/get-department-select-tree'
import contentModel from '@/components/document-model/content-model'
import getOverprintSelect from './get-overprint-select'
import getSealSelect from './get-seal-select'
import baseInfo from './base-info'
import receiptBase from './receipt-base'
import contentBox from './content-box'
import enclosure from './enclosure'
import approveSchedule from '@/components/approve-echo/approve-schedule2'
import {getSession, getUser} from '@/utils/auth'
export default {
  components: {getDepartmentSelectTree, contentModel, baseInfo, getOverprintSelect, getSealSelect, approveSchedule, receiptBase, contentBox, enclosure},
  props: {
    dialogBool: Boolean,
    curChangeType:{
      type: String,
      default: 'apply'
    }
  },
  data() {
    return {
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
        post_count: 0,
        posy_time: '',
        degree: 1,
        secret: 1,
        keyword: '',
        content: '',
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
      },
      subForm: {
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
      type: 1,
      state: -1,
      is_audit: false,
      activeName: 1,
      opinionShow: false,
      baseLoading: false,
      content: '',
      userId: JSON.parse(getUser()).user_id,

      draftInfo: '',
      user_ids: []
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        Object.assign(this.$refs.baseInfo.$data, this.$refs.baseInfo.$options.data())
        let date = new Date()
        this.$refs.baseInfo.year = Number(date.getFullYear())
        this.$refs.baseInfo.fontForm.year = Number(date.getFullYear())
        this.$refs.contentModel.setData(null)
        // console.log(this);
        this.$refs.contentBox.setData(null)
      }
    },
  },

  methods: {
    openDocument() {
      let conn_id = SignalDom.outConnId()
      let userInfo = JSON.parse(getUser())
      let data = this.formData.id
      let token = getSession()
      let url = newHttpConfig.documentUrl
      if (this.type === 1 && !this.formData.font_number && this.subForm.state_name !== '编号' && this.subForm.state_name !== '套红' && this.subForm.state_name !== '签章' && this.state < 2) {
        url = url + '/addDocument.html' + `?conn_id=${conn_id}&user=${userInfo.user_id}&token=${token}&data=${data}&isTrack=1&url=${this.formData.content}`
      } else if(this.subForm.state_name === '套红' && this.is_audit) {
        url = url + '/thDocument.html' + `?conn_id=${conn_id}&user=${userInfo.user_id}&isTrack=1&token=${token}&data=${data}&url=${this.formData.content}`
      } else if (this.subForm.state_name === '签章' && this.is_audit) {
        url = url + '/gzDocument.html' + `?conn_id=${conn_id}&user=${userInfo.user_id}&isTrack=1&token=${token}&data=${data}&url=${this.formData.content}`
      } else {
        url = url + '/showDocument.html' + `?url=${this.formData.content}`
      }
      window.open(encodeURI(url))
      SignalDom.on('DocmainContentSave', req => {
        console.log('提交返回', req)
        if (Number(req.msg.data) === data) {
          this.subForm.head_id = data
          this.content = req.msg.url
          this.formData.content = req.msg.url
        }
        console.log(this.formData.content)
      })
    },
    documentPrints() {
      // this.$router.push('/documentView')
      this.$refs.contentModel.setPDF()
    },
    // 流程改变
    baseFlowChange(flow_id) {
      debugger
      this.formData.flow_id = flow_id
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
    onSetData(){
      this.setData(this.draftInfo)
      this.$emit('on-loadData')
    },
    // 编辑时数据回显
    setData(val){
      this.draftInfo = val
      this.baseLoading = true
      this.is_audit = val.is_audit
      this.type = val.doc_type
      this.subForm.flow_record_id = val.flow_record_id
      this.$client.GetByIdDocumentMain({id: val.document_id, type: this.type}).then(req => {{
        this.baseLoading = false
        if (req.head.result === '200') {
          if (val.doc_type === 1) {
            this.activeName = 1
            let item = req.context.main
            this.user_ids = item.user_ids
            console.log(item,6666)
            this.$refs.enclosure.data = item.files
            Object.keys(item).forEach(key => {
              if(this.formData.hasOwnProperty(key)) {
                this.formData[key] = item[key]
                this.$refs.baseInfo.formData[key] = item[key]
              }
              if (this.$refs.baseInfo.fontForm.hasOwnProperty(key)) {
                this.$refs.baseInfo.fontForm[key] = item[key]
              }
            })
            if (this.$refs.baseInfo.fontForm.number) {
              this.$refs.baseInfo.out_number = this.$refs.baseInfo.fontForm.number
              this.$refs.baseInfo.GetNumber()
              this.$refs.baseInfo.isSetNumber = true
            }
            this.state = val.state
            this.subForm.document_id = val.document_id
            this.subForm.flow_id = this.formData.flow_id
            this.subForm.state = val.step_id
            this.subForm.state_name = val.step_name || ''
            this.subForm.document_code = this.formData.code || ''
            this.subForm.count = item.post_count
          } else {
            this.activeName = 5
            let item = req.context.accept
            this.user_ids = item.user_ids
            this.$refs.enclosure.data = item.files
            Object.keys(item).forEach(key => {
              if(this.$refs.receiptBase.formData.hasOwnProperty(key)) {
                this.formData[key] = item[key]
                this.$refs.receiptBase.formData[key] = item[key]
              }
            })
            this.state = val.state
            this.subForm.document_id = this.formData.id
            this.subForm.flow_id = this.formData.flow_id
            this.subForm.state = val.step_id
            this.subForm.state_name = val.step_name || ''
            this.subForm.document_code = this.formData.code || ''
            this.subForm.count = val.post_count
            this.$refs.contentBox.content = item.content
            this.$refs.contentBox.content_file = newHttpConfig.previewUrl + '/onlinePreview?url='+encodeURIComponent(this.$Base64.encode(item.content))
            this.$refs.contentBox.content_url = item.content_url
          }
        }
      }})
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 打开评论弹窗
    openCommentDialog() {
      this.formData.flow_id = this.subForm.flow_record_id
      this.$refs.approveSchedule.commentDialogVisible = true
    },
    // 打开加签弹窗
    openCountersign() {
      this.formData.flow_id = this.subForm.flow_record_id
      this.$refs.approveSchedule.countersignDialogVisible = true
    },
    // 提交审核
    subState(state) {
      this.formData = this.$refs.baseInfo.formData
      this.subForm.result = state
      this.subForm.document_seals = []
      if (this.subForm.state_name === '编号' && !this.subForm.result) {
        if (!this.$refs.baseInfo.fontForm.number) {
          this.$message.warning('请填写编号');
          return false
        } else {
          Object.assign(this.subForm, this.$refs.baseInfo.fontForm)
        }
      }
      if (this.subForm.state_name === '签章' && !this.subForm.result) {
        if (!this.subForm.head_id) {
          this.$message.warning('请为正文盖章');
          return false
        } else {
          this.saveFormData()
        }
        this.$refs.contentModel.editorContent.sealList.forEach(item => {
          this.subForm.document_seals.push({
            seal_id: item.id,
            seal_place: JSON.stringify(item)
          })
        })
      }
      if (this.subForm.state_name === '套红' && !this.subForm.result) {
        if (!this.subForm.head_id) {
          this.$message.warning('请为正文套红');
          return false
        } else {
          this.saveFormData()
        }
      }
      if(!!state && !this.subForm.remark) {
        this.$message.warning('请填写驳回理由');
        return false
      }
      setTimeout(() => {
        this.$emit('on-ok', this.subForm, this.type)
      }, 500)
    },
    // 提交
    submitFormData() {
      if (this.state === -1) {
        this.$message.error('请先保存草稿在提交');
        return false
      }
      if (this.state === 0) {
        this.$emit('on-ok', this.subForm)
      }
      if (this.state === 1) {
        this.subForm.remark = ''
        this.opinionShow = true
      }
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.content-box{
  width 100%
  height 550px
  overflow-y auto
}
</style>

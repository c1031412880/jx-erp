<template>
  <el-dialog :visible="dialogBool" :title="formData.id == 0 ? '添加收文' :  isSet ? '编辑收文' : '查看收文'" :before-close="dialogClose" width="950px"  :close-on-click-modal="false">
    <el-form
      :inline="true"
      :model="formData"
      ref="formData"
      label-width="120px"
    >
      <el-col :span="12">
        <el-form-item label-width="0px">
          <el-button-group>
            <el-button :type="activeName === 1 ? 'primary' : ''" @click="activeName = 1">登记表单</el-button>
            <el-button :type="activeName === 2 ? 'primary' : ''" @click="activeName = 2">流程</el-button>
            <el-button :type="activeName === 4 ? 'primary' : ''" @click="activeName = 4">正文</el-button>
            <el-button :type="activeName === 3 ? 'primary' : ''" @click="activeName = 3">附件</el-button>
          </el-button-group>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item>
          <el-button type="primary" v-if="!formData.id"  v-loading="btnDisabled" @click="saveDraft">保存草稿</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-loading="btnDisabled" v-if="state === 6 || state  === 0 || state  === -1 ||  (state === 3 && commit !== 1) && isSet" @click="saveForm">提交</el-button>
        </el-form-item>
        <div v-if="activeName === 2" style="display:inline-block">
          <el-form-item v-if="formData.register_id === userId && state === 1">
            <el-button  type="" @click="cancelFlow()">撤回</el-button>
          </el-form-item>
          <el-form-item v-if="formData.register_id === userId && [1,2].indexOf(state) !== -1">
            <el-button type="primary" @click="openUrgeDialog()" >催办</el-button>
          </el-form-item>
          <el-form-item v-if="formData.register_id === userId && ( state >= 1 && state !== 3 && state !== 5 && state !== 6)">
            <el-button type="primary"  @click="openCommentDialog()">评论</el-button>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" @click="dialogClose">关闭</el-button>
        </el-form-item>
      </el-col>
    </el-form>
    <div class="content-box">
      <base-info @on-flow-change="baseFlowChange" ref="baseInfo" v-show="activeName === 1" :isNumber="isSet"></base-info>
      <approve-schedule 
        ref="approveSchedule" 
        :flow_record_id="subForm.flow_record_id" 
        v-if="activeName === 2 && ([1,2,4,5].indexOf(state) != -1 || ((state == 3 || state == 6) && !isFlowChange))" 
        :type="2" 
        :isFlow="true" 
        :flow_id="state < 1 ? formData.flow_id : subForm.flow_record_id" 
        :doc_id="formData.id">
      </approve-schedule>
      <approve-step 
          style="max-width:600px;overflow: auto;margin:0 auto"
          ref="approveStep"
          v-show="activeName === 2 && (state == -1 || state == 0 || ((state == 3 || state == 6) && isFlowChange)) " 
          @on-users="setUsers" 
          :isFlow="true" 
          :flow_id="formData.flow_id">
        </approve-step>
      <enclosure-list v-show="activeName === 3" ref="enclosureList"></enclosure-list>
      <content-box ref="contentBox" v-show="activeName === 4"></content-box>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelectTree from '@/components/base/formModel/tree/get-department-select-tree'
import baseInfo from './base-info'
import approveSchedule from '@/components/approve-echo/approve-schedule2'
import enclosureList from './enclosure'
import contentBox from './content-box'
import {getUser, getSession} from '@/utils/auth'
import approveStep from '@/components/approve-echo/approve-step2'
export default {
  components: {
    getDepartmentSelectTree,
    baseInfo, 
    approveSchedule, 
    enclosureList, 
    contentBox,
    approveStep
  },
  props: {
    dialogBool: Boolean,
    isSet: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        register_id:'',
        register_name:'',
        id: 0,
        code: '',
        font_number: '',
        title: '',
        type: '',
        secret: '',
        is_sms: 1,
        flow_id: 0,
        organ: '',
        accept_date: '',
        files: [],
        content: '',
        file_id: 0,
        post_id: 0,
        department_id: 0,
        main_department: [],
        main_persons: [],
        copy_departments: [],
        copy_persons: [],
        step_data: []
      },
      subForm: {
        created_id:'',
        document_id: 0,
        flow_id: 0,
        reamrk: '',
        result: 0,
        state: 0,
        state_name: '',
        document_code: '',
        head_id: 0,
        count: 0,
        document_seals: [],
      },
      state: -1,
      commit: 1,
      activeName: 1,
      opinionShow: false,
      subBool: true,
      userId: JSON.parse(getUser()).user_id,
      isFlowChange: false,
      nodes: [],
      btnDisabled: false,
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        Object.assign(this.$refs.baseInfo.$data, this.$refs.baseInfo.$options.data())
        this.$refs.baseInfo.setUser()
        this.$refs.contentBox.resetData()
        this.$refs.enclosureList.data = []

        let date = new Date()
        this.$refs.baseInfo.year = date
        this.$refs.baseInfo.fontForm.year = date.getFullYear()
      }
    },
  },
  methods: {
  // 设置流程节点
    setUsers(data) {
      this.nodes = data
    },
    // 打开评论弹窗
    openCommentDialog() {
      this.$refs.approveSchedule.commentDialogVisible = true
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
        this.$client.CancelFlowRecord({ context: this.subForm.flow_record_id }).then((req) => {
          if (req.head.result === "200") {
            this.$message({
              message: req.head.describle,
              type: "success",
            });
            this.dialogBool = false
            this.$emit("on-save")
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
    baseFlowChange(flow_id) {
      this.isFlowChange = true
      this.formData.flow_id = flow_id
    },
    // 编辑时数据回显
    setData(val){
      Object.keys(val).forEach(key => {
        if(this.formData.hasOwnProperty(key)) {
          this.formData[key] = val[key]
          this.$refs.baseInfo.formData[key] = val[key]
        }
        if (this.$refs.baseInfo.fontForm.hasOwnProperty(key)) {
          this.$refs.baseInfo.fontForm[key] = val[key]
        }
      })
      this.$refs.baseInfo.year = val.year.toString()
      this.commit = val.commit
      this.subForm.flow_record_id = val.flow_record_id
      this.state = val.state
      if (this.state === 3) {
        this.$refs.baseInfo.out_number = this.$refs.baseInfo.fontForm.number
        // this.$refs.baseInfo.GetNumber()
        this.$refs.baseInfo.isSetNumber = true
      }
      this.subForm.flow_record_id = val.flow_record_id
      this.subForm.register_id = val.register_id
      this.subForm.document_id = this.formData.id
      this.subForm.flow_id = this.formData.flow_id
      this.subForm.state = val.step_id
      this.subForm.state_name = val.step_name || ''
      this.subForm.document_code = this.formData.code || ''
      this.subForm.count = val.post_count
      this.$refs.enclosureList.data = this.formData.files
      this.$refs.contentBox.file_id = val.file_id
      this.$refs.contentBox.content_url = val.content_url
      let userInfo = JSON.parse(getUser())
      let token = getSession()
      let file_extension = val.content ? (val.content.split('.')).pop().toLowerCase() : ''
      if(file_extension == 'rar' || file_extension == 'zip') {
        this.$refs.contentBox.content_file = newHttpConfig.previewUrl +  '/onlinePreview?url='+encodeURIComponent(this.$Base64.encode(val.content))
      }else {
        this.$refs.contentBox.content_file = newHttpConfig.previewFile + '/index.html' + `?isEdit=true&user=${userInfo.user_id}&token=${token}&file_id=${val.doc_id}&type=${file_extension}`
      }
      setTimeout(() => {
        this.formData.flow_id = ''
        this.$refs.baseInfo.formData.flow_id = ''
        // this.subForm.flow_record_id = ''
        this.subForm.flow_id = ''
      }, 100);
      // console.log(this.$refs.baseInfo.fontForm, '1', this.$refs.contentBox.content)
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 获取草稿
    getDraft() {
      let params = {
        type: 40
      }
      this.$client.GetDraftRecordFlowManage(params).then(res => {
        if(res.head.result == '200') {
          console.log(res);
          let info = res.context
          Object.keys(info).forEach(key => {
            if(this.formData.hasOwnProperty(key)) {
              this.formData[key] = info[key]
              this.$refs.baseInfo.formData[key] = info[key]
            }
            if (this.$refs.baseInfo.fontForm.hasOwnProperty(key)) {
              this.$refs.baseInfo.fontForm[key] = info[key]
            }
          })
          this.$refs.enclosureList.data = this.formData.files
          this.$refs.baseInfo.year = info.year.toString()
          this.$refs.contentBox.content = info.content
          this.$refs.contentBox.content_url = info.content
          let userInfo = JSON.parse(getUser())
          let token = getSession()
          let file_extension = info.content ? (info.content.split('.')).pop().toLowerCase() : ''
          if(file_extension == 'rar' || file_extension == 'zip') {
            this.$refs.contentBox.content_file = newHttpConfig.previewUrl +  '/onlinePreview?url='+encodeURIComponent(this.$Base64.encode(info.content))
          }else {
            this.$refs.contentBox.content_file = newHttpConfig.previewFile + '/index.html' + `?isEdit=true&user=${userInfo.user_id}&token=${token}&file_id=${this.formData.file_id}&type=${file_extension}`
          }
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 保存草稿
    saveDraft() {
      this.btnDisabled = true
      this.formData = this.$refs.baseInfo.formData
      this.formData.files = this.$refs.enclosureList.data
      this.formData.content = this.$refs.contentBox.content
      this.formData.file_id = this.$refs.contentBox.file_id
      this.formData.step_data = this.nodes
      Object.assign(this.formData, this.$refs.baseInfo.fontForm)
      let params = {
        type: 40,
        data: this.formData
      }
      this.$client.AddDraftFlowManage(params).then(res => {
        this.btnDisabled = false
        if(res.head.result == '200') {
          this.dialogClose()
          this.$message({message: '保存成功', type: "success",});
        } else {
          this.$message({message: res.head.describle, type: "error",});
        }
      }).catch(e => {
        this.$message({message: '服务异常', type: "error",});
      })
    },
    // 提交
    saveForm() {
      this.btnDisabled = true
      this.formData = this.$refs.baseInfo.formData
      this.formData.files = this.$refs.enclosureList.data
      this.formData.content = this.$refs.contentBox.content
      this.formData.file_id = this.$refs.contentBox.file_id
      this.formData.step_data = this.nodes
      Object.assign(this.formData, this.$refs.baseInfo.fontForm)
      if (this.state === 3 || this.state === 6) {
        this.formData.again = 1
      }
      if (!this.subBool) {
        return false
      }
      setTimeout(() => {
        this.subBool = true
        this.btnDisabled = false
      }, 500)
      this.$emit('on-ok', this.formData)
    },
    subState(state) {
      this.subForm.result = state

      this.$emit('on-ok', this.subForm)
    },
    // 
    submitFormData() {
      if (this.state === -1) {
        this.$message.error('请先保存草稿在提交');
        return false
      }
      if (this.subForm.step_data.length === 0) {
        this.$message.warning('请先创建流程再提交');
        return false
      }
      if (this.state === 0) {
        if (!this.subBool) {
          return false
        }
        setTimeout(() => {
          this.subBool = true
        }, 500)
        this.$emit('on-ok', this.subForm)
      }
      if (this.state === 1) {
        this.subForm.reamrk = ''
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

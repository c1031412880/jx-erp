<template>
  <el-dialog :visible="dialogBool" :title="draftType == 'show' ? '查看发文' : formData.id === 0 ? '添加发文' : '编辑发文'" :before-close="dialogClose" width="1020px"  :close-on-click-modal="false">
    <el-form
      :inline="true"
      :model="formData"
      ref="formData"
      label-width="120px">
      <el-col :span="12">
        <el-form-item label-width="0px">
          <el-button-group>
            <el-button :type="activeName === 1 ? 'primary' : ''" @click="activeName = 1">拟稿表单</el-button>
            <el-button :type="activeName === 2 ? 'primary' : ''" @click="activeName = 2">流程</el-button>
            <el-button :type="activeName === 4 ? 'primary' : ''" @click="activeName = 4">附件</el-button>
            <el-button @click="openDocument()">正文</el-button>
          </el-button-group>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item>
          <el-button type="primary" v-loading="btnDisabled" v-if="draftType == 'add'" @click="saveDraft">保存草稿</el-button>
        </el-form-item>
        <el-form-item v-if="state === 0 || state === -1 || (state === 3 && commit !== 1) || state === 6">
          <el-button type="primary" v-loading="btnDisabled" @click="submitFormData">提交</el-button>
        </el-form-item>
        <!-- <el-form-item v-if="state === 0 || state === -1 || (state === 3 && commit !== 1) || state === 6">
          <el-button type="primary" @click="saveForm" v-loading="btnDisabled">保存</el-button>
        </el-form-item> -->
        <div v-if="activeName === 2" style="display:inline-block">
          <el-form-item v-if="formData.post_id === userId && state === 1">
            <el-button  type="" @click="cancelFlow()">撤回</el-button>
          </el-form-item>
          <el-form-item v-if="formData.post_id === userId && [1,2].indexOf(state) !== -1">
            <el-button type="primary" @click="openUrgeDialog()" >催办</el-button>
          </el-form-item>
          <el-form-item v-if="formData.post_id === userId && ( state >= 1 && state !== 3 && state !== 5 && state !== 6)">
            <el-button type="primary"  @click="openCommentDialog()">评论</el-button>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" @click="dialogClose">关闭</el-button>
        </el-form-item>
      </el-col>
    </el-form>
    <div class="content-box">
      <base-info @on-flow-change="baseFlowChange" :draftType="draftType" ref="baseInfo" v-show="activeName === 1"></base-info>
      <content-model :isSet="state < 2 || state === 3" :height="505" :isModel="true" ref="contentModel" v-show="activeName === 3"></content-model>
      <approve-schedule
        ref="approveSchedule"
        :flow_record_id="subForm.flow_record_id"
        v-if="activeName === 2 && ([1,2,4,5].indexOf(state) != -1 || ((state == 3 || state == 6) && !isFlowChange))"
        :type="1"
        :isFlow="true"
        :flow_id="state < 1 ? formData.flow_id : subForm.flow_record_id"
        :doc_id="formData.id" >
        </approve-schedule>
        <approve-step
          style="max-width:600px;overflow: auto;margin:0 auto"
          ref="approveStep"
          v-show="activeName === 2 && (state == -1 || state == 0 || ((state == 3 || state == 6) && isFlowChange)) "
          @on-users="setUsers"
          :isFlow="true"
          :flow_id="formData.flow_id">
        </approve-step>
      <encosure-box v-show="activeName === 4" ref="encosureBox"></encosure-box>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelectTree from '@/components/base/formModel/tree/get-department-select-tree'
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import contentModel from '@/components/document-model/content-model'
import getOverprintSelect from './get-overprint-select'
import getSealSelect from './get-seal-select'
import baseInfo from './base-info'
import approveSchedule from '@/components/approve-echo/approve-schedule2'
import {formatDate} from '@/utils'
import {getSession, getUser} from '@/utils/auth'
import { isObjectChanged } from "@/utils/index";
import encosureBox from './enclosure'
import approveStep from '@/components/approve-echo/approve-step2'
export default {
  components: {
    getDepartmentSelectTree,
    getDepartmentSelect,
    contentModel,
    baseInfo,
    getOverprintSelect,
    getSealSelect,
    approveSchedule,
    encosureBox,
    approveStep
  },
  props: {
    dialogBool: Boolean,
    draftType: String,
  },
  data() {
    return {
      formData: {
        id: 0,
        code: '',
        font_number: '',
        title: '',
        department_id: 0,
        type: 100,
        post_id: 0,
        post_count: 0,
        posy_time: '',
        degree: 1,
        secret: 1,
        keyword: '',
        content: '',
        is_sms: 1,
        flow_id: null,
        main_department: [],
        copy_departments: [],
        main_persons: [],
        copy_persons: [],
        files: [],
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
        reamrk: '',
        result: 0,
        state: 0,
        state_name: '',
        document_code: '',
        head_id: 0,
        count: 0,
        document_seals: [],
        code: '',
        step_data: []
      },
      commit: 1,
      state: -1,
      activeName: 1,
      content: '',
      subBool: true,
      userId: JSON.parse(getUser()).user_id,
      isFlowChange: false,
      btnDisabled: false,
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        Object.assign(this.$refs.baseInfo.$data, this.$refs.baseInfo.$options.data())
        this.$refs.baseInfo.setUser()
        Object.assign(this.$refs.encosureBox.$data, this.$refs.encosureBox.$options.data())
        this.$refs.contentModel.setData(null)
      }
    },
  },
  methods: {
    // 获取草稿
    getDraft() {
      let params = {
        type: 30
      }
      this.$client.GetDraftRecordFlowManage(params).then(res => {
        if(res.head.result == '200') {
          let info = res.context
          Object.keys(info).forEach(key => {
            if(this.formData.hasOwnProperty(key)) {
              this.formData[key] = info[key]
              this.$refs.baseInfo.formData[key] = info[key]
            }
          })
          this.$refs.encosureBox.data = info.files
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
      Object.assign(this.formData,this.$refs.baseInfo.formData)
      if (this.content) {
        this.formData.content = this.content
      }
      let files = this.$refs.encosureBox.data
      this.formData.files = files
      let params = {
        type: 30,
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
     // 设置流程节点
    setUsers(data) {
      this.subForm.step_data = data
    },
    // 打开评论弹窗
    openCommentDialog() {
      this.$refs.approveSchedule.commentDialogVisible = true
    },
    //  打开催办弹窗
    openUrgeDialog() {
      this.$refs.approveSchedule.urgeDialogVisible = true
    },
    openDocument() {
      let time = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss');
      let conn_id = SignalDom.outConnId()
      console.log(conn_id,'conn_id');
      let data = ''
      let doc_id = ''
      let url = newHttpConfig.documentUrl
      if (this.formData.id) {
        data = this.formData.id
        doc_id = this.formData.id
        if (this.state < 1 || this.state === 3) {
          url = url + '/addDocument.html' + `?time=${time}&conn_id=${conn_id}&data=${data}&url=${this.formData.content}&doc_id=${doc_id}`
        } else {
          url = url + '/showDocument.html' + `?time=${time}&url=${this.formData.content}&doc_id=${doc_id}`
        }
      } else {
        data = getSession()
        console.log(data, 'data');
        doc_id = 0
        url = url + '/addDocument.html' + `?time=${time}&conn_id=${conn_id}&data=${data}&doc_id=${doc_id}`
        if (this.formData.content) {
          url = url + `&url=${this.formData.content}`
        }
      }
      window.open(url)
      SignalDom.on('DocmainContentSave', req => {
        console.log('提交返回', req)
        if (req.msg.data === data.toString()) {
          this.formData.content = req.msg.url
          this.content = req.msg.url
        }
      })
    },
    // 流程改变
    baseFlowChange(flow_id) {
      this.isFlowChange = true
      this.formData.flow_id = flow_id
      this.subForm.flow_id = flow_id
    },
    // 编辑时数据回显
    setData(val){
      Object.keys(val).forEach(key => {
        if(this.formData.hasOwnProperty(key)) {
          this.formData[key] = val[key]
          this.$refs.baseInfo.formData[key] = val[key]
        }
      })
      this.subForm.flow_record_id = val.flow_record_id
      this.$refs.encosureBox.data = val.files
      console.log('----------------',this.$refs.baseInfo.formData, val.content)
      this.state = val.state
      this.commit = val.commit
      this.subForm.document_id = this.formData.id
      this.subForm.flow_id = this.formData.flow_id
      this.subForm.state = val.step_id
      this.subForm.state_name = val.step_name || ''
      this.subForm.document_code = this.formData.code || ''
      this.subForm.count = val.post_count
      let objContent = {}
      objContent.content = val.content
      objContent.contentTitle = val.title
      objContent.post_count = val.post_count
      objContent.posy_time = val.posy_time
      objContent.keyword = val.keyword
      objContent.type = val.type
      objContent.code = val.code
      objContent.degree = val.degree
      objContent.secret = val.secret
      objContent.font_number = val.font_number

      // 红头套红
      if (val.head_content) {
        let objHead = val.head_content ? JSON.parse(val.head_content) : {}
        objContent.title = objHead.title
        objContent.userName = objHead.userName
        objContent.post_count_view = objHead.post_count_view
        objContent.posy_time_view = objHead.posy_time_view
        objContent.degree_view = objHead.degree_view
        objContent.secret_view = objHead.secret_view
        objContent.main_department_view = objHead.main_department_view
        objContent.copy_department_view = objHead.copy_department_view
        objContent.keyword_view = objHead.keyword_view
        objContent.fiveType = objHead.fiveType
        objContent.zoom = objHead.zoom
        objContent.isTH = true
      }
      // 盖章
      if (val.document_seals) {

        objContent.sealList = []
        val.document_seals.forEach((obj, i) => {
          if (obj.seal_place) {
            objContent.sealList.push(JSON.parse(obj.seal_place))
          }
          if (i === 0) {
            objContent.gzname = JSON.parse(obj.seal_place).name
            // this.$refs.contentModel.editorContent.gzname = JSON.parse(obj.seal_place).name
            // console.log(this.$refs.contentModel.editorContent.gzname)
          }
        })
      }

      setTimeout(() => {
        console.log('回显对象', objContent)
        this.$refs.contentModel.setData(objContent)
      }, 100)
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 保存草稿
    saveForm() {
      Object.assign(this.formData,this.$refs.baseInfo.formData)
      if (this.content) {
        this.formData.content = this.content
      }
      let files = this.$refs.encosureBox.data
      this.formData.files = files
      if (!this.formData.title) {
        this.$message.warning('请填写公文标题');
        return false
      }
      if (!this.formData.post_id) {
        this.$message.warning('请选择拟稿人');
        return false
      }
      if (!this.formData.department_id) {
        this.$message.warning('请选择拟稿部门');
        return false
      }
      if (!this.formData.type) {
        this.$message.warning('请选择公文类型');
        return false
      }
      if (!this.formData.posy_time) {
        this.$message.warning('请选择发文日期');
        return false
      }
      if (!this.formData.content) {
        this.$message.warning('请填写正文内容');
        return false
      }
      if (!this.formData.main_department) {
        this.$message.warning('请选择主送单位');
        return false
      }
      // if (!this.formData.main_persons.length) {
      //   this.$message.warning('请选择主送人员');
      //   return false
      // }
      if (!this.formData.flow_id) {
        this.$message.warning('请选择发文流程');
        return false
      }
      if (!this.subBool) {
        return false
      }
      this.btnDisabled = true
      setTimeout(() => {
        this.subBool = true
      }, 500)
      if (this.formData.id) {
        this.$client.UpdateDocumentMain({context: this.formData}).then(req => {
          this.$emit('on-save')
          if (req.head.result === '200') {
            this.btnDisabled = false
            this.$message({
              message: req.head.describle,
              type: 'success'
            });
            this.formData.id = req.context.id
            this.$refs.baseInfo.formData.id = req.context.id
            this.subForm.document_id = req.context.id
            this.subForm.flow_id = this.formData.flow_id
            this.state = 0
            this.subForm.state = req.context.state
            this.subForm.state_name = req.context.state_name
          } else {
            this.$message.error(req.head.describle);
          }
        })
      } else {
        this.$client.AddDocumentMain({context: this.formData}).then(req => {
          this.$emit('on-save')
          if (req.head.result === '200') {
            this.btnDisabled = false
            this.$message({
              message: req.head.describle,
              type: 'success'
            });
            this.formData.id = req.context.id
            this.$refs.baseInfo.formData.id = req.context.id
            this.subForm.document_id = req.context.id
            this.subForm.flow_id = this.formData.flow_id
            this.state = 0
            this.subForm.state = req.context.state
            this.subForm.state_name = req.context.state_name
          } else {
            this.$message.error(req.head.describle);
          }
        })
      }

    },
    // 提交
    submitFormData() {
      Object.assign(this.formData,this.$refs.baseInfo.formData)
      if (this.content) {
        this.formData.content = this.content
      }
      let files = this.$refs.encosureBox.data
      this.formData.files = files
      if (!this.formData.title) {
        this.$message.warning('请填写公文标题');
        return false
      }
      if (!this.formData.post_id) {
        this.$message.warning('请选择拟稿人');
        return false
      }
      if (!this.formData.department_id) {
        this.$message.warning('请选择拟稿部门');
        return false
      }
      if (!this.formData.type) {
        this.$message.warning('请选择公文类型');
        return false
      }
      if (!this.formData.posy_time) {
        this.$message.warning('请选择发文日期');
        return false
      }
      if (!this.formData.content) {
        this.$message.warning('请填写正文内容');
        return false
      }
      if (!this.formData.main_department) {
        this.$message.warning('请选择主送单位');
        return false
      }
      // if (!this.formData.main_persons.length) {
      //   this.$message.warning('请选择主送人员');
      //   return false
      // }
      if (!this.formData.flow_id) {
        this.$message.warning('请选择发文流程');
        return false
      }
      if (!this.subBool) {
        return false
      }
      this.btnDisabled = true
      setTimeout(() => {
        this.subBool = true
      }, 500)
      if (this.formData.id) {
        this.$client.UpdateDocumentMain({context: this.formData}).then(req => {
          if (req.head.result === '200') {
            this.formData.id = req.context.id
            this.$refs.baseInfo.formData.id = req.context.id
            this.subForm.document_id = req.context.id
            this.subForm.flow_id = this.formData.flow_id
            this.state = 0
            this.subForm.state = req.context.state
            this.subForm.state_name = req.context.state_name

            if (this.subForm.step_data.length === 0) {
              this.$message.warning('请先创建流程再提交');
              return false
            }
            
            if (this.state === 0 || this.state === 3 || this.state === 6) {
              if (this.state === 3 || this.state === 6) {
                this.subForm.again = 1
              }
              if (!this.subBool) {
                return false
              }
              console.log('subForm',this.subForm);
              setTimeout(() => {
                this.subBool = true
              }, 500)
              this.$emit('on-ok', this.subForm)
            }
            this.btnDisabled = false
          } else {
            this.$message.error(req.head.describle);
          }
        })
      } else {
        if (this.state === 0 || this.state === 3 || this.state === 6) {
          if (this.state === 3 || this.state === 6) {
            this.subForm.again = 1
          }
        }
        let params = Object.assign({}, this.formData)
        params.step_data = this.subForm.step_data
        this.$client.CommitDocumentMain({context: params}).then(req => {
          this.btnDisabled = false
          if (req.head.result === '200') {
            this.$emit("on-save")
            this.formData.id = req.context.id
            this.$refs.baseInfo.formData.id = req.context.id
            this.subForm.document_id = req.context.id
            this.subForm.flow_id = this.formData.flow_id
            this.state = 0
            this.subForm.state = req.context.state
            this.subForm.state_name = req.context.state_name
              setTimeout(() => {
                this.subBool = true
              }, 500)
              this.$parent.draftDialogShow = false
          } else {
            this.$message.error(req.head.describle);
          }
        })
      }
    },
    // 撤回
    cancelFlow() {
      this.$confirm('此操作将撤回这条审批记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$client.CancelFlowRecord({ context: this.subForm.flow_record_id }).then((req) => {
          // setTimeout(() => {
          //   this.loadData();
          // }, 100)
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

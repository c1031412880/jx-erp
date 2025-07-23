<template>
  <el-dialog
    :visible="dialogBool"
    :title="formName"
    :close-on-click-modal="false"
    :before-close="beforeDialogClose"
    :append-to-body="appendToBody"
    width="760px"
    class="dialog-box"
    ref="dialog-box"
    center
    top="10px"
  >
    <div class="el-dialog-div" v-if="dialogBool">
      <component
        :is="dynamicComponent"
        :formId="formId"
        :ref="formKey"
        :isAgain="isAgain"
        :isShowSelectUser="isShowSelectUser"
        :correlationId="correlationId"
        :isWorkOrder="isWorkOrder"
        :dialogBool="dialogBool"
        @out-form="FormChange"
      ></component>

      <!-- 流程节点显示 -->
      <el-card
        style="margin-top: 10px; max-height: 330px; overflow: auto"
        v-if="dialogBool && !isCommit"
      >
        <approve-step
          ref="approveStep"
          :key="key"
          @on-users="setUsers"
          :form_data="form_data"
          :object_id="formId"
        ></approve-step>
      </el-card>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button
        type="primary"
        v-show="!isAgain"
        @click="saveDraftApply()"
        v-loading="updateLoading"
      >
        保存草稿
      </el-button>
      <el-button type="primary" @click="saveForm()" v-loading="updateLoading">提 交</el-button>
    </span>

    <div class="anniu" @click="quanping">
      <i class="el-icon-full-screen"></i>
    </div>
  </el-dialog>
</template>

<script>
import { deepCopy, isObjectChanged } from '@/utils/index'
import approveStep from '@/components/approve-echo/approve-step2'
import objectIdMap from './approval-map'
export default {
  components: {
    approveStep
  },
  props: {
    dialogBool: Boolean,
    appendToBody: {
      type: Boolean,
      default: false
    },
    formId: {
      type: Number,
      default: 0
    },
    formName: {
      type: String,
      default: ''
    },
    isAgain: {
      type: Boolean,
      defaultL: false
    },
    isCommit: {
      type: Boolean,
      defaultL: false
    },
    correlationId: {
      //安全隐患审批反馈用
      type: Number,
      default: 0
    },
    isWorkOrder: {
      //外修联系单用，判断是否是工单里打开
      type: Boolean,
      defaultL: false
    },
  },
  data() {
    return {
      dynamicComponent: null,
      form_data: null,
      key: null,
      nodes: [],
      objectIdMap,
      updateLoading: false,
      isShowSelectUser: true,
      isFull: false,

      formKey: '',
      formAddApi: '',
      formUpdateApi: ''
    }
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data())
      } else {
        this.formKey = this.objectIdMap[this.formId].key
        this.formAddApi = this.objectIdMap[this.formId].AddApi
        this.formUpdateApi = this.objectIdMap[this.formId].updateApi
        this.loadComponent()
        // 设置流程id
        if (!!this.formId) {
          this.getBehalfHandle(this.formId)
        }
        // 获取草稿
        this.$nextTick(() => {
          if (!this.isAgain) {
            this.getDraftRecord()
          }
        })
      }
    }
  },
  methods: {
    async loadComponent() {
      try {
        const component = await import(`./${this.formKey}.vue`)
        this.dynamicComponent = component.default
      } catch (error) {
        console.error('Error loading component:', error)
        this.dynamicComponent = null
      }
    },
    quanping() {
      let id = this.$refs['dialog-box'].$el.children[0]
      if (!this.isFull) {
        id.classList.add('fullscreen')
        this.isFull = true
      } else {
        id.classList.remove('fullscreen')
        this.isFull = false
      }
    },
    dialogClose() {
      this.$emit('update:dialogBool', false)
    },
    // 根据用户id获取是否可以代他人提交
    getBehalfHandle(id) {
      let params = { form_id: id }
      this.$client.GetBehalfByIdFlowManage(params).then(res => {
        if (res.head.result == '200') {
          this.isShowSelectUser = !res.context
        }
      })
    },
    // 获取草稿
    getDraftRecord(info = null) {
      // this.$client.GetDraftRecordFlowManage({ type: this.formId }).then(res => {
      //   let info = null
      //   if (res.head.result == '200') {
      //     info = res.context
      //   } else {
      //     this.$message({
      //       showClose: true,
      //       message: res.head.describle,
      //       type: 'error'
      //     })
      //   }
      //   //初始化数据
      //   this.$refs[this.formKey].initSet(info)
      // })
      setTimeout(() => {
        this.$refs[this.formKey].initSet(info)
      }, 300)
    },
    // 关闭审批单判断是否保存
    beforeDialogClose() {
      // // 不用保存
      // if ([1020,1030].indexOf(this.formId) !== -1 || this.isAgain) {
      //   this.dialogClose()
      //   return false
      // }
      if (this.updateLoading) {
        return false
      }
      let form = this.$refs[this.formKey].form
      let oldForm = this.$refs[this.formKey].oldForm

      console.log('form', JSON.parse(JSON.stringify(form)))
      console.log('oldForm', JSON.parse(JSON.stringify(oldForm)))
      // 判断数据是否存在修改
      if (isObjectChanged(form, oldForm)) {
        this.$confirm('是否需要保存草稿?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$refs[this.formKey]
              .saveDraft()
              .then(res => {
                let formData = res.form
                this.updateLoading = true
                this.saveDraft(formData)
              })
              .catch(err => {
                console.log(err)
                this.$message({
                  showClose: true,
                  message: err.msg,
                  type: 'warning'
                })
              })
          })
          .catch(() => {
            this.dialogClose()
          })
      } else {
        this.dialogClose()
      }
    },
    // 保存草稿
    saveDraftApply() {
      if (this.updateLoading) {
        return false
      }
      this.$refs[this.formKey]
        .saveDraft()
        .then(res => {
          let formData = res.form
          this.updateLoading = true
          this.saveDraft(formData)
        })
        .catch(err => {
          console.log(err)
          this.$message({
            showClose: true,
            message: err.msg,
            type: 'warning'
          })
        })
    },
    // 保存草稿
    saveDraft(formData) {
      let params = {
        type: this.formId,
        data: formData
      }
      this.$client
        .AddDraftFlowManage(params)
        .then(req => {
          this.updateLoading = false
          if (req.head.result === '200') {
            eventOn.$emit('update-draft')
            this.dialogClose()
            this.$message({ message: '保存成功', type: 'success' })
          } else {
            this.$message({ message: req.head.describle, type: 'error' })
          }
        })
        .catch(e => {
          this.updateLoading = false
          this.dialogClose()
          this.$message({ message: '服务异常', type: 'error' })
        })
    },
    // 提交
    saveForm() {
      if (this.updateLoading) {
        return false
      }
      if (this.isCommit) {
        if (!this.formUpdateApi) {
          this.$message.warning('功能正在开发中，敬请期待！')
          return
        }
        this.$refs[this.formKey]
          .outData()
          .then(res => {
            // 更新审批单
            this.updateLoading = true
            let params = {
              context: {
                form_data: Object.assign({}, res.form),
                step_data: null
              }
            }
            this.$client[this.formUpdateApi](params)
              .then(req => {
                this.updateLoading = false
                if (req.head.result === '200') {
                  this.$emit('on-commit')
                } else {
                  this.$message({ message: req.head.describle, type: 'error' })
                }
              })
              .catch(e => {
                this.updateLoading = false
                this.$message({ message: '服务异常', type: 'error' })
              })
          })
          .catch(err => {
            console.log(err)
            this.$message({
              showClose: true,
              message: err.msg,
              type: 'warning'
            })
          })
      } else {
        if (!this.formAddApi) {
          this.$message.warning('功能正在开发中，敬请期待！')
          return
        }
        this.$refs[this.formKey]
          .outData()
          .then(res => {
            this.updateLoading = true
            let formData = res.form
            let data = JSON.parse(JSON.stringify(this.nodes))
            this.$client[this.formAddApi]({
              context: {
                form_data: formData,
                step_data: data
              }
            })
              .then(req => {
                this.updateLoading = false
                // 星级微调刷新
                this.$emit('on-refresh')
                if (req.head.result === '200') {
                  this.dialogClose()
                  this.$message({ message: req.head.describle, type: 'success' })
                } else {
                  this.$message({ message: req.head.describle, type: 'error' })
                }
              })
              .catch(e => {
                this.updateLoading = false
                this.$message({ message: '服务异常', type: 'error' })
              })
          })
          .catch(err => {
            this.$message({
              showClose: true,
              message: err.msg,
              type: 'warning'
            })
          })
      }
    },
    // 接收流程节点
    setUsers(data) {
      this.nodes = data
    },
    // 更新流程
    FormChange(codeObj) {
      this.form_data = codeObj.form
      this.key = new Date().getTime()
    },
    // 重新发起提交回显
    setData(val) {
      setTimeout(() => {
        this.$refs[this.formKey].initSet(val)
      }, 30)
    },
    // 工单跳转打开车辆外修联系单并赋值
    initFormData(val) {
      this.$refs[this.formKey].initSetFormData(val)
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
/deep/ .el-dialog__title {
  font-size: 18px;
  font-weight: bold;
  color: #333333
}
.anniu {
  position: absolute;
  left: 10px;
  top: 10px;
  cursor: pointer;
}
</style>

<style>
.fullscreen {
  width: 100% !important;
  margin: 0 !important;
}
</style>

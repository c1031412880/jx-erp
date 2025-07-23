<template>
  <el-dialog :visible="dialogBool" :title="formData.id === 0 ? '添加' : '编辑'" :before-close="dialogClose" width="950px" >
    <el-form
      :inline="true"
      :model="formData"
      ref="formData"
      label-width="120px"
    >
      <el-col :span="12">
        <el-form-item label-width="0px">
          <el-button-group>
            <el-button :type="activeName === 1 ? 'primary' : ''" @click="activeName = 1">拟稿表单</el-button>
            <el-button :type="activeName === 2 ? 'primary' : ''" @click="activeName = 2">流程</el-button>
            <el-button :type="activeName === 3 ? 'primary' : ''" @click="activeName = 3;$refs.contentModel.setHeight()">正文</el-button>
            <el-button :type="activeName === 4 ? 'primary' : ''" @click="activeName = 4">附件</el-button>
          </el-button-group>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item>
          <el-button type="primary" v-if="state < 1" @click="submitFormData">提交</el-button>
        </el-form-item>
        <el-form-item v-if="state < 1">
          <el-button type="primary" @click="saveForm">保存</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dialogClose">关闭</el-button>
        </el-form-item>
      </el-col>
    </el-form>
    <div class="content-box">
      <base-info @on-flow-change="baseFlowChange" ref="baseInfo" v-show="activeName === 1"></base-info>
      <content-model :isSet="state < 2" :height="505" :isModel="true" ref="contentModel" v-show="activeName === 3"></content-model>
      <approve-schedule v-show="activeName === 2" :isFlow="true" :flow_id="formData.flow_id" :doc_id="formData.id"></approve-schedule>
      <encosure-box v-show="activeName === 4" ref="encosureBox"></encosure-box>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelectTree from '@/components/base/formModel/tree/get-department-select-tree'
import contentModel from '@/components/document-model/content-model'
import getOverprintSelect from './get-overprint-select'
import getSealSelect from './get-seal-select'
import baseInfo from './base-info'
import approveSchedule from '@/components/approve-echo/approve-schedule'
import encosureBox from './enclosure'
export default {
  components: {getDepartmentSelectTree, contentModel, baseInfo, getOverprintSelect, getSealSelect, approveSchedule, encosureBox},
  props: {
    dialogBool: Boolean,
  },
  data() {
    return {
      formData: {
        id: 0,
        code: '',
        font: '',
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
        flow_id: '',
        main_department: '',
        copy_departments: [],
        main_persons: [],
        copy_persons: [],
        files: [],
        post_count_view: 0,
        posy_time_view: 0,
        degree_view: 0,
        secret_view: 0,
        main_department_view: 0,
        copy_department_view: 0
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
        code: ''
      },
      state: -1,
      activeName: 1,
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        Object.assign(this.$refs.baseInfo.$data, this.$refs.baseInfo.$options.data())
        this.$refs.contentModel.setData(null)
      }
    },
  },
  methods: {
    // 流程改变
    baseFlowChange(flow_id) {
      this.formData.flow_id = flow_id
    },
    // 编辑时数据回显
    setData(val){
      Object.keys(val).forEach(key => {
        if(this.formData.hasOwnProperty(key)) {
          this.formData[key] = val[key]
          this.$refs.baseInfo.formData[key] = val[key]
        }
      })
      this.$refs.encosureBox.data = val.files
      console.log(this.$refs.baseInfo.formData)
      this.subForm.flow_record_id = val.flow_record_id
      this.state = val.state
      this.subForm.document_id = this.formData.id
      this.subForm.flow_id = this.formData.flow_id
      this.subForm.state = val.step_id
      this.subForm.state_name = val.step_name || ''
      this.subForm.document_code = this.formData.code || ''
      this.subForm.count = val.post_count
      let objContent = val.content ? JSON.parse(val.content) : {}
      objContent.contentTitle = val.title
      objContent.post_count = val.post_count
      objContent.posy_time = val.posy_time
      objContent.keyword = val.keyword
      objContent.type = val.type
      objContent.code = val.code
      objContent.degree = val.degree
      objContent.secret = val.secret
      objContent.font = val.font

      // 红头套红
      if (val.head_content) {
        let objHead = val.head_content ? JSON.parse(val.head_content) : {}
        objContent.title = objHead.title
        objContent.fontText = objHead.fontText
        objContent.userName = objHead.userName
      }
      // 盖章
      if (val.document_seals) {
        objContent.sealList = []
        val.document_seals.forEach(item => {
          if (item.seal_place) {
            objContent.sealList.push(JSON.parse(item.seal_place))
          }
        })
      }

      setTimeout(() => {
        this.$refs.contentModel.setData(objContent)
      }, 100)
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 保存草稿
    saveForm() {
      Object.assign(this.formData,this.$refs.baseInfo.formData)
      this.formData.content = this.$refs.contentModel.getData()
      let files = this.$refs.encosureBox.data
      this.formData.files = files
      if (!this.formData.font) {
        this.$message.warning('请填写公文字号');
        return false
      }
      if (!this.formData.title) {
        this.$message.warning('请填写公文标题');
        return false
      }
      if (!this.formData.post_id) {
        this.$message.warning('请选择拟稿人');
        return false
      }
      if (!this.formData.post_count) {
        this.$message.warning('请填写发文份数');
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
      // if (!this.formData.files.length) {
      //   this.$message.warning('请上传附件');
      //   return false
      // }
      if (!this.formData.main_department) {
        this.$message.warning('请选择主送单位');
        return false
      }
      if (!this.formData.main_persons.length) {
        this.$message.warning('请选择主送人员');
        return false
      }
      if (!this.formData.flow_id) {
        this.$message.warning('请选择发文流程');
        return false
      }

      if (this.formData.id) {
        this.$client.UpdateDocumentMain({context: this.formData}).then(req => {
          if (req.head.result === '200') {
            this.$message({
              message: req.head.describle,
              type: 'success'
            });
          } else {
            this.$message.error(req.head.describle);
          }
        })
      } else {
        this.$client.AddDocumentMain({context: this.formData}).then(req => {
          if (req.head.result === '200') {
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
      if (this.state === -1) {
        this.$message.warning('请先保存草稿在提交');
        return false
      }
      if (this.state === 0) {
        this.$emit('on-ok', this.subForm)
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

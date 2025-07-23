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
<!--            <el-button :type="activeName === 4 ? 'primary' : ''" @click="activeName = 4">附件</el-button>-->
          </el-button-group>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item>
          <el-button type="primary" v-if="state < 2" @click="submitFormData">提交</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-if="state > 1" @click="documentPrints">打印</el-button>
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
      <get-seal-select @change="AddSeal" v-if="subForm.state_name === '盖章' && activeName === 3"></get-seal-select>
      <get-overprint-select v-if="subForm.state_name === '套红' && activeName === 3" v-model="subForm.head_id" @change="overprintSelectChange"></get-overprint-select>
      <base-info @on-flow-change="baseFlowChange" ref="baseInfo" v-show="activeName === 1" :isNumber="subForm.state_name === '编号'"></base-info>
      <content-model :isSet="state < 2" :height="505" :isModel="true" ref="contentModel" v-show="activeName === 3"></content-model>
      <approve-schedule v-if="activeName === 2" :isFlow="true" :flow_id="formData.flow_id" :doc_id="formData.id"></approve-schedule>
    </div>
    <div style="position: fixed;width: 950px;height: 1320px;background: #fff;top: 0;" v-show="printsShow">
      <content-model :isSet="state < 2" :height="1320" :isModel="true" ref="contentModel"></content-model>
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
            v-model="subForm.reamrk">
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
import approveSchedule from '@/components/approve-echo/approve-schedule'
export default {
  components: {getDepartmentSelectTree, contentModel, baseInfo, getOverprintSelect, getSealSelect, approveSchedule},
  props: {
    dialogBool: Boolean,
  },
  data() {
    return {
      formData: {
        id: 0,
        code: '',
        font: 1,
        title: '',
        department_id: 0,
        type: 1,
        post_id: 0,
        post_count: 0,
        posy_time: '',
        degree: 1,
        secret: 1,
        keyword: '',
        content: '',
        is_sms: 1,
        flow_id: '',
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
      opinionShow: false,
      printsShow: false
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
    documentPrints() {
      this.printsShow = true
      setTimeout(() => {
        this.$refs.contentModel.setPDF()
      }, 100)
    },
    // 流程改变
    baseFlowChange(flow_id) {
      this.formData.flow_id = flow_id
    },
    // 设置套红
    overprintSelectChange(item) {
      let objContent = item.content ? JSON.parse(item.content) : {}
      console.log(objContent)
      this.$refs.contentModel.editorContent.title = objContent.title
      this.$refs.contentModel.editorContent.fontText = objContent.fontText
      this.$refs.contentModel.editorContent.userName = objContent.userName
    },
    // 添加印章
    AddSeal(item) {
      this.$refs.contentModel.editorContent.sealList.push({
        width: item.width * 3.78,
        height: item.length * 3.78,
        x: 10,
        y: 10,
        url: item.url,
        id: item.id
      })
    },
    // 编辑时数据回显
    setData(val){
      Object.keys(val).forEach(key => {
        if(this.formData.hasOwnProperty(key)) {
          this.formData[key] = val[key]
          this.$refs.baseInfo.formData[key] = val[key]
        }
      })
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
      if (!this.formData.title) {
        this.$message.warning('请填写公文标题');
        return false
      }
      if (!this.formData.posy_time) {
        this.$message.warning('请选择发文日期');
        return false
      }
      if (!this.formData.keyword) {
        this.$message.warning('请填写主题词');
        return false
      }
      if (!this.formData.flow_id) {
        this.$message.warning('请选择发文流程');
        return false
      }
      if (!this.formData.content) {
        this.$message.warning('请填写正文内容');
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
            this.state = 0
            this.subForm.state = req.context.state
            this.subForm.state_name = req.context.state_name
          } else {
            this.$message.error(req.head.describle);
          }
        })
      }

    },
    // 提交审核
    subState(state) {
      this.formData = this.$refs.baseInfo.formData
      this.subForm.result = state
      this.subForm.document_code = this.formData.code
      this.subForm.document_seals = []
      if (this.subForm.document_code === '编号') {
        if (!this.subForm.document_code) {
          this.$message.warning('请填写编号');
          return false
        }
      }
      if (this.subForm.state_name === '盖章') {
        if (!this.$refs.contentModel.editorContent.sealList.length) {
          this.$message.warning('请为正文盖章');
          return false
        }
        this.$refs.contentModel.editorContent.sealList.forEach(item => {
          this.subForm.document_seals.push({
            seal_id: item.id,
            seal_place: JSON.stringify(item)
          })
        })
      }

      this.$emit('on-ok', this.subForm)
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

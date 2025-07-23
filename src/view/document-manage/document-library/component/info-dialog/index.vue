<template>
  <el-dialog :visible="dialogBool" :title="dialogTitle" :before-close="dialogClose" width="1020px"  :close-on-click-modal="false">
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
              <el-button v-if="type === 1" @click="openDocument">正文</el-button>
              <el-button v-else :type="activeName === 6 ? 'primary' : ''" @click="activeName = 6">正文</el-button>
            </el-button-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!-- <el-form-item>
            <el-button type="primary" v-if="is_audit" @click="submitFormData">提交</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveFormData" v-if="type === 1 && !formData.code">保存</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-if="state > 1 && activeName === 3" @click="documentPrints">打印</el-button>
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" @click="dialogClose">关闭</el-button>
          </el-form-item>
        </el-col>
      </el-form>
      <div class="content-box">
        <get-seal-select @change="AddSeal" v-if="subForm.state_name === '盖章' && activeName === 3"></get-seal-select>
        <get-overprint-select v-if="subForm.state_name === '套红' && activeName === 3" v-model="subForm.head_id" @change="overprintSelectChange"></get-overprint-select>
        <base-info @on-flow-change="baseFlowChange" ref="baseInfo" v-show="activeName === 1" :isNumber="subForm.state_name === '编号'"></base-info>
        <receipt-base ref="receiptBase" v-show="activeName === 5"></receipt-base>
        <content-model :isSeal="subForm.state_name === '盖章'" :isSet="state < 2" :height="505" :isModel="true" ref="contentModel" v-show="activeName === 3"></content-model>
        <content-box ref="contentBox" v-show="activeName === 6"></content-box>
        <approve-schedule :flow_record_id="subForm.flow_record_id" v-if="activeName === 2" :type="type" :isFlow="true" :flow_id="formData.flow_id" :doc_id="formData.id"></approve-schedule>
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
import approveSchedule from '@/components/approve-echo/approve-schedule'
export default {
  components: {getDepartmentSelectTree, contentModel, baseInfo, getOverprintSelect, getSealSelect, approveSchedule, receiptBase, contentBox, enclosure},
  props: {
    dialogBool: Boolean,
    dialogTitle: {
      type: String,
      default: '查看'
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
      baseLoading: false
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
    // 查看公文
    openDocument() {
      let url = newHttpConfig.documentUrl
      url = url + '/showDocument.html' + `?url=${this.formData.content}`
      window.open(url)
    },
    documentPrints() {
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
        content: this.$refs.contentModel.getData(),
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
    // 设置套红
    overprintSelectChange(item) {
      let objContent = item.content ? JSON.parse(item.content) : {}
      this.$refs.contentModel.editorContent.title = objContent.title
      this.$refs.contentModel.editorContent.isTH = true
      this.$refs.contentModel.editorContent.userName = objContent.userName
      this.$refs.contentModel.editorContent.post_count_view = objContent.post_count_view
      this.$refs.contentModel.editorContent.posy_time_view = objContent.posy_time_view
      this.$refs.contentModel.editorContent.degree_view = objContent.degree_view
      this.$refs.contentModel.editorContent.secret_view = objContent.secret_view
      this.$refs.contentModel.editorContent.main_department_view = objContent.main_department_view
      this.$refs.contentModel.editorContent.copy_department_view = objContent.copy_department_view
      this.$refs.contentModel.editorContent.keyword_view = objContent.keyword_view
    },
    // 添加印章
    AddSeal(item) {
      this.$refs.contentModel.editorContent.sealList.push({
        width: item.width * 3.77,
        height: item.length * 3.77,
        x: 10,
        y: 10,
        url: item.url,
        id: item.id,
        name: item.name
      })
    },
    // 编辑时数据回显
    setData(val){
      this.baseLoading = true
      // this.is_audit = val.is_audit
      this.type = val.type
      this.subForm.flow_record_id = val.flow_record_id
      this.$client.GetByIdDocumentMain({id: val.document_id, type: this.type}).then(req => {{
        setTimeout(() => {
          this.baseLoading = false
        }, 300);
        if (req.head.result === '200') {
          if (val.type === 1) {
            this.activeName = 1
            let item = req.context.main
            console.log(item,6666)
            this.$refs.enclosure.data = item.files
            Object.keys(item).forEach(key => {
              if(this.formData.hasOwnProperty(key)) {
                this.formData[key] = item[key]
                this.$refs.baseInfo.formData[key] = item[key]
              }
            })

            this.state = item.state
            this.is_audit = (item.state < 2 && val.is_audit) ? true : false
            this.subForm.document_id = val.document_id
            this.subForm.flow_id = this.formData.flow_id
            this.subForm.state = val.step_id
            this.subForm.state_name = val.step_name || ''
            this.subForm.document_code = this.formData.code || ''
            this.subForm.count = item.post_count
            let objContent = item.content ? JSON.parse(item.content) : {}
            objContent.contentTitle = item.title
            objContent.post_count = item.post_count
            objContent.posy_time = item.posy_time
            objContent.keyword = item.keyword
            objContent.type = item.type
            objContent.code = item.code
            objContent.degree = item.degree
            objContent.secret = item.secret
            objContent.font_number = item.font_number
            objContent.department_name= item.department_name
            objContent.main_department_name= item.main_department_name
            objContent.copy_department_names= item.copy_department_names
            // objContent.post_count_view= item.post_count_view
            // objContent.posy_time_view= item.posy_time_view
            // objContent.degree_view= item.degree_view
            // objContent.secret_view= item.secret_view
            // objContent.main_department_view= item.main_department_view
            // objContent.copy_department_view= item.copy_department_view
            // 红头套红
            if (item.head_content) {
              let objHead = item.head_content ? JSON.parse(item.head_content) : {}
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
            // // 盖章
            // if (item.document_seals) {
            //   objContent.sealList = []
            //   item.document_seals.forEach(obj => {
            //     if (obj.seal_place) {
            //       objContent.sealList.push(JSON.parse(obj.seal_place))
            //     }
            //   })
            // }

            // 盖章
            if (item.document_seals) {
              objContent.sealList = []
              item.document_seals.forEach((obj, i) => {
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
              this.$refs.contentModel.setData(objContent)
            }, 100)
          } else {
            this.activeName = 5
            let item = req.context.accept
            this.$refs.enclosure.data = item.files
            Object.keys(item).forEach(key => {
              if(this.$refs.receiptBase.formData.hasOwnProperty(key)) {
                this.formData[key] = item[key]
                this.$refs.receiptBase.formData[key] = item[key]
              }
            })
            this.state = val.state
            this.is_audit = (item.state < 2 && val.is_audit) ? true : false
            this.subForm.document_id = this.formData.id
            this.subForm.flow_id = this.formData.flow_id
            this.subForm.state = val.step_id
            this.subForm.state_name = val.step_name || ''
            this.subForm.document_code = this.formData.code || ''
            this.subForm.count = val.post_count
            // console.log(val);
            this.$refs.contentBox.content_url = val.content_url
            this.$refs.contentBox.content = val.content
          }
        }
      }})
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 提交审核
    subState(state) {
      this.formData = this.$refs.baseInfo.formData
      this.subForm.result = state
      this.subForm.document_code = this.formData.code
      this.subForm.document_seals = []
      if (this.subForm.state_name === '编号') {
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

      this.$emit('on-ok', this.subForm, this.type)
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

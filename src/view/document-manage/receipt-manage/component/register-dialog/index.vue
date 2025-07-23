<template>
  <el-dialog :visible="dialogBool" title="收文登记" :before-close="dialogClose" width="950px" >
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
            <el-button :type="activeName === 3 ? 'primary' : ''" @click="activeName = 3">附件</el-button>
          </el-button-group>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item>
          <el-button type="primary" @click="submitFormData">提交</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dialogClose">关闭</el-button>
        </el-form-item>
      </el-col>
    </el-form>
    <div class="content-box">
      <base-info ref="baseInfo" v-show="activeName === 1" :isNumber="subForm.state_name === '编号'"></base-info>
      <approve-schedule v-show="activeName === 2" :isFlow="true" :flow_id="formData.flow_id" :doc_id="formData.id"></approve-schedule>
      <enclosure-list v-show="activeName === 3" ref="enclosureList"></enclosure-list>
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
import baseInfo from './base-info'
import approveSchedule from '@/components/approve-echo/approve-schedule'
import enclosureList from './enclosure'
export default {
  components: {getDepartmentSelectTree, baseInfo, approveSchedule, enclosureList},
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
        type: 1,
        secret: 1,
        is_sms: 1,
        flow_id: 0,
        organ: '',
        accept_date: '',
        files: []
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
        document_seals: []
      },
      state: -1,
      activeName: 1,
      opinionShow: false,
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        Object.assign(this.$refs.baseInfo.$data, this.$refs.baseInfo.$options)
        this.$refs.contentModel.setData({})
      }
    },
  },
  methods: {
    // 编辑时数据回显
    setData(val){
      Object.keys(val).forEach(key => {
        if(this.formData.hasOwnProperty(key)) {
          this.formData[key] = val[key]
          this.$refs.baseInfo.formData[key] = val[key]
        }
      })
      this.subForm.document_id = this.formData.id
      this.subForm.flow_id = this.formData.flow_id
      this.subForm.state = val.step_id
      this.subForm.state_name = val.step_name || ''
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    subState(state) {
      this.subForm.result = state

      this.$emit('on-ok', this.subForm)
    },
    // 提交
    submitFormData() {
      this.subForm.reamrk = ''
      this.opinionShow = true
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

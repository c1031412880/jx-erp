<template>
  <el-form :inline="true" size="mini" :model="form" ref="form">
    <el-form-item>
      <el-input
        v-model="form.content"
        clearable placeholder="请输入搜索关键词,包括审批标题,编号,正文内容"
        prefix-icon="el-icon-search" style="width: 350px;"></el-input>
    </el-form-item>
    <el-form-item label="流程类型">
      <el-select v-model="type" clearable @change="form.form_id = []">
        <el-option label="表单流程" :value="1"></el-option>
        <el-option label="固定流程" :value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="固定类型" prop="object_id" v-if="type === 2">
      <el-select v-model="form.form_id" clearable multiple filterable collapse-tags :style="{width: '240px'}">
        <el-option :label="item.label" :value="Number(item.id)" v-for="item in typeOptions" :key="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="关联表单" prop="object_id" v-if="type === 1">
      <el-select
        v-model="form.form_id"
        placeholder="请选择选择表单"
        clearable
        filterable
        multiple
        collapse-tags
        :style="{width: '240px'}">
        <el-option :label="item.label" :value="Number(item.id)" v-for="item in contactFormOptions" :key="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="流程状态" prop="state" v-if="active_name !== 'fourth'">
      <el-select v-model="form.state" placeholder="请选择">
        <el-option
          v-for="item in stateList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="审批人" v-if="active_name !== 'fourth' && active_name !== 'first'">
      <get-user-select-tree v-model="form.check_ids" placeholder="选择审批人"></get-user-select-tree>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
    </el-form-item>
  </el-form>
</template>

<script type="text/ecmascript-6">
import getUserSelectTree from 'components/base/formModel/tree/get-user-select-tree'
export default {
  components: {getUserSelectTree},
  props: {
    active_name: {
      type: String,
      default: 'first'
    }
  },
  data() {
    return {
      type: 1,
      form: {
        content: '',
        state: '',
        form_id: [],
        check_ids: []
      },
      stateList: [
        {label: '全部', value: 0},
        {label: '审批中', value: 1},
        {label: '审批通过', value: 2},
        {label: '审批拒绝', value: 3},
        {label: '已撤销', value: 4},
      ],
      contactFormOptions: [],
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.onSubmit()
      this.getAllForm()
      this.getFlowType()
    })
  },
  methods: {
    onSubmit() {
      let info = {}
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      this.$emit("on-ok", info);
    },
    // 获取所有表单
    getAllForm() {
      this.contactFormOptions = [];
      this.$client.GetFormTypeFlowManage({}).then(req => {
        if (req.head.result === "200") {
          Object.keys(req.context).forEach(key => {
            this.contactFormOptions.push({
              id: key,
              label: req.context[key]
            })
          })
          // this.selectChanged(this.type)
        }
      });
    },
     // 获取流程分类
    getFlowType() {
      this.typeOptions = []
      this.$client.GetFlowTypeFlowManage({}).then(req => {
        console.log('流程分类', req)
        if (req.head.result === "200") {
          Object.keys(req.context).forEach(key => {
            this.typeOptions.push({
              id: key,
              label: req.context[key]
            })
          })
        }
      })
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
<template>
  <el-form :inline="true" size="mini">
    <el-form-item label="关联表单" prop="object_id">
      <el-select
        v-model="form.type"
        placeholder="请选择选择表单"
        clearable
        filterable
        :style="{width: '240px'}">
        <!-- multiple
        collapse-tags -->
        <el-option :label="item.label" :value="Number(item.id)" v-for="item in contactFormOptions" :key="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        type: ''
      },
      contactFormOptions: [],
    };
  },
  created() {
    this.getAllForm()
  },
  methods: {
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
        }
      });
    },
    // 查询
    onSubmit() {      
      this.$emit("on-ok", this.form);
    },
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
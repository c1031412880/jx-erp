<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="流程类型">
          <el-select v-model="form.type" clearable @change="selectChanged">
            <el-option label="表单流程" :value="1"></el-option>
            <el-option label="固定流程" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="固定类型" prop="object_id" v-if="form.type === 2">
          <el-select v-model="form.object_id" clearable>
            <el-option :label="item.label" :value="Number(item.id)" v-for="item in typeOptions" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联表单" prop="object_id" v-if="form.type === 1">
          <el-select
            v-model="form.object_id"
            placeholder="请选择表单"
            clearable
            filterable
            :style="{width: '100%'}">
            <el-option :label="item.label" :value="Number(item.id)" v-for="item in contactFormOptions" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="onBtn('add')" v-if="$isPowerShow('add')">添加流程</el-button>
        </el-form-item>
        <div style="float: right; height:47px; display: flex;">
          <i class="el-icon-s-tools" style="cursor:pointer;" @click="openSettingPage()"></i>
        </div>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  components: { },
  data() {
    return {
      typeOptions: [],
      contactFormOptions: [],
      form: {
        type: "",
        object_id: "",
      },
    };
  },
  created() {
    this.getAllForm();
    this.getFlowType()
  },
  methods: {
    // 获取所有表单
    getAllForm() {
      this.contactFormOptions = [];
      this.$client.GetFormTypeFlowManage({}).then(req => {
        console.log("新表单接口", req);
        if (req.head.result === "200") {
          Object.keys(req.context).forEach(key => {
            this.contactFormOptions.push({
              id: key,
              label: req.context[key]
            })
          })
          this.selectChanged(this.form.object_id)
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
    selectChanged(val) {
      if (!val) {
        this.form.object_id = ''
      }
    },
    onSubmit() {
      this.$emit("on-ok", this.$outFormData(this.form));
    },
    onBtn(com) {
      this.$emit("on-" + com);
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>

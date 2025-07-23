<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="常用语:"> 
          <el-input v-model="form.language" placeholder="搜索常用语" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item label="关联审批单:">
          <el-select v-model="form.form_ids" filterable clearable multiple placeholder="请选择">
            <el-option
              v-for="(item,index) in formList"
              :key="index"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="关联按键:">
          <el-select v-model="form.buttons" multiple placeholder="请选择">
            <el-option
              v-for="item in buttonList"
              :key="item.id"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" type="primary" icon="el-icon-refresh-right"
            >重置</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="addFrom()" type="primary">添加</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary"  @click="deleteFrom()">删除</el-button>
        </el-form-item> -->
      </el-row>
      
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props:{
    formList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      form: {
        language:"",
        form_ids: [],
        buttons: []
      },
      buttonList:[
          { id: 1 , label: '退回'},
          { id: 2 , label: '加签'},
          { id: 3 , label: '拒绝'},
          { id: 4 , label: '同意'},
          { id: 5 , label: '乘客服务'},
      ]
    };
  },
  created() {
  },
  methods: {
    // 查询
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      this.form.language = ""
      this.form.form_ids = []
      this.form.buttons = []
      // this.$parent.restTableList();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
      this.onSubmit()
    },
    // 添加编辑
    addFrom() {
      this.$emit("on-add", 'add');
    },
    deleteFrom() {
      this.$emit("delete-from");     
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>

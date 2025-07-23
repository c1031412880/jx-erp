<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="维修车间：" >
          <getmaintaindep v-model="form.shop_id" @on-change="getValueId" placeholder="选择维修车间"></getmaintaindep>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon='el-icon-plus' type="primary" @click="onBtn('add')">添加</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getmaintaindep from "@/components/base/formModel/select/get-maintain-dep";
export default {
  components:{
    getmaintaindep,
  },
  data() {
    return {
      form: {
        shop_id: ''
      },
    };
  },
  mounted() {},
  watch: {
    'form.shop_id': function(val) {
      this.onSubmit()
    }
  },
  methods: {
    getValueId(val) {
      this.form.shop_id = val.id
      // this.onSubmit()
    },
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
    // 添加
    onBtn(com) {
      this.$emit("on-" + com);
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>

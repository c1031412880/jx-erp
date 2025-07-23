<template>
  <div v-cloak>
    <el-form :inline="true" size="mini" :model="form" ref="form">
      <el-row>
        <el-form-item label="物资编号:" prop="begin">
         <el-input @input="changeName" v-model="form.code" clearable></el-input>
        </el-form-item>
        <el-form-item label="物资名称:" prop="begin">
         <el-input @input="changeName" v-model="form.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品条码:" prop="begin">
         <el-input @input="changeName" v-model="form.barcode" clearable></el-input>
        </el-form-item>
        <el-form-item label="规格型号:" prop="begin">
         <el-input @input="changeName" v-model="form.specification" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('add')" icon="el-icon-plus">添加</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="onSave('save')">确认</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="closeDialog()">关闭</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      date:[],
      form: {
        code: '',
        name:'',
        barcode:'',
        specification:'',
        usable:'1',
      },
      timer: null
    };
  },
  mounted() {
  },
  methods: {
    // 查询
    onSubmit() {
      let info = {...this.form};
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 500);
    },
    // 添加编辑
    onBtn(com) {
      this.$emit("on-add", com);
    },
    onSave() {
      this.$emit("on-save");
    },
    changeName() {
      this.debounce(this.onSubmit,1500)()
    },
    closeDialog() {
      this.$emit("on-close");
    },
    debounce(fn, delay = 500) {
      // timer 是在闭包中的
      let that = this
      return function() {
        if(that.timer) {
            clearTimeout(that.timer);
        }
        that.timer = setTimeout(() => {
            fn.apply(this, arguments);
            // 清空定时器
            that.timer = null;
        }, delay)
      }
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>

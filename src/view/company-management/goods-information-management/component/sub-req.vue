<template>
  <el-form :inline="true" size="mini" :model="form" ref="form">
    <el-form-item label="分类名称">
      <el-input v-model="form.type_name" placeholder="请输入分类名称"></el-input>
    </el-form-item>
    <el-form-item label="物品编号">
      <el-input v-model="form.goods_code" placeholder="请输入物品编号"></el-input>
    </el-form-item>
    <el-form-item label="物品名称">
      <el-input v-model="form.goods_name" placeholder="请输入物品名称"></el-input>
    </el-form-item>
    <el-form-item label="存放地址">
      <el-input v-model="form.address" placeholder="请输入存放地址"></el-input>
    </el-form-item>
    <el-form-item label="供应商：">
      <get-supplier-list 
        style="width:100%"
        v-model="form.supplier_id" 
        :placeholder="'请选择供应商'">
      </get-supplier-list>
    </el-form-item>
    <!-- <el-form-item label="物品状态">
      <el-select v-model="form.type" placeholder="请选择类型">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>  
      </el-select>
    </el-form-item> -->
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-refresh-right" @click="resetForm()">重置</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-plus" v-if="$isPowerShow('add')" @click="onBtn('add')">新建入库</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-delete" v-if="$isPowerShow('delete')" @click="onBtn('del')" :disabled="!isCanDelete">删除</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-download" v-if="$isPowerShow('import')" @click="onBtn('import')">导入</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-upload2" v-if="$isPowerShow('export')" @click="onBtn('export')">导出</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-s-tools" v-if="$isPowerShow('remind')" @click="onBtn('set')">库存预警提醒设置</el-button>
    </el-form-item>
  </el-form>
</template>

<script type="text/ecmascript-6">
import getSupplierList from "@/components/base/formModel/select/get-supplier-list";
export default {
  props:{
    isCanDelete:[Boolean]
  },
  components: { getSupplierList },
  data() {
    return {
      form: {
        type_name: '',
        goods_code: '',
        goods_name: '',
        address: '',
        supplier_id: ''
      },
      options: [
        {value: 0, label: '全部'},
        {value: 1, label: '使用中'},
        {value: 2, label: '闲置中'},
        {value: 3, label: '已报废'},
      ],
    }
  },
  mounted() {

  },
  methods: {
    onSubmit() {
      let info = {}
      for(let key in this.form) {
        if(this.form[key]) info[key] = this.form[key]
      }
      this.$emit("on-ok", info);
    },
    resetForm() {
      Object.assign(this.$data, this.$options.data());
      this.onSubmit()
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 500);
    },
    onBtn(type) {
      this.$emit('on-' + type)
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
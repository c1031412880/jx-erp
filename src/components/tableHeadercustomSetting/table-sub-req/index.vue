<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row class="show-flex-box-r">
        <slot name="firstLine"></slot>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search"  @click="onBtn('submit')" >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('reset')" icon="el-icon-refresh-left"
            >重置</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="text" @click="openShowAdvancedFilteringPop" v-if="isShowAdvancedFiltering">高级筛选</el-button>
        </el-form-item>
      </el-row>
      <el-row style="">
        <div>
          <slot name="secondLineLeft"></slot>
          <el-form-item>
            <el-button type="primary" @click="onBtn('add')" icon="el-icon-plus" v-if="$isPowerShow('add')"
              >添加</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onBtn('delete')" icon="el-icon-delete" v-if="$isPowerShow('delete')"
              >删除</el-button
            >
          </el-form-item>
          <el-form-item> 
            <el-button @click="onBtn('import')" icon="el-icon-download" v-if="$isPowerShow('import')"
              >导入</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button @click="onBtn('export')" icon="el-icon-upload2" v-if="$isPowerShow('export')"
              >导出</el-button
            >
          </el-form-item>
          <slot name="secondLineRight"></slot>
          <div style=" float: right; height: 47px; padding: 20px 0;display: flex">
            <i
              class="el-icon-refresh"
              style="margin-right: 15px; cursor: pointer"
              @click="onBtn('refresh')"
            ></i>
            <i
              class="el-icon-s-tools"
              style="cursor: pointer"
              @click="onBtn('custom-header')"
            ></i>
          </div>
        </div>

        
      </el-row>
    </el-form>
    <div class="Advanced-filtering" v-if="isShowAdvancedFiltering">
      <el-drawer
        title="高级筛选"
        :visible.sync="drawerdialogVisible"
        :direction="'rtl'"
        size="650px"
      >
        <div class="advanced-filter ">
          <div>
            <slot name="drawerDialogContent"></slot>
          </div>
          <div class="demo-drawer__footer show-flex-box-r show-flex-center" style="margin-top: 60px;" >
            <el-button icon="el-icon-refresh-left" size="mini" @click="resetForm()">重置</el-button>
            <el-button icon="el-icon-search" type="primary" size="mini" @click="onBtn('ok')">查询</el-button>
          </div>
        </div>
      </el-drawer>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
// slot firstLine第一行    secondLineLeft第二行左边  secondLineRight第二行右边  drawerDialogContent侧边高级筛选弹窗
export default {
  components: {},
  props:{
    isShowAdvancedFiltering:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      drawerdialogVisible: false,
    };
  },
  mounted() {
    
  },
  methods: {
    // 添加编辑
    onBtn(com) {
      this.$emit('onBtn',com);
    },
    // 打开高级筛选
    openShowAdvancedFilteringPop() {
      this.drawerdialogVisible = true
    },
    resetForm() {
      this.$emit('reset-form')
    },
    // 重置高级筛选
    resetDrawerForm() {

    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>

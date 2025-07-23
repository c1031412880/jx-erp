<template>
  <div class="get-supplier-select">
    <el-select
      v-model="selectedValue"
      :multiple="multiple"
      :filterable="filterable"
      :remote="remote"
      :remote-method="remoteMethod"
      :loading="loading"
      :placeholder="placeholder"
      :clearable="clearable"
      :collapse-tags="collapseTags"
      :size="size"
      :disabled="disabled"
      @change="handleChange"
      @clear="handleClear"
      ref="supplierSelect"
    >
      <el-option
        v-for="item in supplierOptions"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      >
        <span style="float: left">{{ item.name }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'GetSupplierSelect',
  props: {
    value: {
      type: [String, Number, Array],
      default: null
    },
    multiple: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请选择供应商'
    },
    clearable: {
      type: Boolean,
      default: true
    },
    filterable: {
      type: Boolean,
      default: true
    },
    remote: {
      type: Boolean,
      default: false
    },
    collapseTags: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'mini'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedValue: this.value,
      supplierOptions: [],
      loading: false,
      remoteKeyword: ''
    }
  },
  watch: {
    value(newVal) {
      this.selectedValue = newVal;
    },
    selectedValue(newVal) {
      this.$emit('input', newVal);
    }
  },
  mounted() {
    this.loadSupplierOptions();
  },
  methods: {
    /**
     * 加载供应商选项
     */
    async loadSupplierOptions() {
      try {
        this.loading = true;
        
        // 调用供应商列表接口
        const response = await this.$client.GetProviderPage({
          page_index: 1,
          page_size: 1000, // 加载更多数据用于筛选
          usable: 1 // 只获取启用的供应商
        });
        
        if (response.head && response.head.result === "200") {
          this.supplierOptions = response.context.list || [];
          console.log('供应商选项加载成功:', this.supplierOptions.length);
        } else {
          console.error('加载供应商选项失败:', response.head && response.head.describle);
          this.$message({
            type: 'error',
            message: (response.head && response.head.describle) || '加载供应商选项失败'
          });
        }
      } catch (error) {
        console.error('加载供应商选项异常:', error);
        this.$message({
          type: 'error',
          message: '加载供应商选项失败，请重试'
        });
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * 远程搜索方法
     * @param {String} query - 搜索关键词
     */
    async remoteMethod(query) {
      if (!query) {
        this.loadSupplierOptions();
        return;
      }
      
      try {
        this.loading = true;
        this.remoteKeyword = query;
        
        // 调用搜索接口
        const response = await this.$client.GetProviderPage({
          page_index: 1,
          page_size: 100,
          usable: 1,
          keyword: query // 假设接口支持关键词搜索
        });
        
        if (response.head && response.head.result === "200") {
          this.supplierOptions = response.context.list || [];
        } else {
          console.error('搜索供应商失败:', response.head && response.head.describle);
        }
      } catch (error) {
        console.error('搜索供应商异常:', error);
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * 选择变化处理
     * @param {String|Array} value - 选中的值
     */
    handleChange(value) {
      this.selectedValue = value;
      this.$emit('change', value);
      
      // 如果是单选，还可以返回完整的选中对象
      if (!this.multiple && value) {
        const selectedOption = this.supplierOptions.find(item => item.id === value);
        if (selectedOption) {
          this.$emit('select', selectedOption);
        }
      }
      
      // 如果是多选，返回选中的对象数组
      if (this.multiple && Array.isArray(value)) {
        const selectedOptions = this.supplierOptions.filter(item => value.includes(item.id));
        this.$emit('select', selectedOptions);
      }
    },
    
    /**
     * 清空处理
     */
    handleClear() {
      this.selectedValue = this.multiple ? [] : null;
      this.$emit('clear');
      this.$emit('change', this.selectedValue);
    },
    
    /**
     * 刷新数据
     */
    refresh() {
      this.loadSupplierOptions();
    },
    
    /**
     * 清空选择（外部调用）
     */
    clearSelection() {
      this.handleClear();
    },
    
    /**
     * 设置焦点
     */
    focus() {
      this.$refs.supplierSelect.focus();
    },
    
    /**
     * 失去焦点
     */
    blur() {
      this.$refs.supplierSelect.blur();
    }
  }
}
</script>

<style lang="scss" scoped>
.get-supplier-select {
  width: 100%;
  
  .el-select {
    width: 100%;
  }
  
  // 选项样式调整
  :deep(.el-select-dropdown__item) {
    height: auto;
    line-height: 1.5;
    padding: 8px 20px;
    
    span {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  
  // 多选标签样式
  :deep(.el-tag) {
    margin-right: 4px;
    margin-bottom: 2px;
  }
  
  // 加载状态样式
  :deep(.el-select__loading-text) {
    color: #999;
  }
}
</style> 
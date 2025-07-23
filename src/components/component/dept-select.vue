<template>
	<el-select v-loading="loading" v-model="currentValue" :size="size" :disabled="isDisabled">
		<el-option v-for="item in data" :key="item.id" :label="item.name" :value="item.id"></el-option>
	</el-select>
</template>

<script>
export default {
	components: {},
	props: {
		size: {
			type: String,
			default: 'mini'
		},
		isDisabled: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			loading: false,
			data: [],
			currentValue: ''
		}
	},
	watch: {
		currentValue(val) {
			this.$emit('on-change', val || null)
		}
	},
	created() {
		this.loadData()
	},
	mounted() {},
	methods: {
		loadData() {
			this.loading = true
			this.data = []
			this.$client
				.GetSimpleDeptList({})
				.then(res => {
					if (res.head.result == '200') {
						this.data = res.context
					}
				})
				.finally(() => {
					this.loading = false
					this.currentValue = 0
				})
		}
	},
	beforeDestroy() {}
}
</script>

<style lang="scss" scoped>
.el-select {
  min-width: 160px;
  
  :deep(.el-input__inner) {
    border: 1px solid #dcdfe6;
    background-color: #fff;
    color: #606266;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    
    &:hover {
      border-color: #c0c4cc;
    }
    
    &:focus {
      outline: none;
      border-color: #409eff;
    }
  }
  
  :deep(.el-input__suffix) {
    color: #c0c4cc;
  }
}

// 下拉框选项样式
:deep(.el-select-dropdown) {
  .el-select-dropdown__item {
    &:hover {
      background-color: #f5f7fa;
    }
    
    &.selected {
      background-color: #409eff;
      color: #fff;
    }
  }
}
</style> 
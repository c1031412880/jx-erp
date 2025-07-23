<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item>
          <el-button type="primary" @click="onBtn('add')" icon="el-icon-plus" :disabled="isSort" v-if="$isPowerShow('add')"
            >添加</el-button
          >
        </el-form-item>
         <el-form-item>
          <el-popconfirm
            @confirm="onBtn('delete')"
            title="确定删除选中的项目吗？"
            v-if="$isPowerShow('del')">
            <el-button slot="reference" type="primary" icon="el-icon-delete" size="mini" :disabled="isSort">删除</el-button>
          </el-popconfirm>
        </el-form-item>
        <el-form-item>
          <span style="margin-right: 8px; color: #606266;">项目名称：</span>
          <el-input 
            v-model="form.c_name" 
            placeholder="请输入稽查项目名称" 
            clearable
            style="width: 200px;"
            @keyup.enter.native="onSubmit"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <span style="margin-right: 8px; color: #606266;">启用状态：</span>
          <el-select 
            v-model="form.i_enable" 
            placeholder="请选择启用状态" 
            clearable
            style="width: 150px;"
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="query-buttons">
          <el-button type="primary" icon="el-icon-search" @click="onSubmit" :disabled="isSort"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="resetForm()" icon="el-icon-refresh-left" :disabled="isSort"
            >重置</el-button
          >
        </el-form-item>

        <el-form-item v-if="isShowSortButton">
          <el-button type="primary" @click="adjustSortSet" v-if="$isPowerShow('sort')">{{!isSort? '排序':'保存排序'}} </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="cancelSort" v-show="isSort">取消排序</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  props:{
    isSort:{
      type: Boolean,
      default: false,
    },
    isShowSortButton:{
      type: Boolean,
      default: true,
    },
    curSelectedDepartment: {
      type: Object,
      default: null
    }
  },
  components: { getDepartmentSelect },
  data() {
    return {
      form: {
        c_name: "",
        i_enable: 1
      },
    };
  },
  mounted() {},
  methods: {
    // 更新表单数据（用于父组件恢复查询条件）
    updateFormData(formData) {
      this.form = { ...formData };
    },
    // 查询
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i] !== "" && this.form[i] !== null && this.form[i] !== undefined) {
          info[i] = this.form[i];
        }
      }
      // 特殊处理i_enable字段，确保0值也能传递
      if (this.form.i_enable === 0 || this.form.i_enable === 1) {
        info.i_enable = this.form.i_enable;
        // 尝试其他可能的参数名
        info.enable = this.form.i_enable;
        info.status = this.form.i_enable;
        // 尝试字符串格式
        info.i_enable_str = this.form.i_enable.toString();
        info.enable_str = this.form.i_enable.toString();
        info.status_str = this.form.i_enable.toString();
        // 尝试usable参数（字符串格式）
        info.usable = this.form.i_enable.toString();
      }
      console.log('子组件传递的参数:', info);
      console.log('i_enable值:', this.form.i_enable, '类型:', typeof this.form.i_enable);
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      this.form.c_name = "";
      this.form.i_enable = 1;
      this.onSubmit();
      // 通知父组件清除缓存的查询条件
      this.$emit("on-reset");
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 500);
    },
    // 添加编辑
    onBtn(com) {
      this.$emit("on-add", com);
    },
    // 调整排序
    adjustSortSet() {
      this.$emit("adjust-sort-set", this.isSort)
    },
    // 取消排序
    cancelSort() {
      this.$emit('on-cancel')
    }
  },
  watch:{
    curSelectedDepartment: {
      handler(newVal, oldVal){
        // 只在首次加载时重置查询条件，避免编辑后重置
        if (!oldVal) {
          this.form.c_name = "" 
          this.form.i_enable = 1
          // 首次加载时自动执行查询
          this.$nextTick(() => {
            this.onSubmit();
          });
        }
      },
      deep: true 
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-form-item {
  margin-right: 10px;
  
  &:last-child {
    margin-right: 0;
  }
}

.el-button {
  margin-left: 8px;
}

.el-input {
  width: 200px;
}

.el-select {
  width: 150px;
  margin-right: 15px;
}

.query-buttons {
  margin-left: 40px;
}
</style>

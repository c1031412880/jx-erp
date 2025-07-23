<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="驾驶员:">
          <get-driver-select-tree
            ref="driverTree"
            v-model="form.driver_ids"
            :width="'220'"
            :isShowCheckbox="true"
            :placeholder="'请选择驾驶员'"
            :isExportMultiple="true"
            clearable>
          </get-driver-select-tree>
        </el-form-item> 
        <el-form-item label="所属组织" prop="dept_ids" v-if="type">
          <get-department-select-tree
            ref="deptTree"
            v-model="form.dept_ids"
            :isShowCheckbox="true"
            :placeholder="'请选择所属组织'"
            :isExportMultiple="true"
            :isCheckStrictly="false"
          ></get-department-select-tree>
        </el-form-item>
        <el-form-item label="评定年份" prop="year" v-if="type">  
          <el-date-picker
            v-model="form.year"
            type="year"
            placeholder="请选择评定年份"
            value-format="yyyy">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="星级" v-if="!type">
          <el-select v-model="form.now_stars" collapse-tags multiple clearable placeholder="请选择星级">
            <el-option
              v-for="item in starsData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="Reset" icon="el-icon-refresh-left">重置</el-button>
        </el-form-item>
        <el-form-item v-if="type">
          <el-button type="primary" icon="el-icon-plus" v-if="$isPowerShow('add')" @click="onAdd">新增</el-button>
        </el-form-item>
        <el-form-item v-if="type">
          <el-button type="danger" icon="el-icon-delete" v-if="$isPowerShow('del')" @click="onBatchDelete">批量删除</el-button>
        </el-form-item>
        <el-form-item v-if="type">
          <el-button type="primary" icon="el-icon-upload2" v-if="$isPowerShow('import')" @click="onImport">导入</el-button>
        </el-form-item>
        <el-form-item v-if="type">
          <el-button type="primary" icon="el-icon-download" v-if="$isPowerShow('export')" @click="onExport">导出</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import getDepartmentSelectTree from "@/components/base/formModel/tree/get-department-select-tree";

export default {
  components: { 
    getDriverSelectTree,
    getDepartmentSelectTree,
  },
  props: {
    // 组件类型：0-星级查询模式, 1-先进驾驶员管理模式
    type: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      // 查询表单数据
      form: {
        driver_ids: [],    // 驾驶员ID数组
        now_stars: [],     // 星级数组（仅在星级查询模式下使用）
        dept_ids: [],      // 部门ID数组
        year: ''           // 评定年份（仅在先进驾驶员管理模式下使用）
      },
      // 星级选项数据
      starsData: [
        {
          label:'一星级',
          value: 1
        },
        {
          label:'二星级',
          value: 2
        },
        {
          label:'三星级',
          value: 3
        },
        {
          label:'四星级',
          value: 4
        },
        {
          label:'五星级',
          value: 5
        },
      ],
    };
  },
  mounted() {
    // 组件挂载后立即执行一次查询
    this.onSubmit();
  },
  methods: {
    /**
     * 提交查询表单
     * 处理表单数据，过滤空值和空数组，然后向父组件发送查询事件
     * @description 将表单中的有效数据发送给父组件进行查询操作
     */
    onSubmit() {
      let info = {};
      // 遍历表单数据，筛选有效值
      for (let i in this.form){
        if(this.form[i] !== '' && this.form[i] !== null && this.form[i] !== undefined){
          // 如果是数组类型且长度为0，则不添加到查询条件中
          if(Array.isArray(this.form[i]) && this.form[i].length === 0) {
            continue;
          }
          info[i] = this.form[i]
        }
      }
      // 向父组件发送查询事件，传递筛选后的查询条件
      this.$emit("on-ok", info);
    },

    /**
     * 重置表单
     * 将表单数据重置为初始状态，清空所有选择器，并重新执行查询
     * @description 恢复表单到初始状态，清空所有已选择的项目
     */
    Reset() {
      // 重置表单数据为初始值
      Object.assign(this.$data.form, this.$options.data().form);
      
      // 清空驾驶员选择器
      this.$refs.driverTree.onClear();
      
      // 如果存在部门选择器则清空（仅在先进驾驶员管理模式下存在）
      if (this.$refs.deptTree) {
        this.$refs.deptTree.onClear();
      }
      
      // 重置后立即执行查询
      this.onSubmit();
    },

    /**
     * 新增事件处理
     * 向父组件发送新增事件信号
     * @description 触发新增功能，由父组件具体处理新增逻辑
     */
    onAdd() {
      this.$emit("on-add");
    },

    /**
     * 批量删除事件处理
     * 向父组件发送批量删除事件信号
     * @description 触发批量删除功能，由父组件具体处理删除逻辑
     */
    onBatchDelete() {
      this.$emit("on-batch-delete");
    },

    /**
     * 导入事件处理
     * 向父组件发送导入事件信号
     * @description 触发数据导入功能，由父组件处理文件选择和导入逻辑
     */
    onImport() {
      this.$emit("on-import");
    },

    /**
     * 导出事件处理
     * 向父组件发送导出事件信号
     * @description 触发数据导出功能，由父组件处理导出逻辑
     */
    onExport() {
      this.$emit("on-export");
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>

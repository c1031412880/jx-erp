<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <!-- 起止日期 -->
        <el-form-item label="起止日期:">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="-"
            start-placeholder="选择开始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            end-placeholder="选择结束日期"
            @change="selectedTime">
          </el-date-picker>
        </el-form-item>
        
        <!-- 供应商多选 -->
        <el-form-item label="供应商:" prop="provider_ids">
          <get-supplier-select
            v-model="form.provider_ids"
            :multiple="true"
            :placeholder="'请选择供应商'"
            style="min-width: 200px;"
            @change="supplierChange"
            ref="supplierSelect"
          ></get-supplier-select>
        </el-form-item>
        
        <!-- 查询按钮 -->
        <el-form-item>
          <el-button 
            type="primary" 
            icon="el-icon-search" 
            @click="onSubmit"
            :loading="loading">
            查询
          </el-button>
        </el-form-item>
        
        <!-- 重置按钮 -->
        <el-form-item>
          <el-button 
            @click="resetForm()" 
            type="primary" 
            icon="el-icon-refresh-right"
            :disabled="loading">
            重置
          </el-button>
        </el-form-item>
        
        <!-- 导出按钮 -->
        <el-form-item>
          <el-button 
            @click="onBtn('export')" 
            icon="el-icon-download"
            :disabled="loading || !hasData">
            导出
          </el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {getDate} from '@/utils/index'
import getSupplierSelect from "@/components/base/formModel/select/get-supplier-select";

export default {
  components: {
    getSupplierSelect,
  },
  data() {
    return {
      date: [], // 日期范围
      form: {
        provider_ids: [], // 供应商ID列表
        start_date: '', // 开始日期
        end_date: '',   // 结束日期
      },
      loading: false,   // 加载状态
      hasData: false,   // 是否有数据，用于控制导出按钮状态
    };
  },
  mounted() {
    this.initializeComponent();
  },
  methods: {
    /**
     * 供应商选择变化处理
     * @param {Array} val - 选中的供应商ID列表
     */
    supplierChange(val) {
      console.log('供应商选择变化:', val);
    },
    
    /**
     * 初始化组件
     */
    async initializeComponent() {
      try {
        this.onSetTime();
        // 默认加载一次数据
        this.onSubmit();
      } catch (error) {
        console.error('组件初始化失败:', error);
        this.$message({
          type: 'error',
          message: '页面初始化失败，请刷新重试'
        });
      }
    },
    
    /**
     * 设置时间范围 - 默认当月1号到今天
     * @param {String} type - 时间类型，默认当月1号到今天
     */
    onSetTime(type = 'monthToToday') {
      try {
        // 直接使用自定义的时间范围（当月1号到今天）
        this.setDefaultMonthRange();
        
      } catch (error) {
        console.error('设置时间失败:', error);
        this.setDefaultMonthRange();
      }
    },
    
    /**
     * 设置默认月份范围（备用方案）- 当月1号到今天
     */
    setDefaultMonthRange() {
      /**
       * 格式化日期为 YYYY-MM-DD 格式（避免时区问题）
       * @param {Date} date - 日期对象
       * @returns {String} 格式化后的日期字符串
       */
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      
      try {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const today = new Date(); // 今天
        
        // 使用本地时间格式化，避免时区转换问题
        this.form.start_date = formatDate(firstDay);
        this.form.end_date = formatDate(today);
        this.date = [this.form.start_date, this.form.end_date];
        
        console.log('使用默认月份范围（当月1号到今天）:', {
          start: this.form.start_date,
          end: this.form.end_date
        });
      } catch (error) {
        console.error('设置默认月份范围失败:', error);
        // 最后的备用方案
        const today = new Date();
        const todayStr = formatDate(today);
        this.form.start_date = todayStr;
        this.form.end_date = todayStr;
        this.date = [todayStr, todayStr];
      }
    },
    
    /**
     * 日期选择变化处理
     */
    selectedTime: function() {
      try {
        if (this.date && this.date.length === 2) {
          // 直接使用日期选择器返回的值，Element UI已经按照value-format格式化
          this.form.start_date = this.date[0];
          this.form.end_date = this.date[1];
        } else {
          // 清空日期
          this.form.start_date = '';
          this.form.end_date = '';
        }
        
        console.log('日期选择变化:', {
          date: this.date,
          start: this.form.start_date,
          end: this.form.end_date
        });
      } catch (error) {
        console.error('处理日期选择变化失败:', error);
        // 发生错误时清空日期
        this.form.start_date = '';
        this.form.end_date = '';
      }
    },
    

    
    /**
     * 提交查询
     */
    onSubmit() {
      try {
        // 验证必填字段
        if (!this.form.start_date || !this.form.end_date) {
          this.$message({
            type: 'warning',
            message: '请选择查询日期范围'
          });
          return;
        }
        
        // 验证日期范围
        if (new Date(this.form.start_date) > new Date(this.form.end_date)) {
          this.$message({
            type: 'warning',
            message: '开始日期不能大于结束日期'
          });
          return;
        }
        
        // 验证日期范围不能超过一年
        const startDate = new Date(this.form.start_date);
        const endDate = new Date(this.form.end_date);
        const oneYear = 365 * 24 * 60 * 60 * 1000; // 一年的毫秒数
        
        if (endDate.getTime() - startDate.getTime() > oneYear) {
          this.$message({
            type: 'warning',
            message: '查询时间范围不能超过一年'
          });
          return;
        }
        
        console.log('提交查询条件:', this.form);
        
        // 构建查询参数
        let queryParams = {
          provider_ids: this.form.provider_ids || [],
          start_date: this.form.start_date,
          end_date: this.form.end_date
        };
        
        // 触发父组件的查询事件
        this.$emit('on-ok', queryParams);
        
      } catch (error) {
        console.error('提交查询失败:', error);
        this.$message({
          type: 'error',
          message: '查询提交失败，请重试'
        });
      }
    },
    
    /**
     * 重置表单
     */
    resetForm() {
      try {
        // 重置表单数据
        this.form.provider_ids = [];
        
        // 重置时间为当月1号到今天
        this.onSetTime();
        
        // 触发供应商选择组件的重置
        if (this.$refs.supplierSelect && this.$refs.supplierSelect.clearSelection) {
          this.$refs.supplierSelect.clearSelection();
        }
        
        console.log('表单已重置:', this.form);
        
        this.$message({
          type: 'success',
          message: '查询条件已重置'
        });
        
      } catch (error) {
        console.error('重置表单失败:', error);
        this.$message({
          type: 'error',
          message: '重置失败，请重试'
        });
      }
    },
    
    /**
     * 按钮操作处理
     * @param {String} type - 操作类型
     */
    onBtn(type) {
      try {
        console.log('按钮操作:', type);
        
        switch (type) {
          case 'export':
            this.$emit('on-export');
            break;
          default:
            console.warn('未知的按钮操作类型:', type);
        }
      } catch (error) {
        console.error('按钮操作处理失败:', error);
      }
    },
    
    /**
     * 更新数据状态（由父组件调用）
     * @param {Boolean} hasData - 是否有数据
     */
    updateDataStatus(hasData) {
      this.hasData = hasData;
    },
    
    /**
     * 设置加载状态（由父组件调用）
     * @param {Boolean} loading - 加载状态
     */
    setLoading(loading) {
      this.loading = loading;
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-form
  margin: 0
  padding: 8px 12px
  background-color: #f5f7fa
  border-bottom: 1px solid #e6e6e6
  box-sizing: border-box
  
  .el-form-item
    margin-bottom: 0
    margin-right: 10px
    
    &:last-child
      margin-right: 0
    
  .el-select
    min-width: 180px
    
  .el-button
    margin-left: 8px
    
    &:first-child
      margin-left: 0
      
  .el-date-editor
    max-width: 300px
</style> 
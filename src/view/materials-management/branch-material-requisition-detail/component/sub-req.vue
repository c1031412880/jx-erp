<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="统计日期:">
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
        <el-form-item label="仓库:" prop="hourse_id">
          <el-select
            v-model="form.hourse_id"
            filterable
            clearable
            multiple
            :collapse-tags="true"
            placeholder="请选择仓库"
            style="min-width: 200px;">
            <el-option
              v-for="item in houseOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="自编号/车牌号:">
          <el-input v-model="form.code" placeholder="请输入自编号/车牌号"></el-input>
        </el-form-item>
        <el-form-item label="工具领用人:">
          <get-user-select
            ref="receiverSelect"
            v-model="form.receiver_ids"
            :isShowCheckbox="true"
            :isExportMultiple="true"
            :placeholder="'请选择工具领用人'"
            @on-change="receiverChange"
          ></get-user-select>
        </el-form-item>
        
        <!-- 含税/不含税单选 -->
        <el-form-item label="税费:">
          <el-radio-group v-model="form.is_rax">
            <el-radio :label="1">含税</el-radio>
            <el-radio :label="0">不含税</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            icon="el-icon-search" 
            @click="onSubmit"
            :loading="loading">
            查询
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button 
            @click="resetForm()" 
            type="primary" 
            icon="el-icon-refresh-right"
            :disabled="loading">
            重置
          </el-button>
        </el-form-item>
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
import getUserSelect from "components/base/formModel/tree/get-user-select";
export default {
  components: {
    getUserSelect,
  },
  data() {
    return {
      date:[],
      form: {
        hourse_id: [], // 仓库ID列表 - 对应接口的house_ids
        start_date: '', // 开始日期 - 对应接口的start_time
        end_date: '',   // 结束日期 - 对应接口的end_time
        code: '', // 自编号/车牌号
        receiver_ids: [], // 工具领用人ID列表
        is_rax: 1, // 是否含税价格，1含税，其他不含税
      },
      houseOptions: [], // 仓库选项列表
      loading: false,   // 加载状态
      hasData: false,   // 是否有数据，用于控制导出按钮状态
    };
  },
  mounted() {
    this.initializeComponent();
  },
  methods: {
    receiverChange(val) {
      console.log(val);
    },
    // 初始化组件
    async initializeComponent() {
      try {
        await this.getWarehouse();
        this.onSetTime();
        this.onSubmit();
      } catch (error) {
        console.error('组件初始化失败:', error);
        this.$message({
          type: 'error',
          message: '页面初始化失败，请刷新重试'
        });
      }
    },
    
         // 设置时间范围 - 默认当前月份
     onSetTime(type = 'thisMonth') {
       try {
         // 尝试使用工具方法获取时间
         if (getDate && typeof getDate === 'function') {
           let timeObj = getDate(type);
           if (timeObj && timeObj.startTime && timeObj.endTime) {
             if (this.$addTime && typeof this.$addTime === 'function') {
               this.date = this.$addTime([timeObj.startTime, timeObj.endTime]);
             } else {
               this.date = [timeObj.startTime, timeObj.endTime];
             }
             
             // 验证并设置日期
             if (this.isValidDateFormat(this.date[0]) && this.isValidDateFormat(this.date[1])) {
               this.form.start_date = this.date[0];
               this.form.end_date = this.date[1];
               return;
             }
           }
         }
         
         // 如果上述方法失败，使用备用方案
         this.setDefaultMonthRange();
         
       } catch (error) {
         console.error('设置时间失败:', error);
         this.setDefaultMonthRange();
       }
     },
     
     // 设置默认月份范围（备用方案） - 当月1号到今天
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
    
         // 日期选择变化处理
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
    
    // 获取仓库列表
    async getWarehouse() {
      try {
        this.loading = true;
        const response = await this.$client.getRecord1Warehouse();
        
        if (response.head && response.head.result === "200") {
          this.houseOptions = response.context || [];
          
          if (this.houseOptions.length === 0) {
            this.$message({
              type: 'warning',
              message: '暂无可用仓库数据'
            });
          }
        } else {
          const errorMessage = response.head && response.head.describle 
            ? response.head.describle 
            : '获取仓库列表失败';
          
          this.$message({
            type: 'error',
            message: errorMessage
          });
          
          this.houseOptions = [];
        }
      } catch (error) {
        console.error('获取仓库列表失败:', error);
        this.$message({
          type: 'error',
          message: '获取仓库列表失败，请检查网络连接'
        });
        this.houseOptions = [];
      } finally {
        this.loading = false;
      }
    },
    
    // 查询按钮点击处理
    onSubmit() {
      try {
        // 验证必填参数
        if (!this.form.start_date || !this.form.end_date) {
          this.$message({
            type: 'warning',
            message: '请选择统计日期范围'
          });
          return;
        }
        
        // 验证日期范围合理性
        if (new Date(this.form.start_date) > new Date(this.form.end_date)) {
          this.$message({
            type: 'warning',
            message: '开始日期不能大于结束日期'
          });
          return;
        }
        
        // 构建查询参数
        let queryParams = {};
        
        // 添加日期参数（必填）
        queryParams.start_date = this.form.start_date;
        queryParams.end_date = this.form.end_date;
        
        // 添加仓库参数（可选，如果未选择则传递空数组）
        queryParams.hourse_id = this.form.hourse_id || [];
        
        // 添加自编号/车牌号参数（可选）
        if (this.form.code && this.form.code.trim()) {
          queryParams.code = this.form.code.trim();
        }
        
        // 添加工具领用人参数（可选）
        queryParams.receiver_ids = this.form.receiver_ids || [];
        
        // 添加含税/不含税参数
        queryParams.is_rax = this.form.is_rax;
        
        // 发送查询事件到父组件
        this.$emit("on-ok", queryParams);
        
        // 记录有数据状态，用于控制导出按钮
        this.hasData = true;
        
      } catch (error) {
        console.error('构建查询参数失败:', error);
        this.$message({
          type: 'error',
          message: '查询参数构建失败，请重试'
        });
      }
    },
    
    // 重置表单
    resetForm() {
      try {
        this.loading = true;
        
        // 重置表单数据
        this.form = {
          hourse_id: [],
          start_date: '',
          end_date: '',
          code: '',
          receiver_ids: [],
          is_rax: 1,
        };
        this.date = [];
        this.hasData = false;
        
        // 重新初始化
        this.onSetTime('thisMonth');
        
        // 延迟执行查询，确保数据重置完成
        this.$nextTick(() => {
          this.onSubmit();
          this.$message({ 
            message: "重置成功", 
            type: "success" 
          });
          this.loading = false;
        });
        
      } catch (error) {
        console.error('重置表单失败:', error);
        this.$message({
          type: 'error',
          message: '重置失败，请刷新页面重试'
        });
        this.loading = false;
      }
    },
    
    // 按钮操作处理（导出等）
    onBtn(action) {
      try {
        if (action === 'export') {
          // 验证是否有数据可导出
          if (!this.hasData) {
            this.$message({
              type: 'warning',
              message: '请先查询数据后再导出'
            });
            return;
          }
          
          // 验证查询条件
          if (!this.form.start_date || !this.form.end_date) {
            this.$message({
              type: 'warning',
              message: '请先设置查询条件'
            });
            return;
          }
        }
        
        // 发送操作事件到父组件
        this.$emit("on-" + action);
        
      } catch (error) {
        console.error(`执行${action}操作失败:`, error);
        this.$message({
          type: 'error',
          message: `${action}操作失败，请重试`
        });
      }
    },
    
         // 更新数据状态（由父组件调用）
     updateDataStatus(hasData) {
       this.hasData = hasData;
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
    
  .el-radio-group
    .el-radio
      margin-right: 15px
      
      &:last-child
        margin-right: 0
</style> 
<template>
  <div class="warehouse-settings">
    <div class="settings-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h2>仓库管理设置</h2>
        <p>配置库存锁定规则，管理仓库库存状态</p>
      </div>

      <!-- 库存月度锁定设置 -->
      <el-card class="setting-card" shadow="never">
        <div slot="header" class="card-header">
          <span class="card-title">库存月度锁定设置</span>
          <p class="card-desc">启用月度锁定后，该月份的入库单、出库单、调拨单将被锁定</p>
        </div>

        <el-form :model="form" :rules="rules" ref="settingsForm" label-width="140px" size="medium" v-loading="loading">
          <!-- 锁定详情设置 -->
          <el-form-item label="锁定月份管理:">
            <div class="lock-detail-container">
              <!-- 添加新锁定月份 -->
              <div class="add-lock-section">
                <el-date-picker
                  v-model="newLockDate"
                  type="month"
                  placeholder="选择要管理的月份"
                  format="yyyy-MM"
                  value-format="yyyy-MM"
                  size="small"
                  style="width: 200px; margin-right: 10px;">
                </el-date-picker>
                <el-button 
                  type="primary" 
                  size="small" 
                  @click="addLockMonth"
                  :disabled="!newLockDate">
                  添加月份
                </el-button>
              </div>

              <!-- 月份管理列表 -->
              <div class="lock-list-section" v-if="form.month_lock_detail && form.month_lock_detail.length > 0">
                <h4>月份管理列表：</h4>
                <div class="lock-item-list">
                  <div 
                    v-for="(item, index) in form.month_lock_detail" 
                    :key="item.id || index" 
                    class="lock-item">
                    <div class="lock-info">
                      <el-tag 
                        :type="getTagType(item.state)" 
                        size="medium">
                        {{ formatLockDateDisplay(item.lock_time) }}
                      </el-tag>
                      <span class="lock-status">
                        {{ getStateText(item.state) }}
                      </span>
                    </div>
                    <div class="lock-actions">
                      <el-button
                        type="text"
                        size="small"
                        @click="toggleLockState(item, index)"
                        :class="getButtonClass(item.state)">
                        {{ getActionText(item.state) }}
                      </el-button>
                      <el-button
                        type="text"
                        size="small"
                        class="delete-btn"
                        @click="removeLockMonth(index)">
                        删除
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 空状态 -->
              <div v-else class="empty-lock-state">
                <p>暂未设置管理月份，请添加需要管理的月份</p>
              </div>
            </div>
          </el-form-item>

          <!-- 操作按钮 -->
          <el-form-item>
            <el-button 
              type="primary" 
              @click="saveSettings" 
              :loading="saving"
              size="medium">
              保存设置
            </el-button>
            <el-button 
              @click="resetSettings" 
              size="medium">
              重置
            </el-button>
            <el-button 
              @click="refreshSettings" 
              size="medium">
              刷新
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import { formatDate } from "@/utils/index";

export default {
  name: "warehouse-settings",
  data() {
    return {
      loading: false,
      saving: false,
      newLockDate: '', // 新添加的锁定日期
      form: {
        id: 0,
        created_id: 0,
        create_date: '',
        update_id: 0,
        update_date: '',
        month_lock_detail: [] // 月度锁定详情列表
      },
      // 表单验证规则
      rules: {}
    };
  },
  mounted() {
    this.loadSettings();
  },
  methods: {
    /**
     * 加载设置数据
     */
    async loadSettings() {
      try {
        this.loading = true;
        const response = await this.$client.GetInventoryRule();
        console.log('response',response)
        if (response.head && response.head.cmd === "200") {
          if (response.context) {
            this.form = {
              ...response.context,
              month_lock_detail: response.context.month_lock_detail || []
            };
            console.log('form',this.form)
          }
          // 初始化加载时不显示成功提示
        } else {
          const errorMsg = (response.head && response.head.describle) || '获取设置失败';
          this.$message.error(errorMsg);
        }
      } catch (error) {
        console.error('加载设置失败:', error);
        this.$message.error('加载设置失败，请检查网络连接');
      } finally {
        this.loading = false;
      }
    },

    /**
     * 保存设置
     */
    async saveSettings() {
      try {
        // 表单验证
        const valid = await this.$refs.settingsForm.validate();
        if (!valid) return;

        this.saving = true;
        
        // 构建请求参数
        const params = {
          context: {
            ...this.form,
            update_date: new Date().toISOString()
          }
        };

        const response = await this.$client.SetInventoryRule(params);
        
        if (response.head && response.head.cmd === "200") {
          this.$message.success('设置保存成功');
          // 重新加载设置
          await this.loadSettings();
        } else {
          const errorMsg = (response.head && response.head.describle) || '保存设置失败';
          this.$message.error(errorMsg);
        }
      } catch (error) {
        console.error('保存设置失败:', error);
        this.$message.error('保存设置失败，请重试');
      } finally {
        this.saving = false;
      }
    },

    /**
     * 重置设置
     */
    resetSettings() {
      this.$confirm('确定要重置所有设置吗？这将清除当前的修改。', '确认重置', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loadSettings();
        this.newLockDate = '';
        this.$message.success('设置已重置');
      }).catch(() => {
        // 用户取消
      });
    },

    /**
     * 刷新设置
     */
    refreshSettings() {
      this.loadSettings();
      this.newLockDate = '';
    },



    /**
     * 添加锁定月份
     */
    addLockMonth() {
      if (!this.newLockDate) {
        this.$message.warning('请选择要管理的月份');
        return;
      }

      // 检查是否已存在相同月份
      const exists = this.form.month_lock_detail.some(item => {
        const existingMonth = this.formatLockDateDisplay(item.lock_time);
        return existingMonth === this.newLockDate;
      });

      if (exists) {
        this.$message.warning('该月份已经在管理列表中');
        return;
      }

      // 添加新的锁定月份
      const currentTime = new Date().toISOString();
      const newLockItem = {
        id: 0, // 新添加的设为0
        main_id: this.form.id,
        lock_time: `${this.newLockDate}-01T00:00:00`, // 使用ISO格式
        state: 2, // 默认未启用状态（2表示未启用）
        created_id: 0,
        create_date: currentTime,
        update_id: 0,
        update_date: currentTime
      };

      this.form.month_lock_detail.push(newLockItem);
      this.newLockDate = '';
      this.$message.success('月份添加成功');
    },

    /**
     * 移除锁定月份
     */
    removeLockMonth(index) {
      this.$confirm('确定要删除这个月份吗？', '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.form.month_lock_detail.splice(index, 1);
        this.$message.success('月份删除成功');
      }).catch(() => {
        // 用户取消
      });
    },

    /**
     * 切换启用状态
     */
    toggleLockState(item, index) {
      const newState = item.state === 1 ? 2 : 1; // 1启用，2不启用
      const action = newState === 1 ? '启用' : '禁用';
      
      this.$confirm(`确定要${action}${this.formatLockDateDisplay(item.lock_time)}月份的锁定规则吗？`, `确认${action}`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.form.month_lock_detail[index].state = newState;
        this.form.month_lock_detail[index].update_date = new Date().toISOString();
        this.$message.success(`${action}成功`);
      }).catch(() => {
        // 用户取消
      });
    },

    /**
     * 获取状态显示文本
     */
    getStateText(state) {
      switch (state) {
        case 1:
          return '已启用';
        case 2:
          return '未启用';
        default:
          return '未知状态';
      }
    },

    /**
     * 获取操作按钮文本
     */
    getActionText(state) {
      switch (state) {
        case 1:
          return '禁用';
        case 2:
          return '启用';
        default:
          return '操作';
      }
    },

    /**
     * 获取标签类型
     */
    getTagType(state) {
      switch (state) {
        case 1:
          return 'success'; // 绿色，表示已启用
        case 2:
          return 'info';    // 灰色，表示未启用
        default:
          return 'warning'; // 橙色，表示未知状态
      }
    },

    /**
     * 获取按钮样式类
     */
    getButtonClass(state) {
      switch (state) {
        case 1:
          return 'unlock-btn'; // 禁用按钮样式（绿色）
        case 2:
          return 'lock-btn';   // 启用按钮样式（橙色）
        default:
          return '';
      }
    },

    /**
     * 格式化锁定日期显示（用于列表展示，只显示年月）
     */
    formatLockDateDisplay(dateStr) {
      if (!dateStr) return '';
      try {
        const date = new Date(dateStr);
        return formatDate(date, 'yyyy-MM');
      } catch (error) {
        console.error('日期格式化失败:', error);
        return dateStr;
      }
    },

    /**
     * 格式化锁定日期（完整格式用于数据处理）
     */
    formatLockDate(dateStr) {
      if (!dateStr) return '';
      try {
        const date = new Date(dateStr);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      } catch (error) {
        console.error('日期格式化失败:', error);
        return dateStr;
      }
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.warehouse-settings
  width: 100%
  height: 100%
  padding: 20px
  background-color: #f5f7fa

.settings-container
  max-width: 1200px
  margin: 0 auto

.page-header
  margin-bottom: 24px
  
  h2
    margin: 0 0 8px 0
    font-size: 24px
    font-weight: 500
    color: #303133
    
  p
    margin: 0
    color: #606266
    font-size: 14px

.setting-card
  margin-bottom: 24px
  
  /deep/ .el-card__header
    padding: 20px 24px
    border-bottom: 1px solid #EBEEF5
    
  /deep/ .el-card__body
    padding: 24px

.card-header
  .card-title
    font-size: 16px
    font-weight: 500
    color: #303133
    
  .card-desc
    margin: 8px 0 0 0
    color: #909399
    font-size: 13px

.form-tip
  margin-left: 12px
  color: #909399
  font-size: 12px

.lock-detail-container
  border: 1px solid #EBEEF5
  border-radius: 4px
  padding: 16px
  background-color: #fafafa

.add-lock-section
  margin-bottom: 20px
  padding-bottom: 16px
  border-bottom: 1px solid #EBEEF5

.lock-list-section
  h4
    margin: 0 0 12px 0
    color: #303133
    font-size: 14px
    font-weight: 500

.lock-item-list
  display: flex
  flex-direction: column
  gap: 12px

.lock-item
  display: flex
  justify-content: space-between
  align-items: center
  padding: 12px 16px
  background-color: #fff
  border: 1px solid #EBEEF5
  border-radius: 4px
  
  &:hover
    border-color: #C0C4CC

.lock-info
  display: flex
  align-items: center
  gap: 12px
  
  .lock-status
    color: #606266
    font-size: 13px

.lock-actions
  display: flex
  gap: 8px

.lock-btn
  color: #E6A23C
  
  &:hover
    color: #EBB563

.unlock-btn
  color: #67C23A
  
  &:hover
    color: #85CE61

.delete-btn
  color: #F56C6C
  
  &:hover
    color: #F78989

.empty-lock-state
  text-align: center
  padding: 40px 20px
  color: #909399
  
  p
    margin: 0
    font-size: 14px

// Element UI 样式覆盖
/deep/ .el-form-item
  margin-bottom: 24px

/deep/ .el-form-item__label
  color: #606266
  font-weight: 500

/deep/ .el-switch__text
  color: #606266

/deep/ .el-button
  border-radius: 4px
  
  &.el-button--primary
    background-color: #409EFF
    border-color: #409EFF
    
    &:hover
      background-color: #66B1FF
      border-color: #66B1FF
</style> 
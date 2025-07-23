<template>
  <el-dialog
    :visible="dialogBool"
    title="提醒设置"
    width="620px"
    :before-close="dialogClose"
    :close-on-click-modal="false"
  >
    <el-form :model="form" :rules="rules" ref="form" label-width="160px" size="mini">
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item label="公交车提醒接收人员：" prop="bus_persons">
            <get-department-select
              ref="busPersonalTree"
              v-model="form.bus_persons"
              :width="360"
              :show_all="true"
              :isShowCheckbox="true"
              :placeholder="'请选择提醒接收人员：'"
              :isContainEmp="true"
              :isExportMultiple="true"
              :isCheckStrictly="false"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-tooltip class="item" effect="dark" content="不设置时默认只提醒受理人员" placement="top-end">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </el-col>
        <el-col :span="20">
          <el-form-item label="自行车提醒接收人员：" prop="bicycle_persons">
            <get-department-select
              ref="bikePersonalTree"
              v-model="form.bicycle_persons"
              :width="360"
              :show_all="true"
              :isShowCheckbox="true"
              :placeholder="'请选择提醒接收人员：'"
              :isContainEmp="true"
              :isExportMultiple="true"
              :isCheckStrictly="false"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-tooltip class="item" effect="dark" content="不设置时默认只提醒受理人员" placement="top-end">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </el-col>
      </el-row>
      <el-form-item label="提醒方式：" prop="remind_type">
        <el-checkbox-group v-model="form.remind_type">
          <el-checkbox :label="1">系统消息</el-checkbox>
          <el-checkbox :label="2">APP推送</el-checkbox>
          <el-checkbox :label="3">短信通知</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="逾期提前提醒天数：" prop="warn_day">
        <el-input-number v-model="form.warn_day" :min="1" style="width: 120px" />
        <span>&nbsp;天</span>
      </el-form-item>
      <el-form-item label="提醒周期：" prop="remind_rat">
        <div class="set-proportion-start show-flex-box-r" style="align-items: center;">
          <span>每</span>
          <el-input-number v-model="form.remind_rat" :min="1" style="width: 120px; margin: 0 8px;" />
          <span>天提醒一次，提醒时间</span>
          <el-time-picker
            v-model="form.remind_date"
            :picker-options="{ selectableRange: '00:00:00-23:59:59' }"
            format="HH:mm"
            value-format="HH:mm"
            :clearable="false"
            style="width: 120px; margin-left: 8px;"
          />
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取消</el-button>
      <el-button type="primary" @click="handleSave" :loading="loading">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import getDepartmentSelect from '@/components/base/formModel/tree/get-department-select-tree';
export default {
  name: 'ReminderSettingDialog',
  components: { getDepartmentSelect },
  props: {
    dialogBool: Boolean,
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        bus_persons: [],
        bicycle_persons: [],
        remind_type: [1], // 默认系统消息
        warn_day: 1,
        remind_rat: 1,
        remind_date: '09:00',
        id: undefined // 用于编辑时传递id
      },
      rules: {
        remind_type: [
          { required: true, message: '请选择提醒方式', trigger: 'change' }
        ],
        warn_day: [
          { required: true, message: '请输入逾期提前提醒天数', trigger: 'change' }
        ],
        remind_rat: [
          { required: true, message: '请输入提醒周期', trigger: 'change' }
        ]
      },
      loading: false
    }
  },
  watch: {
    dialogBool(val) {
      if (!val) {
        this.resetForm();
      } else {
        this.getRemindRule();
        this.$nextTick(() => {
          if (this.$refs.form) this.$refs.form.clearValidate();
        });
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit('update:dialogBool', false);
    },
    resetForm() {
      this.form = {
        bus_persons: [],
        bicycle_persons: [],
        remind_type: [1],
        warn_day: 2,
        remind_rat: 1,
        remind_date: '09:00',
        id: undefined
      };
      if (this.$refs.form) this.$refs.form.resetFields();
    },
    // 获取提醒规则
    async getRemindRule() {
      this.loading = true;
      try {
        const res = await this.$client.GetListPassengerServiceRule();
        console.log(res);
        if (res && res.head && res.head.result === '200' && Array.isArray(res.context) && res.context.length > 0) {
          const rule = res.context[0];
          this.form.id = rule.id;
          this.form.bus_persons = rule.bus_persons || [];
          this.form.bicycle_persons = rule.bicycle_persons || [];
          this.form.remind_type = Array.isArray(rule.remind_type) ? rule.remind_type : (rule.remind_type ? rule.remind_type.split(',').map(Number) : [1]);
          this.form.warn_day = rule.warn_day || 1;
          this.form.remind_rat = rule.remind_rat || 1;
          this.form.remind_date = rule.remind_date || '09:00';
        }
      } catch (e) {
        console.log(e);
        this.$message.error('获取提醒规则失败');
      } finally {
        this.loading = false;
      }
    },
    // 保存提醒规则
    handleSave() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const params = {
            context: {
              ...this.form,
              remind_type: this.form.remind_type.join(',')
            }
          }
          try {
            this.loading = true;
            const res = await this.$client.AddOrUpdateRulePassengerServiceRule(params);
            if (res && res.head && res.head.result === '200') {
              this.$message.success('保存成功');
              this.dialogClose();
            } else {
              this.$message.error(res.head && res.head.describle ? res.head.describle : '保存失败');
            }
          } catch (e) {
            this.$message.error('保存失败');
          } finally {
            this.loading = false;
          }
        }
      });
    }
  }
}
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
.set-proportion-start {
  display: flex;
}
.show-flex-box-r {
  display: flex;
  flex-direction: row;
}
</style> 
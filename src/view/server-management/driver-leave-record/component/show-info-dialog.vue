<template>
  <div class="show-info-dialog">
    <el-dialog
      :title="title"
      :visible="dialogVisible"
      width="600px"
      :close-on-click-modal="false"
      :before-close="handleClose">
      
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
        size="mini">
        
        <el-form-item label="驾驶员" prop="driver_id">
          <get-driver-select-tree
            ref="driverTree"
            v-model="form.driver_id"
            :isShowCheckbox="false"
            :placeholder="'请选择驾驶员'"
            :isExportMultiple="false"
            :isCheckStrictly="true"
            :disabled="curChangeType == 'detail'"
            @on-change="changeDriver"
          ></get-driver-select-tree>
        </el-form-item>

        <el-form-item label="所属组织" prop="dept_id">
          <get-department-select-tree
            ref="deptTree"
            v-model="form.dept_id"
            :isShowCheckbox="false"
            :placeholder="'请选择所属组织'"
            :isExportMultiple="false"
            :isCheckStrictly="true"
            :disabled="true"
          ></get-department-select-tree>
        </el-form-item>

        <el-form-item label="类型" prop="leave_type">
          <tr-select-dictionaries
            v-model="form.leave_type"
            :clearable="true"
            :classKey="'驾驶员病、工、事假类型'" 
            :placeholder="'请选择类型'"
            @on-change="changeType"
            :disabled="curChangeType == 'detail'"
            style="width: 100%"
          ></tr-select-dictionaries>
        </el-form-item>

        <el-form-item prop="start_date" label="开始时间">
          <el-col :span="11">
            <el-date-picker
              @change="timeChange"
              :clearable="false"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              v-model="form.start_date"
              :disabled="curChangeType == 'detail'"
              style="width: 100%"
            ></el-date-picker>
          </el-col>
          <el-col class="line" :span="2" style="text-align: center">-</el-col>
          <el-col :span="11">
            <el-select v-model="form.start_time" @change="timeChange" :disabled="curChangeType == 'detail'">
              <el-option
                v-for="item in dataOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
        </el-form-item>

        <el-form-item prop="end_date" label="结束时间">
          <el-col :span="11">
            <el-date-picker
              @change="timeChange"
              :clearable="false"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              v-model="form.end_date"
              :disabled="curChangeType == 'detail'"
              style="width: 100%"
            ></el-date-picker>
          </el-col>
          <el-col class="line" :span="2" style="text-align: center">-</el-col>
          <el-col :span="11">
            <el-select v-model="form.end_time" @change="timeChange" prop="end_time" :disabled="curChangeType == 'detail'">
              <el-option
                v-for="item in dataOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
        </el-form-item>

        <el-form-item label="天数" prop="leave_days">
          <el-input-number
            v-model="form.leave_days"
            :min="0"
            :max="365"
            :step="0.5"
            :step-strictly="true"
            placeholder="请输入天数"
            :disabled="curChangeType == 'detail'"
            style="width: 100%">
          </el-input-number>
        </el-form-item>

        <el-form-item label="扣分" prop="de_score">
          <el-input-number
            v-model="form.de_score"
            :min="0"
            :max="100"
            placeholder="请输入扣分"
            :disabled="curChangeType == 'detail'"
            style="width: 100%">
          </el-input-number>
        </el-form-item>

        <el-form-item label="是否取消月考核" prop="is_cancle_star">
          <el-radio-group v-model="form.is_cancle_star" :disabled="curChangeType == 'detail'">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
            :disabled="curChangeType == 'detail'">
          </el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer" v-if="curChangeType !== 'detail'">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import getDepartmentSelectTree from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  name: 'ShowInfoDialog',
  components: {
    getDriverSelectTree,
    getDepartmentSelectTree,
  },
  props: {
    dialogBool: {
      type: Boolean,
      default: false
    },
    curChangeType: {
      type: String,
      default: "add" //add添加  edit编辑  detail详情
    }
  },
  data() {
    return {
      dialogVisible: false,
      submitting: false,
      title: "添加记录",
      form: {
        id: null,
        driver_id: null,
        dept_id: null,
        leave_type: '',
        start_date: '',
        start_time: 1,
        end_date: '',
        end_time: 2,
        leave_days: 0,
        de_score: 0,
        is_cancle_star: 2,
        remark: ''
      },
      dataOptions: [
        {label: '上午', value: 1},
        {label: '下午', value: 2},
      ],
      rules: {
        driver_id: [
          { required: true, message: '请选择驾驶员', trigger: 'change' }
        ],
        // dept_id: [
        //   { required: true, message: '请选择所属组织', trigger: 'change' }
        // ],
        leave_type: [
          { required: true, message: '请选择假期类型', trigger: 'change' }
        ],
        start_date: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        end_date: [
          { required: true, message: '请选择结束时间', trigger: 'change' }
        ],
        leave_days: [
          { required: true, message: '请输入天数', trigger: 'blur' },
          { type: 'number', min: 0, message: '天数不能小于0', trigger: 'blur' }
        ],
        de_score: [
          { required: true, message: '请输入扣分', trigger: 'blur' },
          { type: 'number', min: 0, message: '扣分不能小于0', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        this.dialogVisible = false;
        this.resetForm();
      } else {
        this.dialogVisible = true;
        this.$nextTick(() => {
          // 根据curChangeType设置标题
          switch(this.curChangeType){
            case "add":
              this.title = "添加记录";
              break;
            case "edit":
              this.title = "编辑记录";
              break;
            case "detail":
              this.title = "记录详情";
              break;
          }
          this.$refs.form && this.$refs.form.clearValidate();
        });
      }
    },
    dialogVisible(newVal) {
      this.$emit('update:dialogBool', newVal);
    }
  },
  methods: {
    /**
     * 显示对话框
     * @param {Object} row - 编辑/查看时传入的行数据
     */
    showDialog(row = null) {
      this.dialogVisible = true;
      
      if (row && (this.curChangeType === 'edit' || this.curChangeType === 'detail')) {
        // 编辑或查看模式
        this.setData(row);
      } else {
        // 新增模式
        this.resetForm();
      }
    },

    /**
     * 编辑、查看数据回显
     * @param {Object} val - 回显数据
     */
    setData(val) {
      // 先重置表单
      this.resetForm();
      
      // 设置表单数据
      for (const key in this.form) {
        if (Object.hasOwnProperty.call(val, key)) {
          this.form[key] = val[key]; 
        }
      }
    },

    /**
     * 假期类型变化
     */
    changeType(val) {
      // 这里可以根据选择的假期类型做相应处理
      // console.log('选择的假期类型：', val);
    },

    changeDriver(val, nodes) {
      // console.log('选择的驾驶员：', val, nodes);
      if (nodes && nodes.length > 0) {
        this.form.dept_id = nodes[0].parent_id
      }
    },

    /**
     * 选择时间获取请假时长
     */
    timeChange() {
      if (!this.form.start_date || !this.form.end_date) {
        return false
      }
      let timeStart = new Date(this.form.start_date).getTime()
      let timeEnd = new Date(this.form.end_date).getTime()

      let time = timeEnd - timeStart

      let start_time = this.form.start_time
      let end_time = this.form.end_time

      // 校验
      if (time < 0) {
        this.$message({message: '结束时间不能小于开始时间', type: "error",});
        this.form.end_date = ''
        return false
      } else if((time === 0) && (start_time > end_time)){
        this.$message({message: '结束时间不能小于开始时间', type: "error",});
        this.form.end_date = ''
        return false
      }

      let day = time / (60 * 60 * 24 * 1000)

      if (start_time == end_time) {
        day += 0.5
      }else if (start_time == 1 && end_time == 2) {
        day += 1
      }

      this.form.leave_days = day
    },

    /**
     * 提交表单
     */
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitting = true;
          
          // 准备提交数据
          let info = { ...this.form };
          
          // 数据处理和清理
          if (!info.id || info.id === 0) {
            delete info.id;
          }
          
          // 发送保存事件，传递数据给父组件处理
          this.$emit('save-form', info);
          
          // 重置提交状态和关闭对话框
          setTimeout(() => {
            this.submitting = false;
            this.handleClose();
          }, 500);
        } else {
          this.$message.error('请检查表单输入');
          return false;
        }
      });
    },

    /**
     * 关闭对话框
     */
    handleClose() {
      this.$emit('update:dialogBool', false);
    },

    /**
     * 重置表单
     */
    resetForm() {
      // 重置表单验证
      this.$refs.form && this.$refs.form.resetFields();
      
      // 清空公共组件
      this.$refs.driverTree && this.$refs.driverTree.onClear();
      this.$refs.deptTree && this.$refs.deptTree.onClear();
      
      // 重置表单数据到初始状态
      Object.assign(this.form, this.$options.data().form);
      
      // 重置组件状态
      this.submitting = false;
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style> 
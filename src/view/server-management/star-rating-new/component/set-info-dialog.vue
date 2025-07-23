<template>
  <tr-dialog
    :visible="dialogBool"
    :title="title"
    @before-close="dialogClose"
    width="760px"
    top="20px">
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="140px" size="mini">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="发起人:" prop="user_name">
              <span>{{form.user_name}}</span>
              <!-- <get-department-select
                ref="applyPersonalTree"
                v-if="dialogBool"
                v-model="form.back_id"
                :width="'500'"
                :show_all="true"
                :isShowCheckbox="false"
                :placeholder="'请选择发起人'"
                :isContainEmp="true"
                :isExportMultiple="false"
                :disabled="isShowRepayCarUser"
                @on-change="selectedUser"
              ></get-department-select> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在部门" prop="dept_name">
              <span>{{form.dept_name}}</span>
              <!-- <get-department-select
                ref="applyDeptTree"
                v-model="form.dept_id"
                :width="'220'"
                :isShowCheckbox="false"
                :placeholder="'请选择所在部门'"
                :isContainEmp="false"
                :isExportMultiple="false"
                :disabled="true"
              ></get-department-select> -->
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <tr-table
              :data="data"
              :frontFixedNum="2"
              :loading="loading"
              :selectionShow="false"
              :TableHeight="TableHeight"
              :isShowBottomOptions="false"
              :tableHeaderList="canRendererTableHeader"
              :backFixedNum="1">
            </tr-table>
          </el-col>
        </el-row>
        <!-- 流程节点显示 -->
        <el-card style="margin-top: 10px;max-height: 330px;overflow: auto">
          <approve-step
            :key="key"
            ref="approveStep"
            @on-users="setUsers"
            :form_data="form_data"
            :object_id="5270">
          </approve-step>
        </el-card>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">提 交</el-button>
    </span>
  </tr-dialog>
</template>

<script type="text/ecmascript-6">
import {getUser} from '@/utils/auth'
import approveStep from '@/components/approve-echo/approve-step2'
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: {
    approveStep,
    getDepartmentSelect,
  },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "驾驶员星级考核审批",
    },
  },
  data() {
    return {
      form: {
        user_name: '',
        dept_name: '',
      },
      key: null,
      nodes: null,
      object_id: 5270,
      form_data: null,
      basicRules: {
        user_name: [
          {
            required: true,
            message: "请选择发起人",
            trigger: "change",
          },
        ],
        dept_name: [
          {
            required: true,
            message: "请选择所在部门",
            trigger: "change",
          },
        ],
      },
      data: [],
      loading: false,
      TableHeight: 380,

      canRendererTableHeader: [
        {
          id: 1,
          label: "考核周期",
          prop: "judge_cycle",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable:false
        },
        {
          id: 2,
          label: "驾驶员",
          prop: "driver_name",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable:false
        },
        {
          id: 3,
          label: "在职状态",
          prop: "quit_name",
          width: "120",
          align: "center",
          signIndex: 2,
          sortable:false
        },
        {
          id: 4,
          label: "所属组织",
          prop: "dept_name",
          width: "130",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "上次星级",
          prop: "last_star_name",
          width: "120",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "持续季度",
          prop: "quarter_count",
          width: "120",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "变化情况",
          prop: "change",
          width: "120",
          align: "center",
          signIndex: 6,
        },
        {
          id: 8,
          label: "入职天数",
          prop: "entry_days",
          width: "120",
          align: "center",
          signIndex: 7,
        },
        {
          id: 9,
          label: "缺勤、病假、事假天数",
          prop: "rest_days",
          width: "220",
          align: "center",
          signIndex: 8,
        },
        {
          id: 10,
          label: "考评总分",
          prop: "check_socre",
          width: "130",
          align: "center",
          signIndex: 9,
        },
      ],
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        this.$refs.form.clearValidate()
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 选中数据
    setDate(list) {
      this.data = list
      let userInfo = JSON.parse(getUser());
      this.form.user_name = userInfo.user_name
      this.form.dept_name = userInfo.dept_name
      this.FormChange()
    },
    updatePlaybill(formName) {
      if(this.data.length == 0) {
        this.$message({
          showClose: true,
          message: "请检查选中数据是否已发起审批",
          type: "warning",
        });
        return false
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit("save-add", this.nodes);
        } else {
          return false;
        }
      });
    },
    // 设置流程节点
    setUsers(data) {
      this.nodes = data
    },
    FormChange() {
      this.key = new Date().getTime()
      this.form_data = this.form
      this.object_id = 5270
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>


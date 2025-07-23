<template>
  <el-drawer
    :visible="dialogBool"
    :title="showTitle"
    :size="654"
    :before-close="dialogClose"
    append-to-body
  >
    <div class="leave-approve-form-dialog">
      <el-row>
        <el-col :span="24">
          <div
            class="show-flex-box-r"
            style="margin-bottom: 10px"
          >
            <div class="show-flex-box-r" style="margin: 20px; flex-grow: 1; border-bottom: 1px solid #D7D7D7;">
              <span style="margin-bottom: 10px; margin-right: 30px">
                <el-avatar
                  :size="100"
                  src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                  :fit="'cover'"
                ></el-avatar>
              </span>
              <h3 class="show-flex-box-c">
                <strong style="padding:20px 0 10px 0; font-size: 20px;">杨空余&nbsp;&nbsp;(已离职)</strong>
                <span>会计</span>
                <span style="margin-top: 10px; color: #7CBC19;">审批通过</span>
              </h3>
            </div>
          </div>
        </el-col>
        <el-col :span="24">
          <ul class="leave-info-list" style="padding: 0 20px">
            <li class="leave-info-item show-flex-box-c" style="margin-bottom: 20px;">
              <span style="margin-bottom: 10px">所在部门：</span>
              <strong>综合服务中心-综合服务中心-财务管理部</strong>
            </li>
            <li class="leave-info-item show-flex-box-c" style="margin-bottom: 20px;">
              <span style="margin-bottom: 10px">入职时间：</span>
              <strong>2021-06-20</strong>
            </li>
            <li class="leave-info-item show-flex-box-c" style="margin-bottom: 20px;">
              <span style="margin-bottom: 10px">预计离职日期: </span>
              <strong>2021-07-20</strong>
            </li>
            <li class="leave-info-item show-flex-box-c" style="margin-bottom: 20px;">
              <span style="margin-bottom: 10px">离职原因:</span>
              <strong>个人原因</strong>
            </li>
            <li class="leave-info-item show-flex-box-c" style="margin-bottom: 20px;">
              <span style="margin-bottom: 10px">离职原因备注：</span>
              <strong>个人原因，想离职了</strong>
            </li>
            <li class="leave-info-item show-flex-box-c" style="margin-bottom: 20px;">
              <span style="margin-bottom: 10px">工作交接人：</span>
              <strong>黄飞鸿</strong>
            </li>
            <li class="leave-info-item show-flex-box-c" style="margin-bottom: 20px;">
              <span style="margin-bottom: 10px">实际申请人负责的审批单将在离职后转给交接人负责</span>
              <strong></strong>
            </li>
            <li class="leave-info-item show-flex-box-c" style="margin-bottom: 20px;">
              <strong style="margin-bottom: 20px; font-size: 20px;">流程</strong>
              <div>
                <approve-schedule></approve-schedule>
              </div>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-drawer>
</template>

<script type="text/ecmascript-6">
import approveSchedule from '@/components/approve-echo/approve-schedule.vue'
export default {
  components: {
    approveSchedule
  },
  props: {
    dialogBool: Boolean,
  },
  data() {
    return {
      showTitle: "离职审批单",
      effluentStandardOptions: [],
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        this.configCircuitfInfo();
      }
    },
    title(newVal) {
      this.title = newVal;
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 初始化信息
    configCircuitfInfo() {},
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>

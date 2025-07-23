<template>
  <el-drawer
    :visible="dialogBool"
    :title="showTitle"
    :size="654"
    :before-close="dialogClose"
    append-to-body>
    <div class="leave-approve-form-dialog">
      <el-row>
        <el-col :span="24">
          <div
            class="show-flex-box-r"
            style="margin-bottom: 10px"
          > 
            <div class="show-flex-box-r" style="margin: 20px; flex-grow: 1; border-bottom: 1px solid #D7D7D7;">
              <!-- <span style="margin-bottom: 10px; margin-right: 30px">
                <el-avatar
                  :size="100"
                  src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                  :fit="'cover'"
                ></el-avatar>
              </span> -->
              <h3 class="show-flex-box-c" style="margin-bottom: 15px;">
                <strong style="padding:20px 0 10px 0; font-size: 20px;">{{form.ex_apply_name}}提交的会议室预订申请</strong>
                <div class="show-flex-box-r" style="justify-content: space-between;align-items: center;">
                  <span  class="show-flex-box-r" style="align-items: center;">
                    <span>编号： {{form.flow_code}}</span>
                    <!-- <el-tag size="medium" :type="form.state === 4 ? 'danger' : ''" style="margin-left: 15px;">
                      {{(form.state == 2 && form.user_names) ? `${form.user_names}处理中` : form.ex_state}}
                    </el-tag> -->

                    <el-tag style="margin-left: 15px;"  :type="`${form.state == 3?'success':form.state == 4?'danger': form.state == 5?'info':''}`" v-if="!form.ex_need_check">{{`${form.state == 3?'审批通过':form.state == 4?'已拒绝': form.state == 5?'申请取消':`${form.user_names}`}`}}</el-tag>
                    <!-- <span style="margin-top: 10px; color: #7CBC19;">{{form.ex_state}}</span> -->
                  </span>
                  <div>
                    <!-- 1未发起处理2处理中3处理完成4已驳回5已作废 -->
                    <el-button style="margin: 0 10px;" type="primary" size="mini" @click="cancellation()" v-if="form.created_id === userId && form.state == 2">撤销</el-button>
                  </div>
                </div>
                
              </h3>
            </div>
          </div>
        </el-col>
        <el-col :span="24">
          <ul class="leave-info-list" style="padding: 0 20px">
            <li class="leave-info-item show-flex-box-c" style="margin-bottom: 20px;">
              <span style="margin-bottom: 10px">会议内容：</span>
              <strong>{{form.content}}</strong>
            </li>
            <li class="leave-info-item show-flex-box-c" style="margin-bottom: 20px;">
              <span style="margin-bottom: 10px">会议室名称：</span>
              <strong>{{form.ex_meeting_name}}</strong>
            </li>
            <li class="leave-info-item show-flex-box-c" style="margin-bottom: 20px;">
              <span style="margin-bottom: 10px">开始时间: </span>
              <strong>{{form.begin_time}}</strong>
            </li>
            <li class="leave-info-item show-flex-box-c" style="margin-bottom: 20px;">
              <span style="margin-bottom: 10px">结束时间:</span>
              <strong>{{form.end_time}}</strong>
            </li>
            <li class="leave-info-item show-flex-box-c" style="margin-bottom: 20px;">
              <span style="margin-bottom: 10px">会议室申请人</span>
              <strong>{{form.ex_apply_name}}</strong>
            </li>
            <li class="leave-info-item show-flex-box-c" style="margin-bottom: 20px;">
              <span style="margin-bottom: 10px">参会人员</span>
              <strong>{{form.ex_person_name_str}}</strong>
            </li>
            <!-- <li class="leave-info-item show-flex-box-c" style="margin-bottom: 20px;">
              <span style="margin-bottom: 10px">实际申请人负责的审批单将在离职后转给交接人负责</span>
              <strong></strong>
            </li> -->
            <li class="leave-info-item show-flex-box-c" v-if="!!form.flow_id">
              <strong style="margin-bottom: 20px; font-size: 20px;">流程</strong>
              <!-- <div>
                <approve-schedule :flow_id="form.flow_id" :isFlow="true"></approve-schedule>  
              </div> -->
              <div v-if="!!form.flow_id">
                <approve-schedule :isFlow="false" :flow_id="form.flow_id"></approve-schedule>
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
import { getUser } from "@/utils/auth";
export default {
  components: {
    approveSchedule
  },
  props: {
    dialogBool: Boolean,
  },
  data() {
    return {
      showTitle: "审核",
      effluentStandardOptions: [],
      form:{},
      userId:'',
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        this.configCircuitfInfo();
        this.userId = JSON.parse(getUser()).user_id;
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
    // 申请流程撤销（作废）
    cancellation() {

      this.$confirm('此操作将撤会这条审批记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$client.CancelFlowRecord({ context: this.form.flow_id }).then((req) => {
          if (req.head.result === "200") {
            eventOn.$emit('update-upcoming-matter')
            eventOn.$emit('update-upcoming-meeting-room')
            this.$message({
              message: req.head.describle,
              type: "success",
            });
          } else {
            this.$message.error(req.head.describle);
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消撤回'
        });
      });

    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>

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
        <el-col :span="24" v-if="!!form.is_audit">
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
              <h3 class="show-flex-box-c" style="width: 100%; margin-bottom: 15px;">
                <strong style="padding:20px 0 10px 0; font-size: 20px;" v-if="pageType =='borrow'">{{form.borrow_name}}提交的公车借车审批{{form.replace_name ? form.replace_name : ''}}</strong>
                <strong style="padding:20px 0 10px 0; font-size: 20px;" v-if="pageType =='back'">{{form.back_name}}提交的公车还车审批{{form.replace_name ? form.replace_name : ''}}</strong>
                <div class="show-flex-box-r" style="justify-content: space-between;align-items: center;margin-top:10px;">
                <span class="show-flex-box-r" style="align-items: center;">
                  <span  v-if="pageType =='borrow'">编号： {{form.borrow_flow_code}}</span>
                  <span  v-if="pageType =='back'">编号： {{form.back_flow_code}}</span>
                  <span :style="`color:${checkText(form.state_child).showColor}`">{{checkText(form.state_child).showText}}</span>
                </span>
                <div>
                  <!-- 1借车审批中2借车通过3借车拒绝4还车审批中5还车通过6还车拒绝7撤销借车-->
                  <el-button style="margin: 0 10px;" type="primary" size="mini" @click="cancellation()" v-if="form.borrow_id === userId && (form.state_child == 1 || form.state_child == 4)">撤销</el-button>
                </div>

                  

                </div>
                
              </h3>
            </div>
          </div>
        </el-col>
        <el-col :span="24">
          <ul class="leave-info-list" style="padding: 0 20px" v-if="pageType =='back'">
            <li class="leave-info-item show-flex-box-c" style="margin-bottom: 20px;">
              <span style="margin-bottom: 10px">还车人：</span>
              <strong>{{form.back_name}}</strong>
            </li>
            <li class="leave-info-item show-flex-box-c" style="margin-bottom: 20px;">
              <span style="margin-bottom: 10px">还车时间：</span>
              <strong v-if="!!form.back_time">{{form.back_time.slice(0,16)}}</strong>
            </li>
            <li class="leave-info-item show-flex-box-c" style="margin-bottom: 20px;">
              <span style="margin-bottom: 10px">还车里程/KM: </span>
              <strong>{{form.back_mile}}</strong>
            </li>
            <li class="leave-info-item show-flex-box-c" style="margin-bottom: 20px;">
              <span style="margin-bottom: 10px">停车位置:</span>
              <strong>{{form.back_position}}</strong>
            </li>
            <li class="leave-info-item show-flex-box-c" style="margin-bottom: 20px;">
              <span style="margin-bottom: 10px">车辆别名:</span>
              <strong>{{form.name}}</strong>
            </li>
            <li class="leave-info-item show-flex-box-c" style="margin-bottom: 20px;">
              <span style="margin-bottom: 10px">车牌号:</span>
              <strong>{{form.code}}</strong>
            </li>
            <!-- <li class="leave-info-item show-flex-box-c" style="margin-bottom: 20px;">
              <span style="margin-bottom: 10px">实际申请人负责的审批单将在离职后转给交接人负责</span>
              <strong></strong>
            </li> -->
            <li class="leave-info-item show-flex-box-c" style="margin-bottom: 20px;" v-if="!!form.is_audit">
              <strong style="margin-bottom: 20px; font-size: 20px;">流程</strong>
              <div v-if="!!form.back_flow_id">
                <approve-schedule :isFlow="false" :flow_id="form.back_flow_id"></approve-schedule>
              </div>
            </li>
          </ul>
          <ul class="leave-info-list" style="padding: 0 20px"  v-if="pageType =='borrow'">
            <li class="leave-info-item show-flex-box-c" style="margin-bottom: 20px;">
              <span style="margin-bottom: 10px">借车人：</span>
              <strong>{{form.borrow_name}}</strong>
            </li>
            <li class="leave-info-item show-flex-box-c" style="margin-bottom: 20px;">
              <span style="margin-bottom: 10px">借车时间：</span>
              <strong v-if="!!form.borrow_time">{{form.borrow_time.slice(0,16)}}</strong>
            </li>
            <li class="leave-info-item show-flex-box-c" style="margin-bottom: 20px;">
              <span style="margin-bottom: 10px">预计还车时间：</span>
              <strong v-if="!!form.expect_back_time">{{form.expect_back_time.slice(0,16)}}</strong>
            </li>
            <li class="leave-info-item show-flex-box-c" style="margin-bottom: 20px;">
              <span style="margin-bottom: 10px">借车用途: </span>
              <strong>{{form.purpose}}</strong>
            </li>
            <li class="leave-info-item show-flex-box-c" style="margin-bottom: 20px;">
              <span style="margin-bottom: 10px">出发地:</span>
              <strong>{{form.from_address}}</strong>
            </li>
            <li class="leave-info-item show-flex-box-c" style="margin-bottom: 20px;">
              <span style="margin-bottom: 10px">目的地:</span>
              <strong>{{form.to_address}}</strong>
            </li>
            <li class="leave-info-item show-flex-box-c" style="margin-bottom: 20px;">
              <span style="margin-bottom: 10px">车辆别名:</span>
              <strong>{{form.name}}</strong>
            </li>
            <li class="leave-info-item show-flex-box-c" style="margin-bottom: 20px;">
              <span style="margin-bottom: 10px">车牌号:</span>
              <strong>{{form.code}}</strong>
            </li>
            <!-- <li class="leave-info-item show-flex-box-c" style="margin-bottom: 20px;">
              <span style="margin-bottom: 10px">实际申请人负责的审批单将在离职后转给交接人负责</span>
              <strong></strong>
            </li> -->
            <li class="leave-info-item show-flex-box-c" style="margin-bottom: 20px;" v-if="!!form.is_audit">
              <strong style="margin-bottom: 20px; font-size: 20px;">流程</strong>
              <div v-if="!!form.borrow_flow_id">
                <approve-schedule :isFlow="false" :flow_id="form.borrow_flow_id"></approve-schedule>
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
      pageType:'',
      userId:'',
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
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
    // 设置审批信息
    setData(val,type) {
      this.pageType = type
      this.form = {...val}
      if(this.pageType == 'borrow' && (val.state_child == 5 || val.state_child == 6)) {
        this.form.state_child = 2
      }
      console.log(this.form)
    },
    checkText(state_child) {
      let showObj = {
        showText : '',
        showColor: ''
      }
      switch (state_child) {
        case 1:
          showObj.showText = '借车审批中';
          showObj.showColor = '#409EFF';
          break;
        case 2:
          showObj.showText = '借车通过';
          showObj.showColor = '#67C23A';
          break;
        case 3:
          showObj.showText = '借车拒绝';
          showObj.showColor = '#F56C6C';
          break;
        case 4:
          showObj.showText = '还车审批中';
          showObj.showColor = '#409EFF';
          break;
        case 5:
          showObj.showText = '还车通过';
          showObj.showColor = '#67C23A';
          break;
        case 6:
          showObj.showText = '还车拒绝';
          showObj.showColor = '#F56C6C';
          break;
        case 7:
          showObj.showText = '撤销借车';
          showObj.showColor = '#909399';
          break;
      }
      return showObj
    },
    // 申请流程撤销（作废）
    cancellation() {

      this.$confirm('此操作将撤会这条审批记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          context: this.form.state_child == 1? this.form.borrow_flow_id:this.form.back_flow_id
        }
        this.$client.CancelFlowRecord(params).then((req) => {
          if (req.head.result === "200") { 
            //更新首页内容消息提醒
            eventOn.$emit('update-upcoming-matter')
            // 内容消息提醒
            eventOn.$emit('update-upcoming-utility-vehicle') //更新公车
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

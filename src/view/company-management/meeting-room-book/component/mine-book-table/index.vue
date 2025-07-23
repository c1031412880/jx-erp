<!--  -->
<template>
  <div class="book-meeting-table-box">
    <div class="book-meeting-list show-flex-box-c" v-if="mineBookMeettingData && mineBookMeettingData.length > 0">
      <div class="book-meeting-item show-flex-box-r" v-for="(item,index) in mineBookMeettingData" :key="index">
        <div class="book-meeting-item-left show-flex-box-r">
          <el-image
            style="width: 125px; height: 100%; margin-left: 10px;flex-shrink: 0;"
            :src="item.ex_img_url"
            fit="contain"
            :preview-src-list="[item.ex_img_url]"
          ></el-image>
          <h3 class="show-flex-box-c">
            <h4 class="show-flex-box-r">
              <strong>{{item.ex_meeting_name}}</strong>
              <!-- <em>需审批</em> -->
              <el-tag size="mini" v-if="item.ex_excuting">进行中</el-tag>
              <el-tag size="mini" :type="`${item.state == 3?'success':item.state == 4?'danger': item.state == 5?'info':''}`" v-if="!item.ex_need_check">{{`${item.state == 3?'审批通过':item.state == 4?'已拒绝': item.state == 5?'申请取消':'审批中'}`}}</el-tag>
              <!-- <el-tag type="success" size="mini" v-if="!item.ex_need_check">{{item.state_name}}</el-tag> -->
            </h4>
            <p>时间: {{item.ex_time}}</p>
            <span class="show-flex-box-r">
              <!-- <i class="el-icon-user"></i> -->
              <span>地点：{{item.ex_position}}</span>
            </span>
          </h3>
        </div>
        <div class="show-flex-box-r book-meeting-item-right">
          <el-popconfirm
           @confirm="cancleRowInfo(item)"
            title="是否确认取消会议室预订?"
            v-if="status == 'reserved'"
          >
           <el-button type="text" slot="reference" style="margin-right:10px;">取消预定</el-button>
          </el-popconfirm>

          <el-button type="text" @click="openAuditPop(item)" v-if="!item.ex_need_check">审批详情</el-button>
        </div>
      </div>
    </div>
    <div>
      <audit-detail
        ref="auditDetail"
        :dialogBool.sync="auditDetailShow"
      ></audit-detail>
    </div>
  </div>
</template>

<script>
import auditDetail from "./component/audit-detail";
export default {
  components: {auditDetail},
  props: {
    mineBookMeettingData:[Array],
    status:{
      type: String,
      default: 'reserved'
    }
  },
  data() {
    return {
      visible: false,
      auditDetailShow: false
    };
  },
  created() {},
  mounted() {
  },
  computed: {},
  watch: {},
  methods: {
    openAuditPop(item) {
      this.auditDetailShow = true;
      this.$refs.auditDetail.form = item;
      // this.$router.push({
      //   path: `/news-details/${item.id}/${item.ex_meeting_name}会议室审批/10`
      // })
    },
    cancleRowInfo(info) {
      let params = {
        context: [info.id],
      };
      this.$client.cancelBookMeetingRoom(params)
        .then((res) => {
          if (res.head.result == "200") {
            // 刷新列表
            this.$emit('refsh-list-on-mine')
            this.$message({
              showClose: true,
              message: "取消预定成功",
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        });
    }
  },
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.book-meeting-table-box {
  height: 100%;
  width: 100%;

  .book-meeting-list {
    height: 100%;
    // width: 100%;
    padding: 0 15px;
    flex-grow: 1;
    // overflow-y: scroll;

    .book-meeting-item {
      // width: 100%;
      height: 135px;
      padding: 20px;
      border: 1px solid #DCDFE6;
      border-radius: 4px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
      justify-content: space-between;
      align-items: center;
      // box-shadow: 0 2px 4px rgba(0, 0, 0, .12)
      margin-bottom: 15px;
      .book-meeting-item-left{
        // width: 100%;
        flex-flow: 1;
        height: 90px;
        >h3{
          height: 100%
          flex-grow: 1;
          margin-left: 15px;
          >h4{
            width 100%;
            height: 25px;
            margin-bottom: 15px;
            align-items: center;
            >strong{
              margin-right: 15px; 
            }
            >em{

            }
          }
          >p{
            color: #958D9D;
            margin-bottom:15px;
          }
          >span{
            width: 100%;
            align-items: center;
            >i{
              margin-right: 10px;
            }
          }
        }

      }
    }
  }
}
</style>
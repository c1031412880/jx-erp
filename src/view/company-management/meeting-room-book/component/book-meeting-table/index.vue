<!--  -->
<template>
  <div class="book-meeting-table-box" :style="`height: ${TableHeight}px`">
    <div class="book-meeting-list show-flex-box-c" v-if='bookMeetingData && bookMeetingData.length > 0'>
      <div class="book-meeting-item show-flex-box-c" v-for="(item,index) in bookMeetingData" :key="index">
        <div class="book-meeting-item-content show-flex-box-c">
          <div class="book-meeting-item-top show-flex-box-r">
            <el-image
              style="width: 125px; height: 100%; margin-left: 10px;flex-shrink: 0;"
              :src="item.img_url"
              fit="contain"
              :preview-src-list="[item.img_url]"
            ></el-image>
            <h3 class="show-flex-box-c">
              <h4 class="show-flex-box-r">
                <strong>{{item.name}}</strong>
                <!-- <em>需审批</em> -->
                <el-tag type="danger" size="mini" v-if="!item.need_check">需审批</el-tag>
                <!-- <el-tag type="info" size="mini" v-else>审批</el-tag> -->

              </h4>
              <p>{{item.equips}}</p>
              <span class="show-flex-box-r">
                <i class="el-icon-user"></i>
                <span>{{item.capacity || 0}}</span>
              </span>
            </h3>
          </div>
          <div class="book-meeting-item-bottom">
            <time-scale ref="timeScale " @sure-selected-time="sureSelectedTime" :alreadyBooks="item" :searchDate="searchDate"></time-scale>
          </div>
        </div>
      </div>
    </div>
    <div class="book-meeting-list"  v-else>
      <el-empty description="暂无会议室信息"></el-empty>
    </div>
  </div>
</template>

<script>
import timeScale from "./component/time-scale";
export default {
  components: {timeScale},
  props: {
    bookMeetingData:[Array],
    searchDate:[String],
    TableHeight:[Number],
  },
  data() {
    return {
      bookStartTime:'',
      bookEndTime: '',
    };
  },
  created() {},
  mounted() {},
  computed: {},
  watch: {},
  methods: {
    sureSelectedTime(date,info) {
      if(date.length > 0) {
        this.bookStartTime = date[0];
        this.bookEndTime = date[1];
        this.$emit('open-select-book-meetting', date, info)
      }else{
        this.bookStartTime = '';
        this.bookEndTime = '';
      }
    }
  },
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.book-meeting-table-box {
  // height: 100%;
  width: 100%;
  overflow-y: scroll

  .book-meeting-list {
    height: 100%;
    // width: 100%;
    padding: 0 15px;
    flex-grow: 1;
    // overflow-y: scroll;

    .book-meeting-item {
      // width: 100%;
      height: 175px;
      padding: 20px;
      border: 1px solid #DCDFE6;
      border-radius: 4px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
      margin-bottom: 15px;
      // box-shadow: 0 2px 4px rgba(0, 0, 0, .12)
      .book-meeting-item-top{
        width: 100%;
        height: 90px;
        margin-bottom: 15px;
        
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
      .book-meeting-item-bottom{
        width: 100%;
        height: 30px;
      }
    }
  }
}
</style>
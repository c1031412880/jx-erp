<template>
  <div class="list-box">
    <div class="title">{{ `待处理事项(${data.length})` }}</div>
    <div class="box-content box-empty" v-if="!data.length">
      <el-empty description="太棒了,今天所有代办都处理完了"></el-empty>
    </div>
    <ul class="box-content box-data">
      <li class="item-content" v-for="item in data" :key="item.id" @click="itemClick(item)">
        <div class="item-content-top">
          <div class="icon"></div>
          <div class="item-content-left">
            <div class="item-title">{{item.title}}</div>
            <!-- <div class="item-title" v-html="setContent(item.content)"></div> -->
          </div>
          <div class="item-content-right">
            <div class="item-time">{{item.check_date}}</div>
          </div>
        </div>
        <el-divider></el-divider>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "list-box",
  components: {},
  props: {
    // data: {
    //   type: Array,
    //   default: () => []
    // },
  },
  data() {
    return {
      data: []
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    // 数据加载
    loadData() {
      this.$client.GetWaitHandleDayCheck({})
        .then(res => {
          if (res.head.result == "200")  {
            this.data = res.context
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    // 内容修饰
    setContent(val) {
      let content = ''
      if(val) { content = val.replace(/<br>/g, '， ')}
      return content
    },
    // 单项点击
    itemClick(item) {
      this.$emit('on-click', item)
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.list-box
  height: 100%;
  width: 100%;
  overflow: hidden;
  .title
    color: #027DB4;
    padding-left: 5px;
  .box-content
    height: 100%;
    width: 100%;
    overflow-y: auto;
  .box-empty
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  .el-divider
    margin: 0;
  .item-content
    width: 100%;
    padding: 0 10px;
    &:hover{
      cursor:pointer;
      background: #F2F6FC;
      border-radius: 3px; 
    }
    .item-content-top 
      width: 100%;
      display: flex;
      align-items: center;
      padding: 10px 0;
      .icon 
        width: 6px; 
        height: 6px; 
        border-radius: 50%; 
        background: #409EFF;
        margin-right: 10px;
      .item-content-left
        flex: 1;
        white-space:nowrap;/* 规定文本是否折行 */
        overflow: hidden;/* 规定超出内容宽度的元素隐藏 */
        text-overflow: ellipsis;
        .item-title
          width: 100%;
          line-height: 16px;
          white-space:nowrap;/* 规定文本是否折行 */
          overflow: hidden;/* 规定超出内容宽度的元素隐藏 */
          text-overflow: ellipsis;
          color: #333333;
          font-weight: bold;
          margin-bottom: 5px;
        // .item-title:first-child
        //   font-size: 14px;
        //   color: #333333;
        //   font-weight: bold;
        //   margin-bottom: 5px;
        // .item-title:last-child
        //   font-size: 12px;
        //   color: #666666;
        //   font-weight: 500;
      .item-content-right
        width: 150px;
        flex: 0 0 150px;
        flex-shrink: 0;
        text-align: right;
        .item-time
          font-size: 12px;
          color: #666666;
          font-weight: 400;
</style>
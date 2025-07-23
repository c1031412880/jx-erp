<template>
  <div class="list-box">
    <div class="box-content box-empty" v-if="!data.length">
      <el-empty :image="placeholderImage" :image-size="160"></el-empty>
      <el-button
        @click="openPendingApprovalPage()"
        v-if="loadKey !== 'ListMessageCenter'"
        type="primary"
        size="mini"
      >
        {{ loadKey === 'GetMyMarkFlowRecord' ? '添加标记' : '发起审批' }}
      </el-button>
    </div>
    <ul class="box-content box-data">
      <li class="item-content" v-for="item in data" :key="item.id" @click="itemClick(item)">
        <div class="item-content-top">
          <div :class="{ icon: true, is_read: item.is_read }"></div>
          <div class="item-content-left">
            <div class="item-title">{{ item.title }}</div>
            <div class="item-title" v-html="setContent(item.content)"></div>
          </div>
          <div class="item-content-right">
            <div class="item-time">{{ item.created_date }}</div>
          </div>
        </div>
        <el-divider></el-divider>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
import placeholderImage from "@/assets/home-image/placeholder-2.png";
export default {
  name: "list-box",
  components: {},
  props: {
    placeholderImage: placeholderImage,
    data: {
      type: Array,
      default: () => []
    },
    loadKey: {
      type: String,
      default: 'getWaitFlowRecord'
    }
  },
  data() {
    return {

    }
  },
  mounted() {

  },
  methods: {
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
    // 打开发起审批页面
    openPendingApprovalPage() {
      this.$emit('open-pending-approval-page')
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.list-box
  height: 100%;
  width: 100%;
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
      padding: 8px 0;
      .icon
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #f56c6c;
        margin-right: 10px;
        display: none;
      .is_read
        display: none;
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
        .item-title:first-child
          font-size: 14px;
          color: #333333;
          font-weight: bold;
          margin-bottom: 5px;
        .item-title:last-child
          font-size: 12px;
          color: #666666;
          font-weight: 500;
      .item-content-right
        width: 150px;
        flex: 0 0 150px;
        flex-shrink: 0;
        text-align: right;
        .item-time
          font-size: 14px;
          color: #666666;
          font-weight: 400;
</style>

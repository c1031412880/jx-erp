<template>
  <div class="demo-box">
    <el-card>
      <div class="title">
        <div class="text">{{title}}</div>
        <div class="all-btn">
          <el-button v-if="showAllBtn" type="text" @click="lookRouter">
            查看全部
            <i class="el-icon-arrow-right"></i>
            <i class="el-icon-arrow-right"></i>
          </el-button>
        </div>
      </div>
      <div :class="contextClass">
        <slot></slot>
      </div>
    </el-card>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "demo-box",
  data() {
    return {}
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    contextClass: {
      type: String,
      default: 'content-first'
    },
    showAllBtn: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    // 查看全部
    lookRouter() {
      let name = 'Dashboard',params = {}
      switch (this.title) {
        case '新闻管理':
          name = 'news-management'
          break;
        case '基层动态':
          name = 'base-dynamic'
          break;
        case '公司公告':
          name = 'system-announcement-managemnet'
          params = {activeName: 'third'}
          break;
      
        default:
          break;
      }
      this.$router.push({
        name: name,
        params: params
      })
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$NumWidth: 100vw / 1920px;
.demo-box{
  width: 100%;
  padding-top: 10px;
  .title {
    display: flex;
    justify-content: space-between;
    .text, .all-btn {
      font-family: Source Han Sans CN, Source Han Sans CN;
      font-weight: bold;
      font-size: 16px * $NumWidth;
      color: #333333;
      .el-button--text {
        font-size: 16px * $NumWidth;
        padding: 0;
        margin: 0;
        .el-icon-arrow-right:nth-last-child(1) {
          margin-left: -10px * $NumWidth;
        }
      }
    }
  }
  .content-first {
    height: 215px * $NumWidth;
    margin-top: 15px * $NumWidth;
  }
  .content-second {
    height: 310px * $NumWidth;
    margin-top: 15px * $NumWidth;
  }
  .content-third {
    height: 310px * $NumWidth;
  }
}
/deep/ .el-card__body {
  padding: 15px * $NumWidth;
}
</style>

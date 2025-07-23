<template>
  <el-card class="charter-notice">
    <div slot="header" class="clearfix">
      <div class="header-left">
        <el-image :src="require('@/assets/home-image/modular-3.png')"></el-image>
        <span style="color: #000; font-size: 15px; font-weight: 400; font-family: 黑体">
          包车通知
        </span>
      </div>
      <div class="header-right">
        <el-button @click="lookRouter" type="text" style="padding: 5px 0">
          查看全部
          <i class="el-icon-arrow-right"></i>
          <i style="margin-left: -5px" class="el-icon-arrow-right"></i>
        </el-button>
      </div>
    </div>
    <div class="notice-content">
      <div class="item-content" style="width: 100%; height: 364px; overflow: auto">
        <el-skeleton v-if="loading" />
        <template v-else>
          <el-empty
            style="height: 100%"
            v-if="!data.length"
            :image="require('@/assets/home-image/placeholder-2.png')"
          >
            <!-- <span slot="description">暂无数据</span> -->
          </el-empty>
          <ul class="content-right" v-else>
            <li
              class="content-item"
              v-for="item in data"
              :key="item.id"
              @click="checkRowInfo(item)"
            >
              <div class="item-left">{{ item.title }}</div>
            </li>
          </ul>
        </template>
      </div>
    </div>
  </el-card>
</template>

<script type="text/ecmascript-6">
import tableBox from '@/view/system-user/system-announcement-managemnet/component/company-announcement/table'
export default {
  name: 'charter-notice',
  data() {
    return {
      data: [],
      loading: false
    }
  },
  components: {
    tableBox
  },
  mounted() {
    this.$nextTick(() => {
      this.loadData()
    })
  },
  methods: {
    loadData() {
      this.loading = true
      this.$client.GetHomePageReminderChariotManage({}).then(res => {
        this.loading = false
        if (res.head.result == '200') {
          this.data = res.context ? res.context : []
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      })
    },
    // 查看全部
    lookRouter() {
      this.$router.push({
        path: '/car-charter-management/car-charter-filling'
      })
    },
    // 查看
    checkRowInfo(form) {
      this.$router.push({
        path: '/car-charter-management/car-charter-filling'
      })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;
.charter-notice {
  margin-top: 10px;
  /deep/ .el-card__header {
    padding: 12px 20px * $NumWidth;
    .clearfix {
      display: flex;
      justify-content: space-between;
      .header-left {
        display: flex;
        align-items: center;
        .el-image {
          flex-shrink: 0;
          margin-right: 10px * $NumWidth;
        }
      }
      .header-right {
        justify-content: end;
      }
    }
    .clearfix:after {
      content: none;
    }
  }
  /deep/ .el-card__body {
    padding: 12px 20px * $NumWidth;
  }
  .content-right {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    .content-item {
      display: flex;
      align-items: center;
      padding: 9px 5px;
      &:hover {
        cursor: pointer;
        background: #f2f6fc;
        border-radius: 3px;
      }
      .item-right {
        width: 150px;
        flex: 0 0 150px;
        flex-shrink: 0;
        text-align: right;
        font-size: 14px;
        font-weight: 400;
        color: #666666;
      }
      .item-left {
        flex: 1;
        font-size: 14px;
        font-weight: bold;
        color: #333333;
        white-space: nowrap; /* 规定文本是否折行 */
        overflow: hidden; /* 规定超出内容宽度的元素隐藏 */
        text-overflow: ellipsis;
      }
    }
  }
}
</style>

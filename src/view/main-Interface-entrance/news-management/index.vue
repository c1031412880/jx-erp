<template>
  <div class="news-management">
    <el-tabs v-model="activeName" @tab-click="tabsClick">
      <el-tab-pane label="公司新闻" name="公司新闻" lazy>
        <cor-box :height="carHeight">
          <data-list ref="homeList" :curSelectType="'home'"></data-list>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane name="我发起的" label="我发起的" lazy v-if="$isPowerShow('my-initiate')">
        <span slot="label">我发起的(<span style="color:red;">{{ isUnNum }}</span>)</span>
        <cor-box :height="carHeight">
          <data-list ref="wdList" :curSelectType="'my'" @on-update="updateNewsData('shTable')" @set-num="num => isUnNum = num"></data-list>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="新闻审核" name="新闻审核" lazy v-if="$isPowerShow('audits-Management')">
        <cor-box :height="carHeight">
          <news-audit ref="shTable"  @on-update="updateNewsData"></news-audit>
        </cor-box>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import { getUser } from "@/utils/auth";
import corBox from "./component/cor-box";
import dataList from "./component/dataList";
import newsAudit from "./component/news-audit";
export default {
  name: "news-management",
  components: {corBox, dataList, newsAudit},
  data() {
    return {
      activeName: '公司新闻',
      carHeight: 500,
      isUnNum: 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setBoxHeight()
      this.loadData()
      // setTimeout(() => {
      //   window.SignalDom.on('IsUnReadMessage', req => {
      //     console.log('通知','IsUnReadMessage' ,req)
      //     this.isUnNum = req.msg
      //   })
      // }, 100)
    })
  },
  methods: {
    tabsClick(tab) { },
    // 数据请求
    loadData() {
      let params = {context: {}} 
      params.context.page_index = 1;
      params.context.page_size = 15;
      let userInfo = JSON.parse(getUser());
      params.context.user_id = Number(userInfo.user_id)
      this.$client.GetErpNewManageHomePageSimple(params)
        .then(res => {
          if (res.head.result == "200") {
            this.isUnNum = res.context.total
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
    },
    // 更新新闻数据
    updateNewsData(type) {
      this.loadData()
      this.$refs[type].loadData()
    },
    // 计算高度
    setBoxHeight() {
      this.carHeight = this.$el.offsetHeight - 55
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.news-management {
  width: 100%;
  height: 100%;
}
</style>

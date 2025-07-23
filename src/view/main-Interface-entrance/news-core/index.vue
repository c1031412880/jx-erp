<template>
  <div class="news-core">
    <el-tabs v-model="activeName" @tab-click="tabsClick">
      <el-tab-pane label="全部" name="全部" lazy>
        <cor-box :height="carHeight">
          <data-list ref="allTable"></data-list>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane name="未读" label="未读" lazy>
        <span slot="label">未读(<span style="color:red;">{{ newCount }}</span>)</span>
        <cor-box :height="carHeight">
          <data-list ref="wdTable" :state="1"></data-list>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="已读" name="已读" lazy>
        <cor-box :height="carHeight">
          <data-list ref="ydTable" :state="2"></data-list>
        </cor-box>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import corBox from "./component/cor-box";
import dataList from "./component/dataList";
export default {
  name: "news-core",
  components: {corBox, dataList},
  data() {
    return {
      activeName: '未读',
      carHeight: 500,
      isUnNum: 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setBoxHeight()
    })
  },
  computed: {
    ...mapGetters(['newCount']),
  },
  methods: {
    tabsClick(tab) {
      setTimeout(() => {
        switch (tab.label) {
          case '全部' :
            this.$refs.allTable.loadData()
            break
          case '未读' :
            this.$refs.wdTable.loadData()
            break
          case '已读' :
            this.$refs.ydTable.loadData()
            break
        }
      }, 60)
    },
    // 计算高度
    setBoxHeight() {
      this.carHeight = this.$el.offsetHeight - 55
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.news-core{
  width: 100%;
  height: 100%;
}
</style>

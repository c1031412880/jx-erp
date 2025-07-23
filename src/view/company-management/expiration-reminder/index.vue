<template>
  <div class="expiration-reminder">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="全部" name="first" v-if="$isPowerShow('all')" lazy>
        <div :style="{'height' : boxHeight + 'px'}">
          <data-page ref="allData" :bigBoxName="activeName"></data-page>
        </div>
      </el-tab-pane>
      <el-tab-pane label="我的合同" name="second" lazy>
        <div :style="{'height' : boxHeight + 'px'}">
          <data-page ref="myData" :bigBoxName="activeName"></data-page>
        </div>
      </el-tab-pane>
      <el-tab-pane label="即将完成合同" name="third" lazy>
        <div :style="{'height' : boxHeight + 'px'}">
          <data-page ref="endData" :bigBoxName="activeName"></data-page>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import dataPage from './conponent/data-page'
export default {
  name: 'expiration-reminder',
  components: { dataPage },
  data() {
    return {
      boxHeight: 500,
      activeName: 'second',
    };
  },
  mounted() {
    this.setHead()
  },
  activated() {
    let name = this.$route.params.name
    if(name) this.activeName = 'third'
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    setHead() {
      this.$nextTick(() => {
        this.boxHeight = this.$el.offsetHeight - 55
      })
    }
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.expiration-reminder {
  height: 100%;
  width: 100%;
}
</style>
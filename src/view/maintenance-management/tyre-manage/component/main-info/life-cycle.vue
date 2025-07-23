<template>
  <div style="height: 400px; overflow-x: hidden">
    <el-timeline>
      <el-timeline-item
        :timestamp="item.date"
        placement="top" v-for="(item,index) in containerLifeData"
        :key="index"
        :icon="'el-icon-timer'"
        :color="'#6CB4FF'"
        >
        <el-card>
          <p>{{item.content}}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  data() {
    return {
      containerLifeData:[]
    };
  },
  props: {
    // containerLifeData: [Array]
  },

  methods: {
    resetData() {
      this.containerLifeData = [];
    },
    // 设置数据
    setData(val) {
      if(val.id) {
        let params = {
          tyre_id: val.id
        };
        this.$client.getTyreLifeTyreManage(params).then(res => {
          if (res.head.result == "200") {
            this.containerLifeData = res.context.list;
          } else {
            this.containerLifeData = []
            this.$message({ type: "error", message: res.head.describle });
          }
        });
      }
    }
  },
};
</script>
<style lang='scss' scoped>
</style>
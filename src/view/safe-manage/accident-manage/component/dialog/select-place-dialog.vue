<template>
  <tr-dialog
    :visible="dialogBool"
    :title="title"
    @before-close="dialogClose"
    width="700px"
    append-to-body
    :close-on-click-modal="false"
    :fullscreen="fullscreen"
    @change-full="changeFull"
  >
    <div class="el-dialog-div">
      <div :class="fullscreen ? 'fullClass' : ''" style="width: 660px;height: 350px;">
        <!-- <map-dom ref="map" :form="{id:0}"></map-dom> -->
        <map-dom ref="map" :isNeedPoiPicker="true"></map-dom>
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill()">确 定</el-button>
    </span>
  </tr-dialog>
</template>

<script type="text/ecmascript-6">
import mapDom from "@/components/base/maps/map";
// import mapDom from "@/components/base/maps/poi-map";
export default {
  components: {
    mapDom
  },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "添加事故地点",
    },
    curSelecedType: [String],
  },
  mounted() {
  },
  data() {
    return {
      date: [],
      form: {
        lon: '',
        lat: '',
        address: '',
        range: '',
      },
      fullscreen: true
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        this.$refs.map.addres = ''
        Object.assign(this.$data, this.$options.data());
      }else{
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    updatePlaybill() {
      let pickerInfo = this.$refs.map.pickerInfo
      console.log(pickerInfo)
      this.form.lon = pickerInfo.location[0]
      this.form.lat = pickerInfo.location[1]
      if(!!pickerInfo.name) {
        this.form.address = pickerInfo.name
        if (!!pickerInfo.address) {
          this.form.address = pickerInfo.name + '-' + pickerInfo.address
        }
      }
      if(!this.form.lon) {
         this.$message({
          showClose: true,
          message: '请选择地图坐标点',
          type: "warning",
        });
        return
      }
      this.$emit('save-place', this.form)
    },
    // 回显
    addPlace(row){
      this.$refs.map.addPlace(row)
    },
    changeFull(bool) {
      this.fullscreen = bool
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
// .el-dialog-div {
//   height: 350px;
// }
.fullClass {
  width: 100% !important;
  height: calc(100vh - 150px) !important;
}
</style>


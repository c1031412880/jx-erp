<template>
  <el-dialog
    :visible="dialogBool"
    :title="`${vehicle_name} 年检历史记录`"
    :before-close="dialogClose"
    width="560px">
    <div class="el-dialog-div">
      <el-timeline v-loading="loading">
        <div style="width: 200px;" v-if="!data.length">
          <el-empty :image-size="80" description="暂无年检历史记录"></el-empty>
        </div>
        <el-timeline-item v-for="(item,i) in data" :key="`m${i}f${i}`" :timestamp="item.check_date" placement="top">
          <el-card>
            <el-image
              v-for="(src,j) in item.image_urls"
              :key="`i${i}j${j}`"
              style="width: 100px; height: 100px;float: left;margin-bottom: 10px"
              :src="src"
              :preview-src-list="item.image_urls"
              fit="contain"></el-image>
            <div style="width: 200px;" v-if="!item.image_urls">
              <el-empty :image-size="80" description="未上传图片"></el-empty>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">关  闭</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      dialogBool: Boolean
    },
    data() {
      return {
        vehicle_id: 0,
        vehicle_name: '',
        loading: false,
        data: []
      }
    },
    watch: {
      dialogBool(bool) {
        if (bool === false) {
          Object.assign(this.$data, this.$options.data());
        }
      },
    },
    methods: {
      dialogClose() {
        this.$emit("update:dialogBool", false);
      },
      loadData() {
        this.loading = true;
        this.$client.getCheckHistory({vehicle_id:this.vehicle_id}).then(req => {
          console.log(req);
          this.loading = false;
          if (req.head.result === "200") {
            this.data = req.context || [];
          } else {
            this.data = [];
          }
        })
      }
    },
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .el-dialog-div{
    .avatar-uploader {
      width: 100px;
      height: 50px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      // border: 1px dashed #d9d9d9;
      // border-radius: 6px;
      cursor: pointer;
      background: url('../../../../../src/assets/veh_svg/uploader-icon.svg') no-repeat center;
      background-size: 100% 100%;
      overflow: hidden;
      object-fit: cover !important;

      .avatar {
        display: block;
        width: 100%;
        height: 100%;
      }

      // .el-upload {
      //   width: 100% !important;
      //   height: 100% !important;
      //   overflow: hidden !important;
      //   object-fit: cover !important;

      // }
    }

    .have-avatar-active {
      background: none;

      div {
        width: 100% !important;
        height: 100% !important;
      }
    }
  }
</style>


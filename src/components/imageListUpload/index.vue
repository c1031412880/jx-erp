<template>
  <div class="image-box" :id="ImageBoxName">
    <up-file-img v-if="imgData.length == 0" style="text-align:center;padding-top: 10%;" :disabled="disabled" @on-file='uploadImg'></up-file-img>
    <div v-if="imgData.length != 0" :style="`height:${Number(imageHeight)-60}px`">
      <el-carousel trigger="click" :height="`${Number(imageHeight)-60}px`" style="height:100%;">
        <el-carousel-item v-for="(item,index) in imgData" :key="index">
          <el-image fit="contain" class="image" :src="item.image_path || item" :preview-src-list="picturePathList">
            <div
              slot="error"
              style="line-height: 100px; text-align: center; color: #fff"
            >
              加载失败
            </div>
          </el-image>
          <div class="mongolia" v-show="mongolia">
            <div class="box" v-if="!disabled">
              <el-popconfirm @confirm="onDelete(item)" title="确定删除此条记录吗？">
                <i class="el-icon-delete" slot="reference"></i>
              </el-popconfirm>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
      <div style="width: 100%; text-align: center;position: absolute;bottom: 10px;" v-if="isShowBottom">
        <div class="show-flex-box-r show-flex-center">
          <el-popover
            placement="bottom"
            title=""
            width="200"
            v-model="visible"
            v-if="isShowRemark"
           >
            <div class="show-flex-box-r show-flex-center" style="text-align: right; margin: 0">
             <p style="white-space:nowrap;">备注：</p>
            <el-input
                placeholder="请输入备注"
                v-model="remark"
                clearable
                @change="changeInput()"
                :disabled="disabled"
                size="mini"
              ></el-input>
            </div>
            <el-button slot="reference" size="mini">备注</el-button>
          </el-popover>
          <el-button icon="el-icon-plus" size="mini" @click="upLoad" style="margin:0 10px;" :disabled="disabled"></el-button>
          <el-popconfirm
            @confirm="delAll()"
            title="确定删除所有图片吗？"
          >
            <el-button slot="reference" size="mini" icon="el-icon-delete" type="danger" :disabled="disabled"></el-button>
          </el-popconfirm>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import upFileImg from "@/components/upload/up-file-img.vue";
import { on } from "@/utils/dom";
export default {
  components: { upFileImg },
  props: {
    action:{
      type: String,
      default: "/api/ERPWeb/EmployeeManage/UploadPicture"
    },
    imgData: {
      type: [Array,String],
      default: () => []
    },
    ImageBoxName:{
      type: String,
      default: ''
    },
    isShowRemark:{
      type: Boolean,
      default: false
    },
    disabled:{
      type: Boolean,
      default: false
    },
    imageHeight:{
      type: [Number,String],
      default: 240
    },
    picturePathList:{
      type: Array,
      default: []
    },
    maxUpLoadNum: {
      type: [Number,String],
      default: 9999
    },
    isShowBottom:{
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      // imgData: [{
      //   img_src: ''
      // }],
      // imgData: [],
      visible: false,
      referenceElm: null,
      mongolia: false,
      remark:'',
    };
  },
  mounted() {
    this.referenceElm = this.$el;
    on(this.referenceElm, "mouseenter", this.show);
    on(this.referenceElm, "mouseleave", this.hide);
  },
  methods: {
    openRemarkPop() {

    },
    // 复用上传组件事件
    uploadImg(file){
      let formData = new FormData();
      formData.append("file", file.raw);
      // formData.append("vote_id", this.voteActivityId);
      let params = {
        file: formData,
      };

      this.$client.uploadPicture(params,this.action)
      .then(res => {
        // console.log(res)
        if(res.head.result == '200') {
          let full_path = res.context;
          this.$emit("on-add-img", full_path,this.ImageBoxName);
          this.$message({
            showClose: true,
            message: "上传成功",
            type: "success"
           });
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 上传图片
    upLoad() {
      if(this.imgData.length > this.maxUpLoadNum -1){
        this.$message({
          showClose: true,
          message: `最多能上传${this.maxUpLoadNum}张图片`,
          type: "warning"
        });
        return
      }
      let input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = () => {
        let reader = new FileReader()
        reader.readAsDataURL(input.files[0])
        let file = input.files[0]
        reader.onload = (ev) => {
          input = undefined
        };
        let formData = new FormData();
        formData.append("file", file);
        let params = {
          file: formData,
        };
        this.$client.uploadPicture(params,this.action)
        .then(res => {
          if(res.head.result == '200') {
            let full_path = res.context;
            this.$emit("on-add-img", full_path,this.ImageBoxName);
            this.$message({
              showClose: true,
              message: "上传成功",
              type: "success"
            });
          }else{
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
      }
      input.click()
    },
    // 显示
    show() {
      this.mongolia = true;
    },
    // 隐藏
    hide() {
      this.mongolia = false;
    },
    //监听备注
    changeInput() {
      console.log(this.remark)
      this.$emit("send-remark", this.remark,this.ImageBoxName)
    },
    // 删除
    onDelete(item) {
      // alert(JSON.stringify(item))
      this.$emit("on-del", item,this.ImageBoxName);
    },
    delAll(){
      this.$emit("on-del-all",this.ImageBoxName);
    }
  },
};
</script>
<!--
background: #1f2d3d;
-->

<style lang="stylus" rel="stylesheet/stylus" scoped>
.image-box {
  position: relative;
  height: 100%;
  box-shadow: 0 0 1px #000 inset;

  .image {
    width: 100%;
    height: 100%;
    display: block;
    background: #2b2b2b;
  }

  .mongolia {
    position: absolute;
    right: 0;
    top: -30px;
    width: 60px;
    height: 60px;
    z-index: 2;
    // background: hsla(240, 100%, 10%, 0.3) border-box;
    // box-shadow: 0 0 0 1px hsla(0, 0%, 100%, 0.3) inset, 0 0.5em 1em rgba(0, 0, 0, 0.6);
    // text-shadow: 0 1px 1px hsla(0, 0%, 100%, 0.3);

    .box {
      width: 100%;
      height: 100%;
      line-height: 100px;
      text-align: center;
      color: #fff;
      font-size: 22px;
      font-weight: 600;

      i:hover {
        color: #409EFF !important;
        cursor: pointer;
      }
    }
  }

  .mongolia::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: -30px;
    z-index: -1;
    -webkit-filter: blur(20px);
    filter: blur(20px);
  }

  .image-box /deep/ .el-carousel__container{
    height: 100% !important;
  }
}

.image-box /deep/ .el-carousel__indicator--horizontal {
  padding: 12px 2px;
}

.image-box /deep/ .el-carousel__button{
  height: 8px;
  width: 8px;
  border-radius: 100%;
  background-color: #409EFF;
}
</style>

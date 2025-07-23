<template>
  <el-image :src="img" :preview-src-list="preList" :fit="'fill'" ref="authImg">
    <div slot="error" class="image-slot" style="height: 100%;">
      <i style="display: flex;justify-content: center;align-items: center;height: 100%;" class="el-icon-picture-outline"></i>
    </div>
  </el-image>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      imgUrl:String,
      authToken:String,
      preList: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        img: ''
      }
    },
    mounted() {
      this.getImgUrl();
    },
    watch: {
      imgUrl() {
        this.getImgUrl();
      }
    },
    methods: {
      getImgUrl(){
        // console.log(this.imgUrl);
        Object.defineProperty(Image.prototype,"imgurl",{
          configurable:true,
          writable:true,
          enumerable:true
        })
        let request = new XMLHttpRequest();
        request.responseType = "blob";
        request.open("get",this.imgUrl,true);
        request.setRequestHeader('token',this.authToken);
        let imgRef = this.$refs.authImg;
        request.onreadystatechange = e => {
            if(request.readyState == XMLHttpRequest.DONE && request.status == 200){
                this.img = URL.createObjectURL(request.response); // 将生成的blob对象的值赋值给img的src属性
                imgRef.onLoad = () => {
                    URL.revokeObjectURL(imgRef.src); // 在图片加载完成后释放
                }
            }
        }
        request.send(null)
      }
    },
    handleClick(event) {
      // 阻止点击事件
      event.stopPropagation();
      // 你可以在这里添加点击后的逻辑
      // console.log('Image clicked, event propagation stopped.');
      
    },
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none; /* 这里阻止点击事件 */
}

</style>

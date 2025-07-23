<template>
  <div class="enclosure">
    <el-form :inline="true" size="mini">
      <el-form-item>
        <el-button type="primary" @click="uploadFile">上传附件</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">下载</el-button>
      </el-form-item>
    </el-form>
    <el-table style="width: 100%" :data="data">
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="name" label="文件名"></el-table-column>
      <el-table-column prop="size" label="文件大小"></el-table-column>
      <el-table-column prop="" label="上传时间"></el-table-column>
      <el-table-column prop="" label="上传用户"></el-table-column>
    </el-table>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "enclosure",
  data() {
    return {
      data: []
    }
  },
  methods: {
    // 自定义上传文件方法
    // :http-request="uploadFile"
    uploadFile() {
      let input = document.createElement("input");
      let fileObj = {
        name: '',
        size: 0,
        url: ''
      }
      input.type = "file";
      input.onchange = () => {
        let reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        let file = input.files[0];
        reader.onload = (ev) => {
          input = undefined;
        };
        let params = new FormData
        params.append('file', file)
        fileObj.name = file.name
        fileObj.size = file.size
        this.$client.uploadPicture({file: params}, '/api/ERPWeb/VehicleManager/AddCarInfoImage').then((req) => {
          // console.log(req);
          if (req.head.result === "200") {
            fileObj.url = req.context;
            this.data.push(fileObj)
          }
        });
      };
      input.click();
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.enclosure{
  width 100%
}
</style>

<template>
  <div class="enclosure">
    <el-form :inline="true" size="mini">
      <el-form-item>
        <el-button type="primary" @click="uploadFile">上传附件</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onDelete">删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onDow">下载</el-button>
      </el-form-item>
    </el-form>
    <el-table style="width: 100%" :data="data"  @selection-change="handleSelectionChange">
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="name" label="文件名"></el-table-column>
      <el-table-column prop="size" label="文件大小"></el-table-column>
    </el-table>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "enclosure",
  data() {
    return {
      data: [],
      selectData: []
    }
  },
  methods: {
    // 选中
    handleSelectionChange(val) {
      console.log(val)
      this.selectData = val
    },
    onDow() {
      if (!this.selectData.length) {
        this.$message({
          message: '请勾选需要下载的附件',
          type: 'warning'
        });
        return false
      }
      if (this.selectData.length > 1) {
        this.$message({
          message: '只能勾选一个附件下载',
          type: 'warning'
        });
        return false
      }
      this.selectData.forEach(item => {
        setTimeout(() => {
          this.downLoad(item.url, item.name)
        }, 100)
      })
    },
    downLoad(content,fileName){
      let aEle = document.createElement("a");// 创建a标签
      // blob = new Blob([content]);
      aEle.download = fileName;// 设置下载文件的文件名
      //aEle.href = URL.createObjectUrl(blob);
      aEle.href = content;// content为后台返回的下载地址
      aEle.click();// 设置点击事件

    },
    // 删除勾选的数据
    onDelete() {
      if (!this.selectData.length) {
        this.$message({
          message: '请勾选需要删除的附件',
          type: 'warning'
        });
        return false
      }

      let newData = this.data.filter(item => {
        let bool = true
        this.selectData.forEach(a => {
          if (a.id === item.id) {
            bool = false
          }
        })
        return bool
      })
      this.data = newData
    },
    // 自定义上传文件方法
    // :http-request="uploadFile"
    uploadFile() {
      let input = document.createElement("input");
      let fileObj = {
        name: '',
        size: 0,
        url: '',
        id: this.data.length
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
        this.$client.uploadPicture({file: params}, '/api/ERPWeb/DataBase/UploadOnlineFile').then((req) => {
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

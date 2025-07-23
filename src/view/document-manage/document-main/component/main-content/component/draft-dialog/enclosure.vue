<template>
  <div class="enclosure">
    <el-form :inline="true" size="mini">
      <el-form-item>
        <el-button type="primary" :disabled="loading" @click="uploadFile">上传附件</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onDelete">删除</el-button>
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="primary" @click="onDow">下载</el-button>
      </el-form-item> -->
    </el-form>
    <p style="color: #999; font-size: 8px" v-show="loading">{{this.fileName}}文件上传中，请等待</p>
    <el-progress v-show="lineShow" :percentage="percentage" :color="'#67c23a'"></el-progress>
    <el-table style="width: 100%" :data="data"  @selection-change="handleSelectionChange">
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="name" label="文件名">
        <template slot-scope="scope">
          <el-button type="text" @click="openDocument(scope.row)">{{ scope.row.name }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="size" label="文件大小"></el-table-column>
      <el-table-column prop="operation" align="center" label="下载文件">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="onDow(scope.row)" :disabled="downLoading">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script type="text/ecmascript-6">
import {getUser, getSession} from '@/utils/auth'
export default {
  name: "enclosure",
  data() {
    return {
      data: [],
      selectData: [],
      percentage: 0,
      eachSize: 1 * 1024 * 1024,  //切片大小
      loading: false,
      lineShow: false,
      fileName: '',
      downLoading: false
    }
  },
  methods: {
    customColorMethod(percentage) {
        if (percentage < 30) {
          return '#f56c6c';
        } else if (percentage < 70) {
          return '#e6a23c';
        } else {
          return '#67c23a';
        }
      },
    // 选中
    handleSelectionChange(val) {
      console.log(val)
      this.selectData = val
    },
    // 预览
    openDocument(item) {
      let userInfo = JSON.parse(getUser())
      let token = getSession()
      let file_extension = (item.url.split('.')).pop().toLowerCase()
      let url = ''
      if(file_extension == 'rar' || file_extension == 'zip') {
        url = newHttpConfig.previewUrl +  '/onlinePreview?url='+encodeURIComponent(this.$Base64.encode(item.url))
      }else {
        url = newHttpConfig.previewFile + '/index.html' + `?isEdit=false&user=${userInfo.user_id}&token=${token}&file_id=${item.file_id}&type=${file_extension}`
      }
      window.open(url)
    },
    onDow(val) {
      this.downLoading = true
      this.$message({type: 'warning', message: '下载中，请稍候',duration: 0})
      this.downLoad(val.url, val.name)
    },
    downLoad(url, fileName){
      let token = getSession()
      let xml = new XMLHttpRequest();
      xml.open("GET", url, true);
      xml.setRequestHeader('Authorization', token)
      xml .responseType = 'blob';
      let that = this
      xml.onload = function() {
        // console.log(xml);
        let url = window.URL.createObjectURL(xml.response);
        let a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        that.disLoad()
      }
      xml.send();
    },
    disLoad() {
      this.downLoading = false
      this.$message.closeAll()
      this.$message({type: 'success', message: '下载成功'})
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
        id: this.data.length,
        file_id: ''
      }
      input.type = "file";
      input.onchange = () => {
        this.loading = true
        this.percentage = 0
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
        this.fileName = file.name
        if(file.size < 5 * 1024 * 1024) {
          this.$client.uploadPicture({file: params}, '/api/ERPWeb/DataBase/UploadFile').then((req) => {
            // console.log(req);
            if (req.head.result === "200") {
              fileObj.url = req.context;
              fileObj.file_id = req.file_id
              this.data.push(fileObj)
              this.loading = false
            }
          });
        }else {
          new Promise(async (resolve, reject) => {
            try {
              this.lineShow = true
              this.eachSize = file.size > 100 * 1024 * 1024 ? 2 * 1024 * 1024 : 1 * 1024 * 1024
              const chunks = Math.ceil(file.size / this.eachSize);
              const fileChunks = this.splitFile(file, this.eachSize, chunks);
              let currentChunk = 0;
              for (let i = 0; i < fileChunks.length; i++) {
                if (currentChunk === i) {
                  let formData = new FormData();
                  formData.append("file", fileChunks[i]);
                  formData.append("md5_code", file.lastModified);
                  formData.append("merge_name", file.name);
                  formData.append("index", i + 1); 
                  formData.append("total", fileChunks.length);
                  if(i < fileChunks.length -1) {
                    formData.append("is_last", false);
                  }else{
                    formData.append("is_last", true);
                  }
                  let res = await this.UpLoadFileBreakPointResumeUpload(formData); 
                  if(res.head.result == "200") {
                    let each = Math.round(100/chunks)
                    if((this.percentage + each) >= 100) {
                      this.percentage = 100
                    }else {
                      this.percentage += each
                    }
                    if(currentChunk == fileChunks.length -1) {
                      fileObj.url = Array.isArray(res.context) ? res.context[0] : res.context
                      fileObj.file_id = res.file_id
                      this.data.push(fileObj);
                      this.percentage = 0
                      this.loading = false
                      this.lineShow = false
                      this.$message({ showClose: true, message: `该(${file.name})文件上传成功`, type: "success"});
                    }
                    currentChunk = i + 1;
                  }else{
                    this.$message({
                      showClose: true,
                      message: `该(${file.name})文件上传失败，请从新上传未上传成功的文件`,
                      type: "error",
                    });
                  }
                }
              }
            } catch (e) {
              reject(e);
            }
          })
        }
      };
      input.click();
    },
    // 调用切片上传接口
    UpLoadFileBreakPointResumeUpload(formData) {
      // for(let b of formData) {
      //   console.log(b);
      // }
      return this.$client.UpLoadFileBreakPointResumeUpload(formData).then(res => res)
    },
    // 文件分块,利用Array.prototype.slice方法
    splitFile(file, eachSize, chunks) {
      const fileChunk = [];
      for (let chunk = 0; chunks > 0; chunks--) {
        fileChunk.push(file.slice(chunk, chunk + eachSize));
        chunk += eachSize;
      }
      return fileChunk;
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.enclosure{
  width 100%
}
</style>

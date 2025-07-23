<template>
  <el-button type="primary" :loading="fullscreenLoading" @click="upLoad" size="mini">上传</el-button>
</template>

<script type="text/ecmascript-6">
  import {set_advert_info} from 'api/advert-api'
  export default {
    data() {
      return {
        fullscreenLoading: false
      }
    },
    methods: {
      upLoad () {
        let input = document.createElement('input')
        input.type = 'file'
        input.accept = 'video/*'
        input.onchange = (file) => {
          console.log(input.files[0])
          this.checkedFile(input.files[0])
        }
        input.click()
      },
      async checkedFile (file) {
        let splitUploadSize = 1 * 1024 * 1024
        const {splitUpload, singleUpload} = this
        const uploadFunc = file.size > splitUploadSize ? splitUpload : singleUpload
        try {
          await uploadFunc(file)
        } catch (e) {
          console.log(e)
        }
      },
      // 大文件分块上传
      splitUpload (file) {
        return new Promise(async (resolve, reject) => {
          try {
            const { eachSize } = this
            const chunks = Math.ceil(file.size / eachSize)
            const fileChunks = await this.splitFile(file, eachSize, chunks)
            let currentChunk = 0
            for (let i = 0; i < fileChunks.length; i++) {
              console.log(currentChunk)
              if (currentChunk === i) {
                let box = await this.postFile({
                  chunk: i,
                  chunks: fileChunks.length,
                  file: fileChunks[i],
                  fileName: file.name,
                  rid: this.idxRow
                })
                console.log(fileChunks.length, i)
                if (box.status === '200') {
                  this.formInfo.progress = (Number((i + 1) / chunks) * 100).toFixed(2)
                  currentChunk = i + 1
                  if (box.path) {
                    this.formInfo.md5 = box.md5
                    this.formInfo.path = box.path
                  }
                }
              }
            }
          } catch (e) {
            reject(e)
          }
        })
      },
      // 单文件上传
      singleUpload (file) {
        return new Promise(async (resolve, reject) => {
          try {
            const box = await this.postFile({
              chunk: 1,
              chunks: 1,
              file: file,
              fileName: file.name,
              rid: this.idxRow
            })
            this.formInfo.md5 = box.md5
            this.formInfo.path = box.path
            this.formInfo.progress = 100
          } catch (e) {
            reject(e)
          }
        })
      },
      // 文件分块,利用Array.prototype.slice方法
      splitFile (file, eachSize, chunks) {
        return new Promise((resolve, reject) => {
          try {
            setTimeout(() => {
              const fileChunk = []
              for (let chunk = 0; chunks > 0; chunks--) {
                fileChunk.push(file.slice(chunk, chunk + eachSize))
                chunk += eachSize
              }
              resolve(fileChunk)
            }, 0)
          } catch (e) {
            console.error(e)
            reject(new Error('文件切块发生错误'))
          }
        })
      },
      // 上传图片
      postFile (param) {
        const formData = new FormData()
        for (let p in param) {
          formData.append(p, param[p])
        }
        return set_advert_info(formData).then(rs => rs)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>

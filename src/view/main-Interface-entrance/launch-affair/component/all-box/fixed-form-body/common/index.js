export default {
  // 如果有特殊处理的相同方法 可直接在对应页面中再写一个
  props: {
    formId: {
      type: Number,
      default: 0
    }
  },
  methods: {
    // 保存草稿时的校验   必填项只要有一个填了  即可保存草稿   除申请人和申请部门
    saveDraft() {
      return new Promise((resolve, reject) => {
        let data = []
        for (const key in this.rules) {
          if (key != 'user_id' && key != 'dept_id') {
            data.push(key)
          }
        }
        let validList = []
        this.$refs.form.validateField(data, valid => {
          validList.push(valid)
        })
        // 判断是否有已填写项   只要有一个就可以走保存
        if (!validList.length || validList.includes('')) {
          resolve({
            form: this.form
          })
        } else {
          reject({
            msg: '必须填写一项必填项才可保存草稿'
          })
          return false
        }
      })
    },
    // 合并表单值
    outData() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          if (valid) {
            resolve({
              form: this.form
            })
          } else {
            reject({
              msg: '获取失败,带星号的为必填项'
            })
            return false
          }
        })
      })
    },
    // 上传图片
    imagesUpdateSuccess(val) {
      let obj = ''
      let list = []
      val.forEach(item => {
        obj = {
          thumbnail_url: item.thumbnail_url ? item.thumbnail_url : null,
          url: item.url ? item.url : item
        }
        list.push(obj)
      })
      this.form.thumbnail_imgs = list
    },
    // 上传文件
    filesUpdateSuccess(filesList) {
      this.form.files_list = filesList
    },
    dateChange() {
      this.$emit('out-form', {
        form: this.form,
        code: this.formId
      })
    }
  }
}

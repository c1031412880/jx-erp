<template>
  <div class="document-view">
    <document-model
      :isSet="false"
      ref="contentModel"></document-model>
  </div>
</template>

<script type="text/ecmascript-6">
import documentModel from './content-model'
export default {
  name: "document-view",
  components: {documentModel},
  data() {
    return {
      document_id: 414369
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.$client.GetByIdDocumentMain({id: this.document_id, type: 1}).then(req => {{
        if (req.head.result === '200') {
          let item = req.context.main
          let objContent = item.content ? JSON.parse(item.content) : {}
          objContent.contentTitle = item.title
          objContent.post_count = item.post_count
          objContent.posy_time = item.posy_time
          objContent.keyword = item.keyword
          objContent.type = item.type
          objContent.code = item.code
          objContent.degree = item.degree
          objContent.secret = item.secret
          objContent.font_number = item.font_number
          objContent.department_name= item.department_name
          objContent.main_department_name= item.main_department_name
          objContent.copy_department_names= item.copy_department_names
          // 红头套红
          if (item.head_content) {
            let objHead = item.head_content ? JSON.parse(item.head_content) : {}
            objContent.title = objHead.title
            objContent.userName = objHead.userName
            objContent.post_count_view = objHead.post_count_view
            objContent.posy_time_view = objHead.posy_time_view
            objContent.degree_view = objHead.degree_view
            objContent.secret_view = objHead.secret_view
            objContent.main_department_view = objHead.main_department_view
            objContent.copy_department_view = objHead.copy_department_view
            objContent.keyword_view = objHead.keyword_view
            objContent.isTH = true
          }
          // 盖章
          if (item.document_seals) {
            objContent.sealList = []
            item.document_seals.forEach((obj, i) => {
              if (obj.seal_place) {
                objContent.sealList.push(JSON.parse(obj.seal_place))
              }
              if (i === 0) {
                objContent.gzname = JSON.parse(obj.seal_place).name
              }
            })
          }
          setTimeout(() => {
            this.$refs.contentModel.setData(objContent)
          }, 100)
        }
      }})
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.document-view{
  width: 100%;
}
</style>

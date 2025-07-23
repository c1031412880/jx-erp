<template>
  <div class="company-announcement">
    <sub-req></sub-req>
    <tr-table
      :data="data"
      :loading="loading"
      :TableHeight="TableHeight"
      :tableHeaderList="canRendererTableHeader"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum">

    </tr-table>
  </div>  
</template>

<script>
import subReq from "./sub-req";
export default {
  name: "company-announcement",
  components: {
    subReq
  },
  props: {
    TableHeight: {
      type: Number,
      default: 500
    }
  },
  data() {
    return {
      data: [],
      loading: false,
      frontFixedNum: 0,
      backFixedNum: 0,
      canRendererTableHeader: [
        {
          id: 1,
          label: "标题",
          prop: "title",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "发布时间",
          prop: "send_time",
          width: "150",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "作者",
          prop: "author",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "公告类别",
          prop: "type_name",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "是否置顶",
          prop: "top",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        
        {
          id: 6,
          label: "公告内容",
          prop: "content",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "是否已读",
          prop: "is_read",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "已读人数",
          prop: "Read",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "操作",
          prop: "operation",
          width: "140",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
      ],
    }
  }
}
</script>

<style style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
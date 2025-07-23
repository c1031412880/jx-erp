<template>
  <div :gutter="20" class="list-box">
    <tr-table
      :selectionShow="false"
      :data="data"
      :loading="loading"
      :TableHeight="TableHeight"
      :tableHeaderList="loadKey === 'GetCommunicateBookSysMenu' ? customSettingList2 : customSettingList1"
      :isShowBottomOptions="false"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    >
      <template slot-scope="scope" slot="phone">
        <span>{{setPhone(scope.data)}}</span>
      </template>
    </tr-table>
  </div>
</template>

<script type="text/ecmascript-6">
import { getUser } from '@/utils/auth'
import { encryptionNum } from '@/utils/index'
export default {
  props: {
    loadKey: {
      type: String,
      default: 'GetCommunicateBookSysMenu'
    }
  },
  data() {
    return {
      form: {},
      data: [],
      loading: false,
      TableHeight: 310,
      frontFixedNum: 0, //前几行固定
      backFixedNum: 0, //后几行固定
      canRendererTableHeader: null,
      user_id: Number(JSON.parse(getUser()).user_id),
      customSettingList1: [
        {
          id: 1,
          label: "部门",
          prop: "dept_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "姓名",
          prop: "user_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        // {
        //   id: 3,
        //   label: "工号",
        //   prop: "work_code",
        //   width: "130",
        //   align: "center",
        //   signIndex: 2,
        //   sortable: false,
        // },
        {
          id: 3,
          label: "手机号码",
          prop: "phone",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
          notTooltip: true
        },
        {
          id: 4,
          label: "分机号",
          prop: "extension_number",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "短号",
          prop: "short_number",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "电子邮箱",
          prop: "e_mail",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
      ], //公司 
      customSettingList2: [
        {
          id: 1,
          label: "姓名",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "所在分组",
          prop: "group_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "电话号码",
          prop: "phone",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "电子邮件",
          prop: "email",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "办公号码",
          prop: "public_phone",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "公司",
          prop: "company",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "职位",
          prop: "position",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
      ], //公共
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.loadData()
    })
  },
  methods: {
    loadData() {
      this.loading = true
      let params = {context: {}}
      params.context = Object.assign({}, this.form);
      params.context.page_index = 1;
      params.context.page_size = 15;
      if(this.loadKey === 'GetCommunicateBookSysMenu') {
        params.context.user_id = this.user_id
      }
      this.$client[this.loadKey](params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list;
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
          this.loading = false;
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    // 设置手机号隐藏
    setPhone(row) {
      let str = ''
      
      if(row.phone && row.phone_view == 3) {
        str = encryptionNum(row.phone, 0, 0)
      }else if(row.phone && row.phone_view == 2) {
        str = encryptionNum(row.phone, 3, 4)
      }else {
        str = row.phone
      }
      return str
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.list-box
  height: 100%
  width: 100%
</style>
<template>
  <div :gutter="20" class="list-box">
    <el-skeleton v-if="loading && boxName !== '公司联系人' && boxName !== '公共联系人'" />
    <el-empty class="list-content" v-if="!data.length && !loading && boxName !== '公司联系人' && boxName !== '公共联系人'" :image="placeholderImage" style="padding: 0"></el-empty>
    <ul class="list-content" v-if="boxName !== '公司联系人' && boxName !== '公共联系人'">
      <li class="list-item" @click="itemClick(item)" v-for="(item, i) in data" :key="item.name">
        <p>
          <el-tag size="mini">{{setTagText(item.type)}}</el-tag>
          <span class="list-item-text">{{ boxName === '包车通知' ? item.title : item.name }}</span>
        </p>
        <el-divider></el-divider>
      </li>
    </ul>
    <div class="list-content" v-else>
      <tr-table
        :selectionShow="false"
        :data="data"
        :loading="loading"
        :TableHeight="TableHeight"
        :tableHeaderList="boxName === '公共联系人' ? customSettingList2 : customSettingList1"
        :isShowBottomOptions="false"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum">
        <template slot-scope="scope" slot="phone">
          <span>{{setPhone(scope.data)}}</span>
        </template>
      </tr-table>
    </div>
    
  </div>
</template>

<script type="text/ecmascript-6">
import { getUser } from '@/utils/auth'
import { encryptionNum } from '@/utils/index'
import placeholderImage from '@/assets/home-image/placeholder-2.png'
export default {
  props: {
    boxName: {
      type: String,
      default: '提醒待办'
    },
    loadKey: {
      type: String,
      default: 'GetCommunicateBookSysMenu'
    }
  },
  data() {
    return {
      data: [],
      loading: false,
      placeholderImage: placeholderImage,
      // user_id: Number(JSON.parse(getUser()).user_id),
      form: {},
      TableHeight: 300,
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
      let params = {
        menu_code: 3200000
      }
      if(this.boxName === '包车通知') params = {}
      if(this.boxName === '公司联系人' || this.boxName === '公共联系人') {
        params = {context: {}}
        params.context = Object.assign({}, this.form);
        params.context.page_index = 1;
        params.context.page_size = 15;
      }
      if(this.boxName === '公共联系人') {
        params.context.user_id = this.user_id
      }
      // params.context.page_index = 1;
      // params.context.page_size = 15;
      this.$client[this.loadKey](params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            if(this.boxName === '公司联系人' || this.boxName === '公共联系人') {
              this.data = res.context.list ? res.context.list : [];
            }else {
              this.data = res.context ? res.context : [];
            }
            // this.data = [
            //   {type: 1, name: '王小明妇女节上岛咖啡那段时间卡法滚吧你登记卡GV不拿代发金卡'},
            //   {type: 2, name: '王小明妇女'},
            //   {type: 3, name: '王小明妇女节上岛咖啡那段时间卡法滚吧你登记卡GV不拿代发金卡节上岛咖啡那段时间卡法滚吧你登记卡GV不拿代发金卡'},
            //   {type: 4, name: '王小明妇女节上岛咖登记卡GV不拿代发金卡'},
            // ]
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
    itemClick(val) {
      let str = val.type === 5 ? 'expiration-reminder' : 'employee-care'
      if(this.boxName === '包车通知') str = '/car-charter-management/car-charter-filling'
      this.$router.push({
        name:str,
        params:{
          id: val.id,
          name: val.name
        }
      })
    },
    setTagText(type) {
      let str = '包车'
      switch (type) {
        case 1:
          str = '生日'
          break;
        case 2:
          str = '合同到期'
          break;
        case 3:
          str = '退休提醒'
          break;
        case 4:
          str = '离职'
          break;
        case 5:
          str = '合同'
          break;
        default:
      }
      return str
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

<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;
.list-box {
  height: 100%;
  width: 100%;
  .list-content  {
    height: 100%;
    width: 100%;
    overflow: auto;
    .list-item {
      width: 100%;
      padding: 0 10px * $NumWidth;
      &:hover {
        cursor: pointer;
        background: #f2f6fc;
        border-radius: 3px;
      }
      p {
        width: 100%;
        display: flex;  
        padding: 10px * $NumWidth 0;
        .list-item-text {
          margin-left: 10px * $NumWidth;
          align-items: center;
          font-size: 14px;
          font-weight: bold;
          line-height: 18px;
          color: #333333;
          white-space: nowrap; /* 规定文本是否折行 */
          overflow: hidden; /* 规定超出内容宽度的元素隐藏 */
          text-overflow: ellipsis;
        }
      }
      /deep/ .el-divider {
         margin: 0;
       }
    }
  }
}

</style>
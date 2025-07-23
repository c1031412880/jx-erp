<!--  -->
<template>
  <div class="approve-step-box" style="height: 300px">
    <el-steps direction="vertical">
      <el-step :title="`${(index + 1) == data.length? '抄送人' : `审批人${index + 1}`}`" v-for="(item,index) in data" :key="index">
         <i class="iconfont icon-content" slot="icon"></i>
         <template slot="description">
           <div class="description-content">
              <p style="" v-if="!!item.users && item.users.length > 0">{{item.users.length}}{{`${(index + 1) == data.length? '抄送人' : `${(item.user_type == '0' && item.users.length == 1)? '人审批': `${(item.user_type == '0' && item.users.length > 1)? '人依次审批':`${(item.user_type == '2' && item.users.length == 1) ? '个主管审批':`${(item.user_type == '2') && item.users.length > 1? '个主管依次审批':`${item.user_type == '3'? '个机务审批':''}`  }`}`}` }` } `}}</p>
              <p style="" v-if="isOptional && !!item.users && item.users.length == 0">请选择审批人</p>
              <div class="approve-user show-flex-box-r" v-if="!isOptional">
                <div class="">
                  <span v-if="item.users">{{showApproveUsreName(item.users, index)}}</span>
                  <!-- <em class="el-icon-error" style="font-size: 13px"></em> -->
                </div>
                <div class="show-flex-box-r show-flex-center" style="margin-left: 5px;" v-if="((index + 1) == data.length)">
                  <span style="margin-right: 5px;">+</span>
                  <i style="color: #409EFF;cursor:pointer; font-size: 17px" class="el-icon-circle-plus-outline"></i>
                </div>
              </div>

               <div class="approve-user show-flex-box-r" v-else>
                <div class="approve-user-select show-flex-box-r" v-if="!!item.users && item.users.length > 0">
                  <div class="approve-user-select-item show-flex-box-r" v-for="(zItem, zIndex) in item.users" :key="zIndex">
                    <span>
                      {{zItem.name}}
                        <em class="el-icon-error" style="font-size: 13px" @click="deleteApproveUser(zItem, index)"></em>
                      </span>
                    <i v-if="(zIndex + 1) < item.users.length" >&nbsp; -> &nbsp;</i>
                  </div>
                </div>
                <div class="show-flex-box-r show-flex-center" style="margin-left: 5px;">
                  <span style="margin-right: 5px;">+</span>
                  <i style="color: #409EFF;cursor:pointer; font-size: 17px" class="el-icon-circle-plus-outline" @click="openSelectUserPop()"></i>
                </div>
              </div>
           </div>
        </template>
      </el-step>
    </el-steps>
  </div>
</template>

<script>
export default {
  components: {},
  props:{

  },
  data() {
    return {
      data:[
        {
          id:1,
          name:'',
          count:'1',
          userName:[
            '张三十大'
          ]
        },
        {
          id:2,
          name:'',
          count:'1',
          userName:[
            '张三'
          ]
        },
        {
          id:3,
          name:'',
          count:'2',
          userName:[
            '张三',
            '李四'
          ]
        },
        {
          id:4,
          name:'',
          count:'1',
          userName:[
            '张三',
          ]
        },
        {
          id:5,
          name:'',
          count:'1',
          userName:[
            '张三',
          ]
        },
        
      ],
      isOptional: false, //是否是自选、指定
      isOptionalMultiUser: false, //是否自选单人、自选多人
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.loadData();
  },
  methods: {
    showApproveUsreName(userNameList, approveIndex) {
      console.log(userNameList)
      let showUserText = '';
      // let showUserText = userNameList.join('->');
      userNameList.forEach((zItem,zIndex) => {
        if((approveIndex + 1) == this.data.length) {
          showUserText +=  `${zItem.name} + `
        }else{
          showUserText +=  `${zItem.name} -> `
        }
      });
      if((approveIndex + 1) == this.data.length) {
        showUserText = showUserText.substring(0,showUserText.length-2)
      }else{
        showUserText = showUserText.substring(0,showUserText.length-3)
      }
      return showUserText
    },
    // 获取数据
    loadData() {
      let params = {
        form_id: 1009
      };
      this.$client.getReviewData(params)
      .then(res => {
        if(res.head.result == '200') {
          this.data =res.context;
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      }).catch(err => {

      })
    },
    // 删除审批成员
    deleteApproveUser(userInfo, index) {

    },
    // 打开选择审批人员
    openSelectUserPop() {

    }
  },
};
</script>
<style lang='stylus' scoped>
.approve-step-box{
  width: 100%;
  height: 100%;
}
.icon-content{
  width: 100%;
  height: 100%;
}

.description-content{
  width: 100%;
  height: 100%;
  position: relative;
  color: #333;
  p {
    color: #333;
  }
  .approve-user{
    position: absolute;
    top: -15px;
    right: 0px; 
  }
}

.approve-step-box /deep/ .el-step__title {
  color: #333 !important;
}
.approve-step-box /deep/ .el-step__description {
  padding-right: 10% !important;
}

.approve-step-box /deep/ .el-step__icon {
  border: 4px solid;
  border-color: #409EFF;
  width: 20px;
  height: 20px;
}

.approve-step-box /deep/ .el-step__line {
  left: 9px;
}

// .approve-step-box /deep/ .

// .icon-content{
//   background: url("../../../../../src/assets/icons/yuanquan.png") center center no-repeat;
//   background-size: 100% 100%;
//   overflow hidden
// }

.approve-step-box >>> .el-step.is-vertical {
  height: 20%;
}

.approve-user-select-item{
  span{
    position: relative;
    em{
      position: absolute;
      top: -3px;
      right: -6px;
      z-index: 99;
      cursor: pointer;
    }

  }
}



</style>
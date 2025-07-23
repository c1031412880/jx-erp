<!--  -->
<template>
  <div class="approve-step-box" style="">
    <el-steps direction="vertical">
      <el-step :title="showTitle(item,index)" v-for="(item,index) in data" :key="index">
         <i class="iconfont icon-content" slot="icon"></i>
         <template slot="description">
           <div class="description-content show-flex-box-r">
              <p style="" v-if="!!item.userName && item.userName.length > 0">
                {{showApproveUsreName(item, index)}}
              </p>
             
              <div class="approve-user show-flex-box-r">
                <span v-if="item.type == 2 || item.type == 1">07-19 11:42</span>
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
          ],
          type: 1,
          isOwm: 0,
        },
        {
          id:2,
          name:'',
          count:'1',
          userName:[
            '张三'
          ],
          type: 1,
          isOwm: 1,
        },
        {
          id:3,
          name:'',
          count:'2',
          userName:[
            '张三',
            '李四'
          ],
          type: 1,
          isOwm: 0,
        },
        {
          id:4,
          name:'',
          count:'1',
          userName:[
            '张三',
          ],
          type: 2,
          isOwm: 0,
        },
        {
          id:4,
          name:'',
          count:'1',
          userName:[
            '张三',
            '张三',
          ],
          type: 3,
          isOwm: 0,
        },
        {
          id:5,
          name:'',
          count:'1',
          userName:[
            '王二',
            '张三',
            '李四',
          ],
          type: 4,
          isOwm: 0,
        },
        
      ],
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    // this.loadData();
  },
  methods: {
     showTitle(item,index) {
      let showTitleText = '';
      if(index == 0) {
        showTitleText = '发起申请';
      }else if((index + 1) == this.data.length) {
        showTitleText = '抄送人';
      }else{
        showTitleText = `审批人${index}`;
      }

      return showTitleText
    },
    showApproveUsreName(item, approveIndex) {
      // console.log(userNameList)
      let showUserText = '';
      if(!!item.isOwm) {
        if(item.type == 2) {
          showUserText = '我（审批中）'
        }else{
          showUserText = '我'
        }
        return showUserText
      }else{
        if(item.userName) {
        item.userName.forEach((zItem,zIndex) => {
          showUserText +=  `${zItem} 、`
        });
        showUserText = showUserText.substring(0, showUserText.length - 1)

        if(item.type == 1) {
          if(approveIndex != 0) {
            showUserText = `(${showUserText})${item.userName.length}人已同意`
          }
          return showUserText
        }

        if(item.type == 4) {
          showUserText = `抄送${item.userName.length}人(${showUserText})`
          }else{
             if(item.userName.length > 1) {
              showUserText = `(${showUserText})${item.userName.length}人依次审批`
            }
          } 
        }

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
    color: #999999;
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

.description-content {
  justify-content:space-between;
  p{
    color: #999999;
  }
}

// .approve-step-box /deep/ .

// .icon-content{
//   background: url("../../../../../src/assets/icons/yuanquan.png") center center no-repeat;
//   background-size: 100% 100%;
//   overflow hidden
// }

.approve-step-box >>> .el-step.is-vertical {
  height: 40%;
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
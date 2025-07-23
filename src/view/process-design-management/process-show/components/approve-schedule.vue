
<template>
  <div  class="approve-schedule" style="">
    <el-steps direction="vertical" :active="curApproveIndex" finish-status="finish">
      <el-step :title="showTitle(item,index)" v-for="(item,index) in data" :key="index">
        <i class="el-icon-circle-check" slot="icon" style="font-size: 28px;width:26px; height:26px; display: inline-block;background:#ffff;" v-if="index == 0"></i>
        <i class="el-icon-more" slot="icon" style="font-size: 24px;width:26px; height:26px; display: inline-block; color: #409EFF;background:#ffff;color: #ffff;" v-if="item.type == 2"></i>
         <i class="el-icon-s-promotion" slot="icon" style="font-size: 26px;width:26px; height:26px; display: inline-block; color: #ffff;background:#ffff; border: 2px #409EFF soild;border-radius: 50%" v-if="index + 1 == data.length"></i>
        <!-- <i class="el-icon-video-pause" slot="icon" style="font-size: 26px;width:26px; height:26px; display: inline-block; color: #409EFF" v-if="item.type != 2 && index != 0"></i> -->
        <template slot="description"> 
          <div class="description-content">
            <div class="description-content-text show-flex-box-r" style="width: 100%;">
              <span>{{checkShowApproveUseName(item,index)}}</span>
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
  data() {
    return {
      curApproveIndex: 1,
      data:[
        {
          id:1,
          name:'',
          count:'1',
          userName:[
            '张三十大'
          ],
          type: 1,
        },
        {
          id:2,
          name:'',
          count:'1',
          userName:[
            '张三'
          ],
          type: 1,
          
        },
        {
          id:3,
          name:'',
          count:'2',
          userName:[
            '张三',
            '李四'
          ],
          type: 1
        },
        {
          id:4,
          name:'',
          count:'1',
          userName:[
            '张三',
          ],
          type: 2
        },
        {
          id:4,
          name:'',
          count:'1',
          userName:[
            '张三',
          ],
          type: 3
        },{
          id:4,
          name:'',
          count:'1',
          userName:[
            '张三',
          ],
          type: 3
        },
        {
          id:4,
          name:'',
          count:'1',
          userName:[
            '张三',
            '张三',
            '张三',
          ],
          type: 3
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
          type: 4
        },
        
      ],
    };
  },
  computed: {},
  watch: {},
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
    checkShowApproveUseName(item,index) {
      let showApproveUseName = '';
      if(index == 0) {
        showApproveUseName = '我'
        return showApproveUseName
      }

      if(item.type == 1) {
        // this.curApproveIndex = index;
        item.userName.forEach((zItem,zIndex) => {
            showApproveUseName +=  `${zItem} ,`
        });
        showApproveUseName = showApproveUseName.substring(0, showApproveUseName.length - 1)
        showApproveUseName = showApproveUseName + '(已同意)';
      }
      
      if(item.type == 2) {
        this.curApproveIndex = index;
        item.userName.forEach((zItem,zIndex) => {
            showApproveUseName +=  `${zItem} ,`
        });
        showApproveUseName = showApproveUseName.substring(0, showApproveUseName.length - 1)
        showApproveUseName = showApproveUseName + '(审批中)';
      }
      if(item.type == 3) {
         item.userName.forEach((zItem,zIndex) => {
            showApproveUseName +=  `${zItem} 、`
        });
        showApproveUseName = showApproveUseName.substring(0, showApproveUseName.length - 1)
        if(item.userName.length > 1) {
          showApproveUseName = `${item.userName.length}人依次审批(${showApproveUseName})`
        }
        // showApproveUseName = showApproveUseName + '(审批中)';
      }

     if(item.type == 4) {
        item.userName.forEach((zItem,zIndex) => {
            showApproveUseName +=  `${zItem} + `
        });
        showApproveUseName = showApproveUseName.substring(0, showApproveUseName.length - 2)
        if(item.userName.length > 1) {
          showApproveUseName = `抄送${item.userName.length}人(${showApproveUseName})`
        }
     }

      return showApproveUseName
    },
  },
  created() {},
  mounted() {},
};
</script>
<style lang='stylus' scoped>
.icon-content {
  width: 100%;
  height: 100%;
}

.approve-schedule /deep/ .el-icon-video-pause {
    // width: 2px;
    // top: 1px;
    // bottom: 0px;
    // left: 12px;
}

.approve-schedule /deep/ .el-step__description {
  padding-right: 10% !important;
}


// .approve-schedule /deep/ .el-step__icon {
//    border: 0px solid;
// }
.approve-schedule /deep/ .el-step__icon-inner {
  padding-bottom: 2px;
}

.description-content-text {
  justify-content:space-between;
  span{
    color: #999999;
  }
}
.approve-schedule /deep/ .el-icon-s-promotion:before {
  width: 22px;
  height: 22px;
  // border: 2px #409EFF solid;
  border-radius: 50%;
  background:#409EFF;
}

.approve-schedule /deep/ .el-icon-more:before {
  width: 22px;
  height: 22px;
  // border: 2px #409EFF solid;
  border-radius: 50%;
  background:#409EFF;
}
</style>
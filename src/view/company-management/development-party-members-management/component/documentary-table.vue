<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    fullscreen
    class="documentary-table-dialog"
  >
    <!-- <tr-page-header ref="trPageHeader" slot="title" :content="'中国共产党发展党员工作纪实表'" @back="dialogClose"></tr-page-header> -->
    <div slot="title">
      <div class="show-flex-box-c show-flex-center">
        <h1>中国共产党发展党员工作纪实表</h1>
        <h3>{{curInfo.ex_oragan_name}}</h3>
      </div>
    </div>
    <div class="el-dialog-div">
      <div class="documentary-table-all">
         <div class="documentary-table-box">
            <div class="table-top-box show-flex-box-c">
              <h3 class="show-flex-box-r">
                <span>姓名</span>
                <strong>{{curInfo.name}}</strong>
                <span>性别</span>
                <strong>{{(curInfo.sex && curInfo.sex) == 1? '男':(curInfo.sex && curInfo.sex) == 2?'男':'/'}}</strong>
                <span>民族</span>
                <em>{{curInfo.nation}}</em>
              </h3>
              <div class="show-flex-box-r show-flex-center">
                <!-- <span>工作单位及职务</span> -->
                <span class="show-flex-box-r show-flex-center">
                  <span>工作单位及职务</span>
                </span>
                <strong class="show-flex-box-r show-flex-center">
                  <span>{{curInfo.position}}</span> 
                </strong>
                <span class="show-flex-box-r show-flex-center">
                  <span>户籍地</span>
                </span>
                <strong class="show-flex-box-r show-flex-center">
                  <span>{{curInfo.hometown}}</span> 
                </strong>
                <span class="show-flex-box-r show-flex-center">
                  <span>身份证号</span>
                </span>
                <em>{{curInfo.idcode}}</em>
              </div>
              <div class="show-flex-box-r show-flex-center">
                <!-- <span>现住址地</span> -->
                <span class="show-flex-box-r show-flex-center">
                  <span>现住址地</span>
                </span>
                <strong class="show-flex-box-r show-flex-center">
                  <span>{{curInfo.live_temp_adrress}}</span> 
                </strong>
                <!-- <span>联系电话</span> -->
                <span class="show-flex-box-r show-flex-center">
                  <span>联系电话</span>
                </span>
                 <strong class="show-flex-box-r show-flex-center">
                  <span>{{curInfo.phone}}</span> </strong>
                <span></span>
                <em></em>
              </div>
            </div>
            <div class="documentary-table-flow">
              <div class="documentary-table-header show-flex-box-r">
                <span>序号</span>
                <span>主要发展过程</span>
                <span>具体时间</span>
                <span>主要入党材料</span>
                <span>录入人</span>
              </div>
              <ul class="documentary-table-content show-flex-box-c">
                <li class="documentary-table-item show-flex-box-r" v-for="(item, index) in  flowList" :key="index">
                  <span>{{item.id}}</span>
                  <span>{{item.name}}</span>
                  <span>{{item.time}}</span>
                  <span>{{item.file_name}}</span>
                  <span class="show-flex-box-r show-flex-center">{{item.created_user}}</span>
                </li>
              </ul>

          </div>
          </div>
      </div>
    </div>

    <!-- <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')"
        >确 定</el-button
      >
    </span> -->
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  components: {},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "纪实表",
    },
  },
  mounted() {},
  data() {
    return {
      flowList:[
        {
          id: 1,
          name: '入党申请',
          time: '',
          file_name: '入党申请书',
          created_user: ''
        },
        {
          id: 2,
          name: '支部确定为入党积极分子时间',
          time: '',
          file_name: '思想汇报材料培养教育考察登记表》公示件',
          created_user: ''
        },
        {
          id: 3,
          name: '上级党委批复为入党积极分子时间',
          time: '',
          file_name: '思想汇报材料培养教育考察登记表》公示件',
          created_user: ''
        },
        {
          id: 4,
          name: '发展对象集中培训',
          time: '',
          file_name: '培训合格证书',
          created_user: ''
        },
        {
          id: 5,
          name: '发展对象政治审查',
          time: '',
          file_name: '政审结论性意见材料',
          created_user: ''
        },
        {
          id: 6,
          name: '接收预备党员前基层党委（或县委组织部审批）',
          time: '',
          file_name: '预审意见材料',
          created_user: ''
        },
        {
          id: 7,
          name: '支部讨论接收预备党员',
          time: '',
          file_name: '入党志愿书',
          created_user: ''
        },
        {
          id: 8,
          name: '组织谈话',
          time: '',
          file_name: '入党志愿书',
          created_user: ''
        },
        {
          id: 9,
          name: '基层党委审批预备党员',
          time: '',
          file_name: '入党志愿书',
          created_user: ''
        },
        {
          id: 10,
          name: '入党宣誓',
          time: '',
          file_name: '/',
          created_user: ''
        },
        {
          id: 11,
          name: '转正申请',
          time: '',
          file_name: '转正申请书',
          created_user: ''
        },
        {
          id: 12,
          name: '支部讨论预备党员转正',
          time: '',
          file_name: '入党志愿书',
          created_user: ''
        },
        {
          id: 13,
          name: '基层党委审批正式党员',
          time: '',
          file_name: '入党志愿书',
          created_user: ''
        },
        {
          id: 14,
          name: '入党材料移交归档',
          time: '',
          file_name: '主要入党材料',
          created_user: ''
        }
      ],
      curInfo: {}, //查看的当前纪实表信息
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 设置纪实表数据
    setData(val) {
      this.curInfo = val;
      this.flowList.forEach((item,index) => {
        switch (item.id) {
          case 1:
            item.time = val.ex_apply_time
            item.created_user = val.ex_user_name1
            break;
          case 2:
            item.time = val.ex_confirm_time
            item.created_user = val.ex_user_name3
            break;
          case 3:
            item.time = val.ex_object_time
            item.created_user = val.ex_user_name7
            break;
          case 4:
            item.time = val.ex_train_time
            item.created_user = val.ex_user_name10
            break;
          case 5:
            item.time = val.ex_check_time
            item.created_user = val.ex_user_name11
            break;
          case 6:
            item.time = val.ex_meeting_time
            item.created_user = val.ex_user_name12
            break;
          case 7:
            item.time = val.ex_discuss_time
            item.created_user = val.ex_user_name15
            break;
          case 8:
            item.time = val.ex_talk_time_up
            item.created_user = val.ex_user_name16
            break;
          case 9:
            item.time = val.ex_audit_time
            item.created_user = val.ex_user_name17
            break;
          case 10:
            item.time = val.ex_oath_time
            item.created_user = '/'  //val.ex_user20
            break;
          case 11:
            item.time = val.ex_positive_time
            item.created_user = val.ex_user_name22
            break;
          case 12:
            item.time = val.ex_discuss_time_up
            item.created_user = val.ex_user_name23
            break;
          case 13:
            item.time = val.ex_submit_time
            item.created_user = val.ex_user_name24
            break;
          case 14:
            item.time = val.ex_archive_time
            item.created_user = val.ex_user_name25
            break;
        }
      });
    }
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
// .el-dialog__headerbtn { top: 8px !important; background: url('https://你路径资源的url图片') left no-repeat; background-size: cover; } 
.documentary-table-dialog /deep/ .el-dialog__header .el-dialog__headerbtn{ font-size: 36px !important; }
.el-dialog-div {
  padding: 0 200px;
  height: 100%;
  // overflow-y: scroll;
}
.documentary-table-all{
  width: 100%;
  height: 100%;
  border: 1px solid #333333;
}
.documentary-table-box{
  width: 100%;
  height: 100%;
  // overflow-y: scroll;
  >.table-top-box{
    width: 100%;
    // height: 450px;
    >h3{
      width:100%;
      height: 50px;
      border-bottom: 1px solid #333333;
      >span{
        width: 10%;
        text-align: center;
        line-height: 50px;
        border-right: 1px solid #333333;
      }
      >strong{
        width: 25%;
        height: 100%;
        text-align: center;
        line-height: 50px;
        border-right: 1px solid #333333;
      }
      >em{
        width: 20%;
        height: 100%;
        text-align: center;
        line-height: 50px;
      }
    }
    >div{
      width:100%;
      height: 80px;
      border-bottom: 1px solid #333333;
      >span{
        width: 10%;
        height: 80px;
        text-align: center;
        // border-right: 1px solid #333333;
        >span{
          line-height: 20px;
        }
      }
      >strong{
        width: 25%;
        height: 80px;
        text-align: center;
        // line-height: 20px;
        border-right: 1px solid #333333;
        border-left: 1px solid #333333;
        >span{
          line-height: 20px;
        }
      }
      >em{
        width: 20%;
        height: 80px;
        text-align: center;
        line-height: 80px;
      }
      >span:nth-child(5) {
        border-right: 1px solid #333333;
      }
    }
    // >div:nth-child(3) {
    //   border-bottom: none;
    // }
  }

  >.documentary-table-flow{
    width: 100%;
    >.documentary-table-header{
      width: 100%;
      height: 50px;
      border-bottom: 1px solid #333333;
      >span{
        height: 50px;
        line-height: 50px;
        text-align: center;
        border-right: 1px solid #333333;
      }
      >span:nth-child(1){
        width: 6%;
        // background: red;
      }
      >span:nth-child(2){
        width: 30%;
      }
      >span:nth-child(3){
        width: 16%;
      }
      >span:nth-child(4){
        width: 30%;
      }
      >span:nth-child(5){
        width: 19%;
        border-right: none;
        // background: red;
      }
    }
    >.documentary-table-content {
      width: 100%;
      >.documentary-table-item {
        width: 100%;
        height: 50px;
        border-bottom: 1px solid #333333;
        >span{
          height: 50px;
          line-height: 50px;
          text-align: center;
          border-right: 1px solid #333333;
        }
        >span:nth-child(1){
          width: 6%;
          // background: red;
        }
        >span:nth-child(2){
          width: 30%;
        }
        >span:nth-child(3){
          width: 16%;
        }
        >span:nth-child(4){
          width: 30%;
        }
        >span:nth-child(5){
          width: 19%;
          border-right: none;
          // background: red;
        }
      }
      >li:nth-child(14) {
        border-bottom: none;
      }
    }

  }


}
</style>


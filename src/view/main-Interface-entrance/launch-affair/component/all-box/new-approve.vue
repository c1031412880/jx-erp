<template>
  <div class="all-box"  v-loading="loading">
    <el-input v-model="searchForm" clearable placeholder="请搜索要使用的表单" prefix-icon="el-icon-search" style="width: 200px;"></el-input>
    <ul class="list-box" v-if="data.length">
      <li class="group-item" v-for="(group, i) in data" :key="`group${i}`">
        <div class="title">
          <div style="float: left; width: 4px; height: 16px; background: #31A7FF;margin-right: 6px"></div>
          <p>{{group.c_type_name}}</p>
          <span>{{ group.form_classify_list.length ? group.form_classify_list.length : 0}}</span>
        </div>
        <el-divider></el-divider>
        <el-row>
          <el-col :span="3" v-for="(item,j) in group.form_classify_list" :key="`item${j}`">
            <div class="item-content" @click="addAffair(item)">
              <img v-if="item['logo_url']" :style="{background: item['logo_color']}" :src="item['logo_url']" alt="">
              <!-- <img v-else src="#" alt=""> -->
              <div v-else class="image-box" :style="{background: item['logo_color']}">{{item.c_form_name.slice(0,1)}}</div>
              <div class="box-content">
                <p>{{item.c_form_name}}</p>
              </div>
            </div>
          </el-col>
        </el-row>
      </li>
    </ul>
    <el-empty v-else description="暂无数据"></el-empty>
    <fixed-form-body 
      ref="fixedFormBody" 
      :formId="formId" 
      :formName="formName" 
      :isAgain="false" 
      :isCommit="false" 
      :dialogBool.sync="fixedFormBodyShow">
      </fixed-form-body>
  </div>
</template>

<script type="text/ecmascript-6">
  import fixedFormBody from "./fixed-form-body";
  export default {
    name: "new-approve",
    components: {fixedFormBody},
    data() {
      return {
        searchForm: '',
        data: [],
        loading: false,
        formType: '',
        formId: 0,
        formName: '',
        fixedFormBodyShow: false
      }
    },
    watch: {
      searchForm(newValue) {
        this.loadData()
      }
    },
    mounted() {
      let params = this.$route.params
      if(!!params.type) {
        this.formType = params.type
        this.fixedFormBodyShow = true
        this.$refs.fixedFormBody.setData(params.data)
      }
      this.loadData()
    },
    methods: {
      // 数据加载
      loadData() {
        let params = {
          form_name: this.searchForm,
          use: 1
        }
        this.loading=true
        this.$client
          .getFormGroupList(params)
          .then((res) => {
            console.log(res);
            if (res.head.result == "200") {
              this.loading = false;
              this.data = res.context;
              // console.log('----------',JSON.parse(JSON.stringify(this.data)));
            } else {
              this.loading = false;
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error",
              });
            }
          })
          .catch((err) => {
            this.$message({
              showClose: true,
              message: err.body.message,
              type: "error",
            });
          });
      },
      addAffair(item) {
        if(item['i_form_id'] === 20 || item['i_form_id'] === 21) {
          this.$router.push({
            name: 'utility-vehicle-book'
          })
          return
        }
        let obj = this.$refs.fixedFormBody.objectIdMap[item['i_form_id']]
        console.log(obj, item,'-----------');
        
        if(!obj) {
          this.$message.warning('此功能正在开发中，敬请期待！')
          return
        }
        this.formId = item['i_form_id']
        this.formName = item['c_form_name']

        this.fixedFormBodyShow = true
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.all-box{
  width 100%
  height 100%
  .list-box{
    margin-top 20px
    width 100%
    height calc(100% - 60px)
    overflow auto
    .group-item{
      width 100%
      .el-divider{
        margin 10px 0 20px 0
      }
      .title{
        display flex
        font-size 16px
        p{
          font-family 'Source Han Sans SC-Bold'
          font-weight Bold
          margin-right 3px
        }
        span{
          font-weight 400
          color #999999
        }
      }
      .el-row {
        width 100%
        .el-col {
          margin-right 20px
          margin-bottom 20px
          border-radius 5px
          min-width 200px
          padding 5px
          &:hover{
            background #ECF1FF
            cursor: pointer
          }
        }
      }
      .item-content{
        width 100%
        height 100%
        display flex
        align-items: center
        img,.image-box{
          height: 42px;
          width: 42px;
          border-radius: 5px
          text-align: center;
          line-height: 42px;
          font-family: kaiti;
          font-size: 24px;
          font-weight: bold;
        }
        .box-content{
          margin-left 10px
          flex 1       
          p {
            font-family 'Source Han Sans SC-Regular, Source Han Sans SC'
            color #333333;
            font-size 14px
            font-weight 400;
            white-space pre-wrap;
            line-height 21px
          }         
        }
      }
    }
  }
}
</style>

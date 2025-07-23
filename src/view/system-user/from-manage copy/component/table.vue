<template>
  <div class="table" v-loading="loading">
    <div class="table-all" v-if="!loading &&　formTotal.length > 0">
      <div class="table-content" v-for="(item,index) in formTotal" :key='index'>
        <h3 class="table-title">
          <span v-if="item.sortgroup">{{item.c_type_name}} ({{item.sortgroup.length}})</span>
          <em @click="formOrder(item)" v-if="$isPowerShow('sort_form')">排序</em>
        </h3>
        <ul class="form-list">
          <li class="form-item" v-for="(Zitem, Zindex) in item.sortgroup" :key="Zindex">
            <div class="form-item-content">
              <div class="form-left">
                <span>{{Zitem.c_form_name}}</span>
                <!-- <em>{{Zitem.c_remark}} -->
                  <el-tooltip :content="Zitem.c_remark" placement="top" effect="light">
                    <!-- <el-button>{{Zitem.c_remark}}</el-button> -->
                    <em>{{Zitem.c_remark}} 
                       </em>
                  </el-tooltip>
                <!-- </em> -->
              </div>
              <div class="form-center">
                <span class="form-center-left">
                  <span>可见范围</span>
                  <strong>{{checkStatus(Zitem.c_type)}} &nbsp; 
                  <!-- <em class="show-flex-box-r" type="text"> -->
                    <el-dropdown @command="handleCommand" v-if="$isPowerShow('edit_form')">
                      <span class="el-dropdown-link" @click="reqFormInfo(Zitem)">
                        修改<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="1">不可见</el-dropdown-item>
                        <el-dropdown-item command="2">只读</el-dropdown-item>
                        <el-dropdown-item command="3">可写</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>  
                  <!-- </em> -->
                </strong>
                  
                </span>
                <em class="form-center-right">
                  <span>最后更新时间</span>
                  <strong>{{Zitem.d_create}}</strong>
                </em>
              </div>

              <div class="form-right">
                <el-button type="text" @click="operateButton(Zitem,'group-edit')" v-if="$isPowerShow('edit_form')">编辑</el-button>
                <el-button type="text" @click="operateButton(Zitem,'group-dead')" v-if="$isPowerShow('del_form')">{{Zitem.i_enabled? '停用':'启用'}}</el-button>
                <el-button type="text" @click="operateButton(Zitem,'form-delete',item)" v-if="!Zitem.i_enabled && $isPowerShow('del_form')" >删除</el-button>
                <el-button type="text" @click="operateButton(Zitem,'group-adjust',item)" v-if="Zitem.i_enabled && $isPowerShow('change')">分组调整</el-button>
                <!-- <span></span>
                <em></em> -->
              </div>

            </div>

          </li>
        </ul>
      </div>
    </div>
    <!-- <div class="show-flex-box-r show-flex-center" style="with:100%;height:100%;" v-else>
      <i class="el-icon-loading"></i>
    </div> -->
  </div>
</template>

<script type="text/ecmascript-6">
  import {getRoleIds} from '@/utils/auth'
  export default {
    data () {
      return {
        visible: false,
        power: getRoleIds(),
        multipleSelection: [],
        tableHeaderDataList:[],
        curSelectedRowInfo:null,
        form_id:'',
      }
    },
    props: {
      formTotal:[Object,Array],
      data: {
        type: Array,
        default: null
      },
      loading: {
        type: Boolean,
        default: false
      },
    },
    methods: {
      configFromData() {
        this.fromDataList = this.formTotal
      },

      checkStatus(type) {
        let showText = '';
        switch (type) {
          case 1:
            showText = '不可见'
            break;
          case 2:
            showText = '只读'
            break;
          case 3:
            showText = '可写'
            break;
        }
        return showText
      },

      formOrder(item) {
        this.$emit("open-from-order-pop", item)
      },

      operateButton(item,type, groupInfo) {
        this.$emit(`send-${type}`, item, groupInfo)
      },
      reqFormInfo(formInfo) {
        console.log(formInfo);
        this.form_id = formInfo.i_form_id
      },
      handleCommand(type) {
        let params = {
          form_id: this.form_id,
          type: type 
        }
        this.$emit("change-form-visible", params)
      }

    },
    watch:{
      formTotal() {
        this.configFromData()
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .table{
    width: 100%;
    height: 100%;
    .table-all{
      width 100%
      height 100%
      display flex
      flex-direction column
      .table-title{
        width 100%;
        height 25px;
        padding 40px 0;
        display flex
        flex-direction row
        justify-content space-between
        align-items center
        span{
          font-size 18px;
          color #333333;
          line-height 25px
          font-weight 700 
          margin-left 10px
        }
        em{
          font-size 13.333px;
          font-style normal
          color #333333;
          line-height 25px
          font-weight 500 
          cursor pointer
          margin-right 20px
        }
      }
      .form-list{
        width 100%
        display flex
        flex-direction column
        flex-grow 1
        .form-item{
          width 100%;
          // height 50px;
          padding 20px 0;
          // display flex;
          border 1px #eeee solid;
          margin-bottom 20px
          .form-item-content{
            flex-grow 1;
            padding 0 20px;
            height 50px
            display flex
            flex-direction row;
            justify-content space-between
            align-items center
            .form-left{
              width 25%
              height 100%
              display flex;
              flex-direction column
              justify-content space-between
              span{
                font-size 15px;
                font-style normal
                color #333333;
                font-weight 600
              }
              em{
                // width 33%;
                font-size 15px;
                font-style normal
                color #999999;
                font-weight 500
                white-space nowrap
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                cursor: pointer;
              }
            }
            .form-center{
              width 20%
              height 100%
              display flex;
              flex-direction row
              justify-content space-between
              .form-center-left{
                height 100%
                display flex;
                flex-direction column
                justify-content space-between
                margin-right 20px
                span{
                  font-size 15px;
                  font-style normal
                  color #999999;
                  font-weight 500
                  white-space nowrap
                }
                strong{
                  height 15px
                  font-size 15px;
                  font-style normal
                  color #333333;
                  font-weight 500
                  white-space nowrap
                  .el-dropdown{
                    .el-dropdown-link{
                      font-size 15px;
                    font-style normal
                    color #409EFF;
                    font-weight 500
                    white-space nowrap
                    cursor pointer
                    }
                  }
                  em{
                    font-size 15px;
                    font-style normal
                    color #409EFF;
                    font-weight 500
                    white-space nowrap
                    cursor pointer
                  }
                }
              }
              .form-center-right{
                height 100%
                display flex;
                flex-direction column
                justify-content space-between
                span{
                  font-size 15px;
                  font-style normal
                  color #999999;
                  font-weight 500
                  white-space nowrap
                }
                strong{
                  height 15px
                  font-size 15px;
                  font-style normal
                  color #333333;
                  font-weight 500
                  white-space nowrap
                }
              }
            }
            .form-right{
              // width 10%;
              display flex;
              flex-direction row
            }
          }
        }
      }
    }
    .loading-class{
      width 100%
      height 100%;
      display flex;
      justify-content center;
      align-items center;
    }
  }

</style>

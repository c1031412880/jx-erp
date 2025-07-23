<template>
  <div class="table" v-loading="loading">
    <div class="table-all" v-if="!loading && formTotal.length > 0">
      <div class="table-content" v-for="(item,index) in formTotal" :key='index'>
        <div class="table-title">
          <h3>{{item.c_type_name + '(' + item.form_count + ')'}}</h3>
          <div>
            <el-button type="text" size="mini" icon="el-icon-edit" 
              v-if="item.c_type_name != '其他' && item.c_type_name != '已停用'"
              @click="onBtn('updateGroup', item)"
              >重命名</el-button>
            <el-button type="text" size="mini" icon="el-icon-close" 
              v-if="item.c_type_name != '其他' && item.c_type_name != '已停用'"
              @click="onBtn('deleteGroup', item)"
              >删除</el-button>
            <el-button type="text" size="mini" icon="el-icon-d-caret"
              :disabled="disabled"
              @click="onBtn('fromShort', item.form_classify_list)"
              >排序</el-button>
          </div>
          <!-- <em @click="formOrder(item)" v-if="$isPowerShow('sort_form')">排序</em> -->
        </div>
        <ul class="form-list">
          <li class="form-item" v-for="(Zitem, Zindex) in item.form_classify_list" :key="Zindex">
            <div class="form-item-content">
              <div class="form-left">
                <img v-if="Zitem['logo_url']" :style="{'background-color': Zitem['logo_color']}" :src="Zitem['logo_url']" alt="">
                <img v-else src="#" alt="">
                <div>
                  <span>{{Zitem.c_form_name}}</span>
                  <el-tooltip :content="Zitem.c_remark" placement="top" effect="light">
                    <em>{{Zitem.c_remark}}</em>
                  </el-tooltip>
                </div>
              </div>
              <div class="form-center">
                <div class="form-center-left">
                  <span>可见范围</span>
                </div>
                <div>
                  <el-tooltip :content="Zitem.c_remark" placement="top" effect="light">
                    <em>{{Zitem.i_all_vis == 1 ? '全部可见' : '部分可见'}}</em>
                  </el-tooltip>
                  <el-button type="text" size="mini" @click="onBtn('authFrom', Zitem)">修改</el-button>
                </div>
              </div>

              <div class="form-right">
                <el-button type="primary" size="mini" icon="el-icon-edit-outline" plain 
                  @click="onBtn('updateFrom', Zitem)" 
                  v-if="$isPowerShow('edit_form')">编辑</el-button>
                <el-button type="primary" size="mini" :icon="item.c_type_name != '已停用' ? 'el-icon-circle-close' : 'el-icon-circle-check'" plain 
                  @click="operateButton('enableForm', Zitem, item.c_type_name)"
                  v-if="$isPowerShow('del_form')">{{item.c_type_name != '已停用' ? '停用':'启用'}}</el-button>
                <el-button type="primary" size="mini" icon="el-icon-delete" plain 
                  @click="operateButton('deleteForm', Zitem)"
                  v-if="$isPowerShow('del_form') && item.c_type_name == '已停用'" >删除</el-button>
                <el-button type="primary" size="mini" icon="el-icon-folder-opened" plain 
                  @click="operateButton('adjustForm', Zitem, item.c_type_name)"
                  v-if="$isPowerShow('change') && item.c_type_name != '已停用'">移动</el-button>
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
  import allForm from "./config"
  export default {
    data () {
      return {
        imgObj: allForm,
        visible: false,
        power: getRoleIds(),
        form_id:'',

      }
    },
    props: {
      formTotal:[Object,Array],
      loading: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
    },
    methods: {
      onBtn(type, item) {
        if(type == 'deleteGroup') {
           this.$confirm('确认删除分组吗? <br/> 删除后分组内表单不会被删除，将会进入到「其他」分组。', '确认操作', {
              dangerouslyUseHTMLString: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            }).then(() => {
              this.$emit('on-' + type, item)
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });          
            });
        }else {
          this.$emit('on-' + type, item, type)
        }
      },
      operateButton(type, item, groupInfo) {
        if(type == 'enableForm' && groupInfo != '已停用') {
          this.$confirm('确认停用吗? <br/> 停用的表单会被放到「已停用」分组中.', '确认操作', {
              dangerouslyUseHTMLString: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            }).then(() => {
              this.$emit(`send-${type}`, item, groupInfo)
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消停用'
              });          
            });
        }else if(type == 'deleteForm') {
          this.$confirm('确认删除模板吗? <br/> 模板删除后无法恢复,确认删除?', '确认操作', {
              dangerouslyUseHTMLString: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            }).then(() => {
              this.$emit(`send-${type}`, item)
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });          
            });
        }else {
          this.$emit(`send-${type}`, item, groupInfo)
        }
      },
    },
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
      .table-content {
        margin-bottom: 20px
        // box-shadow: 0 0 2px 1px rgba(0,0,0,0.2)
        border: 1px #eeee solid;
        .table-title{
          h3 {
            font-size 18px;
            color #333333;
            line-height 25px
            font-weight 700 
          }
          width 100%;
          padding 20px;
          display flex
          flex-direction row
          justify-content space-between
          align-items center
          background-color: #F9F9F9
        }
        .form-list {
          width: 100%
          display: flex
          flex-direction column
          flex-grow 1
          .form-item{
            width 100%;
            padding: 20px;
            border-top: 1px #eeee solid; 
            .form-item-content {
              flex-grow 1;
              display: flex
              flex-direction row
              justify-content space-between
              align-items center
              .form-left{
                width 25%
                display: flex
                img{
                  height: 42px;
                  width: 42px;
                  border-radius: 5px
                }
                div {
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                  padding-left: 10px
                }
              }
              .form-center {
                width: 25%;
                display: flex
                flex-direction: column
                justify-content: space-between
              }
              span {
                // height 15px
                font-size 13px;
                font-style normal
                color #333333;
                font-weight 500
                white-space nowrap
              }
              em {
                font-size 13px;
                font-style normal
                color #999999;
                font-weight 500
                white-space nowrap
              }
            }
          }
        }
      }
    }
  }

</style>

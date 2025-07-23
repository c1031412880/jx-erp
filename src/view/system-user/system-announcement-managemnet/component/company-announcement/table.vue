<template>
  <div class="table">
    <div class="table-div" @click="preview(item)" v-for="item in data" :key="item.id">
      <el-badge :is-dot="!item.is_read && !agency" class="item" style="width: 100%">
        <div class="table-box">
          <div :class="{ 'table-content': true, is_read: item.is_read }">
            <div class="table-title">
              <span v-if="item.top == 1 && !agency" class="table-title-top">置顶</span>
              <span v-if="item.send_type == 1 && !agency && !item.state" class="table-title-send">
                定时发送
              </span>
              <el-tooltip v-if="agency" class="item" effect="dark" :content="item.title" placement="top-start">
                <span
                  :class="[
                    item.is_read == 1 ? 'table-title-read' : 'table-title-unRead',
                    agency ? 'tabel-agency' : ''
                  ]"
                >
                  {{ item.title }}
                </span>
              </el-tooltip>
              <span
                v-else
                :class="[
                  item.is_read == 1 ? 'table-title-read' : 'table-title-unRead',
                  agency ? 'tabel-agency' : ''
                ]"
              >
                {{ item.title }}
              </span>
            </div>
            <div class="table-text retain_2" v-html="processHtmlContent(item.content)"></div>
            <div class="table-subscript">
              <span v-if="!agency && $isPowerShow('admin')">{{ `共${item.all}人` }}</span>
              <span
                v-if="!agency && $isPowerShow('admin')"
                style="color: #0092fe; cursor: pointer; z-index: 99"
                @click.stop="showRead(item)"
              >
                {{ `${item.Read}人已读` }}
              </span>
              <span v-if="!agency && $isPowerShow('admin')">{{ ' |' }}</span>
              <span v-if="item.type_name && !agency">{{ `${item.type_name} |` }}</span>
              <span>{{ `${item.author} |` }}</span>
              <span>{{ `${item.send_time.slice(0, 11)}` }}</span>
              <span v-if="!agency && $isPowerShow('admin')">{{ ' |' }}</span>
              <el-dropdown @command="changeState" v-if="!agency && $isPowerShow('admin')">
                <span class="el-dropdown-link" style="color: #999">● ● ●</span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="handleCommand('edit', item)">编辑</el-dropdown-item>
                  <el-dropdown-item :command="handleCommand('delete', item)">删除</el-dropdown-item>
                  <el-dropdown-item v-if="item.top == 0" :command="handleCommand('top', item)">
                    置顶
                  </el-dropdown-item>
                  <el-dropdown-item v-if="item.top == 1" :command="handleCommand('unTop', item)">
                    取消置顶
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div :class="[agency ? 'agency-cover' : 'list-cover', 'table-cover']">
            <!-- <el-image
              :src="item.image_url ? item.image_url :bgImg"
              class="table-img"
            ></el-image> -->
            <safe-image
              class="table-img"
              :imgUrl="item.image_url ? item.image_url : bgImg"
              :authToken="token"
            ></safe-image>
            <div v-if="!item.image_url" class="table-title retain_2">{{ item.title }}</div>
          </div>
        </div>
      </el-badge>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {getUser, getSession} from '@/utils/auth'
import bgImg from "@/assets/notice-image/bj.png"
import safeImage from "@/components/image-box/component/safe-image"
export default {
  components: {
    safeImage,
  },
  props: {
    data:{
      type: Array,
      default: []
    },
    agency: {     //首页代办
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      bgImg: bgImg,
      token: '',
    };
  },
  mounted() {
    this.token = getSession()
  },
  methods: {
    /**
     * 处理HTML内容，清理行内样式
     * @param {String} htmlContent - 原始HTML内容
     * @returns {String} 处理后的HTML内容
     */
    processHtmlContent(htmlContent) {
      if (!htmlContent) return '';
      
      // 创建临时DOM元素来处理HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      
      // 移除所有元素的style属性
      const allElements = tempDiv.querySelectorAll('*');
      allElements.forEach(element => {
        element.removeAttribute('style');
      });
      
      return tempDiv.innerHTML;
    },
    
    showRead(item) {
      this.$emit("show-read",item)
    },
    preview(item) {
      this.$emit("show-preview",item)
      console.log(item);
    },
    changeState(item) {
      const {command,info} = item
      if (command == "top") info.top = 1
      if (command == "unTop") info.top = 0
      this.$emit('on-' + command,info);
    },
    handleCommand(command,item) {
      return {
        'info': item,
        'command': command
      }
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.table {
  .table-div {
    padding:5px;
    border:1px solid #ddd;
    margin-bottom:15px;
    &:hover{
      cursor:pointer;
      background: #F2F6FC;
    }
    .table-box {
      display: flex;
      width: 100%;
      justify-content: space-between;
      padding: 10px;
      .table-content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 60%;
        .table-title {
          .table-title-top,.table-title-send {
            background: #FE9400;
            color: #fff;
            padding: 1px 5px;
            font-size: 14px;
            margin-right: 5px;
          }
          .table-title-read {
            font-size: 20px;
            font-weight: 600;
          }
          .table-title-unRead {
            font-size: 20px;
            font-weight: 600;
          }
          .tabel-agency {
            font-size: 20px;
            font-weight: 600;
          }
        }
        .table-text {
          max-height: 82px;
          font-size: 14px;
          color: #333333;
          font-weight: 400;
          font-family: PingFang SC-Regular, PingFang SC;
        }
        .table-text {
          // 深度选择器，可以覆盖 v-html 中的行内样式
          >>> * {
            font-size: 14px !important;
            color: #333333 !important;
            line-height: 1.5 !important;
          }
          
          >>> p {
            font-size: 14px !important;
            color: #333333 !important;
            line-height: 1.5 !important;
            margin-bottom: 10px !important;
            text-indent: 28px !important;
          }
          
          >>> span {
            font-size: 14px !important;
            color: #333333 !important;
            line-height: 1.5 !important;
          }
          
          >>> img {
            max-width: 450px !important;
            max-height: 300px !important;
            margin: 0 auto;
            display: block;
          }
          
          // 覆盖所有可能的行内样式
          >>> [style*="font-size"] {
            font-size: 14px !important;
          }
          
          >>> [style*="color"] {
            color: #333333 !important;
          }
        }
        .table-subscript {
          color: #999;
          font-size:14px;
        }
      }

      .table-cover {
        position: relative;
        cursor: pointer;
        .table-title {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          color: #fff;
        }
      }

      .agency-cover {
        .table-title {
          font-size: 14px;
          font-weight: 600;
        }
        .table-img {
          width: 210px;
          height: 82px;
        }
      }

      .list-cover {
        .table-title {
          font-size: 20px;
          font-weight: 800;
        }
        .table-img {
          width:350px;
          height: 136px
        }
      }
    }
  }

  .retain_2 {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
</style>

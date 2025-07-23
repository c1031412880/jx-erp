<template>
  <div class="dataList">
    <sub-req ref="head" @on-ok="onSubmit" @on-add="openAddInfo"></sub-req>
    <div class="content-box" v-loading="loading">
      <div v-if="!!data.length">
        <div class="content-head" :style="{'padding-right': data.length >= 16 ? '17px' : '0'}">
          <div class="head-left">
            标题
          </div>
          <div class="head-right">
            <div>作者</div>
            <div>发布时间</div>
            <div></div>
          </div>
        </div>
        <ul :style="{'height': contentHigh + 'px'}">
          <li class="content-item" v-for="item in data" :key="item.id" @click="openItemNews(item)">
            <div class="content-left">
              <div style="padding-right: 10px;">
                <el-tag v-show="(curSelectType==='my') && (item.state == -1)" type="info" effect="dark" size="mini">草 稿</el-tag>
                <el-tag v-show="(curSelectType==='my') && (item.state == 1)" type="" effect="dark" size="mini">待 审 核</el-tag>
                <el-tag v-show="(curSelectType==='my') && (item.state == 2)" type="warning" effect="dark" size="mini">审核通过</el-tag>
                <el-tag v-show="(curSelectType==='my') && (item.state == 3)" type="danger" effect="dark" size="mini">审核驳回</el-tag>
                <!-- <el-tag v-show="item.top" type="warning" effect="dark" size="mini">置 顶</el-tag> -->
                <!-- <el-tag v-show="item.home_page" type="success" effect="dark" size="mini">轮 播</el-tag> -->
              </div>
              <p>{{item.title}}</p>
              <div :class="{ icon: true, is_read: !!item.is_read }"></div>
            </div>
            <div class="content-right">
              <div>{{ item.user_name }}</div>
              <div style="color: #999;">{{item.send_time}}</div>
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  <i style="font-size: 16px" class="el-icon-more"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="beforeHandleCommand(item, 1)" icon="el-icon-edit" :disabled="!($isPowerShow('edit'))">编辑</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <!-- <div class="content-left">
              <el-image :src="!!item.image_url ? item.image_url : bgImg" :fit="'fill'"></el-image>
            </div>
            <div class="content-right">
              <div class="content-title">
                <el-tag v-show="item.top" type="warning" effect="dark" size="mini">置 顶</el-tag>
                <el-tag v-show="item.home_page" type="success" effect="dark" size="mini">轮 播</el-tag>
                <p>{{item.title}}</p>
                <el-tag v-show="(curSelectType==='my') && (item.state == -1)" type="info" effect="dark" size="mini">草 稿</el-tag>
                <el-tag v-show="(curSelectType==='my') && (item.state == 1)" type="" effect="dark" size="mini">待 审 核</el-tag>
                <el-tag v-show="(curSelectType==='my') && (item.state == 2)" type="warning" effect="dark" size="mini">审核通过</el-tag>
                <el-tag v-show="(curSelectType==='my') && (item.state == 3)" type="danger" effect="dark" size="mini">审核驳回</el-tag>
              </div>
              <div class="content-right-text" v-html="item.content"></div>
              <div class="content-right-bottom">
                <div class="left-list">
                  <div>
                    <el-button @click="openReadDialog(item)" size="mini" type="text">共{{item.all}}人，{{item.Read}}人已读</el-button>
                  </div>
                  <div v-show="!!item.user_name">
                    <span>{{item.user_name}}</span>
                  </div>
                  <div v-show="!!item.type_name">
                    <span>{{item.type_name}}</span>
                  </div>                            
                  <div v-show="!!item.send_time">
                    <span>{{item.send_time}}</span>
                  </div>
                </div>
                <el-dropdown @command="handleCommand">
                  <span class="el-dropdown-link">
                    <i style="font-size: 16px" class="el-icon-more"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="beforeHandleCommand(item, 1)" icon="el-icon-edit" :disabled="!($isPowerShow('edit'))">编辑</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown @command="handleCommand" v-if="curSelectType==='my'">
                  <span class="el-dropdown-link">
                    <i style="font-size: 16px" class="el-icon-more"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="beforeHandleCommand(item, 1)" icon="el-icon-edit" :disabled="item.state != -1 && item.state != 3 && $isPowerShow('edit')">编辑</el-dropdown-item>
                    <el-dropdown-item :command="beforeHandleCommand(item, 2)" icon="el-icon-delete" :disabled="item.state != -1 && item.state != 3 && $isPowerShow('del')">删除</el-dropdown-item>
                    <el-dropdown-item :command="beforeHandleCommand(item, 3)" :disabled="item.state != 2 && item.state != 1 && $isPowerShow('cancel')">取消发布</el-dropdown-item>
                    <el-dropdown-item :command="beforeHandleCommand(item, 4)" :disabled="!item.top && $isPowerShow('top')">取消置顶</el-dropdown-item>
                    <el-dropdown-item :command="beforeHandleCommand(item, 5)" :disabled="!item.home_page && $isPowerShow('slide')">取消轮播图</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div> -->
          </li>
        </ul>
      </div>
      <div class=" content-empty" v-else :style="{'height': contentHigh + 'px'}">
        <el-empty :image="require('@/assets/home-image/placeholder-1.png')">
          <span slot="description">暂无数据</span>
        </el-empty>
      </div>
      <el-pagination
        style="margin: 5px 0;display:flex; justify-content: flex-end;"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        ref="paginationH"
        :current-page="pageInfo.pageIndex"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        :page-size="pageInfo.pageSize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="pageInfo.pageCount"
      >
      </el-pagination>
    </div>

    <add-news ref="addInfoNews" @save-add-edit="saveAddInfo" :dialogBool.sync="isShowAddNews" :curSelectedType="addCurSelectedType"></add-news>
    <read-dialog :dialogBool.sync="isShowReadDialog" :readData="readUsers" :unReadData="unreadUsers"></read-dialog>
    <new-dialog ref="newInfoDialog" :isAudit="false" :dialogBool.sync="isShowNewDialog"></new-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { getUser, getSession } from '@/utils/auth'
import subReq from "./sub-req";
import addNews from "./add-news";
import readDialog from "./read-dialog";
import newDialog from "./new-dialog";
import bgImg from "@/assets/notice-image/bj.png"
export default {
  name: "dataList",
  components: {subReq,addNews,readDialog,newDialog},
  data() {
    return {
      token: getSession(),
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      form: {},
      data: [],
      loading: false,
      contentHigh: 300,
      isShowAddNews: false,
      bgImg: bgImg,
      readUsers: [],
      unreadUsers: [],
      isShowReadDialog: false,
      addCurSelectedType: 'add',
      isShowNewDialog: false
    }
  },
  props: {
    curSelectType: String
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead()
    })
  },
  methods: {
    onSubmit(form) {
      this.form = form
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData()
    },
    // 数据请求
    loadData() {
      this.loading = true;
      let params = {context: {}} 
      params.context = Object.assign({}, this.form);
      params.context.page_index = this.pageInfo.pageIndex;
      params.context.page_size = this.pageInfo.pageSize;
      let userInfo = JSON.parse(getUser());
      if(this.curSelectType == 'my') params.context.user_id = Number(userInfo.user_id)
      if(this.curSelectType == 'home') params.context.state = 2
      this.$client.GetErpNewManageHomePageSimple(params)
        .then(res => {
          this.loading = false; 
          if (res.head.result == "200") {
            this.data = res.context.list ? res.context.list : []
            this.pageInfo.pageCount = res.context.total
            if(this.curSelectType == 'my') this.$emit('set-num', res.context.total)
          } else {
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
    // 已读未读详情
    openReadDialog(item) {
      this.readUsers = JSON.parse(JSON.stringify(item.read_users))
      this.unreadUsers = JSON.parse(JSON.stringify(item.unread_users))
      this.isShowReadDialog = true
    },
    // 双击每一条新闻
    openItemNews(row) {
      let url = newHttpConfig.previewFile + '/new.html' + `?&token=${this.token}&id=${row.id}&type=new`
      window.open(url, '_blank')
      if (row.is_read == 0) {
        this.setNewsRead(row.id)
      }
      return
      let params = { id: row.id }
      this.$client.GetErpNewManage(params)
        .then(res => {
          if (res.head.result == '200') {
            if (!!res.context) {
              let info = res.context
              this.$refs.newInfoDialog.setData(info)
              this.isShowNewDialog = true
              if (info.is_read == 0) {
                this.setNewsRead(info.id)
              }
            }
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: 'error'
            })
          }
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: 'error'
          })
        })
    },
    // 新闻已读
    setNewsRead(id) {
      let params = {context: {}}
      params.context.id = id
      let userInfo = JSON.parse(getUser());
      params.context.user_id = Number(userInfo.user_id)
      this.$client.AddNewReadErpNewManage(params)
        .then((res) => {
          this.isShowAddNews = false;
          if (res.head.result == "200") {
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
            }
          })
    },
    handleCommand(val) {
      switch (val.command) {
        case 1:
          // this.isShowAddNews = true
          // this.addCurSelectedType = 'edit'
          // delete val.command
          // this.$refs.addInfoNews.setData(val)
          this.editNewInfo(val)
          break;
        case 2:
          this.delRowNewInfo(val.id)
          break;
        case 3:
          val.state = -1
          delete val.command
          this.saveAddInfo(val)
          break;
        case 4:
          val.top = 0
          delete val.command
          this.saveAddInfo(val)
          break;
        case 5:
          val.home_page = 0
          delete val.command
          this.saveAddInfo(val)
          break;
        default:
          break;
      }
    },
    editNewInfo(val) {
      let params = { id: val.id }
      this.$client.GetErpNewManage(params)
        .then(res => {
          if (res.head.result == '200') {
            if (!!res.context) {
              this.isShowAddNews = true
              this.addCurSelectedType = 'edit'
              let info = res.context
              this.$refs.addInfoNews.setData(info)
            }
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: 'error'
            })
          }
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: 'error'
          })
        })
    },
    openAddInfo() {
      this.isShowAddNews = true
      this.addCurSelectedType = 'add'
    },
    // 保存新闻
    saveAddInfo(form) {
      let params = {context: {}}
      params.context = form
      this.$client.AddErpNewManage(params)
        .then((res) => {
          this.isShowAddNews = false;
          if (res.head.result == "200") {
            this.$emit('on-update')
            this.loadData();
            this.$message({
              showClose: true,
              message: '保存成功',
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
            }
          })
    },
    // 删除新闻
    delRowNewInfo(id) {
      let params = {context: {}}
      params.context = id
      this.$client.DelErpNewManage(params)
        .then((res) => {
          this.isShowAddNews = false;
          if (res.head.result == "200") {
            this.$emit('on-update')
            this.loadData();
            this.$message({
              showClose: true,
              message: '删除成功',
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
            }
          })
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx
      this.loadData()
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    beforeHandleCommand(item, type) {
      let info = Object.assign({}, item)
      info.command = type
      return info
    },
    // 计算表格高度
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let head = this.$refs.head.$el.offsetHeight
        let th = this.$refs.paginationH.$el.offsetHeight
        this.contentHigh = maxh - th - head - 35
      }, 60)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dataList{
  width: 100%;
  height: 100%;
  .content-empty {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .content-box {
    width: 100%;
    .content-head {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      padding-left: 10px;
      line-height: 30px;
      color: #999;
      .head-left {
        max-width: calc(100% - 460px);
      }
      .head-right {
        display: flex;
        justify-content: space-around;
        div {
          width: 120px;
          text-align: center;
          
        }
      }
    }
    ul {
      overflow-y: auto;
      .content-item {
        display: flex;
        justify-content: space-between;
        padding: 15px 0 5px 0;
        border-bottom: 1px solid #ddd;
        font-size: 14px;
        &:hover{
          cursor: pointer;
          background-color: #F2F6FC;;
          // transform: scale(1.01);
        }
        .content-left {
          display: flex;
          max-width: calc(100% - 460px);
          font-weight: 600;
          color: #333;
          text-align: center;
          p {
            flex:  1;
            white-space:nowrap;/* 规定文本是否折行 */
            overflow: hidden;/* 规定超出内容宽度的元素隐藏 */
            text-overflow: ellipsis;
          }
          .icon {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #f56c6c;
            margin: 4px;
          }
          .is_read {
            display: none;
          }
        }
        .content-right {
          display: flex;
          justify-content: space-evenly;
          div {
            width: 120px;
            text-align: center;
          }
        }
      }
    }
    // ul {
    //   background: #f1f0ed;
    //   // padding: 10px 20%;
    //   overflow-y: auto;
    //   box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.1);
    //   .content-item {
    //     background: #ffffff;
    //     box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    //     padding: 10px;
    //     border-radius: 6px;
    //     margin-bottom: 10px;
    //     width: 100%;
    //     display: flex;
    //     // justify-content: space-between;
    //     &:hover{
    //       cursor: pointer;
    //       background-color: #F2F6FC;;
    //       // transform: scale(1.01);
    //     }
    //     .content-left {
    //       width: 21%;
    //       flex-shrink:0;
    //       display: flex;
    //       align-items: center;
    //       margin-right: 37px;
    //       .el-image {
    //         width:280px;
    //         height: 110px;
    //         border-radius: 6px;
    //         // line-height: 0;
    //       }
    //     }
    //     .content-right {
    //       width: 69%;
    //       .content-title {
    //         display: flex;
    //         align-items: center;
    //         margin-bottom: 10px;
    //         white-space:nowrap;/* 规定文本是否折行 */
    //         overflow: hidden;/* 规定超出内容宽度的元素隐藏 */
    //         text-overflow: ellipsis;
    //         p {
    //           font-size: 20px;
    //           font-weight: 600;
    //           margin-right: 10px;
    //         }
    //         .el-tag {
    //           margin-right: 10px;
    //         }
    //       }
    //       .content-right-text {
    //         height: 50px;
    //         width: 100%;
    //         overflow: hidden;
    //         font-size: 16px !important;
    //         line-height: 28px !important;
    //         white-space: wrap !important;
    //         color: #3e3e3e !important;
    //         text-decoration: none !important;
    //         letter-spacing: 1.5px !important;
    //         font-family: Arial, Helvetica, sans-serif  !important;
    //         text-overflow: ellipsis;
    //         display: -webkit-box;
    //         -webkit-line-clamp: 2;/*省略几行写几*/
    //         -webkit-box-orient: vertical;
    //         /deep/ img {
    //           // max-width: 100%;
    //           // object-fit: fill;
    //           display: none;
    //         }
    //         /deep/ p {
    //           font-size: 16px !important;
    //           line-height: 28px !important;
    //           white-space: wrap !important;
    //           color: #3e3e3e !important;
    //           text-decoration: none !important;
    //           letter-spacing: 1.5px !important;
    //           font-family: Arial, Helvetica, sans-serif  !important;
    //         }
    //         /deep/ span {
    //           font-size: 16px !important;
    //           line-height: 28px !important;
    //           white-space: wrap !important;
    //           color: #3e3e3e !important;
    //           text-decoration: none !important;
    //           letter-spacing: 1.5px !important;
    //           font-family: Arial, Helvetica, sans-serif  !important;
    //         }
    //         /deep/ p > span {
    //           font-size: 16px !important;
    //           line-height: 28px !important;
    //           white-space: wrap !important;
    //           color: #3e3e3e !important;
    //           text-decoration: none !important;
    //           letter-spacing: 1.5px !important;
    //           font-family: Arial, Helvetica, sans-serif  !important;
    //         }
    //       }
    //       .content-right-text > p {
    //         margin: 0px !important;
    //       }
    //       .content-right-bottom {
    //         margin-top: 10px;
    //         display: flex;
    //         white-space:nowrap;/* 规定文本是否折行 */
    //         overflow: hidden;/* 规定超出内容宽度的元素隐藏 */
    //         text-overflow: ellipsis;
    //         .left-list {
    //           display: flex;
    //           margin-right: 40px;
    //           div {
    //             border-right: 2px solid #999999;
    //             padding: 0 20px;
    //             span {
    //               white-space:nowrap;/* 规定文本是否折行 */
    //               overflow: hidden;/* 规定超出内容宽度的元素隐藏 */
    //               text-overflow: ellipsis;
    //               font-size: 14px;
    //               font-weight: 400;
    //               color: #999999;
    //             }
    //           }
    //           div:first-child {
    //             padding-left: 0;
    //             .el-button {
    //               padding: 0;
    //             }
    //           }
    //           div:nth-child(-2) {
    //             border: none;
    //           }
    //           div:last-of-type {
    //             border: none;
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
  }
}
</style>

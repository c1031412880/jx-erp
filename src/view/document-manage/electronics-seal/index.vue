<template>
  <div class="electronics-seal">
    <sub-req ref="head" @on-ok="loadData()" @on-add="infoDialogShow = true" @on-set="dataSet" @on-del="dataDel"></sub-req>
    <div class="seal-content" v-loading="loading">
      <el-empty v-if="!data.length" description="暂无数据"></el-empty>
      <el-row :gutter="10">
        <el-col class="seal-item" :span="4" v-for="(item,i) in data" :key="i">
            <el-card :body-style="{ padding: '0px' }">
              <el-image
                style="width: 100%; height: 200px;background: #2b2b2b"
                :src="item.url"
                fit="contain"
                :preview-src-list="piclist"></el-image>
              <div style="padding: 14px;">
                <el-tooltip class="item" effect="dark" :content="item.name" placement="top-start" :popper-options="{ boundariesElement: 'viewport', removeOnDestroy: true }">
                  <el-checkbox v-model="item.checked">
                      <p style="font-size: 16px;color: #2b2b2b;height: 16px;">{{item.name}}</p>
                  </el-checkbox>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="item.describe" placement="top-start" :popper-options="{ boundariesElement: 'viewport', removeOnDestroy: true }">
                  <p style="font-size: 13px;color: #999;margin-top: 13px;height: 14px;overflow: hidden">{{item.describe}}</p>
                </el-tooltip>
                
                <el-tooltip class="item" effect="dark" :content="item.created_date" placement="top-start" :popper-options="{ boundariesElement: 'viewport', removeOnDestroy: true }">
                  <p style="font-size: 13px;color: #999;margin-top: 13px;height: 14px;overflow: hidden">{{item.created_date}}</p>
                </el-tooltip>
              </div>
            </el-card>
        </el-col>
      </el-row>
    </div>
    <info-dialog ref="infoDialog" :dialogBool.sync="infoDialogShow" @on-ok="infoDialogOk"></info-dialog>
  </div>
</template>

<script>
import subReq from './component/sub-req'
import infoDialog from './component/info-dialog'
export default {
  name: "electronics-seal",
  components: {subReq, infoDialog},
  data() {
    return {
      piclist:[],
      data: [],
      infoDialogShow: false,
      loading: false,
      activeId: -1
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.loadData()
    })
  },
  methods: {
    dataDel() {
      let selectValue = this.getData()
      if (!selectValue.length) {
        this.$message({message: '请选择需要操作的数据项', type: 'warning'});
        return false
      }
      let ids = []
      selectValue.forEach(item => {
        ids.push(item.id)
      })
      this.$confirm('此操作将永久删除该选项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$client.DocumentSealDelete({context: ids}).then(req => {
          this.infoDialogShow = false
          this.loadData()
          if (req.head.result === '200') {
            this.$message({
              message: req.head.describle,
              type: 'success'
            });
          } else {
            this.$message.error(req.head.describle);
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 编辑初始化
    dataSet() {
      let selectValue = this.getData()
      if (!selectValue.length) {
        this.$message({message: '请选择需要操作的数据项', type: 'warning'});
        return false
      }
      if (selectValue.length > 1) {
        this.$message({message: '请选择一个操作的数据项', type: 'warning'});
        return false
      }
      this.$refs.infoDialog.setData(selectValue[0])
      this.infoDialogShow = true
    },
    // 获取选中数据
    getData() {
      let selectValue = []
      this.data.forEach(item => {
        if (item.checked) {
          selectValue.push(item)
        }
      })
      return selectValue
    },
    loadData() {
      this.loading = true
      this.$client.DocumentSealGetAll({}).then(req => {
        this.loading = false
        console.log(req)
        if (req.head.result === '200') {
          let data = req.context
          data.map(item => {
            item.checked = false
          })
          this.data = data
          this.piclist = data.map(data => data.url);
        } else {
          this.data = []
        }
      })
    },
    // 印章提交
    infoDialogOk(form) {
      if (form.id) {
        if(form.name !=''){
        this.$client.DocumentSealUpdate({context: form}).then(req => {
          this.infoDialogShow = false
          this.loadData()
          if (req.head.result === '200') {
            this.$message({
              message: req.head.describle,
              type: 'success'
            });
          } else {
            this.$message.error(req.head.describle);
          }
        })
         }else{this.$message.error('请填写印章名称');}
      } else {
         if(form.name !=''){
        this.$client.DocumentSealAdd({context: form}).then(req => {
          this.infoDialogShow = false
          this.loadData()
          if (req.head.result === '200') {
            this.$message({
              message: req.head.describle,
              type: 'success'
            });
          } else {
            this.$message.error(req.head.describle);
          }
        })
      }else{this.$message.error('请填写印章名称');}
      }
    },

  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.electronics-seal{
  width 100%
  height 100%
  .seal-content{
    width 100%
    height calc(100% - 47px)
    overflow-y auto
    overflow-x hidden
    border-radius 4px
    border 1px solid #EBEEF5
    .seal-item{
      margin-bottom 10px
      /deep/ .el-checkbox {
        width 100%
        overflow-x hidden
      }
    }
  }
}
</style>

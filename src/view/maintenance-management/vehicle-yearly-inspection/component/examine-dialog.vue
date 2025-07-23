<template>
  <el-dialog
    :visible="dialogBool"
    title="年检信息详情"
    :before-close="dialogClose"
    width="760px"
    
  >
    <div class="el-dialog-div">
      <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane name="车检信息" label="车检信息">
          <div style="width: 720px;height: 550px;overflow: auto">
            <div style="margin-top: 20px;margin-bottom: 10px;border-left: 3px solid #409EFF;">
              <span style="font-size: 16px;color: #303133;margin-left: 5px;">车辆信息</span>
            </div>
            <el-table
              :data="vehicle_list"
              style="width: 100%">
              <el-table-column
                prop="v_num"
                label="自编号"
                width="180">
              </el-table-column>
              <el-table-column
                prop="lp_num"
                label="车牌号"
                width="180">
              </el-table-column>
              <el-table-column
                prop="name"
                label="车辆型号">
              </el-table-column>
            </el-table>
            <div style="margin-top: 20px;margin-bottom: 10px;border-left: 3px solid #409EFF;">
              <span style="font-size: 16px;color: #303133;margin-left: 5px;">本次年检信息</span>
            </div>
            <el-form label-width="120px">
              <el-form-item label="本次年检日期">
                <span style="font-size: 16px;color: #409EFF;font-weight: 600">{{current_date}}</span>
              </el-form-item>
              <el-form-item label="本次年检有效期">
                <span style="font-size: 16px;font-weight: 600">{{check_endate}}</span>
              </el-form-item>
              <el-form-item label="相关图片">
                <div>
                  <el-image
                    v-for="(src,i) in images"
                    :key="i"
                    style="width: 100px; height: 100px;float: left;"
                    :src="src"
                    fit="contain"
                    :preview-src-list="images"></el-image>
                  <div style="width: 200px;" v-if="!images.length">
                    <el-empty :image-size="80" description="未上传图片"></el-empty>
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
<!--        <el-tab-pane name="审核" label="审核">-->
<!--          <div style="width: 740px;height: 550px;overflow: auto">-->
<!--            <div style="margin-top: 20px;margin-bottom: 10px;border-left: 3px solid #409EFF;">-->
<!--              <span style="font-size: 16px;color: #303133;margin-left: 5px;">审核意见</span>-->
<!--            </div>-->
<!--            <el-form label-width="120px">-->
<!--              <el-form-item label="审核结果">-->
<!--                <el-radio-group v-model="form.result">-->
<!--                  <el-radio :label="3">同意</el-radio>-->
<!--                  <el-radio :label="4">拒绝</el-radio>-->
<!--                </el-radio-group>-->
<!--              </el-form-item>-->
<!--              <el-alert-->
<!--                title="说明"-->
<!--                type="info"-->
<!--                :closable="false"-->
<!--                description="审核通过后 车辆年检日期将自动更新"-->
<!--                show-icon>-->
<!--              </el-alert>-->
<!--              <el-form-item label="审核备注">-->
<!--                <el-input type="textarea" v-model="form.remark" placeholder="请输入审核意见"></el-input>-->
<!--              </el-form-item>-->
<!--            </el-form>-->
<!--            <div style="margin-top: 20px;margin-bottom: 10px;border-left: 3px solid #409EFF;">-->
<!--              <span style="font-size: 16px;color: #303133;margin-left: 5px;">审核进度</span>-->
<!--            </div>-->
<!--            <approve-schedule v-if="dialogBool" :plan_id="form.main_id"></approve-schedule>-->
<!--          </div>-->
<!--        </el-tab-pane>-->
      </el-tabs>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">关  闭</el-button>
<!--      <el-button type="primary" @click="ok">确 定</el-button>-->
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
  import {getUser} from '@/utils/auth'
  import approveSchedule from 'components/approve-echo/approve-schedule'
  export default {
    props: {
      dialogBool: Boolean,
    },
    components: {approveSchedule},
    data() {
      return {
        form: {
          checker: '',
          main_id: '',
          result: 3,
          remark: ''
        },
        images:[],
        vehicle_list: [],
        current_date: '',
        check_endate: '',
        activeName: "车检信息",
        checkers: []
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
      ok() {
        this.form.checker = JSON.parse(getUser()).user_id
        this.$emit('on-ok', this.form)
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>

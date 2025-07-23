<template>
  <div class="page">
    <approve-step></approve-step>
    <approve-schedule></approve-schedule>
    </br>
    </br>
    </br>
    <approve-result></approve-result>
  </div>
</template>

<script>
  import approveStep  from './components/approve-step.vue'
  import approveSchedule  from './components/approve-schedule.vue'
  import approveResult  from './components/approve-result.vue'
export default {
  name: "processShow",
  data() {
    return {
     
    };
  },
 
  methods: {
    
  },
  components: {
    approveStep,
    approveSchedule,
    approveResult
  }
};
</script>
<style lang="stylus" scoped>
.page{
  width:100%;
  height: 100%;
}
</style>

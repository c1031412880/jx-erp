<template>
  <div class="new-fold" @click="$emit('click')">
    <i class="el-icon-s-operation"></i>
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.new-fold
  // color: #C61D29
  // color: #e6e4e1
  color: #bab6b1
  display: inline-block;
  width: 50px;
  height: 50px;
  text-align: center;
  cursor: pointer;
  transition: all .2s ease-in-out;
  // &:hover
  //  background #c61d29
  //  color: #C61D29
  i
    font-size 20px;
</style>

<template>
  <div class="menu-item">
    <div
      :class="['item', item.children && item.children.length ? 'has-child' : 'is-leaf']"
      :style="{ textIndent: 20 + (level - 1) * 10 + 'px', fontSize: 14 - (level - 1) * 2 + 'px' }"
      @click="$emit('item-click', item)"
    >
      {{ item.meta.title }}
    </div>
    <template v-if="item.children && item.children.length">
      <menu-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :level="level + 1"
        @item-click="data => $emit('item-click', data)"
      />
    </template>
  </div>
</template>

<script>
export default {
  name: 'MenuItem',
  components: {},
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    level: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {},
  beforeDestroy() {}
}
</script>

<style lang="scss" scoped>
.item {
  width: 100%;
  height: 25px;
  color: #373737;
  border-left: 1px solid #cbcacd;
  display: flex;
  flex-direction: column-reverse;
  position: relative;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #c61d29;
    position: absolute;
    left: -4.5px;
    bottom: 3px;
  }
}

.has-child {
  font-weight: 600;
}

.is-leaf {
  font-weight: 300;
  cursor: pointer;
  color: #000;

  &:hover {
    color: #a31e30;
  }

  &::before {
    background-color: transparent;
  }
}
</style>

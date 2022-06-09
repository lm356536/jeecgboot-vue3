<template>
  <component :is="comp" :formData="formData" ref="compModel" v-if="comp" />
</template>
<script>
  const modules = import.meta.glob('/@/views/monitor/mynews/*.vue');
  export default {
    name: 'DynamicNotice',
    props: ['path', 'formData'],
    data() {
      return {
        compName: this.path,
      };
    },
    computed: {
      comp: function () {
        if (!this.path) {
          return null;
        }
        return () => modules[`/@/views/monitor/mynews/${this.path}`];
      },
    },
    methods: {
      detail() {
        setTimeout(() => {
          if (this.path) {
            this.$refs.compModel.view(this.formData);
          }
        }, 200);
      },
    },
  };
</script>

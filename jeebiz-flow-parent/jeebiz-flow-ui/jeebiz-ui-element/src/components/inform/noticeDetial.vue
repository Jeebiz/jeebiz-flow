<template>
  <div class="content">
      
   
  </div>
</template>

<script>
 
  import API from '@/assets/js/api/all-api'
  import utils from '@/assets/js/utils'

  export default {
   
    components: {
    
    },
    created() {
      this.getItemList();
    },
    mounted(){
      var that=this;
      that.resizeTable();
      window.onresize=function () {
        that.resizeTable();
      }
    },
    data() {
      return {
       
      
      
       
        
      };
    },
    methods: {
     
      
    }
  }
</script>

<style scoped>
 
 
</style>

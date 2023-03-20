<template>
  <div class="app-container">
    <div style="margin-bottom:10px;font-weight: 100;">关于我</div>
    <el-input v-model="url" style="margin-bottom:30px" :disabled="isDisabled" placeholder="请输入内容"></el-input>
    <el-button type="primary" @click="handleEdit">{{ btnContent }}</el-button>
  </div>
</template>

<script>
import {getAbout, editAbout} from "@/api/about"
export default {
  data() {
    return {
      url: "",
      isDisabled: true,
      btnContent : '编辑'
    };
  },
  created(){
    this.fetchData()
  },
  methods:{
    fetchData(){
      getAbout().then(({data}) =>{
           this.url = data
      })
    },
    handleEdit(){
      if(this.btnContent === '编辑'){
        this.isDisabled = !this.isDisabled;
        this.btnContent = '完成'
      }else{
        if(!this.url){
          this.$message.warning('请填入内容')
        }else{
          editAbout({url:this.url}).then(()=>{
            this.btnContent = '编辑';
            this.isDisabled = !this.isDisabled
            this.$message.success('修改成功')
          })
        }
      }
    }
  }
}
</script>

<style>

</style>

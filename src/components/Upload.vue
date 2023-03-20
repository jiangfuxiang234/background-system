<template>
  <div>
    <!-- 上传组件标题 -->
    <div class="block">{{ uploadTitle }}</div>
    <!-- 上传控件 -->
    <!-- action是传向后端的地址 -->
    <el-upload
      class="avatar-uploader"
      action="/api/upload"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"  
      :headers="headers"
    >
    <!-- 传入了图片地址value则该控件就显示图片，没传就显示+号图标 -->
      <img v-if="value" :src="imageUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
import { server_URL } from '@/urlConfig';
export default {
    props: ["uploadTitle", "value"],
    computed:{
        imageUrl(){        // 这里还要对图片路径进行处理的原因是：在父组件处理的图片路径是已有的图片路径，
           if(this.value){ // 而当你新修改上传时，新上传的图片路径是没有处理的, 所以父组件传图片路径value参数时，
            return this.value // 要传bigImg而不是bigImg2, 因为后续上传图片时还要处理
           }
        },
        headers(){
          // 因为这里不是通过axios发送请求，不会在请求拦截里带上token，所以还要在这里自行带上token
        return {
            Authorization : 'Bearer ' + localStorage.getItem('adminToken'), // 从本地获取 token，添加到 header 里面
        }
    }
    },
    methods:{
        handleAvatarSuccess(res){
            if(!res.code && res.data){
              // 说明上传成功，服务器给我们返回了图片上传后的服务器地址
                this.$emit('input', res.data)
            }
        }
    }
    
}
</script>

<style lang="scss" scoped>
.block {
  margin: 15px 0;
  font-weight: 100;
}
.avatar-uploader .el-upload {
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
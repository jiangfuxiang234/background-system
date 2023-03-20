<template>
  <div class="app-container">
    <div class="block">网站信息</div>

    <div class="block2">网站标题</div>
    <div style="width:500px">
      <el-input v-model="form.siteTitle" disabled></el-input>
    </div>


    <div class="block2">邮箱</div>
    <div style="width:500px">
      <el-input v-model="form.mail" disabled></el-input>
    </div>


    <div class="block2">备案号</div>
    <div style="width:500px">
      <el-input v-model="form.icp" disabled></el-input>
    </div>
    <el-divider></el-divider>
    <div class="block">网站头像信息</div>
    <div>
      <el-image :src="form.avatar" style="width:100px">
      </el-image>
    </div>
    <el-divider></el-divider>
    <div class="block">网址图标信息</div>

    <div class="block2">网址图标地址</div>
    <div style="width:500px">
      <el-input v-model="form.favicon" disabled></el-input>
    </div>
    <div class="block2">网址图标预览</div>
    <div>
      <el-image :src="form.favicon" style="width:50px">
      </el-image>
    </div>
    <el-divider></el-divider>
    <div class="block">github信息</div>

    <div class="block2">github名字</div>
    <div style="width:500px">
      <el-input v-model="form.githubName" disabled></el-input>
    </div>

    <div class="block2">github地址</div>
    <div style="width:500px">
      <el-input v-model="form.github" disabled></el-input>
    </div>
    <el-divider></el-divider>
    <div class="block">QQ信息</div>

    <div class="block2">QQ号码</div>
    <div style="width:500px">
      <el-input v-model="form.qq" disabled></el-input>
    </div>
    <div class="block2">QQ二维码图片预览</div>
    <div>
      <el-image :src="form.qqQrCode" style="width:100px">
      </el-image>
    </div>
    <el-divider></el-divider>
    <div class="block">微信信息</div>

    <div class="block2">微信号码</div>
    <div style="width:500px">
      <el-input v-model="form.weixin" disabled></el-input>
    </div>
    <div class="block2">微信二维码图片预览</div>
    <div>
      <el-image :src="form.weixinQrCode" style="width:100px">
      </el-image>
    </div>
    <el-divider></el-divider>
    <el-button type="primary" @click="handleEdit">进入编辑模式</el-button>

    <el-dialog title="请编辑信息" :fullscreen="true" :visible.sync="dialogFormVisible">
      <el-form :model="form2">
        <el-form-item label="网站标题">
          <el-input v-model="form2.siteTitle"></el-input>
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input v-model="form2.mail"></el-input>
        </el-form-item>

        <el-form-item label="备案号">
          <el-input v-model="form2.icp"></el-input>
        </el-form-item>

        <div style="margin-bottom:30px">
          <Upload uploadTitle="网站头像地址" v-model="form2.avatar"></Upload>
        </div>
        
        <el-form-item label="网站图标地址">
          <el-input v-model="form2.favicon"></el-input>
        </el-form-item>

        <el-form-item label="github名字">
          <el-input v-model="form2.githubName"></el-input>
        </el-form-item>

        <el-form-item label="github地址">
          <el-input v-model="form2.github"></el-input>
        </el-form-item>

        <el-form-item label="QQ号码">
          <el-input v-model="form2.qq"></el-input>
        </el-form-item>

        <div style="margin-bottom:30px">
          <Upload uploadTitle="QQ二维码图片地址" v-model="form2.qqQrCode"></Upload>
        </div>

        <el-form-item label="微信号">
          <el-input v-model="form2.weixin"></el-input>
        </el-form-item>

        <div style="margin-bottom:30px">
          <Upload uploadTitle="微信二维码图片地址" v-model="form2.weixinQrCode"></Upload>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditProjectHandle">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSetting, setSetting } from "@/api/setting"
import { server_URL } from "@/urlConfig"
import Upload from "@/components/Upload.vue"
export default {
  data() {
    return {
      form: {
        avatar: "",
        favicon: "",
        github: "",
        githubName: "",
        icp: "",
        id: "",
        mail: "",
        qq: "",
        qqQrCode: "",
        siteTitle: "",
        weixin: "",
        weixinQrCode: "",
      },
      form2: {
        avatar: "",
        favicon: "",
        github: "",
        githubName: "",
        icp: "",
        id: "",
        mail: "",
        qq: "",
        qqQrCode: "",
        siteTitle: "",
        weixin: "",
        weixinQrCode: "",
      },
      dialogFormVisible:false
    }
  },
  created() {
    this.fetchData()
  },
  components:{
    Upload
  },
  methods: {
    fetchData() {
      getSetting().then(({ data }) => {
        console.log(data);
        this.form = data;
        // this.form.avatar2 = server_URL + this.form.avatar;
        // this.form.qqQrCode2 = server_URL + this.form.qqQrCode
        // this.form.weixinQrCode2 = server_URL + this.form.weixinQrCode
      })
    },
    handleEdit(){
      this.dialogFormVisible = true;
      this.form2 = {...this.form}
    },
    confirmEditProjectHandle(){
      setSetting(this.form2).then(()=>{
        this.$message.success('修改成功');
        this.fetchData()
        this.dialogFormVisible = false
      })
    }
  }
}
</script>

<style>
.block {
  margin: 15px 0;
  font-size: 20px;
  font-weight: 100;
}

.block2 {
  margin: 15px 0;
  font-size: 14px;
  font-weight: 100;
}
</style>

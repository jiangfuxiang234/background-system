<template>
    <div class="app-container">
        <el-form :model="adminInfo" :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item label="用户名" prop="name">
                <el-input v-model="adminInfo.name"></el-input>
            </el-form-item>

            <el-form-item label="旧密码" prop="oldLoginPwd">
                <el-input type="password" v-model="adminInfo.oldLoginPwd"></el-input>
            </el-form-item>

            <el-form-item label="新密码" prop="loginPwd">
                <el-input type="password" v-model="adminInfo.loginPwd"></el-input>
            </el-form-item>

            <el-form-item label="新密码确认" prop="loginPwdConfirm">
                <el-input type="password" v-model="adminInfo.loginPwdConfirm"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="handleClick">修改</el-button>
                <el-button type="danger" @click="handleBack">返回</el-button>
            </el-form-item>
        </el-form>

    </div>
</template>

<script>
import { getInfo, setUser } from "@/api/user"
export default {
    data() {
        const validateConfirmNewPassword = (rule, value, callback) => {
            if(value!==this.adminInfo.loginPwd){
                callback(new Error('两次输入密码不一致'))
            }else{
                callback()
            }
        }
        return {
            adminInfo: {
        id: "",
        loginId: "", // loginId
        name: "", // 用户名
        oldLoginPwd: "", // 旧密码
        loginPwd: "", // 新密码
        loginPwdConfirm: "", // 密码确认
      },
            rules: { // rules里面的每个规则名一定要和adminInfo里面的数据名要一一对应一样，不然规则无法判断对应输入框是否有输入数据
                name: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
                oldLoginPwd: [{ required: true, trigger: 'blur', message: '请输入旧密码' }],
                loginPwd: [{ required: true, trigger: 'blur', message: '请输入新密码' }],
                loginPwdConfirm: [
                    { required: true, trigger: 'blur', message: '请确认新密码' },
                    { validator: validateConfirmNewPassword, trigger: 'blur' }]
            }
        }
    },
    created() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            getInfo().then(({ data }) => {
                console.log(data);
                this.adminInfo = data
            })
        },
        handleClick() {
            if(this.adminInfo.name && this.adminInfo.oldLoginPwd && this.adminInfo.loginPwd && this.adminInfo.loginPwdConfirm){
               setUser(this.adminInfo).then((res)=>{
                if(typeof res === 'string'){
                    const resp = JSON.parse(res);
                    this.$message.error(resp.msg)
                }else{
                    this.$message.success("管理员信息修改成功");
                    this.$store.dispatch('user/logout').then(()=>{
                        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
                    })
                }
               })
            }else{
                this.$message.error('请填写所有信息！')
            }
        },
        handleBack() {
              this.$router.push('/')
        }
    }
}
</script>

<style>
.app-container {
    width: 500px
}
</style>
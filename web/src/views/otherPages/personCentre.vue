<template>
    <div class="person-centre">
        <!-- 页头 -->
        <div class="header">
            <div class="content">
                <md-header></md-header>
            </div>
        </div>
        <div class="main">
            <div class="main-box">
                <div class="content">
                    <div class="title">
                        <p>个人中心</p>
                    </div>
                    <div class="form">
                        <div class="item">
                            <div class="name">
                                <span>用</span>
                                <span>户</span>
                                <span>名：</span>
                            </div>
                            <div class="input">
                                <el-input v-model="userInfo.username" placeholder="请输入用户名" :disabled="true"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="name">
                                <span>头</span>
                                <span>像：</span>
                            </div>
                            <div class="input">
                                <el-upload
                                    class="avatar-uploader"
                                    action=""
                                    :show-file-list="false"
                                    :http-request="handleUploadImg">
                                    <img v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </div>
                        </div>
                        <div class="item">
                            <div class="name">
                                <span>性</span>
                                <span>别：</span>
                            </div>
                            <div class="input">
                                <el-radio v-model="userInfo.sex" :label="1">女</el-radio>
                                <el-radio v-model="userInfo.sex" :label="2">男</el-radio>
                            </div>
                        </div>
                        <div class="item">
                            <div class="name">
                                <span>技</span>
                                <span>能：</span>
                            </div>
                            <div class="input">
                                <el-select v-model="userInfo.ability" multiple placeholder="请选择技能">
                                    <el-option
                                    v-for="item in abilityList"
                                    :key="item._id"
                                    :label="item.category"
                                    :value="item._id">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="item">
                            <div class="name">
                                <span>出</span>
                                <span>生</span>
                                <span>日</span>
                                <span>期：</span>
                            </div>
                            <div class="input">
                                <el-date-picker
                                v-model="userInfo.birthday"
                                type="date"
                                placeholder="选择出生日期">
                                </el-date-picker>
                            </div>
                        </div>
                        <div class="item">
                            <div class="name">
                                <span>地</span>
                                <span>址：</span>
                            </div>
                            <div class="input">
                                <md-addressPicker :defalutAddress="userInfo.address" @change="getAddress"></md-addressPicker>
                            </div>
                        </div>
                        <div class="item">
                            <div class="name">
                                <span>联</span>
                                <span>系</span>
                                <span>电</span>
                                <span>话：</span>
                            </div>
                            <div class="input">
                                <el-input v-model="userInfo.tel" placeholder="请输入联系电话"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="name">
                                <span>邮</span>
                                <span>箱：</span>
                            </div>
                            <div class="input">
                                <el-input v-model="userInfo.email" placeholder="请输入邮箱"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="btn" @click="save">保存</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
         <!-- 页脚 -->
        <div class="footer">
            <md-footer></md-footer>
        </div>
    </div>
</template>

<script>
import areaData from '@/public/js/areaData.js'
import {mapState, mapMutations, mapActions} from 'vuex'
export default {
    data(){
        return{
        }
    },
    created(){
        window.scroll(0,0)
        this.getCategoryList()
        this.getUserInfo({userId:this.$cookie.get('userID')})
    },
    computed:{
        ...mapState('category', ['abilityList']),
        ...mapState('user', ['userInfo']),
    },
    methods:{
        ...mapActions('category', ['getCategoryList']),
        ...mapActions('user', ['getUserInfo','updateUserInfo']),
        ...mapMutations('user', ['editUserInfo']),
        async handleUploadImg(e) {
            let file = e.file
            console.log(file)
            let formData = new FormData();
            formData.append("file", file)
            let res = await this.$http.post('/uploadImage', formData)
            console.log(res.data.url)
            this.userInfo.avatar = res.data.url
        },
        getAddress(e){
            this.userInfo.address = e
        },
        save(){
            if(this.userInfo.username == "") return this.$message.error("用户名不能为空")
            let reg = /^[1][3,4,5,7,8][0-9]{9}$/
            if(this.userInfo.tel && this.userInfo.tel != "" && !reg.test(this.userInfo.tel)) return this.$message.error("电话号码填写不正确")
            let reg2 = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
            if(this.userInfo.email && this.userInfo.email !="" && !reg2.test(this.userInfo.email)) return this.$message.error("邮箱填写不正确")
            this.updateUserInfo().then(() => {
                this.getUserInfo({userId:this.$cookie.get('userID')})
            })
        }
    }
}
</script>

<style lang="less" scoped>
    .person-centre{
        background: #f0f0f0;
        .header{
            width: 100%;
            height: 60px;
            background: #fff;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 3;
            box-shadow: 0 0 5px #ccc;
            display: flex;
            justify-content: center;
            .content{
                width: 1200px;
            }
        }
        .main{
            width: 1200px;
            margin: 0px auto 15px;
            padding-top: 60px;
            .main-box{
                width: 100%;
                background: #fff;
                border-radius: 5px;
                margin-top: 15px;
                min-height: 100vh;
            }
            .content{
                width: 500px;
                margin: 0 auto;
                padding-top: 15px;
                box-sizing: border-box;
            }
            .title{
                font-size: 24px;
                color: #666;
                text-align: center;
                padding: 15px 0;
            }
            .form{
                margin-top: 15px;
                .item{
                    display: flex;
                    margin-bottom: 15px;
                    width: 100%;
                    // height: 40px;
                    .name{
                        width: 80px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 14px;
                        color: #666;
                        cursor: default;
                    }
                    .input{
                        flex: 1;
                        display: flex;
                        align-items: center;
                    }
                    .btn{
                        background: #f10215;
                        font-size: 16px;
                        color: #fff;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 50%;
                        height: 45px;
                        border-radius: 5px;
                        letter-spacing: 5px;
                        cursor: pointer;
                        margin: 0 auto;
                        user-select: none;
                        &:active{
                            opacity: 0.6;
                        }
                    }
                }
            }
        }
        .footer{
            width: 100%;
            height: 60px;
            background: #333;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
    // .avatar-uploader .el-upload {
    //     border: 1px dashed #d9d9d9;
    //     border-radius: 6px;
    //     cursor: pointer;
    //     position: relative;
    //     overflow: hidden;
    // }
    // .avatar-uploader .el-upload:hover {
    //     border-color: #409EFF;
    // }
    .avatar-uploader-icon {
        font-size: 24px;
        color: #999;
        width: 120px;
        height: 120px;
        line-height: 120px;
        text-align: center;
    }
    .avatar {
        width: 120px;
        height: 120px;
        display: block;
    }
</style>
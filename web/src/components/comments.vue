<template>
    <div class="comments">
        <div v-if="$cookie.get('webToken')">
            <div class="header">评论<span v-show="total">（{{total}}条）</span></div>
            <div class="send-comments">
                <div class="head">
                    <div class="left">
                        <div class="image">
                            <el-avatar :src="$cookie.get('avatar')" v-if="$cookie.get('avatar')"></el-avatar>
                            <el-avatar icon="el-icon-user-solid" v-else></el-avatar>
                        </div>
                        <div class="username">用户名：{{$cookie.get('username')}}</div>
                    </div>
                    <div>
                        <div class="btn" @click="submitComment()">发表</div>
                    </div>
                </div>
                <div class="comment-input">
                    <el-input
                    type="textarea"
                    placeholder="请输入内容"
                    :autosize="{ minRows: 4, maxRows: 10}"
                    v-model="commentVal"
                    maxlength="140"
                    show-word-limit>
                    </el-input>
                </div>
                <div class="comment-content" v-if="commentsList" v-loading="commentListLoading">
                    <div class="item" >
                        <div class="item-item"  v-for="(v,k) in commentsList" :key="k">
                            <div class="item-head">
                                <div class="username"><span>{{v.reviewerId.username}}</span>
                                    <i v-if="v.commentatorId">
                                        回复 <span>@{{v.commentatorId.username}}</span>
                                    </i>
                                    ：
                                </div>
                                
                            </div>
                            <div class="item-content" v-html="v.content"></div>
                            <div class="item-item-bottom">
                                <div class="time">
                                    <i class="el-icon-timer"></i>
                                    <span>{{v.time}}</span>
                                </div>
                                <div class="btn" @click="openCommentsBox(v.reviewerId._id)">回复</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="pages" v-if="commentsList">
                    <el-pagination
                    background
                    layout="prev, pager, next"
                    @current-change="handleCurrentChange"
                    :total="total">
                    </el-pagination>
                </div>
                <el-dialog
                title = '回复评论'
                :visible.sync="dialogVisible"
                top="25vh"
                width="40%"
                :before-close="handleClose">
                    <div class="comment-input">
                        <el-input
                        type="textarea"
                        placeholder="请输入内容"
                        :autosize="{ minRows: 4, maxRows: 10}"
                        v-model="commentVal2"
                        maxlength="140"
                        show-word-limit>
                        </el-input>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="submitComment">确 定</el-button>
                    </span>
                </el-dialog>
            </div>
        </div>
        <div v-else>
            <div class="not-login">
                <div class="text">评论</div>
                <div class="btn" @click="$router.push('/login')">您还没有登录，赶快去登录吧！</div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
export default {
    data(){
        return{
            commentVal:'',
            commentVal2:'',
            dialogVisible:false,
            commentatorId:'',
            currentPage:1,
            pageSize:10
        }
    },
    created(){
        this.getCommentList({articleId:this.$route.query.id, currentPage:this.currentPage, pageSize:this.pageSize})
    },
    computed:{
        ...mapState('category',['articleDetail']),
        ...mapState('comments',['commentsList', 'commentListLoading', 'total']),
    },
    methods:{
        ...mapActions('comments', ['addComment', 'getCommentList']),
        openCommentsBox(e) {
            this.dialogVisible = true
            this.commentatorId = e
        },
        handleCurrentChange(e){
            this.currentPage = e
            this.getCommentList({articleId:this.$route.query.id, currentPage:this.currentPage, pageSize:this.pageSize})
        },
        handleClose() {
            this.commentVal2 = ''
            this.dialogVisible = false
        },
        //发表评论
        submitComment() {
            console.log(this.commentsList)
            if(!this.$cookie.get('webToken')) return this.$message({
                type:'warning',
                message:'请登录后再评论'
            })
            let content = ""
            if(this.commentatorId){
                content = this.commentVal2
                if(this.commentVal2 == '') return this.$message({
                    type:'warning',
                    message:'请输入评论内容'
                })
            }else{
                content = this.commentVal
                if(this.commentVal == '') return this.$message({
                    type:'warning',
                    message:'请输入评论内容'
                })
            }
            this.addComment({articleId:this.$route.query.id, reviewerId:this.$cookie.get('userID'), commentatorId:this.commentatorId, content})
            if(this.commentatorId){
                this.commentVal2 = ''
            }else{
                this.commentVal = ''
            }
            this.commentatorId = ''
            this.dialogVisible = false
            this.getCommentList({articleId:this.$route.query.id, currentPage:this.currentPage, pageSize:this.pageSize})
        }
    }
}
</script>

<style lang='less' scoped>
    .comments{
        background: #fff;
        margin: 15px 0;
        border-radius: 5px;
        padding: 15px;
        .header{
            font-size: 24px;
            color: #666;
            cursor: default;
            span{
                font-size: 14px;
            }
        }
        .send-comments{
            .head{
                font-size: 30px;
                color: #333;
                display: flex;
                justify-content: space-between;
                padding: 15px 0 15px;
                .left{
                    display: flex;
                    align-items: center;
                    .image{
                        // border: 1px solid #999;
                        width: 40px;
                        height: 40px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border-radius: 5px;
                    }
                    .username{
                        font-size: 14px;
                        padding: 5px 0;
                        color: #666;
                        box-sizing: border-box;
                        padding: 0 10px;
                        cursor: default;
                    }
                }
                .btn{
                    font-size: 14px;
                    color: #666;
                    padding: 8px 29px;
                    border: 1px solid #f0f0f0;
                    border-radius: 5px;
                    text-align: center;
                    cursor: pointer;
                    user-select: none;
                    transition: all 0.3s;
                    &:hover{
                        color: #fff;
                        background: #ccc;
                    }
                }
            }
            .comment-input{
                margin-bottom: 20px;
            }
            .comment-content{
                .item{
                    margin: 10px 0;
                    padding: 10px 10px 0;
                    border: 1px solid #f0f0f0;
                    border-radius: 5px;
                    .item-item{
                        border-bottom: 1px dashed #f0f0f0;
                        padding: 10px;
                        overflow: hidden;
                        transition: all 0.3s;
                        &:last-child{
                            border-bottom:none;
                        }
                        &:hover .btn{
                            transform: translateY(0px);
                            opacity: 1;
                        }
                        .item-item-bottom{
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            .time{
                                font-size: 12px;
                                color: #999;
                                cursor: default;
                            }
                        }
                        .btn{
                            transition: all 0.3s;
                            transform: translateY(50px);
                            opacity: 0;
                            width: 70px;
                            box-sizing: border-box;
                            font-size: 14px;
                            color: #666;
                            padding: 5px 0;
                            background: #fff;
                            border: 1px solid #f0f0f0;
                            border-radius: 5px;
                            cursor: pointer;
                            user-select: none;
                            text-align: center;
                            transition: all 0.3s;
                            &:hover{
                                color: #fff;
                                background: #ccc;
                            }
                        }
                    }
                    .item-head{
                        display: flex;
                        // align-items: center;
                        font-size: 16px; 
                        color: #333;
                        .username{
                            font-size: 14px;
                            display: inline-block;
                            color: #666;
                            box-sizing: border-box;
                            cursor: default;
                            span{
                                display: inline-block;
                                color: #ff6743;
                                opacity: 0.8;
                            }
                        }
                        
                    }
                    .item-content{
                        display: inline;
                        font-size: 14px;
                        color: #666;
                        // line-height: 25px;
                        word-wrap:break-word;
                        cursor: default;
                    }
                }
            }
            .pages{
               display: flex;
               justify-content: center;
            }
        }
        .not-login{
            font-size: 24px;
            color: #666;
            .btn{
                font-size: 14px;
                padding-top: 10px;
                display: inline-block;
                cursor: pointer;
                &:hover{
                    text-decoration: underline;
                }
            }
        }
    }
</style>
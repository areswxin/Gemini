<style lang="css" scoped>
    @import "styles/bootstrap.min.css";
    @import "styles/login.css";

    .div-relative {
        position: relative;
        width: 100%;
    }

    .div-a {
        position: absolute;
        z-index: 1000;
        width: 100%;
    }

    li {
        float: left;
        list-style-type: none;
    }

    a:link {
        color: #FFFFFF;
    }

    a:visited {
        color: #FFFFFF;
    }
</style>

<template>
    <div id="band" class="div-relative ">
        <nav class="navbar  bg-primary fixed-top navbar-transparent " color-on-scroll="400">
            <div class="container">
                <div class="navbar-translate">
                    <a class="navbar-brand">
                        版本号: v2.0.0
                    </a>
                    <Button v-if="switchCode" type="default" ghost @click="register= true">创建用户</Button>
                </div>
                <div>
                    <ul>
                        <li>
                            <a class="nav-link" @click="sponsorship = true">赞助/技术协助</a>
                        </li>
                        <li>
                            <a href="https://github.com/cookieY/Yearning" target="_blank">
                                <Icon type="logo-github" size="30"/>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        <div class="page-header div-a" filter-color="orange">
            <div class="page-header-image"></div>
            <div class="container">
                <div class="content-center">
                    <div class="card">
                        <form style="width: 45%;margin-left: 25%">
                            <img src="./assets/logo.png" width="80%">
                            <div class="input-group form-group-no-border input-lg">
                                <span class="input-group-addon">
                                   <Icon type="md-person"/>
                                </span>
                                <input type="text" class="form-control" placeholder="账号" v-model="formInline.user">
                            </div>
                            <div class="input-group form-group-no-border input-lg">
                                <span class="input-group-addon">
                                  <Icon type="md-key"/>
                                </span>
                                <input type="password" placeholder="密码" class="form-control"
                                       v-model="formInline.password"
                                       @keyup.enter="authdata"/>
                            </div>
                            <div class="footer text-center">
                                <Checkbox v-model="single">LDAP登录</Checkbox>
                                <a href="#pablo" class="btn btn-primary btn-round btn-lg btn-block" @click="authdata()">登录</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <footer class="footer">
                <div class="container">
                    <nav>
                        <ul>
                            <li>
                                <Tooltip content="yearning.io" placement="top-start">
                                    <a class="nav-link" href="https://yearning.io">
                                        关于Yearning
                                    </a>
                                </Tooltip>
                            </li>
                            <li>
                                <Tooltip content="Q群:103674679" placement="top-start">
                  <span class="nav-link">
                    使用交流群
                  </span>
                                </Tooltip>
                            </li>
                            <li>
                                <a href="https://www.gnu.org/licenses/agpl-3.0.en.html" class="nav-link">
                                    开源许可:AGPL3.0
                                </a>
                            </li>
                        </ul>
                    </nav>
                    <div class="copyright">&copy; 2019 HenryYee 请使用Chrome浏览器获得最佳体验</div>
                </div>
            </footer>
        </div>

        <Modal
                v-model="register"
                @on-ok="LoginRegister"
                title="用户注册"
                ok-text="注册"
                :mask-closable="false">
            <Form ref="userinfova" :model="userinfo" :rules="userinfoValidate">

                <FormItem label="用户名:" prop="username">
                    <Input v-model="userinfo.username"></Input>
                </FormItem>

                <FormItem label="密码" prop="password">
                    <Input type="password" v-model="userinfo.password"
                           @on-keyup.enter="authdata()"></Input>
                </FormItem>

                <FormItem label="确认密码" prop="confirmpassword">
                    <Input v-model="userinfo.confirmpassword" type="password"></Input>
                </FormItem>

                <FormItem prop="realname" label="真实姓名">
                    <Input v-model="userinfo.realname"></Input>
                </FormItem>

                <FormItem prop="department" label="部门名称">
                    <Input v-model="userinfo.department"></Input>
                </FormItem>

                <FormItem prop="email" label="电子邮件">
                    <Input v-model="userinfo.email"></Input>
                </FormItem>
            </Form>
        </Modal>

        <Modal v-model="sponsorship" title="让Yearning持续提供更好的功能与服务" width="640">
            <h3> 赞助后你可以得到的</h3>
            联系作者将自己的名字添加到赞助者名单中

            对于顶级赞助商，可将公司或个人logo添加到项目首页README当中，并优先考虑对该企业或个人的需求进行开发。
            <br>
            <br>
            <h3>定制化需求</h3>
            企业可根据实际需要向Yearning作者寻求定制功能服务。
            <br>
            <br>
            <h3>联系方式</h3>
            电邮：supermancookie@outlook.com
            <br>
            QQ: 834958386
            <br>
            <img height="300" width="300" src="./assets/alipay.jpg">
            <img height="300" width="300" src="./assets/wechat.jpg">
        </Modal>

    </div>
</template>
<script>
    import axios from 'axios'
    //
    export default {
        name: 'Login',
        data() {
            const valideuserinfoPassword = (rule, value, callback) => {
                if (value !== this.userinfo.password) {
                    callback(new Error('两次输入密码不一致'))
                } else {
                    callback()
                }
            }
            return {
                single: false,
                switchCode: false,
                sponsorship: false,
                register: false,
                userinfo: {
                    username: '',
                    password: '',
                    confirmpassword: '',
                    email: '',
                    realname: '',
                    department: ''
                },
                userinfoValidate: {
                    username: [
                        {
                            required: true,
                            message: '请输入用户名',
                            trigger: 'blur'
                        }
                    ],
                    password: [
                        {
                            required: true,
                            message: '请输入密码',
                            trigger: 'blur'
                        },
                        {
                            min: 6,
                            message: '请至少输入6个字符',
                            trigger: 'blur'
                        },
                        {
                            max: 32,
                            message: '最多输入32个字符',
                            trigger: 'blur'
                        }
                    ],
                    confirmpassword: [
                        {
                            required: true,
                            message: '请再次输入新密码',
                            trigger: 'blur'
                        },
                        {
                            validator: valideuserinfoPassword,
                            trigger: 'blur'
                        }
                    ],
                    realname: [
                        {
                            required: true,
                            message: '请输入真实姓名',
                            trigger: 'blur'
                        }
                    ],
                    department: [
                        {
                            required: true,
                            message: '请输入部门名称',
                            trigger: 'blur'
                        }
                    ],
                    email: [
                        {required: true, message: '请输入邮箱地址', trigger: 'blur'},
                        {type: 'email', message: '邮箱格式错误', trigger: 'blur'}
                    ]
                },
                formInline: {
                    user: '',
                    password: ''
                },
                ruleInline: {
                    user: [{
                        required: true,
                        message: '请填写用户名',
                        trigger: 'blur'
                    }],
                    password: [{
                        required: true,
                        message: '请填写密码',
                        trigger: 'blur'
                    },
                        {
                            type: 'string',
                            min: 6,
                            message: '密码长度不能小于6位',
                            trigger: 'blur'
                        }
                    ]
                }
            }
        },
        methods: {
            LoginRegister() {
                this.$refs['userinfova'].validate((valid) => {
                    if (valid) {
                        axios.post(this.$config.register, {
                            'userinfo': this.userinfo
                        })
                            .then(res => {
                                this.$config.notice(res.data);
                                this.$config.clearObj(this.userinfo)
                            })
                            .catch(error => {
                                this.$config.err_notice(this, error)
                            })
                    } else {
                        this.$config.err_notice(this, '请正确填写相关注册信息！')
                    }
                })
            },
            authdata() {
                let url = this.$config.auth;
                if (this.single === true) {
                    url = `${this.$config.gen}/ldap`
                }
                axios.post(url, {
                    'username': this.formInline.user,
                    'password': this.formInline.password
                })
                    .then(res => {
                        axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token
                        sessionStorage.setItem('user', this.formInline.user)
                        sessionStorage.setItem('jwt', `Bearer ${res.data.token}`)
                        sessionStorage.setItem('auth', res.data['permissions'])
                        sessionStorage.setItem('real_name', res.data['real_name'])
                        let auth = res.data['permissions']
                        if (auth === 'admin' || auth === 'perform') {
                            sessionStorage.setItem('access', 0)
                        } else {
                            sessionStorage.setItem('access', 1)
                        }
                        this.$router.push({
                            name: 'home_index'
                        })
                    })
                    .catch(err => {
                        this.$config.auth_notice(err)
                    })
            }
        },
        mounted() {
            window.particlesJS.load('band', `${process.env.BASE_URL}particlesjs-config.json`);
            axios.get(`${this.$config.gen}/fetch`)
                .then(res => {
                    if (res.data === 1) {
                        this.switchCode = true;
                    }
                })
                .catch(err => this.$config.auth_notice(err));
        }
    }
</script>

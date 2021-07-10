<template>
    <main>
        <v-container fluid fill-height class="posisinya">
            <v-layout flex align-center justify-center>
                <v-flex xs12 sm6 elevation-6>
                    <v-toolbar class="grey darken-3">
                        <v-toolbar-title class="grey--text">
                            <h1>Login</h1>
                        </v-toolbar-title>
                    </v-toolbar>
                    <v-card>
                        <v-card-text class="pt-4">
                            <div>
                                <v-form v-model="valid" ref="form">
                                    <v-text-field label="E-mail" v-model="email" :rules="emailRules"
                                    required></v-text-field>
                                    <v-text-field label="Password" v-model="password" type="password"
                                    :rules="passwordRules" counter required></v-text-field>
                                    <v-layout justify-end>
                                        <v-spacer></v-spacer>
                                        <v-btn class="mr-2" @click="submit" :class=" { 'grey darken-1 white--text' : valid, disabled: !valid }">
                                            Go
                                        </v-btn>
                                        <v-btn @click="clear" class="grey darken-3 white--text">
                                            Clear
                                        </v-btn>
                                    </v-layout> 
                                </v-form>
                            </div>
                        </v-card-text>
                    </v-card>
                    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
                        {{error_message}}
                    </v-snackbar>
                </v-flex>
            </v-layout>
        </v-container>
    </main>
</template>

<style>
    .posisinya {
        position: absolute;
        top: 20px;
        left: 0px;
        right: 0px;
    }
</style>

<script>
    export default {
        name: "Login",
        data() {
            return {
                load: false,
                snackbar: false,
                error_message: '',
                color: '',
                valid: false,
                password: '',
                passwordRules: [
                    (v) => !!v || 'Password tidak boleh kosong',
                ],
                email: '',
                emailRules: [
                    (v) => !!v || 'E-mail tidak boleh kosong',
                    v => /.+@.+\..+/.test(v) || 'E-mail tidak valid',
                ],
            };
        },
        methods: {
            submit() {
                if (this.$refs.form.validate()) { //cek apakah data yang akan dikirim sudah valid
                    this.load = true;
                    this.$http.post(this.$api + '/login', {
                        EMAIL_KARYAWAN: this.email,
                        password: this.password
                    }).then(response => {
                        localStorage.setItem('id', response.data.user.id); //menyimpan id user yang sedang login
                        localStorage.setItem('token', response.data.access_token); //menyimpan auth token
                        localStorage.setItem('nama', response.data.user.NAMA_KARYAWAN);
                        localStorage.setItem('role', response.data.role);
                        this.error_message=response.data.message; 
                        this.color="green"
                        this.snackbar=true;
                        this.load = false;
                        this.clear();
                        this.$router.push({
                            name: 'Root' //ubah ini
                        })
                    }).catch(error => {
                        console.log(error)
                        //this.error_message=error.response.data.message;
                        this.error_message='E-mail atau Password salah';
                        this.$refs.form.reset() //Clear form login
                        this.color="red"
                        this.snackbar=true;
                        localStorage.removeItem('token')
                        this.load = false;
                    })
                }
            },
            clear() {
                this.$refs.form.reset() //Clear form login
            },
        },
    };
</script> 
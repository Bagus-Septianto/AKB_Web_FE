<template>
    <div class="dashboard">
        <v-app-bar app fixed height="75px">
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon> 
            <VSpacer />
            <!-- <v-toolbar-items>
                <v-btn text router @click="profile" >profil<v-icon>mdi-clipboard-account</v-icon></v-btn> 
            </v-toolbar-items> -->
            <v-toolbar-items>
                <v-btn text router @click="logout" >logout<v-icon>mdi-power</v-icon></v-btn> 
            </v-toolbar-items>
        </v-app-bar>
        
        <v-navigation-drawer class="fullheight" width="256" v-model="drawer" app >
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title class="title">
                        {{ nama }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        Jabatan : {{ role }}
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list v-if="this.role === 'Owner'" dense nav>
                <v-list-item
                    v-for="item in owners"
                    :key="item.title"
                    link
                    tag="router-link"
                    :to="item.to">

                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
            <v-list v-if="this.role === 'Operational Manager'" dense nav>
                <v-list-item
                    v-for="item in opmgrs"
                    :key="item.title"
                    link
                    tag="router-link"
                    :to="item.to">

                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
            <v-list v-if="this.role === 'Waiter'" dense nav>
                <v-list-item
                    v-for="item in waiters"
                    :key="item.title"
                    link
                    tag="router-link"
                    :to="item.to">

                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
            <v-list v-if="this.role === 'Cashier'" dense nav>
                <v-list-item
                    v-for="item in cashiers"
                    :key="item.title"
                    link
                    tag="router-link"
                    :to="item.to">

                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
            <v-list v-if="this.role === 'Chef'" dense nav>
                <v-list-item
                    v-for="item in chefs"
                    :key="item.title"
                    link
                    tag="router-link"
                    :to="item.to">

                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <div class="grey lighten-4 fullheight pa-5">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Dashboard",
        data() {
            return {
                drawer: true,
                nama: localStorage.getItem('nama'),
                role: localStorage.getItem('role'),
                error_message: '',
                owners: [
                    { title: "Dashboard", to: "/" },
                    { title: "Karyawan", to: "/karyawan"},
                    { title: "Meja", to: "/meja"},
                    { title: "Meja Available", to: "/mejaav"},
                ],
                opmgrs: [
                    { title: "Dashboard", to: "/" },
                    { title: "Karyawan", to: "/karyawan"},
                    { title: "Meja", to: "/meja"},
                    { title: "Meja Available", to: "/mejaav"},
                    { title: "Customer", to: "/customer"},
                    { title: "Menu", to: "/menu"},
                    { title: "Bahan", to: "/bahan"},
                ],
                waiters: [
                    { title: "Dashboard", to: "/" },
                    { title: "Meja", to: "/meja"},
                    { title: "Meja Available", to: "/mejaav"},
                    { title: "Customer", to: "/customer"},
                    { title: "Pesanan", to: "/pesananwaiter"},
                    { title: "Menu", to: "/menu"},
                    { title: "Reservasi", to: "/reservasi"},
                ],
                cashiers: [
                    { title: "Dashboard", to: "/" },
                    { title: "Meja", to: "/meja"},
                    { title: "Meja Available", to: "/mejaav"},
                    { title: "Pesanan", to: "/pesanancashier"},
                    { title: "Menu", to: "/menu"},
                ],
                chefs: [
                    { title: "Dashboard", to: "/" },
                    { title: "Pesanan", to: "/pesananchef"},
                    { title: "Bahan", to: "/bahan"},
                    { title: "Stok Keluar", to: "/stokkeluar"},
                    { title: "Stok Masuk", to: "/stokmasuk"},
                ],
            };
        },
        methods: {
            // profile() {
            //     this.$router.push({ name: 'Profil' })
            // },
            logout() {
                this.$http.post(this.$api + '/logout', {},{
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    } 
                }).then(response => {
                    this.error_message=response.message;
                    localStorage.removeItem('id');
                    localStorage.removeItem('token');
                    localStorage.removeItem('nama');
                    localStorage.removeItem('role');
                    this.$router.push({
                        name: 'login'
                    })
                }).catch(error => {
                    console.log(error)
                    this.error_message=error.response.message;
                    localStorage.removeItem('id');
                    localStorage.removeItem('token');
                    localStorage.removeItem('nama');
                    localStorage.removeItem('role');
                    this.$router.push({
                        name: 'login'
                    })
                })
            }
        },
    };
</script>

<style scoped>
    .fullheight {
        min-height: 100vh !important;
    }
    .router {
        text-decoration: none;
        color: black;
    }
</style>

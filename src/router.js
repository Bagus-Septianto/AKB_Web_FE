import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function importComponent(path) {
    return () => import(`./components/${path}.vue`)
}

Vue.use(VueRouter);

const router = new VueRouter({
    mode: "history",
    routes: [{
            path: "/",
            name: "dashboard",
            component: importComponent('DashboardLayout'),
            children: [
                //Dashboard
                {
                    path: "/",
                    name: "Root",
                    meta: {title: 'Dashboard'},
                    component: importComponent('Dashboard'),
                },
                {
                    path: "/karyawan",
                    name: "Karyawan",
                    meta: {title: 'Karyawan'},
                    component: importComponent('DataMaster/Karyawan'),
                },
                {
                    path: "/meja",
                    name: "Meja",
                    meta: {title: 'Meja'},
                    component: importComponent('DataMaster/Meja'),
                },
                {
                    path: "/mejaav",
                    name: "Meja Available",
                    meta: {title: 'Meja Available'},
                    component: importComponent('DataMaster/MejaAvailable'),
                },
                {
                    path: "/customer",
                    name: "Customer",
                    meta: {title: 'Customer'},
                    component: importComponent('DataMaster/Customer'),
                },
                {
                    path: "/pesanancashier",
                    name: "Pesanan",
                    meta: {title: 'Pesanan'},
                    component: importComponent('DataMaster/PesananCashier'),
                },
                {
                    path: "/pesananchef",
                    name: "Pesanan",
                    meta: {title: 'Pesanan'},
                    component: importComponent('DataMaster/PesananChef'),
                },
                {
                    path: "/pesananwaiter",
                    name: "Pesanan",
                    meta: {title: 'Pesanan'},
                    component: importComponent('DataMaster/PesananWaiter'),
                },
                {
                    path: "/menu",
                    name: "Menu",
                    meta: {title: 'Menu'},
                    component: importComponent('DataMaster/Menu'),
                },
                {
                    path: "/bahan",
                    name: "Bahan",
                    meta: {title: 'Bahan'},
                    component: importComponent('DataMaster/Bahan'),
                },
                {
                    path: "/reservasi",
                    name: "Reservasi",
                    meta: {title: 'Reservasi'},
                    component: importComponent('DataMaster/Reservasi'),
                },
                {
                    path: "/stokkeluar",
                    name: "StokKeluar",
                    meta: {title: 'Stok Keluar'},
                    component: importComponent('DataMaster/StokKeluar'),
                },
                {
                    path: "/stokmasuk",
                    name: "StokMasuk",
                    meta: {title: 'Stok Masuk'},
                    component: importComponent('DataMaster/StokMasuk'),
                },
            ]
        },
        //Login
        {
            path: "/login",
            name: "login",
            meta: {title: 'Login'},
            component: importComponent('Login'),
        },
        {
            path: '*',
            redirect: '/'
        },
    ]
});

//Mengset judul
router.beforeEach((to, from, next) => {
    document.title = to.meta.title

    if (to.name != 'login' && localStorage.getItem('token') == null) { //ntah dan / atau
        next({ path: '/login'})
    }
    next()
});
export default router;
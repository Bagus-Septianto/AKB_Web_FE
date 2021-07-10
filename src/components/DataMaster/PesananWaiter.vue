<template>
    <v-main class="list">
        <v-row dense>
            <v-col
                v-for="(itemDetilPesanan, idx) in detilPesanans"
                :key="idx"
                xs="3" sm="3" md="3" lg="3" xl="3">
                <v-card
                    class="pa-4 rounded-lg"
                    outlined
                    tile
                    color="blue darken-1 white--text"
                    @click="updateDialog(itemDetilPesanan)"
                >
                <!-- vcard onclick pop up warning sudah ready -->
                    <v-card-title>
                        {{ itemDetilPesanan.ID_MENU }} 
                    </v-card-title>
                    <v-card-title>
                        {{ itemDetilPesanan.NAMA_MENU }}
                    </v-card-title>
                        <br> Jumlah: {{ itemDetilPesanan.JUMLAH_PESANAN}}
                        <br> Status: {{ itemDetilPesanan.STATUS_PESANAN}}
                </v-card>
            </v-col>
        </v-row>
        <v-dialog v-model="dialog" presistent max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">
                    Pesanan Sudah Dihidangkan?</span>
                </v-card-title>
                <v-card-actions>
                    <v-btn color="red darken-1" large text @click="dialog = false">
                        Belum
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" large text @click="pesananSelesai">
                        Ya
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
            {{ error_message }}
        </v-snackbar>
    </v-main>
</template>

<script>
export default {
    name: "List",
    data() {
        return {
            dialog: false,
            snackbar: false,
            error_message: '',
            color: '',
            updateId: '',
            detilPesanans: [],
        };
    },
    methods: {
        readData() {
            var url = this.$api + '/pesananwaiter'
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.detilPesanans = response.data.dataDetilPesanan  //todo check disini mungkin salah
                console.log(response.data) //todo hapus ini (cuma buat ngecek)
            }).catch(error => {
                this.error_message=error.response.data.message;
                this.color="red"
                this.detilPesanans = []
                this.snackbar=true;
                this.dialog = false
            })
        },
        updateDialog(item) {
            this.updateId = item.ID_DETIL_PESANAN;
            this.dialog = true
        },
        pesananSelesai() {
            var url = this.$api + '/pesananstatus/' + this.updateId;
            this.$http.put(url, 1, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.error_message=response.data.message;
                this.color="green"
                this.snackbar=true;
                this.dialog = false
                this.readData(); //mengambil data
            }).catch(error => {
                this.error_message=error.response.data.message;
                this.color="red"
                this.snackbar=true;
                this.dialog = false
            }) 
        }
    },
    mounted() {
        this.readData();
    }
};
</script>

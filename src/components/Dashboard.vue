<template>
    <v-main>
        <div v-if="this.role !== 'Owner' && this.role !== 'Operational Manager'">
            <h1 class="text-h3 font-weight-medium mb-5">Dashboard</h1>
            <p class="subtitle-1">TODO, shortcut laporan owner,
                <br> tambahan button untuk routing ke page karyawan dll.
                <br> tambahan informasi user mungkin (email, no telp, dll.)
                <br> atau remove page dashboard 
            </p>
        </div>
        <div v-if="this.role === 'Owner' || this.role === 'Operational Manager'">
            <!-- ini yang susah -->
            <v-btn @click="title = 'Laporan Stok Bahan'; dialog = true">Laporan Stok Bahan</v-btn> <br> <br>
            <!-- end ini yang susah -->
            <v-btn @click="title = 'Laporan Penjualan Item Menu'; dialog = true">Laporan Penjualan Item Menu</v-btn> <br> <br>
            <v-btn @click="title = 'Laporan Pendapatan Bulanan'; dialog = true" style="margin-right: 15px">Laporan Pendapatan Bulanan</v-btn>
            <v-btn @click="title = 'Laporan Pendapatan Tahunan'; dialog = true">Laporan Pendapatan Tahunan</v-btn> <br> <br>
            <v-btn @click="title = 'Laporan Pengeluaran Bulanan'; dialog = true" style="margin-right: 15px">Laporan Pengeluaran Bulanan</v-btn>
            <v-btn @click="title = 'Laporan Pengeluaran Tahunan'; dialog = true">Laporan Pengeluaran Tahunan</v-btn> <br> <br>
            <!-- 2019 - {{ new Date().getFullYear() }} -->
        </div>

        <v-dialog v-model="dialog" presistent max-width="450px">
            <v-card>
                <v-card-title class="black--text">{{ title }}</v-card-title>
                <v-card-text class="black--text">
                    <v-form ref="form" lazy-validation>
                        <div v-if="title == 'Laporan Pengeluaran Tahunan' || title == 'Laporan Pendapatan Tahunan'">
                            <v-text-field
                                label="Tahun Awal"
                                v-model="tahunAwal"
                                :rules="tahunRules"
                                ></v-text-field>
                            <v-text-field
                                label="Tahun"
                                v-model="tahun"
                                :rules="tahunRules"
                                ></v-text-field>
                        </div>
                        <div v-if="title == 'Laporan Pengeluaran Bulanan' || title == 'Laporan Pendapatan Bulanan'">
                            <v-text-field
                                label="Tahun"
                                v-model="tahun"
                                :rules="tahunRules"
                                ></v-text-field>
                        </div>
                        <div v-if="title == 'Laporan Penjualan Item Menu'">
                            <v-text-field
                                label="Tahun"
                                v-model="tahun"
                                :rules="tahunRules"
                                ></v-text-field>
                            <v-checkbox
                                v-model="bulanAll"
                                label="Bulan All?">
                            </v-checkbox>
                            <v-autocomplete
                                v-if="!bulanAll"
                                v-model="bulan"
                                label="Bulan"
                                :items="bulanArray"
                                item-text="namaBulan"
                                item-value="nomorBulan"
                                ></v-autocomplete>
                        </div>
                        <div v-if="title == 'Laporan Stok Bahan'">
                            <v-checkbox
                                v-model="periodeCustom"
                                label="Custom Period?">
                            </v-checkbox>
                            <div v-if="!periodeCustom">
                                <v-autocomplete
                                    v-model="bahan"
                                    :items="bahans"
                                    item-text="NAMA_BAHAN"
                                    item-value="ID_BAHAN"
                                    :rules="[v => !!v || 'Bahan Tidak Boleh Kosong']"
                                    label="Bahan"
                                    required></v-autocomplete>
                                <v-autocomplete
                                    v-model="bulan"
                                    label="Bulan"
                                    :items="bulanArray"
                                    item-text="namaBulan"
                                    item-value="nomorBulan"
                                    ></v-autocomplete>
                                <v-text-field
                                    label="Tahun"
                                    v-model="tahun"
                                    :rules="tahunRules"
                                    ></v-text-field>
                            </div>
                            <div v-if="periodeCustom">
                                <v-menu
                                    v-model="datePicker1"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="auto">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                            v-model="tanggalAwal"
                                            label="Tanggal Awal"
                                            :rules="[v => !!v || 'Tanggal Awal Tidak Boleh Kosong']"
                                            readonly
                                            required
                                            v-bind="attrs"
                                            v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker
                                        v-model="tanggalAwal"
                                        @input="datePicker1 = false"></v-date-picker>
                                </v-menu>
                                <v-menu
                                    v-model="datePicker2"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="auto">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                            v-model="tanggalAkhir"
                                            label="Tanggal Akhir"
                                            :rules="[v => !!v || 'Tanggal Akhir Tidak Boleh Kosong']"
                                            readonly
                                            required
                                            v-bind="attrs"
                                            v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker
                                        v-model="tanggalAkhir"
                                        @input="datePicker2 = false"></v-date-picker>
                                </v-menu>
                            </div>
                        </div>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">
                        Cancel
                    </v-btn>
                    <v-btn v-if="tahunAwal <= tahun && tanggalAkhir >= tanggalAwal" color="blue darken-1" text @click="printHandle">
                        Lihat
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogLaporan" max-width="75%">
            <v-card>
                <div id="laporan" style="padding: 50px">
                    <img :src="'data:image/png;base64,'+$img" style="width: 100%; height: auto"/>
                    <br><hr><br>
                    <h2 style="text-align: center">{{ title }}</h2> <br>
                    <div v-if="title == 'Laporan Stok Bahan'">
                        <p>Item Menu: {{ getNamaBahan(bahan) }}</p>
                        <p v-if="periodeCustom">Periode: Custom ({{ new Date(tanggalAwal).toLocaleDateString('en-GB', options) }} s/d {{ new Date(tanggalAkhir).toLocaleDateString('en-GB', options) }})</p>
                        <p v-if="!periodeCustom">Periode: {{ bulanArray[bulan-1].namaBulan }} {{ tahun }}</p>
                    </div>
                    <p v-if="title == 'Laporan Pengeluaran Bulanan' || title == 'Laporan Pendapatan Bulanan'">TAHUN: {{ tahun }}</p>
                    <p v-if="title == 'Laporan Pengeluaran Tahunan' || title == 'Laporan Pendapatan Tahunan'">TAHUN: {{ tahunAwal }} s/d {{ tahun }}</p>
                    <div v-if="title == 'Laporan Penjualan Item Menu'">
                        <p v-if="bulanAll == false">TAHUN: {{ tahun }}<br>BULAN: {{ bulanArray[bulan-1].namaBulan}}</p>
                        <p v-if="bulanAll == true">TAHUN: {{ tahun }}<br>BULAN: ALL</p>
                        <hr><h3>Makanan</h3><hr>
                        <v-data-table
                            :headers="headers" 
                            :items="dataLaporan.utama" 
                            hide-default-footer 
                            disable-pagination></v-data-table> <br>
                        <hr><h3>Side Dish</h3><hr>
                        <v-data-table
                            :headers="headers" 
                            :items="dataLaporan.side"
                            hide-default-footer 
                            disable-pagination></v-data-table> <br>
                        <hr><h3>Minuman</h3><hr>
                        <v-data-table
                            :headers="headers" 
                            :items="dataLaporan.minuman"
                            hide-default-footer 
                            disable-pagination></v-data-table> <br>
                    </div>
                    <v-data-table
                        v-if="title != 'Laporan Penjualan Item Menu'"
                        :headers="headers" 
                        :items="dataLaporan" 
                        hide-default-footer 
                        disable-pagination></v-data-table> <br>
                    <br><hr><br><br>
                    <p style="text-align: center"><b>Printed {{ new Date().toLocaleString() }}</b>
                    <br>Printed By {{ nama }}</p>
                </div>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">
                        Tutup
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="cetakLaporan()">
                        Print
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-main>
</template>

<script>
import html2PDF from 'jspdf-html2canvas';
export default {
    name: "List",
    data() {
        return {
            dialog: false,
            dialogLaporan: false,
            role: localStorage.getItem('role'),
            nama: localStorage.getItem('nama'),
            title: '',
            tanggalAwal: '',
            tanggalAkhir: '',
            datePicker1: false,
            datePicker2: false,
            periodeCustom: false,
            tahunAwal: 2019,
            tahun: new Date().getFullYear(),
            bulan: new Date().getMonth() + 1,
            bulanAll: false,
            bulanArray: [
                { namaBulan: 'Januari', nomorBulan: 1, },
                { namaBulan: 'Februari', nomorBulan: 2, },
                { namaBulan: 'Maret', nomorBulan: 3, },
                { namaBulan: 'April', nomorBulan: 4, },
                { namaBulan: 'Mei', nomorBulan: 5, },
                { namaBulan: 'Juni', nomorBulan: 6, },
                { namaBulan: 'Juli', nomorBulan: 7, },
                { namaBulan: 'Agustus', nomorBulan: 8, },
                { namaBulan: 'September', nomorBulan: 9, },
                { namaBulan: 'Oktober', nomorBulan: 10, },
                { namaBulan: 'November', nomorBulan: 11, },
                { namaBulan: 'Desember', nomorBulan: 12, },
            ],
            options: { year: 'numeric', month: 'short', day: 'numeric' },
            dataLaporan: [],
            bahan: null,
            bahans: [],
            headers: [
            ],
            tahunRules: [
                v => !!v || 'Tahun tidak boleh kosong',
                v => /^20[0-9]{2}$/.test(v) || 'Tahun tidak valid',
            ],
        }
    },
    methods: {
        cetakLaporan() {
            let el = document.getElementById("laporan");
            html2PDF(el, {
                html2canvas: {
                    scrollX: 0,
                    scrollY: -window .scrollY,
                },
                output: this.title + '.pdf'
            });
            
        },
        printHandle() {
            if (this.$refs.form.validate()) {
                if (this.title == 'Laporan Stok Bahan') {
                    if (this.periodeCustom)
                        this.laporanStokBahanCustom()
                    else
                        this.laporanStokBahan()
                }
                if (this.title == 'Laporan Penjualan Item Menu') {
                    if (!this.bulanAll)
                        this.laporanItemMenu()
                    else
                        this.laporanItemMenuAll()
                }
                if (this.title == 'Laporan Pendapatan Bulanan') {
                    this.laporanPendapatanBulanan()
                }
                if (this.title == 'Laporan Pendapatan Tahunan') {
                    this.laporanPendapatanTahunan()
                }
                if (this.title == 'Laporan Pengeluaran Bulanan') {
                    this.laporanPengeluaranBulanan()
                }
                if (this.title == 'Laporan Pengeluaran Tahunan') {
                    this.laporanPengeluaranTahunan()
                }
                this.$refs.form.resetValidation()
                this.dialog = false
                this.dialogLaporan = true
            }
        },
        laporanStokBahanCustom() {
            this.$http.get(this.$api + '/stokbahancustom/' + this.tanggalAwal + '/' + this.tanggalAkhir, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.headers = [
                    {
                        text: "No",
                        align: "start",
                        sortable: true,
                        value: "nomor",
                    },
                    { text: "Nama Bahan", value: "nama" },
                    { text: "Unit", value: "unit" },
                    { text: "Incoming Stock", value: "incoming" },
                    { text: "Remaining Stock", value: "remaining" },
                    { text: "Waste Stock", value: "waste" },
                ]
                this.dataLaporan = response.data.data;
                console.log(this.dataLaporan)
            }).catch(error => {
                console.log(error.response.data.message)
                this.close();
            })

        },
        laporanStokBahan() {
            this.$http.get(this.$api + '/stokbahan/' + this.tahun + '/' + this.bulan + '/' + this.bahan, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.headers = [
                    {
                        text: "No",
                        align: "start",
                        sortable: true,
                        value: "nomor",
                    },
                    { text: "Tanggal", value: "tanggal" },
                    { text: "Unit", value: "unit" },
                    { text: "Incoming Stock", value: "incoming" },
                    { text: "Remaining Stock", value: "remaining" },
                    { text: "Waste Stock", value: "waste" },
                ]
                this.dataLaporan = response.data.data;
                console.log(this.dataLaporan)
            }).catch(error => {
                console.log(error.response.data.message)
                this.close();
            })
        },
        laporanItemMenu() {
            this.$http.get(this.$api + '/penjualanitem/' + this.tahun + '/' + this.bulan, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.headers = [
                    {
                        text: "No",
                        align: "start",
                        sortable: true,
                        value: "nomor",
                    },
                    { text: "Item Menu", value: "nama_menu" },
                    { text: "Unit", value: "unit_menu" },
                    { text: "Penjualan Harian Tertinggi", value: "penjualan_harian_tertinggi" },
                    { text: "Total Penjualan", value: "total_penjualan" },
                ]
                this.dataLaporan['utama'] = response.data.utama;
                this.dataLaporan['side'] = response.data.side;
                this.dataLaporan['minuman'] = response.data.minuman;
                console.log(this.dataLaporan)
                //cetak pdf
            }).catch(error => {
                console.log(error.response.data.message)
                this.close();
            })
        },
        laporanItemMenuAll() {
            this.$http.get(this.$api + '/penjualanitemall/' + this.tahun, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.headers = [
                    {
                        text: "No",
                        align: "start",
                        sortable: true,
                        value: "nomor",
                    },
                    { text: "Item Menu", value: "nama_menu" },
                    { text: "Unit", value: "unit_menu" },
                    { text: "Penjualan Harian Tertinggi", value: "penjualan_harian_tertinggi" },
                    { text: "Total Penjualan", value: "total_penjualan" },
                ]
                this.dataLaporan['utama'] = response.data.utama;
                this.dataLaporan['side'] = response.data.side;
                this.dataLaporan['minuman'] = response.data.minuman;
                console.log(this.dataLaporan)
                //cetak pdf
            }).catch(error => {
                console.log(error.response.data.message)
                this.close();
            })
        },
        laporanPendapatanBulanan() {
            this.$http.get(this.$api + '/pendapatanbulanan/' + this.tahun, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.headers = [
                    {
                        text: "No",
                        align: "start",
                        sortable: true,
                        value: "nomor",
                    },
                    { text: "Bulan", value: "bulan" },
                    { text: "Makanan", value: "makanan" },
                    { text: "Side Dish", value: "sidedish" },
                    { text: "Minuman", value: "minuman" },
                    { text: "Total Pendapatan", value: "total" },
                ]
                this.dataLaporan = response.data.data;
                console.log(this.dataLaporan)
                //cetak pdf
            }).catch(error => {
                console.log(error.response.data.message)
                this.close();
            })
        },
        laporanPendapatanTahunan() {
            this.$http.get(this.$api + '/pendapatantahunan/' + this.tahunAwal + '/' + this.tahun, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.headers = [
                    {
                        text: "No",
                        align: "start",
                        sortable: true,
                        value: "nomor",
                    },
                    { text: "Tahun", value: "tahun" },
                    { text: "Makanan", value: "makanan" },
                    { text: "Side Dish", value: "sidedish" },
                    { text: "Minuman", value: "minuman" },
                    { text: "Total Pendapatan", value: "total" },
                ]
                this.dataLaporan = response.data.data;
                console.log(this.dataLaporan)
                //cetak pdf
            }).catch(error => {
                console.log(error.response.data.message)
                this.close();
            })
        },
        laporanPengeluaranBulanan() {
            this.$http.get(this.$api + '/pengeluaranbulanan/' + this.tahun, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.headers = [
                    {
                        text: "No",
                        align: "start",
                        sortable: true,
                        value: "nomor",
                    },
                    { text: "Bulan", value: "bulan" },
                    { text: "Makanan", value: "makanan" },
                    { text: "Side Dish", value: "sidedish" },
                    { text: "Minuman", value: "minuman" },
                    { text: "Total Pengeluaran", value: "total" },
                ]
                this.dataLaporan = response.data.data;
                console.log(this.dataLaporan)
                //cetak pdf
            }).catch(error => {
                console.log(error.response.data.message)
                this.close();
            })
        },
        laporanPengeluaranTahunan() {
            this.$http.get(this.$api + '/pengeluarantahunan/' + this.tahunAwal + '/' + this.tahun, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.headers = [
                    {
                        text: "No",
                        align: "start",
                        sortable: true,
                        value: "nomor",
                    },
                    { text: "Tahun", value: "tahun" },
                    { text: "Makanan", value: "makanan" },
                    { text: "Side Dish", value: "sidedish" },
                    { text: "Minuman", value: "minuman" },
                    { text: "Total Pengeluaran", value: "total" },
                ]
                this.dataLaporan = response.data.data;
                console.log(this.dataLaporan)
            }).catch(error => {
                console.log(error)
                this.close();
            })
        },
        close() {
            this.$refs.form.resetValidation()
            this.title = ''
            this.dialog = false
            this.dialogLaporan = false
            this.headers = []
            this.dataLaporan = []
            this.tahunAwal = 2019
            this.tahun = new Date().getFullYear()
            this.bulan = new Date().getMonth() + 1
            this.tanggalAwal = ''
            this.tanggalAkhir = ''
        },
        readBahan() {
            this.$http.get(this.$api + '/bahan', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.bahans = response.data.data
            })
        },
        getNamaBahan(item) {
            for (var i = 0; i < this.bahans.length; i++) {
                if(item == this.bahans[i].ID_BAHAN) {
                    return this.bahans[i].NAMA_BAHAN
                }
            }
        },
    },
    mounted() {
        this.readBahan();
    }
};
</script>
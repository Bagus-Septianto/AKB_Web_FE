<template>
    <v-main class="list">
        <v-row dense>
            <v-col
                v-for="itemPesanan in pesanans"
                :key="itemPesanan.ID_PESANAN"
                xs="3" sm="3" md="3" lg="3" xl="3">
                <v-card
                    class="pa-4 rounded-lg"
                    outlined
                    tile
                    color="blue darken-1 white--text"
                    @click="showDialog(itemPesanan)"
                >
                <!-- vcard onclick pop up warning sudah ready -->
                    <v-card-title>
                        Nama Customer: <br> {{ itemPesanan.NAMA_CUSTOMER }}
                    </v-card-title>
                    <v-card-title>
                        No. Meja: <br> {{ itemPesanan.NOMOR_MEJA }} 
                    </v-card-title>
                        <br> Subtotal: Rp. {{ itemPesanan.subtotal}}
                </v-card>
            </v-col>
        </v-row>
        <!-- TODO besok add button cetak struk / bayar -->
        <v-dialog v-model="dialog" presistent max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">
                    Detil Pesanan</span>
                </v-card-title>
                <v-row dense>
                    <v-col class="ml-3">
                        <v-card-text
                            v-for="(detil, idx) in detilPesanans"
                            :key="idx"
                            class="black--text"
                        >
                            Nama Menu: {{ detil.NAMA_MENU }} <br>
                            Harga: {{ detil.HARGA_MENU }} <br>
                            Jumlah: {{ detil.JUMLAH_PESANAN }}
                        </v-card-text>
                    </v-col>
                    <v-col>
                        <v-card-title align="right">
                            Subtotal: Rp. {{ subtotal }} <br>
                            Pajak: Rp. {{ subtotal*0.1 }} <br>
                            Total: Rp. {{ total }}
                        </v-card-title>
                    </v-col>
                </v-row>
                <v-card-actions>
                    <v-btn color="red darken-1" large text @click="dialog = false">
                        Batal
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" large text @click="bayarDialog">
                        Bayar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        
        <v-dialog v-model="dialogBayar" presistent max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">
                    Bayar Pesanan</span>
                </v-card-title>
                <v-card-text class="black--text">
                    Nama Customer: {{ namaCust }} <br>
                    Nomor Meja: {{ noMeja }} <br>
                    Subtotal: Rp. {{ subtotal }} <br>
                    Pajak: Rp. {{ pajak }} <br>
                    Total: Rp. {{ total }}
                </v-card-text>
                <v-card-text>
                    <v-form ref="form" lazy-validation>
                        <v-radio-group
                            v-model="jenisPembayaran"
                            row required>
                            <v-radio
                                @click="resetBayar"
                                label="Cash"
                                value="Cash"></v-radio>
                            <v-radio
                                @click="resetBayar"
                                label="Credit Card"
                                value="Credit Card"></v-radio>
                        </v-radio-group>
                        <div v-if="jenisPembayaran == 'Cash'">
                            <v-text-field
                                v-model="totalBayar"
                                label="Jumlah Bayar"
                                type="number"
                                :rules="totalBayarRules"
                                required></v-text-field>
                            <v-card-text class="black--text" v-if="totalBayar > total">
                                Kembalian : Rp. {{ totalBayar-total }}
                            </v-card-text>
                        </div>
                        <div v-if="jenisPembayaran == 'Credit Card'">
                            <v-text-field
                                v-model="namaPemilikKartu"
                                label="Nama Pemilik Kartu"
                                :rules="v => !!v || 'Nama Pemilik Kartu tidak boleh kosong'"
                                required></v-text-field>
                            <v-text-field
                                v-model="noKartu"
                                label="Nomor Kartu"
                                :rules="noKartuRules"
                                required></v-text-field>
                            <v-text-field
                                v-model="tanggalExp"
                                label="Tanggal Exp"
                                :rules="tanggalExpRules"
                                required></v-text-field>
                            <v-text-field
                                v-model="kodeVerifikasi"
                                label="Kode Verifikasi"
                                :rules="v => !!v || 'Kode Verifikasi tidak boleh kosong'"
                                required></v-text-field>
                        </div>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="red darken-1" large text @click="closeBayar">
                        Batal
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1"
                        v-if="totalBayar >= total"
                        large text
                        @click="bayarCash">
                        Bayar
                    </v-btn>
                    <v-btn color="green darken-1" 
                        v-if="namaPemilikKartu != '' && noKartu != '' && tanggalExp != ''"
                        large text
                        @click="bayarCard">
                        Bayar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogCetak" presistent max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">
                    Cetak Struk?</span>
                </v-card-title>
                <v-card-text class="black--text">
                    <!-- struk -->
                    <div id="struk" style="padding: 55px">
                        <img :src="'data:image/png;base64,'+$img" style="width: 300px; height: 100px"/>
                        <br><hr>
                        <table style="width:100%">
                            <tr>
                                <td>Receipt #</td>
                                <td>{{ noReceipt }}</td>
                                <td>Date</td>
                                <td>{{ date.getDay() }}/{{ date.getMonth() }}/{{ date.getFullYear() }}</td>
                            </tr>
                            <tr>
                                <td>Cashier</td>
                                <td>{{ cashier }}</td>
                                <td>Time</td>
                                <td>{{ date.getHours() }}:{{ date.getMinutes() }}</td>
                            </tr>
                        </table>
                        <hr>
                        <table style="width:100%;">
                            <tr>
                                <td>Table #</td>
                                <td>{{ noMeja }}</td>
                                <td style="float:right">Customer : </td>
                                <td>{{ namaCust }}</td>
                            </tr>
                        </table>
                        <br><hr>
                        <!-- tabel detil pesanan -->
                        <v-data-table 
                            :headers="headerstruk" 
                            :items="struk.detilPesanan" 
                            hide-default-footer 
                            disable-pagination></v-data-table>
                        <br><hr>
                        <table style="width:100%;">
                            <tr style="float:right">
                                Rp. {{ subtotal }} <br>
                                Rp. {{ pajak }} <br>
                                <b>Rp. {{ total }}</b>
                            </tr>
                            <tr style="float:right; margin-right:20px">
                                Subtotal <br>
                                Tax <br>
                                <b>Total</b>
                            </tr>
                            <tr style="float:left">
                                Total Qty:  {{ struk.TOTAL_ITEM }}<br>
                                Total Item: {{ struk.TOTAL_MENU }}<br>
                            </tr>
                        </table>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="red darken-1" large text @click="dialogCetak = false">
                        Batal
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" 
                        large text
                        @click="cetakStruk">
                        Cetak Struk
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
import html2PDF from 'jspdf-html2canvas';
export default {
    name: "List",
    data() {
        return {
            cashier: localStorage.getItem('nama'),
            date: new Date(),
            dialog: false,
            dialogBayar: false,
            dialogCetak: false,
            snackbar: false,
            bayarData: new FormData,
            error_message: '',
            color: '',
            updateId: '',
            subtotal: 0,
            total: 0,
            pajak: 0,
            namaCust: '',
            noMeja: '',
            noReceipt: 'AKB--1',
            totalBayar: '',
            jenisPembayaran: 'Cash',
            namaPemilikKartu: '',
            noKartu: '',
            tanggalExp: '',
            kodeVerifikasi: '',
            pesanans: [],
            detilPesanans: [],
            struk: [],
            headerstruk: [
                {
                    text: "Qty",
                    align: "start",
                    sortable: true,
                    value: "JUMLAH_PESANAN",
                },
                { text: "Item Menu", value: "NAMA_MENU" },
                { text: "Harga", value: "HARGA_MENU" },
                { text: "Subtotal", value: "Subtotal" },
            ],
            totalBayarRules: [
                v => !!v || 'Jumlah Bayar tidak boleh kosong',
                v => /^[0-9]+$/.test(v) || 'Jumlah Bayar hanya boleh angka',
            ],
            noKartuRules: [
                v => !!v || 'Nomor Kartu tidak boleh kosong',
                v => /^[0-9]+$/.test(v) || 'Nomor Kartu hanya boleh angka',
                v => /^[0-9]{1,20}$/.test(v) || 'maksimal character Nomor Kartu adalah 20',
            ],
            tanggalExpRules: [
                v => !!v || 'Tanggal Exp tidak boleh kosong',
                v => /^[0-9]+$/.test(v) || 'Tanggal Exp hanya boleh angka',
                v => /^[0-9]{1,15}$/.test(v) || 'maksimal character Tanggal Exp adalah 15',
            ],
        };
    },
    methods: {
        cetakStruk() {
            let el = document.getElementById("struk");
            html2PDF(el, {
                jsPDF: { format: [400, 450] },
                html2canvas: {
                    scrollX: 0,
                    scrollY: -window .scrollY
                },
                output: 'Struk.pdf'
            });
        },
        readData() {
            var url = this.$api + '/pesanancashier'
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.pesanans = response.data.dataPesanan  //todo check disini mungkin salah
                console.log(response.data) //todo hapus ini (cuma buat ngecek)
            }).catch(error => {
                this.error_message=error.response.data.message;
                this.color="red"
                this.pesanans = []
                this.snackbar=true;
                this.dialog = false
            })
        },
        bayarCash() {
            this.bayarData.append('ID_PESANAN', this.idPesanan);
            this.bayarData.append('id', localStorage.getItem('id'));
            this.bayarData.append('NOMOR_MEJA', this.noMeja);
            // this.bayarData.append('TANGGAL_PEMBAYARAN', this.formTodo.JENIS_KELAMIN_KARYAWAN); //dibackend bisa
            // this.bayarData.append('NOMOR_PEMBAYARAN', this.nomorpembayaran); //backend
            this.bayarData.append('JENIS_PEMBAYARAN', 'Cash');
            this.bayarData.append('SUBTOTAL', this.subtotal);
            this.bayarData.append('PAJAK', this.pajak);
            this.bayarData.append('TOTAL', this.total);
            this.$http.post(this.$api + '/bayarcash', this.bayarData, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.struk = response.data.struk
                this.error_message=response.data.message
                this.color="green"
                this.snackbar=true
                this.closeBayar()
                this.dialogCetak = true
                this.readData()
            }).catch(error => {
                this.error_message=error.response.data.message;
                this.color="red"
                this.snackbar=true
            })
        },
        bayarCard() {
            this.bayarData.append('ID_PESANAN', this.idPesanan);
            this.bayarData.append('id', localStorage.getItem('id'));
            this.bayarData.append('NOMOR_MEJA', this.noMeja);
            // this.bayarData.append('TANGGAL_PEMBAYARAN', this.formTodo.JENIS_KELAMIN_KARYAWAN); //dibackend bisa
            // this.bayarData.append('NOMOR_PEMBAYARAN', this.nomorpembayaran); //backend
            this.bayarData.append('JENIS_PEMBAYARAN', 'Credit Card');
            this.bayarData.append('SUBTOTAL', this.subtotal);
            this.bayarData.append('PAJAK', this.pajak);
            this.bayarData.append('TOTAL', this.total);
            this.bayarData.append('KODE_VERIFIKASI', this.kodeVerifikasi);
            this.bayarData.append('NAMA_PEMILIK_KARTU', this.namaPemilikKartu);
            this.bayarData.append('NOMOR_KARTU', this.noKartu);
            this.bayarData.append('TANGGAL_EXP', this.tanggalExp);
            this.$http.post(this.$api + '/bayarcard', this.bayarData, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.struk = response.data.struk
                this.error_message=response.data.message
                this.color="green"
                this.snackbar=true
                this.closeBayar()
                this.dialogCetak = true
                this.readData()
            }).catch(error => {
                this.error_message=error.response.data.message;
                this.color="red"
                this.snackbar=true
            })
        },
        showDialog(item) {
            this.idPesanan = item.ID_PESANAN
            this.subtotal = item.subtotal
            this.namaCust = item.NAMA_CUSTOMER
            this.noMeja = item.NOMOR_MEJA
            this.detilPesanans = item.detilPesanan
            this.pajak = item.subtotal*0.1
            this.total = item.subtotal-(-item.subtotal*0.1)
            this.dialog = true
        },
        bayarDialog() {
            this.dialog = false
            this.dialogBayar = true
        },
        closeBayar() {
            this.resetBayar()
            this.dialogBayar = false
        },
        resetBayar() {
            this.$refs.form.resetValidation()
            this.namaPemilikKartu = ''
            this.noKartu = ''
            this.tanggalExp = ''
            this.totalBayar = ''
        },
    },
    mounted() {
        this.readData();
    }
};
</script>

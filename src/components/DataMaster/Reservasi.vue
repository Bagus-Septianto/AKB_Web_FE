<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium ml-3 mb-5">Reservasi</h3>


        <v-card>
            <v-card-title>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details></v-text-field>
                <v-spacer></v-spacer>
                <v-btn color="success" dark @click="dialog = true">
                    Tambah Reservasi
                </v-btn>
            </v-card-title>
            <v-data-table :headers="headers" :items="reservasis" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2" @click="generateQRHandler(item)">
                        QR
                    </v-btn>
                    <v-btn small class="mr-2" @click="editHandler(item)">
                        Ubah
                    </v-btn>
                    <v-btn small @click="deleteHandler(item)">
                        Delete
                    </v-btn>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }} Reservasi</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-form v-model="valid" ref="form" lazy-validation>
                            <v-autocomplete
                                v-model="formTodo.ID_CUSTOMER"
                                :items="customers"
                                item-text="NAMA_CUSTOMER"
                                item-value="ID_CUSTOMER"
                                label="Nama Customer"
                                :rules="[v => !!v || 'Nama Customer Tidak Boleh Kosong']"
                                required></v-autocomplete>
                            <v-autocomplete
                                v-model="formTodo.ID_MEJA"
                                :items="mejas"
                                item-text="NOMOR_MEJA"
                                item-value="ID_MEJA"
                                :rules="[v => !!v || 'Meja Tidak Boleh Kosong']"
                                label="Meja"
                                required></v-autocomplete>
                            <v-menu
                                v-model="tanggal"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="auto">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        v-model="formTodo.TANGGAL_RESERVASI"
                                        label="Tanggal Reservasi"
                                        :rules="[v => !!v || 'Tanggal Reservasi Tidak Boleh Kosong']"
                                        readonly
                                        required
                                        v-bind="attrs"
                                        v-on="on"></v-text-field>
                                </template>
                                <v-date-picker
                                    v-model="formTodo.TANGGAL_RESERVASI"
                                    @input="tanggal = false"></v-date-picker>
                            </v-menu>
                            <v-radio-group
                                v-model="formTodo.JAM_RESERVASI"
                                row required
                                :rules="[v => !!v || 'Jam Reservasi Tidak Boleh Kosong']">
                                <v-radio
                                    label="Lunch 11.00-16.00"
                                    value="Lunch 11.00-16.00"></v-radio>
                                <v-radio
                                    label="Dinner 17.00-21.00"
                                    value="Dinner 17.00-21.00"></v-radio>
                            </v-radio-group>
                            <v-radio-group
                                v-if="formTitle != 'Tambah'"
                                v-model="formTodo.STATUS_RESERVASI"
                                row required
                                :rules="[v => !!v || 'Status Reservasi Tidak Boleh Kosong']">
                                <v-radio
                                    label="Belum Datang"
                                    value="Belum Datang"></v-radio>
                                <v-radio
                                    label="Sudah Datang"
                                    value="Sudah Datang"></v-radio>
                            </v-radio-group>
                        </v-form>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel">
                        Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="setForm" :disabled="!valid">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogConfirm" presistent max-width="400px">
            <v-card>
                <v-card-title>
                    <span class="headline">Warning!</span>
                </v-card-title>
                <v-card-text class="black--text">
                    Anda yakin ingin menghapus data Reservasi ini? <br>
                </v-card-text>
                <v-card-text class="black--text">
                    Nama Customer : {{ formTodo.NAMA_CUSTOMER }} <br>
                    Nomor Meja : {{ formTodo.NOMOR_MEJA }} <br>
                    Tanggal Reservasi : {{ formTodo.TANGGAL_RESERVASI }} <br>
                    Jam/Sesi Reservasi : {{ formTodo.JAM_RESERVASI }} <br>
                    Status : {{ formTodo.STATUS_RESERVASI }} <br>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogConfirm = false">
                        Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="deleteMeja">
                        Delete
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogQr" presistent max-width="400px">
            <v-card>
                <v-card-text class="black--text">
                    <br>
                    Nama Customer : {{ formTodo.NAMA_CUSTOMER }} <br>
                    Nomor Meja : {{ formTodo.NOMOR_MEJA }} <br>
                    Tanggal Reservasi : {{ formTodo.TANGGAL_RESERVASI }} <br>
                    Jam/Sesi Reservasi : {{ formTodo.JAM_RESERVASI }} <br>
                    Status : {{ formTodo.STATUS_RESERVASI }}
                </v-card-text>
                <qrcode
                    :value="formTodo.ID_RESERVASI + '; '
                     + formTodo.ID_CUSTOMER + '; '
                     + formTodo.NOMOR_MEJA + '; '
                     + formTodo.NAMA_CUSTOMER + '; '"
                    ref="qr" :options="{ width: 200 }"></qrcode>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogQr = false">
                        Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="printQR">
                        Print
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
import Jspdf from "jspdf";
export default {
    name: "List",
    data() {
        return {
            role: localStorage.getItem('role'),
            search: null,
            dialog: false,
            dialogQr: false,
            dialogConfirm: false,
            snackbar: false,
            tanggal: false,
            valid: true,
            error_message: '',
            color: '',
            inputType: 'Tambah',
            deleteId: '',
            editId: '',
            headers: [
                {
                    text: "Nama Cust",
                    align: "start",
                    sortable: true,
                    value: "NAMA_CUSTOMER",
                },
                { text: "Nomor Meja", value: "NOMOR_MEJA" },
                { text: "Tanggal", value: "TANGGAL_RESERVASI" },
                { text: "Jam", value: "JAM_RESERVASI" },
                { text: "Status", value: "STATUS_RESERVASI" },
                { text: "Actions", value: "actions" },
            ],
            reservasi: new FormData,
            reservasis: [],
            customers: [],
            mejas: [],
            formTodo: {
                ID_RESERVASI: null,
                ID_MEJA: null,
                NOMOR_MEJA: null,
                ID_CUSTOMER: null,
                NAMA_CUSTOMER: null,
                ID_PESANAN: null,
                TANGGAL_RESERVASI: '',
                JAM_RESERVASI: '',
                STATUS_RESERVASI: '',
            },
        };
    },
    methods: {
        setForm() {
            if (this.$refs.form.validate()) {
                this.$refs.form.resetValidation()
                if (this.inputType === 'Tambah') {
                    this.save()
                } else {
                    this.update()
                }
            }
        },
        //read data karyawan
        readData() {
            var url = this.$api + '/reservasi'
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.reservasis = response.data.data 
                this.$http.get(this.$api + '/customer', {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.customers = response.data.data 
                })
                this.$http.get(this.$api + '/meja', {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.mejas = response.data.data 
                })
            })
        },
        //add karyawan
        save() {
            this.reservasi.append('ID_MEJA', this.formTodo.ID_MEJA);
            this.reservasi.append('ID_CUSTOMER', this.formTodo.ID_CUSTOMER);
            this.reservasi.append('TANGGAL_RESERVASI', this.formTodo.TANGGAL_RESERVASI);
            this.reservasi.append('JAM_RESERVASI', this.formTodo.JAM_RESERVASI);
            var url = this.$api + '/reservasi'
            this.load = true
            this.$http.post(url, this.reservasi, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.error_message = response.data.message;
                this.color = "green"
                this.snackbar = true;
                //this.load = false;
                this.close();
                this.readData(); //mengambil data
                this.resetForm();
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red"
                this.snackbar = true;
                //this.load = false;
            })
            this.resetForm();
            this.dialog = false;
        },
        //ubah data produk
        update() {
            let newData = {
                ID_MEJA: this.formTodo.ID_MEJA,
                ID_CUSTOMER: this.formTodo.ID_CUSTOMER,
                ID_PESANAN: this.formTodo.ID_PESANAN,
                TANGGAL_RESERVASI: this.formTodo.TANGGAL_RESERVASI,
                JAM_RESERVASI: this.formTodo.JAM_RESERVASI,
                STATUS_RESERVASI: this.formTodo.STATUS_RESERVASI,
            }
            var url = this.$api + '/reservasi/' + this.editId;
            this.$http.put(url, newData, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.error_message=response.data.message;
                this.color="green"
                this.snackbar=true;
                this.load = false;
                this.close();
                this.readData(); //mengambil data
                this.resetForm();
                this.inputType = 'Tambah';
            }).catch(error => {
                this.error_message=error.response.data.message;
                this.color="red"
                this.snackbar=true;
                this.load = false;
            }) 
        },
        deleteMeja() {
            var url = this.$api + '/reservasi/' + this.deleteId;
            this.$http.delete(url, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.error_message=response.data.message;
                this.color="green"
                this.snackbar=true;
                this.load = false;
                this.close();
                this.readData(); //mengambil data
                this.resetForm();
                this.inputType = 'Tambah';
            }).catch(error => {
                this.error_message=error.response.data.message;
                this.color="red"
                this.snackbar=true;
                this.load = false;
            }) 
        },
        editHandler(item) { //take isi item terus taro inputannya
            this.inputType = "Ubah";
            this.editId = item.ID_RESERVASI; //todo idk ini disimpen apa ngga, di guided ga disimpen
            this.formTodo.ID_MEJA = item.ID_MEJA;
            this.formTodo.ID_CUSTOMER = item.ID_CUSTOMER;
            this.formTodo.ID_PESANAN = item.ID_PESANAN;
            this.formTodo.TANGGAL_RESERVASI = item.TANGGAL_RESERVASI;
            this.formTodo.JAM_RESERVASI = item.JAM_RESERVASI;
            this.formTodo.STATUS_RESERVASI = item.STATUS_RESERVASI;
            this.dialog = true;
        },
        deleteHandler(item) {
            this.deleteId = item.ID_RESERVASI;
            this.formTodo.ID_MEJA = item.ID_MEJA;
            this.formTodo.NOMOR_MEJA = item.NOMOR_MEJA;
            this.formTodo.ID_CUSTOMER = item.ID_CUSTOMER;
            this.formTodo.NAMA_CUSTOMER = item.NAMA_CUSTOMER;
            this.formTodo.ID_PESANAN = item.ID_PESANAN;
            this.formTodo.TANGGAL_RESERVASI = item.TANGGAL_RESERVASI;
            this.formTodo.JAM_RESERVASI = item.JAM_RESERVASI;
            this.formTodo.STATUS_RESERVASI = item.STATUS_RESERVASI;
            this.dialogConfirm = true;
        },
        generateQRHandler(item){
            this.formTodo.ID_RESERVASI = item.ID_RESERVASI;
            this.formTodo.ID_MEJA = item.ID_MEJA;
            this.formTodo.NOMOR_MEJA = item.NOMOR_MEJA;
            this.formTodo.ID_CUSTOMER = item.ID_CUSTOMER;
            this.formTodo.NAMA_CUSTOMER = item.NAMA_CUSTOMER;
            this.formTodo.ID_PESANAN = item.ID_PESANAN;
            this.formTodo.TANGGAL_RESERVASI = item.TANGGAL_RESERVASI;
            this.formTodo.JAM_RESERVASI = item.JAM_RESERVASI;
            this.formTodo.STATUS_RESERVASI = item.STATUS_RESERVASI;
            this.dialogQr = true;
        },
        printQR(){
            const doc = new Jspdf('p', 'mm', [150, 100]) 
            const contentHtml = this.$refs.qr.$el
            const image = contentHtml.toDataURL('image/jpeg', 0.5)
            var img = 'data:image/png;base64,'+this.$img

            doc.addImage(img, 'JPEG', 5, 10, 90, 30)
            doc.text("Printed " + new Date().toLocaleString(), 50, 120, 'center');
            doc.text("Printed By " + localStorage.getItem('nama'), 50, 130, 'center');
            doc.addImage(image, 'JPEG', 24, 50)
            doc.save('QR.pdf')
        },
        close() {
            this.dialog = false
            this.dialogConfirm = false
            this.inputType = 'Tambah';
        },
        cancel() {
            this.resetForm();
            this.readData();
            this.$refs.form.resetValidation()
            this.dialog = false;
            this.inputType = 'Tambah';
        },
        resetForm() {
            this.$refs.form.resetValidation()
            this.formTodo = {
                ID_RESERVASI: null,
                ID_MEJA: null,
                NOMOR_MEJA: null,
                ID_CUSTOMER: null,
                NAMA_CUSTOMER: null,
                ID_PESANAN: null,
                TANGGAL_RESERVASI: '',
                JAM_RESERVASI: '',
                STATUS_RESERVASI: '',
            };
        },
    },
    computed: {
        formTitle() {
            return this.inputType
        },
    },
    mounted() {
        this.readData();
    }
};
</script>

<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium ml-3 mb-5">Bahan</h3>

        <v-card v-if="this.role === 'Chef' || this.role === 'Operational Manager'">
            <v-card-title>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details></v-text-field>
                <v-btn color="success ml-6 mr-6" dark @click="dialog = true">
                    Tambah Stok
                </v-btn>
                <v-btn color="success" dark @click="dialog = true">
                    Tambah Jenis Bahan
                </v-btn>
            </v-card-title>
            <v-data-table :headers="headers" :items="jbahans" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2" @click="stokHandler(item)">
                        Stok
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
                    <span class="headline">{{ formTitle }} Bahan</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-form v-model="valid" ref="form" lazy-validation>
                            <v-text-field
                                v-model="formTodo.NAMA_BAHAN"
                                label="Nama Bahan"
                                :rules="namaRules"
                                required></v-text-field>
                            <v-text-field
                                v-model="formTodo.PERHITUNGAN"
                                label="Perhitungan"
                                :rules="perhitunganRules"
                                required></v-text-field>
                            <v-text-field
                                v-model="formTodo.SERVING_SIZE"
                                label="Serving Size"
                                :rules="servingRules"
                                required></v-text-field>
                            <v-text-field
                                v-model="formTodo.UNIT_BAHAN"
                                label="Unit Bahan"
                                :rules="unitRules"
                                required></v-text-field>
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
                <v-card-text>
                    Anda yakin ingin menghapus Bahan ini?
                </v-card-text>
                <v-card-text class="black--text">
                    Nama Bahan : {{ formTodo.NAMA_BAHAN }} <br>
                    Perhitungan : {{ formTodo.PERHITUNGAN }} <br>
                    Serving Size : {{ formTodo.SERVING_SIZE }} <br>
                    Unit : {{ formTodo.UNIT_BAHAN }} <br>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogConfirm = false">
                        Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="deleteBahan">
                        Delete
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogStok" presistent max-width="400px">
            <v-card>
                <v-card-title>
                    <span class="headline">Tambah Stok</span>
                </v-card-title>
                <v-card-text class="black--text">
                    Info Stok :
                </v-card-text>
                <v-card-text class="black--text">
                    Nama Bahan : {{ formTodo.NAMA_BAHAN }} <br>
                    Perhitungan : {{ formTodo.PERHITUNGAN }} <br>
                    Stok : {{ formTodo.JUMLAH_BAHAN }} <br>
                </v-card-text>
                <v-container>
                    <v-form v-model="valid" ref="form" lazy-validation>
                        <v-text-field
                            v-model="formTodo.TAMBAH_STOK"
                            label="Tambah Stok"
                            required></v-text-field>
                        <v-text-field
                            v-model="formTodo.HARGA_STOK"
                            label="Harga Stok"
                            required></v-text-field>
                        <v-btn @click="add">
                            add
                        </v-btn>
                    </v-form>
                </v-container>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogStok = false">
                        Cancel
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
            role: localStorage.getItem('role'),
            search: null,
            dialog: false,
            dialogStok: false,
            dialogConfirm: false,
            snackbar: false,
            valid: true,
            error_message: '',
            color: '',
            inputType: 'Tambah',
            deleteId: '',
            editId: '',
            stokId: '',
            headers: [
                {
                    text: "Nama Bahan",
                    align: "start",
                    sortable: true,
                    value: "NAMA_BAHAN",
                },
                { text: "Perhitungan", value: "PERHITUNGAN" },
                { text: "Serving Size", value: "SERVING_SIZE" },
                { text: "Stok", value: "JUMLAH_BAHAN" },
                { text: "Unit Bahan", value: "UNIT_BAHAN" },
                { text: "Actions", value: "actions" },
            ],
            bahan: new FormData,
            jbahans: [],
            formTodo: {
                ID_BAHAN: null,
                NAMA_BAHAN: '',
                UNIT_BAHAN: '',
                PERHITUNGAN: '',
                SERVING_SIZE: '',
                JUMLAH_BAHAN: '',
                TAMBAH_STOK: '',
                HARGA_STOK: '',
            },
            namaRules: [
                v => !!v || 'Nama Bahan tidak boleh kosong',
                v => /^.{0,20}$/.test(v) || 'Maksimal Nama Bahan adalah 20 karakter',
            ],
            stokRules: [
                v => /^[0-9]+$/.test(v) || 'Stok Wajib Angka',
            ],
            unitRules: [
                v => !!v || 'Unit Bahan tidak boleh kosong',
                v => /^.{0,10}$/.test(v) || 'Maksimal Unit Bahan adalah 10 karakter',
            ],
            perhitunganRules: [
                v => !!v || 'Perhitungan tidak boleh kosong',
                v => /^.{0,100}$/.test(v) || 'Maksimal Perhitungan Bahan adalah 100 karakter',
            ],
            servingRules: [
                v => !!v || 'Serving Size tidak boleh kosong',
                v => /^[0-9]+$/.test(v) || 'Serving Size Wajib Angka',
            ],
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
            var url = this.$api + '/bahan'
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.jbahans = response.data.data  //todo check disini mungkin salah
                //console.log(response.data) //todo hapus ini (cuma buat ngecek)
            })
        },
        //add karyawan
        save() {
            this.bahan.append('NAMA_BAHAN', this.formTodo.NAMA_BAHAN);
            this.bahan.append('UNIT_BAHAN', this.formTodo.UNIT_BAHAN);
            this.bahan.append('PERHITUNGAN', this.formTodo.PERHITUNGAN);
            this.bahan.append('SERVING_SIZE', this.formTodo.SERVING_SIZE);
            this.bahan.append('JUMLAH_BAHAN', this.formTodo.JUMLAH_BAHAN);
            var url = this.$api + '/bahan'
            this.load = true
            this.$http.post(url, this.bahan, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.error_message = response.data.message;
                this.color = "green"
                this.snackbar = true;
                this.close();
                this.readData(); //mengambil data
                this.resetForm();
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red"
                this.snackbar = true;
            })
            this.resetForm();
            this.dialog = false;
        },
        //ubah data produk
        update() {
            let newData = {
                NAMA_BAHAN: this.formTodo.NAMA_BAHAN,
                UNIT_BAHAN: this.formTodo.UNIT_BAHAN,
                PERHITUNGAN: this.formTodo.PERHITUNGAN,
                SERVING_SIZE: this.formTodo.SERVING_SIZE,
                JUMLAH_BAHAN: this.formTodo.JUMLAH_BAHAN,
            }
            var url = this.$api + '/bahan/' + this.editId;
            this.load = true
            this.$http.put(url, newData, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.error_message=response.data.message;
                this.color="green"
                this.snackbar=true;
                this.close();
                this.readData(); //mengambil data
                this.resetForm();
                this.inputType = 'Tambah';
            }).catch(error => {
                this.error_message=error.response.data.message;
                this.color="red"
                this.snackbar=true;
            }) 
        },
        deleteBahan() {
            var url = this.$api + '/bahan/' + this.deleteId;
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
        stokHandler(item) {
            this.stokId = item.ID_BAHAN;
            this.formTodo.NAMA_BAHAN = item.NAMA_BAHAN;
            this.formTodo.UNIT_BAHAN = item.UNIT_BAHAN;
            this.formTodo.PERHITUNGAN = item.PERHITUNGAN;
            this.formTodo.SERVING_SIZE = item.SERVING_SIZE;
            this.formTodo.JUMLAH_BAHAN = item.JUMLAH_BAHAN;
            this.dialogStok = true;
        },
        editHandler(item) { //take isi item terus taro inputannya
            this.inputType = "Ubah";
            this.editId = item.ID_BAHAN; //todo idk ini disimpen apa ngga, di guided ga disimpen
            this.formTodo.NAMA_BAHAN = item.NAMA_BAHAN;
            this.formTodo.UNIT_BAHAN = item.UNIT_BAHAN;
            this.formTodo.PERHITUNGAN = item.PERHITUNGAN;
            this.formTodo.SERVING_SIZE = item.SERVING_SIZE;
            this.formTodo.JUMLAH_BAHAN = item.JUMLAH_BAHAN;
            this.dialog = true;
        },
        deleteHandler(item) {
            this.deleteId = item.ID_BAHAN;
            this.formTodo.NAMA_BAHAN = item.NAMA_BAHAN;
            this.formTodo.UNIT_BAHAN = item.UNIT_BAHAN;
            this.formTodo.PERHITUNGAN = item.PERHITUNGAN;
            this.formTodo.SERVING_SIZE = item.SERVING_SIZE;
            this.formTodo.JUMLAH_BAHAN = item.JUMLAH_BAHAN;
            this.dialogConfirm = true;
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
                ID_BAHAN: null,
                NAMA_BAHAN: '',
                UNIT_BAHAN: '',
                PERHITUNGAN: '',
                SERVING_SIZE: '',
                JUMLAH_BAHAN: '',
                TAMBAH_STOK: '',
                HARGA_STOK: '',
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

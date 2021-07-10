<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium ml-3 mb-5">Stok Masuk</h3>

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
                    Tambah Stok Masuk
                </v-btn>
            </v-card-title>
            <v-data-table :headers="headers" :items="stokmasuks" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
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
                    <span class="headline">{{ formTitle }} Stok Masuk</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-form v-model="valid" ref="form" lazy-validation>
                            <v-autocomplete
                                v-model="formTodo.ID_BAHAN"
                                :items="bahans"
                                item-text="NAMA_BAHAN"
                                item-value="ID_BAHAN"
                                :rules="[v => !!v || 'Bahan Tidak Boleh Kosong']"
                                label="Bahan"
                                required></v-autocomplete>
                            <v-text-field
                                v-model="formTodo.JUMLAH_STOK_MASUK"
                                label="Jumlah Stok Masuk"
                                :rules="jsmRules"
                                required></v-text-field>
                            <v-menu
                                v-model="tanggal"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="auto">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        v-model="formTodo.TANGGAL_STOK_MASUK"
                                        label="Tanggal Stok Masuk"
                                        :rules="[v => !!v || 'Tanggal Stok Masuk Tidak Boleh Kosong']"
                                        readonly
                                        required
                                        v-bind="attrs"
                                        v-on="on"></v-text-field>
                                </template>
                                <v-date-picker
                                    v-model="formTodo.TANGGAL_STOK_MASUK"
                                    @input="tanggal = false"></v-date-picker>
                            </v-menu>
                            <v-text-field
                                v-model="formTodo.HARGA_STOK_MASUK"
                                label="Harga Stok Masuk"
                                :rules="hsmRules"
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
                <v-card-text class="black--text">
                    Info Stok
                </v-card-text>
                <v-card-text class="black--text">
                    Nama Bahan : {{ formTodo.NAMA_BAHAN }} <br>
                    Jumlah Stok Masuk : {{ formTodo.JUMLAH_STOK_MASUK }} <br>
                    Tanggal Masuk : {{ formTodo.TANGGAL_STOK_MASUK }} <br>
                    Harga Stok : {{ formTodo.HARGA_STOK_MASUK }} <br>
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
                    text: "Nama Bahan",
                    align: "start",
                    sortable: true,
                    value: "NAMA_BAHAN",
                },
                { text: "Jumlah Stok Masuk", value: "JUMLAH_STOK_MASUK" },
                { text: "Tanggal Masuk", value: "TANGGAL_STOK_MASUK" },
                { text: "Harga Stok", value: "HARGA_STOK_MASUK" },
                { text: "Actions", value: "actions" },
            ],
            stokmasuk: new FormData,
            stokmasuks: [],
            bahans: [],
            jsmRules: [
                v => !!v || 'Jumlah Stok Masuk tidak boleh kosong',
                v => /^[0-9]*$/.test(v) || 'Jumlah Stok Masuk hanya boleh angka',
            ],
            hsmRules: [
                v => !!v || 'Harga Stok Masuk tidak boleh kosong',
                v => /^[0-9]*$/.test(v) || 'Harga Stok Masuk hanya boleh angka',
            ],
            formTodo: {
                ID_STOK_MASUK: null,
                ID_BAHAN: null,
                NAMA_BAHAN: '',
                JUMLAH_STOK_MASUK: '',
                TANGGAL_STOK_MASUK: '',
                HARGA_STOK_MASUK: '',
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
            var url = this.$api + '/stokmasuk'
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.stokmasuks = response.data.data
            })
            this.$http.get(this.$api + '/bahan', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.bahans = response.data.data 
            })
        },
        //add karyawan
        save() {
            this.stokmasuk.append('ID_BAHAN', this.formTodo.ID_BAHAN);
            this.stokmasuk.append('JUMLAH_STOK_MASUK', this.formTodo.JUMLAH_STOK_MASUK);
            this.stokmasuk.append('TANGGAL_STOK_MASUK', this.formTodo.TANGGAL_STOK_MASUK);
            this.stokmasuk.append('HARGA_STOK_MASUK', this.formTodo.HARGA_STOK_MASUK);
            var url = this.$api + '/stokmasuk'
            this.load = true
            this.$http.post(url, this.stokmasuk, {
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
                ID_BAHAN: this.formTodo.ID_BAHAN,
                JUMLAH_STOK_MASUK: this.formTodo.JUMLAH_STOK_MASUK,
                TANGGAL_STOK_MASUK: this.formTodo.TANGGAL_STOK_MASUK,
                HARGA_STOK_MASUK: this.formTodo.HARGA_STOK_MASUK,
            }
            var url = this.$api + '/stokmasuk/' + this.editId;
            this.load = true
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
            var url = this.$api + '/stokmasuk/' + this.deleteId;
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
            this.editId = item.ID_STOK_MASUK; //todo idk ini disimpen apa ngga, di guided ga disimpen
            this.formTodo.ID_BAHAN = item.ID_BAHAN;
            this.formTodo.NAMA_BAHAN = item.NAMA_BAHAN;
            this.formTodo.JUMLAH_STOK_MASUK = item.JUMLAH_STOK_MASUK;
            this.formTodo.TANGGAL_STOK_MASUK = item.TANGGAL_STOK_MASUK;
            this.formTodo.HARGA_STOK_MASUK = item.HARGA_STOK_MASUK;
            this.dialog = true;
        },
        deleteHandler(item) {
            this.deleteId = item.ID_STOK_MASUK; //todo idk ini disimpen apa ngga, di guided ga disimpen
            this.formTodo.ID_BAHAN = item.ID_BAHAN;
            this.formTodo.NAMA_BAHAN = item.NAMA_BAHAN;
            this.formTodo.JUMLAH_STOK_MASUK = item.JUMLAH_STOK_MASUK;
            this.formTodo.TANGGAL_STOK_MASUK = item.TANGGAL_STOK_MASUK;
            this.formTodo.HARGA_STOK_MASUK = item.HARGA_STOK_MASUK;
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
                NOMOR_MEJA: null,
                STATUS_MEJA: null,
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

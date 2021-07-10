<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium ml-3 mb-5">Menu</h3>

        <v-card v-if="this.role !== 'Owner' && this.role !== 'Operational Manager'">
            <v-card-title>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details></v-text-field>
            </v-card-title>
            <v-data-table :headers="nonheaders" :items="menus" :search="search">
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

        <v-card v-if="this.role === 'Owner' || this.role === 'Operational Manager'">
            <v-card-title>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details></v-text-field>
                <v-spacer></v-spacer>
                <v-btn color="success" dark @click="dialog = true">
                    Tambah Menu
                </v-btn>
            </v-card-title>
            <v-data-table :headers="headers" :items="menus" :search="search">
                <template v-slot:[`item.gambar`]="{ value }">
                    <img :src="`${value}`"/>
                </template>
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
                    <span class="headline">{{ formTitle }} Menu</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-form v-model="valid" ref="form" lazy-validation>
                            <v-text-field
                                v-model="formTodo.NAMA_MENU"
                                label="Nama Menu"
                                :rules="namaRules"
                                required></v-text-field>
                            <v-select
                                v-model="formTodo.ID_BAHAN"
                                :items="bahans"
                                item-text="NAMA_BAHAN"
                                item-value="ID_BAHAN"
                                :rules="[v => !!v || 'Bahan Tidak Boleh Kosong']"
                                label="Bahan"
                                required></v-select>
                            <v-radio-group
                                v-model="formTodo.JENIS_MENU"
                                row required
                                :rules="[v => !!v || 'Jenis Bahan Tidak Boleh Kosong']">
                                <v-radio
                                    label="Makanan Utama"
                                    value="Makanan Utama"></v-radio>
                                <v-radio
                                    label="Makanan Side Dish"
                                    value="Makanan Side Dish"></v-radio>
                                <v-radio
                                    label="Minuman"
                                    value="Minuman"></v-radio>
                            </v-radio-group>
                            <v-text-field
                                v-model="formTodo.DESKRIPSI_MENU"
                                label="Deskripsi Menu"
                                :rules="deskripsiRules"
                                required></v-text-field>
                            <!-- <v-text-field
                                v-model="formTodo.UNIT_MENU"
                                label="Unit Menu"

                                :rules="unitRules"
                                required></v-text-field> -->
                            <v-select
                                v-model="formTodo.UNIT_MENU"
                                :items="unitMenu"
                                item-text="text"
                                item-value="text"
                                :rules="unitRules"
                                label="Unit Menu"
                                required></v-select>
                            <v-text-field
                                v-model="formTodo.HARGA_MENU"
                                label="Harga Menu"
                                :rules="hargaRules"
                                required></v-text-field>
                            <v-text-field
                                v-model="formTodo.gambar"
                                label="Gambar Menu"></v-text-field>
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

        <v-dialog v-model="dialogConfirm" presistent max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">Warning!</span>
                </v-card-title>
                <v-card-text class="black--text">
                    Anda yakin ingin menghapus Menu ini?
                </v-card-text>
                <v-card-text class="black--text">
                    Nama Menu : {{ formTodo.NAMA_MENU }} <br>
                    Nama Bahan : {{ formTodo.NAMA_BAHAN }} <br>
                    Jenis Menu : {{ formTodo.JENIS_MENU }} <br>
                    Deskripsi Menu : {{ formTodo.DESKRIPSI_MENU }} <br>
                    Unit Menu : {{ formTodo.UNIT_MENU }} <br>
                    Harga Menu : {{ formTodo.HARGA_MENU }} <br>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogConfirm = false">
                        Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="deleteMenu">
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
            valid: true,
            error_message: '',
            color: '',
            inputType: 'Tambah',
            deleteId: '',
            editId: '',
            headers: [
                {
                    text: "Nama Menu",
                    align: "start",
                    sortable: true,
                    value: "NAMA_MENU",
                },
                { text: "Bahan", value: "NAMA_BAHAN" },
                { text: "Jenis", value: "JENIS_MENU" },
                { text: "Deskripsi", value: "DESKRIPSI_MENU" },
                { text: "Image", value: "gambar" },
                { text: "Unit", value: "UNIT_MENU" },
                { text: "Harga", value: "HARGA_MENU" },
                { text: "Actions", value: "actions" },
            ],
            unitMenu: [
                { text: "gram" },
                { text: "mililiter" },
                { text: "kilogram" },
            ],
            nonheaders: [
                {
                    text: "Nama Menu",
                    align: "start",
                    sortable: true,
                    value: "NAMA_MENU",
                },
                { text: "Bahan", value: "NAMA_BAHAN" },
                { text: "Jenis", value: "JENIS_MENU" },
                { text: "Deskripsi", value: "DESKRIPSI_MENU" },
                { text: "Image", value: "gambar" },
                { text: "Unit", value: "UNIT_MENU" },
                { text: "Harga", value: "HARGA_MENU" },
            ],
            menu: new FormData,
            menus: [],
            bahans: [],
            formTodo: {
                ID_MENU: null,
                ID_BAHAN: null,
                NAMA_MENU: '',
                NAMA_BAHAN: '',
                JENIS_MENU: '',
                DESKRIPSI_MENU: '',
                UNIT_MENU: '',
                HARGA_MENU: '',
                gambar: '',
            },
            namaRules: [
                v => !!v || 'Nama Menu tidak boleh kosong',
                v => /^.{0,50}$/.test(v) || 'Maksimal Nama Menu adalah 50 karakter',
            ],
            deskripsiRules: [
                v => !!v || 'Deskripsi Menu tidak boleh kosong',
                v => /^.{0,100}$/.test(v) || 'Maksimal Deskripsi Menu adalah 100 karakter',
            ],
            unitRules: [
                v => !!v || 'Unit Menu tidak boleh kosong',
                v => /^.{0,10}$/.test(v) || 'Maksimal Unit Menu adalah 10 karakter',
            ],
            hargaRules: [
                v => /^[0-9]+$/.test(v) || 'Harga Wajib Angka',
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
            var url = this.$api + '/menu'
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.menus = response.data.data  //todo check disini mungkin salah
                this.$http.get(this.$api + '/bahan', {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.bahans = response.data.data  //todo check disini mungkin salah
                })
            })
        },
        //add karyawan
        save() {
            this.menu.append('NAMA_MENU', this.formTodo.NAMA_MENU);
            this.menu.append('ID_BAHAN', this.formTodo.ID_BAHAN);
            this.menu.append('JENIS_MENU', this.formTodo.JENIS_MENU);
            this.menu.append('DESKRIPSI_MENU', this.formTodo.DESKRIPSI_MENU);
            this.menu.append('UNIT_MENU', this.formTodo.UNIT_MENU);
            this.menu.append('HARGA_MENU', this.formTodo.HARGA_MENU);
            this.menu.append('gambar', this.formTodo.gambar);
            var url = this.$api + '/menu'
            this.load = true
            this.$http.post(url, this.menu, {
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
                NAMA_MENU: this.formTodo.NAMA_MENU,
                ID_BAHAN: this.formTodo.ID_BAHAN,
                JENIS_MENU: this.formTodo.JENIS_MENU,
                DESKRIPSI_MENU: this.formTodo.DESKRIPSI_MENU,
                UNIT_MENU: this.formTodo.UNIT_MENU,
                HARGA_MENU: this.formTodo.HARGA_MENU,
                gambar: this.formTodo.gambar,
            }
            var url = this.$api + '/menu/' + this.editId;
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
        deleteMenu() {
            var url = this.$api + '/menu/' + this.deleteId;
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
            this.editId = item.ID_MENU; //todo idk ini disimpen apa ngga, di guided ga disimpen
            this.formTodo.ID_BAHAN = item.ID_BAHAN;
            this.formTodo.NAMA_MENU = item.NAMA_MENU;
            this.formTodo.NAMA_BAHAN = item.NAMA_BAHAN;
            this.formTodo.JENIS_MENU = item.JENIS_MENU;
            this.formTodo.DESKRIPSI_MENU = item.DESKRIPSI_MENU;
            this.formTodo.UNIT_MENU = item.UNIT_MENU;
            this.formTodo.HARGA_MENU = item.HARGA_MENU;
            this.formTodo.gambar = item.gambar;
            this.dialog = true;
        },
        deleteHandler(item) {
            this.deleteId = item.ID_MENU;
            this.formTodo.ID_BAHAN = item.ID_BAHAN;
            this.formTodo.NAMA_MENU = item.NAMA_MENU;
            this.formTodo.NAMA_BAHAN = item.NAMA_BAHAN;
            this.formTodo.JENIS_MENU = item.JENIS_MENU;
            this.formTodo.DESKRIPSI_MENU = item.DESKRIPSI_MENU;
            this.formTodo.UNIT_MENU = item.UNIT_MENU;
            this.formTodo.HARGA_MENU = item.HARGA_MENU;
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
                ID_MENU: null,
                ID_BAHAN: null,
                NAMA_MENU: '',
                NAMA_BAHAN: '',
                JENIS_MENU: '',
                DESKRIPSI_MENU: '',
                UNIT_MENU: '',
                HARGA_MENU: '',
                gambar: '',
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

<template>
    <v-main class="list" v-if="this.role === 'Owner' || this.role === 'Operational Manager'">
        <h3 class="text-h3 font-weight-medium ml-3 mb-5">Karyawan</h3>

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
                    Tambah Karyawan
                </v-btn>
            </v-card-title>
            <!-- tabel khusus Operational Manager -->
            <v-data-table 
                v-if="this.role === 'Operational Manager'"
                :headers="headers" :items="karyawans" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn
                        v-if="item.NAMA_ROLE !== 'Owner'"
                        small class="mr-2" @click="editHandler(item)">
                        Ubah
                    </v-btn>
                    <v-btn
                        small @click="nonActiveHandler(item)"
                        v-if="item.TANGGAL_KELUAR_KARYAWAN==null && item.NAMA_ROLE !== 'Owner'">
                        Nonaktif
                    </v-btn>
                </template>
            </v-data-table>
            <!-- tabel khusus owner -->
            <v-data-table 
                v-if="this.role === 'Owner'"
                :headers="headers" :items="karyawans" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn
                        small class="mr-2" @click="editHandler(item)">
                        Ubah
                    </v-btn>
                    <v-btn
                        small @click="nonActiveHandler(item)"
                        v-if="item.TANGGAL_KELUAR_KARYAWAN==null && item.NAMA_ROLE !== 'Owner'">
                        Nonaktif
                    </v-btn>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }} Karyawan</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-form v-model="valid" ref="form" lazy-validation>
                            <v-text-field
                                v-model="formTodo.NAMA_KARYAWAN"
                                label="Nama"
                                :rules="namaRules"
                                required></v-text-field>
                            <v-text-field
                                v-model="formTodo.NO_TELP_KARYAWAN"
                                label="No. Telp"
                                :rules="notelpRules"
                                required></v-text-field>
                            <v-radio-group
                                v-model="formTodo.JENIS_KELAMIN_KARYAWAN"
                                row required
                                :rules="[v => !!v || 'Jenis Kelamin Tidak Boleh Kosong']">
                                <v-radio
                                    label="Laki-laki"
                                    value="Laki-laki"></v-radio>
                                <v-radio
                                    label="Perempuan"
                                    value="Perempuan"></v-radio>
                            </v-radio-group>
                            <v-menu
                                v-model="menu"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="auto">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        v-model="formTodo.TANGGAL_LAHIR_KARYAWAN"
                                        label="Tanggal Lahir Karyawan"
                                        :rules="[v => !!v || 'Tanggal Lahir Tidak Boleh Kosong']"
                                        readonly
                                        required
                                        v-bind="attrs"
                                        v-on="on"></v-text-field>
                                </template>
                                <v-date-picker
                                    v-model="formTodo.TANGGAL_LAHIR_KARYAWAN"
                                    @input="menu = false"></v-date-picker>
                            </v-menu>
                            <v-text-field
                                v-model="formTodo.EMAIL_KARYAWAN"
                                label="Email"
                                :rules="emailRules"
                                required></v-text-field>
                            <v-menu
                                v-model="menu2"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="auto">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        v-model="formTodo.TANGGAL_MASUK_KARYAWAN"
                                        label="Tanggal Masuk Karyawan"
                                        :rules="[v => !!v || 'Tanggal Masuk Tidak Boleh Kosong']"
                                        readonly
                                        required
                                        v-bind="attrs"
                                        v-on="on"></v-text-field>
                                </template>
                                <v-date-picker
                                    v-model="formTodo.TANGGAL_MASUK_KARYAWAN"
                                    @input="menu2 = false"></v-date-picker>
                            </v-menu>
                            <v-select
                                v-if="this.role !== 'Owner'"
                                v-model="formTodo.NAMA_ROLE"
                                :items="[{ text: 'Owner', disabled: true }, 'Operational Manager', 'Waiter', 'Cashier', 'Chef']"
                                :rules="[v => !!v || 'Role Tidak Boleh Kosong']"
                                label="Role"
                                required></v-select>
                            <v-select
                                v-if="this.role === 'Owner'"
                                v-model="formTodo.NAMA_ROLE"
                                :items="['Owner', 'Operational Manager', 'Waiter', 'Cashier', 'Chef']"
                                :rules="[v => !!v || 'Role Tidak Boleh Kosong']"
                                label="Role"
                                required></v-select>
                            <v-text-field
                                label="Password"
                                v-model="formTodo.password"
                                :rules="[v => !!v || 'Password Tidak Boleh Kosong']"
                                v-if="formTitle == 'Tambah'"
                                type="password" counter required></v-text-field>
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
                    <span class="headline red--text">Warning!</span>
                </v-card-title>
                <v-card-text class="black--text">
                    Anda yakin ingin menonaktifkan karyawan ini?
                </v-card-text>
                <v-card-text class="black--text">
                    Nama : {{ formTodo.NAMA_KARYAWAN }} <br>
                    No. Telp : {{ formTodo.NO_TELP_KARYAWAN }} <br>
                    Jenis Kelamin : {{ formTodo.JENIS_KELAMIN_KARYAWAN }} <br>
                    Email : {{ formTodo.EMAIL_KARYAWAN }} <br>
                    Role : {{ formTodo.NAMA_ROLE }} <br>
                    Tanggal Lahir : {{ formTodo.TANGGAL_LAHIR_KARYAWAN }} <br>
                    Tanggal Masuk : {{ formTodo.TANGGAL_MASUK_KARYAWAN }} <br>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogConfirm = false">
                        Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="nonActive">
                        Nonaktif
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
            search: null,
            dialog: false,
            dialogConfirm: false,
            snackbar: false,
            valid: true,
            menu: false,
            menu2: false,
            role: localStorage.getItem('role'),
            error_message: '',
            color: '',
            inputType: 'Tambah',
            deleteId: '',
            editId: '',
            headers: [
                {
                    text: "Nama",
                    align: "start",
                    sortable: true,
                    value: "NAMA_KARYAWAN",
                },
                { text: "Role", value: "NAMA_ROLE" },
                { text: "No. Telp", value: "NO_TELP_KARYAWAN" },
                { text: "Jenis Kelamin", value: "JENIS_KELAMIN_KARYAWAN" },
                { text: "Tanggal Lahir", value: "TANGGAL_LAHIR_KARYAWAN" },
                { text: "Email", value: "EMAIL_KARYAWAN" },
                { text: "Tgl Masuk", value: "TANGGAL_MASUK_KARYAWAN" },
                { text: "Tgl Keluar", value: "TANGGAL_KELUAR_KARYAWAN" },
                { text: "Actions", value: "actions" },
            ],
            karyawan: new FormData,
            karyawans: [],
            roles: [],
            formTodo: {
                id: null,
                NAMA_KARYAWAN: '',
                NO_TELP_KARYAWAN: '',
                JENIS_KELAMIN_KARYAWAN: '',
                TANGGAL_LAHIR_KARYAWAN: '',
                EMAIL_KARYAWAN: '',
                TANGGAL_MASUK_KARYAWAN: '',
                TANGGAL_KELUAR_KARYAWAN: '',
                NAMA_ROLE: '',
                password: '',
            },
            namaRules: [
                v => !!v || 'Nama tidak boleh kosong',
                v => /^[a-zA-Z\s]*$/.test(v) || 'Nama salah (Hanya boleh A-Z & a-z)',
            ],
            emailRules: [
                v => !!v || 'E-mail tidak boleh kosong',
                v => /.+@.+\..+/.test(v) || 'E-mail tidak valid',
            ],
            notelpRules: [
                v => !!v || 'No. Telp tidak boleh kosong',
                v => /^08[0-9]{8,11}$/.test(v) || 'No. Telp tidak valid',
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
            var url = this.$api + '/karyawan'
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.karyawans = response.data.data  //todo check disini mungkin salah
                //console.log(response.data) //todo hapus ini (cuma buat ngecek)
            })
        },
        //add karyawan
        save() {
            this.karyawan.append('NAMA_KARYAWAN', this.formTodo.NAMA_KARYAWAN);
            this.karyawan.append('NO_TELP_KARYAWAN', this.formTodo.NO_TELP_KARYAWAN);
            this.karyawan.append('JENIS_KELAMIN_KARYAWAN', this.formTodo.JENIS_KELAMIN_KARYAWAN);
            this.karyawan.append('TANGGAL_LAHIR_KARYAWAN', this.formTodo.TANGGAL_LAHIR_KARYAWAN);
            this.karyawan.append('EMAIL_KARYAWAN', this.formTodo.EMAIL_KARYAWAN);
            this.karyawan.append('TANGGAL_MASUK_KARYAWAN', this.formTodo.TANGGAL_MASUK_KARYAWAN);
            this.karyawan.append('NAMA_ROLE', this.formTodo.NAMA_ROLE);
            this.karyawan.append('password', this.formTodo.password);
            var url = this.$api + '/register'
            this.load = true
            this.$http.post(url, this.karyawan, {
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
                NAMA_KARYAWAN: this.formTodo.NAMA_KARYAWAN,
                NO_TELP_KARYAWAN: this.formTodo.NO_TELP_KARYAWAN,
                JENIS_KELAMIN_KARYAWAN: this.formTodo.JENIS_KELAMIN_KARYAWAN,
                TANGGAL_LAHIR_KARYAWAN: this.formTodo.TANGGAL_LAHIR_KARYAWAN,
                EMAIL_KARYAWAN: this.formTodo.EMAIL_KARYAWAN,
                TANGGAL_MASUK_KARYAWAN: this.formTodo.TANGGAL_MASUK_KARYAWAN,
                NAMA_ROLE: this.formTodo.NAMA_ROLE,
            }
            var url = this.$api + '/karyawan/' + this.editId;
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
        nonActive() {
            var url = this.$api + '/karyawannonactive/' + this.deleteId;
            this.$http.put(url, 1, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.error_message=response.data.message;
                this.color="green"
                this.snackbar=true;
                this.load = false;
                this.dialogConfirm = false;
                this.close();
                this.readData(); //mengambil data
                this.resetForm();
                this.inputType = 'Tambah';
            }).catch(error => {
                this.error_message=error.response.data.message;
                this.color="red"
                this.snackbar=true;
                this.load = false;
                this.dialogConfirm = false;
            }) 
        },
        editHandler(item) { //take isi item terus taro inputannya
            this.inputType = "Ubah";
            this.editId = item.id; //todo idk ini disimpen apa ngga, di guided ga disimpen
            this.formTodo.NAMA_KARYAWAN = item.NAMA_KARYAWAN;
            this.formTodo.NO_TELP_KARYAWAN = item.NO_TELP_KARYAWAN;
            this.formTodo.JENIS_KELAMIN_KARYAWAN = item.JENIS_KELAMIN_KARYAWAN;
            this.formTodo.TANGGAL_LAHIR_KARYAWAN = item.TANGGAL_LAHIR_KARYAWAN;
            this.formTodo.EMAIL_KARYAWAN = item.EMAIL_KARYAWAN;
            this.formTodo.TANGGAL_MASUK_KARYAWAN = item.TANGGAL_MASUK_KARYAWAN;
            this.formTodo.NAMA_ROLE = item.NAMA_ROLE;
            this.dialog = true;
        },
        nonActiveHandler(item) {
            this.deleteId = item.id;
            this.formTodo.NAMA_KARYAWAN = item.NAMA_KARYAWAN;
            this.formTodo.NO_TELP_KARYAWAN = item.NO_TELP_KARYAWAN;
            this.formTodo.JENIS_KELAMIN_KARYAWAN = item.JENIS_KELAMIN_KARYAWAN;
            this.formTodo.TANGGAL_LAHIR_KARYAWAN = item.TANGGAL_LAHIR_KARYAWAN;
            this.formTodo.EMAIL_KARYAWAN = item.EMAIL_KARYAWAN;
            this.formTodo.TANGGAL_MASUK_KARYAWAN = item.TANGGAL_MASUK_KARYAWAN;
            this.formTodo.NAMA_ROLE = item.NAMA_ROLE;
            this.dialogConfirm = true;
        },
        close() {
            this.dialog = false
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
                nama: null,
                notelp: null,
                jeniskelamin: null,
                tanggallahir: null,
                email: null,
                tanggalmasuk: null,
                tanggalkeluar: null,
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

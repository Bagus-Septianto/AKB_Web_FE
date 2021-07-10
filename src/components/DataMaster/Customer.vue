<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium ml-3 mb-5">Customer</h3>

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
                    Tambah Customer
                </v-btn>
            </v-card-title>
            <v-data-table :headers="headers" :items="customers" :search="search">
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
                    <span class="headline">{{ formTitle }} Customer</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-form v-model="valid" ref="form" lazy-validation>
                            <v-text-field
                                v-model="formTodo.NAMA_CUSTOMER"
                                label="Nama Customer"
                                :rules="namaRules"
                                required></v-text-field>
                            <v-radio-group
                                v-model="formTodo.JENIS_KELAMIN_CUSTOMER"
                                row required
                                :rules="[v => !!v || 'Jenis Kelamin Tidak Boleh Kosong']">
                                <v-radio
                                    label="Laki-laki"
                                    value="Laki-laki"></v-radio>
                                <v-radio
                                    label="Perempuan"
                                    value="Perempuan"></v-radio>
                            </v-radio-group>
                            <v-text-field
                                v-model="formTodo.NO_TELP_CUSTOMER"
                                label="No. Telp Customer"
                                :rules="notelpRules"
                                required></v-text-field>
                            <v-text-field
                                v-model="formTodo.EMAIL_CUSTOMER"
                                label="Email"
                                :rules="emailRules"
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
                    Anda yakin ingin menghapus data Customer ini?
                </v-card-text>
                <v-card-text>
                    Nama : {{ formTodo.NAMA_CUSTOMER }}
                </v-card-text>
                <v-card-text>
                    Jenis Kelamin : {{ formTodo.JENIS_KELAMIN_CUSTOMER }}
                </v-card-text>
                <v-card-text>
                    No. Telp : {{ formTodo.NO_TELP_CUSTOMER }}
                </v-card-text>
                <v-card-text>
                    Email : {{ formTodo.EMAIL_CUSTOMER }}
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogConfirm = false">
                        Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="deleteCustomer">
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
                    text: "Nama Customer",
                    align: "start",
                    sortable: true,
                    value: "NAMA_CUSTOMER",
                },
                { text: "Jenis Kelamin", value: "JENIS_KELAMIN_CUSTOMER" },
                { text: "No. Telp", value: "NO_TELP_CUSTOMER" },
                { text: "Email Customer", value: "EMAIL_CUSTOMER" },
                { text: "Actions", value: "actions" },
            ],
            customer: new FormData,
            customers: [],
            formTodo: {
                ID_CUSTOMER: null,
                NAMA_CUSTOMER: '',
                JENIS_KELAMIN_CUSTOMER: '',
                NO_TELP_CUSTOMER: '',
                EMAIL_CUSTOMER: '',
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
                if (this.inputType === 'Tambah') {
                    this.$refs.form.resetValidation()
                    this.save()
                } else {
                    this.$refs.form.resetValidation()
                    this.update()
                }
            }
        },
        //read data customer
        readData() {
            var url = this.$api + '/customer'
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.customers = response.data.data  //todo check disini mungkin salah
                //console.log(response.data) //todo hapus ini (cuma buat ngecek)
            })
        },
        //add karyawan
        save() {
            this.customer.append('NAMA_CUSTOMER', this.formTodo.NAMA_CUSTOMER);
            this.customer.append('JENIS_KELAMIN_CUSTOMER', this.formTodo.JENIS_KELAMIN_CUSTOMER);
            this.customer.append('NO_TELP_CUSTOMER', this.formTodo.NO_TELP_CUSTOMER);
            this.customer.append('EMAIL_CUSTOMER', this.formTodo.EMAIL_CUSTOMER);
            var url = this.$api + '/customer'
            this.$http.post(url, this.customer, {
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
                NAMA_CUSTOMER: this.formTodo.NAMA_CUSTOMER,
                JENIS_KELAMIN_CUSTOMER: this.formTodo.JENIS_KELAMIN_CUSTOMER,
                NO_TELP_CUSTOMER: this.formTodo.NO_TELP_CUSTOMER,
                EMAIL_CUSTOMER: this.formTodo.EMAIL_CUSTOMER,
            }
            var url = this.$api + '/customer/' + this.editId;
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
        deleteCustomer() {
            var url = this.$api + '/customer/' + this.deleteId;
            this.$http.delete(url, {
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
        editHandler(item) { //take isi item terus taro inputannya
            this.inputType = "Ubah";
            this.editId = item.ID_CUSTOMER; //todo idk ini disimpen apa ngga, di guided ga disimpen
            this.formTodo.NAMA_CUSTOMER = item.NAMA_CUSTOMER;
            this.formTodo.JENIS_KELAMIN_CUSTOMER = item.JENIS_KELAMIN_CUSTOMER;
            this.formTodo.NO_TELP_CUSTOMER = item.NO_TELP_CUSTOMER;
            this.formTodo.EMAIL_CUSTOMER = item.EMAIL_CUSTOMER;
            this.dialog = true;
        },
        deleteHandler(item) {
            this.deleteId = item.ID_CUSTOMER;
            this.formTodo.NAMA_CUSTOMER = item.NAMA_CUSTOMER;
            this.formTodo.JENIS_KELAMIN_CUSTOMER = item.JENIS_KELAMIN_CUSTOMER;
            this.formTodo.NO_TELP_CUSTOMER = item.NO_TELP_CUSTOMER;
            this.formTodo.EMAIL_CUSTOMER = item.EMAIL_CUSTOMER;
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
                NAMA_CUSTOMER: null,
                JENIS_KELAMIN_CUSTOMER: null,
                NO_TELP_CUSTOMER: null,
                EMAIL_CUSTOMER: null,
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

<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium ml-3 mb-5">Meja</h3>

        <v-card v-if="this.role !== 'Owner' && this.role !== 'Operational Manager'">
            <v-card-title>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details></v-text-field>
            </v-card-title>
            <v-data-table :headers="nonheaders" :items="mejas" :search="search">
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
                    Tambah Meja
                </v-btn>
            </v-card-title>
            <v-data-table :headers="headers" :items="mejas" :search="search">
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
                    <span class="headline">{{ formTitle }} Meja</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-form v-model="valid" ref="form" lazy-validation>
                            <v-text-field
                                v-model="formTodo.NOMOR_MEJA"
                                label="Nomor Meja"
                                :rules="[v => !!v || 'Nomor Meja Tidak Boleh Kosong']"
                                required></v-text-field>
                            <v-select
                                v-model="formTodo.STATUS_MEJA"
                                :items="['Tersedia', 'Tidak Tersedia']"
                                v-if="formTitle == 'Ubah'"
                                :rules="[v => !!v || 'Status Meja Tidak Boleh Kosong']"
                                label="Status Meja"
                                required></v-select>
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
                    Anda yakin ingin menghapus Meja ini?
                </v-card-text>
                <v-card-text>
                    Nomor Meja : {{ formTodo.NOMOR_MEJA }}
                </v-card-text>
                <v-card-text>
                    Status Meja : {{ formTodo.STATUS_MEJA }}
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
            valid: true,
            error_message: '',
            color: '',
            inputType: 'Tambah',
            deleteId: '',
            editId: '',
            headers: [
                {
                    text: "Nomor Meja",
                    align: "start",
                    sortable: true,
                    value: "NOMOR_MEJA",
                },
                { text: "Status Meja", value: "STATUS_MEJA" },
                { text: "Actions", value: "actions" },
            ],
            nonheaders: [
                {
                    text: "Nomor Meja",
                    align: "start",
                    sortable: true,
                    value: "NOMOR_MEJA",
                },
                { text: "Status Meja", value: "STATUS_MEJA" },
            ],
            meja: new FormData,
            mejas: [],
            formTodo: {
                ID_MEJA: null,
                NOMOR_MEJA: '',
                STATUS_MEJA: '',
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
            var url = this.$api + '/meja'
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.mejas = response.data.data  //todo check disini mungkin salah
                //console.log(response.data) //todo hapus ini (cuma buat ngecek)
            })
        },
        //add karyawan
        save() {
            this.meja.append('NOMOR_MEJA', this.formTodo.NOMOR_MEJA);
            this.meja.append('STATUS_MEJA', this.formTodo.STATUS_MEJA);
            var url = this.$api + '/meja'
            this.load = true
            this.$http.post(url, this.meja, {
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
                NOMOR_MEJA: this.formTodo.NOMOR_MEJA,
                STATUS_MEJA: this.formTodo.STATUS_MEJA,
            }
            var url = this.$api + '/meja/' + this.editId;
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
            var url = this.$api + '/meja/' + this.deleteId;
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
            this.editId = item.ID_MEJA; //todo idk ini disimpen apa ngga, di guided ga disimpen
            this.formTodo.NOMOR_MEJA = item.NOMOR_MEJA;
            this.formTodo.STATUS_MEJA = item.STATUS_MEJA;
            this.dialog = true;
        },
        deleteHandler(item) {
            this.deleteId = item.ID_MEJA;
            this.formTodo.NOMOR_MEJA = item.NOMOR_MEJA;
            this.formTodo.STATUS_MEJA = item.STATUS_MEJA;
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

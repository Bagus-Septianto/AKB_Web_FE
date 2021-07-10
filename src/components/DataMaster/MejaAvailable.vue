<template>
    <v-main class="list">
        <v-row dense>
            <v-col
                v-for="(itemmeja, idx) in mejas"
                :key="idx"
                xs="3" sm="3" md="3" lg="3" xl="3">
                <!-- if broken then change to 
                v-for="itemmeja in mejas"
                :key="itemmeja" -->
                <v-card
                    v-if="itemmeja.STATUS_MEJA == 'Tidak Tersedia'"
                    class="pa-4 rounded-lg"
                    outlined
                    tile
                    color="red darken-1 white--text"
                >
                    <v-card-title>
                        {{ itemmeja.NOMOR_MEJA }} 
                    </v-card-title>
                        <br> Status: {{ itemmeja.STATUS_MEJA}}
                </v-card>
                <v-card
                    v-if="itemmeja.STATUS_MEJA == 'Tersedia'"
                    class="pa-4 rounded-lg"
                    outlined
                    tile
                    color="green darken-1 white--text"
                >
                    <v-card-title>
                        {{ itemmeja.NOMOR_MEJA }} 
                    </v-card-title>
                        <br> Status: {{ itemmeja.STATUS_MEJA}}
                </v-card>
            </v-col>
        </v-row>
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
                console.log(response.data) //todo hapus ini (cuma buat ngecek)
            }).catch(error => {
                console.log(error)
                this.error_message=error.response.message;
            })
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

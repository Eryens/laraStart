<template>
    <div class="container mt-5">
        <div class="row">
          <div class="col-md-12">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Users Table</h3>

                <div class="card-tools">
                    <button class="btn btn-success" @click="OpenCreateModal">
                        Add new
                        <i class="fas fa-user-plus"></i>
                    </button>
                </div>
              </div>
              <!-- /.card-header -->
              <div class="card-body table-responsive p-0">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Created at</th>
                      <th>Modify</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="user in users" :key="user.id">
                        <td>{{user.id}}</td>
                        <td>{{user.name}}</td>
                        <td>{{user.email}}</td>
                        <td>{{user.created_at|date}}</td>
                        <td>
                            <a class="btn" @click="OpenEditModal(user)">
                              <i class="fa fa-edit color-blue"></i>
                          </a>
                          /
                          
                          <a v-if="user.id != currentUserId"  class="btn" @click="deleteUser(user.id)">
                              <i class="fa fa-trash color-red"></i>
                          </a>
                        </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!-- /.card-body -->
            </div>
            <!-- /.card -->
          </div>
        </div>

        <!-- Modal -->
        <form @submit.prevent="editMode ? updateUser() : createUser()">
            <div class="modal fade" id="addNew" tabindex="-1" role="dialog" aria-labelledby="addNewLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 v-show="!editMode" class="modal-title" id="addNewLabel">Create a user</h5>
                        <h5 v-show="editMode" class="modal-title" id="addNewLabel">Edit a user</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        
                        <div class="form-group">
                            <input v-model="form.name" type="text" name="name" placeholder="Name"
                            class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
                            <has-error :form="form" field="name"></has-error>
                        </div>

                        <div class="form-group">
                            <input v-model="form.email" type="text" name="email" placeholder="Email"
                            class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
                            <has-error :form="form" field="email"></has-error>
                        </div>

                        <div class="form-group">
                            <input v-model="form.password" type="password" name="password" placeholder="Password"
                            class="form-control" :class="{ 'is-invalid': form.errors.has('password') }">
                            <has-error :form="form" field="password"></has-error>
                        </div>

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button v-show="!editMode" type="submit" class="btn btn-primary">Create</button>
                        <button v-show="editMode" type="submit" class="btn btn-primary">Update</button>
                    </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                users: [],
                form: new Form( {
                    name: '',
                    email: '',
                    password: '',
                }),
                currentUserId: this.$userId,
                editMode: false,
            }
        },
        methods: {

            OpenCreateModal() {
                this.editMode = false;
                this.form.clear(); // resets the field of the form from vform
                this.form.reset();
                $('#addNew').modal('show');
            },

            
            OpenEditModal(user) {
                this.editMode = true;
                this.form.clear(); // resets the field of the form from vform
                this.form.reset();
                this.form.fill(user); // whaaat vform is op
                $('#addNew').modal('show');
            },
            
            loadUsers() {
                // Does a get request to api/user (here redirected to api/user/index) which returns all users
                // then puts the data in the users variable we defined above
                // To get the content (the object) of the data we must do data.data 
                axios.get("api/user").then(({data}) => (this.users = data.data));
            },

            createUser() {
                this.$Progress.start();
                this.form.post('api/user').then(() => 
                {
                    $('#addNew').modal('hide');
                    
                    // Registers an event that can be used everywhere in the app
                    Fire.$emit('TableUpdate');

                    Toast.fire({
                        type: 'success',
                        title: 'User created successfully',
                    });
                    this.$Progress.finish();
                }).catch(e => {
                    console.log(e);
                    
                    this.$Progress.fail();
                });
            },

            updateUser() {
                console.log('i got clicked !');
            },

            deleteUser(id) {
                swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
                }).then((result) => {

                    // Send to server   
                    this.form.delete('api/user/'+id).then(() => 
                    {
                        if (result.value) 
                        {
                            swal.fire(
                            'Deleted!',
                            'Your file has been deleted.',
                            'success'
                            );
                            
                            Fire.$emit('TableUpdate');
                        }
                    }).catch((error) => {
                        swal.fire(
                            'Attention gamers!',
                            'Something went wrong',
                            'warning'
                            );
                        console.log(error);
                    });

                    
                })
            },
        },
        // created
        mounted() {
            console.log(this.$userId)

            this.loadUsers();

            Fire.$on('TableUpdate', () => {
                this.loadUsers();
            });
        }
    }
</script>

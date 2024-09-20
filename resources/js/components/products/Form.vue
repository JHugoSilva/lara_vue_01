<script setup>
import axios from 'axios';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter()
const route = useRoute()
let errors = ref([])
const editMode = ref(false)

const form = reactive({
    name: "",
    description: "",
    image: "",
    type: "",
    quantity: "",
    price: ""
})

const getImage = () => {
    let image = "/upload/no-image.png"
    if (form.image) {
        if (form.image.indexOf('base64') != -1) {
            image = form.image
        } else {
            image = "/upload/"+form.image
        }
    }
    return image
}

const handleFileChange = (e) => {
    let file = e.target.files[0]
    let reader = new FileReader()
    reader.onloadend = (file) => {
        form.image = reader.result
    }
    reader.readAsDataURL(file)
}

const handleSave = () => {

    if (editMode.value) {
        updateProduct()
    } else {
        createProduct()
    }

}

const getProduct = async () => {
    await axios.get(`/api/products/${route.params.id}/edit`)
    .then((response) => {
        form.name = response.data.product.name
        form.description = response.data.product.description
        form.image = response.data.product.image
        form.type = response.data.product.type
        form.quantity = response.data.product.quantity
        form.price = response.data.product.price

    }) .catch((error)=>{
        if (error.response.status === 422) {
            errors.value = error.response.data.errors
        }
    })
}

const createProduct = async (values, actions) => {
    axios.post('/api/products', form)
    .then(() => {
        router.push('/')
        toast.fire({
            icon: "success",
            title: "Successo na criação do produto"
        })
    })
    .catch((error)=>{
        if (error.response.status === 422) {
            errors.value = error.response.data.errors
        }
    })
}

const updateProduct = (values, actions) => {
    axios.put(`/api/products/${route.params.id}`, form)
    .then(() => {
        router.push('/')
        toast.fire({
            icon: "success",
            title: "Successo na atualização do produto"
        })
    })
    .catch((error)=>{
        if (error.response.status === 422) {
            errors.value = error.response.data.errors
        }
    })
}

onMounted(()=>{
    if (route.name === 'products.edit') {
        editMode.value = true
        getProduct()
    }
})
</script>
<template>
    <div class="products__create ">

        <div class="products__create__titlebar dflex justify-content-between align-items-center">
            <div class="products__create__titlebar--item">

                <h1 class="my-1">
                    <span v-if="editMode">Edit</span>
                    <span v-else>Add</span>
                    Product
                </h1>
            </div>
            <div class="products__create__titlebar--item">

                <button class="btn btn-secondary ml-1" @click="handleSave">
                    Save
                </button>
            </div>
        </div>

        <div class="products__create__cardWrapper mt-2">
            <div class="products__create__main">
                <div class="products__create__main--addInfo card py-2 px-2 bg-white">
                    <p class="mb-1">Name</p>
                    <input type="text" class="input" v-model="form.name" >
                    <small style="color:red" v-if="errors.name">{{ errors.name[0] }}</small>
                    <p class="my-1">Description (optional)</p>
                    <textarea cols="10" rows="5" class="textarea" v-model="form.description" ></textarea>
                    <small style="color:red" v-if="errors.description">{{ errors.description[0] }}</small>
                    <div class="products__create__main--media--images mt-2">
                       <ul class="products__create__main--media--images--list list-unstyled">
                           <li class="products__create__main--media--images--item">
                               <div class="products__create__main--media--images--item--imgWrapper">
                                   <img :src="getImage()" class="products__create__main--media--images--item--img" alt="" />
                               </div>
                           </li>

                           <li class="products__create__main--media--images--item">
                               <form class="products__create__main--media--images--item--form">
                                   <label class="products__create__main--media--images--item--form--label" for="myfile">Add Image</label>
                                   <input @change="handleFileChange" class="products__create__main--media--images--item--form--input" type="file" id="myfile" >
                               </form>
                           </li>
                       </ul>
                   </div>

                </div>

            </div>
            <div class="products__create__sidebar">

                <div class="card py-2 px-2 bg-white">


                    <div class="my-3">
                        <p>Product type</p>
                        <input type="text" class="input" v-model="form.type">
                    </div>
                    <hr>

                    <div class="my-3">
                        <p>Inventory</p>
                        <input type="text" class="input" v-model="form.quantity">
                    </div>
                    <hr>


                    <div class="my-3">
                        <p>Price</p>
                        <input type="text" class="input" v-model="form.price">
                    </div>
                </div>

            </div>
        </div>

        <div class="dflex justify-content-between align-items-center my-3">
            <p ></p>
            <button class="btn btn-secondary" @click="handleSave">Save</button>
        </div>

</div>
</template>

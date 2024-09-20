<script setup>
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()

let products = ref([])
let links = ref([])
let searchQuery = ref('')

const newProduct = () => {
    router.push('/products/create')
}

const ourImage = (img) => {
    return "/upload/"+img
}

const getProducts = async () => {
   await axios.get('/api/products?searchQuery='+searchQuery.value)
    .then((response) => {
        products.value = response.data.products.data
        links.value = response.data.products.links

    })
}

const deleteProduct = async (id, i) => {
    Swal.fire({
        title: "Deseja apagar o usuário?",
        text: "Ação será realizada!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Sim, apagar!"
    }).then(async (result) => {
        if (result.isConfirmed) {
            products.value.splice(i, 1)
            if (id != undefined) {
                await axios.delete(`/api/products/${id}`).then((response) => {
                    Swal.fire({
                        title: "Ação realizada!",
                        text: response.data.msg,
                        icon: "success"
                    }).then(() => {
                        window.location.href = '/'
                    });
                }).catch((error) => {
                    Swal.fire(
                        'Falha!',
                        'Não foi possível realizar a operação.',
                        'Warning'
                    )
                })
            }
        }
    });
}

const changePage = (link) => {
    if (!link.url || link.active) {
        return
    }
    axios.get(link.url)
    .then((response) => {
        products.value = response.data.products.data
        links.value = response.data.products.links
    })
}

const onEdit = (id) => {
    router.push(`/products/${id}/edit`)
}

onMounted(async ()=>{
    getProducts()
})

watch(searchQuery,()=>{
    getProducts()
})
</script>

<template>
        <div class="products__list table  my-3">

            <div class="customers__titlebar dflex justify-content-between align-items-center">
                <div class="customers__titlebar--item">
                    <h1 class="my-1">Products</h1>
                </div>
                <div class="customers__titlebar--item">
                    <button class="btn btn-secondary my-1" @click="newProduct">
                        Add Product
                    </button>
                </div>
            </div>
            <p class="mb-1">Buscar</p>
            <input type="text" class="input" v-model="searchQuery">
            <div class="table--heading mt-2 products__list__heading " style="padding-top: 20px;background:#FFF">
                <!-- <p class="table--heading--col1">&#32;</p> -->
                <p class="table--heading--col1">image</p>
                <p class="table--heading--col2">
                    Product
                </p>
                <p class="table--heading--col4">Type</p>
                <p class="table--heading--col3">
                    Inventory
                </p>
                <!-- <p class="table--heading--col5">&#32;</p> -->
                <p class="table--heading--col5">actions</p>
            </div>

            <!-- product 1 -->
            <div class="table--items products__list__item" v-for="(product, index) in products" :key="index">
                <div class="products__list__item--imgWrapper">
                    <img class="products__list__item--img" :src="ourImage(product.image)"  style="height: 40px;">
                </div>
                <a href="# " class="table--items--col2">
                    {{ product.name }}
                </a>
                <p class="table--items--col2">
                    {{ product.type }}
                </p>
                <p class="table--items--col3">
                    {{ product.quantity }}
                </p>
                <div>
                    <button type="button" class="btn-icon btn-icon-success" @click="onEdit(product.id)" >
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="btn-icon btn-icon-danger" @click="deleteProduct(product.id, index)">
                        <i class="far fa-trash-alt"></i>
                    </button>
                </div>
            </div>
            <div class="">
                <div class="customers__titlebar dflex justify-content-start align-items-center">
                    <a href="#" class="btn btn btn-secondary" v-for="(link, index) in links" :key="index" v-html="link.label" :class="{ active: link.active, disabled: !link.url}"
                    @click="changePage(link)">

                </a>
                </div>
            </div>
        </div>

    <!-- <br><br><br>
         <div class="products__create ">

                 <div class="products__create__titlebar dflex justify-content-between align-items-center">
                     <div class="products__create__titlebar--item">

                         <h1 class="my-1">Add Product</h1>
                     </div>
                     <div class="products__create__titlebar--item">

                         <button class="btn btn-secondary ml-1" >
                             Save
                         </button>
                     </div>
                 </div>

                 <div class="products__create__cardWrapper mt-2">
                     <div class="products__create__main">
                         <div class="products__create__main--addInfo card py-2 px-2 bg-white">
                             <p class="mb-1">Name</p>
                             <input type="text" class="input" >

                             <p class="my-1">Description (optional)</p>
                             <textarea cols="10" rows="5" class="textarea" ></textarea>

                             <div class="products__create__main--media--images mt-2">
                                <ul class="products__create__main--media--images--list list-unstyled">
                                    <li class="products__create__main--media--images--item">
                                        <div class="products__create__main--media--images--item--imgWrapper">
                                            <img class="products__create__main--media--images--item--img" alt="" />
                                        </div>
                                    </li>

                                    <li class="products__create__main--media--images--item">
                                        <form class="products__create__main--media--images--item--form">
                                            <label class="products__create__main--media--images--item--form--label" for="myfile">Add Image</label>
                                            <input class="products__create__main--media--images--item--form--input" type="file" id="myfile" >
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
                                 <input type="text" class="input" >
                             </div>
                             <hr>

                             <div class="my-3">
                                 <p>Inventory</p>
                                 <input type="text" class="input" >
                             </div>
                             <hr>


                             <div class="my-3">
                                 <p>Price</p>
                                 <input type="text" class="input" >
                             </div>
                         </div>

                     </div>
                 </div>

                 <div class="dflex justify-content-between align-items-center my-3">
                     <p ></p>
                     <button class="btn btn-secondary" >Save</button>
                 </div>

         </div> -->

<!--
    <br><br><br>

        <div class="products__edit ">

                    <div class="products__create__titlebar dflex justify-content-between align-items-center">
                        <div class="products__create__titlebar--item">

                            <h1 class="my-1">Edit Product</h1>
                        </div>
                        <div class="products__create__titlebar--item">

                            <button class="btn btn-secondary ml-1" >
                                Save
                            </button>
                        </div>
                    </div>

                    <div class="products__create__cardWrapper mt-2">
                        <div class="products__create__main">
                            <div class="products__create__main--addInfo card py-2 px-2 bg-white">
                                <p class="mb-1">Name</p>
                                <input type="text" class="input" >

                                <p class="my-1">Description (optional)</p>
                                <textarea cols="10" rows="5" class="textarea" ></textarea>

                                <div class="products__create__main--media--images mt-2">
                                    <ul class="products__create__main--media--images--list list-unstyled">

                                        <li class="products__create__main--media--images--item">
                                            <div class="products__create__main--media--images--item--imgWrapper">
                                                <img class="products__create__main--media--images--item--img" >
                                            </div>
                                        </li>


                                        <li class="products__create__main--media--images--item">
                                            <form class="products__create__main--media--images--item--form">
                                                <label class="products__create__main--media--images--item--form--label" for="myfile">Add Image</label>
                                                <input class="products__create__main--media--images--item--form--input" type="file" id="myfile" >
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
                                    <input type="text" class="input" >
                                </div>
                                <hr>


                                <div class="my-3">
                                    <p>Inventory</p>
                                    <input type="text" class="input" >
                                </div>
                                <hr>


                                <div class="my-3">
                                    <p>Price</p>
                                    <input type="text" class="input" >
                                </div>
                            </div>

                        </div>
                    </div>

                    <div class="dflex justify-content-between align-items-center my-3">
                        <p ></p>
                        <button class="btn btn-secondary" >Save</button>
                    </div>

            </div> -->
</template>

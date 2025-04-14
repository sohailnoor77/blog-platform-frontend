<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import router from '@/router';
import api from '@/lib/axios';
import BounceLoader from 'vue-spinner/src/BounceLoader.vue';

const route = useRoute();
const toast = useToast();

const blogId = route.params.id;

const state = reactive({
    form: {
        title: '',
        excerpt: '',
        description: '',
        image: null,
        keywords: '',
        meta_title: '',
        meta_description: '',
        scheduled_at: null
    },
    isLoading: true,
})

const oldImageUrl = ref('');
const imagePreviewUrl = ref(null);
const loading = ref(false)
const errors = reactive({});

const fetchBlog = async () => {
    try {
        const { data } = await api.get(`/author/blog/${blogId}`);

        state.form.title = data.blog.title;
        state.form.excerpt = data.blog.excerpt;
        state.form.description = data.blog.description;
        state.form.meta_title = data.blog.meta_title;
        state.form.meta_description = data.blog.meta_description;
        state.form.keywords = data.blog.keywords.join(', ');
        state.form.image = data.blog.image;

        if (data.blog.scheduled_at !== 'Not Scheduled') {
            const dt = new Date(data.blog.scheduled_at);
            state.form.scheduled_at = dt.toISOString().slice(0, 16);
        }

        oldImageUrl.value = data.blog.image;
    } catch (error) {
        if (error.response?.status === 401) {
            if (error.response.data.message) {
                toast.error(error.response.data.message, {
                    position: 'top-right',
                    duration: 5000,
                });
            }
        } else if (error.response?.status === 403) {
            if (error.response.data.error) {
                toast.error(error.response.data.error, {
                    position: 'top-right',
                    duration: 5000,
                });

                router.push('/author/blogs');
            }
        } else {
            toast.error('Server Error - ' + error, {
                position: 'top-right',
                duration: 5000,
            });
        }
    } finally {
        state.isLoading = false;
    }
};

// handle image change
const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
        state.form.image = file
        imagePreviewUrl.value = URL.createObjectURL(file)
    }
}

const handleSubmit = async () => {
    loading.value = true

    // clear old errors
    Object.keys(errors).forEach(key => delete errors[key])

    const formData = new FormData()
    formData.append('title', state.form.title)
    formData.append('excerpt', state.form.excerpt)
    formData.append('description', state.form.description)
    formData.append('image', state.form.image)
    formData.append('keywords', state.form.keywords)
    formData.append('meta_title', state.form.meta_title)
    formData.append('meta_description', state.form.meta_description)

    if (state.form.scheduled_at) {
        const date = new Date(state.form.scheduled_at);
        const formatted = date.toISOString().slice(0, 19).replace('T', ' ');
        formData.append('scheduled_at', formatted);
    }

    try {
        await api.post(`/author/blog/update/${blogId}`, formData);
        toast.success('Blog Updated Successfully!', {
            position: 'top-right',
            duration: 5000,
        });
        router.push(`/author/blogs/${blogId}`);
    } catch (error) {
        if (error.response?.status === 422) {
            const serverErrors = error.response.data.errors
            Object.keys(serverErrors).forEach(field => {
                errors[field] = serverErrors[field][0]
            })
        } else if (error.response?.status === 401) {
            if (error.response.data.message) {
                toast.error(error.response.data.message, {
                    position: 'top-right',
                    duration: 5000,
                });
            }
        } else {
            toast.error('Server Error - ' + error, {
                position: 'top-right',
                duration: 5000,
            });
        }
    } finally {
        loading.value = false
    }
};

onMounted(() => {
    fetchBlog();
});

onBeforeUnmount(() => {
    if (imagePreviewUrl.value) {
        URL.revokeObjectURL(imagePreviewUrl.value)
    }
})
</script>

<template>
    <div class="bg-white py-10 sm:py-16">
        <div class="mx-auto max-w-7xl">
            <div class="flex items-center justify-between">
                <h1 class="text-3xl font-bold tracking-tight text-gray-900">Edit Blog</h1>
            </div>

            <div v-if="state.isLoading" class="flex items-center justify-center py-14 h-screen">
                <BounceLoader color="#615fff" />
            </div>

            <div v-else
                class="mx-auto mt-4 grid max-w-2xl grid-cols-4 gap-x-8 gap-y-16 border-t border-gray-200 pt-5 sm:mt-8 sm:pt-5 lg:mx-0 lg:max-w-none lg:grid-cols-4">
                <form @submit.prevent="handleSubmit" class="col-span-2">
                    <!-- title -->
                    <div class="mb-4">
                        <label for="title" class="block text-sm/6 font-medium text-gray-900">Title</label>
                        <div class="mt-2">
                            <input type="text" name="title" id="title" required="" v-model="state.form.title"
                                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                            <p v-if="errors.title" class="text-red-500 text-sm text-center">{{ errors.title }}</p>
                        </div>
                    </div>

                    <!-- excerpt -->
                    <div class="col-span-full mb-4">
                        <label for="excerpt" class="block text-sm/6 font-medium text-gray-900">Excerpt</label>
                        <div class="mt-2">
                            <textarea name="excerpt" id="excerpt" rows="3" v-model="state.form.excerpt"
                                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                            <p v-if="errors.excerpt" class="text-red-500 text-sm text-center">{{ errors.excerpt }}</p>
                        </div>
                    </div>

                    <!-- description -->
                    <div class="col-span-full mb-4">
                        <label for="description" class="block text-sm/6 font-medium text-gray-900">Description</label>
                        <div class="mt-2">
                            <textarea name="description" id="description" rows="6" v-model="state.form.description"
                                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                            <p v-if="errors.description" class="text-red-500 text-sm text-center">{{ errors.description
                                }}</p>
                        </div>
                    </div>

                    <!-- keywords -->
                    <div class="mb-4">
                        <label for="title" class="block text-sm/6 font-medium text-gray-900">Keywords (should be comma
                            separated)</label>
                        <div class="mt-2">
                            <input type="text" name="title" id="title" required="" v-model="state.form.keywords"
                                placeholder="Tags (comma separated, eg: tag1, tag2)"
                                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                            <p v-if="errors.keywords" class="text-red-500 text-sm text-center">{{ errors.keywords }}</p>
                        </div>
                    </div>

                    <!-- meta title -->
                    <div class="mb-4">
                        <label for="title" class="block text-sm/6 font-medium text-gray-900">Meta Title</label>
                        <div class="mt-2">
                            <input type="text" name="title" id="title" required="" v-model="state.form.meta_title"
                                placeholder="Meta Title"
                                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                            <p v-if="errors.meta_title" class="text-red-500 text-sm text-center">{{ errors.meta_title }}
                            </p>
                        </div>
                    </div>

                    <!-- meta description -->
                    <div class="col-span-full mb-4">
                        <label for="description" class="block text-sm/6 font-medium text-gray-900">Meta
                            Description</label>
                        <div class="mt-2">
                            <textarea name="description" id="description" rows="3" v-model="state.form.meta_description"
                                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                            <p v-if="errors.meta_description" class="text-red-500 text-sm text-center">{{
                                errors.meta_description }}</p>
                        </div>
                    </div>

                    <!-- image -->
                    <div class="col-span-full mb-4">
                        <label for="cover-photo" class="block text-sm/6 font-medium text-gray-900">Image</label>
                        <div
                            class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                            <div class="text-center">
                                <div class="mt-4 flex text-sm/6 text-gray-600">
                                    <label for="file-upload"
                                        class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-indigo-500">
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" class="sr-only"
                                            @change="handleImageChange" />
                                    </label>
                                    <p class="pl-1">or drag and drop</p>
                                </div>
                                <p class="text-xs/5 text-gray-600">PNG, JPG up to 2MB</p>
                            </div>
                        </div>

                        <label class="text-sm mt-4">Current Image:</label><br />
                        <img v-if="imagePreviewUrl" :src="imagePreviewUrl"
                            class="w-3/4 h-3/4 object-cover my-2 rounded-md" />
                        <img v-else="oldImageUrl" :src="oldImageUrl" class="w-3/4 h-3/4 object-cover my-2 rounded-md" />
                        <p v-if="errors.image" class="text-red-500 text-sm text-center">{{
                            errors.image }}</p>
                    </div>

                    <!-- scheduled date -->
                    <div class="mb-4">
                        <label for="title" class="block text-sm/6 font-medium text-gray-900">Publishing Scheduled
                            Date</label>
                        <div class="mt-2">
                            <input type="datetime-local" name="title" id="title" v-model="state.form.scheduled_at"
                                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                            <p v-if="errors.scheduled_at" class="text-red-500 text-sm text-center">{{
                                errors.scheduled_at }}</p>
                        </div>
                    </div>

                    <!-- action -->
                    <div class="flex items-center justify-end gap-x-4 mt-8">
                        <RouterLink v-if="blogId" :to="`/author/blogs/${blogId}`"
                            class="w-[90px] h-9 text-center rounded-sm bg-transparent border border-indigo-600 px-3 py-1.5 text-indigo-600 hover:bg-indigo-600 hover:text-white cursor-pointer text-sm font-semibold">
                            Cancel
                        </RouterLink>
                        <button type="submit" :disabled="loading"
                            class="w-[90px] h-9 cursor-pointer rounded-md bg-indigo-600 disabled:bg-gray-300 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            {{ loading ? 'Updating...' : 'Update' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
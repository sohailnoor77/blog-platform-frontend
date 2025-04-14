<script setup>
import { reactive, watch, onMounted, onBeforeUnmount, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import api from '@/lib/axios';
import BounceLoader from 'vue-spinner/src/BounceLoader.vue';

const toast = useToast();

const state = reactive({
    blogs: [],
    isLoading: true,
    isLoadingMore: false,
    currentPage: 1,
    lastPage: null,
    search: '',
});

const searchDebounce = ref(null);

const fetchBlogs = async (append = false) => {
    try {
        if (append) state.isLoadingMore = true;

        // api call
        const { data } = await api.get(`/blogs`, {
            params: {
                page: state.currentPage,
                search: state.search || undefined,
            },
        });

        if (append) {
            state.blogs.push(...data.blogs);
        } else {
            state.blogs = data.blogs;
        }

        state.lastPage = data.meta.last_page;
    } catch (error) {
        if (error.response?.status === 401) {
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
        state.isLoading = false;
        state.isLoadingMore = false;
    }
};

const handleScroll = () => {
    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.body.offsetHeight - 300;

    if (scrollPosition >= threshold && !state.isLoadingMore && state.currentPage < state.lastPage) {
        state.currentPage++;
        fetchBlogs(true);
    }
};

onMounted(() => {
    window.scrollTo(0, 0); // Scroll to top on mount
    fetchBlogs();
    window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
});

watch(() => state.search, (newVal, oldVal) => {
    if (searchDebounce.value) clearTimeout(searchDebounce.value);

    searchDebounce.value = setTimeout(() => {
        state.currentPage = 1;
        fetchBlogs();
    }, 500);
});
</script>

<template>
    <div class="my-6">
        <input v-model="state.search" type="text" placeholder="Search blogs..."
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 ring-indigo-400" />
    </div>

    <div v-if="state.isLoading" class="flex items-center justify-center py-14">
        <BounceLoader color="#615fff" />
    </div>

    <TransitionGroup name="fade" tag="div"
        class="mx-auto mt-6 grid max-w-2xl grid-cols-1 gap-8 border-t border-gray-200 pt-6 sm:mt-10 sm:pt-10 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        <article v-for="blog in state.blogs" :key="blog.id" class="flex max-w-xl flex-col items-start">
            <div class="my-4">
                <img :src="blog.image" alt="blog" class="rounded-xl object-cover w-[384px] h-[256px]" />
            </div>
            <div class="flex items-center justify-between text-xs w-full pr-8">
                <p class="text-gray-500">{{ blog.published_at }}</p>
                <p class="text-gray-500">Comments: {{ blog.comments_count }}</p>
            </div>
            <div class="group relative">
                <h3 class="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600">
                    <RouterLink :to="'/blogs/' + blog.id">
                        <span class="absolute inset-0" />
                        {{ blog.title }}
                    </RouterLink>
                </h3>
                <p class="mt-2 line-clamp-3 text-sm/6 text-gray-600">{{ blog.excerpt }}</p>
            </div>
            <div class="mt-6 flex items-center gap-x-2">
                <div class="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center">
                    <p class="text-white text-sm">{{ blog.author.name.charAt(0) }}</p>
                </div>
                <div>
                    <h4 class="text-xs font-semibold text-indigo-600">{{ blog.author.name }}</h4>
                    <p class="text-xs text-gray-900">Author</p>
                </div>
            </div>
        </article>
    </TransitionGroup>

    <div v-if="state.isLoadingMore" class="flex justify-center mt-6">
        <BounceLoader color="#615fff" />
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s ease;
}

.fade-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

.fade-enter-to {
    opacity: 1;
    transform: translateY(0);
}
</style>
<script setup>
import { reactive, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { RouterLink, useRoute } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import router from '@/router';
import api from '@/lib/axios';
import BackBtn from '@/components/BackBtn.vue';
import BounceLoader from 'vue-spinner/src/BounceLoader.vue';

const auth = useAuthStore();
const route = useRoute();
const toast = useToast();

const blogId = route.params.id;

const state = reactive({
    blog: {},
    isLoading: true,
    commentBody: '',
    isSubmitting: false,
});

const fetchBlog = async () => {
    try {
        const { data } = await api.get(`/blogs/${blogId}`);
        state.blog = data.blog;
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
    }
};

// submit comment
const submitComment = async () => {
    if (!state.commentBody.trim()) return toast.error('Comment cannot be empty.', {
        position: 'top-right',
        duration: 5000,
    });

    try {
        state.isSubmitting = true;
        const { data } = await api.post(`/author/blogs/${blogId}/comments`, {
            body: state.commentBody,
        });

        state.blog.comments.unshift(data.comment);
        state.commentBody = '';
        toast.success('Comment posted successfully.', {
            position: 'top-right',
            duration: 5000,
        });
    } catch (error) {
        toast.error('Failed to post comment.', {
            position: 'top-right',
            duration: 5000,
        });
    } finally {
        state.isSubmitting = false;
    }
};

onMounted(() => {
    window.scrollTo(0, 0);
    fetchBlog();
});
</script>

<template>
    <div v-if="state.isLoading" class="flex items-center justify-center py-14 h-screen">
        <BounceLoader color="#615fff" />
    </div>

    <div v-else class="mx-auto max-w-7xl px-6 mt-10 mb-16">
        <div class="flex items-center justify-between mb-12">
            <BackBtn url="/" />
        </div>

        <div class="flex flex-col items-center mb-10">
            <h2 class="text-3xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-4xl">{{ state.blog.title
                }}
            </h2>
            <p class="mt-2 text-lg/8 text-gray-600">{{ state.blog.excerpt }}</p>

            <div class="mt-6 flex items-center gap-x-2">
                <div class="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center">
                    <p class="text-white text-sm">{{ state.blog.author.name.charAt(0) }}</p>
                </div>
                <div>
                    <h4 class="text-xs font-semibold text-indigo-600">{{ state.blog.author.name }}</h4>
                    <p class="text-xs text-gray-900">{{ state.blog.published_at }}</p>
                </div>
            </div>
        </div>

        <img v-if="state.blog.image" class="w-full h-2/4 object-cover rounded-xl shadow-xl" :src="state.blog.image"
            alt="Image" />

        <!-- description -->
        <div class="col-span-2 mt-10 px-6">
            <p class="mt-2 text-lg/8 text-gray-600">
                {{ state.blog.description }}
            </p>
        </div>

        <div class="grid grid-col-1 mt-10">
            <div class="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
                <p class="text-base/7 font-semibold text-indigo-600">Comments</p>

                <div v-if="auth.user" class="mt-6">
                    <!-- Comments List -->
                    <div v-for="comment in state.blog.comments" :key="comment.id">
                        <div class="mt-6 flex items-center gap-x-2">
                            <div class="w-7 h-7 rounded-full bg-gray-500 flex items-center justify-center">
                                <p class="text-white text-sm">{{ comment.user.name.charAt(0) }}</p>
                            </div>
                            <div>
                                <h4 class="text-xs font-semibold text-indigo-600">{{ comment.user.name }}</h4>
                                <p class="text-xs text-gray-900">{{ comment.created_at }}</p>
                            </div>
                        </div>

                        <p class="text-sm tracking-tight text-pretty text-gray-900 mt-2">
                            {{ comment.body }}
                        </p>
                    </div>

                    <!-- Comment Box -->
                    <div class="mt-6">
                        <textarea v-model="state.commentBody" placeholder="Write your comment..." rows="4"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>

                        <div class="flex items-center justify-end">
                            <button @click="submitComment" :disabled="state.isSubmitting"
                                class="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm cursor-pointer rounded hover:bg-indigo-700 disabled:opacity-50">
                                {{ state.isSubmitting ? 'Submitting...' : 'Post Comment' }}
                            </button>
                        </div>
                    </div>
                </div>

                <div v-else class="mt-4 text-sm text-gray-500">
                    Please <RouterLink to="/login" class="text-indigo-600 underline font-semibold">Log in</RouterLink>
                    to view and comment.
                </div>
            </div>
        </div>
    </div>
</template>
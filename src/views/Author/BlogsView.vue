<script setup>
import BlogListings from '@/components/Blogs/BlogListings.vue';
</script>

<template>
    <div class="bg-white py-10 sm:py-16">
        <div class="mx-auto max-w-7xl">
            <div class="flex items-center justify-between">
                <h2 class="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">Your Blogs
                </h2>
                <RouterLink to="/author/blogs/create"
                    class="rounded-sm bg-indigo-500 px-5 py-1.5 hover:bg-indigo-500/95 text-white cursor-pointer">
                    Create Blog
                </RouterLink>
            </div>

            <!-- Blogs List -->
            <BlogListings />
        </div>
    </div>
</template>
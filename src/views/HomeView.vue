<script setup>
import HomeBlogListings from '@/components/Blogs/HomeBlogListings.vue';
</script>

<template>
    <div class="bg-white py-10 sm:py-16">
        <div class="mx-auto max-w-7xl">
            <div class="mx-auto max-w-2xl lg:mx-0">
                <h2 class="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">Latest Blogs
                </h2>
                <p class="mt-2 text-lg/8 text-gray-600">World most trending topics on Blog Applications - Tech, AI,
                    Sports.</p>
            </div>

            <!-- Blogs List -->
            <HomeBlogListings />
        </div>
    </div>
</template>
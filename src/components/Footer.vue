<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
    <footer class="bg-gray-200">
        <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div class="flex h-16 items-center justify-center">
                © 2025&#160;
                <RouterLink to="/" class="text-indigo-600 hover:text-indigo-500 underline">
                    Blog Application
                </RouterLink>
                &#160;| All Rights Reserved
            </div>
        </div>
    </footer>
</template>
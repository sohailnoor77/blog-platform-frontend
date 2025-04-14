<script setup>
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth'
import logo from '@/assets/logo.png';

const auth = useAuthStore()

// Logout method
const handleLogout = () => {
    auth.logout()
}
</script>

<template>
    <header class="bg-gray-200">
        <nav class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
            <div class="flex lg:flex-1">
                <RouterLink to="/" class="-m-1.5 p-1.5">
                    <img class="h-8 w-auto" :src="logo" alt="Logo" />
                </RouterLink>
            </div>

            <div class="flex items-center gap-4">
                <template v-if="auth.token">
                    <RouterLink to="/author/blogs"
                        class="rounded-sm bg-indigo-500 px-5 py-1.5 hover:bg-indigo-500/95 text-white cursor-pointer">
                        My Blogs
                    </RouterLink>
                    <button @click="handleLogout"
                        class="rounded-sm bg-indigo-500 px-5 py-1.5 hover:bg-indigo-500/95 text-white cursor-pointer">
                        Logout
                    </button>
                </template>
                <template v-else>
                    <RouterLink to="/login"
                        class="rounded-sm bg-indigo-500 px-5 py-1.5 hover:bg-indigo-500/95 text-white cursor-pointer">
                        Login
                    </RouterLink>
                </template>
            </div>
        </nav>
    </header>
</template>
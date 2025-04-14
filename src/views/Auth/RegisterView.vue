<script setup>
import { RouterLink } from 'vue-router';
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toast-notification';
import router from '@/router';
import logo from '@/assets/logo.png';

const auth = useAuthStore();
const toast = useToast();

const loading = ref(false)
const errors = reactive({});
const form = reactive({
    name: '',
    email: '',
});

// handle form submit
const handleSubmit = async () => {
    loading.value = true

    // clear old errors
    Object.keys(errors).forEach(key => delete errors[key])

    // validate form
    if (form.name === '') {
        alert('Name is required');
        return;
    }
    if (form.email === '') {
        alert('Email is required');
        return;
    }

    const newUser = {
        name: form.name,
        email: form.email,
    };

    try {
        await auth.register(newUser)
        // @todo - show success message
        toast.success('Registered! Check your email for OTP.', {
            position: 'top-right',
            duration: 5000,
        });
        router.push('/verify-otp');
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
</script>

<template>
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <img class="mx-auto h-16 w-auto" :src="logo" alt="Logo" />
            <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Register With Us!</h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <!-- form -->
            <form class="space-y-6" @submit.prevent="handleSubmit">
                <!-- name -->
                <div>
                    <label for="name" class="block text-sm/6 font-medium text-gray-900">Name</label>
                    <div class="mt-2">
                        <input type="name" name="name" id="name" required="" v-model="form.name"
                            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                        <p v-if="errors.name" class="text-red-500 text-sm text-center">{{ errors.name }}</p>
                    </div>
                </div>

                <!-- email -->
                <div>
                    <label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
                    <div class="mt-2">
                        <input type="email" name="email" id="email" autocomplete="email" required=""
                            v-model="form.email"
                            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                        <p v-if="errors.email" class="text-red-500 text-sm text-center">{{ errors.email }}</p>
                    </div>
                </div>

                <div>
                    <button type="submit" :disabled="loading"
                        class="flex w-full justify-center rounded-md cursor-pointer bg-indigo-600 disabled:bg-gray-300 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        {{ loading ? 'Signing up...' : 'Sign up' }}
                    </button>
                </div>
            </form>

            <p class="mt-10 text-center text-sm/6 text-gray-500">
                Not a user?
                {{ ' ' }}
                <RouterLink to="/login" class="text-indigo-600 hover:text-indigo-500 underline">
                    Login
                </RouterLink>
            </p>
        </div>
    </div>
</template>
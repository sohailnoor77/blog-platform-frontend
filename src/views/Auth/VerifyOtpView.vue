<script setup>
import router from '@/router';
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toast-notification';

const auth = useAuthStore();
const toast = useToast();

const otpCode = ref('');
const errors = reactive({});
const loading = ref(false)

// // handle form submit
const handleSubmit = async () => {
    loading.value = true

    // clear old errors
    Object.keys(errors).forEach(key => delete errors[key])

    // validate form
    if (otpCode.value === '') {
        alert('OTP is required');
        return;
    }

    const email = auth.registerEmail
    const otp = otpCode.value

    try {
        await auth.verifyOtp(email, otp)
        toast.success('Verified Successfully! Welome to our platform.', {
            position: 'top-right',
            duration: 5000,
        });
        router.push('/author/blogs');
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
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 h-screen">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <img class="mx-auto h-10 w-auto"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                alt="Your Company" />
            <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Verify your OTP</h2>
            <p v-if="errors.email" class="text-red-500 text-sm text-center">{{ errors.email }}</p>
        </div>

        <div class="mt-14 sm:mx-auto sm:w-full sm:max-w-sm">

            <!-- form -->
            <form class="space-y-6" @submit.prevent="handleSubmit">
                <div class="flex items-center mb-10">
                    <v-otp-input ref="otpInput"
                        input-classes="w-14 border border-gray-300 rounded-sm h-10 text-center text-lg font-medium mx-4"
                        :conditionalClass="['one', 'two', 'three', 'four']" separator="-" inputType="letter-numeric"
                        :num-inputs="4" v-model:value="otpCode" />
                    <p v-if="errors.otpCode" class="text-red-500 text-sm">{{ errors.otpCode }}</p>
                </div>

                <div class="mt-16">
                    <button type="submit" :disabled="loading"
                        class="flex w-full justify-center rounded-md cursor-pointer bg-indigo-600 disabled:bg-gray-300 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        {{ loading ? 'Verifying...' : 'Verify' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
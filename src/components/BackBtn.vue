<script setup>
import { defineProps } from 'vue';
import { RouterLink } from 'vue-router';
import { BsArrowLeft } from '@kalimahapps/vue-icons';

defineProps({
    title: {
        type: String,
        default: 'Back'
    },
    url: {
        type: String,
        default: '/'
    }
});
</script>

<template>
    <RouterLink :to="url" class="text-lg font-semibold flex items-center gap-x-2 text-gray-900 hover:text-gray-600">
        <BsArrowLeft />
        {{ title }}
    </RouterLink>
</template>
<template>
    <div>
        <md-checkbox v-if="option.type === 'checkbox'" v-model="value">{{ option.title }}</md-checkbox>
        <md-chips v-if="option.type === 'chips'" v-model="value" :md-input-placeholder="option.title"></md-chips>
    </div>
</template>

<script lang="ts" src="./config-option.ts"></script>
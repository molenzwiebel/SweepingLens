<template>
    <div class="config-option">
        <md-checkbox v-if="option.type === 'checkbox'" v-model="value">{{ option.title }}</md-checkbox>

        <template v-if="option.type === 'chips'">
            <a>{{ option.title }}</a>
            <md-chips v-model="value"></md-chips>
        </template>
    </div>
</template>

<script lang="ts" src="./config-option.ts"></script>

<style lang="stylus">
    .config-option a
        font-size 14px

    .config-option .md-chips
        min-height 30px
        padding 0
        margin 0
        margin-bottom 10px
</style>
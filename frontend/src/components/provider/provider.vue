<template>
    <md-list-item md-expand-multiple>
        <md-icon :md-src="provider.icon"></md-icon>

        <div class="md-list-text-container">
            <span>{{ provider.name }}</span>
        </div>

        <md-list-expand style="margin-left: 15px">
            <div class="description">
                <span>{{ provider.description }}</span>
            </div>

            <md-checkbox :value="isShown" @change="toggleShown">Show</md-checkbox>
            <md-checkbox :value="notificationsEnabled" @change="toggleNotifs">Notifications On New Events</md-checkbox>

            <div v-if="provider.options.length > 0">
                <div class="separator">
                    <span>Filters</span>
                    <div></div>
                </div>
                <config-option v-for="option in provider.options" :key="option.id" :option="option"></config-option>
            </div>
        </md-list-expand>
    </md-list-item>
</template>

<script lang="ts" src="./provider.ts"></script>

<style lang="stylus" scoped>
    .md-list-item .md-list-item-container > .md-icon:first-child
        margin-right 20px

    .description
        border-left 3px solid lightgray
        padding-left 6px

    .filters-header
        font-size 1.3em
        border-bottom 1px solid lightgray

    .separator
        display flex
        align-items center

    .separator > span
        text-transform uppercase
        color rgba(0, 0, 0, 0.5)

    .separator > div
        flex 1
        margin-left 10px
        height 1px
        background-color rgba(0, 0, 0, .12)
</style>

<style lang="stylus">
    .md-list-item .md-button:not(.md-button-ghost):not(.md-list-item-container)
        position absolute !important
</style>
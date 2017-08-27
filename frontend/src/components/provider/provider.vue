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
</style>

<style lang="stylus">
    .md-list-item .md-button:not(.md-button-ghost):not(.md-list-item-container)
        position absolute !important
</style>
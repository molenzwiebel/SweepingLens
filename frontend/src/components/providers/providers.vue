<template>
    <md-card class="card">
        <md-card-header>
            <div class="md-title">Data Sources</div>
            <div class="md-subtitle">Showing {{ filteredEvents.length.toLocaleString() }} of {{ events.length.toLocaleString() }} events ({{ totalEvents.toLocaleString() }} total)</div>
        </md-card-header>

        <md-card-content :class="loading && 'loading'">
            <md-spinner v-if="loading" md-indeterminate></md-spinner>
            <div v-else>
                <md-input-container md-clearable>
                    <md-icon>search</md-icon>
                    <label>Search Events</label>
                    <md-input type="text" @input="updateSearchValue" @keyup.enter.native="search()"></md-input>
                </md-input-container>

                <md-list>
                    <provider v-for="provider in providers" :provider="provider" :key="provider.id"></provider>
                </md-list>
            </div>
        </md-card-content>
    </md-card>
</template>

<script lang="ts" src="./providers.ts"></script>

<style lang="stylus" scoped>
    .card
        position fixed
        left 0
        top 65px
        bottom 65px
        overflow-y scroll
        margin 10px
        width calc(20vw - 20px)

    .loading
        height 200px
        display flex
        justify-content center
        align-items center

    .md-list-item .md-list-item-container > .md-icon:first-child
        margin-right 20px
</style>

<style lang="stylus">
    ::-webkit-scrollbar
        width 4px

    ::-webkit-scrollbar-track
        display none

    ::-webkit-scrollbar-thumb
        background-color lightgray

    ::-webkit-scrollbar-button
        display none

    ::-webkit-scrollbar-corner
        display none
</style>
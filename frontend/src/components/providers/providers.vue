<template>
    <md-card class="card">
        <md-card-header>
            <div class="md-title">Data Sources</div>
            <div class="md-subtitle">Showing {{ filteredEvents.length.toLocaleString() }} of {{ events.length.toLocaleString() }} ({{ totalEvents.toLocaleString() }} total)</div>
        </md-card-header>

        <md-card-content :class="loading && 'loading'">
            <md-spinner v-if="loading" md-indeterminate></md-spinner>
            <div v-else>
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
<template>
    <div class="body"
         :class="loading && 'loading'"
         v-infinite-scroll="loadMore"
         infinite-scroll-disabled="loadMoreDisabled"
         infinite-scroll-distance="200"
         infinite-scroll-listen-for-event="rerender">

        <md-spinner v-if="loading" md-indeterminate></md-spinner>

        <transition-group v-else name="fadeRight" tag="div">
            <event v-for="event in filteredEvents" :event="event" :provider="providerFor(event)" :key="event.id"></event>
        </transition-group>
        <md-button v-if="!loading" class="md-raised md-primary" :disabled="loadMoreDisabled" @click="loadMore">{{ moreEvents ? "Load More" : "No More Events" }}</md-button>
    </div>
</template>

<script lang="ts" src="./events.ts"></script>

<style lang="stylus" scoped>
    .fadeRight-enter-to
        animation-duration 0.4s !important

    .body
        flex 1

    .loading
        height 200px
        display flex
        justify-content center
        align-items center

    .md-list-item .md-list-item-container > .md-icon:first-child
        margin-right 20px
</style>
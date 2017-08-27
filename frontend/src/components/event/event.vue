<template>
    <md-card class="event-card">
        <div @click="toggleExpand()">
            <md-card-header>
                <md-ink-ripple></md-ink-ripple>

                <md-avatar>
                    <img :src="provider.icon">
                </md-avatar>

                <div class="md-title"><a target="_blank" :href="event.url">{{ event.title }}</a></div>
                <div class="md-subhead">{{ provider.name }} - <timeago :since="event.timestamps.created"></timeago></div>
            </md-card-header>
        </div>

        <md-card-content v-if="expanded">
            <div class="content" ref="content"></div>
        </md-card-content>
    </md-card>
</template>

<script lang="ts" src="./event.ts"></script>

<style lang="stylus">
    .event-card
        margin 10px 10px

    .content iframe[src *= "youtube"]
        height 315px
</style>
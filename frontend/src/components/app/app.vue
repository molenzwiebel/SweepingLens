<template>
    <div class="container">
        <md-toolbar>
            <md-icon md-src="https://lolprofile.net/cdn/lol/img/item/3341.png" style="border-radius: 50%; margin: 10px"></md-icon>

            <h2 class="md-title" style="flex: 1">Sweeping Lens</h2>

            <md-button class="md-icon-button" href="https://github.com/molenzwiebel/sweepinglens">
                <md-icon md-src="http://vuematerial.io/assets/icon-github.svg"></md-icon>
            </md-button>
        </md-toolbar>

        <md-layout md-gutter>
            <md-layout md-flex="20">
                <providers></providers>
            </md-layout>

            <md-layout>
                <events></events>
            </md-layout>
        </md-layout>
    </div>
</template>

<script lang="ts" src="./app.ts"></script>
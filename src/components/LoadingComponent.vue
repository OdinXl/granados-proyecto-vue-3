<template>
    <div style="position: relative;">
        <div :class="show ? 'd-flex' : 'd-none'" class="b-overlay position-absolute d-flex justify-content-center" style="inset: 0px; z-index: 10">
            <div class="position-absolute bg-light rounded-sm" style="inset: 0px; opacity: 0.85"></div>
            <div class="position-absolute top-50 start-50 spinner-grow text-info" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
        <slot></slot>
    </div>
</template>

<script>
export default {
  name: 'LoadingComponent',
  props: ['show'],
}
</script>

<style scoped>
</style>
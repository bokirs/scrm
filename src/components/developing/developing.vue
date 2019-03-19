<template>
    <div class="developing">
        <img src="../../assets/images/kfz.gif" alt="">
        <p>{{ tips }}</p>
    </div>
</template>
<script>
export default {
    props: {
        tips: String
    }
}
</script>

<style>
.developing {
    width: 600px;
    height: auto;
}
</style>

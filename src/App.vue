<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
.size{
  width: 100%;
  height: 100%;
}
html,body{
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}
.fl{
	float: left;
}
.fr{
	float: right;
}
.clear:after{
	content: '';
	height: 0;
	display: block;
	clear: both;
	visibility: hidden;
}
.flex{
	display: flex;
}
</style>

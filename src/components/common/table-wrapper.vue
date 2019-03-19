<template>
	<div class="my-content-wrapper">
		<slot name="table"></slot>
		<slot name="paging"></slot>
		<slot name="loading"></slot>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},		
	}
</script>

<style>
	.ivu-table-header {
		height: 48px;
	}
	.ivu-table-small th {
		height: 48px;
		text-align: center;
	}
	.ivu-table-small td {
		height: 30px;
	}
	.my-content-wrapper {
		border-radius: 8px;
		box-shadow: 0px 3px 12px 0px rgba(74, 119, 238, 0.1);
		height: calc( 100vh - 50px - 40px - 18px - 70px - 18px - 38px );
		position: relative;
	}
	
	.my-content-wrapper > .ivu-table-wrapper {
		border: none !important;
		height: calc( 100% - 70px );
		/* overflow-y: auto;
		overflow-x: auto; */
	}
	.my-content-wrapper > .ivu-table-wrapper .ivu-table-body{
		overflow-x: auto;
	}
	.ivu-table:before,
	.ivu-table:after {
		width: 0 !important;
		background-color: transparent !important;
	}
	
	.ivu-table-cell{
		padding: 0;
	}
	.ivu-table-cell .table-btns{
		padding: 0 5px;
		color: #4a77ee;
		display: flex;
		justify-content: center;
		align-items: center;
		align-content: center;
	}
	.ivu-table-cell .table-btns a,
	.ivu-table-cell .table-btns>span{
		padding: 0 5px;
	}
	.ivu-table-cell .table-btns a:hover,
	.ivu-table-cell .table-btns > span:hover{
		color: royalblue;
	}


</style>

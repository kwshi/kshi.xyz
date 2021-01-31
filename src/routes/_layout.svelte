<script lang='ts'>
	import Nav from '@/components/Nav.svelte';
import {stores} from '@sapper/app';

export let segment: string | undefined;
</script>

<style>

</style>

<Nav {segment}/>

<main>
	<slot></slot>
</main>

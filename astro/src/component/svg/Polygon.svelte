<script lang="ts">
  export let points: readonly (readonly [number, number])[] = [];
  export let attributes: Record<string, string | number | boolean> = {};
</script>

<polygon points={points.join(" ")} {...attributes} />

<div class="bg">
  <div class="sun-wrapper">
    <div class="sun" />
  </div>
</div>

<style lang="postcss">
  .bg {
    z-index: -10;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-attachment: fixed;
    background-image: linear-gradient(
      to bottom,
      #378 0,
      #59a 6rem,
      #9a8 12rem,
      #b97 16rem,
      #d77 20rem
    );

    & > .sun-wrapper {
      @apply absolute w-full h-full overflow-hidden;
      z-index: -10;
      mix-blend-mode: overlay;
      clip-path: margin-box;
      clip: rect(auto, auto, auto, auto);
      & > .sun {
        @apply w-24 h-24 absolute
          rounded-full right-1/3 top-40;
        background-color: #f34;
        position: fixed;
        z-index: -10;
      }
    }
  }
</style>

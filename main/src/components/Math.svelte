<script>
  import Katex from "katex";
  export let m: string;
  export let display: boolean = false;

  const macros = {
    "\\dif": "\\operatorname{d}\\!",
    "\\pdif": "\\operatorname{\\partial}\\!",
    "\\RR": "\\mathbb R",
    "\\NN": "\\mathbb N",
    "\\QQ": "\\mathbb Q",
    "\\CC": "\\mathbb C",
    "\\VV": "\\mathbb V",
    "\\TT": "\\mathbb T",
  };
</script>

{@html Katex.renderToString(m, { displayMode: display, macros })}

import type * as Unist from "unist";
import type * as Hast from "hast";
import type * as VFile from "vfile";
import hast from "hastscript";

interface Data {
  resume: Record<"name" | "location" | "email" | "url" | "phone", string>;
  links: Record<"name" | "icon" | "label" | "url", string>[];
}

export default () => (tree: Unist.Node, file: VFile.VFile) => {
  const data = <Data>file.data;
  (<Hast.Root>tree).children.unshift(
    hast("header", [
      hast("h1", data.resume.name),
      hast(
        "ul.contact",
        data.links.map(({ name, icon, label, url }) =>
          hast(
            "li",
            { class: name },
            hast("a", { href: url }, [hast("i", { class: icon }), label])
          )
        )
      ),
      hast("div.subtitle", [
        hast("a", { href: data.resume.url }, [
          hast("i.las.la-home"),
          data.resume.url,
        ]),
        hast("a", { href: `mailto:${data.resume.email}` }, [
          hast("i.las.la-envelope"),
          data.resume.email,
        ]),
        hast("span", [hast("i.las.la-phone"), data.resume.phone]),
      ]),
      hast("time", "last updated yesterday"),
    ])
  );
};
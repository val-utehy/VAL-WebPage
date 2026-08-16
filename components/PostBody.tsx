type Block =
  | { kind: "heading"; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] };

function blocksFromMarkdown(markdown: string): Block[] {
  const lines = markdown.replace(/\r/g, "").split("\n");
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ kind: "paragraph", text: paragraph.join(" ") });
    paragraph = [];
  };
  const flushList = () => {
    if (list.length) blocks.push({ kind: "list", items: list });
    list = [];
  };

  for (const line of lines) {
    const heading = line.match(/^#{2,3}\s+(.+)$/);
    const item = line.match(/^[-*]\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ kind: "heading", text: heading[1] });
    } else if (item) {
      flushParagraph();
      list.push(item[1]);
    } else if (!line.trim()) {
      flushParagraph();
      flushList();
    } else {
      flushList();
      paragraph.push(line.trim());
    }
  }
  flushParagraph();
  flushList();
  return blocks;
}

export function PostBody({ markdown }: { markdown: string }) {
  return (
    <div className="post-body">
      {blocksFromMarkdown(markdown).map((block, index) => {
        if (block.kind === "heading") return <h2 key={`${block.text}-${index}`}>{block.text}</h2>;
        if (block.kind === "list") return <ul key={`${block.items.join("-")}-${index}`}>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
        return <p key={`${block.text}-${index}`}>{block.text}</p>;
      })}
    </div>
  );
}

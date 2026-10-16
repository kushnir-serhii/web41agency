import ChatInline from './ChatInline';
import { parseMarkdown } from './markdown';

export default function ChatMarkdown({ content }: { content: string }) {
  return (
    <div className="space-y-2">
      {parseMarkdown(content).map((block, i) => {
        if (block.type === 'paragraph') {
          return (
            <p key={i}>
              <ChatInline nodes={block.children} />
            </p>
          );
        }
        const List = block.ordered ? 'ol' : 'ul';
        return (
          <List key={i} className={block.ordered ? 'list-decimal pl-5' : 'list-disc pl-5'}>
            {block.items.map((item, j) => (
              <li key={j}>
                <ChatInline nodes={item} />
              </li>
            ))}
          </List>
        );
      })}
    </div>
  );
}

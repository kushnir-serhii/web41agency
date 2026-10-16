import { Link } from '@/i18n/navigation';

import type { InlineNode } from './markdown';

const linkClass = 'underline underline-offset-2';

export default function ChatInline({ nodes }: { nodes: InlineNode[] }) {
  return (
    <>
      {nodes.map((node, i) => {
        switch (node.type) {
          case 'text':
            return node.text;
          case 'bold':
            return <strong key={i}>{node.text}</strong>;
          case 'br':
            return <br key={i} />;
          case 'link':
            if (node.kind === 'internal') {
              return (
                <Link key={i} href={node.href} className={linkClass}>
                  {node.text}
                </Link>
              );
            }
            return (
              <a
                key={i}
                href={node.href}
                className={linkClass}
                {...(node.kind === 'external'
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {node.text}
              </a>
            );
        }
      })}
    </>
  );
}

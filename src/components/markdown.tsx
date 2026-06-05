/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type MarkdownProps = {
  content?: string;
  className?: string;
  isLoading?: boolean;
  error?: string | null;
  mode?: 'compact' | 'default' | 'large';
};

const Markdown: React.FC<MarkdownProps> = ({
  content,
  className = '',
  isLoading = false,
  error = null,
  mode = 'default',
}) => {
  useEffect(() => {
    console.log({ __data_content: content });
  }, [content]);

  // Mode-specific configurations
  const modeConfig = {
    compact: {
      container: '',
      h1: 'mb-3 text-xl font-bold',
      h2: 'mb-2 mt-4 text-lg font-semibold',
      h3: 'mb-2 mt-3 text-base font-medium',
      p: 'mb-2 text-sm leading-relaxed',
      spacing: 'space-y-2',
      table: 'my-3 text-sm',
      list: 'my-2 ml-4 text-sm',
    },
    default: {
      container: '',
      h1: 'mb-6 border-b pb-2 text-3xl font-bold tracking-tight',
      h2: 'mb-4 mt-8 text-2xl font-semibold tracking-tight',
      h3: 'mb-3 mt-6 text-xl font-medium',
      p: 'mb-4 leading-relaxed',
      spacing: 'space-y-4',
      table: 'my-6',
      list: 'my-4 ml-6',
    },
    large: {
      container: '',
      h1: 'mb-8 border-b pb-3 text-5xl font-bold tracking-tight',
      h2: 'mb-6 mt-10 text-4xl font-semibold tracking-tight',
      h3: 'mb-4 mt-8 text-3xl font-medium',
      p: 'mb-6 text-lg leading-relaxed',
      spacing: 'space-y-6',
      table: 'my-8 text-base',
      list: 'my-6 ml-8 text-lg',
    },
  } as const;

  const config = modeConfig[mode];

  if (isLoading) {
    return (
      <Card className={`mx-auto ${config.container} p-6 shadow-none border-0 ${className}`}>
        <div className={config.spacing}>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <div className="space-y-2 pt-4">
            <Skeleton className="h-[300px] w-full" />
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`mx-auto ${config.container} p-6 shadow-none border-0 ${className}`}>
        <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
          <p className="font-medium">Error loading content</p>
          <p className="text-sm">{error}</p>
        </div>
      </Card>
    );
  }

  if (!content) {
    return (
      <Card className={`mx-auto ${config.container} p-6 shadow-none border-0 ${className}`}>
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          No content available
        </div>
      </Card>
    );
  }

  return (
    <div
      className={cn(`
        mx-auto ${config.container} p-0 border-0
        w-full min-w-0 break-words // <-- Added break-words, removed overflow-x-auto to prevent horizontal scrolling on the main wrapper
      `, className)}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => <h1 className={`scroll-mt-24 ${config.h1}`} {...props} />,
          h2: ({ node, ...props }) => <h2 className={`scroll-mt-20 ${config.h2}`} {...props} />,
          h3: ({ node, ...props }) => <h3 className={`scroll-mt-20 ${config.h3}`} {...props} />,
          p: ({ node, ...props }) => (
            <p
              className={`[&:not(:first-child)]:mt-${
                mode === 'compact' ? '2' : mode === 'large' ? '6' : '4'
              } ${config.p}`}
              {...props}
            />
          ),
          // Ensure tables are horizontally scrollable (Tables usually shouldn't wrap to maintain structure)
          table: ({ node, ...props }) => (
            <div className={`${config.table} overflow-hidden rounded-lg border shadow-sm`}>
              <div className="overflow-x-auto">
                <Table {...props} />
              </div>
            </div>
          ),
          thead: ({ node, ...props }) => <TableHeader className="bg-muted/50" {...props} />,
          tbody: ({ node, ...props }) => <TableBody {...props} />,
          tr: ({ node, ...props }) => (
            <TableRow className="hover:bg-muted/50 data-[state=selected]:bg-muted" {...props} />
          ),
          th: ({ node, ...props }) => (
            <TableHead className="whitespace-nowrap font-medium [&:has([role=checkbox])]:pr-0" {...props} />
          ),
          td: ({ node, ...props }) => (
            <TableCell className="whitespace-nowrap [&:has([role=checkbox])]:pr-0" {...props} />
          ),
          ul: ({ node, ...props }) => <ul className={`${config.list} list-disc [&>li]:mt-2`} {...props} />,
          ol: ({ node, ...props }) => <ol className={`${config.list} list-decimal [&>li]:mt-2`} {...props} />,
          
          // Links: Added break-all so long URLs wrap instead of overflowing
          a: ({ node, ...props }) => (
            <a className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 break-all" {...props} /> 
          ),
          
          blockquote: ({ node, ...props }) => (
            <blockquote
              className={`${
                mode === 'compact' ? 'my-2' : mode === 'large' ? 'my-6' : 'my-4'
              } border-l-2 pl-4 italic text-muted-foreground`}
              {...props}
            />
          ),
          
          // Inline code: Added break-words so long code strings wrap
          // @ts-expect-error
          code: ({ node, inline, ...props }) => (
            <code
              className={`relative rounded px-[0.3rem] py-[0.2rem] font-mono break-words ${
                mode === 'compact' ? 'text-xs' : mode === 'large' ? 'text-base' : 'text-sm'
              }`}
              {...props}
            />
          ),
          
          // Code blocks (pre): Changed from overflow-x-auto to whitespace-pre-wrap and break-words
          pre: ({ node, ...props }) => (
            <pre
              className={`
                rounded-lg p-4 font-mono whitespace-pre-wrap break-words // <-- Added to force code blocks to wrap lines
                ${mode === 'compact' ? 'text-xs' : mode === 'large' ? 'text-base' : 'text-sm'}
              `}
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;


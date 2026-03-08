import React from 'react';

interface MarkdownTextProps {
  content: string;
}

export function MarkdownText({ content }: MarkdownTextProps) {
  // Clean up HTML tags and convert to proper formatting
  const cleanContent = content
    .replace(/<br\s*\/?>/gi, '\n')  // Convert <br> to newlines
    .replace(/<br>/gi, '\n')         // Convert <br> to newlines
    .replace(/&nbsp;/g, ' ')         // Convert &nbsp; to spaces
    .replace(/<\/?[^>]+(>|$)/g, ''); // Remove any other HTML tags
  
  // Parse and format the text content
  const formatText = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactElement[] = [];
    let currentList: string[] = [];
    let listType: 'ul' | 'ol' | null = null;

    const flushList = () => {
      if (currentList.length > 0) {
        const ListTag = listType === 'ol' ? 'ol' : 'ul';
        elements.push(
          <ListTag key={elements.length} className="my-3 pl-6 space-y-1">
            {currentList.map((item, idx) => (
              <li key={idx} className="text-gray-100">
                {formatInlineText(item)}
              </li>
            ))}
          </ListTag>
        );
        currentList = [];
        listType = null;
      }
    };

    lines.forEach((line, index) => {
      // Empty line
      if (line.trim() === '') {
        flushList();
        return;
      }

      // Headers
      if (line.startsWith('###')) {
        flushList();
        elements.push(
          <h3 key={index} className="text-lg font-semibold text-blue-300 mt-4 mb-2">
            {line.replace(/^###\s*/, '')}
          </h3>
        );
      } else if (line.startsWith('##')) {
        flushList();
        elements.push(
          <h2 key={index} className="text-xl font-semibold text-blue-200 mt-4 mb-2">
            {line.replace(/^##\s*/, '')}
          </h2>
        );
      } else if (line.startsWith('#')) {
        flushList();
        elements.push(
          <h1 key={index} className="text-2xl font-bold text-blue-100 mt-4 mb-3">
            {line.replace(/^#\s*/, '')}
          </h1>
        );
      }
      // Bold text with **
      else if (line.match(/^\*\*(.+?)\*\*/)) {
        flushList();
        const text = line.replace(/^\*\*(.+?)\*\*/, '$1');
        elements.push(
          <p key={index} className="font-semibold text-blue-200 my-2">
            {formatInlineText(text)}
          </p>
        );
      }
      // Horizontal rule
      else if (line.trim() === '---' || line.trim() === '___') {
        flushList();
        elements.push(
          <hr key={index} className="my-4 border-gray-600" />
        );
      }
      // Ordered list
      else if (line.match(/^\d+\.\s/)) {
        if (listType !== 'ol') {
          flushList();
          listType = 'ol';
        }
        currentList.push(line.replace(/^\d+\.\s/, ''));
      }
      // Unordered list (bullet points) - handle various formats
      else if (line.match(/^[\s]*[•\-\*\|]\s/) || line.trim().startsWith('|')) {
        if (listType !== 'ul') {
          flushList();
          listType = 'ul';
        }
        // Clean up the line and remove list markers
        const cleanLine = line.replace(/^[\s]*[•\-\*\|]+\s*/, '').trim();
        if (cleanLine) {
          currentList.push(cleanLine);
        }
      }
      // Code block
      else if (line.startsWith('```')) {
        flushList();
        // Skip code block markers for now
        return;
      }
      // Regular paragraph
      else {
        flushList();
        const trimmedLine = line.trim();
        if (trimmedLine) {
          // Check if it's a section header (starts with |)
          if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
            const sectionText = trimmedLine.replace(/^\|/, '').replace(/\|$/, '').trim();
            elements.push(
              <p key={index} className="font-semibold text-blue-300 my-3 text-lg">
                {formatInlineText(sectionText)}
              </p>
            );
          } else {
            elements.push(
              <p key={index} className="text-gray-100 my-2 leading-relaxed">
                {formatInlineText(trimmedLine)}
              </p>
            );
          }
        }
      }
    });

    flushList();
    return elements;
  };

  // Format inline text (bold, italic, code, links)
  const formatInlineText = (text: string) => {
    const parts: (string | React.ReactElement)[] = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      // Bold **text**
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      if (boldMatch && boldMatch.index !== undefined) {
        if (boldMatch.index > 0) {
          parts.push(remaining.substring(0, boldMatch.index));
        }
        parts.push(
          <strong key={key++} className="font-semibold text-blue-200">
            {boldMatch[1]}
          </strong>
        );
        remaining = remaining.substring(boldMatch.index + boldMatch[0].length);
        continue;
      }

      // Italic *text*
      const italicMatch = remaining.match(/\*(.+?)\*/);
      if (italicMatch && italicMatch.index !== undefined) {
        if (italicMatch.index > 0) {
          parts.push(remaining.substring(0, italicMatch.index));
        }
        parts.push(
          <em key={key++} className="italic text-gray-300">
            {italicMatch[1]}
          </em>
        );
        remaining = remaining.substring(italicMatch.index + italicMatch[0].length);
        continue;
      }

      // Inline code `code`
      const codeMatch = remaining.match(/`(.+?)`/);
      if (codeMatch && codeMatch.index !== undefined) {
        if (codeMatch.index > 0) {
          parts.push(remaining.substring(0, codeMatch.index));
        }
        parts.push(
          <code key={key++} className="bg-gray-800 px-2 py-0.5 rounded text-sm font-mono text-blue-300">
            {codeMatch[1]}
          </code>
        );
        remaining = remaining.substring(codeMatch.index + codeMatch[0].length);
        continue;
      }

      // No more matches, add remaining text
      parts.push(remaining);
      break;
    }

    return <>{parts}</>;
  };

  return <div className="space-y-1">{formatText(cleanContent)}</div>;
}

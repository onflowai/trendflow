import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';

const SAFE_PROTOCOL = /^(https?|mailto):/i;
/**
 * Sanitizer used to sanitize the markdown
 * @param {*} markdown 
 * @returns 
 */
export const sanitizeMarkdown = (markdown) => {
  if (typeof markdown !== 'string') return '';
  const tree = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .parse(markdown);
  visit(tree, (node, index, parent) => {
    if (node.type === 'html') {
      parent.children.splice(index, 1);
    }// strip raw HTML blocks entirely
    if (node.type === 'link') {
      if (!SAFE_PROTOCOL.test(node.url || '')) {
        node.url = '';// kill javascript:
      }
    }// sanitize links
    if (node.type === 'image') {
      parent.children.splice(index, 1); //HERE
    }//block images (tracking pixels)
  });
  return unified()
    .use(remarkStringify)
    .stringify(tree);
};
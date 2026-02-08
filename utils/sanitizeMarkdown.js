import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';

const SAFE_PROTOCOL = /^(https?|mailto):/i;// keep strict by default
/**
 * Sanitizer used to sanitize the markdown
 * @param {*} markdown 
 * @returns 
 */
export const sanitizeMarkdown = (markdown) => {
  if (typeof markdown !== 'string') return '';

  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown);

  visit(tree, (node, index, parent) => {
    if (!parent || typeof index !== 'number') return; //(guard)
    if (node.type === 'html') {
      parent.children.splice(index, 1);
      return index; //prevent skipping next sibling
    }//strip raw HTML blocks entirely
    if (node.type === 'image') {
      parent.children.splice(index, 1);
      return index;
    }//block images
    if (node.type === 'link') {
      const url = String(node.url || '').trim();
      if (url && !SAFE_PROTOCOL.test(url)) {
        // unwrap link into plain text content
        const replacement = Array.isArray(node.children) ? node.children : [];
        parent.children.splice(index, 1, ...replacement);
        return index;
      }// for strict security reject non-safe protocols.
    }//sanitize inline links
    if (node.type === 'definition') {
      const url = String(node.url || '').trim();
      if (url && !SAFE_PROTOCOL.test(url)) {
        node.url = ''; //kill unsafe definition target
      }
    }//sanitize reference-style links: [x][ref] with [ref]: url in definitions
  });
  return unified()
    .use(remarkStringify, {
      bullet: '-', //optional stable output
      fences: true, //keep ``` fences
    })
    .stringify(tree);
};
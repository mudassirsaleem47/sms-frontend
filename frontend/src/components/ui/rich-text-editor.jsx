import { forwardRef, useImperativeHandle } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { cn } from '@/lib/utils';
import {
    Bold,
    Italic,
    UnderlineIcon,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Undo,
    Redo,
    Heading2,
    Quote,
    Minus,
} from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';

const ToolbarButton = ({ onClick, isActive, disabled, children, title }) => (
    <Toggle
        size="sm"
        pressed={isActive}
        onPressedChange={onClick}
        disabled={disabled}
        title={title}
        className={cn('h-8 w-8 p-0', isActive && 'bg-muted text-foreground')}
    >
        {children}
    </Toggle>
);

const RichTextEditor = forwardRef(function RichTextEditor(
    {
        value = '',
        onChange,
        placeholder = 'Write your message here...',
        className,
        showCharCount = true,
    },
    ref
) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: { keepMarks: true, keepAttributes: false },
                orderedList: { keepMarks: true, keepAttributes: false },
            }),
            Underline,
            Placeholder.configure({ placeholder }),
            CharacterCount,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        content: value,
        onUpdate: ({ editor: e }) => {
            onChange && onChange(e.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'min-h-[150px] w-full px-3 py-2 text-sm focus:outline-none prose prose-sm dark:prose-invert max-w-none',
            },
        },
    });

    // Expose insertText method to parent via ref
    useImperativeHandle(ref, () => ({
        insertText: (text) => {
            if (editor) {
                editor.chain().focus().insertContent({ type: 'text', text }).run();
            }
        },
    }), [editor]);

    if (!editor) return null;

    const charCount = editor.storage.characterCount?.characters() ?? 0;

    return (
        <div className={cn('rounded-md border border-input bg-background focus-within:ring-1 focus-within:ring-ring', className)}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 border-b border-input px-2 py-1.5">
                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    isActive={false}
                    disabled={!editor.can().undo()}
                    title="Undo"
                >
                    <Undo className="h-3.5 w-3.5" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    isActive={false}
                    disabled={!editor.can().redo()}
                    title="Redo"
                >
                    <Redo className="h-3.5 w-3.5" />
                </ToolbarButton>

                <Separator orientation="vertical" className="mx-1 h-6" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    title="Heading"
                >
                    <Heading2 className="h-3.5 w-3.5" />
                </ToolbarButton>

                <Separator orientation="vertical" className="mx-1 h-6" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    title="Bold"
                >
                    <Bold className="h-3.5 w-3.5" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    title="Italic"
                >
                    <Italic className="h-3.5 w-3.5" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive('underline')}
                    title="Underline"
                >
                    <UnderlineIcon className="h-3.5 w-3.5" />
                </ToolbarButton>

                <Separator orientation="vertical" className="mx-1 h-6" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    title="Bullet List"
                >
                    <List className="h-3.5 w-3.5" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    title="Numbered List"
                >
                    <ListOrdered className="h-3.5 w-3.5" />
                </ToolbarButton>

                <Separator orientation="vertical" className="mx-1 h-6" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    isActive={editor.isActive({ textAlign: 'left' })}
                    title="Align Left"
                >
                    <AlignLeft className="h-3.5 w-3.5" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    isActive={editor.isActive({ textAlign: 'center' })}
                    title="Align Center"
                >
                    <AlignCenter className="h-3.5 w-3.5" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    isActive={editor.isActive({ textAlign: 'right' })}
                    title="Align Right"
                >
                    <AlignRight className="h-3.5 w-3.5" />
                </ToolbarButton>

                <Separator orientation="vertical" className="mx-1 h-6" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                    title="Blockquote"
                >
                    <Quote className="h-3.5 w-3.5" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    isActive={false}
                    title="Horizontal Rule"
                >
                    <Minus className="h-3.5 w-3.5" />
                </ToolbarButton>
            </div>

            {/* Editor Area */}
            <EditorContent editor={editor} />

            {/* Character Count */}
            {showCharCount && (
                <div className="border-t border-input px-3 py-1 text-right text-xs text-muted-foreground">
                    {charCount} characters
                </div>
            )}
        </div>
    );
});

export { RichTextEditor };
export default RichTextEditor;

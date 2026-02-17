"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import { ResizableImage } from './tiptap/ResizableImage';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { Highlight } from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import FontSize from 'tiptap-extension-font-size';
import Details from '@tiptap/extension-details';
import DetailsSummary from '@tiptap/extension-details-summary';
import DetailsContent from '@tiptap/extension-details-content';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { useEffect, useState, useCallback, useRef } from 'react';
import '@/styles/editor.css';
import {
    Bold, Italic, List, ListOrdered, Heading1, Heading2, Heading3,
    CheckSquare, Link as LinkIcon, Save, Loader2, Image as ImageIcon,
    Table as TableIcon, Code, Underline as UnderlineIcon,
    AlignLeft, AlignCenter, AlignRight, Palette, ChevronRight,
    Trash2, PlusCircle, Maximize2, Settings2
} from 'lucide-react';

const lowlight = createLowlight(common);

interface DocumentEditorProps {
    documentId?: string;
    clientId: string;
    workspaceId: string;
    initialContent?: any;
    onSave?: (content: any) => Promise<void>;
    autoSave?: boolean;
}

/**
 * DocumentEditor (Pro Version)
 * Estilo Notion com suporte a Toggles, Tabelas, Imagens e Checklist.
 */
export default function DocumentEditor({
    documentId,
    clientId,
    workspaceId,
    initialContent,
    onSave,
    autoSave = true
}: DocumentEditorProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [showSpacingMenu, setShowSpacingMenu] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { setIsMounted(true); }, []);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
                codeBlock: false,
                bulletList: { HTMLAttributes: { class: 'bullet-list' } },
                orderedList: { HTMLAttributes: { class: 'ordered-list' } },
            }),
            CodeBlockLowlight.configure({ lowlight }),
            Table.configure({ resizable: true }),
            TableRow,
            TableHeader,
            TableCell,
            Underline,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Highlight.configure({ multicolor: true }),
            TextStyle.extend({
                addAttributes() {
                    return {
                        ...this.parent?.(),
                        lineHeight: {
                            default: null,
                            renderHTML: attributes => attributes.lineHeight ? { style: `line-height: ${attributes.lineHeight}` } : {},
                        },
                        marginBottom: {
                            default: null,
                            renderHTML: attributes => attributes.marginBottom ? { style: `margin-bottom: ${attributes.marginBottom}` } : {},
                        }
                    }
                }
            }),
            Color,
            FontSize,
            Details.configure({ persist: true, HTMLAttributes: { class: 'details-wrapper' } }),
            DetailsSummary,
            DetailsContent,
            TaskList,
            TaskItem.configure({ nested: true }),
            Placeholder.configure({ placeholder: 'Digite "/" para comandos...' }),
            Link.configure({ openOnClick: false }),
            ResizableImage.configure({
                allowBase64: true,
            }),
        ],
        content: (() => {
            if (!initialContent) return '<p>Novo Documento</p>';
            if (typeof initialContent === 'string') {
                // Se a string começar com {, provavelmente é um JSON do Tiptap que veio como texto
                if (initialContent.trim().startsWith('{')) {
                    try {
                        return JSON.parse(initialContent);
                    } catch (e) {
                        return initialContent;
                    }
                }
                return initialContent;
            }
            return initialContent;
        })(),
        editorProps: {
            attributes: { class: 'prose prose-slate max-w-none focus:outline-none min-h-[500px] px-8 py-10' },
            handleClick: (view, pos, event) => {
                const { target } = event;
                if (target instanceof HTMLElement && target.closest('summary')) {
                    const $pos = view.state.doc.resolve(pos);
                    for (let d = $pos.depth; d >= 0; d--) {
                        const node = $pos.node(d);
                        if (node.type.name === 'details') {
                            const nodePos = $pos.before(d);
                            view.dispatch(
                                view.state.tr.setNodeAttribute(nodePos, 'open', !node.attrs.open)
                            );
                            return true;
                        }
                    }
                }
                return false;
            }
        },
        onUpdate: () => { if (autoSave) setSaveStatus('unsaved'); },
    });

    // Auto-save logic
    useEffect(() => {
        if (!autoSave || !editor || !onSave) return;
        const interval = setInterval(async () => {
            if (saveStatus === 'unsaved') {
                setSaveStatus('saving');
                try {
                    // Salva como JSON para o campo JSONB do Supabase
                    await onSave(editor.getJSON());
                    setLastSaved(new Date());
                    setSaveStatus('saved');
                } catch (err) {
                    console.error('Erro no auto-save:', err);
                    setSaveStatus('unsaved');
                }
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [autoSave, editor, onSave, saveStatus]);

    const handleImageUpload = useCallback((file: File) => {
        if (!editor) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const src = ev.target?.result as string;
            // @ts-ignore
            editor.chain().focus().setImage({ src }).run();
        };
        reader.readAsDataURL(file);
    }, [editor]);

    const addImage = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    if (!isMounted || !editor) return (
        <div className="flex items-center justify-center py-20 bg-white border border-brand-slate/10 min-h-[500px]">
            <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
        </div>
    );

    return (
        <div className="bg-white border-l border-r border-b border-brand-slate/10 relative">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                }}
            />
            <div className="editor-toolbar sticky top-[-1px] z-50 flex items-center justify-between bg-white border-b border-brand-slate/10 px-4 py-2 flex-wrap gap-2 shadow-sm">
                <div className="flex items-center gap-1 flex-wrap">
                    {/* Headings */}
                    <div className="flex items-center gap-0.5">
                        {[1, 2, 3].map(l => (
                            <button key={l} type="button" onClick={() => editor.chain().focus().toggleHeading({ level: l as any }).run()}
                                className={`p-1.5 rounded hover:bg-slate-100 ${editor.isActive('heading', { level: l }) ? 'text-brand-gold font-bold' : 'text-slate-600'}`}>
                                {l === 1 ? <Heading1 className="w-4 h-4" /> : l === 2 ? <Heading2 className="w-4 h-4" /> : <Heading3 className="w-4 h-4" />}
                            </button>
                        ))}
                    </div>

                    <div className="w-px h-6 bg-slate-200 mx-1" />

                    {/* Font Size & Spacing */}
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded p-1 relative">
                        <select onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
                            className="bg-transparent text-[10px] font-bold text-slate-500 focus:outline-none px-1"
                            value={editor.getAttributes('textStyle').fontSize || '16px'}>
                            <option value="12px">Pequeno</option>
                            <option value="14px">Normal</option>
                            <option value="16px">Médio</option>
                            <option value="20px">Grande</option>
                        </select>
                        <div className="w-px h-4 bg-slate-200 mx-1" />
                        <button type="button" onClick={() => setShowSpacingMenu(!showSpacingMenu)} className="p-1 hover:bg-white rounded text-slate-500 transition-colors">
                            <AlignLeft className="w-3.5 h-3.5" />
                        </button>
                        {showSpacingMenu && (
                            <div className="absolute top-full left-0 mt-2 bg-white border border-brand-slate/10 shadow-xl rounded-lg z-[100] w-40 p-1 animate-in fade-in slide-in-from-top-1">
                                <p className="px-2 py-1 text-[8px] font-bold text-slate-400 uppercase">Densidade</p>
                                {[
                                    { id: 'normal', label: 'Normal (Padrão)', lh: '1.6', mb: '1rem' },
                                    { id: 'compact', label: 'Compacto', lh: '1.2', mb: '0.4rem' },
                                    { id: 'tight', label: 'Notion (Colado)', lh: '1', mb: '0' }
                                ].map(s => (
                                    <button key={s.id} type="button" onClick={() => {
                                        editor.chain().focus().setMark('textStyle', { lineHeight: s.lh, marginBottom: s.mb }).run();
                                        setShowSpacingMenu(false);
                                    }} className="w-full text-left px-2 py-1.5 text-[10px] font-bold hover:bg-brand-cream hover:text-brand-gold rounded transition-colors">
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="w-px h-6 bg-slate-200 mx-1" />

                    {/* Formatting */}
                    <div className="flex items-center gap-0.5">
                        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}
                            className={`p-1.5 rounded hover:bg-slate-100 ${editor.isActive('bold') ? 'text-brand-gold font-bold' : 'text-slate-600'}`}><Bold className="w-4 h-4" /></button>
                        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={`p-1.5 rounded hover:bg-slate-100 ${editor.isActive('italic') ? 'text-brand-gold font-bold' : 'text-slate-600'}`}><Italic className="w-4 h-4" /></button>
                        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()}
                            className={`p-1.5 rounded hover:bg-slate-100 ${editor.isActive('underline') ? 'text-brand-gold font-bold' : 'text-slate-600'}`}><UnderlineIcon className="w-4 h-4" /></button>
                    </div>

                    <div className="w-px h-6 bg-slate-200 mx-1" />

                    {/* Lists & Toggles */}
                    <div className="flex items-center gap-0.5">
                        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}
                            className={`p-1.5 rounded hover:bg-slate-100 ${editor.isActive('bulletList') ? 'text-brand-gold' : 'text-slate-600'}`}><List className="w-4 h-4" /></button>
                        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            className={`p-1.5 rounded hover:bg-slate-100 ${editor.isActive('orderedList') ? 'text-brand-gold' : 'text-slate-600'}`}><ListOrdered className="w-4 h-4" /></button>
                        <button type="button" onClick={() => editor.chain().focus().toggleTaskList().run()}
                            className={`p-1.5 rounded hover:bg-slate-100 ${editor.isActive('taskList') ? 'text-brand-gold' : 'text-slate-600'}`}><CheckSquare className="w-4 h-4" /></button>
                        <button type="button" onClick={() => editor.chain().focus().setDetails().run()}
                            className="p-1.5 rounded hover:bg-brand-cream text-slate-600 hover:text-brand-gold transition-colors" title="Toggle List (Notion)"><ChevronRight className="w-4 h-4" /></button>
                    </div>

                    <div className="w-px h-6 bg-slate-200 mx-1" />

                    {/* Insert & Table Control */}
                    <div className="flex items-center gap-1">
                        <button type="button" onClick={addImage} className="p-1.5 rounded hover:bg-brand-cream text-slate-600 transition-colors" title="Inserir Imagem">
                            <ImageIcon className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                            className={`p-1.5 rounded transition-colors ${editor.isActive('table') ? 'bg-amber-100 text-amber-700' : 'hover:bg-brand-cream text-slate-600'}`}
                            title="Tabela">
                            <TableIcon className="w-4 h-4" />
                        </button>

                        {editor.isActive('table') && (
                            <div className="flex items-center gap-0.5 bg-amber-50 border border-amber-200 rounded p-0.5">
                                <button type="button" onClick={() => editor.chain().focus().addColumnAfter().run()} className="p-1 hover:bg-white rounded text-amber-700" title="Add Coluna"><PlusCircle className="w-3.5 h-3.5" /></button>
                                <div className="w-px h-3 bg-amber-200 mx-0.5" />
                                <button type="button" onClick={() => editor.chain().focus().deleteTable().run()} className="p-1 hover:bg-red-50 rounded text-red-600 font-bold text-[10px] flex items-center gap-1" title="Excluir Tabela">
                                    <Trash2 className="w-3.5 h-3.5" /> EXCLUIR
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4 pr-2">
                    <div className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                        {saveStatus === 'saved' ? 'Sincronizado' : saveStatus === 'saving' ? 'Sincronizando...' : 'Alterações pendentes'}
                    </div>
                </div>
            </div>

            <EditorContent editor={editor} />
        </div>
    );
}

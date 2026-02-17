import Image from '@tiptap/extension-image';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

export const ResizableImageExtension = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: null,
                renderHTML: attributes => {
                    if (!attributes.width) {
                        return {};
                    }
                    return { width: attributes.width };
                },
            },
            height: {
                default: null,
                renderHTML: attributes => {
                    if (!attributes.height) {
                        return {};
                    }
                    return { height: attributes.height };
                },
            },
        };
    },

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('imageResize'),
                props: {
                    decorations(state) {
                        const { doc, selection } = state;
                        const decorations: Decoration[] = [];

                        doc.descendants((node, pos) => {
                            if (node.type.name === 'image') {
                                const isSelected = selection.from === pos;
                                if (isSelected) {
                                    decorations.push(
                                        Decoration.node(pos, pos + node.nodeSize, {
                                            class: 'ProseMirror-selectednode',
                                        })
                                    );
                                }
                            }
                        });

                        return DecorationSet.create(doc, decorations);
                    },
                    handleDOMEvents: {
                        mousedown(view, event) {
                            const target = event.target as HTMLElement;
                            if (target.tagName === 'IMG') {
                                const img = target as HTMLImageElement;
                                const startX = event.clientX;
                                const startY = event.clientY;
                                const startWidth = img.width;
                                const startHeight = img.height;
                                const aspectRatio = startWidth / startHeight;

                                const onMouseMove = (e: MouseEvent) => {
                                    const deltaX = e.clientX - startX;
                                    let newWidth = startWidth + deltaX;

                                    // Limites
                                    newWidth = Math.max(100, Math.min(newWidth, 1200));
                                    const newHeight = newWidth / aspectRatio;

                                    img.style.width = `${newWidth}px`;
                                    img.style.height = `${newHeight}px`;
                                };

                                const onMouseUp = () => {
                                    document.removeEventListener('mousemove', onMouseMove);
                                    document.removeEventListener('mouseup', onMouseUp);

                                    // Atualizar atributos no editor
                                    const pos = view.posAtDOM(img, 0);
                                    const tr = view.state.tr.setNodeMarkup(pos, undefined, {
                                        ...view.state.doc.nodeAt(pos)?.attrs,
                                        width: img.width,
                                        height: img.height,
                                    });
                                    view.dispatch(tr);
                                };

                                document.addEventListener('mousemove', onMouseMove);
                                document.addEventListener('mouseup', onMouseUp);
                                event.preventDefault();
                                return true;
                            }
                            return false;
                        },
                    },
                },
            }),
        ];
    },
});

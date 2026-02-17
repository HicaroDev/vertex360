"use client";

import { NodeViewWrapper } from '@tiptap/react';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function ResizableImageComponent({ node, updateAttributes, selected }: any) {
    const imgRef = useRef<HTMLImageElement>(null);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

    const handleMouseDown = useCallback(
        (e: React.MouseEvent, direction: 'se' | 'sw' | 'ne' | 'nw') => {
            e.preventDefault();
            e.stopPropagation();

            if (!imgRef.current) return;

            const rect = imgRef.current.getBoundingClientRect();
            setResizeStart({
                x: e.clientX,
                y: e.clientY,
                width: rect.width,
                height: rect.height,
            });
            setIsResizing(true);

            const handleMouseMove = (moveEvent: MouseEvent) => {
                if (!imgRef.current) return;

                const deltaX = moveEvent.clientX - resizeStart.x;
                const deltaY = moveEvent.clientY - resizeStart.y;

                let newWidth = resizeStart.width;
                let newHeight = resizeStart.height;

                // Calcular nova largura baseado na direção
                switch (direction) {
                    case 'se': // Sudeste (canto inferior direito)
                        newWidth = resizeStart.width + deltaX;
                        break;
                    case 'sw': // Sudoeste (canto inferior esquerdo)
                        newWidth = resizeStart.width - deltaX;
                        break;
                    case 'ne': // Nordeste (canto superior direito)
                        newWidth = resizeStart.width + deltaX;
                        break;
                    case 'nw': // Noroeste (canto superior esquerdo)
                        newWidth = resizeStart.width - deltaX;
                        break;
                }

                // Manter proporção
                const aspectRatio = resizeStart.width / resizeStart.height;
                newHeight = newWidth / aspectRatio;

                // Limites mínimos e máximos
                newWidth = Math.max(100, Math.min(newWidth, 1200));
                newHeight = newWidth / aspectRatio;

                // Atualizar visualmente
                imgRef.current.style.width = `${newWidth}px`;
                imgRef.current.style.height = `${newHeight}px`;
            };

            const handleMouseUp = () => {
                if (!imgRef.current) return;

                const finalWidth = parseInt(imgRef.current.style.width);
                const finalHeight = parseInt(imgRef.current.style.height);

                updateAttributes({
                    width: finalWidth,
                    height: finalHeight,
                });

                setIsResizing(false);
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        },
        [resizeStart, updateAttributes]
    );

    return (
        <NodeViewWrapper
            className={`resizable-image-wrapper ${selected ? 'selected' : ''} ${isResizing ? 'resizing' : ''}`}
            style={{
                display: 'inline-block',
                position: 'relative',
                maxWidth: '100%',
                margin: '1rem 0',
            }}
        >
            <img
                ref={imgRef}
                src={node.attrs.src}
                alt={node.attrs.alt || ''}
                title={node.attrs.title || ''}
                style={{
                    width: node.attrs.width ? `${node.attrs.width}px` : 'auto',
                    height: node.attrs.height ? `${node.attrs.height}px` : 'auto',
                    maxWidth: '100%',
                    borderRadius: '0.5rem',
                    display: 'block',
                    cursor: selected ? 'default' : 'pointer',
                }}
                draggable={false}
            />

            {/* Handles de redimensionamento - aparecem apenas quando selecionado */}
            {selected && (
                <>
                    {/* Handle Sudeste (canto inferior direito) */}
                    <div
                        className="resize-handle resize-handle-se"
                        onMouseDown={(e) => handleMouseDown(e, 'se')}
                        style={{
                            position: 'absolute',
                            bottom: '-6px',
                            right: '-6px',
                            width: '16px',
                            height: '16px',
                            background: '#D4AF37',
                            border: '2px solid white',
                            borderRadius: '50%',
                            cursor: 'nwse-resize',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                            zIndex: 10,
                        }}
                    />

                    {/* Handle Sudoeste (canto inferior esquerdo) */}
                    <div
                        className="resize-handle resize-handle-sw"
                        onMouseDown={(e) => handleMouseDown(e, 'sw')}
                        style={{
                            position: 'absolute',
                            bottom: '-6px',
                            left: '-6px',
                            width: '16px',
                            height: '16px',
                            background: '#D4AF37',
                            border: '2px solid white',
                            borderRadius: '50%',
                            cursor: 'nesw-resize',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                            zIndex: 10,
                        }}
                    />

                    {/* Handle Nordeste (canto superior direito) */}
                    <div
                        className="resize-handle resize-handle-ne"
                        onMouseDown={(e) => handleMouseDown(e, 'ne')}
                        style={{
                            position: 'absolute',
                            top: '-6px',
                            right: '-6px',
                            width: '16px',
                            height: '16px',
                            background: '#D4AF37',
                            border: '2px solid white',
                            borderRadius: '50%',
                            cursor: 'nesw-resize',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                            zIndex: 10,
                        }}
                    />

                    {/* Handle Noroeste (canto superior esquerdo) */}
                    <div
                        className="resize-handle resize-handle-nw"
                        onMouseDown={(e) => handleMouseDown(e, 'nw')}
                        style={{
                            position: 'absolute',
                            top: '-6px',
                            left: '-6px',
                            width: '16px',
                            height: '16px',
                            background: '#D4AF37',
                            border: '2px solid white',
                            borderRadius: '50%',
                            cursor: 'nwse-resize',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                            zIndex: 10,
                        }}
                    />
                </>
            )}
        </NodeViewWrapper>
    );
}

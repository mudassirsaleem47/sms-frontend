import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const Tooltip = ({ children, text, position = 'top' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const triggerRef = useRef(null);

    const updatePosition = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const centerHorizontal = rect.left + rect.width / 2;
            const centerVertical = rect.top + rect.height / 2;
            
            // Set anchor points directly to the edge of the element
            let top = 0;
            let left = 0;
            
            // Note: We don't add gap here. Gap is handled by margin in the tooltip container
            // This simplifies the transform logic
            switch (position) {
                case 'top':
                    top = rect.top;
                    left = centerHorizontal;
                    break;
                case 'bottom':
                    top = rect.bottom;
                    left = centerHorizontal;
                    break;
                case 'left':
                    top = centerVertical;
                    left = rect.left;
                    break;
                case 'right':
                    top = centerVertical;
                    left = rect.right;
                    break;
            }
            setCoords({ top, left });
        }
    };

    useEffect(() => {
        if (isVisible) {
            window.addEventListener('scroll', updatePosition);
            window.addEventListener('resize', updatePosition);
            updatePosition();
        }
        return () => {
            window.removeEventListener('scroll', updatePosition);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isVisible]);

    return (
        <>
            <div 
                ref={triggerRef}
                className="inline-flex cursor-pointer"
                onMouseEnter={() => { updatePosition(); setIsVisible(true); }}
                onMouseLeave={() => setIsVisible(false)}
            >
                {children}
            </div>

            {isVisible && createPortal(
                <div className="fixed pointer-events-none top-0 left-0 w-full h-full" style={{ zIndex: 99999 }}>
                    {/* Styles for animations */}
                    <style>
                        {`
                        @keyframes slideUpFade {
                            from { opacity: 0; transform: translate(-50%, -80%) scale(0.95); }
                            to { opacity: 1; transform: translate(-50%, -100%) scale(1); }
                        }
                        @keyframes slideDownFade {
                            from { opacity: 0; transform: translate(-50%, 20%) scale(0.95); }
                            to { opacity: 1; transform: translate(-50%, 0) scale(1); }
                        }
                        @keyframes slideLeftFade {
                            from { opacity: 0; transform: translate(-20%, -50%) scale(0.95); }
                            to { opacity: 1; transform: translate(-100%, -50%) scale(1); }
                        }
                        @keyframes slideRightFade {
                            from { opacity: 0; transform: translate(20%, -50%) scale(0.95); }
                            to { opacity: 1; transform: translate(0, -50%) scale(1); }
                        }
                        `}
                    </style>

                    <div 
                        className={`
                            absolute bg-gray-900 text-white text-xs font-medium px-3 py-1.5 
                            rounded-lg shadow-2xl backdrop-blur-md border border-white/10 whitespace-nowrap
                            ${position === 'top' ? 'mb-2 pb-1' : ''}
                            ${position === 'bottom' ? 'mt-2 pt-1' : ''}
                            ${position === 'left' ? 'mr-2 pr-1' : ''}
                            ${position === 'right' ? 'ml-2 pl-1' : ''}
                        `}
                        style={{ 
                            top: coords.top, 
                            left: coords.left,
                            animation: `${
                                position === 'top' ? 'slideUpFade' : 
                                position === 'bottom' ? 'slideDownFade' : 
                                position === 'left' ? 'slideLeftFade' : 
                                'slideRightFade'
                            } 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards`
                        }}
                    >
                        {text}
                        {/* Arrow */}
                        <div className={`
                            absolute w-2.5 h-2.5 bg-gray-900 border-r border-b border-white/10 transform rotate-45 -z-10
                            ${position === 'top' ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-t-0 border-l-0' : ''}
                            ${position === 'bottom' ? 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 border-b-0 border-r-0 border-t border-l' : ''}
                            ${position === 'left' ? 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2 border-t border-r' : ''}
                            ${position === 'right' ? 'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 border-b border-l' : ''}
                        `}></div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default Tooltip;

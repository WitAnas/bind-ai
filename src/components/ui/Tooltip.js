import React, { useState, useRef } from 'react';
import { useOnClickOutside } from '@/features/hooks';

const ToolTip = ({ content,contentVisible }) => {

    return (
        <>
            <div className="ml-4 relative">
                {contentVisible && (
                    <div className="p-2 rounded text-sm text-primary tooltip-content absolute bg-white">
                        {content}
                    </div>
                )}
            </div>
            <style jsx>
                {`
                    .tooltip-content {
                        box-shadow: 0 2px 8px 0 rgba(23, 26, 33, 0.12);
                        border: solid 1px #ebedf0;
                        width: 275px;
                        right: -63px;
                        top: 13px;
                        transform: translateY(-135%);
                    }
                    .tooltip-content:after {
                        content: '';
                        margin: 0 0.5em;
                        display: inline-block;
                        border: 7px solid transparent;
                        border-top: 8px solid #fff;
                        border-bottom: 0 none;
                        bottom: -8px;
                        right: 60px;
                        position: absolute;
                    }
                    @media (min-width: 768px) {
                        .tooltip-content {
                            right: -63px;
                            top: -8px;
                        }
                    }
                `}
            </style>
        </>
    );
};

export default ToolTip;

'use client';

import React from 'react';

interface VideoPlayerProps {
    src: string;
    title?: string;
}

export default function VideoPlayer({ src, title }: VideoPlayerProps) {
    return (
        <div>
            <video src={src} controls className="bg-black rounded-md w-full" />
            {title && <div className="mt-2 font-medium text-sm">{title}</div>}
        </div>
    );
}

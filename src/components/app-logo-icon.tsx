import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon({ className, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/logo.png?v=2"
            alt="NexaPOS Logo"
            className={`rounded-md object-contain ${className || ''}`}
            {...props}
        />
    );
}

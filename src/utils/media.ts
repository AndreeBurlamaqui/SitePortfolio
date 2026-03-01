// Import images and videos
import fs from 'node:fs';
import path from 'node:path';


export interface MediaItem {
    src: string;
    type: 'video' | 'img';
    title: string;
}

export function getGalleryMedia(folder: string): MediaItem[] {
    const folderPath = path.join(process.cwd(), 'public', 'gallery', folder);
    if (!fs.existsSync(folderPath)) return [];

    return fs.readdirSync(folderPath)
        .filter(file => /\.(png|jpe?g|webp|gif|mp4|webm|mov)$/i.test(file))
        .sort((a, b) => { 
        // Extract number from "[123]..." for sorting first
        const getOrder = (name: string) => {
            const match = name.match(/^\[(\d+)\]/);
            return match ? parseInt(match[1], 10) : Infinity;
        };

        const orderA = getOrder(a);
        const orderB = getOrder(b);

        // Check order after parsing
        if (orderA !== orderB) {
            return orderA - orderB;
        }

        // If everything goes wrong, go default
        return a.localeCompare(b);
        })
        .map(file => {
        const userFriendlyName =
            path.parse(file).name // Remove filename
            .replace(/^\[\d+\]-*/, '') // Remove ordering prefix (if any)
            .split('-') // Clear kebab-case
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalizes first letter of words
            .join(' ');

        const isVideo = /\.(mp4|webm|mov)$/i.test(file);

        return {
            src: `/gallery/${folder}/${file}`,
            type: isVideo ? 'video' : 'img',
            title: userFriendlyName
        };
});
}
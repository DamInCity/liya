import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface GalleryImage {
    id: string;
    url: string;
    filename: string;
    originalName: string;
    uploadedAt: string;
}

export const GallerySection = () => {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [uploading, setUploading] = useState(false);
    const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());

    const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
    const apiUrl = import.meta.env.VITE_API_URL || '/api';

    useEffect(() => {
        fetchGalleryImages();
    }, []);

    const fetchGalleryImages = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${apiUrl}/gallery`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setImages(data);
            } else {
                console.error('Failed to fetch gallery images');
            }
        } catch (error) {
            console.error('Error fetching gallery images:', error);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);

        try {
            const token = localStorage.getItem('adminToken');
            const formData = new FormData();
            
            Array.from(files).forEach(file => {
                formData.append('images', file);
            });

            const response = await fetch(`${apiUrl}/gallery/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                const uploadedImages = await response.json();
                setImages(prev => [...uploadedImages, ...prev]);
            } else {
                console.error('Upload failed');
            }
        } catch (error) {
            console.error('Error uploading images:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async () => {
        if (selectedImages.size === 0) return;

        if (!confirm(`Delete ${selectedImages.size} selected image(s)?`)) return;

        try {
            const token = localStorage.getItem('adminToken');
            const deletePromises = Array.from(selectedImages).map(id =>
                fetch(`${apiUrl}/gallery/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
            );

            await Promise.all(deletePromises);
            setImages(prev => prev.filter(img => !selectedImages.has(img.id)));
            setSelectedImages(new Set());
        } catch (error) {
            console.error('Error deleting images:', error);
        }
    };

    const toggleImageSelection = (id: string) => {
        setSelectedImages(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const selectAll = () => {
        if (selectedImages.size === images.length) {
            setSelectedImages(new Set());
        } else {
            setSelectedImages(new Set(images.map(img => img.id)));
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Image Gallery
                    </h2>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        Central repository for all images used throughout the site
                    </p>
                </div>
                <div className="flex gap-3">
                    {selectedImages.size > 0 && (
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            style={{
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                color: '#ef4444'
                            }}
                        >
                            Delete ({selectedImages.size})
                        </button>
                    )}
                    <label
                        className="px-6 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors"
                        style={{
                            backgroundColor: 'var(--accent)',
                            color: 'var(--bg-main)'
                        }}
                    >
                        {uploading ? 'Uploading...' : 'Upload Images'}
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleUpload}
                            disabled={uploading}
                        />
                    </label>
                </div>
            </div>

            {/* Gallery Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                        {images.length}
                    </div>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        Total Images
                    </div>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                        {selectedImages.size}
                    </div>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        Selected
                    </div>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                        {(images.length / 1024).toFixed(1)}MB
                    </div>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        Est. Size
                    </div>
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <button
                        onClick={selectAll}
                        className="text-sm font-medium"
                        style={{ color: 'var(--accent)' }}
                    >
                        {selectedImages.size === images.length ? 'Deselect All' : 'Select All'}
                    </button>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        {images.length} images
                    </div>
                </div>

                {images.length === 0 ? (
                    <div
                        className="text-center py-16 rounded-lg border-2 border-dashed"
                        style={{ borderColor: 'var(--border-subtle)' }}
                    >
                        <svg
                            className="mx-auto h-12 w-12 mb-4"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            style={{ color: 'var(--text-muted)' }}
                        >
                            <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
                            No images in gallery
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            Upload images to get started
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {images.map((image, index) => (
                            <motion.div
                                key={image.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer border-2 transition-all"
                                style={{
                                    borderColor: selectedImages.has(image.id)
                                        ? 'var(--accent)'
                                        : 'var(--border-subtle)'
                                }}
                                onClick={() => toggleImageSelection(image.id)}
                            >
                                <img
                                    src={`${backendUrl}${image.url}`}
                                    alt={image.originalName}
                                    className="w-full h-full object-cover"
                                />
                                
                                {/* Selection Overlay */}
                                <div
                                    className={`absolute inset-0 transition-opacity ${
                                        selectedImages.has(image.id)
                                            ? 'opacity-100'
                                            : 'opacity-0 group-hover:opacity-100'
                                    }`}
                                    style={{
                                        backgroundColor: selectedImages.has(image.id)
                                            ? 'rgba(162, 89, 255, 0.4)'
                                            : 'rgba(0, 0, 0, 0.4)'
                                    }}
                                />

                                {/* Checkbox */}
                                <div className="absolute top-2 right-2 z-10">
                                    <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                                            selectedImages.has(image.id)
                                                ? 'scale-100'
                                                : 'scale-0 group-hover:scale-100'
                                        }`}
                                        style={{
                                            backgroundColor: selectedImages.has(image.id)
                                                ? 'var(--accent)'
                                                : 'rgba(255, 255, 255, 0.3)'
                                        }}
                                    >
                                        {selectedImages.has(image.id) && (
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="white"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={3}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                </div>

                                {/* Image Info */}
                                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="text-xs text-white truncate">
                                        {image.originalName}
                                    </p>
                                    <p className="text-[10px] text-white/70">
                                        {new Date(image.uploadedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

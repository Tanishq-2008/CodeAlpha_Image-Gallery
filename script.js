// ========================
// IMAGE DATA - WORKING SOURCES
// ========================

const galleryImages = [
    {
        id: 1,
        src: 'https://picsum.photos/800/800?random=1',
        thumb: 'https://picsum.photos/70/70?random=1',
        title: 'Mountain Peak',
        category: 'nature',
        description: 'Majestic mountain landscape'
    },
    {
        id: 2,
        src: 'https://picsum.photos/800/800?random=2',
        thumb: 'https://picsum.photos/70/70?random=2',
        title: 'Night City',
        category: 'architecture',
        description: 'Modern city lights'
    },
    {
        id: 3,
        src: 'https://picsum.photos/800/800?random=3',
        thumb: 'https://picsum.photos/70/70?random=3',
        title: 'Portrait',
        category: 'people',
        description: 'Beautiful portrait'
    },
    {
        id: 4,
        src: 'https://picsum.photos/800/800?random=4',
        thumb: 'https://picsum.photos/70/70?random=4',
        title: 'Forest',
        category: 'nature',
        description: 'Dense forest landscape'
    },
    {
        id: 5,
        src: 'https://picsum.photos/800/800?random=5',
        thumb: 'https://picsum.photos/70/70?random=5',
        title: 'Abstract Art',
        category: 'abstract',
        description: 'Colorful abstract painting'
    },
    {
        id: 6,
        src: 'https://picsum.photos/800/800?random=6',
        thumb: 'https://picsum.photos/70/70?random=6',
        title: 'Modern Building',
        category: 'architecture',
        description: 'Contemporary architecture'
    },
    {
        id: 7,
        src: 'https://picsum.photos/800/800?random=7',
        thumb: 'https://picsum.photos/70/70?random=7',
        title: 'Lifestyle',
        category: 'people',
        description: 'Everyday lifestyle'
    },
    {
        id: 8,
        src: 'https://picsum.photos/800/800?random=8',
        thumb: 'https://picsum.photos/70/70?random=8',
        title: 'Sunrise',
        category: 'nature',
        description: 'Beautiful sunrise'
    },
    {
        id: 9,
        src: 'https://picsum.photos/800/800?random=9',
        thumb: 'https://picsum.photos/70/70?random=9',
        title: 'Minimalist',
        category: 'abstract',
        description: 'Minimalist design'
    },
    {
        id: 10,
        src: 'https://picsum.photos/800/800?random=10',
        thumb: 'https://picsum.photos/70/70?random=10',
        title: 'Street Photography',
        category: 'people',
        description: 'Urban street scene'
    },
    {
        id: 11,
        src: 'https://picsum.photos/800/800?random=11',
        thumb: 'https://picsum.photos/70/70?random=11',
        title: 'Urban Lights',
        category: 'architecture',
        description: 'City night lights'
    },
    {
        id: 12,
        src: 'https://picsum.photos/800/800?random=12',
        thumb: 'https://picsum.photos/70/70?random=12',
        title: 'Waterfall',
        category: 'nature',
        description: 'Flowing waterfall'
    }
];

// ========================
// DOM ELEMENTS
// ========================

const galleryGrid = document.getElementById('galleryGrid');
const loadingSpinner = document.getElementById('loadingSpinner');
const filterButtons = document.querySelectorAll('.filter-btn');
const imageFilterInputs = document.querySelectorAll('.image-filter-input');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('closeLightbox');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const imageTitle = document.getElementById('imageTitle');
const imageCategory = document.getElementById('imageCategory');
const imageCounter = document.getElementById('imageCounter');
const thumbnails = document.getElementById('thumbnails');

// ========================
// STATE MANAGEMENT
// ========================

let currentFilter = 'all';
let currentImageIndex = 0;
let filteredImages = [...galleryImages];
let loadedImages = new Set();
const activeFilters = {
    grayscale: false,
    sepia: false,
    blur: false,
    brightness: false
};

// ========================
// PLACEHOLDER GENERATOR
// ========================

function generatePlaceholder(category) {
    const colors = {
        nature: '#10b981',
        architecture: '#3b82f6',
        people: '#f59e0b',
        abstract: '#8b5cf6'
    };

    const color = colors[category] || '#667eea';
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
            <rect width="800" height="800" fill="${color}"/>
            <text x="400" y="400" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle">
                Image Placeholder
            </text>
        </svg>
    `;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}

// ========================
// INITIALIZE GALLERY
// ========================

function initializeGallery() {
    renderGallery();
    attachEventListeners();
}

// ========================
// RENDER GALLERY ITEMS
// ========================

function renderGallery() {
    galleryGrid.innerHTML = '';
    loadedImages.clear();

    galleryImages.forEach((image, index) => {
        const galleryItem = createGalleryItem(image, index);
        galleryGrid.appendChild(galleryItem);
    });

    // Simulate loading time
    setTimeout(() => {
        loadingSpinner.classList.add('hidden');
    }, 500);
}

function createGalleryItem(image, index) {
    const item = document.createElement('div');
    item.className = 'gallery-item loading';
    item.dataset.category = image.category;
    item.dataset.index = index;

    // Add active filters
    Object.keys(activeFilters).forEach(filter => {
        if (activeFilters[filter]) {
            item.classList.add(`filter-${filter}`);
        }
    });

    const img = document.createElement('img');
    img.src = generatePlaceholder(image.category);
    img.alt = image.title;
    img.loading = 'lazy';

    const categoryBadge = document.createElement('div');
    categoryBadge.className = 'gallery-category';
    categoryBadge.textContent = image.category;

    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <p>Image Failed to Load</p>
    `;
    errorMessage.style.display = 'none';

    const overlay = document.createElement('div');
    overlay.className = 'gallery-overlay';
    overlay.innerHTML = `
        <div class="overlay-content">
            <div class="overlay-icon">
                <i class="fas fa-search-plus"></i>
            </div>
            <div class="overlay-text">View Image</div>
        </div>
    `;

    // Load actual image
    const actualImg = new Image();
    actualImg.onload = () => {
        img.src = image.src;
        item.classList.remove('loading');
        loadedImages.add(index);
    };

    actualImg.onerror = () => {
        console.error(`Failed to load image: ${image.src}`);
        item.classList.add('error');
        item.classList.remove('loading');
        errorMessage.style.display = 'block';
        
        // Use placeholder instead
        img.src = generatePlaceholder(image.category);
    };

    // Start loading with timeout
    const loadTimeout = setTimeout(() => {
        if (!loadedImages.has(index)) {
            item.classList.add('error');
            item.classList.remove('loading');
            errorMessage.style.display = 'block';
            img.src = generatePlaceholder(image.category);
        }
    }, 8000); // 8 second timeout

    actualImg.src = image.src;

    item.appendChild(img);
    item.appendChild(categoryBadge);
    item.appendChild(overlay);
    item.appendChild(errorMessage);

    item.addEventListener('click', () => openLightbox(index));

    return item;
}

// ========================
// FILTER FUNCTIONALITY
// ========================

function attachEventListeners() {
    // Category Filters
    filterButtons.forEach(button => {
        button.addEventListener('click', handleFilterClick);
    });

    // Image Filters
    imageFilterInputs.forEach(input => {
        input.addEventListener('change', handleImageFilter);
    });

    // Lightbox Controls
    lightboxClose.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrevious);
    nextBtn.addEventListener('click', showNext);

    // Keyboard Navigation
    document.addEventListener('keydown', handleKeyboard);

    // Close lightbox on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

function handleFilterClick(e) {
    // Remove active class from all buttons
    filterButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    e.target.classList.add('active');

    // Get filter value
    currentFilter = e.target.dataset.filter;

    // Apply filter
    applyFilter();
}

function applyFilter() {
    const items = document.querySelectorAll('.gallery-item');

    items.forEach(item => {
        const itemCategory = item.dataset.category;

        if (currentFilter === 'all' || itemCategory === currentFilter) {
            item.classList.remove('hidden');
            // Trigger animation
            item.style.animation = 'none';
            setTimeout(() => {
                item.style.animation = 'fadeIn 0.6s ease-out';
            }, 10);
        } else {
            item.classList.add('hidden');
        }
    });

    // Update filtered images array
    if (currentFilter === 'all') {
        filteredImages = [...galleryImages];
    } else {
        filteredImages = galleryImages.filter(
            img => img.category === currentFilter
        );
    }
}

// ========================
// IMAGE FILTERS (Effects)
// ========================

function handleImageFilter(e) {
    const filterType = e.target.id;
    activeFilters[filterType] = e.target.checked;

    // Apply to gallery items
    applyImageFilters();

    // Apply to lightbox image
    if (lightbox.classList.contains('active')) {
        applyLightboxFilters();
    }
}

function applyImageFilters() {
    const items = document.querySelectorAll('.gallery-item');

    items.forEach(item => {
        // Remove all filter classes
        item.classList.remove(
            'filter-grayscale',
            'filter-sepia',
            'filter-blur',
            'filter-brightness'
        );

        // Add active filter classes
        Object.keys(activeFilters).forEach(filter => {
            if (activeFilters[filter]) {
                item.classList.add(`filter-${filter}`);
            }
        });
    });
}

function applyLightboxFilters() {
    const image = lightboxImage;

    // Remove all filter classes
    image.classList.remove(
        'filter-grayscale',
        'filter-sepia',
        'filter-blur',
        'filter-brightness'
    );

    // Add active filter classes
    Object.keys(activeFilters).forEach(filter => {
        if (activeFilters[filter]) {
            image.classList.add(`filter-${filter}`);
        }
    });
}

// ========================
// LIGHTBOX FUNCTIONALITY
// ========================

function openLightbox(index) {
    currentImageIndex = index;
    const image = galleryImages[index];

    // Show loading state
    lightboxImage.classList.add('loading');

    // Set placeholder first
    lightboxImage.src = generatePlaceholder(image.category);
    imageTitle.textContent = image.title;
    imageCategory.textContent = image.category;
    updateImageCounter();

    // Show lightbox
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Load actual image with error handling
    const img = new Image();
    img.onload = () => {
        lightboxImage.src = image.src;
        lightboxImage.classList.remove('loading');
        applyLightboxFilters();
    };

    img.onerror = () => {
        console.error(`Failed to load lightbox image: ${image.src}`);
        lightboxImage.classList.remove('loading');
        // Keep placeholder
    };

    const loadTimeout = setTimeout(() => {
        lightboxImage.classList.remove('loading');
    }, 8000);

    img.src = image.src;

    // Render thumbnails
    renderThumbnails();
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showNext() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateLightboxImage();
}

function showPrevious() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxImage();
}

function updateLightboxImage() {
    const image = galleryImages[currentImageIndex];

    // Add animation
    lightboxImage.style.opacity = '0';
    lightboxImage.classList.add('loading');

    setTimeout(() => {
        // Load new image
        const img = new Image();
        img.onload = () => {
            lightboxImage.src = image.src;
            imageTitle.textContent = image.title;
            imageCategory.textContent = image.category;
            updateImageCounter();
            applyLightboxFilters();
            renderThumbnails();
            lightboxImage.classList.remove('loading');
            lightboxImage.style.opacity = '1';
        };

        img.onerror = () => {
            console.error(`Failed to load image: ${image.src}`);
            lightboxImage.src = generatePlaceholder(image.category);
            imageTitle.textContent = image.title;
            imageCategory.textContent = image.category;
            updateImageCounter();
            applyLightboxFilters();
            renderThumbnails();
            lightboxImage.classList.remove('loading');
            lightboxImage.style.opacity = '1';
        };

        const loadTimeout = setTimeout(() => {
            if (lightboxImage.classList.contains('loading')) {
                lightboxImage.classList.remove('loading');
                lightboxImage.style.opacity = '1';
            }
        }, 8000);

        img.src = image.src;
    }, 200);
}

function updateImageCounter() {
    imageCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
}

// ========================
// THUMBNAILS
// ========================

function renderThumbnails() {
    thumbnails.innerHTML = '';

    galleryImages.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail loading';
        if (index === currentImageIndex) {
            thumbnail.classList.add('active');
        }

        const img = document.createElement('img');
        img.src = generatePlaceholder(image.category);
        img.alt = image.title;

        // Load thumbnail
        const thumbImg = new Image();
        thumbImg.onload = () => {
            img.src = image.thumb;
            thumbnail.classList.remove('loading');
        };

        thumbImg.onerror = () => {
            thumbnail.classList.remove('loading');
            // Keep placeholder
        };

        const thumbTimeout = setTimeout(() => {
            if (thumbnail.classList.contains('loading')) {
                thumbnail.classList.remove('loading');
            }
        }, 5000);

        thumbImg.src = image.thumb;

        thumbnail.appendChild(img);
        thumbnail.addEventListener('click', () => {
            currentImageIndex = index;
            updateLightboxImage();
        });

        thumbnails.appendChild(thumbnail);

        // Auto-scroll to active thumbnail
        if (index === currentImageIndex) {
            thumbnail.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    });
}

// ========================
// KEYBOARD NAVIGATION
// ========================

function handleKeyboard(e) {
    if (!lightbox.classList.contains('active')) return;

    switch (e.key) {
        case 'ArrowLeft':
            showPrevious();
            break;
        case 'ArrowRight':
            showNext();
            break;
        case 'Escape':
            closeLightbox();
            break;
    }
}

// ========================
// INITIALIZATION
// ========================

document.addEventListener('DOMContentLoaded', initializeGallery);
// Intersection Observer for animations - Fixed syntax error
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

// Create intersection observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('section-title')) {
                // Animate title first
                entry.target.classList.add('animate');
                
                // Then animate images in the same section after a delay
                const section = entry.target.closest('.section');
                if (section) {
                    const artworks = section.querySelectorAll('.artwork:not(.animate)');
                    artworks.forEach((artwork, index) => {
                        setTimeout(() => {
                            artwork.classList.add('animate');
                        }, 500 + (index * 200)); // 500ms delay after title, then 200ms between images
                    });
                }
            } else if (entry.target.classList.contains('artwork')) {
                // Only animate individual artwork if it's not already animated
                if (!entry.target.classList.contains('animate')) {
                    entry.target.classList.add('animate');
                }
            }
        }
    });
}, observerOptions);

// Function to initialize observers for elements
function initializeObservers() {
    const sectionTitles = document.querySelectorAll('.section-title');
    const artworks = document.querySelectorAll('.artwork');
    
    // Observe section titles
    sectionTitles.forEach(title => {
        observer.observe(title);
    });
    
    // Observe artworks with staggered animation
    artworks.forEach((artwork, index) => {
        observer.observe(artwork);
        
        // Add delay for staggered effect
        artwork.style.transitionDelay = `${index * 0.1}s`;
    });
    
    console.log(`🔍 Initialized observers for ${sectionTitles.length} titles and ${artworks.length} artworks`);
}

// Initialize observers when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeObservers();
    
    // Smooth scroll for scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const firstSection = document.querySelector('.section');
            if (firstSection) {
                firstSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    // Add hover effects for artworks
    const artworks = document.querySelectorAll('.artwork');
    artworks.forEach(artwork => {
        artwork.addEventListener('mouseenter', () => {
            artwork.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        artwork.addEventListener('mouseleave', () => {
            if (artwork.classList.contains('animate')) {
                artwork.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
    
    // Add loading animation
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    
    if (heroTitle && heroSubtitle) {
        // Trigger animations after a short delay
        setTimeout(() => {
            heroTitle.style.animation = 'fadeInUp 1.2s ease-out';
            heroSubtitle.style.animation = 'fadeInUp 1.2s ease-out 0.3s both';
        }, 100);
    }
});

// Enhanced scroll animations with smooth scrolling synchronization
let ticking = false;
let scrollProgress = 0;

function updateScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    const windowHeight = window.innerHeight;
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.id;
        
        // Calculate scroll progress for this section
        const sectionStart = sectionTop - windowHeight * 0.5;
        const sectionEnd = sectionTop + sectionHeight * 0.5;
        const sectionProgress = Math.max(0, Math.min(1, (scrollY - sectionStart) / (sectionEnd - sectionStart)));
        
        // Check if section is in viewport
        if (scrollY > sectionStart && scrollY < sectionEnd) {
            const sectionTitle = section.querySelector('.section-title');
            const artworks = section.querySelectorAll('.artwork');
            
            // Animate section title first (appears at 20% scroll progress)
            if (sectionTitle && sectionProgress > 0.2 && !sectionTitle.classList.contains('animate')) {
                sectionTitle.classList.add('animate');
                console.log(`✅ Title animated for section ${sectionId}`);
            }
            
            // Animate artworks after title (appears at 40% scroll progress)
            if (sectionProgress > 0.4) {
                artworks.forEach((artwork, index) => {
                    if (!artwork.classList.contains('animate')) {
                        // Calculate individual artwork progress based on scroll
                        const artworkProgress = Math.max(0, Math.min(1, (sectionProgress - 0.4) / 0.6));
                        
                        // Apply smooth transform based on scroll progress
                        const isEven = index % 2 === 0;
                        const startX = isEven ? -150 : 150;
                        const currentX = startX * (1 - artworkProgress);
                        
                        artwork.style.transform = `translateX(${currentX}px)`;
                        artwork.style.opacity = artworkProgress;
                        
                        // Mark as animated when fully visible
                        if (artworkProgress >= 0.9) {
                            artwork.classList.add('animate');
                            artwork.style.transform = 'translateX(0)';
                            artwork.style.opacity = '1';
                            console.log(`✅ Artwork ${index} animated in section ${sectionId}`);
                        }
                    }
                });
            }
        }
    });
    
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateScrollAnimations);
        ticking = true;
    }
    // Also toggle back to top button
    toggleBackToTopButton();
}

// Throttled scroll event listener
window.addEventListener('scroll', requestTick, { passive: true });

// Initial check for elements already in viewport
updateScrollAnimations();

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        const currentSection = document.querySelector('.section.animate');
        if (currentSection) {
            const nextSection = currentSection.nextElementSibling;
            if (nextSection && nextSection.classList.contains('section')) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            const firstSection = document.querySelector('.section');
            if (firstSection) {
                firstSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const currentSection = document.querySelector('.section.animate');
        if (currentSection) {
            const prevSection = currentSection.previousElementSibling;
            if (prevSection && prevSection.classList.contains('section')) {
                prevSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
});

// Add touch/swipe support for mobile
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe up - go to next section
            const currentSection = document.querySelector('.section.animate');
            if (currentSection) {
                const nextSection = currentSection.nextElementSibling;
                if (nextSection && nextSection.classList.contains('section')) {
                    nextSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        } else {
            // Swipe down - go to previous section
            const currentSection = document.querySelector('.section.animate');
            if (currentSection) {
                const prevSection = currentSection.previousElementSibling;
                if (prevSection && prevSection.classList.contains('section')) {
                    prevSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    }
}

// Image loading system
const imageFolders = {
    portraits: 'images/portraits/',
    landscapes: 'images/landscapes/',
    characters: 'images/characters/',
    tattoos: 'images/tattoos/',
    animals: 'images/animals/'
};

// Supported image formats
const supportedFormats = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

// Global storage for discovered images
window.discoveredImages = {
    'portraits-gallery': [],
    'landscapes-gallery': [],
    'characters-gallery': [],
    'tattoos-gallery': [],
    'animals-gallery': []
};

// Function to discover all images in a folder using smart scanning
async function discoverImagesInFolder(folderPath, galleryId) {
    const discoveredImages = [];
    
    try {
        // Known existing images for each category - these will be loaded first
        const knownExistingImages = {
            'portraits-gallery': [
                'photo_2025-10-15_15-37-03.jpg'
            ],
            'landscapes-gallery': [
                'photo_2025-10-15_23-59-26.jpg'
            ],
            'characters-gallery': [
                'X-zxPb0Srqo.jpg'
            ],
            'tattoos-gallery': [
                '3DLO1yqt9mU.jpg',
                'гоша дракоша.jpg'
            ],
            'animals-gallery': [
                'photo_2025-10-15_23-59-31.jpg'
            ]
        };
        
        // For production (Netlify), just return the known images
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            const knownImages = knownExistingImages[galleryId] || [];
            console.log(`🌐 Production mode: Loading ${knownImages.length} known images for ${galleryId}`);
            return knownImages;
        }
        
        // For development, also just use known images to simplify
        const knownImages = knownExistingImages[galleryId] || [];
        console.log(`🔧 Development mode: Loading ${knownImages.length} known images for ${galleryId}`);
        return knownImages;
    } catch (error) {
        console.error(`Error discovering images in ${galleryId}:`, error);
        return [];
    }
}

// Function to check if an image exists
function checkImageExists(imagePath) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => {
            console.log(`Image not found: ${imagePath}`);
            resolve(false);
        };
        img.src = imagePath;
        // Add timeout to prevent hanging
        setTimeout(() => resolve(false), 5000);
    });
}

// Function to store images in localStorage
function storeImages(galleryId, images) {
    try {
        localStorage.setItem(`portfolio_images_${galleryId}`, JSON.stringify(images));
    } catch (e) {
        console.log('Could not store images in localStorage:', e);
    }
}

// Function to get stored images from localStorage
function getStoredImages(galleryId) {
    try {
        const stored = localStorage.getItem(`portfolio_images_${galleryId}`);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.log('Could not retrieve images from localStorage:', e);
        return [];
    }
}

// Function to load images from a specific folder
async function loadImagesFromFolder(folderPath, galleryId) {
    try {
        const gallery = document.getElementById(galleryId);
        if (!gallery) {
            console.warn(`Gallery element not found: ${galleryId}`);
            return;
        }
        
        // Clear existing content
        gallery.innerHTML = '';
        
        const loadedImages = [];
        
        // Get known images for this gallery
        const discoveredImages = await discoverImagesInFolder(folderPath, galleryId);
        
        console.log(`🔍 Loading ${discoveredImages.length} images for ${galleryId}:`, discoveredImages);
        
        // Load images directly (simplified approach)
        for (const imageName of discoveredImages) {
            const imagePath = `${folderPath}${imageName}`;
            
            loadedImages.push({
                src: imagePath,
                alt: imageName.replace(/\.[^/.]+$/, "") // Remove extension for alt text
            });
            console.log(`✅ Added ${imagePath}`);
        }
        
        // Create artwork elements for loaded images
        loadedImages.forEach((imageData, index) => {
            const artwork = document.createElement('div');
            artwork.className = 'artwork';
            artwork.setAttribute('data-category', galleryId.replace('-gallery', ''));
            artwork.setAttribute('data-src', imageData.src);
            
            // Set initial state for animation using CSS classes
            const isEven = index % 2 === 0;
            if (isEven) {
                artwork.classList.add('artwork-left');
            } else {
                artwork.classList.add('artwork-right');
            }
            
            const img = document.createElement('img');
            img.src = imageData.src;
            img.alt = imageData.alt;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.objectPosition = 'center';
            img.style.borderRadius = '12px';
            img.style.backgroundColor = '#1a1a1a';
            
            // Add error handling for image loading
            img.onerror = function() {
                console.error(`❌ Failed to load image: ${imageData.src}`);
                this.style.display = 'none';
                artwork.innerHTML = '<div class="artwork-placeholder">Изображение не загружено</div>';
            };
            
            img.onload = function() {
                console.log(`✅ Successfully loaded image: ${imageData.src}`);
            };
            
            artwork.appendChild(img);
            gallery.appendChild(artwork);
        });
        
        // If no images were loaded, show placeholder
        if (loadedImages.length === 0) {
            const placeholder = document.createElement('div');
            placeholder.className = 'artwork';
            placeholder.innerHTML = `
                <div class="artwork-placeholder">
                    <span>Добавьте изображения в папку ${folderPath}</span>
                </div>
            `;
            gallery.appendChild(placeholder);
            console.log(`📁 No images found in ${folderPath}`);
        } else {
            console.log(`✅ Loaded ${loadedImages.length} images in ${galleryId}`);
        }
        
        // Reinitialize observers after images are loaded
        setTimeout(() => {
            initializeObservers();
            
            // Let Intersection Observer handle all animations (both dev and production)
            console.log(`🎬 Images ready for scroll animation`);
        }, 100);
        
    } catch (error) {
        console.log(`Ошибка загрузки изображений из ${folderPath}:`, error);
    }
}

// Function to load all images
async function loadAllImages() {
    console.log('🔄 Loading all images...');
    await loadImagesFromFolder(imageFolders.portraits, 'portraits-gallery');
    await loadImagesFromFolder(imageFolders.landscapes, 'landscapes-gallery');
    await loadImagesFromFolder(imageFolders.characters, 'characters-gallery');
    await loadImagesFromFolder(imageFolders.tattoos, 'tattoos-gallery');
    await loadImagesFromFolder(imageFolders.animals, 'animals-gallery');
    console.log('✅ All images loaded!');
}

// Function to force load known images immediately
function forceLoadKnownImages() {
    console.log('🚀 Force loading known images...');
    
    // Clear all galleries first
    const galleries = ['portraits-gallery', 'landscapes-gallery', 'characters-gallery', 'tattoos-gallery', 'animals-gallery'];
    galleries.forEach(galleryId => {
        const gallery = document.getElementById(galleryId);
        if (gallery) {
            gallery.innerHTML = '';
        }
    });
    
    // Load images immediately
    loadAllImages();
}

// Function to add new image to the system
function addImageToSystem(imageName, category) {
    const galleryId = `${category}-gallery`;
    const folderPath = imageFolders[category];
    
    if (!folderPath) return;
    
    // Add to known images list
    if (!window.knownImages) {
        window.knownImages = {
            'portraits-gallery': [],
            'landscapes-gallery': [],
            'characters-gallery': [],
            'tattoos-gallery': [],
            'animals-gallery': []
        };
    }
    
    if (!window.knownImages[galleryId].includes(imageName)) {
        window.knownImages[galleryId].push(imageName);
    }
    
    // Also add to discovered images
    if (!window.discoveredImages[galleryId].includes(imageName)) {
        window.discoveredImages[galleryId].push(imageName);
        storeImages(galleryId, window.discoveredImages[galleryId]);
    }
    
    // Reload images for this category
    loadImagesFromFolder(folderPath, galleryId);
    
    // Apply animations to new images
    setTimeout(() => {
        applyAnimationsToNewImages();
    }, 100);
}

// Function to manually add an image by name
function addImageByName(imageName, category) {
    console.log(`📸 Adding image: ${imageName} to category: ${category}`);
    addImageToSystem(imageName, category);
}

// Function to refresh all galleries
async function refreshAllGalleries() {
    console.log('🔄 Refreshing all galleries...');
    
    // Clear all galleries and reset discovered images
    const galleries = ['portraits-gallery', 'landscapes-gallery', 'characters-gallery', 'tattoos-gallery', 'animals-gallery'];
    galleries.forEach(galleryId => {
        const gallery = document.getElementById(galleryId);
        if (gallery) {
            gallery.innerHTML = '';
        }
        // Reset discovered images to force rediscovery
        window.discoveredImages[galleryId] = [];
    });
    
    // Reset animations
    const sectionTitles = document.querySelectorAll('.section-title');
    const artworks = document.querySelectorAll('.artwork');
    
    sectionTitles.forEach(title => {
        title.classList.remove('animate');
    });
    
    artworks.forEach(artwork => {
        artwork.classList.remove('animate');
    });
    
    // Reload all images
    await loadAllImages();
    
    // Reapply animations
    setTimeout(() => {
        updateScrollAnimations();
        initializeObservers();
    }, 100);
    
    console.log('✅ All galleries refreshed!');
}

// Global monitoring state
window.monitoringEnabled = true;
window.monitoringInterval = null;

// Function to check for new images periodically
function startImageMonitoring() {
    if (window.monitoringInterval) {
        clearInterval(window.monitoringInterval);
    }
    
    if (!window.monitoringEnabled) return;
    
    // Check for new images every 10 seconds (more frequent)
    window.monitoringInterval = setInterval(async () => {
        console.log('🔍 Checking for new images...');
        
        for (const [category, folderPath] of Object.entries(imageFolders)) {
            const galleryId = `${category}-gallery`;
            const currentImages = window.discoveredImages[galleryId] || [];
            const newDiscoveredImages = await discoverImagesInFolder(folderPath, galleryId);
            
            // Check if there are new images
            const hasNewImages = newDiscoveredImages.some(img => !currentImages.includes(img));
            
            if (hasNewImages) {
                console.log(`🆕 New images found in ${category}! Reloading...`);
                console.log(`New images:`, newDiscoveredImages.filter(img => !currentImages.includes(img)));
                await loadImagesFromFolder(folderPath, galleryId);
                setTimeout(() => {
                    applyAnimationsToNewImages();
                }, 100);
            }
        }
    }, 10000); // Check every 10 seconds
}

// Function to toggle image monitoring
function toggleImageMonitoring() {
    window.monitoringEnabled = !window.monitoringEnabled;
    const statusElement = document.getElementById('monitoring-status');
    
    if (statusElement) {
        if (window.monitoringEnabled) {
            startImageMonitoring();
            statusElement.textContent = 'Мониторинг: ВКЛ';
            console.log('✅ Image monitoring enabled');
        } else {
            if (window.monitoringInterval) {
                clearInterval(window.monitoringInterval);
                window.monitoringInterval = null;
            }
            statusElement.textContent = 'Мониторинг: ВЫКЛ';
            console.log('❌ Image monitoring disabled');
        }
    } else {
        console.warn('Monitoring status element not found');
    }
}

// Function to show/hide admin section
function toggleAdminSection() {
    const adminSection = document.getElementById('admin-section');
    if (adminSection) {
        if (adminSection.style.display === 'none') {
            adminSection.style.display = 'block';
            console.log('🔧 Admin section shown');
        } else {
            adminSection.style.display = 'none';
            console.log('🔧 Admin section hidden');
        }
    } else {
        console.warn('Admin section element not found');
    }
}

// Function to add drag and drop support for images
function addDragAndDropSupport() {
    const galleries = document.querySelectorAll('.gallery');
    
    galleries.forEach(gallery => {
        gallery.addEventListener('dragover', (e) => {
            e.preventDefault();
            gallery.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });
        
        gallery.addEventListener('dragleave', (e) => {
            e.preventDefault();
            gallery.style.backgroundColor = 'transparent';
        });
        
        gallery.addEventListener('drop', (e) => {
            e.preventDefault();
            gallery.style.backgroundColor = 'transparent';
            
            const files = Array.from(e.dataTransfer.files);
            const imageFiles = files.filter(file => 
                file.type.startsWith('image/') && 
                supportedFormats.some(format => file.name.toLowerCase().endsWith(format))
            );
            
            if (imageFiles.length > 0) {
                console.log(`📁 ${imageFiles.length} image(s) dropped!`);
                
                // Get the category from the gallery ID
                const galleryId = gallery.id;
                const category = galleryId.replace('-gallery', '');
                
                // Show helpful message
                const message = `Обнаружено ${imageFiles.length} изображение(й). 
                
Для автоматического отображения:
1. Скопируйте файлы в папку: images/${category}/
2. Или нажмите "Обновить все галереи" в админ-панели

Файлы: ${imageFiles.map(f => f.name).join(', ')}`;
                
                alert(message);
                
                // Trigger immediate refresh
                setTimeout(() => {
                    refreshAllGalleries();
                }, 1000);
            }
        });
    });
}

// Function to add file input support for instant uploads
function addFileInputSupport() {
    // Create hidden file inputs for each gallery
    const galleries = document.querySelectorAll('.gallery');
    
    galleries.forEach(gallery => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true;
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        
        fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            if (files.length > 0) {
                const galleryId = gallery.id;
                const category = galleryId.replace('-gallery', '');
                
                console.log(`📁 ${files.length} file(s) selected for ${category}`);
                
                const message = `Выбрано ${files.length} изображение(й). 
                
Для отображения на сайте:
1. Скопируйте файлы в папку: images/${category}/
2. Или нажмите "Обновить все галереи" в админ-панели

Файлы: ${files.map(f => f.name).join(', ')}`;
                
                alert(message);
                
                // Trigger immediate refresh
                setTimeout(() => {
                    refreshAllGalleries();
                }, 1000);
            }
        });
        
        // Add click handler to gallery for file selection
        gallery.addEventListener('click', (e) => {
            if (e.ctrlKey || e.metaKey) { // Ctrl+Click or Cmd+Click
                e.preventDefault();
                fileInput.click();
            }
        });
        
        document.body.appendChild(fileInput);
    });
}

// Function to automatically discover all images in folders
async function discoverAllImages() {
    // Only your specific files that actually exist
    const allPossibleNames = [
        'photo_2025-10-12_18-52-53.jpg',
        'X-zxPb0Srqo.jpg',
        '3DLO1yqt9mU.jpg',
        'гоша дракоша.jpg'
    ];
    
    return allPossibleNames;
}

// Enhanced image loading with discovery
async function loadAllImagesWithDiscovery() {
    // Load images directly without trying all possible combinations
    await loadAllImages();
}

// Quick function to add your specific images
function addYourImages() {
    console.log('Adding your specific images...');
    
    // Initialize known images if not exists
    if (!window.knownImages) {
        window.knownImages = {
            'portraits-gallery': [],
            'landscapes-gallery': [],
            'characters-gallery': [],
            'tattoos-gallery': [],
            'animals-gallery': []
        };
    }
    
    // Add your specific images to the system
    addImageToSystem('photo_2025-10-12_18-52-53.jpg', 'portraits');
    addImageToSystem('X-zxPb0Srqo.jpg', 'characters');
    addImageToSystem('3DLO1yqt9mU.jpg', 'tattoos');
    addImageToSystem('гоша дракоша.jpg', 'tattoos');
    
    console.log('✅ Your images have been added!');
}

// Function to add a single image
function addSingleImage(filename, category) {
    console.log(`Adding ${filename} to ${category}...`);
    
    if (!window.knownImages) {
        window.knownImages = {
            'portraits-gallery': [],
            'landscapes-gallery': [],
            'characters-gallery': [],
            'tattoos-gallery': [],
            'animals-gallery': []
        };
    }
    
    addImageToSystem(filename, category);
    console.log(`✅ ${filename} added to ${category}!`);
}

// Function to force reload all images
function forceReloadImages() {
    console.log('🔄 Force reloading all images...');
    
    // Clear all galleries and reset animations
    const galleries = ['portraits-gallery', 'landscapes-gallery', 'characters-gallery', 'tattoos-gallery'];
    galleries.forEach(galleryId => {
        const gallery = document.getElementById(galleryId);
        if (gallery) {
            gallery.innerHTML = '';
        }
    });
    
    // Reset all section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        title.classList.remove('animate');
    });
    
    // Reload all images
    loadAllImages();
    
    // Reinitialize scroll animations
    setTimeout(() => {
        updateScrollAnimations();
    }, 100);
    
    console.log('✅ Force reload completed!');
}

// Manual scroll to top function (only when user clicks button)
function scrollToTop() {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
}

// Initialize image loading
loadAllImagesWithDiscovery();

// Start monitoring for new images (only in development)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    startImageMonitoring();
} else {
    console.log('🌐 Production mode: Image monitoring disabled');
}

// Add drag and drop support
addDragAndDropSupport();

// Add file input support
addFileInputSupport();

// Initialize page without forcing scroll to top
window.addEventListener('load', () => {
    toggleBackToTopButton();
});

// Initialize when DOM is ready without forcing scroll
document.addEventListener('DOMContentLoaded', () => {
    toggleBackToTopButton();
});

// Function to apply animations to new images
function applyAnimationsToNewImages() {
    const artworks = document.querySelectorAll('.artwork:not(.animate)');
    artworks.forEach((artwork, index) => {
        const isEven = index % 2 === 0;
        const startX = isEven ? -150 : 150;
        artwork.style.transform = `translateX(${startX}px)`;
        artwork.style.opacity = '0';
        
        // Add transition delay for staggered effect
        artwork.style.transitionDelay = `${index * 0.1}s`;
        
        // Observe the artwork for animation
        observer.observe(artwork);
    });
    console.log(`✅ Applied animations to ${artworks.length} new images`);
}

// Function to manually scroll to top
function goToTop() {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
    console.log('⬆️ Scrolled to top');
}

// Show/hide back to top button based on scroll position
function toggleBackToTopButton() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
}

// Function for instant refresh when files are added
function instantRefresh() {
    console.log('⚡ Instant refresh triggered!');
    refreshAllGalleries();
}

// Function to add a new image instantly
function addNewImage(imageName, category) {
    console.log(`📸 Adding new image: ${imageName} to ${category}`);
    
    // Add to discovered images immediately
    const galleryId = `${category}-gallery`;
    if (!window.discoveredImages[galleryId].includes(imageName)) {
        window.discoveredImages[galleryId].push(imageName);
        storeImages(galleryId, window.discoveredImages[galleryId]);
    }
    
    // Reload the specific gallery
    const folderPath = imageFolders[category];
    loadImagesFromFolder(folderPath, galleryId);
    
    // Apply animations
    setTimeout(() => {
        applyAnimationsToNewImages();
    }, 100);
}

// Make functions available globally for easy use
window.addImageToSystem = addImageToSystem;
window.addImageByName = addImageByName;
window.addNewImage = addNewImage;
window.addYourImages = addYourImages;
window.addSingleImage = addSingleImage;
window.forceReloadImages = forceReloadImages;
window.forceLoadKnownImages = forceLoadKnownImages;
window.refreshAllGalleries = refreshAllGalleries;
window.instantRefresh = instantRefresh;
window.applyAnimationsToNewImages = applyAnimationsToNewImages;
window.goToTop = goToTop;
window.discoverImagesInFolder = discoverImagesInFolder;
window.startImageMonitoring = startImageMonitoring;
window.toggleImageMonitoring = toggleImageMonitoring;
window.toggleAdminSection = toggleAdminSection;

// Add performance optimization
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // Run non-critical initialization here
        console.log('Portfolio loaded successfully');
    });
}

// Add error handling to prevent page crashes
window.addEventListener('error', (event) => {
    console.error('JavaScript error caught:', event.error);
    // Prevent the error from causing page reload
    event.preventDefault();
    return false;
});

// Add unhandled promise rejection handling
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // Prevent the rejection from causing page reload
    event.preventDefault();
});

// Add beforeunload handler to prevent accidental page reloads
window.addEventListener('beforeunload', (event) => {
    // Only show confirmation if there are unsaved changes
    // For now, we'll just prevent the default behavior
    event.preventDefault();
    return undefined;
});

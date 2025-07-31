class ImageGallery {
            constructor() {
                this.images = [];
                this.currentImageIndex = 0;
                this.currentFilter = 'all';
                this.init();
            }

            init() {
                this.collectImages();
                this.setupEventListeners();
            }

            collectImages() {
                const galleryItems = document.querySelectorAll('.gallery-item');
                this.images = Array.from(galleryItems).map((item, index) => ({
                    element: item,
                    img: item.querySelector('img'),
                    title: item.querySelector('.overlay-title').textContent,
                    category: item.querySelector('.overlay-category').textContent,
                    dataCategory: item.dataset.category,
                    index: index
                }));
            }

            setupEventListeners() {
                // Filter buttons
                const filterBtns = document.querySelectorAll('.filter-btn');
                filterBtns.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const filter = e.target.dataset.filter;
                        this.filterImages(filter);
                        this.updateActiveFilter(e.target);
                    });
                });

                // Gallery item clicks
                this.images.forEach((image, index) => {
                    image.element.addEventListener('click', () => {
                        this.openLightbox(index);
                    });
                });

                // Lightbox controls
                const lightbox = document.getElementById('lightbox');
                const lightboxClose = document.getElementById('lightboxClose');
                const lightboxPrev = document.getElementById('lightboxPrev');
                const lightboxNext = document.getElementById('lightboxNext');

                lightboxClose.addEventListener('click', () => this.closeLightbox());
                lightboxPrev.addEventListener('click', () => this.prevImage());
                lightboxNext.addEventListener('click', () => this.nextImage());

                // Close lightbox on background click
                lightbox.addEventListener('click', (e) => {
                    if (e.target === lightbox) {
                        this.closeLightbox();
                    }
                });

                // Keyboard navigation
                document.addEventListener('keydown', (e) => {
                    if (lightbox.classList.contains('active')) {
                        switch(e.key) {
                            case 'Escape':
                                this.closeLightbox();
                                break;
                            case 'ArrowLeft':
                                this.prevImage();
                                break;
                            case 'ArrowRight':
                                this.nextImage();
                                break;
                        }
                    }
                });
            }

            filterImages(filter) {
                this.currentFilter = filter;
                this.images.forEach(image => {
                    if (filter === 'all' || image.dataCategory === filter) {
                        image.element.classList.remove('hidden');
                    } else {
                        image.element.classList.add('hidden');
                    }
                });
            }

            updateActiveFilter(activeBtn) {
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                activeBtn.classList.add('active');
            }

            getVisibleImages() {
                return this.images.filter(image => !image.element.classList.contains('hidden'));
            }

            openLightbox(imageIndex) {
                const visibleImages = this.getVisibleImages();
                const actualImage = this.images[imageIndex];
                const visibleIndex = visibleImages.findIndex(img => img.index === imageIndex);
                
                if (visibleIndex === -1) return;
                
                this.currentImageIndex = visibleIndex;
                this.updateLightboxContent(actualImage);
                
                const lightbox = document.getElementById('lightbox');
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            closeLightbox() {
                const lightbox = document.getElementById('lightbox');
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
            }

            prevImage() {
                const visibleImages = this.getVisibleImages();
                this.currentImageIndex = (this.currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
                this.updateLightboxContent(visibleImages[this.currentImageIndex]);
            }

            nextImage() {
                const visibleImages = this.getVisibleImages();
                this.currentImageIndex = (this.currentImageIndex + 1) % visibleImages.length;
                this.updateLightboxContent(visibleImages[this.currentImageIndex]);
            }

            updateLightboxContent(image) {
                const lightboxImage = document.getElementById('lightboxImage');
                const lightboxTitle = document.getElementById('lightboxTitle');
                const lightboxCategory = document.getElementById('lightboxCategory');

                lightboxImage.src = image.img.src;
                lightboxImage.alt = image.img.alt;
                lightboxTitle.textContent = image.title;
                lightboxCategory.textContent = image.category;
            }
        }

        // Initialize the gallery when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            new ImageGallery();
        });

        // Add smooth scroll animation for better UX
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                setTimeout(() => {
                    const gallery = document.querySelector('.gallery');
                    gallery.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        gallery.style.transform = 'scale(1)';
                    }, 150);
                }, 50);
            });
        });
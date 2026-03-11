// ========== SHARED FUNCTIONALITY ==========
// Navbar scroll effect
function initNavbarScroll() {
    window.addEventListener('scroll', function () {
        const navbar = document.getElementById('navbar');
        if (navbar && window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else if (navbar) {
            navbar.classList.remove('scrolled');
        }
    });
}

// Reveal animations
function initRevealAnimations() {
    function revealOnScroll() {
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight - 100) {
                element.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll);
    window.addEventListener('load', revealOnScroll);
}

// Mobile menu toggle
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function () {
            navLinks.classList.toggle('show');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function () {
                navLinks.classList.remove('show');
            });
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 992) {
                navLinks.classList.remove('show');
            }
        });
    }
}

// WhatsApp button animation
function initWhatsAppAnimation() {
    const whatsappBtn = document.querySelector('.whatsapp-float');
    if (whatsappBtn) {
        setInterval(() => {
            whatsappBtn.classList.add('whatsapp-pulse');
            setTimeout(() => whatsappBtn.classList.remove('whatsapp-pulse'), 2000);
        }, 10000);
    }
}

// Sync nav cart badges with saved cart
function initNavCartCount() {
    const badges = document.querySelectorAll('.nav-cart-count, .home-makai-nav-cart-count');
    if (!badges.length) return;

    let cart = [];
    try {
        const parsed = JSON.parse(localStorage.getItem('edgeSkateCart') || '[]');
        cart = Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        cart = [];
    }

    const count = cart.reduce((total, item) => total + Number(item.quantity || 0), 0);
    badges.forEach(badge => {
        badge.textContent = String(count);
    });
}

// Counter animation for stat numbers
function initStatCounters() {
    const counters = document.querySelectorAll('.count-up');
    if (!counters.length) return;

    const animateCounter = (element) => {
        const target = Number(element.dataset.target || 0);
        const suffix = element.dataset.suffix || '';
        const duration = 1200;
        const start = performance.now();

        function step(timestamp) {
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.floor(target * eased);
            element.textContent = `${value}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                element.textContent = `${target}${suffix}`;
            }
        }

        requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.45 });

    counters.forEach(counter => observer.observe(counter));
}

// FAQ accordion
function initFaqAccordion() {
    const toggles = document.querySelectorAll('.faq-toggle');
    if (!toggles.length) return;

    toggles.forEach(toggle => {
        toggle.addEventListener('click', function () {
            const currentItem = this.closest('.faq-item');
            const wasOpen = currentItem.classList.contains('open');

            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('open');
                const button = item.querySelector('.faq-toggle');
                if (button) button.setAttribute('aria-expanded', 'false');
            });

            if (!wasOpen) {
                currentItem.classList.add('open');
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

// Back-to-top button
function initBackToTopButton() {
    if (document.querySelector('.back-to-top')) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'back-to-top';
    button.setAttribute('aria-label', 'Back to top');
    button.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(button);

    window.addEventListener('scroll', function () {
        button.classList.toggle('show', window.scrollY > 420);
    });

    button.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========== HERO SLIDER (INDEX.HTML) ==========
function initHeroSlider() {
    const splitSlider = document.querySelector('.home-split-slider');
    if (splitSlider) {
        let currentSlide = 0;
        const slides = splitSlider.querySelectorAll('.home-split-slide');
        const dots = document.querySelectorAll('.home-split-dot');
        const prevBtn = document.querySelector('.home-split-prev');
        const nextBtn = document.querySelector('.home-split-next');
        let autoSlideTimer = null;

        if (!slides.length || !dots.length) return;

        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));

            slides[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }

        function restartAutoSlide() {
            if (autoSlideTimer) clearInterval(autoSlideTimer);
            autoSlideTimer = setInterval(nextSlide, 5000);
        }

        restartAutoSlide();

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                restartAutoSlide();
            });
        });

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                restartAutoSlide();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                restartAutoSlide();
            });
        }

        return;
    }

    if (!document.querySelector('.hero-slider')) return;

    let currentSlide = 0;
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Auto slide
    setInterval(nextSlide, 5000);

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });
}

// ========== SHOP FUNCTIONALITY (SHOP.HTML) ==========
function initShop() {
    if (!document.getElementById('productsGrid')) return;

    // Shop products data
    const products = [
        { id: 1, name: "Professional Roller Skates", price: 299, category: "boots", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format", description: "High-performance skates with precision bearings and durable boots." },
        { id: 2, name: "Speed Wheels Set", price: 89, category: "wheels", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&auto=format", description: "Premium aluminum wheels for maximum speed and control." },
        { id: 3, name: "Protective Helmet", price: 79, category: "helmets", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&auto=format", description: "Lightweight helmet with advanced ventilation and safety features." },
        { id: 4, name: "Knee Pads", price: 45, category: "protective", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&auto=format", description: "Comfortable knee protection with adjustable straps." },
        { id: 5, name: "Elbow Guards", price: 35, category: "protective", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&auto=format", description: "Flexible elbow pads for complete upper body protection." },
        { id: 6, name: "Wrist Guards", price: 29, category: "protective", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&auto=format", description: "Essential wrist protection for safe skating." },
        { id: 7, name: "Skate Bag", price: 65, category: "accessories", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&auto=format", description: "Durable skate bag with multiple compartments." },
        { id: 8, name: "Bearing Maintenance Kit", price: 25, category: "accessories", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&auto=format", description: "Complete kit for cleaning and lubricating bearings." }
    ];

    let cart = [];

    // Display products
    function displayProducts(filter) {
        const productsGrid = document.getElementById('productsGrid');
        productsGrid.innerHTML = '';

        const filteredProducts = filter === 'all' ? products : products.filter(p => p.category === filter);

        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-icon" style="background-image: url('${product.image}'); background-size: cover; background-position: center;"></div>
                <h4>${product.name}</h4>
                <div class="price">$${product.price}</div>
                <div class="rating">★★★★★</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            `;
            productsGrid.appendChild(productCard);
        });
    }

    // Add to cart
    window.addToCart = function (productId) {
        const product = products.find(p => p.id === productId);
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        updateCartDisplay();
        showNotification(`${product.name} added to cart!`);
    }

    // Update cart display
    function updateCartDisplay() {
        const cartItemsContainer = document.getElementById('cartItemsContainer');
        const cartTotal = document.getElementById('cartTotal');

        if (!cartItemsContainer || !cartTotal) return;

        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Your cart is empty</p>';
            cartTotal.textContent = 'Total: $0.00';
            return;
        }

        let total = 0;

        cart.forEach(item => {
            total += item.price * item.quantity;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span>$${item.price} each</span>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span style="margin: 0 0.5rem; font-weight: 600;">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    }

    // Update quantity
    window.updateQuantity = function (productId, newQuantity) {
        if (newQuantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        } else {
            const item = cart.find(item => item.id === productId);
            if (item) item.quantity = newQuantity;
        }
        updateCartDisplay();
    }

    // Checkout via WhatsApp
    const checkoutBtn = document.getElementById('checkoutWA');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function () {
            if (cart.length === 0) {
                showNotification('Your cart is empty!');
                return;
            }

            let message = 'Hi Edge Skating Club! I would like to order:\n\n';
            let total = 0;

            cart.forEach(item => {
                message += `${item.name} x${item.quantity} - $${item.price * item.quantity}\n`;
                total += item.price * item.quantity;
            });

            message += `\nTotal: $${total.toFixed(2)}\n\nPlease confirm my order!`;

            const whatsappUrl = `https://wa.me/256123456789?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    }

    // Filter buttons
    const filterContainer = document.getElementById('filterContainer');
    if (filterContainer) {
        filterContainer.addEventListener('click', function (e) {
            if (e.target.classList.contains('filter-btn')) {
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                displayProducts(e.target.dataset.filter);
            }
        });
    }

    // Initialize shop
    displayProducts('all');
    updateCartDisplay();
}

// ========== BLOGS SLIDER (BLOGS.HTML) ==========
function initBlogs() {
    if (!document.getElementById('blogsContainer')) return;

    // Blog posts data
    const blogPosts = [
        {
            id: 1,
            title: "Mastering the Perfect Cross-Training Technique",
            excerpt: "Learn the fundamental cross-training moves that every competitive skater needs to master. From basic steps to advanced combinations.",
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format",
            date: "March 15, 2025",
            author: "Coach Anna",
            category: "Technique",
            readTime: "5 min read"
        },
        {
            id: 2,
            title: "Essential Stretches for Skaters: Prevent Injuries",
            excerpt: "Discover the most important stretching routines that will keep you skating longer and stronger. Prevent common skating injuries.",
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&auto=format",
            date: "March 12, 2025",
            author: "Coach David",
            category: "Fitness",
            readTime: "4 min read"
        },
        {
            id: 3,
            title: "Choosing the Right Skate Boots for Your Level",
            excerpt: "A comprehensive guide to selecting the perfect skate boots. From beginner models to professional competition skates.",
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format",
            date: "March 10, 2025",
            author: "Mark W.",
            category: "Equipment",
            readTime: "6 min read"
        },
        {
            id: 4,
            title: "Speed Training: Building Explosive Power",
            excerpt: "Advanced training techniques to increase your skating speed and agility. Science-backed methods used by professional athletes.",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&auto=format",
            date: "March 8, 2025",
            author: "Coach Sarah",
            category: "Training",
            readTime: "7 min read"
        },
        {
            id: 5,
            title: "Mental Preparation for Competition Day",
            excerpt: "Psychological strategies to stay focused and perform at your best during skating competitions. Mind over matter techniques.",
            image: "https://images.unsplash.com/photo-1524593689594-aae2f26b75ab?w=400&auto=format",
            date: "March 5, 2025",
            author: "Coach Anna",
            category: "Mental",
            readTime: "5 min read"
        },
        {
            id: 6,
            title: "Nutrition Guide for Peak Performance",
            excerpt: "Fuel your body right for optimal skating performance. Learn what to eat before, during, and after training sessions.",
            image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&auto=format",
            date: "March 3, 2025",
            author: "Coach David",
            category: "Nutrition",
            readTime: "6 min read"
        }
    ];

    let currentBlogSlide = 0;
    const blogsPerSlide = 3;

    // Display blog posts
    function displayBlogs() {
        const blogsContainer = document.getElementById('blogsContainer');
        blogsContainer.innerHTML = '';

        const startIndex = currentBlogSlide * blogsPerSlide;
        const endIndex = startIndex + blogsPerSlide;
        const visibleBlogs = blogPosts.slice(startIndex, endIndex);

        visibleBlogs.forEach(post => {
            const blogCard = document.createElement('div');
            blogCard.className = 'blog-card';
            blogCard.innerHTML = `
                <img src="${post.image}" alt="${post.title}" class="blog-image">
                <div class="blog-info">
                    <h3 class="blog-title">${post.title}</h3>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    <div class="blog-date">${post.date}</div>
                </div>
            `;
            blogsContainer.appendChild(blogCard);
        });
    }

    // Update blog dots
    function updateBlogDots() {
        const blogDots = document.getElementById('blogDots');
        if (!blogDots) return;

        const totalSlides = Math.ceil(blogPosts.length / blogsPerSlide);

        blogDots.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = `blog-dot ${i === currentBlogSlide ? 'active' : ''}`;
            dot.addEventListener('click', () => goToBlogSlide(i));
            blogDots.appendChild(dot);
        }
    }

    // Navigate blog slides
    function goToBlogSlide(slideIndex) {
        const totalSlides = Math.ceil(blogPosts.length / blogsPerSlide);
        currentBlogSlide = Math.max(0, Math.min(slideIndex, totalSlides - 1));
        displayBlogs();
        updateBlogDots();
    }

    // Blog navigation
    const blogPrev = document.getElementById('blogPrev');
    const blogNext = document.getElementById('blogNext');

    if (blogPrev) {
        blogPrev.addEventListener('click', () => {
            goToBlogSlide(currentBlogSlide - 1);
        });
    }

    if (blogNext) {
        blogNext.addEventListener('click', () => {
            goToBlogSlide(currentBlogSlide + 1);
        });
    }

    // Initialize blogs
    displayBlogs();
    updateBlogDots();
}

// ========== FORM VALIDATION (CONTACT.HTML) ==========
function initFormValidation() {
    const membershipForm = document.getElementById('membershipForm');
    if (!membershipForm) return;

    membershipForm.addEventListener('submit', function (e) {
        e.preventDefault();
        let valid = true;
        document.querySelectorAll('.error-message').forEach(el => el.innerText = '');

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const age = document.getElementById('age').value.trim();

        if (!name) {
            document.getElementById('nameError').innerText = 'Name is required';
            valid = false;
        }

        if (!email.includes('@')) {
            document.getElementById('emailError').innerText = 'Valid email is required';
            valid = false;
        }

        if (!age || age < 1 || age > 100) {
            document.getElementById('ageError').innerText = 'Please enter a valid age';
            valid = false;
        }

        if (valid) {
            alert('Thank you for your application! We will contact you soon.');
            this.reset();
        }
    });
}

// ========== NOTIFICATION SYSTEM ==========
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--accent-blue);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-hover);
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;
    notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========== INITIALIZE ALL FUNCTIONALITY ==========
document.addEventListener('DOMContentLoaded', function () {
    // Shared functionality
    initNavbarScroll();
    initRevealAnimations();
    initMobileMenu();
    initWhatsAppAnimation();
    initNavCartCount();
    initStatCounters();
    initFaqAccordion();
    initBackToTopButton();

    // Page-specific functionality
    initHeroSlider();
    initShop();
    initBlogs();
    initFormValidation();
});

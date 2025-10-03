// TechBlog JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile navbar if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    navbarToggler.click();
                }
            }
        });
    });
    
    // Active navigation link highlighting
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        
        let current = '';
        const scrollPosition = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition <= sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }
    
    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Enhanced Read More functionality
    const readMoreBtns = document.querySelectorAll('.read-more-btn');
    
    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-bs-target');
            const content = document.querySelector(targetId);
            const isExpanded = content.classList.contains('show');
            
            // Update button text and icon
            setTimeout(() => {
                if (isExpanded) {
                    this.innerHTML = 'Read More <i class="fas fa-arrow-right ms-1"></i>';
                } else {
                    this.innerHTML = 'Read Less <i class="fas fa-arrow-up ms-1"></i>';
                }
            }, 150);
        });
    });
    
    // Add loading animation to cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);
    
    // Observe all blog cards
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach(card => {
        card.style.animationPlayState = 'paused';
        cardObserver.observe(card);
    });
    
    // Social media link interactions
    const socialLinks = document.querySelectorAll('.social-links a');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the platform name from the icon class
            const iconClass = this.querySelector('i').classList;
            let platform = '';
            
            if (iconClass.contains('fa-facebook-f')) {
                platform = 'Facebook';
            } else if (iconClass.contains('fa-twitter')) {
                platform = 'Twitter';
            } else if (iconClass.contains('fa-instagram')) {
                platform = 'Instagram';
            } else if (iconClass.contains('fa-linkedin-in')) {
                platform = 'LinkedIn';
            }
            
            // Show a friendly message (in a real app, these would be actual links)
            showToast(`${platform} link clicked! This would normally open ${platform}.`);
        });
    });
    
    // Toast notification system
    function showToast(message) {
        // Create toast container if it doesn't exist
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
            toastContainer.style.zIndex = '9999';
            document.body.appendChild(toastContainer);
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="toast-header">
                <i class="fas fa-info-circle text-primary me-2"></i>
                <strong class="me-auto">TechBlog</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Initialize and show the toast
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
        
        // Remove toast element after it's hidden
        toast.addEventListener('hidden.bs.toast', function() {
            toast.remove();
        });
    }
    
    // Add search functionality (basic filter)
    function addSearchFilter() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'container mb-4';
        searchContainer.innerHTML = `
            <div class="row justify-content-center">
                <div class="col-lg-6">
                    <div class="input-group">
                        <input type="text" class="form-control" id="searchInput" placeholder="Search blog posts...">
                        <button class="btn btn-outline-primary" type="button" id="searchBtn">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        const blogSection = document.querySelector('#blog .container');
        blogSection.insertBefore(searchContainer, blogSection.children[1]);
        
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        
        function filterPosts() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            const cards = document.querySelectorAll('.blog-card');
            
            cards.forEach(card => {
                const title = card.querySelector('.card-title').textContent.toLowerCase();
                const description = card.querySelector('.card-text').textContent.toLowerCase();
                const category = card.querySelector('.badge').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm) || category.includes(searchTerm)) {
                    card.closest('.col-lg-4').style.display = 'block';
                } else {
                    card.closest('.col-lg-4').style.display = searchTerm === '' ? 'block' : 'none';
                }
            });
        }
        
        searchInput.addEventListener('input', filterPosts);
        searchBtn.addEventListener('click', filterPosts);
    }
    
    // Initialize search filter
    addSearchFilter();
    
    // Back to top button - Fixed version
    function addBackToTopButton() {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTopBtn.className = 'btn btn-primary position-fixed back-to-top-btn';
        backToTopBtn.id = 'backToTopBtn';
        backToTopBtn.style.cssText = `
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        backToTopBtn.setAttribute('title', 'Back to top');
        backToTopBtn.setAttribute('type', 'button');
        
        document.body.appendChild(backToTopBtn);
        
        // Show/hide button based on scroll position
        function toggleBackToTopButton() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > 300) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.visibility = 'visible';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.visibility = 'hidden';
            }
        }
        
        window.addEventListener('scroll', toggleBackToTopButton);
        
        // Scroll to top when clicked
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Multiple fallback methods for scrolling to top
            if ('scrollTo' in window) {
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                });
            } else {
                // Fallback for older browsers
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
            }
            
            // Additional fallback using requestAnimationFrame
            const scrollToTop = () => {
                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                if (currentScroll > 0) {
                    window.requestAnimationFrame(scrollToTop);
                    window.scrollTo(0, currentScroll - (currentScroll / 8));
                }
            };
            
            // Use smooth scroll or fallback
            if (!window.scrollTo || !window.scrollTo({top: 0, behavior: 'smooth'})) {
                scrollToTop();
            }
        });
        
        // Add hover effect
        backToTopBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        backToTopBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
    
    // Initialize back to top button
    addBackToTopButton();
    
    // Navbar background opacity on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 50) {
            navbar.style.backgroundColor = 'rgba(13, 110, 253, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.backgroundColor = '';
            navbar.style.backdropFilter = '';
        }
    });
    
    // Initialize tooltips for better UX
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[title]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Card click interaction (optional enhancement)
    blogCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Only trigger if not clicking on the button
            if (!e.target.closest('.read-more-btn')) {
                const readMoreBtn = this.querySelector('.read-more-btn');
                if (readMoreBtn && !e.target.closest('.blog-content')) {
                    readMoreBtn.click();
                }
            }
        });
        
        // Add pointer cursor to indicate clickability
        card.style.cursor = 'pointer';
    });
    
    console.log('TechBlog initialized successfully!');
});
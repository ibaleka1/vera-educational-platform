// Quick Navigation Test
console.log('🧪 Testing VERA Navigation...');

// Test if VERACore exists
setTimeout(() => {
    console.log('VERACore available:', !!window.VERACore);
    console.log('showSection method:', typeof window.VERACore?.showSection);
    
    // Test navigation
    if (window.VERACore && window.VERACore.showSection) {
        console.log('✅ Navigation ready!');
        
        // Add click listeners as backup
        document.addEventListener('click', function(e) {
            if (e.target.matches('.nav-item, .quick-option')) {
                console.log('🔗 Navigation clicked:', e.target);
                const section = e.target.getAttribute('data-section') || 
                               e.target.closest('[data-section]')?.getAttribute('data-section');
                
                if (section && window.VERACore) {
                    console.log('🎯 Switching to section:', section);
                    window.VERACore.showSection(section);
                }
            }
        });
    } else {
        console.error('❌ VERACore not available!');
    }
}, 2000);
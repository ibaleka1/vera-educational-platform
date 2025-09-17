/**
 * VERA Performance & SLA Compliance Tester
 * Comprehensive performance testing and SLA validation
 * 
 * Tests:
 * - Load time performance
 * - Memory usage optimization
 * - Network efficiency
 * - Resource optimization
 * - User experience metrics
 * - Scalability benchmarks
 */

class VERAPerformanceTester {
    constructor() {
        this.performanceMetrics = {};
        this.slaResults = [];
        this.benchmarks = {};
        this.recommendations = [];
        
        // VERA SLA Requirements (example thresholds)
        this.slaThresholds = {
            pageLoadTime: 3000,      // 3 seconds max
            timeToInteractive: 5000, // 5 seconds max
            memoryUsage: 50,         // 50MB max
            domNodes: 1000,          // 1000 nodes max
            resourceCount: 50,       // 50 resources max
            imageOptimization: 0.8,  // 80% compression ratio
            scriptLoadTime: 2000,    // 2 seconds max for scripts
            apiResponseTime: 1000    // 1 second max for API calls
        };
        
        console.log('⚡ VERA Performance Tester Initialized');
    }

    async runPerformanceAudit() {
        console.log('\n🚀 Starting VERA Performance Audit...\n');
        
        const startTime = performance.now();
        
        await this.measurePageLoadPerformance();
        await this.analyzeResourceOptimization();
        await this.testMemoryUsage();
        await this.measureInteractivity();
        await this.analyzeNetworkEfficiency();
        await this.testResponsiveness();
        await this.measureBundleSize();
        await this.testCacheEfficiency();
        
        const auditDuration = performance.now() - startTime;
        this.performanceMetrics.auditDuration = auditDuration;
        
        this.generatePerformanceReport();
    }

    // ==================== PAGE LOAD PERFORMANCE ====================
    
    async measurePageLoadPerformance() {
        console.log('📊 Measuring Page Load Performance...');
        
        const navigationTiming = performance.getEntriesByType('navigation')[0];
        const paintTiming = performance.getEntriesByType('paint');
        
        if (navigationTiming) {
            this.performanceMetrics.domContentLoaded = navigationTiming.domContentLoadedEventEnd - navigationTiming.domContentLoadedEventStart;
            this.performanceMetrics.loadComplete = navigationTiming.loadEventEnd - navigationTiming.loadEventStart;
            this.performanceMetrics.domInteractive = navigationTiming.domInteractive - navigationTiming.navigationStart;
            this.performanceMetrics.dnsLookup = navigationTiming.domainLookupEnd - navigationTiming.domainLookupStart;
            this.performanceMetrics.tcpConnection = navigationTiming.connectEnd - navigationTiming.connectStart;
            this.performanceMetrics.serverResponse = navigationTiming.responseEnd - navigationTiming.requestStart;
        }
        
        // First Paint and First Contentful Paint
        paintTiming.forEach(entry => {
            if (entry.name === 'first-paint') {
                this.performanceMetrics.firstPaint = entry.startTime;
            } else if (entry.name === 'first-contentful-paint') {
                this.performanceMetrics.firstContentfulPaint = entry.startTime;
            }
        });
        
        // Largest Contentful Paint (if available)
        if ('PerformanceObserver' in window) {
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    this.performanceMetrics.largestContentfulPaint = lastEntry.startTime;
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
                
                // Disconnect after a short delay
                setTimeout(() => lcpObserver.disconnect(), 1000);
            } catch (e) {
                console.log('LCP measurement not available');
            }
        }
        
        // Time to Interactive estimation
        this.performanceMetrics.estimatedTTI = this.estimateTimeToInteractive();
        
        this.validateSLA('pageLoadTime', this.performanceMetrics.loadComplete);
        this.validateSLA('timeToInteractive', this.performanceMetrics.estimatedTTI);
    }

    estimateTimeToInteractive() {
        // Simple TTI estimation based on DOM ready + script execution
        const domReady = this.performanceMetrics.domContentLoaded || 0;
        const scriptElements = document.querySelectorAll('script').length;
        const estimatedScriptTime = scriptElements * 100; // Rough estimate
        
        return domReady + estimatedScriptTime;
    }

    // ==================== RESOURCE OPTIMIZATION ====================
    
    async analyzeResourceOptimization() {
        console.log('📦 Analyzing Resource Optimization...');
        
        const resources = performance.getEntriesByType('resource');
        
        const resourceAnalysis = {
            total: resources.length,
            scripts: resources.filter(r => r.name.includes('.js')).length,
            stylesheets: resources.filter(r => r.name.includes('.css')).length,
            images: resources.filter(r => /\.(jpg|jpeg|png|gif|webp|svg)/.test(r.name)).length,
            fonts: resources.filter(r => /\.(woff|woff2|ttf|otf)/.test(r.name)).length,
            totalSize: resources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
            compressionRatio: this.calculateCompressionRatio(resources)
        };
        
        this.performanceMetrics.resources = resourceAnalysis;
        
        // Analyze slow resources
        const slowResources = resources.filter(r => r.duration > 1000);
        this.performanceMetrics.slowResources = slowResources.map(r => ({
            name: r.name,
            duration: r.duration,
            size: r.transferSize
        }));
        
        // Check for resource optimization opportunities
        this.analyzeResourceOptimizationOpportunities(resources);
        
        this.validateSLA('resourceCount', resourceAnalysis.total);
        this.validateSLA('imageOptimization', resourceAnalysis.compressionRatio);
    }

    calculateCompressionRatio(resources) {
        const compressibleResources = resources.filter(r => 
            r.transferSize && r.decodedBodySize && 
            (r.name.includes('.js') || r.name.includes('.css') || r.name.includes('.html'))
        );
        
        if (compressibleResources.length === 0) return 1;
        
        const totalTransferSize = compressibleResources.reduce((sum, r) => sum + r.transferSize, 0);
        const totalDecodedSize = compressibleResources.reduce((sum, r) => sum + r.decodedBodySize, 0);
        
        return totalTransferSize / totalDecodedSize;
    }

    analyzeResourceOptimizationOpportunities(resources) {
        const opportunities = [];
        
        // Check for uncompressed resources
        const uncompressedResources = resources.filter(r => {
            if (!r.transferSize || !r.decodedBodySize) return false;
            const compressionRatio = r.transferSize / r.decodedBodySize;
            return compressionRatio > 0.9 && r.decodedBodySize > 10000; // >10KB and <10% compression
        });
        
        if (uncompressedResources.length > 0) {
            opportunities.push({
                type: 'compression',
                count: uncompressedResources.length,
                potential: 'Enable gzip/brotli compression for better performance'
            });
        }
        
        // Check for large images
        const largeImages = resources.filter(r => 
            /\.(jpg|jpeg|png|gif)/.test(r.name) && r.transferSize > 500000 // >500KB
        );
        
        if (largeImages.length > 0) {
            opportunities.push({
                type: 'image-optimization',
                count: largeImages.length,
                potential: 'Optimize large images with WebP format or compression'
            });
        }
        
        // Check for unused CSS/JS (basic heuristic)
        const totalScriptSize = resources
            .filter(r => r.name.includes('.js'))
            .reduce((sum, r) => sum + (r.transferSize || 0), 0);
            
        if (totalScriptSize > 1000000) { // >1MB of JS
            opportunities.push({
                type: 'bundle-optimization',
                size: Math.round(totalScriptSize / 1024),
                potential: 'Consider code splitting and tree shaking to reduce bundle size'
            });
        }
        
        this.performanceMetrics.optimizationOpportunities = opportunities;
    }

    // ==================== MEMORY USAGE ANALYSIS ====================
    
    async testMemoryUsage() {
        console.log('🧠 Testing Memory Usage...');
        
        if (performance.memory) {
            const memory = performance.memory;
            
            this.performanceMetrics.memory = {
                usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
                totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1024 / 1024), // MB
                jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024), // MB
                utilizationPercentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
            };
            
            this.validateSLA('memoryUsage', this.performanceMetrics.memory.usedJSHeapSize);
        }
        
        // DOM size analysis
        const domNodes = document.querySelectorAll('*').length;
        const textNodes = this.countTextNodes(document.body);
        
        this.performanceMetrics.dom = {
            totalNodes: domNodes,
            textNodes: textNodes,
            depth: this.getDOMDepth(document.body)
        };
        
        this.validateSLA('domNodes', domNodes);
        
        // Memory leak detection (basic)
        await this.detectPotentialMemoryLeaks();
    }

    countTextNodes(element) {
        let count = 0;
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        while (walker.nextNode()) {
            count++;
        }
        
        return count;
    }

    getDOMDepth(element, depth = 0) {
        let maxDepth = depth;
        
        for (let child of element.children) {
            const childDepth = this.getDOMDepth(child, depth + 1);
            maxDepth = Math.max(maxDepth, childDepth);
        }
        
        return maxDepth;
    }

    async detectPotentialMemoryLeaks() {
        // Simple memory leak detection
        const leakIndicators = [];
        
        // Check for excessive global variables
        const globalVarCount = Object.keys(window).length;
        if (globalVarCount > 200) {
            leakIndicators.push('High number of global variables detected');
        }
        
        // Check for event listeners (approximate)
        const elementsWithListeners = document.querySelectorAll('*[onclick], *[onload], *[onerror]');
        if (elementsWithListeners.length > 50) {
            leakIndicators.push('High number of inline event handlers detected');
        }
        
        // Check for detached DOM elements (rough heuristic)
        const hiddenElements = document.querySelectorAll('*[style*="display: none"]').length;
        if (hiddenElements > 100) {
            leakIndicators.push('Large number of hidden elements may indicate memory leaks');
        }
        
        this.performanceMetrics.memoryLeakIndicators = leakIndicators;
    }

    // ==================== INTERACTIVITY MEASUREMENT ====================
    
    async measureInteractivity() {
        console.log('👆 Measuring Interactivity...');
        
        // First Input Delay (if available)
        if ('PerformanceObserver' in window) {
            try {
                const fidObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        this.performanceMetrics.firstInputDelay = entry.processingStart - entry.startTime;
                    });
                });
                fidObserver.observe({ entryTypes: ['first-input'] });
                
                setTimeout(() => fidObserver.disconnect(), 5000);
            } catch (e) {
                console.log('FID measurement not available');
            }
        }
        
        // Test interactive elements responsiveness
        const interactiveElements = document.querySelectorAll('button, a, input, [onclick], [data-section]');
        this.performanceMetrics.interactiveElementCount = interactiveElements.length;
        
        // Test scroll performance
        const scrollTest = this.testScrollPerformance();
        this.performanceMetrics.scrollPerformance = scrollTest;
        
        // Animation performance test
        const animationTest = this.testAnimationPerformance();
        this.performanceMetrics.animationPerformance = animationTest;
    }

    testScrollPerformance() {
        return new Promise((resolve) => {
            let frameCount = 0;
            let startTime = performance.now();
            
            const testScroll = () => {
                frameCount++;
                
                if (frameCount < 60) { // Test for 1 second at 60fps
                    requestAnimationFrame(testScroll);
                } else {
                    const endTime = performance.now();
                    const actualFPS = frameCount / ((endTime - startTime) / 1000);
                    
                    resolve({
                        targetFPS: 60,
                        actualFPS: Math.round(actualFPS),
                        performance: actualFPS >= 55 ? 'good' : actualFPS >= 45 ? 'fair' : 'poor'
                    });
                }
            };
            
            // Trigger scroll animation
            window.scrollBy(0, 1);
            requestAnimationFrame(testScroll);
        });
    }

    testAnimationPerformance() {
        // Check for CSS animations and transitions
        const animatedElements = document.querySelectorAll('*[style*="transition"], *[style*="animation"]');
        const cssAnimations = document.querySelectorAll('[class*="animate"], [class*="transition"]');
        
        return {
            cssAnimatedElements: animatedElements.length,
            potentiallyAnimatedElements: cssAnimations.length,
            recommendation: animatedElements.length > 20 ? 'Consider reducing animations for better performance' : 'Animation count looks good'
        };
    }

    // ==================== NETWORK EFFICIENCY ====================
    
    async analyzeNetworkEfficiency() {
        console.log('🌐 Analyzing Network Efficiency...');
        
        const resources = performance.getEntriesByType('resource');
        
        // Analyze HTTP requests
        const httpAnalysis = {
            totalRequests: resources.length,
            httpsRequests: resources.filter(r => r.name.startsWith('https:')).length,
            httpRequests: resources.filter(r => r.name.startsWith('http:')).length,
            cacheableRequests: resources.filter(r => r.transferSize === 0).length,
            compressionSavings: this.calculateCompressionSavings(resources)
        };
        
        // Network timing analysis
        const networkTiming = resources.map(resource => ({
            name: this.getResourceName(resource.name),
            dns: resource.domainLookupEnd - resource.domainLookupStart,
            connection: resource.connectEnd - resource.connectStart,
            request: resource.responseStart - resource.requestStart,
            download: resource.responseEnd - resource.responseStart,
            total: resource.duration
        })).filter(timing => timing.total > 0);
        
        // Find bottlenecks
        const slowRequests = networkTiming
            .filter(timing => timing.total > 1000)
            .sort((a, b) => b.total - a.total)
            .slice(0, 5);
        
        this.performanceMetrics.network = {
            ...httpAnalysis,
            averageRequestTime: networkTiming.length > 0 ? 
                Math.round(networkTiming.reduce((sum, t) => sum + t.total, 0) / networkTiming.length) : 0,
            slowRequests,
            securityScore: httpAnalysis.httpsRequests / httpAnalysis.totalRequests
        };
    }

    calculateCompressionSavings(resources) {
        const compressedResources = resources.filter(r => 
            r.transferSize && r.decodedBodySize && r.transferSize < r.decodedBodySize
        );
        
        if (compressedResources.length === 0) return 0;
        
        const totalSaved = compressedResources.reduce((sum, r) => 
            sum + (r.decodedBodySize - r.transferSize), 0
        );
        const totalOriginal = compressedResources.reduce((sum, r) => 
            sum + r.decodedBodySize, 0
        );
        
        return Math.round((totalSaved / totalOriginal) * 100);
    }

    getResourceName(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.pathname.split('/').pop() || 'root';
        } catch (e) {
            return url.substring(0, 50);
        }
    }

    // ==================== RESPONSIVENESS TEST ====================
    
    async testResponsiveness() {
        console.log('📱 Testing Responsiveness...');
        
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio || 1
        };
        
        // Test common breakpoints
        const breakpoints = [
            { name: 'Mobile', width: 375 },
            { name: 'Tablet', width: 768 },
            { name: 'Desktop', width: 1200 },
            { name: 'Large Desktop', width: 1920 }
        ];
        
        const responsivenessTests = breakpoints.map(bp => {
            const isSupported = this.testViewportWidth(bp.width);
            return {
                ...bp,
                supported: isSupported,
                current: viewport.width === bp.width
            };
        });
        
        // Check for responsive images
        const responsiveImages = document.querySelectorAll('img[srcset], picture');
        
        // Check for flexible layouts
        const flexboxElements = document.querySelectorAll('[style*="flex"], .flex, [class*="flex"]');
        const gridElements = document.querySelectorAll('[style*="grid"], .grid, [class*="grid"]');
        
        this.performanceMetrics.responsiveness = {
            currentViewport: viewport,
            breakpointSupport: responsivenessTests,
            responsiveImages: responsiveImages.length,
            modernLayoutElements: flexboxElements.length + gridElements.length,
            score: this.calculateResponsivenessScore(responsivenessTests, responsiveImages.length)
        };
    }

    testViewportWidth(targetWidth) {
        // This is a simplified test - in real scenarios, you'd test actual layout changes
        const currentWidth = window.innerWidth;
        const hasMediaQueries = this.hasMediaQueriesForWidth(targetWidth);
        
        return hasMediaQueries || Math.abs(currentWidth - targetWidth) < 100;
    }

    hasMediaQueriesForWidth(width) {
        // Check if CSS has media queries for the given width
        try {
            const styleSheets = Array.from(document.styleSheets);
            
            return styleSheets.some(sheet => {
                if (!sheet.cssRules) return false;
                
                return Array.from(sheet.cssRules).some(rule => {
                    if (rule.type !== CSSRule.MEDIA_RULE) return false;
                    return rule.conditionText.includes(`${width}px`) || 
                           rule.conditionText.includes('min-width') ||
                           rule.conditionText.includes('max-width');
                });
            });
        } catch (e) {
            return false; // Cross-origin stylesheets
        }
    }

    calculateResponsivenessScore(breakpointTests, responsiveImageCount) {
        const supportedBreakpoints = breakpointTests.filter(bp => bp.supported).length;
        const breakpointScore = (supportedBreakpoints / breakpointTests.length) * 60;
        const imageScore = Math.min(responsiveImageCount * 10, 40);
        
        return Math.round(breakpointScore + imageScore);
    }

    // ==================== BUNDLE SIZE ANALYSIS ====================
    
    async measureBundleSize() {
        console.log('📦 Measuring Bundle Size...');
        
        const resources = performance.getEntriesByType('resource');
        
        const bundleAnalysis = {
            javascript: {
                files: resources.filter(r => r.name.includes('.js')),
                totalSize: 0,
                gzippedSize: 0
            },
            css: {
                files: resources.filter(r => r.name.includes('.css')),
                totalSize: 0,
                gzippedSize: 0
            },
            images: {
                files: resources.filter(r => /\.(jpg|jpeg|png|gif|webp|svg)/.test(r.name)),
                totalSize: 0
            },
            fonts: {
                files: resources.filter(r => /\.(woff|woff2|ttf|otf)/.test(r.name)),
                totalSize: 0
            }
        };
        
        // Calculate sizes
        Object.keys(bundleAnalysis).forEach(type => {
            if (bundleAnalysis[type].files) {
                bundleAnalysis[type].totalSize = bundleAnalysis[type].files.reduce(
                    (sum, file) => sum + (file.decodedBodySize || 0), 0
                );
                
                if (bundleAnalysis[type].gzippedSize !== undefined) {
                    bundleAnalysis[type].gzippedSize = bundleAnalysis[type].files.reduce(
                        (sum, file) => sum + (file.transferSize || 0), 0
                    );
                }
            }
        });
        
        // Bundle optimization recommendations
        const recommendations = [];
        
        if (bundleAnalysis.javascript.totalSize > 500000) { // >500KB
            recommendations.push('JavaScript bundle is large - consider code splitting');
        }
        
        if (bundleAnalysis.css.totalSize > 100000) { // >100KB
            recommendations.push('CSS bundle is large - consider critical CSS extraction');
        }
        
        if (bundleAnalysis.images.totalSize > 2000000) { // >2MB
            recommendations.push('Image assets are large - consider lazy loading and WebP format');
        }
        
        this.performanceMetrics.bundleSize = {
            ...bundleAnalysis,
            recommendations,
            totalSize: Object.values(bundleAnalysis).reduce((sum, type) => 
                sum + (type.totalSize || 0), 0
            )
        };
    }

    // ==================== CACHE EFFICIENCY ====================
    
    async testCacheEfficiency() {
        console.log('💾 Testing Cache Efficiency...');
        
        const resources = performance.getEntriesByType('resource');
        
        const cacheAnalysis = {
            totalResources: resources.length,
            cachedResources: resources.filter(r => r.transferSize === 0).length,
            uncachedResources: resources.filter(r => r.transferSize > 0).length,
            cacheHitRatio: 0
        };
        
        cacheAnalysis.cacheHitRatio = cacheAnalysis.totalResources > 0 ? 
            (cacheAnalysis.cachedResources / cacheAnalysis.totalResources) * 100 : 0;
        
        // Check for cache headers (simulated - would need server inspection in real scenario)
        const staticAssets = resources.filter(r => 
            /\.(js|css|jpg|jpeg|png|gif|webp|svg|woff|woff2)$/.test(r.name)
        );
        
        this.performanceMetrics.cache = {
            ...cacheAnalysis,
            staticAssets: staticAssets.length,
            recommendation: cacheAnalysis.cacheHitRatio < 50 ? 
                'Improve caching strategy for better performance' : 
                'Cache efficiency looks good'
        };
    }

    // ==================== SLA VALIDATION ====================
    
    validateSLA(metric, actualValue) {
        const threshold = this.slaThresholds[metric];
        if (threshold === undefined) return;
        
        const passed = actualValue <= threshold;
        const variance = ((actualValue - threshold) / threshold) * 100;
        
        this.slaResults.push({
            metric,
            threshold,
            actualValue: Math.round(actualValue),
            passed,
            variance: Math.round(variance),
            timestamp: new Date().toISOString()
        });
        
        if (!passed) {
            this.recommendations.push({
                type: 'SLA_VIOLATION',
                metric,
                message: `${metric} (${Math.round(actualValue)}) exceeds SLA threshold (${threshold})`,
                priority: variance > 50 ? 'HIGH' : 'MEDIUM'
            });
        }
    }

    // ==================== REPORT GENERATION ====================
    
    generatePerformanceReport() {
        const slaViolations = this.slaResults.filter(sla => !sla.passed);
        const performanceScore = this.calculateOverallPerformanceScore();
        
        console.log('\n\n' + '='.repeat(60));
        console.log('⚡ VERA PERFORMANCE AUDIT REPORT');
        console.log('='.repeat(60));
        console.log(`📅 Audit Date: ${new Date().toLocaleString()}`);
        console.log(`🎯 Performance Score: ${performanceScore}/100`);
        console.log(`⏱️  Audit Duration: ${Math.round(this.performanceMetrics.auditDuration)}ms`);
        
        // Core Web Vitals
        console.log('\n🌟 CORE WEB VITALS:');
        if (this.performanceMetrics.firstContentfulPaint) {
            console.log(`   First Contentful Paint: ${Math.round(this.performanceMetrics.firstContentfulPaint)}ms`);
        }
        if (this.performanceMetrics.largestContentfulPaint) {
            console.log(`   Largest Contentful Paint: ${Math.round(this.performanceMetrics.largestContentfulPaint)}ms`);
        }
        if (this.performanceMetrics.firstInputDelay) {
            console.log(`   First Input Delay: ${Math.round(this.performanceMetrics.firstInputDelay)}ms`);
        }
        
        // SLA Compliance
        console.log(`\n📋 SLA COMPLIANCE (${this.slaResults.length} metrics tested):`);
        console.log(`   ✅ Passed: ${this.slaResults.filter(sla => sla.passed).length}`);
        console.log(`   ❌ Failed: ${slaViolations.length}`);
        
        if (slaViolations.length > 0) {
            console.log('\n🚨 SLA VIOLATIONS:');
            slaViolations.forEach((sla, index) => {
                console.log(`   ${index + 1}. ${sla.metric}: ${sla.actualValue} (threshold: ${sla.threshold})`);
            });
        }
        
        // Performance Metrics Summary
        console.log('\n📊 PERFORMANCE METRICS:');
        if (this.performanceMetrics.memory) {
            console.log(`   Memory Usage: ${this.performanceMetrics.memory.usedJSHeapSize}MB`);
        }
        if (this.performanceMetrics.resources) {
            console.log(`   Total Resources: ${this.performanceMetrics.resources.total}`);
            console.log(`   Bundle Size: ${Math.round(this.performanceMetrics.bundleSize?.totalSize / 1024 || 0)}KB`);
        }
        if (this.performanceMetrics.network) {
            console.log(`   Avg Request Time: ${this.performanceMetrics.network.averageRequestTime}ms`);
            console.log(`   HTTPS Adoption: ${Math.round(this.performanceMetrics.network.securityScore * 100)}%`);
        }
        
        // Optimization Opportunities
        if (this.performanceMetrics.optimizationOpportunities?.length > 0) {
            console.log('\n🔧 OPTIMIZATION OPPORTUNITIES:');
            this.performanceMetrics.optimizationOpportunities.forEach((opp, index) => {
                console.log(`   ${index + 1}. ${opp.potential}`);
            });
        }
        
        // High Priority Recommendations
        const highPriorityRecs = this.recommendations.filter(rec => rec.priority === 'HIGH');
        if (highPriorityRecs.length > 0) {
            console.log('\n⚠️ HIGH PRIORITY RECOMMENDATIONS:');
            highPriorityRecs.forEach((rec, index) => {
                console.log(`   ${index + 1}. ${rec.message}`);
            });
        }
        
        // Production Readiness
        const isProductionReady = slaViolations.length === 0 && performanceScore >= 80;
        console.log(`\n🎯 Production Readiness: ${isProductionReady ? '✅ READY' : '❌ NEEDS OPTIMIZATION'}`);
        
        console.log('\n' + '='.repeat(60));
        
        return {
            score: performanceScore,
            ready: isProductionReady,
            slaViolations: slaViolations.length,
            recommendations: this.recommendations,
            metrics: this.performanceMetrics
        };
    }

    calculateOverallPerformanceScore() {
        let score = 100;
        
        // Deduct points for SLA violations
        const violations = this.slaResults.filter(sla => !sla.passed);
        score -= violations.length * 15;
        
        // Deduct points for optimization opportunities
        if (this.performanceMetrics.optimizationOpportunities) {
            score -= this.performanceMetrics.optimizationOpportunities.length * 5;
        }
        
        // Deduct points for memory issues
        if (this.performanceMetrics.memory?.utilizationPercentage > 80) {
            score -= 10;
        }
        
        // Deduct points for network inefficiencies
        if (this.performanceMetrics.network?.securityScore < 0.8) {
            score -= 10;
        }
        
        return Math.max(0, Math.min(100, score));
    }
}

// Export for use
window.VERAPerformanceTester = VERAPerformanceTester;
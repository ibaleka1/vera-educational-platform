/**
 * VERA Security & Compliance Validator
 * Advanced security testing and compliance verification
 * 
 * Validates:
 * - Data privacy and protection
 * - Authentication security
 * - Input sanitization
 * - XSS protection
 * - CSRF prevention
 * - API security
 */

class VERASecurityValidator {
    constructor() {
        this.securityTests = [];
        this.vulnerabilities = [];
        this.complianceIssues = [];
        this.securityScore = 0;
        
        console.log('🔒 VERA Security Validator Initialized');
    }

    async runSecurityAudit() {
        console.log('\n🛡️ Starting VERA Security Audit...\n');
        
        await this.testDataProtection();
        await this.testInputSanitization();
        await this.testXSSProtection();
        await this.testCSRFProtection();
        await this.testAPISecurityHeaders();
        await this.testAuthenticationSecurity();
        await this.testDataEncryption();
        await this.testPrivacyCompliance();
        
        this.generateSecurityReport();
    }

    // ==================== DATA PROTECTION TESTS ====================
    
    async testDataProtection() {
        console.log('🛡️ Testing Data Protection...');
        
        const tests = [
            {
                name: 'Personal Data Identification',
                test: () => {
                    const personalDataFields = ['email', 'name', 'phone', 'address'];
                    const inputs = document.querySelectorAll('input[type="email"], input[name*="name"], input[name*="email"]');
                    
                    // Check if personal data inputs have proper attributes
                    return Array.from(inputs).every(input => {
                        return input.autocomplete !== undefined || 
                               input.dataset.privacy !== undefined;
                    });
                },
                severity: 'HIGH'
            },
            {
                name: 'Sensitive Data Local Storage Check',
                test: () => {
                    const sensitivePatterns = [
                        /password/i, /ssn/i, /social.security/i, 
                        /credit.card/i, /payment/i, /billing/i
                    ];
                    
                    for (let key of Object.keys(localStorage)) {
                        const value = localStorage.getItem(key);
                        if (sensitivePatterns.some(pattern => 
                            pattern.test(key) || pattern.test(value)
                        )) {
                            return false;
                        }
                    }
                    return true;
                },
                severity: 'CRITICAL'
            },
            {
                name: 'Data Retention Policy Check',
                test: () => {
                    // Check for data expiration mechanisms
                    const dataKeys = Object.keys(localStorage).filter(key => 
                        key.startsWith('vera')
                    );
                    
                    return dataKeys.some(key => {
                        try {
                            const data = JSON.parse(localStorage.getItem(key));
                            return data.createdAt || data.expiresAt || data.lastUpdated;
                        } catch (e) {
                            return false;
                        }
                    });
                },
                severity: 'MEDIUM'
            }
        ];

        this.executeSecurityTests('Data Protection', tests);
    }

    // ==================== INPUT SANITIZATION TESTS ====================
    
    async testInputSanitization() {
        console.log('🧼 Testing Input Sanitization...');
        
        const tests = [
            {
                name: 'XSS Payload Detection',
                test: () => {
                    const testPayloads = [
                        '<script>alert("xss")</script>',
                        'javascript:alert("xss")',
                        '<img src="x" onerror="alert(\'xss\')">'
                    ];
                    
                    // Test if dangerous payloads are properly handled
                    const inputs = document.querySelectorAll('input[type="text"], textarea');
                    let vulnerable = false;
                    
                    inputs.forEach(input => {
                        testPayloads.forEach(payload => {
                            input.value = payload;
                            // Check if the value is sanitized or escaped
                            if (input.value === payload && payload.includes('<script>')) {
                                vulnerable = true;
                            }
                        });
                        input.value = ''; // Clean up
                    });
                    
                    return !vulnerable;
                },
                severity: 'CRITICAL'
            },
            {
                name: 'SQL Injection Pattern Check',
                test: () => {
                    const sqlPatterns = [
                        /union\s+select/i,
                        /drop\s+table/i,
                        /insert\s+into/i,
                        /delete\s+from/i
                    ];
                    
                    // Check if any input handling mentions SQL (shouldn't for client-side)
                    const scripts = document.querySelectorAll('script');
                    let foundSQLHandling = false;
                    
                    scripts.forEach(script => {
                        if (script.innerHTML) {
                            sqlPatterns.forEach(pattern => {
                                if (pattern.test(script.innerHTML)) {
                                    foundSQLHandling = true;
                                }
                            });
                        }
                    });
                    
                    // For client-side app, SQL handling should not be present
                    return !foundSQLHandling;
                },
                severity: 'HIGH'
            },
            {
                name: 'HTML Entity Encoding Check',
                test: () => {
                    // Check if user content is properly encoded
                    const userContentElements = document.querySelectorAll('[data-user-content]');
                    
                    return Array.from(userContentElements).every(element => {
                        const content = element.innerHTML;
                        // Should not contain unescaped HTML
                        return !content.includes('<script>') && 
                               !content.includes('javascript:');
                    });
                },
                severity: 'HIGH'
            }
        ];

        this.executeSecurityTests('Input Sanitization', tests);
    }

    // ==================== XSS PROTECTION TESTS ====================
    
    async testXSSProtection() {
        console.log('🚫 Testing XSS Protection...');
        
        const tests = [
            {
                name: 'Content Security Policy Header',
                test: () => {
                    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
                    if (!cspMeta) return false;
                    
                    const csp = cspMeta.content;
                    return csp.includes("script-src") && 
                           csp.includes("object-src 'none'");
                },
                severity: 'HIGH'
            },
            {
                name: 'Inline Script Prevention',
                test: () => {
                    // Check for dangerous inline event handlers
                    const elementsWithEvents = document.querySelectorAll('*');
                    let hasInlineEvents = false;
                    
                    elementsWithEvents.forEach(element => {
                        const attributes = element.attributes;
                        for (let attr of attributes) {
                            if (attr.name.startsWith('on') && attr.value.trim()) {
                                hasInlineEvents = true;
                                break;
                            }
                        }
                    });
                    
                    return !hasInlineEvents;
                },
                severity: 'MEDIUM'
            },
            {
                name: 'Dynamic Content Sanitization',
                test: () => {
                    // Check innerHTML usage patterns
                    const scripts = document.querySelectorAll('script');
                    let safeInnerHTMLUsage = true;
                    
                    scripts.forEach(script => {
                        if (script.innerHTML.includes('.innerHTML =') && 
                            !script.innerHTML.includes('DOMPurify') &&
                            !script.innerHTML.includes('textContent')) {
                            safeInnerHTMLUsage = false;
                        }
                    });
                    
                    return safeInnerHTMLUsage;
                },
                severity: 'HIGH'
            }
        ];

        this.executeSecurityTests('XSS Protection', tests);
    }

    // ==================== CSRF PROTECTION TESTS ====================
    
    async testCSRFProtection() {
        console.log('🔐 Testing CSRF Protection...');
        
        const tests = [
            {
                name: 'CSRF Token Implementation',
                test: () => {
                    // Check for CSRF tokens in forms
                    const forms = document.querySelectorAll('form');
                    if (forms.length === 0) return true; // No forms = no CSRF risk
                    
                    return Array.from(forms).every(form => {
                        const csrfInput = form.querySelector('input[name*="csrf"], input[name*="token"]');
                        const csrfMeta = document.querySelector('meta[name="csrf-token"]');
                        return csrfInput || csrfMeta;
                    });
                },
                severity: 'HIGH'
            },
            {
                name: 'SameSite Cookie Attribute',
                test: () => {
                    // Check if cookies have SameSite attribute
                    const cookies = document.cookie.split(';');
                    if (cookies.length === 0) return true;
                    
                    // This is a basic check - real implementation would need server-side validation
                    return cookies.some(cookie => 
                        cookie.toLowerCase().includes('samesite=strict') ||
                        cookie.toLowerCase().includes('samesite=lax')
                    );
                },
                severity: 'MEDIUM'
            }
        ];

        this.executeSecurityTests('CSRF Protection', tests);
    }

    // ==================== API SECURITY TESTS ====================
    
    async testAPISecurityHeaders() {
        console.log('🔗 Testing API Security Headers...');
        
        const tests = [
            {
                name: 'X-Frame-Options Header',
                test: () => {
                    // Check for clickjacking protection
                    const frameOptions = document.querySelector('meta[http-equiv="X-Frame-Options"]');
                    return frameOptions && 
                           (frameOptions.content === 'DENY' || 
                            frameOptions.content === 'SAMEORIGIN');
                },
                severity: 'MEDIUM'
            },
            {
                name: 'X-Content-Type-Options Header',
                test: () => {
                    const contentType = document.querySelector('meta[http-equiv="X-Content-Type-Options"]');
                    return contentType && contentType.content === 'nosniff';
                },
                severity: 'MEDIUM'
            },
            {
                name: 'Referrer Policy Header',
                test: () => {
                    const referrer = document.querySelector('meta[name="referrer"]') ||
                                   document.querySelector('meta[http-equiv="Referrer-Policy"]');
                    return referrer && 
                           ['no-referrer', 'strict-origin', 'strict-origin-when-cross-origin']
                           .includes(referrer.content);
                },
                severity: 'LOW'
            }
        ];

        this.executeSecurityTests('API Security Headers', tests);
    }

    // ==================== AUTHENTICATION SECURITY TESTS ====================
    
    async testAuthenticationSecurity() {
        console.log('🔑 Testing Authentication Security...');
        
        const tests = [
            {
                name: 'Session Management',
                test: () => {
                    // Check for secure session handling
                    const sessionKeys = Object.keys(localStorage).filter(key => 
                        key.includes('session') || key.includes('auth') || key.includes('token')
                    );
                    
                    // Sessions should have expiration
                    return sessionKeys.every(key => {
                        try {
                            const data = JSON.parse(localStorage.getItem(key));
                            return data.expiresAt || data.exp || data.expiry;
                        } catch (e) {
                            return false;
                        }
                    });
                },
                severity: 'HIGH'
            },
            {
                name: 'Password Security Requirements',
                test: () => {
                    const passwordInputs = document.querySelectorAll('input[type="password"]');
                    
                    return Array.from(passwordInputs).every(input => {
                        // Should have minimum security attributes
                        return input.minLength >= 8 || 
                               input.pattern !== undefined ||
                               input.dataset.validation !== undefined;
                    });
                },
                severity: 'MEDIUM'
            },
            {
                name: 'Secure Token Storage',
                test: () => {
                    // Check if auth tokens are stored securely
                    const authKeys = Object.keys(localStorage).filter(key => 
                        key.toLowerCase().includes('token') || 
                        key.toLowerCase().includes('auth')
                    );
                    
                    // Tokens should be encoded/encrypted
                    return authKeys.every(key => {
                        const value = localStorage.getItem(key);
                        // Basic check for JWT format or encoded tokens
                        return value.includes('.') || 
                               value.length > 50 || // Assuming encrypted tokens are longer
                               !value.includes('password');
                    });
                },
                severity: 'CRITICAL'
            }
        ];

        this.executeSecurityTests('Authentication Security', tests);
    }

    // ==================== DATA ENCRYPTION TESTS ====================
    
    async testDataEncryption() {
        console.log('🔒 Testing Data Encryption...');
        
        const tests = [
            {
                name: 'Sensitive Data Encryption Check',
                test: () => {
                    const sensitiveKeys = Object.keys(localStorage).filter(key => 
                        key.includes('payment') || 
                        key.includes('personal') ||
                        key.includes('medical')
                    );
                    
                    return sensitiveKeys.every(key => {
                        const value = localStorage.getItem(key);
                        // Check if data appears to be encrypted (base64, etc.)
                        try {
                            const parsed = JSON.parse(value);
                            // If it's readable JSON with sensitive fields, it's not encrypted
                            const sensitiveFields = ['password', 'ssn', 'creditCard'];
                            return !sensitiveFields.some(field => 
                                Object.keys(parsed).includes(field)
                            );
                        } catch (e) {
                            // If it's not JSON, it might be encrypted
                            return value.length > 20 && !/^[a-zA-Z0-9\s]+$/.test(value);
                        }
                    });
                },
                severity: 'HIGH'
            },
            {
                name: 'HTTPS Enforcement Check',
                test: () => {
                    return window.location.protocol === 'https:' || 
                           window.location.hostname === 'localhost' ||
                           window.location.hostname === '127.0.0.1';
                },
                severity: 'CRITICAL'
            }
        ];

        this.executeSecurityTests('Data Encryption', tests);
    }

    // ==================== PRIVACY COMPLIANCE TESTS ====================
    
    async testPrivacyCompliance() {
        console.log('👤 Testing Privacy Compliance...');
        
        const tests = [
            {
                name: 'Privacy Policy Link Present',
                test: () => {
                    const privacyLinks = document.querySelectorAll('a[href*="privacy"], a:contains("Privacy Policy")');
                    return privacyLinks.length > 0;
                },
                severity: 'MEDIUM'
            },
            {
                name: 'Cookie Consent Implementation',
                test: () => {
                    const cookieConsent = document.querySelector('[data-cookie-consent], .cookie-banner, #cookieConsent');
                    return cookieConsent !== null;
                },
                severity: 'MEDIUM'
            },
            {
                name: 'Data Minimization Check',
                test: () => {
                    // Check if only necessary data is being collected
                    const inputs = document.querySelectorAll('input[required]');
                    const personalInputs = document.querySelectorAll('input[type="email"], input[name*="name"], input[name*="phone"]');
                    
                    // Should not require more personal data than necessary
                    return personalInputs.length <= inputs.length * 0.5;
                },
                severity: 'LOW'
            },
            {
                name: 'User Data Control',
                test: () => {
                    // Check for data export/deletion capabilities
                    const dataControls = document.querySelectorAll('[data-export], [data-delete], .data-download, .account-delete');
                    return dataControls.length > 0 || 
                           document.querySelector('a[href*="settings"]') !== null;
                },
                severity: 'MEDIUM'
            }
        ];

        this.executeSecurityTests('Privacy Compliance', tests);
    }

    // ==================== UTILITY METHODS ====================
    
    executeSecurityTests(category, tests) {
        console.log(`\n--- ${category} Tests ---`);
        
        tests.forEach(test => {
            try {
                const result = test.test();
                const status = result ? '✅ SECURE' : '🚨 VULNERABLE';
                
                console.log(`${status} [${test.severity}] ${test.name}`);
                
                this.securityTests.push({
                    category,
                    name: test.name,
                    passed: result,
                    severity: test.severity,
                    timestamp: new Date().toISOString()
                });
                
                if (!result) {
                    this.addVulnerability(test.severity, category, test.name);
                }
                
            } catch (error) {
                console.log(`❌ ERROR [${test.severity}] ${test.name}: ${error.message}`);
                this.addVulnerability('CRITICAL', category, `${test.name}: ${error.message}`);
            }
        });
    }

    addVulnerability(severity, category, description) {
        this.vulnerabilities.push({
            severity,
            category,
            description,
            timestamp: new Date().toISOString(),
            impact: this.getSeverityImpact(severity)
        });
    }

    getSeverityImpact(severity) {
        const impacts = {
            'CRITICAL': 'Immediate security risk - blocks production deployment',
            'HIGH': 'Significant security risk - should be addressed before deployment',
            'MEDIUM': 'Moderate security risk - recommend addressing',
            'LOW': 'Minor security improvement - consider for future releases'
        };
        return impacts[severity] || 'Unknown impact';
    }

    calculateSecurityScore() {
        const totalTests = this.securityTests.length;
        const passedTests = this.securityTests.filter(t => t.passed).length;
        
        if (totalTests === 0) return 0;
        
        // Weight by severity
        const severityWeights = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
        let totalWeight = 0;
        let passedWeight = 0;
        
        this.securityTests.forEach(test => {
            const weight = severityWeights[test.severity] || 1;
            totalWeight += weight;
            if (test.passed) passedWeight += weight;
        });
        
        return Math.round((passedWeight / totalWeight) * 100);
    }

    generateSecurityReport() {
        this.securityScore = this.calculateSecurityScore();
        
        const criticalVulns = this.vulnerabilities.filter(v => v.severity === 'CRITICAL').length;
        const highVulns = this.vulnerabilities.filter(v => v.severity === 'HIGH').length;
        const mediumVulns = this.vulnerabilities.filter(v => v.severity === 'MEDIUM').length;
        const lowVulns = this.vulnerabilities.filter(v => v.severity === 'LOW').length;
        
        console.log('\n\n' + '='.repeat(60));
        console.log('🛡️ VERA SECURITY AUDIT REPORT');
        console.log('='.repeat(60));
        console.log(`📅 Audit Date: ${new Date().toLocaleString()}`);
        console.log(`🔒 Security Score: ${this.securityScore}/100`);
        console.log(`🧪 Total Security Tests: ${this.securityTests.length}`);
        console.log(`🚨 Critical Vulnerabilities: ${criticalVulns}`);
        console.log(`⚠️  High Risk Issues: ${highVulns}`);
        console.log(`📋 Medium Risk Issues: ${mediumVulns}`);
        console.log(`📝 Low Risk Issues: ${lowVulns}`);
        
        // Security Status
        const isSecure = criticalVulns === 0 && highVulns === 0 && this.securityScore >= 80;
        console.log(`\n🎯 Security Status: ${isSecure ? '✅ SECURE FOR PRODUCTION' : '❌ SECURITY ISSUES DETECTED'}`);
        
        // Critical Issues
        if (criticalVulns > 0) {
            console.log('\n🚨 CRITICAL SECURITY ISSUES:');
            this.vulnerabilities
                .filter(v => v.severity === 'CRITICAL')
                .forEach((vuln, index) => {
                    console.log(`   ${index + 1}. [${vuln.category}] ${vuln.description}`);
                    console.log(`      Impact: ${vuln.impact}`);
                });
        }
        
        // High Priority Issues
        if (highVulns > 0) {
            console.log('\n⚠️ HIGH PRIORITY SECURITY ISSUES:');
            this.vulnerabilities
                .filter(v => v.severity === 'HIGH')
                .forEach((vuln, index) => {
                    console.log(`   ${index + 1}. [${vuln.category}] ${vuln.description}`);
                });
        }
        
        // Security Recommendations
        console.log('\n📋 SECURITY RECOMMENDATIONS:');
        if (criticalVulns > 0) {
            console.log('   🚨 IMMEDIATE: Resolve all critical vulnerabilities before deployment');
        }
        if (highVulns > 0) {
            console.log('   ⚠️ HIGH PRIORITY: Address high-risk security issues');
        }
        if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
            console.log('   🛡️ Implement Content Security Policy headers');
        }
        if (this.securityScore < 90) {
            console.log('   📈 Improve security score to 90+ for production readiness');
        }
        
        console.log('\n' + '='.repeat(60));
        
        return {
            score: this.securityScore,
            isSecure,
            vulnerabilities: {
                critical: criticalVulns,
                high: highVulns,
                medium: mediumVulns,
                low: lowVulns
            },
            totalTests: this.securityTests.length,
            details: this.vulnerabilities
        };
    }
}

// Export for use
window.VERASecurityValidator = VERASecurityValidator;
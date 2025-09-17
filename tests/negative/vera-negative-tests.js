/**
 * VERA Negative Tests - Security, Failure, and Edge Case Testing
 * Tests invalid inputs, security breaches, system failures, and data corruption scenarios
 */

import { VERATestHelper } from '../helpers/vera-test-helper.js';
import { VERASecurityTester } from '../helpers/vera-security-tester.js';

describe('VERA Negative Tests Suite', () => {

    let testHelper;
    let securityTester;
    let failureSimulator;
    
    beforeAll(async () => {
        testHelper = new VERATestHelper();
        securityTester = new VERASecurityTester();
        failureSimulator = testHelper.createFailureSimulator();
        
        await testHelper.setupNegativeTestEnvironment();
    });

    afterAll(async () => {
        await testHelper.teardownNegativeTestEnvironment();
    });

    beforeEach(async () => {
        await testHelper.resetNegativeTestState();
        await securityTester.resetSecurityState();
    });

    // ==================== INVALID INPUT TESTING ====================
    
    describe('Invalid Input Testing', () => {
        
        test('Chat system with malicious and invalid inputs', async () => {
            const maliciousInputs = [
                // XSS Attacks
                '<script>alert("xss")</script>',
                '<img src="x" onerror="alert(1)">',
                'javascript:alert("xss")',
                
                // SQL Injection Attempts
                "'; DROP TABLE users; --",
                "admin' OR '1'='1",
                "1; DELETE FROM chat_history; --",
                
                // NoSQL Injection
                '{"$ne": null}',
                '{"$gt": ""}',
                
                // Command Injection
                '; rm -rf /',
                '`rm -rf /`',
                '$(rm -rf /)',
                
                // Buffer Overflow Attempts
                'A'.repeat(100000),
                'A'.repeat(1000000),
                
                // Unicode and Encoding Attacks
                '%00',
                '../../../etc/passwd',
                '\\..\\..\\..\\windows\\system32\\config\\sam',
                
                // JSON Injection
                '{"__proto__": {"isAdmin": true}}',
                
                // LDAP Injection
                '*)(uid=*',
                
                // XML External Entity (XXE)
                '<!DOCTYPE root [<!ENTITY test SYSTEM "file:///etc/passwd">]><root>&test;</root>',
                
                // Template Injection
                '{{7*7}}',
                '${7*7}',
                
                // Null bytes and special characters
                String.fromCharCode(0),
                '\x00',
                '\uFEFF',
                
                // Extremely long inputs
                'x'.repeat(50000),
                
                // Binary data
                Buffer.from([0x89, 0x50, 0x4E, 0x47]).toString(),
                
                // Regex DoS
                'a'.repeat(10000) + '!' + 'a'.repeat(10000)
            ];
            
            // Step 1: Test each malicious input
            for (const maliciousInput of maliciousInputs) {
                try {
                    // Test chat message processing
                    const chatResult = await testHelper.sendChatMessage(maliciousInput);
                    
                    // Verify input is sanitized/rejected
                    if (chatResult.success) {
                        expect(chatResult.reply).not.toContain('<script>');
                        expect(chatResult.reply).not.toContain('DROP TABLE');
                        expect(chatResult.reply).not.toMatch(/[<>'"]/); // Should be escaped
                    } else {
                        expect(chatResult.error).toContain('Invalid input' || 'Input rejected');
                    }
                    
                    // Verify no code execution
                    const systemState = await testHelper.checkSystemIntegrity();
                    expect(systemState.codeExecuted).toBe(false);
                    expect(systemState.filesModified).toHaveLength(0);
                    
                } catch (error) {
                    // Errors are acceptable for malicious inputs
                    expect(error.message).toContain('Invalid' || 'Rejected' || 'Sanitized');
                }
            }
            
            // Step 2: Test boundary conditions
            const boundaryInputs = [
                '', // Empty string
                null,
                undefined,
                0,
                -1,
                Number.MAX_SAFE_INTEGER,
                Number.MIN_SAFE_INTEGER,
                Infinity,
                -Infinity,
                NaN,
                {},
                [],
                function() {},
                Symbol('test')
            ];
            
            for (const input of boundaryInputs) {
                await expect(testHelper.sendChatMessage(input)).rejects.toThrow();
            }
        });

        test('Authentication system with invalid credentials', async () => {
            const invalidCredentials = [
                // SQL Injection in email
                { email: "admin'; DROP TABLE users; --", password: 'password' },
                { email: "admin' OR '1'='1' --", password: 'password' },
                
                // XSS in email/password
                { email: '<script>alert("xss")</script>@test.com', password: 'password' },
                { email: 'test@test.com', password: '<script>alert("xss")</script>' },
                
                // Buffer overflow attempts
                { email: 'a'.repeat(10000) + '@test.com', password: 'password' },
                { email: 'test@test.com', password: 'a'.repeat(10000) },
                
                // Invalid email formats
                { email: 'invalid-email', password: 'password' },
                { email: '@test.com', password: 'password' },
                { email: 'test@', password: 'password' },
                { email: '', password: 'password' },
                
                // Null and undefined values
                { email: null, password: 'password' },
                { email: 'test@test.com', password: null },
                { email: undefined, password: 'password' },
                
                // Non-string types
                { email: 123, password: 'password' },
                { email: 'test@test.com', password: {} },
                { email: [], password: 'password' },
                
                // Unicode attacks
                { email: 'test\u0000@test.com', password: 'password' },
                { email: 'test@test.com', password: 'pass\u0000word' }
            ];
            
            for (const credentials of invalidCredentials) {
                try {
                    const result = await testHelper.authenticateUser(credentials);
                    
                    // Should always fail authentication
                    expect(result.success).toBe(false);
                    expect(result.token).toBeUndefined();
                    
                    // Should not contain sensitive information in error
                    expect(result.error).not.toContain('password');
                    expect(result.error).not.toContain('hash');
                    expect(result.error).not.toContain('salt');
                    
                } catch (error) {
                    // Errors are acceptable for invalid inputs
                    expect(error.message).toMatch(/invalid|rejected|malformed/i);
                }
                
                // Verify no security bypass
                const authState = await testHelper.checkAuthenticationState();
                expect(authState.isAuthenticated).toBe(false);
                expect(authState.userId).toBeNull();
            }
        });

        test('File upload validation with malicious files', async () => {
            const maliciousFiles = [
                // Executable files
                { name: 'virus.exe', content: Buffer.from('MZ'), mimeType: 'application/octet-stream' },
                { name: 'script.bat', content: Buffer.from('del /f /s /q C:\\*'), mimeType: 'text/plain' },
                { name: 'shell.sh', content: Buffer.from('rm -rf /'), mimeType: 'text/plain' },
                
                // Files with double extensions
                { name: 'image.jpg.exe', content: Buffer.from('fake image'), mimeType: 'image/jpeg' },
                { name: 'document.pdf.js', content: Buffer.from('malicious script'), mimeType: 'application/pdf' },
                
                // Oversized files
                { name: 'huge.txt', content: Buffer.alloc(100 * 1024 * 1024), mimeType: 'text/plain' },
                
                // Files with null bytes in names
                { name: 'test\x00.txt', content: Buffer.from('test'), mimeType: 'text/plain' },
                
                // Path traversal attempts
                { name: '../../../etc/passwd', content: Buffer.from('test'), mimeType: 'text/plain' },
                { name: '..\\..\\..\\windows\\system32\\config\\sam', content: Buffer.from('test'), mimeType: 'text/plain' },
                
                // Invalid file formats
                { name: 'fake.jpg', content: Buffer.from('not a jpeg'), mimeType: 'image/jpeg' },
                { name: 'malformed.json', content: Buffer.from('{invalid json'), mimeType: 'application/json' }
            ];
            
            for (const file of maliciousFiles) {
                try {
                    const uploadResult = await testHelper.uploadFile(file);
                    
                    // Should reject malicious files
                    expect(uploadResult.success).toBe(false);
                    expect(uploadResult.error).toMatch(/rejected|invalid|unsafe/i);
                    
                    // Verify no file was saved
                    const fileExists = await testHelper.checkFileExists(file.name);
                    expect(fileExists).toBe(false);
                    
                } catch (error) {
                    // Errors are expected for malicious files
                    expect(error.message).toMatch(/invalid|rejected|unsafe/i);
                }
            }
        });
    });

    // ==================== SECURITY BREACH ATTEMPTS ====================
    
    describe('Security Breach Attempts', () => {
        
        test('Session hijacking and token manipulation', async () => {
            // Step 1: Create legitimate user session
            const legitimateUser = await testHelper.createAuthenticatedUser();
            const validToken = legitimateUser.token;
            
            // Step 2: Attempt token manipulation
            const manipulatedTokens = [
                validToken.slice(0, -1) + 'X', // Modified last character
                validToken + 'extra',           // Extended token
                validToken.replace(/[a-f]/g, '0'), // Changed hex characters
                btoa('{"userId": "admin", "role": "admin"}'), // Fake payload
                'Bearer ' + validToken,         // Wrong format
                validToken.split('.').reverse().join('.'), // Reversed JWT parts
                '',                            // Empty token
                'invalid-token-format',        // Completely invalid
                null,                          // Null token
                undefined                      // Undefined token
            ];
            
            for (const token of manipulatedTokens) {
                try {
                    const result = await testHelper.makeAuthenticatedRequest('/api/user/profile', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    
                    // Should reject invalid tokens
                    expect(result.status).toBe(401);
                    expect(result.data).not.toHaveProperty('userId');
                    
                } catch (error) {
                    expect(error.response?.status).toBe(401);
                }
            }
            
            // Step 3: Test session fixation attacks
            const sessionFixationAttempts = [
                'JSESSIONID=attacker_controlled_session',
                'vera_session=fixed_session_value',
                'auth_token=predictable_token_123'
            ];
            
            for (const sessionCookie of sessionFixationAttempts) {
                const result = await testHelper.makeRequest('/api/auth/login', {
                    method: 'POST',
                    headers: { Cookie: sessionCookie },
                    data: legitimateUser.credentials
                });
                
                // Should not accept fixed session values
                const setCookieHeader = result.headers['set-cookie'];
                if (setCookieHeader) {
                    expect(setCookieHeader).not.toContain('attacker_controlled');
                    expect(setCookieHeader).not.toContain('fixed_session');
                    expect(setCookieHeader).not.toContain('predictable_token');
                }
            }
        });

        test('Authorization bypass attempts', async () => {
            // Step 1: Create users with different permission levels
            const freeUser = await testHelper.createUser({ tier: 'free' });
            const explorerUser = await testHelper.createUser({ tier: 'explorer' });
            const adminUser = await testHelper.createUser({ tier: 'admin' });
            
            // Step 2: Test privilege escalation attempts
            const privilegeEscalationAttempts = [
                // Parameter pollution
                { userId: freeUser.id, tier: 'admin' },
                { userId: freeUser.id, role: 'administrator' },
                
                // HTTP method override
                { method: 'GET', override: 'DELETE' },
                { method: 'POST', override: 'PUT' },
                
                // Path traversal in API endpoints
                '/api/admin/../user/profile',
                '/api/user/../../admin/users',
                
                // Direct object references
                `/api/user/${adminUser.id}/profile`, // Access other user's data
                `/api/admin/users/${freeUser.id}`,   // Admin endpoint with free user
            ];
            
            // Test with free user trying to access premium features
            await testHelper.authenticateAs(freeUser);
            
            const restrictedEndpoints = [
                '/api/premium/advanced-chat',
                '/api/premium/personalized-insights',
                '/api/admin/users',
                '/api/admin/system-stats',
                '/api/integrator/trauma-analysis'
            ];
            
            for (const endpoint of restrictedEndpoints) {
                const result = await testHelper.makeAuthenticatedRequest(endpoint);
                
                // Should deny access to premium/admin features
                expect([401, 403]).toContain(result.status);
                expect(result.data).not.toHaveProperty('premiumData');
                expect(result.data).not.toHaveProperty('adminData');
            }
            
            // Step 3: Test horizontal privilege escalation
            await testHelper.authenticateAs(explorerUser);
            
            const otherUserEndpoints = [
                `/api/user/${freeUser.id}/chat-history`,
                `/api/user/${freeUser.id}/journal`,
                `/api/user/${adminUser.id}/profile`
            ];
            
            for (const endpoint of otherUserEndpoints) {
                const result = await testHelper.makeAuthenticatedRequest(endpoint);
                
                // Should not access other users' data
                expect([401, 403, 404]).toContain(result.status);
            }
        });

        test('API rate limiting and DoS protection', async () => {
            const user = await testHelper.createAuthenticatedUser();
            
            // Step 1: Test API rate limiting
            const rapidRequests = Array(1000).fill().map(async (_, index) => {
                const startTime = Date.now();
                try {
                    const result = await testHelper.makeAuthenticatedRequest('/api/chat', {
                        method: 'POST',
                        data: { message: `Spam message ${index}` }
                    });
                    return { 
                        success: true, 
                        status: result.status, 
                        responseTime: Date.now() - startTime 
                    };
                } catch (error) {
                    return { 
                        success: false, 
                        status: error.response?.status, 
                        responseTime: Date.now() - startTime 
                    };
                }
            });
            
            const results = await Promise.all(rapidRequests);
            
            // Should have rate limiting in effect
            const rateLimitedRequests = results.filter(r => r.status === 429);
            expect(rateLimitedRequests.length).toBeGreaterThan(800); // Most should be rate limited
            
            // Step 2: Test request size limits
            const oversizedPayloads = [
                { message: 'x'.repeat(1000000) }, // 1MB message
                { message: 'x'.repeat(10000000) }, // 10MB message
                { data: Array(100000).fill('large_data_chunk') } // Large array
            ];
            
            for (const payload of oversizedPayloads) {
                try {
                    const result = await testHelper.makeAuthenticatedRequest('/api/chat', {
                        method: 'POST',
                        data: payload
                    });
                    
                    // Should reject oversized payloads
                    expect([413, 400]).toContain(result.status);
                    
                } catch (error) {
                    expect([413, 400]).toContain(error.response?.status);
                }
            }
            
            // Step 3: Test connection limits
            const simultaneousConnections = Array(500).fill().map(async () => {
                return testHelper.establishWebSocketConnection();
            });
            
            const connections = await Promise.allSettled(simultaneousConnections);
            const successfulConnections = connections.filter(c => c.status === 'fulfilled').length;
            
            // Should limit concurrent connections
            expect(successfulConnections).toBeLessThan(200); // Reasonable connection limit
        });

        test('Data injection and pollution attacks', async () => {
            const user = await testHelper.createAuthenticatedUser();
            
            // Step 1: Test prototype pollution attempts
            const pollutionAttempts = [
                { '__proto__': { 'isAdmin': true } },
                { 'constructor': { 'prototype': { 'isAdmin': true } } },
                { 'journal_entry': { '__proto__': { 'mood': 10 } } },
                JSON.parse('{"__proto__": {"polluted": true}}')
            ];
            
            for (const pollutedData of pollutionAttempts) {
                try {
                    const result = await testHelper.addJournalEntry(pollutedData);
                    
                    // Verify pollution didn't occur
                    expect({}.polluted).toBeUndefined();
                    expect({}.isAdmin).toBeUndefined();
                    
                    // Should sanitize or reject polluted data
                    if (result.success) {
                        expect(result.entry).not.toHaveProperty('__proto__');
                        expect(result.entry).not.toHaveProperty('constructor');
                    }
                    
                } catch (error) {
                    // Errors are acceptable for malicious data
                    expect(error.message).toMatch(/invalid|rejected|sanitized/i);
                }
            }
            
            // Step 2: Test LDAP injection attempts
            const ldapInjections = [
                '*)(uid=*',
                '*)(|(uid=*))',
                '*)(&(uid=*)(userPassword=*))',
                'admin)(&(password=*'
            ];
            
            for (const injection of ldapInjections) {
                try {
                    const result = await testHelper.searchUsers(injection);
                    
                    // Should not return unauthorized data
                    expect(result.users).not.toContain('admin');
                    expect(result.users).not.toContain('password');
                    
                } catch (error) {
                    expect(error.message).toMatch(/invalid|malformed/i);
                }
            }
        });
    });

    // ==================== SYSTEM FAILURE SCENARIOS ====================
    
    describe('System Failure Scenarios', () => {
        
        test('Database connection failures and recovery', async () => {
            const user = await testHelper.createAuthenticatedUser();
            
            // Step 1: Normal operation baseline
            const baselineResult = await testHelper.addJournalEntry({
                content: 'Baseline entry before failure',
                mood: 3
            });
            expect(baselineResult.success).toBe(true);
            
            // Step 2: Simulate database connection failure
            await failureSimulator.simulateDatabaseFailure({
                type: 'connection_loss',
                duration: 30000 // 30 seconds
            });
            
            // Step 3: Test operations during database failure
            const failureOperations = [
                () => testHelper.addJournalEntry({ content: 'Entry during failure', mood: 4 }),
                () => testHelper.sendChatMessage('Chat during database failure'),
                () => testHelper.updateUserProfile({ name: 'Updated during failure' }),
                () => testHelper.getUserData()
            ];
            
            const failureResults = await Promise.allSettled(
                failureOperations.map(op => op())
            );
            
            // Should handle failures gracefully
            failureResults.forEach(result => {
                if (result.status === 'fulfilled') {
                    // If operation succeeded, it should be queued or cached
                    expect(result.value.queued || result.value.cached).toBe(true);
                } else {
                    // If operation failed, should have appropriate error message
                    expect(result.reason.message).toMatch(/database|connection|temporarily unavailable/i);
                }
            });
            
            // Step 4: Restore database connection
            await failureSimulator.restoreDatabaseConnection();
            
            // Step 5: Test recovery and data consistency
            await testHelper.waitForSystemRecovery();
            
            const recoveryResult = await testHelper.addJournalEntry({
                content: 'Entry after recovery',
                mood: 5
            });
            expect(recoveryResult.success).toBe(true);
            
            // Verify queued operations were processed
            const queuedOperations = await testHelper.getQueuedOperationResults();
            expect(queuedOperations.processed).toBeGreaterThan(0);
            expect(queuedOperations.failed).toBe(0);
        });

        test('External API failures (OpenAI, ElevenLabs)', async () => {
            const user = await testHelper.createAuthenticatedUser();
            
            // Step 1: Simulate OpenAI API failure
            await failureSimulator.simulateExternalAPIFailure('openai', {
                errorType: '503_service_unavailable',
                duration: 60000 // 1 minute
            });
            
            // Step 2: Test chat functionality during OpenAI failure
            const chatResult = await testHelper.sendChatMessage('Help me with anxiety');
            
            // Should provide fallback response
            expect(chatResult.success).toBe(true);
            expect(chatResult.reply).toBeTruthy();
            expect(chatResult.fallbackUsed).toBe(true);
            expect(chatResult.reply).toMatch(/temporarily unavailable|using fallback/i);
            
            // Step 3: Simulate ElevenLabs API failure
            await failureSimulator.simulateExternalAPIFailure('elevenlabs', {
                errorType: '429_rate_limit',
                duration: 120000 // 2 minutes
            });
            
            // Step 4: Test voice generation during ElevenLabs failure
            const voiceResult = await testHelper.generateVoice('Test voice message');
            
            // Should handle voice failure gracefully
            if (voiceResult.success) {
                expect(voiceResult.fallbackUsed).toBe(true);
                expect(voiceResult.message).toMatch(/voice temporarily unavailable/i);
            } else {
                expect(voiceResult.error).toMatch(/voice service unavailable/i);
            }
            
            // Step 5: Test cascading failure recovery
            await failureSimulator.restoreExternalAPI('openai');
            await failureSimulator.restoreExternalAPI('elevenlabs');
            
            // Step 6: Verify full service restoration
            await testHelper.waitForAPIRecovery();
            
            const postRecoveryChat = await testHelper.sendChatMessage('Test after recovery');
            const postRecoveryVoice = await testHelper.generateVoice('Test voice after recovery');
            
            expect(postRecoveryChat.success).toBe(true);
            expect(postRecoveryChat.fallbackUsed).toBe(false);
            expect(postRecoveryVoice.success).toBe(true);
            expect(postRecoveryVoice.fallbackUsed).toBe(false);
        });

        test('Memory exhaustion and resource limits', async () => {
            // Step 1: Simulate memory pressure
            const memoryConsumers = [];
            
            try {
                // Gradually consume memory
                for (let i = 0; i < 100; i++) {
                    const largeBuffer = Buffer.alloc(50 * 1024 * 1024); // 50MB chunks
                    memoryConsumers.push(largeBuffer);
                    
                    // Test system behavior under memory pressure
                    if (i % 10 === 0) { // Every 10 iterations
                        const memoryUsage = process.memoryUsage();
                        
                        if (memoryUsage.heapUsed > 1024 * 1024 * 1024) { // > 1GB
                            // System should start rejecting new operations
                            const result = await testHelper.sendChatMessage('Test under memory pressure');
                            
                            if (!result.success) {
                                expect(result.error).toMatch(/resource limit|memory|service unavailable/i);
                            }
                        }
                    }
                }
            } catch (error) {
                // Memory exhaustion errors are expected
                expect(error.message).toMatch(/memory|heap|allocation/i);
            } finally {
                // Step 2: Release memory and test recovery
                memoryConsumers.length = 0;
                global.gc?.(); // Force garbage collection if available
            }
            
            // Step 3: Verify system recovery after memory pressure
            await testHelper.wait(5000); // Allow for recovery
            
            const recoveryResult = await testHelper.sendChatMessage('Test after memory recovery');
            expect(recoveryResult.success).toBe(true);
        });

        test('Concurrent operation conflicts and deadlocks', async () => {
            const user = await testHelper.createAuthenticatedUser();
            
            // Step 1: Create operations that might conflict
            const conflictingOperations = [
                // Concurrent journal updates
                Array(20).fill().map(() => 
                    testHelper.addJournalEntry({ content: `Entry ${Date.now()}`, mood: 3 })
                ),
                
                // Concurrent profile updates
                Array(20).fill().map(() => 
                    testHelper.updateUserProfile({ name: `Name ${Date.now()}` })
                ),
                
                // Concurrent chat operations
                Array(20).fill().map(() => 
                    testHelper.sendChatMessage(`Message ${Date.now()}`)
                )
            ].flat();
            
            // Step 2: Execute all operations simultaneously
            const startTime = Date.now();
            const results = await Promise.allSettled(conflictingOperations);
            const endTime = Date.now();
            
            // Step 3: Analyze results for deadlocks and consistency
            const successful = results.filter(r => r.status === 'fulfilled').length;
            const failed = results.filter(r => r.status === 'rejected').length;
            
            // Should handle most operations successfully
            expect(successful).toBeGreaterThan(conflictingOperations.length * 0.8);
            
            // Should not take excessive time (indicating deadlocks)
            const totalTime = endTime - startTime;
            expect(totalTime).toBeLessThan(30000); // < 30 seconds
            
            // Step 4: Verify data consistency after concurrent operations
            const finalUserData = await testHelper.getUserData();
            expect(finalUserData.journalEntries).toBeDefined();
            expect(finalUserData.chatHistory).toBeDefined();
            expect(finalUserData.profile).toBeDefined();
            
            // No duplicate or corrupted entries
            const journalIds = finalUserData.journalEntries.map(e => e.id);
            const uniqueJournalIds = [...new Set(journalIds)];
            expect(journalIds.length).toBe(uniqueJournalIds.length);
        });
    });

    // ==================== NETWORK FAILURE HANDLING ====================
    
    describe('Network Failure Handling', () => {
        
        test('Intermittent connectivity and retry logic', async () => {
            const user = await testHelper.createAuthenticatedUser();
            
            // Step 1: Simulate intermittent network failures
            await failureSimulator.simulateIntermittentNetwork({
                failureRate: 0.5, // 50% of requests fail
                duration: 120000   // 2 minutes
            });
            
            // Step 2: Test operations under intermittent connectivity
            const networkTestOperations = [
                () => testHelper.sendChatMessage('Test message 1'),
                () => testHelper.addJournalEntry({ content: 'Network test entry', mood: 3 }),
                () => testHelper.generateVoice('Network test voice'),
                () => testHelper.updateUserProfile({ bio: 'Updated during network issues' })
            ];
            
            const networkResults = [];
            
            for (let i = 0; i < 50; i++) { // 50 operations
                const operation = networkTestOperations[i % networkTestOperations.length];
                try {
                    const result = await operation();
                    networkResults.push({ success: true, result });
                } catch (error) {
                    networkResults.push({ success: false, error: error.message });
                }
                
                await testHelper.wait(1000); // 1 second between operations
            }
            
            // Step 3: Verify retry logic and eventual success
            const successfulOperations = networkResults.filter(r => r.success);
            const retriedOperations = networkResults.filter(r => 
                r.success && r.result.retryCount && r.result.retryCount > 0
            );
            
            expect(successfulOperations.length).toBeGreaterThan(30); // > 60% success with retries
            expect(retriedOperations.length).toBeGreaterThan(10);    // Evidence of retry logic
            
            // Step 4: Restore network and verify full functionality
            await failureSimulator.restoreNetwork();
            
            const postRestoreResult = await testHelper.sendChatMessage('Post network restore test');
            expect(postRestoreResult.success).toBe(true);
            expect(postRestoreResult.retryCount).toBe(0); // No retries needed
        });

        test('Complete network isolation and offline behavior', async () => {
            const user = await testHelper.createAuthenticatedUser();
            
            // Step 1: Populate cache with initial data
            await testHelper.sendChatMessage('Initial message for cache');
            await testHelper.addJournalEntry({ content: 'Initial entry', mood: 4 });
            
            // Step 2: Simulate complete network isolation
            await failureSimulator.simulateNetworkIsolation({
                duration: 180000 // 3 minutes
            });
            
            // Step 3: Test offline functionality
            const offlineOperations = [
                // Should work offline (cached/local)
                () => testHelper.viewCachedChatHistory(),
                () => testHelper.viewJournalEntries(),
                () => testHelper.useOfflineBreathingExercises(),
                () => testHelper.accessOfflineContent(),
                
                // Should queue for later (network required)
                () => testHelper.sendChatMessage('Offline message - should queue'),
                () => testHelper.generateVoice('Offline voice - should queue')
            ];
            
            const offlineResults = await Promise.allSettled(
                offlineOperations.map(op => op())
            );
            
            // Step 4: Verify offline behavior
            const localOperations = offlineResults.slice(0, 4);
            const queuedOperations = offlineResults.slice(4);
            
            // Local operations should succeed
            localOperations.forEach(result => {
                expect(result.status).toBe('fulfilled');
                expect(result.value.offline).toBe(true);
            });
            
            // Network operations should be queued
            queuedOperations.forEach(result => {
                if (result.status === 'fulfilled') {
                    expect(result.value.queued).toBe(true);
                } else {
                    expect(result.reason.message).toMatch(/offline|network unavailable/i);
                }
            });
            
            // Step 5: Restore network and verify queue processing
            await failureSimulator.restoreNetwork();
            await testHelper.waitForQueueProcessing();
            
            // Step 6: Verify queued operations were processed
            const processedQueue = await testHelper.getProcessedQueueItems();
            expect(processedQueue.length).toBeGreaterThan(0);
            expect(processedQueue.every(item => item.processed === true)).toBe(true);
        });
    });

    // ==================== DATA CORRUPTION TESTING ====================
    
    describe('Data Corruption Testing', () => {
        
        test('LocalStorage corruption and recovery', async () => {
            const user = await testHelper.createAuthenticatedUser();
            
            // Step 1: Create valid data
            await testHelper.addJournalEntry({ content: 'Valid entry', mood: 3 });
            await testHelper.sendChatMessage('Valid chat message');
            
            // Step 2: Corrupt localStorage data
            const corruptionScenarios = [
                // Invalid JSON
                () => localStorage.setItem('veraNSJournal', '{"invalid": json}'),
                
                // Null values
                () => localStorage.setItem('veraUser', 'null'),
                
                // Empty objects
                () => localStorage.setItem('veraChatHistory', '{}'),
                
                // Wrong data types
                () => localStorage.setItem('vera_daily_messages', 'not_a_number'),
                
                // Circular references (would break JSON.stringify)
                () => {
                    const circular = { a: {} };
                    circular.a.b = circular;
                    // This would fail, so we simulate the result
                    localStorage.setItem('veraUserData', '[Circular Reference]');
                },
                
                // Truncated data
                () => localStorage.setItem('veraTrialData', '{"isActive": tr'),
                
                // Binary data in text field
                () => localStorage.setItem('veraSettings', Buffer.from([0, 1, 2, 3]).toString()),
                
                // Extremely large data
                () => localStorage.setItem('veraLargeData', 'x'.repeat(5000000))
            ];
            
            for (const corruptionScenario of corruptionScenarios) {
                // Apply corruption
                corruptionScenario();
                
                // Test system recovery
                try {
                    const recoveryResult = await testHelper.initializeSystem();
                    
                    // Should handle corruption gracefully
                    expect(recoveryResult.corruptionDetected).toBe(true);
                    expect(recoveryResult.recoveryApplied).toBe(true);
                    
                    // System should be functional after recovery
                    const testOperation = await testHelper.sendChatMessage('Test after corruption recovery');
                    expect(testOperation.success).toBe(true);
                    
                } catch (error) {
                    // Errors during corruption are acceptable if they're handled
                    expect(error.message).toMatch(/corruption|recovery|data error/i);
                }
                
                // Reset for next test
                await testHelper.resetUserData();
            }
        });

        test('Database integrity violations and constraints', async () => {
            // Step 1: Attempt to create data that violates constraints
            const constraintViolations = [
                // Foreign key violations
                {
                    operation: 'createChatMessage',
                    data: { userId: 'non_existent_user', message: 'Test message' }
                },
                
                // Unique constraint violations
                {
                    operation: 'createUser',
                    data: { email: 'duplicate@test.com', name: 'User 1' }
                },
                {
                    operation: 'createUser', // Duplicate email
                    data: { email: 'duplicate@test.com', name: 'User 2' }
                },
                
                // Check constraint violations
                {
                    operation: 'createJournalEntry',
                    data: { mood: 10, content: 'Invalid mood' } // Mood should be 1-5
                },
                
                // Not null constraint violations
                {
                    operation: 'createUser',
                    data: { email: null, name: 'No Email User' }
                },
                
                // Data type violations
                {
                    operation: 'createJournalEntry',
                    data: { mood: 'happy', content: 123 } // Wrong types
                }
            ];
            
            for (const violation of constraintViolations) {
                try {
                    const result = await testHelper.executeDatabaseOperation(
                        violation.operation, 
                        violation.data
                    );
                    
                    // Should fail due to constraint violation
                    expect(result.success).toBe(false);
                    expect(result.error).toMatch(/constraint|violation|invalid/i);
                    
                } catch (error) {
                    // Database errors for constraint violations are expected
                    expect(error.message).toMatch(/constraint|foreign key|unique|check/i);
                }
            }
            
            // Step 2: Verify database integrity after violation attempts
            const integrityCheck = await testHelper.runDatabaseIntegrityCheck();
            expect(integrityCheck.constraintViolations).toBe(0);
            expect(integrityCheck.orphanedRecords).toBe(0);
            expect(integrityCheck.corruptedData).toBe(0);
        });

        test('Cross-system data synchronization failures', async () => {
            const user = await testHelper.createAuthenticatedUser();
            
            // Step 1: Create data in multiple systems
            await testHelper.addJournalEntry({ content: 'Sync test entry', mood: 3 });
            await testHelper.sendChatMessage('Sync test message');
            
            // Step 2: Simulate sync failures between systems
            const syncFailures = [
                // Partial sync failure
                async () => {
                    await failureSimulator.simulatePartialSyncFailure({
                        systems: ['localStorage', 'database'],
                        failureRate: 0.5
                    });
                },
                
                // Timestamp conflicts
                async () => {
                    await testHelper.createTimestampConflict({
                        operation: 'updateJournalEntry',
                        localTime: new Date('2025-01-01'),
                        serverTime: new Date('2025-01-02')
                    });
                },
                
                // Version conflicts
                async () => {
                    await testHelper.createVersionConflict({
                        operation: 'updateUserProfile',
                        localVersion: 1,
                        serverVersion: 3
                    });
                },
                
                // Data format mismatches
                async () => {
                    await testHelper.createFormatMismatch({
                        localFormat: { mood: 'happy' },
                        serverFormat: { mood: 4 }
                    });
                }
            ];
            
            for (const syncFailure of syncFailures) {
                await syncFailure();
                
                // Test conflict resolution
                const resolutionResult = await testHelper.resolveSyncConflicts();
                
                // Should handle conflicts gracefully
                expect(resolutionResult.conflictsResolved).toBeGreaterThan(0);
                expect(resolutionResult.dataLoss).toBe(false);
                expect(resolutionResult.strategy).toMatch(/merge|latest|user_preference/);
                
                // Verify data consistency after resolution
                const consistencyCheck = await testHelper.checkDataConsistency();
                expect(consistencyCheck.consistent).toBe(true);
            }
        });
    });
});

export default describe;
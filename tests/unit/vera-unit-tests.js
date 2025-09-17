/**
 * VERA Unit Tests - Comprehensive Function-Level Testing
 * Tests every VERA function with all input variations, boundary conditions, and error scenarios
 */

// Mock dependencies
const mockLocalStorage = {
    data: {},
    getItem: jest.fn((key) => mockLocalStorage.data[key] || null),
    setItem: jest.fn((key, value) => { mockLocalStorage.data[key] = value; }),
    removeItem: jest.fn((key) => { delete mockLocalStorage.data[key]; }),
    clear: jest.fn(() => { mockLocalStorage.data = {}; })
};

const mockFetch = jest.fn();
const mockConsole = { log: jest.fn(), error: jest.fn() };

// Setup global mocks
global.localStorage = mockLocalStorage;
global.fetch = mockFetch;
global.console = mockConsole;

describe('VERA Unit Tests Suite', () => {

    // ==================== VERA AUTH SYSTEM TESTS ====================
    
    describe('VERAAuthSystem', () => {
        let authSystem;
        
        beforeEach(() => {
            mockLocalStorage.clear();
            jest.clearAllMocks();
            authSystem = new VERAAuthSystem();
        });

        describe('signup()', () => {
            test('should create user with valid data', async () => {
                const userData = {
                    name: 'Test User',
                    email: 'test@vera.com',
                    password: 'SecurePass123!'
                };

                const result = await authSystem.signup(userData);

                expect(result.success).toBe(true);
                expect(result.user).toHaveProperty('id');
                expect(result.user.name).toBe(userData.name);
                expect(result.user.email).toBe(userData.email);
                expect(mockLocalStorage.setItem).toHaveBeenCalledWith('veraUser', expect.any(String));
            });

            test('should reject invalid email format', async () => {
                const userData = {
                    name: 'Test User',
                    email: 'invalid-email',
                    password: 'SecurePass123!'
                };

                await expect(authSystem.signup(userData)).rejects.toThrow('Invalid email format');
            });

            test('should reject weak passwords', async () => {
                const userData = {
                    name: 'Test User',
                    email: 'test@vera.com',
                    password: '123'
                };

                await expect(authSystem.signup(userData)).rejects.toThrow('Password too weak');
            });

            test('should handle null/undefined inputs', async () => {
                await expect(authSystem.signup(null)).rejects.toThrow('User data required');
                await expect(authSystem.signup(undefined)).rejects.toThrow('User data required');
                await expect(authSystem.signup({})).rejects.toThrow('Name, email, and password required');
            });

            test('should handle special characters in name', async () => {
                const userData = {
                    name: 'Test User-O\'Connor',
                    email: 'test@vera.com',
                    password: 'SecurePass123!'
                };

                const result = await authSystem.signup(userData);
                expect(result.success).toBe(true);
                expect(result.user.name).toBe("Test User-O'Connor");
            });
        });

        describe('login()', () => {
            beforeEach(async () => {
                // Setup existing user
                await authSystem.signup({
                    name: 'Existing User',
                    email: 'existing@vera.com',
                    password: 'ExistingPass123!'
                });
            });

            test('should authenticate valid credentials', async () => {
                const credentials = {
                    email: 'existing@vera.com',
                    password: 'ExistingPass123!'
                };

                const result = await authSystem.login(credentials);

                expect(result.success).toBe(true);
                expect(result.user.email).toBe(credentials.email);
            });

            test('should reject invalid credentials', async () => {
                const credentials = {
                    email: 'existing@vera.com',
                    password: 'WrongPassword'
                };

                const result = await authSystem.login(credentials);

                expect(result.success).toBe(false);
                expect(result.error).toContain('Invalid credentials');
            });

            test('should handle non-existent user', async () => {
                const credentials = {
                    email: 'nonexistent@vera.com',
                    password: 'SomePassword123!'
                };

                const result = await authSystem.login(credentials);

                expect(result.success).toBe(false);
                expect(result.error).toContain('User not found');
            });

            test('should sanitize SQL injection attempts', async () => {
                const credentials = {
                    email: "admin'; DROP TABLE users; --",
                    password: 'password'
                };

                const result = await authSystem.login(credentials);

                expect(result.success).toBe(false);
                expect(result.error).toContain('Invalid email format');
            });
        });

        describe('getTierFeatures()', () => {
            test('should return explorer features', () => {
                const features = authSystem.getTierFeatures('explorer');
                
                expect(features).toHaveProperty('chatLimit', 10);
                expect(features.features).toContain('breathing');
                expect(features.features).toContain('grounding');
                expect(features.features).not.toContain('personalized');
            });

            test('should return regulator features', () => {
                const features = authSystem.getTierFeatures('regulator');
                
                expect(features.chatLimit).toBe(Infinity);
                expect(features.features).toContain('movement');
                expect(features.features).toContain('frequency');
            });

            test('should handle invalid tier gracefully', () => {
                const features = authSystem.getTierFeatures('invalid-tier');
                
                expect(features).toEqual(authSystem.getTierFeatures('explorer'));
            });

            test('should handle null/undefined tier', () => {
                expect(authSystem.getTierFeatures(null)).toBeDefined();
                expect(authSystem.getTierFeatures(undefined)).toBeDefined();
            });
        });

        describe('hasFeatureAccess()', () => {
            test('should grant access to tier features', () => {
                mockLocalStorage.setItem('veraTrial', JSON.stringify({ tier: 'regulator' }));
                
                expect(authSystem.hasFeatureAccess('movement')).toBe(true);
                expect(authSystem.hasFeatureAccess('personalized')).toBe(false);
            });

            test('should deny access to higher tier features', () => {
                mockLocalStorage.setItem('veraTrial', JSON.stringify({ tier: 'explorer' }));
                
                expect(authSystem.hasFeatureAccess('breathing')).toBe(true);
                expect(authSystem.hasFeatureAccess('methodology')).toBe(false);
            });
        });
    });

    // ==================== VERA ENHANCED CHAT TESTS ====================
    
    describe('VERAEnhancedChat', () => {
        let chatSystem;
        
        beforeEach(() => {
            mockLocalStorage.clear();
            jest.clearAllMocks();
            chatSystem = new VERAEnhancedChat();
        });

        describe('canSendMessage()', () => {
            test('should allow messages within limit', () => {
                mockLocalStorage.setItem('vera_daily_messages', '5');
                mockLocalStorage.setItem('vera_current_tier', 'explorer');
                
                expect(chatSystem.canSendMessage()).toBe(true);
            });

            test('should block messages over limit', () => {
                mockLocalStorage.setItem('vera_daily_messages', '10');
                mockLocalStorage.setItem('vera_current_tier', 'explorer');
                
                expect(chatSystem.canSendMessage()).toBe(false);
            });

            test('should allow unlimited for premium tiers', () => {
                mockLocalStorage.setItem('vera_daily_messages', '1000');
                mockLocalStorage.setItem('vera_current_tier', 'integrator');
                
                expect(chatSystem.canSendMessage()).toBe(true);
            });
        });

        describe('processMessage()', () => {
            test('should process valid message', async () => {
                const message = 'I feel anxious today';
                mockFetch.mockResolvedValue({
                    ok: true,
                    json: () => Promise.resolve({ reply: 'I hear your anxiety...' })
                });

                const result = await chatSystem.processMessage(message);

                expect(result).toHaveProperty('reply');
                expect(mockFetch).toHaveBeenCalledWith('/api/chat', expect.any(Object));
            });

            test('should handle empty messages', async () => {
                await expect(chatSystem.processMessage('')).rejects.toThrow('Message cannot be empty');
                await expect(chatSystem.processMessage(null)).rejects.toThrow('Message cannot be empty');
            });

            test('should handle API failures', async () => {
                const message = 'Test message';
                mockFetch.mockRejectedValue(new Error('Network error'));

                await expect(chatSystem.processMessage(message)).rejects.toThrow('Network error');
            });

            test('should sanitize XSS attempts', async () => {
                const message = '<script>alert("xss")</script>';
                
                const sanitized = chatSystem.sanitizeInput(message);
                expect(sanitized).not.toContain('<script>');
                expect(sanitized).not.toContain('alert');
            });
        });

        describe('checkDailyReset()', () => {
            test('should reset count on new day', () => {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                
                mockLocalStorage.setItem('vera_chat_reset_date', yesterday.toDateString());
                mockLocalStorage.setItem('vera_daily_messages', '10');

                chatSystem.checkDailyReset();

                expect(mockLocalStorage.getItem('vera_daily_messages')).toBe('0');
            });

            test('should not reset count on same day', () => {
                const today = new Date().toDateString();
                mockLocalStorage.setItem('vera_chat_reset_date', today);
                mockLocalStorage.setItem('vera_daily_messages', '5');

                chatSystem.checkDailyReset();

                expect(mockLocalStorage.getItem('vera_daily_messages')).toBe('5');
            });
        });
    });

    // ==================== VERA NERVOUS SYSTEM JOURNAL TESTS ====================
    
    describe('VERANervousSystemJournal', () => {
        let journal;
        
        beforeEach(() => {
            mockLocalStorage.clear();
            jest.clearAllMocks();
            journal = new VERANervousSystemJournal();
        });

        describe('addEntry()', () => {
            test('should add valid journal entry', () => {
                const entry = {
                    content: 'Feeling grounded today',
                    mood: 4,
                    nervousSystemState: 'regulated'
                };

                journal.addEntry(entry);

                expect(journal.entries).toHaveLength(1);
                expect(journal.entries[0]).toMatchObject(entry);
                expect(mockLocalStorage.setItem).toHaveBeenCalledWith('veraNSJournal', expect.any(String));
            });

            test('should validate mood range', () => {
                const invalidEntry = {
                    content: 'Test entry',
                    mood: 6, // Invalid: should be 1-5
                    nervousSystemState: 'test'
                };

                expect(() => journal.addEntry(invalidEntry)).toThrow('Mood must be between 1 and 5');
            });

            test('should require content', () => {
                const invalidEntry = {
                    mood: 3,
                    nervousSystemState: 'test'
                };

                expect(() => journal.addEntry(invalidEntry)).toThrow('Content is required');
            });

            test('should handle long content', () => {
                const longContent = 'a'.repeat(10000);
                const entry = {
                    content: longContent,
                    mood: 3,
                    nervousSystemState: 'test'
                };

                expect(() => journal.addEntry(entry)).toThrow('Content too long');
            });
        });

        describe('getPromptForTier()', () => {
            test('should return explorer prompts', () => {
                const prompt = journal.getPromptForTier('explorer');
                
                expect(prompt).toBeDefined();
                expect(typeof prompt).toBe('string');
                expect(prompt.length).toBeGreaterThan(10);
            });

            test('should return advanced prompts for higher tiers', () => {
                const explorerPrompt = journal.getPromptForTier('explorer');
                const integratorPrompt = journal.getPromptForTier('integrator');
                
                expect(integratorPrompt).not.toBe(explorerPrompt);
                expect(integratorPrompt).toContain('integration' || 'trauma' || 'therapeutic');
            });

            test('should handle invalid tier', () => {
                const prompt = journal.getPromptForTier('invalid');
                
                expect(prompt).toBeDefined();
                expect(prompt).toBe(journal.getPromptForTier('explorer'));
            });
        });

        describe('analyzeMoodPatterns()', () => {
            beforeEach(() => {
                // Add test entries with mood patterns
                const testEntries = [
                    { date: '2025-09-10', mood: 2, content: 'Stressed day' },
                    { date: '2025-09-11', mood: 4, content: 'Better day' },
                    { date: '2025-09-12', mood: 3, content: 'Neutral day' },
                    { date: '2025-09-13', mood: 5, content: 'Great day' },
                    { date: '2025-09-14', mood: 1, content: 'Difficult day' }
                ];
                journal.entries = testEntries;
            });

            test('should calculate average mood', () => {
                const analysis = journal.analyzeMoodPatterns();
                
                expect(analysis.averageMood).toBe(3); // (2+4+3+5+1)/5 = 3
            });

            test('should identify mood trends', () => {
                const analysis = journal.analyzeMoodPatterns();
                
                expect(analysis).toHaveProperty('trend');
                expect(['improving', 'declining', 'stable']).toContain(analysis.trend);
            });

            test('should handle empty entries', () => {
                journal.entries = [];
                const analysis = journal.analyzeMoodPatterns();
                
                expect(analysis.averageMood).toBe(0);
                expect(analysis.trend).toBe('no-data');
            });
        });
    });

    // ==================== VERA VOICE SERVICE TESTS ====================
    
    describe('VERAVoiceService', () => {
        let voiceService;
        
        beforeEach(() => {
            jest.clearAllMocks();
            voiceService = new VERAVoiceService();
            process.env.ELEVENLABS_API_KEY = 'test_api_key';
        });

        describe('generateVoice()', () => {
            test('should generate voice for valid text', async () => {
                const mockAudioBuffer = new ArrayBuffer(1024);
                mockFetch.mockResolvedValue({
                    ok: true,
                    arrayBuffer: () => Promise.resolve(mockAudioBuffer)
                });

                const result = await voiceService.generateVoice('Hello, this is VERA');

                expect(result).toBe(mockAudioBuffer);
                expect(mockFetch).toHaveBeenCalledWith(
                    expect.stringContaining('elevenlabs.io'),
                    expect.objectContaining({
                        method: 'POST',
                        headers: expect.objectContaining({
                            'xi-api-key': 'test_api_key'
                        })
                    })
                );
            });

            test('should handle empty text', async () => {
                await expect(voiceService.generateVoice('')).rejects.toThrow('Text cannot be empty');
            });

            test('should handle API errors', async () => {
                mockFetch.mockResolvedValue({
                    ok: false,
                    status: 401
                });

                await expect(voiceService.generateVoice('Test')).rejects.toThrow('ElevenLabs API error: 401');
            });

            test('should adapt voice based on user state', async () => {
                const userState = {
                    activation_level: 0.8,
                    coherence_level: 0.2
                };

                const mockAudioBuffer = new ArrayBuffer(1024);
                mockFetch.mockResolvedValue({
                    ok: true,
                    arrayBuffer: () => Promise.resolve(mockAudioBuffer)
                });

                await voiceService.generateVoice('Test message', userState);

                const fetchCall = mockFetch.mock.calls[0];
                const requestBody = JSON.parse(fetchCall[1].body);
                
                expect(requestBody.voice_settings).toHaveProperty('stability');
                expect(requestBody.voice_settings.stability).toBeLessThan(0.5); // Should use calming settings
            });
        });

        describe('selectVoice()', () => {
            test('should select gentle voice for high activation', () => {
                const userState = { activation_level: 0.9 };
                
                const voiceId = voiceService.selectVoice(userState);
                
                expect(voiceId).toBe(voiceService.voices.gentle);
            });

            test('should select energetic voice for low activation', () => {
                const userState = { activation_level: 0.1 };
                
                const voiceId = voiceService.selectVoice(userState);
                
                expect(voiceId).toBe(voiceService.voices.energetic);
            });

            test('should default to primary voice', () => {
                const userState = {};
                
                const voiceId = voiceService.selectVoice(userState);
                
                expect(voiceId).toBe(voiceService.voices.primary);
            });
        });

        describe('addRegulationPauses()', () => {
            test('should add pauses for nervous system regulation', () => {
                const text = 'Take a deep breath. Notice your body.';
                
                const result = voiceService.addRegulationPauses(text);
                
                expect(result).toContain('...');
                expect(result.length).toBeGreaterThan(text.length);
            });

            test('should handle short text', () => {
                const text = 'Yes.';
                
                const result = voiceService.addRegulationPauses(text);
                
                expect(result).toBe(text); // Should not modify very short text
            });
        });
    });

    // ==================== VERA TIER MANAGER TESTS ====================
    
    describe('VERATierManager', () => {
        let tierManager;
        
        beforeEach(() => {
            mockLocalStorage.clear();
            jest.clearAllMocks();
            tierManager = new VERATierManager();
        });

        describe('getCurrentUserTier()', () => {
            test('should return active subscription tier', () => {
                mockLocalStorage.setItem('veraUser', JSON.stringify({
                    subscription: { tier: 'regulator', active: true }
                }));

                const tier = tierManager.getCurrentUserTier();
                
                expect(tier).toBe('regulator');
            });

            test('should return free for active trial', () => {
                mockLocalStorage.setItem('veraTrial', JSON.stringify({
                    isActive: true
                }));

                const tier = tierManager.getCurrentUserTier();
                
                expect(tier).toBe('free');
            });

            test('should default to free tier', () => {
                const tier = tierManager.getCurrentUserTier();
                
                expect(tier).toBe('free');
            });
        });

        describe('hasFeatureAccess()', () => {
            test('should grant basic breathing access to all tiers', () => {
                tierManager.currentTier = 'free';
                
                expect(tierManager.hasFeatureAccess('breathing-box')).toBe(true);
            });

            test('should restrict advanced features to higher tiers', () => {
                tierManager.currentTier = 'explorer';
                
                expect(tierManager.hasFeatureAccess('breathing-voo')).toBe(false);
            });

            test('should grant all features to integrator tier', () => {
                tierManager.currentTier = 'integrator';
                
                expect(tierManager.hasFeatureAccess('breathing-voo')).toBe(true);
                expect(tierManager.hasFeatureAccess('grounding-bilateral')).toBe(true);
            });
        });

        describe('updateTier()', () => {
            test('should update tier and save to storage', () => {
                tierManager.updateTier('regulator');
                
                expect(tierManager.currentTier).toBe('regulator');
                expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
                    'veraUser',
                    expect.stringContaining('regulator')
                );
            });

            test('should validate tier before updating', () => {
                expect(() => tierManager.updateTier('invalid-tier'))
                    .toThrow('Invalid tier');
            });
        });
    });
});

// ==================== BOUNDARY CONDITION TESTS ====================

describe('VERA Boundary Conditions', () => {
    
    describe('Data Limits', () => {
        test('should handle maximum localStorage size', () => {
            const largeData = 'x'.repeat(5 * 1024 * 1024); // 5MB
            
            expect(() => {
                mockLocalStorage.setItem('veraLargeData', largeData);
            }).not.toThrow();
        });

        test('should handle maximum chat message length', () => {
            const longMessage = 'a'.repeat(10000);
            const chatSystem = new VERAEnhancedChat();
            
            expect(() => chatSystem.validateMessage(longMessage))
                .toThrow('Message too long');
        });

        test('should handle maximum journal entries', () => {
            const journal = new VERANervousSystemJournal();
            
            // Add 1000 entries
            for (let i = 0; i < 1000; i++) {
                journal.addEntry({
                    content: `Entry ${i}`,
                    mood: (i % 5) + 1,
                    nervousSystemState: 'test'
                });
            }
            
            expect(journal.entries).toHaveLength(1000);
        });
    });

    describe('Edge Cases', () => {
        test('should handle special Unicode characters', () => {
            const authSystem = new VERAAuthSystem();
            const userData = {
                name: '测试用户 🌟',
                email: 'test@véra.com',
                password: 'SecurePass123!'
            };
            
            expect(() => authSystem.validateUserData(userData)).not.toThrow();
        });

        test('should handle concurrent operations', async () => {
            const chatSystem = new VERAEnhancedChat();
            
            mockFetch.mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({ reply: 'Response' })
            });

            const promises = Array(10).fill().map((_, i) => 
                chatSystem.processMessage(`Message ${i}`)
            );
            
            const results = await Promise.all(promises);
            expect(results).toHaveLength(10);
        });
    });
});

// ==================== ERROR SCENARIO TESTS ====================

describe('VERA Error Scenarios', () => {
    
    describe('Network Failures', () => {
        test('should handle fetch timeouts', async () => {
            const chatSystem = new VERAEnhancedChat();
            
            mockFetch.mockImplementation(() => 
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Timeout')), 100)
                )
            );

            await expect(chatSystem.processMessage('Test'))
                .rejects.toThrow('Timeout');
        });

        test('should handle API rate limits', async () => {
            const voiceService = new VERAVoiceService();
            
            mockFetch.mockResolvedValue({
                ok: false,
                status: 429,
                statusText: 'Too Many Requests'
            });

            await expect(voiceService.generateVoice('Test'))
                .rejects.toThrow('ElevenLabs API error: 429');
        });
    });

    describe('Data Corruption', () => {
        test('should handle corrupted localStorage data', () => {
            mockLocalStorage.setItem('veraUser', 'invalid-json{');
            
            const authSystem = new VERAAuthSystem();
            
            expect(() => authSystem.checkAuthStatus()).not.toThrow();
        });

        test('should handle missing required fields', () => {
            mockLocalStorage.setItem('veraUser', JSON.stringify({}));
            
            const authSystem = new VERAAuthSystem();
            const userData = authSystem.getUserData();
            
            expect(userData).toEqual({});
        });
    });

    describe('Security Vulnerabilities', () => {
        test('should prevent XSS in chat messages', () => {
            const chatSystem = new VERAEnhancedChat();
            const maliciousScript = '<script>alert("xss")</script>';
            
            const sanitized = chatSystem.sanitizeInput(maliciousScript);
            
            expect(sanitized).not.toContain('<script>');
            expect(sanitized).not.toContain('alert');
        });

        test('should prevent SQL injection in user data', async () => {
            const authSystem = new VERAAuthSystem();
            const maliciousData = {
                name: "'; DROP TABLE users; --",
                email: 'test@vera.com',
                password: 'password'
            };
            
            const sanitized = authSystem.sanitizeUserInput(maliciousData);
            
            expect(sanitized.name).not.toContain('DROP TABLE');
        });
    });
});

export default describe;
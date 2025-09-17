/**
 * VERA Integration Tests - Complete Workflow Testing
 * Tests complete user journeys, API request/response cycles, and system integrations
 */

import { VERATestHelper } from '../helpers/vera-test-helper.js';

describe('VERA Integration Tests Suite', () => {

    let testHelper;
    let mockServer;
    
    beforeAll(async () => {
        testHelper = new VERATestHelper();
        mockServer = await testHelper.startMockServer();
    });

    afterAll(async () => {
        await testHelper.stopMockServer();
    });

    beforeEach(async () => {
        await testHelper.resetTestEnvironment();
    });

    // ==================== USER AUTHENTICATION WORKFLOWS ====================
    
    describe('User Authentication Workflow', () => {
        
        test('Complete signup to first chat journey', async () => {
            // Step 1: User visits landing page
            await testHelper.navigateTo('/landing.html');
            expect(testHelper.getCurrentUrl()).toBe('/landing.html');

            // Step 2: User clicks sign up
            await testHelper.clickElement('#signup-btn');
            expect(testHelper.isElementVisible('#signup-form')).toBe(true);

            // Step 3: User fills signup form
            await testHelper.fillForm('#signup-form', {
                name: 'Integration Test User',
                email: 'integration@vera.com',
                password: 'IntegrationPass123!'
            });

            // Step 4: User submits form
            await testHelper.submitForm('#signup-form');
            
            // Verify API call
            const signupRequest = mockServer.getLastRequest('/api/auth/signup');
            expect(signupRequest).toBeDefined();
            expect(signupRequest.body.name).toBe('Integration Test User');

            // Step 5: Verify redirect to app
            await testHelper.waitForNavigation();
            expect(testHelper.getCurrentUrl()).toContain('/vera.html');

            // Step 6: Verify trial setup
            const userData = testHelper.getLocalStorageItem('veraUser');
            expect(userData).toHaveProperty('subscription.trial');
            expect(userData.subscription.trial.isActive).toBe(true);

            // Step 7: User sends first chat message
            await testHelper.typeInElement('#chat-input', 'Hello VERA, I need help with anxiety');
            await testHelper.clickElement('#send-chat-btn');

            // Verify chat API integration
            const chatRequest = mockServer.getLastRequest('/api/chat');
            expect(chatRequest).toBeDefined();
            expect(chatRequest.body.message).toContain('anxiety');
            expect(chatRequest.body.userState).toBeDefined();

            // Step 8: Verify response processing
            await testHelper.waitForElement('.chat-response');
            const chatResponse = testHelper.getElementText('.chat-response');
            expect(chatResponse).toBeTruthy();
            
            // Step 9: Verify chat counter update
            const messageCount = testHelper.getLocalStorageItem('vera_daily_messages');
            expect(parseInt(messageCount)).toBe(1);
        });

        test('Login to tier upgrade workflow', async () => {
            // Pre-setup: Create existing user
            await testHelper.createTestUser({
                email: 'existing@vera.com',
                password: 'ExistingPass123!',
                tier: 'explorer'
            });

            // Step 1: User logs in
            await testHelper.navigateTo('/landing.html');
            await testHelper.clickElement('#login-btn');
            await testHelper.fillForm('#login-form', {
                email: 'existing@vera.com',
                password: 'ExistingPass123!'
            });
            await testHelper.submitForm('#login-form');

            // Step 2: Verify authenticated state
            await testHelper.waitForNavigation();
            expect(testHelper.getCurrentUrl()).toContain('/vera.html');
            expect(testHelper.isElementVisible('#user-dashboard')).toBe(true);

            // Step 3: User attempts premium feature
            await testHelper.clickElement('#breathing-voo-btn');
            expect(testHelper.isElementVisible('#tier-upgrade-modal')).toBe(true);

            // Step 4: User upgrades tier
            await testHelper.clickElement('#upgrade-to-regulator');
            
            // Verify payment API integration
            const paymentRequest = mockServer.getLastRequest('/api/payment/subscribe');
            expect(paymentRequest).toBeDefined();
            expect(paymentRequest.body.tier).toBe('regulator');

            // Step 5: Verify tier update in system
            await testHelper.waitForApiResponse();
            const updatedUser = testHelper.getLocalStorageItem('veraUser');
            expect(updatedUser.subscription.tier).toBe('regulator');

            // Step 6: Verify feature access granted
            await testHelper.clickElement('#breathing-voo-btn');
            expect(testHelper.isElementVisible('#breathing-voo-interface')).toBe(true);
        });
    });

    // ==================== CHAT SYSTEM WORKFLOWS ====================
    
    describe('Enhanced Chat System Workflow', () => {
        
        test('Multi-message conversation with adaptive responses', async () => {
            await testHelper.setupAuthenticatedUser('regulator');
            await testHelper.navigateTo('/vera.html');

            // Step 1: User sends initial trauma-related message
            const initialMessage = 'I had a panic attack this morning and feel disconnected from my body';
            await testHelper.sendChatMessage(initialMessage);

            // Verify trauma code detection
            const firstRequest = mockServer.getLastRequest('/api/chat');
            expect(firstRequest.body.detectedCodes).toContain('trauma');
            expect(firstRequest.body.detectedCodes).toContain('dpdr');

            // Step 2: Verify adaptive response
            await testHelper.waitForChatResponse();
            const firstResponse = testHelper.getLastChatResponse();
            expect(firstResponse).toContain('panic' || 'body' || 'ground');

            // Step 3: User follows up with progress
            const followUpMessage = 'The grounding helped, but I still feel some numbness';
            await testHelper.sendChatMessage(followUpMessage);

            // Verify context preservation
            const secondRequest = mockServer.getLastRequest('/api/chat');
            expect(secondRequest.body.conversationHistory).toHaveLength(2);
            expect(secondRequest.body.userProgress).toBeDefined();

            // Step 4: Verify progressive response adaptation
            await testHelper.waitForChatResponse();
            const secondResponse = testHelper.getLastChatResponse();
            expect(secondResponse).toContain('progress' || 'continuing' || 'next');

            // Step 5: User requests voice response
            await testHelper.clickElement('#voice-response-btn');

            // Verify voice generation API
            const voiceRequest = mockServer.getLastRequest('/api/voice/generate');
            expect(voiceRequest).toBeDefined();
            expect(voiceRequest.body.text).toBe(secondResponse);
            expect(voiceRequest.body.userState.nervousSystemState).toBeDefined();

            // Step 6: Verify voice adaptation
            await testHelper.waitForAudioGeneration();
            const audioElement = testHelper.getElement('#chat-audio');
            expect(audioElement.src).toBeTruthy();
        });

        test('Daily limit enforcement and reset workflow', async () => {
            await testHelper.setupAuthenticatedUser('explorer'); // 10 message limit
            await testHelper.navigateTo('/vera.html');

            // Step 1: Send messages up to daily limit
            for (let i = 1; i <= 10; i++) {
                await testHelper.sendChatMessage(`Message ${i}`);
                await testHelper.waitForChatResponse();
                
                const messageCount = testHelper.getLocalStorageItem('vera_daily_messages');
                expect(parseInt(messageCount)).toBe(i);
            }

            // Step 2: Attempt to send message over limit
            await testHelper.typeInElement('#chat-input', 'Over limit message');
            await testHelper.clickElement('#send-chat-btn');

            // Verify limit enforcement
            expect(testHelper.isElementVisible('#daily-limit-modal')).toBe(true);
            expect(testHelper.getElementText('#daily-limit-modal')).toContain('daily limit');

            // Step 3: Simulate day reset
            await testHelper.simulateTimeAdvance(24 * 60 * 60 * 1000); // 24 hours
            await testHelper.refreshPage();

            // Step 4: Verify reset
            const resetCount = testHelper.getLocalStorageItem('vera_daily_messages');
            expect(parseInt(resetCount)).toBe(0);

            // Step 5: Verify messaging works again
            await testHelper.sendChatMessage('Post-reset message');
            await testHelper.waitForChatResponse();
            expect(testHelper.getLastChatResponse()).toBeTruthy();
        });
    });

    // ==================== NERVOUS SYSTEM JOURNAL WORKFLOWS ====================
    
    describe('Nervous System Journal Workflow', () => {
        
        test('Complete journal entry with mood analysis', async () => {
            await testHelper.setupAuthenticatedUser('regulator');
            await testHelper.navigateTo('/vera.html#nervous-system-journal');

            // Step 1: User creates journal entry
            await testHelper.clickElement('#new-journal-entry');
            expect(testHelper.isElementVisible('#journal-entry-form')).toBe(true);

            // Step 2: User fills entry form
            const entryData = {
                content: 'Today I practiced breathing exercises and noticed my anxiety decreasing throughout the day.',
                mood: 4,
                nervousSystemState: 'regulated',
                triggers: 'work stress',
                copingStrategies: 'breathing, grounding'
            };

            await testHelper.fillForm('#journal-entry-form', entryData);

            // Step 3: User submits entry
            await testHelper.submitForm('#journal-entry-form');

            // Verify local storage update
            const journalData = testHelper.getLocalStorageItem('veraNSJournal');
            expect(journalData.entries).toHaveLength(1);
            expect(journalData.entries[0].content).toBe(entryData.content);

            // Step 4: Verify AI analysis integration
            const analysisRequest = mockServer.getLastRequest('/api/journal/analyze');
            expect(analysisRequest).toBeDefined();
            expect(analysisRequest.body.entry).toMatchObject(entryData);

            // Step 5: User views mood analysis
            await testHelper.clickElement('#mood-analysis-tab');
            await testHelper.waitForElement('#mood-chart');

            // Verify analysis display
            const moodChart = testHelper.getElement('#mood-chart');
            expect(moodChart).toBeTruthy();
            
            const analysisText = testHelper.getElementText('#analysis-insights');
            expect(analysisText).toContain('pattern' || 'trend' || 'improvement');

            // Step 6: User exports journal data
            await testHelper.clickElement('#export-journal-btn');
            
            // Verify export API
            const exportRequest = mockServer.getLastRequest('/api/journal/export');
            expect(exportRequest).toBeDefined();
            
            // Verify download initiation
            await testHelper.waitForDownload();
            const downloadedFile = testHelper.getLastDownload();
            expect(downloadedFile.name).toContain('vera-journal');
            expect(downloadedFile.type).toBe('application/json');
        });
    });

    // ==================== VOICE INTEGRATION WORKFLOWS ====================
    
    describe('Voice Integration Workflow', () => {
        
        test('Adaptive voice generation with user state', async () => {
            await testHelper.setupAuthenticatedUser('integrator');
            await testHelper.navigateTo('/vera.html');

            // Step 1: Simulate high activation user state
            await testHelper.setUserState({
                activation_level: 0.9,
                coherence_level: 0.2,
                nervousSystemState: 'hyperactivated'
            });

            // Step 2: Send message requiring voice response
            await testHelper.sendChatMessage('I feel overwhelmed and my heart is racing');
            await testHelper.waitForChatResponse();
            await testHelper.clickElement('#voice-response-btn');

            // Step 3: Verify voice adaptation
            const voiceRequest = mockServer.getLastRequest('/api/voice/generate');
            expect(voiceRequest.body.voice_settings.stability).toBeGreaterThan(0.7);
            expect(voiceRequest.body.voice_settings.clarity_boost).toBeLessThan(0.3);
            expect(voiceRequest.body.voice_id).toBe('gentle_voice_id');

            // Step 4: Verify regulation pauses
            expect(voiceRequest.body.text).toContain('...');
            expect(voiceRequest.body.text).toMatch(/\.\.\.\s+/g); // Multiple pauses

            // Step 5: Simulate state improvement and retry
            await testHelper.setUserState({
                activation_level: 0.3,
                coherence_level: 0.8,
                nervousSystemState: 'regulated'
            });

            await testHelper.clickElement('#voice-response-btn');

            // Step 6: Verify adapted voice settings
            const secondVoiceRequest = mockServer.getLastRequest('/api/voice/generate');
            expect(secondVoiceRequest.body.voice_settings.stability).toBeLessThan(0.5);
            expect(secondVoiceRequest.body.voice_id).toBe('primary_voice_id');
        });
    });

    // ==================== SUBSCRIPTION MANAGEMENT WORKFLOWS ====================
    
    describe('Subscription Management Workflow', () => {
        
        test('Trial expiration and subscription flow', async () => {
            // Step 1: Setup user with expiring trial
            await testHelper.setupAuthenticatedUser('free', {
                trial: {
                    isActive: true,
                    startDate: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000), // 13 days ago
                    endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) // 1 day remaining
                }
            });

            await testHelper.navigateTo('/vera.html');

            // Step 2: Verify trial warning
            expect(testHelper.isElementVisible('#trial-warning')).toBe(true);
            const warningText = testHelper.getElementText('#trial-warning');
            expect(warningText).toContain('1 day');

            // Step 3: Simulate trial expiration
            await testHelper.simulateTimeAdvance(2 * 24 * 60 * 60 * 1000);
            await testHelper.refreshPage();

            // Step 4: Verify trial expired state
            expect(testHelper.isElementVisible('#trial-expired-modal')).toBe(true);
            expect(testHelper.isElementDisabled('#chat-input')).toBe(true);

            // Step 5: User selects subscription
            await testHelper.clickElement('#choose-regulator-tier');
            
            // Verify subscription API call
            const subRequest = mockServer.getLastRequest('/api/subscription/create');
            expect(subRequest.body.tier).toBe('regulator');
            expect(subRequest.body.userId).toBeDefined();

            // Step 6: Simulate successful payment
            mockServer.mockWebhook('/api/webhook/payment-success', {
                userId: subRequest.body.userId,
                subscriptionId: 'sub_test_123',
                tier: 'regulator'
            });

            // Step 7: Verify subscription activation
            await testHelper.waitForWebhook();
            const updatedUser = testHelper.getLocalStorageItem('veraUser');
            expect(updatedUser.subscription.active).toBe(true);
            expect(updatedUser.subscription.tier).toBe('regulator');

            // Step 8: Verify feature reactivation
            expect(testHelper.isElementDisabled('#chat-input')).toBe(false);
            await testHelper.sendChatMessage('Testing post-subscription');
            await testHelper.waitForChatResponse();
            expect(testHelper.getLastChatResponse()).toBeTruthy();
        });
    });

    // ==================== CROSS-SYSTEM INTEGRATIONS ====================
    
    describe('Cross-System Integration Workflows', () => {
        
        test('Emergency navigation with chat and voice integration', async () => {
            await testHelper.setupAuthenticatedUser('integrator');
            await testHelper.navigateTo('/vera.html');

            // Step 1: User triggers emergency keywords
            await testHelper.sendChatMessage('I am having suicidal thoughts and need help');

            // Step 2: Verify emergency detection
            const chatRequest = mockServer.getLastRequest('/api/chat');
            expect(chatRequest.body.emergencyDetected).toBe(true);
            expect(chatRequest.body.emergencyLevel).toBe('high');

            // Step 3: Verify emergency response
            await testHelper.waitForChatResponse();
            const response = testHelper.getLastChatResponse();
            expect(response).toContain('crisis' || 'hotline' || 'emergency');

            // Step 4: Verify emergency navigation trigger
            expect(testHelper.isElementVisible('#emergency-resources-modal')).toBe(true);
            
            // Step 5: Verify crisis resources display
            const crisisResources = testHelper.getAllElements('.crisis-resource');
            expect(crisisResources.length).toBeGreaterThan(0);
            expect(crisisResources[0].textContent).toContain('988' || 'crisis' || 'hotline');

            // Step 6: Verify emergency voice response
            await testHelper.clickElement('#emergency-voice-response');
            
            const voiceRequest = mockServer.getLastRequest('/api/voice/generate');
            expect(voiceRequest.body.emergencyMode).toBe(true);
            expect(voiceRequest.body.voice_settings.stability).toBe(1.0);

            // Step 7: Verify emergency logging
            const emergencyLog = mockServer.getLastRequest('/api/emergency/log');
            expect(emergencyLog).toBeDefined();
            expect(emergencyLog.body.userId).toBeDefined();
            expect(emergencyLog.body.timestamp).toBeDefined();
        });

        test('Multi-device synchronization workflow', async () => {
            const userId = 'sync_test_user';
            await testHelper.setupAuthenticatedUser('regulator', { id: userId });

            // Step 1: User makes changes on device 1
            await testHelper.navigateTo('/vera.html');
            await testHelper.sendChatMessage('Device 1 message');
            await testHelper.addJournalEntry({
                content: 'Device 1 journal entry',
                mood: 4
            });

            // Step 2: Verify sync API calls
            const syncRequest = mockServer.getLastRequest('/api/sync/update');
            expect(syncRequest.body.userId).toBe(userId);
            expect(syncRequest.body.data.chatHistory).toBeDefined();
            expect(syncRequest.body.data.journalEntries).toBeDefined();

            // Step 3: Simulate device 2 login
            await testHelper.clearLocalStorage();
            await testHelper.setupAuthenticatedUser('regulator', { id: userId });
            await testHelper.navigateTo('/vera.html');

            // Step 4: Verify data sync on new device
            const pullRequest = mockServer.getLastRequest('/api/sync/pull');
            expect(pullRequest.body.userId).toBe(userId);

            // Step 5: Verify local data restoration
            await testHelper.waitForSync();
            const chatHistory = testHelper.getLocalStorageItem('veraChatHistory');
            const journalData = testHelper.getLocalStorageItem('veraNSJournal');
            
            expect(chatHistory.messages).toContain('Device 1 message');
            expect(journalData.entries[0].content).toBe('Device 1 journal entry');

            // Step 6: Test conflict resolution
            await testHelper.simulateOfflineChanges({
                chatMessage: 'Offline message',
                journalEntry: 'Offline journal'
            });

            await testHelper.goOnline();
            
            // Verify conflict resolution
            const conflictRequest = mockServer.getLastRequest('/api/sync/resolve');
            expect(conflictRequest.body.conflicts).toBeDefined();
            expect(conflictRequest.body.resolution).toBe('merge');
        });
    });

    // ==================== PERFORMANCE INTEGRATION TESTS ====================
    
    describe('Performance Integration Tests', () => {
        
        test('Concurrent user operations', async () => {
            const userCount = 5;
            const userPromises = [];

            // Step 1: Setup multiple concurrent users
            for (let i = 0; i < userCount; i++) {
                userPromises.push(testHelper.setupConcurrentUser({
                    id: `concurrent_user_${i}`,
                    tier: 'regulator'
                }));
            }

            await Promise.all(userPromises);

            // Step 2: Execute concurrent operations
            const operationPromises = userPromises.map(async (_, index) => {
                await testHelper.switchToUser(index);
                
                return Promise.all([
                    testHelper.sendChatMessage(`Concurrent message ${index}`),
                    testHelper.addJournalEntry({
                        content: `Concurrent journal ${index}`,
                        mood: (index % 5) + 1
                    }),
                    testHelper.generateVoiceResponse(`Voice test ${index}`)
                ]);
            });

            // Step 3: Verify all operations complete successfully
            const results = await Promise.all(operationPromises);
            expect(results).toHaveLength(userCount);
            
            // Step 4: Verify no data corruption
            for (let i = 0; i < userCount; i++) {
                await testHelper.switchToUser(i);
                const userData = testHelper.getUserData();
                expect(userData.chatHistory.messages).toContain(`Concurrent message ${i}`);
                expect(userData.journalEntries[0].content).toBe(`Concurrent journal ${i}`);
            }

            // Step 5: Verify system performance metrics
            const performanceMetrics = mockServer.getPerformanceMetrics();
            expect(performanceMetrics.averageResponseTime).toBeLessThan(2000); // 2 seconds
            expect(performanceMetrics.errorRate).toBeLessThan(0.01); // < 1%
        });
    });
});

// ==================== ASYNCHRONOUS OPERATION TESTS ====================

describe('VERA Asynchronous Operations Integration', () => {
    
    test('Voice generation with chat response flow', async () => {
        await testHelper.setupAuthenticatedUser('integrator');
        await testHelper.navigateTo('/vera.html');

        // Step 1: Send message that triggers voice generation
        const messagePromise = testHelper.sendChatMessage('I need calming guidance');
        const voicePromise = testHelper.waitForVoiceGeneration();

        // Step 2: Verify parallel processing
        const [chatResponse, voiceAudio] = await Promise.all([messagePromise, voicePromise]);
        
        expect(chatResponse).toBeTruthy();
        expect(voiceAudio).toBeTruthy();

        // Step 3: Verify timing optimization
        const timing = testHelper.getLastOperationTiming();
        expect(timing.voiceGenerationStart).toBeLessThan(timing.chatResponseComplete + 100);
    });

    test('Background sync during active usage', async () => {
        await testHelper.setupAuthenticatedUser('regulator');
        await testHelper.navigateTo('/vera.html');

        // Step 1: Start background sync
        const syncPromise = testHelper.startBackgroundSync();

        // Step 2: Perform foreground operations
        await testHelper.sendChatMessage('Testing during sync');
        await testHelper.addJournalEntry({ content: 'Sync test', mood: 3 });

        // Step 3: Verify operations complete while syncing
        const foregroundResults = await testHelper.waitForForegroundOperations();
        expect(foregroundResults.chatSent).toBe(true);
        expect(foregroundResults.journalSaved).toBe(true);

        // Step 4: Verify sync completes successfully
        await syncPromise;
        const syncResult = testHelper.getLastSyncResult();
        expect(syncResult.success).toBe(true);
        expect(syncResult.conflicts).toBe(0);
    });
});

export default describe;
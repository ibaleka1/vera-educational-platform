/**
 * VERA End-to-End Tests - Complete System Testing
 * Tests from UI to database with complete business processes and cross-system interactions
 */

import { VERATestHelper } from '../helpers/vera-test-helper.js';
import { VERATestData } from '../helpers/vera-test-data.js';

describe('VERA End-to-End Tests Suite', () => {

    let testHelper;
    let testData;
    let browser;
    let page;
    
    beforeAll(async () => {
        testHelper = new VERATestHelper();
        testData = new VERATestData();
        
        // Launch browser for E2E testing
        browser = await testHelper.launchBrowser({
            headless: process.env.CI === 'true',
            viewport: { width: 1920, height: 1080 },
            deviceScaleFactor: 1
        });
        
        page = await browser.newPage();
        await testHelper.setupInterceptors(page);
    });

    afterAll(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        await testHelper.resetE2EEnvironment();
        await page.goto('http://localhost:3000');
    });

    // ==================== COMPLETE USER JOURNEY E2E TESTS ====================
    
    describe('Complete User Journey - New User to Advanced Usage', () => {
        
        test('New user complete onboarding and feature exploration', async () => {
            // ===== LANDING AND SIGNUP =====
            
            // Step 1: User arrives at landing page
            await page.waitForSelector('#landing-hero');
            expect(await page.title()).toContain('VERA');
            
            // Step 2: User explores landing content
            await page.click('#learn-more-btn');
            await page.waitForSelector('#methodology-section');
            
            const methodologyVisible = await page.isVisible('#nervous-system-explanation');
            expect(methodologyVisible).toBe(true);
            
            // Step 3: User decides to sign up
            await page.click('#get-started-btn');
            await page.waitForSelector('#signup-form');
            
            // Step 4: User completes signup form
            const signupData = testData.generateNewUser();
            await page.fill('#signup-name', signupData.name);
            await page.fill('#signup-email', signupData.email);
            await page.fill('#signup-password', signupData.password);
            await page.check('#terms-agreement');
            
            // Step 5: Submit signup and verify API flow
            const signupRequestPromise = page.waitForRequest('**/api/auth/signup');
            await page.click('#signup-submit');
            
            const signupRequest = await signupRequestPromise;
            const signupBody = signupRequest.postDataJSON();
            expect(signupBody.name).toBe(signupData.name);
            
            // ===== ONBOARDING FLOW =====
            
            // Step 6: Complete nervous system assessment
            await page.waitForSelector('#ns-assessment-form');
            
            const assessmentData = testData.getNSAssessmentData();
            await page.selectOption('#stress-level', assessmentData.stressLevel);
            await page.selectOption('#activation-level', assessmentData.activationLevel);
            await page.fill('#current-challenges', assessmentData.challenges);
            await page.click('#assessment-submit');
            
            // Step 7: Verify personalized recommendations
            await page.waitForSelector('#personalized-recommendations');
            const recommendations = await page.$$('.recommendation-card');
            expect(recommendations.length).toBeGreaterThan(0);
            
            // Step 8: User selects initial practices
            await page.click('.recommendation-card:first-child .select-practice');
            await page.click('#continue-to-app');
            
            // ===== FIRST APP EXPERIENCE =====
            
            // Step 9: Verify app interface loads
            await page.waitForSelector('#vera-app-interface');
            expect(await page.url()).toContain('/vera.html');
            
            // Step 10: User explores dashboard
            const welcomeMessage = await page.textContent('#welcome-message');
            expect(welcomeMessage).toContain(signupData.name);
            
            // Step 11: User tries first breathing exercise
            await page.click('#breathing-practices-nav');
            await page.waitForSelector('#breathing-practices-grid');
            
            await page.click('#breathing-box-card');
            await page.waitForSelector('#breathing-box-interface');
            
            // Step 12: Complete breathing session
            await page.click('#start-breathing-session');
            await page.waitForSelector('#breathing-animation', { timeout: 10000 });
            
            // Wait for session completion
            await page.waitForSelector('#session-complete-modal', { timeout: 60000 });
            const sessionFeedback = await page.textContent('#session-feedback');
            expect(sessionFeedback).toContain('completed');
            
            await page.click('#save-session-data');
            
            // ===== FIRST CHAT INTERACTION =====
            
            // Step 13: User initiates chat
            await page.click('#chat-nav');
            await page.waitForSelector('#chat-interface');
            
            const firstMessage = 'I just completed my first breathing session and feel more calm';
            await page.fill('#chat-input', firstMessage);
            
            const chatRequestPromise = page.waitForRequest('**/api/chat');
            await page.click('#send-chat-btn');
            
            // Step 14: Verify chat API integration
            const chatRequest = await chatRequestPromise;
            const chatBody = chatRequest.postDataJSON();
            expect(chatBody.message).toBe(firstMessage);
            expect(chatBody.userContext.recentActivities).toContain('breathing-box');
            
            // Step 15: Verify AI response
            await page.waitForSelector('.chat-response:last-child');
            const aiResponse = await page.textContent('.chat-response:last-child .response-text');
            expect(aiResponse).toBeTruthy();
            expect(aiResponse.length).toBeGreaterThan(10);
            
            // ===== VOICE FEATURE EXPLORATION =====
            
            // Step 16: User tries voice response
            await page.click('.chat-response:last-child .voice-response-btn');
            
            const voiceRequestPromise = page.waitForRequest('**/api/voice/generate');
            const voiceRequest = await voiceRequestPromise;
            expect(voiceRequest.postDataJSON().text).toBe(aiResponse);
            
            // Step 17: Verify audio playback
            await page.waitForSelector('#chat-audio');
            const audioSrc = await page.getAttribute('#chat-audio', 'src');
            expect(audioSrc).toBeTruthy();
            
            // ===== JOURNAL EXPLORATION =====
            
            // Step 18: User creates journal entry
            await page.click('#journal-nav');
            await page.waitForSelector('#journal-interface');
            
            await page.click('#new-journal-entry');
            await page.waitForSelector('#journal-entry-form');
            
            const journalEntry = testData.getJournalEntryData();
            await page.fill('#journal-content', journalEntry.content);
            await page.selectOption('#mood-rating', journalEntry.mood.toString());
            await page.selectOption('#ns-state', journalEntry.nervousSystemState);
            
            await page.click('#save-journal-entry');
            
            // Step 19: Verify journal saved and analyzed
            await page.waitForSelector('.journal-entry-card');
            const savedEntry = await page.textContent('.journal-entry-card .entry-content');
            expect(savedEntry).toContain(journalEntry.content);
            
            // ===== TRIAL STATUS AND UPGRADE FLOW =====
            
            // Step 20: Check trial status
            await page.click('#account-nav');
            await page.waitForSelector('#account-dashboard');
            
            const trialStatus = await page.textContent('#trial-status');
            expect(trialStatus).toContain('days remaining');
            
            // Step 21: User explores premium features
            await page.click('#explore-premium');
            await page.waitForSelector('#tier-comparison');
            
            // Step 22: User attempts premium feature
            await page.click('#breathing-practices-nav');
            await page.click('#breathing-voo-card'); // Premium feature
            
            await page.waitForSelector('#upgrade-prompt-modal');
            expect(await page.textContent('#upgrade-prompt-modal')).toContain('upgrade');
            
            // Step 23: User upgrades to regulator tier
            await page.click('#upgrade-to-regulator');
            await page.waitForSelector('#payment-form');
            
            const paymentData = testData.getTestPaymentData();
            await page.fill('#card-number', paymentData.cardNumber);
            await page.fill('#card-expiry', paymentData.expiry);
            await page.fill('#card-cvc', paymentData.cvc);
            
            const paymentRequestPromise = page.waitForRequest('**/api/payment/process');
            await page.click('#complete-payment');
            
            // Step 24: Verify payment processing
            const paymentRequest = await paymentRequestPromise;
            expect(paymentRequest.postDataJSON().tier).toBe('regulator');
            
            // Step 25: Verify subscription activation
            await page.waitForSelector('#payment-success-modal');
            await page.click('#continue-to-app');
            
            // Step 26: Verify premium feature access
            await page.click('#breathing-voo-card');
            await page.waitForSelector('#breathing-voo-interface'); // Should work now
            
            // ===== ADVANCED FEATURE USAGE =====
            
            // Step 27: User tries advanced chat features
            await page.click('#chat-nav');
            const advancedMessage = 'I want to explore my childhood trauma patterns';
            await page.fill('#chat-input', advancedMessage);
            await page.click('#send-chat-btn');
            
            // Step 28: Verify advanced adaptive responses
            await page.waitForSelector('.chat-response:last-child');
            const advancedResponse = await page.textContent('.chat-response:last-child .response-text');
            expect(advancedResponse).toContain('trauma' || 'pattern' || 'childhood');
            
            // Step 29: User accesses personalized insights
            await page.click('#insights-nav');
            await page.waitForSelector('#personalized-insights');
            
            const insights = await page.$$('.insight-card');
            expect(insights.length).toBeGreaterThan(0);
            
            // Step 30: Verify complete data persistence
            await page.reload();
            await page.waitForSelector('#vera-app-interface');
            
            // Check all data persists
            const userGreeting = await page.textContent('#welcome-message');
            expect(userGreeting).toContain(signupData.name);
            
            const subscription = await page.textContent('#subscription-status');
            expect(subscription).toContain('Regulator');
        });
    });

    // ==================== BUSINESS PROCESS E2E TESTS ====================
    
    describe('Complete Business Processes', () => {
        
        test('Subscription lifecycle management', async () => {
            // Step 1: User signs up and starts trial
            const userData = await testHelper.createE2EUser(page);
            
            // Step 2: User uses trial features
            await page.click('#chat-nav');
            for (let i = 1; i <= 5; i++) {
                await page.fill('#chat-input', `Trial message ${i}`);
                await page.click('#send-chat-btn');
                await page.waitForSelector('.chat-response:last-child');
            }
            
            // Step 3: Verify usage tracking
            const usageCount = await page.textContent('#usage-counter');
            expect(usageCount).toBe('5 / 10');
            
            // Step 4: Simulate trial nearing expiration
            await testHelper.setTrialDaysRemaining(page, 2);
            await page.reload();
            
            // Step 5: Verify expiration warnings
            await page.waitForSelector('#trial-warning-banner');
            const warningText = await page.textContent('#trial-warning-banner');
            expect(warningText).toContain('2 days');
            
            // Step 6: User upgrades before expiration
            await page.click('#upgrade-now-btn');
            await testHelper.completePaymentFlow(page, 'regulator');
            
            // Step 7: Verify subscription activation
            await page.waitForSelector('#subscription-active-confirmation');
            
            // Step 8: Simulate subscription cancellation
            await page.click('#account-nav');
            await page.click('#manage-subscription');
            await page.click('#cancel-subscription');
            
            // Step 9: Verify cancellation flow
            await page.waitForSelector('#cancellation-form');
            await page.selectOption('#cancellation-reason', 'financial');
            await page.click('#confirm-cancellation');
            
            // Step 10: Verify grace period handling
            const gracePeriod = await page.textContent('#grace-period-notice');
            expect(gracePeriod).toContain('access until');
            
            // Step 11: Simulate subscription reactivation
            await page.click('#reactivate-subscription');
            await testHelper.completePaymentFlow(page, 'regulator');
            
            // Step 12: Verify full access restoration
            const subscriptionStatus = await page.textContent('#subscription-status');
            expect(subscriptionStatus).toContain('Active');
        });

        test('Data export and import workflow', async () => {
            // Step 1: Create user with substantial data
            await testHelper.createE2EUser(page);
            
            // Generate test data
            await testHelper.generateTestData(page, {
                chatMessages: 20,
                journalEntries: 10,
                breathingSessions: 5,
                moodTracking: 15
            });
            
            // Step 2: User exports all data
            await page.click('#account-nav');
            await page.click('#data-export');
            await page.waitForSelector('#export-options');
            
            await page.check('#export-chat-history');
            await page.check('#export-journal-entries');
            await page.check('#export-session-data');
            await page.check('#export-mood-tracking');
            
            const downloadPromise = page.waitForEvent('download');
            await page.click('#start-export');
            
            // Step 3: Verify export file
            const download = await downloadPromise;
            expect(download.suggestedFilename()).toContain('vera-data-export');
            
            const exportPath = await download.path();
            const exportData = JSON.parse(await testHelper.readFile(exportPath));
            
            expect(exportData.chatHistory).toHaveLength(20);
            expect(exportData.journalEntries).toHaveLength(10);
            expect(exportData.breathingSessions).toHaveLength(5);
            
            // Step 4: User deletes account
            await page.click('#delete-account');
            await page.waitForSelector('#account-deletion-form');
            
            await page.fill('#deletion-confirmation', 'DELETE');
            await page.click('#confirm-account-deletion');
            
            // Step 5: Verify account deletion
            await page.waitForURL('**/account-deleted');
            
            // Step 6: User creates new account
            const newUserData = testData.generateNewUser();
            await testHelper.signUpUser(page, newUserData);
            
            // Step 7: User imports previous data
            await page.click('#account-nav');
            await page.click('#data-import');
            
            const fileChooser = await page.waitForEvent('filechooser');
            await fileChooser.setFiles(exportPath);
            
            await page.click('#start-import');
            await page.waitForSelector('#import-success');
            
            // Step 8: Verify data restoration
            await page.click('#chat-nav');
            const chatHistory = await page.$$('.chat-message');
            expect(chatHistory.length).toBeGreaterThan(15); // Some messages restored
            
            await page.click('#journal-nav');
            const journalEntries = await page.$$('.journal-entry-card');
            expect(journalEntries.length).toBeGreaterThan(5); // Some entries restored
        });
    });

    // ==================== CROSS-SYSTEM INTERACTION E2E TESTS ====================
    
    describe('Cross-System Interactions', () => {
        
        test('Real-time nervous system monitoring with adaptive responses', async () => {
            await testHelper.createE2EUser(page, 'integrator');
            
            // Step 1: Start nervous system monitoring
            await page.click('#ns-monitor-nav');
            await page.waitForSelector('#ns-monitor-interface');
            
            // Mock HRV device connection
            await testHelper.mockHRVDevice(page);
            await page.click('#connect-hrv-device');
            await page.waitForSelector('#device-connected');
            
            // Step 2: Simulate high stress reading
            await testHelper.simulateHRVReading(page, {
                heartRate: 95,
                hrv: 15, // Low HRV indicates stress
                coherence: 0.2
            });
            
            // Step 3: Verify automatic intervention
            await page.waitForSelector('#stress-intervention-modal');
            const interventionSuggestion = await page.textContent('#intervention-suggestion');
            expect(interventionSuggestion).toContain('breathing' || 'grounding');
            
            // Step 4: User follows suggestion
            await page.click('#start-suggested-practice');
            await page.waitForSelector('#guided-breathing-session');
            
            // Step 5: Monitor during practice
            await testHelper.simulateHRVReading(page, {
                heartRate: 85,
                hrv: 25,
                coherence: 0.6
            });
            
            // Step 6: Verify adaptive coaching
            await page.waitForSelector('#adaptive-coaching-update');
            const coaching = await page.textContent('#adaptive-coaching-update');
            expect(coaching).toContain('improving' || 'continue' || 'good');
            
            // Step 7: Complete session with improved metrics
            await testHelper.simulateHRVReading(page, {
                heartRate: 70,
                hrv: 45,
                coherence: 0.8
            });
            
            // Step 8: Verify session completion and data logging
            await page.waitForSelector('#session-improvement-summary');
            const improvement = await page.textContent('#session-improvement-summary');
            expect(improvement).toContain('HRV improved');
            
            // Step 9: Verify data integration with journal
            await page.click('#save-session-to-journal');
            await page.waitForSelector('#journal-auto-entry');
            
            const autoEntry = await page.textContent('#journal-auto-entry .entry-content');
            expect(autoEntry).toContain('nervous system session');
            expect(autoEntry).toContain('HRV');
        });

        test('Emergency crisis intervention system', async () => {
            await testHelper.createE2EUser(page, 'integrator');
            
            // Step 1: User sends crisis message
            await page.click('#chat-nav');
            const crisisMessage = 'I am having thoughts of self-harm and feel hopeless';
            await page.fill('#chat-input', crisisMessage);
            
            const emergencyRequestPromise = page.waitForRequest('**/api/emergency/detect');
            await page.click('#send-chat-btn');
            
            // Step 2: Verify emergency detection
            const emergencyRequest = await emergencyRequestPromise;
            expect(emergencyRequest.postDataJSON().emergencyLevel).toBe('high');
            
            // Step 3: Verify immediate crisis response
            await page.waitForSelector('#emergency-response-modal');
            const crisisResources = await page.$$('.crisis-resource');
            expect(crisisResources.length).toBeGreaterThan(2);
            
            // Step 4: Verify crisis hotline integration
            const crisisHotline = await page.textContent('.crisis-resource:first-child');
            expect(crisisHotline).toContain('988' || 'suicide' || 'crisis');
            
            // Step 5: User clicks for immediate help
            await page.click('#call-crisis-hotline');
            
            // Verify phone call initiation (mock)
            const phoneCall = await page.waitForSelector('#phone-call-initiated');
            expect(await page.textContent('#phone-call-initiated')).toContain('connecting');
            
            // Step 6: Verify safety plan activation
            await page.click('#activate-safety-plan');
            await page.waitForSelector('#safety-plan-interface');
            
            const safetySteps = await page.$$('.safety-plan-step');
            expect(safetySteps.length).toBeGreaterThan(3);
            
            // Step 7: Verify emergency contact notification
            await page.click('#notify-emergency-contact');
            await page.waitForSelector('#emergency-contact-form');
            
            await page.fill('#emergency-contact-phone', '+1234567890');
            await page.click('#send-emergency-notification');
            
            // Step 8: Verify professional referral system
            await page.click('#find-local-help');
            await page.waitForSelector('#local-resources-map');
            
            const localResources = await page.$$('.local-mental-health-resource');
            expect(localResources.length).toBeGreaterThan(0);
            
            // Step 9: Verify crisis follow-up system
            await testHelper.simulateTimeAdvance(page, 24 * 60 * 60 * 1000); // 24 hours
            await page.reload();
            
            await page.waitForSelector('#crisis-followup-modal');
            const followUpMessage = await page.textContent('#crisis-followup-modal');
            expect(followUpMessage).toContain('checking in');
            
            // Step 10: Verify crisis data logging for continuity
            await page.click('#account-nav');
            await page.click('#crisis-history');
            
            const crisisLog = await page.$('.crisis-intervention-log');
            expect(crisisLog).toBeTruthy();
        });
    });

    // ==================== DATA FLOW E2E TESTS ====================
    
    describe('Complete Data Flow Through All Layers', () => {
        
        test('User input to AI response to voice to biometric feedback loop', async () => {
            await testHelper.createE2EUser(page, 'integrator');
            
            // Setup biometric monitoring
            await testHelper.mockBiometricDevices(page);
            
            // Step 1: User input with emotional content
            await page.click('#chat-nav');
            const emotionalMessage = 'I feel overwhelmed with work stress and my chest feels tight';
            await page.fill('#chat-input', emotionalMessage);
            
            // Step 2: Capture initial biometric state
            const initialBiometrics = await testHelper.getBiometricReading(page);
            
            const chatRequestPromise = page.waitForRequest('**/api/chat');
            await page.click('#send-chat-btn');
            
            // Step 3: Verify AI processing with biometric context
            const chatRequest = await chatRequestPromise;
            const chatBody = chatRequest.postDataJSON();
            expect(chatBody.biometricContext.heartRate).toBe(initialBiometrics.heartRate);
            expect(chatBody.emotionalKeywords).toContain('overwhelmed');
            
            // Step 4: Verify adaptive AI response
            await page.waitForSelector('.chat-response:last-child');
            const aiResponse = await page.textContent('.chat-response:last-child .response-text');
            expect(aiResponse).toContain('chest' || 'breathing' || 'stress');
            
            // Step 5: Generate adaptive voice response
            await page.click('.chat-response:last-child .voice-response-btn');
            
            const voiceRequestPromise = page.waitForRequest('**/api/voice/generate');
            const voiceRequest = await voiceRequestPromise;
            
            // Verify voice adaptation to biometric state
            const voiceSettings = voiceRequest.postDataJSON().voice_settings;
            expect(voiceSettings.stability).toBeGreaterThan(0.7); // Calming voice for stress
            
            // Step 6: Play voice and monitor biometric response
            await page.waitForSelector('#chat-audio[src]');
            await page.click('#play-audio-btn');
            
            // Monitor biometrics during voice playback
            await testHelper.startBiometricMonitoring(page);
            
            // Step 7: Verify biometric improvement during voice
            await testHelper.waitForAudioCompletion(page);
            const postVoiceBiometrics = await testHelper.getBiometricReading(page);
            
            expect(postVoiceBiometrics.heartRate).toBeLessThan(initialBiometrics.heartRate);
            expect(postVoiceBiometrics.hrv).toBeGreaterThan(initialBiometrics.hrv);
            
            // Step 8: AI suggests follow-up based on biometric improvement
            await page.waitForSelector('#adaptive-followup-suggestion');
            const suggestion = await page.textContent('#adaptive-followup-suggestion');
            expect(suggestion).toContain('breathing' || 'continue' || 'practice');
            
            // Step 9: User follows suggestion and starts breathing exercise
            await page.click('#start-suggested-breathing');
            await page.waitForSelector('#breathing-session-with-biofeedback');
            
            // Step 10: Complete feedback loop with session data
            await testHelper.completeBiofeedbackBreathingSession(page);
            
            // Step 11: Verify complete data integration
            const sessionSummary = await page.textContent('#session-summary');
            expect(sessionSummary).toContain('heart rate variability');
            expect(sessionSummary).toContain('stress reduction');
            
            // Step 12: Verify data persistence across systems
            await page.click('#journal-nav');
            await page.waitForSelector('#auto-generated-entry');
            
            const journalEntry = await page.textContent('#auto-generated-entry .entry-content');
            expect(journalEntry).toContain('biometric');
            expect(journalEntry).toContain('improvement');
            
            // Step 13: Verify analytics and insights generation
            await page.click('#insights-nav');
            await page.waitForSelector('#biometric-trend-analysis');
            
            const trendAnalysis = await page.textContent('#biometric-trend-analysis');
            expect(trendAnalysis).toContain('stress response');
            expect(trendAnalysis).toContain('improvement pattern');
        });
    });

    // ==================== MOBILE RESPONSIVE E2E TESTS ====================
    
    describe('Mobile Responsive Experience', () => {
        
        test('Complete mobile user journey', async () => {
            // Step 1: Switch to mobile viewport
            await page.setViewportSize({ width: 375, height: 812 }); // iPhone X
            
            await testHelper.createE2EUser(page);
            
            // Step 2: Verify mobile interface adaptation
            await page.waitForSelector('#mobile-navigation');
            expect(await page.isVisible('#desktop-sidebar')).toBe(false);
            
            // Step 3: Mobile chat interaction
            await page.click('#mobile-chat-tab');
            await page.waitForSelector('#mobile-chat-interface');
            
            await page.fill('#mobile-chat-input', 'Mobile test message');
            await page.click('#mobile-send-btn');
            
            await page.waitForSelector('.mobile-chat-bubble');
            
            // Step 4: Mobile voice interaction
            await page.click('.mobile-voice-btn');
            await page.waitForSelector('#mobile-audio-player');
            
            // Step 5: Mobile breathing exercise
            await page.click('#mobile-breathing-tab');
            await page.waitForSelector('#mobile-breathing-grid');
            
            await page.click('.mobile-breathing-card:first-child');
            await page.waitForSelector('#mobile-breathing-interface');
            
            // Verify touch interactions
            await page.tap('#mobile-start-session');
            await page.waitForSelector('#mobile-breathing-animation');
            
            // Step 6: Mobile journal entry
            await page.click('#mobile-journal-tab');
            await page.click('#mobile-add-entry');
            
            await page.fill('#mobile-journal-textarea', 'Mobile journal entry');
            await page.selectOption('#mobile-mood-select', '4');
            await page.tap('#mobile-save-entry');
            
            // Step 7: Verify responsive data persistence
            await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop
            await page.reload();
            
            // Check data carries over to desktop
            await page.click('#chat-nav');
            const chatHistory = await page.$$('.chat-message');
            expect(chatHistory.length).toBeGreaterThan(0);
            
            await page.click('#journal-nav');
            const journalEntries = await page.$$('.journal-entry-card');
            expect(journalEntries.length).toBeGreaterThan(0);
        });
    });

    // ==================== ACCESSIBILITY E2E TESTS ====================
    
    describe('Accessibility Compliance', () => {
        
        test('Screen reader navigation and interaction', async () => {
            await testHelper.createE2EUser(page);
            
            // Step 1: Enable screen reader simulation
            await testHelper.enableScreenReaderMode(page);
            
            // Step 2: Navigate using keyboard only
            await page.keyboard.press('Tab'); // Focus first interactive element
            await page.keyboard.press('Enter'); // Activate
            
            // Step 3: Verify ARIA labels and descriptions
            const chatInput = await page.$('#chat-input');
            const ariaLabel = await chatInput.getAttribute('aria-label');
            expect(ariaLabel).toBeTruthy();
            
            // Step 4: Test voice response accessibility
            await page.fill('#chat-input', 'Accessibility test message');
            await page.keyboard.press('Enter');
            
            await page.waitForSelector('.chat-response:last-child');
            await page.keyboard.press('Tab'); // Navigate to voice button
            await page.keyboard.press('Enter'); // Activate voice
            
            // Step 5: Verify audio descriptions
            await page.waitForSelector('#audio-transcript');
            const transcript = await page.textContent('#audio-transcript');
            expect(transcript).toBeTruthy();
            
            // Step 6: Test high contrast mode
            await page.click('#accessibility-settings');
            await page.click('#high-contrast-toggle');
            
            // Verify high contrast applied
            const bodyClasses = await page.getAttribute('body', 'class');
            expect(bodyClasses).toContain('high-contrast');
            
            // Step 7: Test font size adjustment
            await page.click('#increase-font-size');
            const fontSize = await page.evaluate(() => {
                return window.getComputedStyle(document.body).fontSize;
            });
            expect(parseFloat(fontSize)).toBeGreaterThan(16);
        });
    });
});

export default describe;
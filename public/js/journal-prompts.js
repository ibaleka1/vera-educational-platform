// Eva Leka's nervous system journal prompts
const JOURNAL_PROMPTS = {
  body: [
    "Starting at the crown of your head, write what each part of your body is holding right now.",
    "If your nervous system could write you a letter, what would it say?",
    "Where in your body do you feel the most tension? Have a conversation with it.",
    "Your body remembers everything. What is it trying to tell you today?",
    "Scan from head to toe. What sensations are present without judgment?"
  ],
  
  abandonment: [
    "Write about a time someone left. Don't edit - let your body remember on paper.",
    "Where do you feel abandonment in your body right now? Map it with words.",
    "If your fear of being left could speak, what would it say?",
    "Complete this: 'When people leave, my body...'",
    "Write to the part of you that learned separation equals death."
  ],
  
  betrayal: [
    "Describe the moment you knew they were lying. What did your gut know first?",
    "Write the truth you weren't allowed to speak when it happened.",
    "Where does betrayal live in your body? Draw it with words.",
    "Your dopamine crashed when trust broke. Write to that biochemical betrayal.",
    "Complete this: 'I trusted you and...'",
  ],
  
  rage: [
    "Write about something that made you furious but you couldn't express it.",
    "If your anger could destroy something safely, what would it be?",
    "Complete this: 'I am furious that I had to...'",
    "Your rage is trying to burn away what violated you. What needs to burn?",
    "Write a letter to someone who will never read it. Say everything."
  ],
  
  grief: [
    "Write about something you lost that no one acknowledges as loss.",
    "What are you grieving that you haven't named yet?",
    "Write about the person you might have been without trauma.",
    "Complete this: 'I'm mourning...'",
    "Your grief has intelligence. What is it trying to teach you?"
  ],
  
  freeze: [
    "Write about a time you couldn't move when you needed to.",
    "Your freeze response saved you. Write it a thank you letter.",
    "Complete this: 'When I freeze, I...'",
    "Where does immobility live in your body? Describe its texture.",
    "Write about playing dead to survive."
  ],
  
  hypervigilance: [
    "Write about always scanning for threats. What are you protecting?",
    "Your nervous system is a security system. When did it go online?",
    "Complete this: 'I learned to watch for...'",
    "Write about never being able to fully relax.",
    "Your hypervigilance saved you then. Write about its intelligence."
  ],
  
  shame: [
    "Write about the voice that says 'you're bad, broken, wrong.'",
    "Complete this: 'I learned I was shameful when...'",
    "Write about carrying someone else's shame in your body.",
    "Your shame has a message. What is it trying to protect?",
    "Write a letter to your younger self who first felt this."
  ],
  
  boundaries: [
    "Write about the first time your boundaries were violated.",
    "Complete this: 'I learned I don't get to say no when...'",
    "Write about your body's wisdom around safe people.",
    "Your boundaries are your nervous system's intelligence. Honor them on paper.",
    "Write about reclaiming your right to say no."
  ],
  
  integration: [
    "Write about who you're becoming as you heal.",
    "Complete this: 'I'm no longer willing to...'",
    "Write about the difference between surviving and living.",
    "Your nervous system is updating its software. Document the changes.",
    "Write a letter from your future integrated self to you now."
  ]
};

class JournalController {
  constructor() {
    this.currentPrompts = [];
    this.currentCategory = 'body';
  }

  loadPrompt(category) {
    this.currentCategory = category;
    const prompts = JOURNAL_PROMPTS[category];
    
    if (!prompts) return;
    
    // Select random prompt from category
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    this.currentPrompts = prompts;
    
    // Update UI
    this.updatePromptDisplay(randomPrompt);
    this.updateActiveButton(category);
  }

  updatePromptDisplay(prompt) {
    const promptElement = document.getElementById('journalPrompt');
    if (promptElement) {
      promptElement.innerHTML = `
        <div class="prompt-header">
          <div class="prompt-icon">💭</div>
          <h3>Nervous System Prompt</h3>
        </div>
        <div class="prompt-text">${prompt}</div>
        <div class="prompt-footer">
          <small>Don't edit as you write. Let your body speak through your hands.</small>
        </div>
      `;
    }
  }

  updateActiveButton(category) {
    document.querySelectorAll('.prompt-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    const buttons = document.querySelectorAll('.prompt-btn');
    buttons.forEach(btn => {
      if (btn.textContent.toLowerCase().includes(category.toLowerCase())) {
        btn.classList.add('active');
      }
    });
  }

  getNewPrompt() {
    if (this.currentPrompts.length === 0) return;
    
    const randomPrompt = this.currentPrompts[Math.floor(Math.random() * this.currentPrompts.length)];
    this.updatePromptDisplay(randomPrompt);
  }

  saveJournal() {
    const entry = document.getElementById('journalEntry');
    if (!entry || !entry.value.trim()) {
      this.showFeedback('Your nervous system wants to speak. Try writing something first.', 'gentle');
      return;
    }

    const entryData = {
      content: entry.value,
      category: this.currentCategory,
      timestamp: new Date().toISOString(),
      wordCount: entry.value.trim().split(' ').length
    };

    // Save to localStorage
    const savedEntries = JSON.parse(localStorage.getItem('veraJournalEntries') || '[]');
    savedEntries.push(entryData);
    localStorage.setItem('veraJournalEntries', JSON.stringify(savedEntries));

    // Clear the textarea
    entry.value = '';
    
    // Show success feedback
    this.showFeedback('Your nervous system wisdom has been saved. Well done.', 'success');
    
    // Load new prompt
    setTimeout(() => {
      this.getNewPrompt();
    }, 2000);
  }

  clearJournal() {
    const entry = document.getElementById('journalEntry');
    if (entry) {
      entry.value = '';
      entry.focus();
    }
  }

  showFeedback(message, type = 'info') {
    let feedback = document.getElementById('journalFeedback');
    
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.id = 'journalFeedback';
      feedback.className = 'journal-feedback';
      
      const container = document.querySelector('.journal-container');
      if (container) {
        container.appendChild(feedback);
      }
    }

    feedback.className = `journal-feedback ${type}`;
    feedback.textContent = message;
    feedback.style.display = 'block';

    setTimeout(() => {
      feedback.style.display = 'none';
    }, 3000);
  }

  exportEntries() {
    const savedEntries = JSON.parse(localStorage.getItem('veraJournalEntries') || '[]');
    
    if (savedEntries.length === 0) {
      this.showFeedback('No entries to export yet. Your nervous system is waiting to speak.', 'gentle');
      return;
    }

    const exportData = {
      exported: new Date().toISOString(),
      totalEntries: savedEntries.length,
      entries: savedEntries
    };

    // Create download link
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `vera-journal-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    this.showFeedback('Your nervous system wisdom has been exported safely.', 'success');
  }
}

// Global journal controller
window.journalController = new JournalController();

// Global functions for HTML
function loadPrompt(category) {
  window.journalController.loadPrompt(category);
}

function saveJournal() {
  window.journalController.saveJournal();
}

function clearJournal() {
  window.journalController.clearJournal();
}

function getNewPrompt() {
  window.journalController.getNewPrompt();
}

// Initialize with body scan prompt
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('journalPrompt')) {
    window.journalController.loadPrompt('body');
  }
  
  // Add keyboard shortcut for saving (Ctrl/Cmd + S)
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      if (document.getElementById('journalEntry') && document.activeElement.id === 'journalEntry') {
        saveJournal();
      }
    }
  });
});
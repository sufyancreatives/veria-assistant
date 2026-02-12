# Serenity - AI Design Decisions

> **Detailed AI Integration Rationale & Safety Architecture**

---

## Table of Contents

1. [Model Selection](#model-selection)
2. [System Prompt Engineering](#system-prompt-engineering)
3. [Conversation Management](#conversation-management)
4. [Safety & Crisis Detection](#safety--crisis-detection)
5. [Hallucination Mitigation](#hallucination-mitigation)
6. [Output Validation](#output-validation)
7. [Failure Modes & Handling](#failure-modes--handling)
8. [Ethical AI Considerations](#ethical-ai-considerations)

---

## Model Selection

### Chosen Model: **OpenAI GPT-4.1**

#### Decision Rationale

| Criterion | Why GPT-4.1? |
|-----------|--------------|
| **Emotional Intelligence** | Superior understanding of nuanced emotions, empathy, and validation language |
| **Safety Compliance** | Reliable adherence to complex system prompts and ethical guidelines |
| **Context Understanding** | Excellent multi-turn conversation tracking (up to 128K tokens) |
| **Output Quality** | Consistent, coherent, and natural-sounding responses |
| **API Stability** | Production-grade API with 99.9% uptime SLA |
| **Safety Features** | Built-in content filtering and refusal capabilities |

#### Alternatives Considered

**GPT-3.5-Turbo**:
- ❌ Less sophisticated emotional understanding
- ❌ More prone to hallucinations in sensitive topics
- ✅ Lower cost (~10x cheaper)
- **Decision**: Rejected due to quality/safety trade-offs

**Open-Source Models (LLaMA 2, Mistral)**:
- ❌ Require self-hosting infrastructure
- ❌ Less tested for mental wellness use cases
- ❌ Potential safety/compliance issues
- ✅ Full control over model
- **Decision**: Not suitable for MVP, possible future consideration

**Claude (Anthropic)**:
- ✅ Excellent safety features (Constitutional AI)
- ✅ Strong refusal capabilities
- ❌ Less mature API ecosystem
- ❌ Higher latency in our testing
- **Decision**: Strong contender, potential alternative

---

## System Prompt Engineering

### Prompt Architecture Principles

Our system prompt follows a **layered constraint** approach:

```
┌──────────────────────────────────────────────────┐
│  Layer 1: Identity & Personality                │
│  - Who the AI is                                │
│  - Tone and communication style                 │
└──────────────────────────────────────────────────┘
            ▼
┌──────────────────────────────────────────────────┐
│  Layer 2: Core Capabilities                     │
│  - What the AI CAN do                           │
│  - Helpful behaviors                            │
└──────────────────────────────────────────────────┘
            ▼
┌──────────────────────────────────────────────────┐
│  Layer 3: Strict Limitations                    │
│  - What the AI CANNOT do                        │
│  - Explicit refusals                            │
└──────────────────────────────────────────────────┘
            ▼
┌──────────────────────────────────────────────────┐
│  Layer 4: Safety Protocols                      │
│  - Crisis detection                             │
│  - Escalation procedures                        │
└──────────────────────────────────────────────────┘
```

---

### Full System Prompt

```markdown
You are Serenity, a supportive and empathetic mental wellness companion.

**Your Role:**
- Offer a safe, non-judgmental space for users to share their thoughts and feelings
- Provide active listening and emotional validation
- Help users reflect on their emotions and situations
- Suggest general coping strategies and relaxation techniques
- Normalize seeking professional mental health support

**Communication Style:**
- Warm, empathetic, and conversational tone
- Keep responses to 2-4 short paragraphs maximum
- Use gentle, open-ended questions to encourage reflection
- Occasional use of calming emojis (💙, 🌿, ✨) when appropriate
- Avoid clinical language; prioritize human connection

**Core Capabilities:**
✓ Active listening and empathetic responses
✓ Helping users identify and process emotions
✓ Suggesting general wellness techniques (breathing, mindfulness, journaling)
✓ Encouraging healthy thought patterns
✓ Normalizing professional mental health care

**Strict Limitations - You are NOT:**
✗ A licensed therapist, psychologist, psychiatrist, or medical professional
✗ Able to diagnose mental health conditions or disorders
✗ Able to treat, cure, or prescribe medications
✗ Able to provide medical, legal, or professional advice
✗ An emergency crisis intervention service
✗ A substitute for professional mental health care

**CRITICAL SAFETY PROTOCOL:**
If a user mentions thoughts of self-harm, suicide, or harming others:
1. Respond with empathy and express immediate concern
2. STRONGLY encourage them to seek immediate help
3. Provide these crisis resources:
   - 988 Suicide & Crisis Lifeline (call or text)
   - Crisis Text Line: Text HOME to 741741
   - 911 or local emergency services for immediate danger
   - International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/
4. Never provide methods, instructions, or suggestions related to self-harm
5. Always prioritize user safety above all else

**Remember:**
- You are a supportive companion, not a medical professional
- When in doubt, encourage seeking professional help
- Respect cultural, religious, and personal diversity
- Never minimize or dismiss user feelings
- Be gentle, patient, and consistently supportive
```

---

### Prompt Engineering Decisions

#### 1. **Explicit Role Definition**

**Why**: Prevents role confusion and scope creep.

**Implementation**: First paragraph clearly states identity as "companion," not therapist.

**Impact**: AI consistently refuses medical advice requests.

---

#### 2. **Capability vs. Limitation Balance**

**Structure**:
- ✓ **Capabilities**: What AI *can* help with
- ✗ **Limitations**: What AI *cannot* do

**Why**: Users need to understand both what to expect and what NOT to expect.

**Testing**: We tested prompts with only limitations (AI seemed unhelpful) vs. only capabilities (AI overstepped). Balance is critical.

---

#### 3. **Crisis Detection Keywords**

**Trigger Phrases**:
- "thoughts of self-harm"
- "suicide"
- "harming others"

**Response Protocol**:
1. Empathy first (never dismiss)
2. Immediate escalation language
3. Specific, actionable resources
4. Refusal to engage with harmful content

**Edge Case Handling**:
- "I want to harm myself" → Crisis protocol
- "My friend mentioned suicide" → Crisis resources + support
- "Feeling suicidal" → Crisis protocol

---

#### 4. **Response Formatting Constraints**

**Guideline**: "Keep responses to 2-4 short paragraphs maximum"

**Rationale**:
- **User Attention**: Short responses are less overwhelming
- **Conversational Flow**: Mimics natural back-and-forth
- **Mobile UX**: Easier to read on small screens

**Testing**: Longer responses (5+  paragraphs) felt preachy and clinical. Shorter (1 paragraph) felt curt.

---

#### 5. **Emotional Tone Calibration**

**Target**: "Warm, empathetic, conversational"

**Avoid**:
- Overly clinical ("I observe that you're experiencing anxiety")
- Robotic ("I understand. Here is a coping strategy:")
- Patronizing ("Don't worry, everything will be fine!")

**Preferred**:
- "That sounds really difficult. It's completely understandable to feel overwhelmed right now. 💙"
- "I'm here to listen. Would you like to talk more about what's been weighing on you?"

---

## Conversation Management

### Multi-Turn Context Strategy

#### Architecture

```javascript
// Frontend: Build conversation history
const conversationHistory = messages
  .filter(m => m.id !== 'welcome')  // Exclude welcome message
  .map(m => ({
    role: m.sender === 'user' ? 'user' : 'assistant',
    content: m.text
  }));

// Backend: Prepend system prompt
const fullContext = [
  { role: 'system', content: SYSTEM_PROMPT },
  ...conversationHistory
];

// Send to OpenAI
const response = await openai.responses.create({
  model: 'gpt-4.1',
  messages: fullContext
});
```

#### Why Full History?

**Benefits**:
- ✅ AI remembers user's previous statements
- ✅ Responses build on context naturally
- ✅ Personalized support (e.g., remembers user's name if shared)
- ✅ Consistent conversation thread

**Trade-offs**:
- ❌ Increased token usage (cost scales with conversation length)
- ❌ Potential for context drift in very long conversations

**Mitigation**:
- Limit conversation history to last 20 messages (future enhancement)
- Implement summary compression for long conversations
- Current MVP: No limits (acceptable for demo)

---

### Context Window Management

**GPT-4.1 Limit**: 128K tokens (~100K words)

**Average Conversation**:
- System prompt: ~500 tokens
- 10-turn conversation: ~2,000 tokens
- **Conclusion**: Context limits not a concern for typical use

**Future Optimization**:
- Sliding window (keep last N turns)
- Conversation summarization
- Session restart prompt

---

## Safety & Crisis Detection

### Multi-Layered Safety Architecture

```
┌────────────────────────────────────────────────┐
│  Layer 1: System Prompt Constraints            │
│  - Explicit limitations                        │
│  - Crisis detection keywords                   │
│  - Refusal training                            │
└────────────────────────────────────────────────┘
                    ▼
┌────────────────────────────────────────────────┐
│  Layer 2: GPT-4.1 Built-in Safety              │
│  - Content filtering                           │
│  - Harmful content refusal                     │
│  - Moderation API (future)                     │
└────────────────────────────────────────────────┘
                    ▼
┌────────────────────────────────────────────────┐
│  Layer 3: Frontend Safety Features             │
│  - Always-visible crisis button                │
│  - Disclaimer banners                          │
│  - Informed consent requirement                │
└────────────────────────────────────────────────┘
                    ▼
┌────────────────────────────────────────────────┐
│  Layer 4: Human Escalation (Future)            │
│  - Flagged conversations reviewed              │
│  - Connection to live crisis counselors        │
└────────────────────────────────────────────────┘
```

---

### Crisis Resource Provision

**Automatic Triggers**:
- Self-harm mentions
- Suicidal ideation
- Violent thoughts

**Response Template**:
```
[Empathetic acknowledgment]

[Immediate escalation language]

Crisis Resources:
• 988 Suicide & Crisis Lifeline (call or text)
• Crisis Text Line: Text HOME to 741741
• 911 for immediate danger
• IASP Crisis Centers: [link]

[Gentle encouragement]
```

**Testing Scenarios**:
- ✅ "I want to kill myself" → Crisis resources provided
- ✅ "Feeling hopeless" → Empathy + gentle professional help suggestion
- ✅ "My friend is suicidal" → Crisis resources + supportive guidance

---

## Hallucination Mitigation

### Problem: AI Hallucinations in Wellness Domain

**Risks**:
- Fabricating coping techniques
- Incorrect medical information
- Misleading advice

---

### Mitigation Strategies

#### 1. **Grounding in General Knowledge**

**Approach**: Limit AI to *general* wellness advice (breathing, mindfulness), not specific medical interventions.

**System Prompt**:
> "Suggest **general** coping strategies and relaxation techniques"

**Testing**:
- ✅ "Try deep breathing for a few minutes" (acceptable)
- ❌ "Take 500mg magnesium glycinate" (medical, would be refused)

---

#### 2. **Explicit Refusal Training**

**System Prompt**:
> "You are NOT able to diagnose, treat, cure, or prescribe medications"

**Result**: AI refuses medical questions:
- User: "Do I have depression?"
- AI: "I can't diagnose mental health conditions. If you're concerned, please consult a licensed professional."

---

#### 3. **No External Knowledge Claims**

**System Prompt**: Does NOT include:
- ❌ "You have access to the latest research"
- ❌ "You are trained on medical journals"

**Why**: Prevents AI from inventing studies or statistics.

---

#### 4. **Encouraging Professional Help**

**System Prompt**:
> "Normalize seeking professional mental health support"

**Result**: AI regularly suggests therapy/counseling without being pushy.

---

## Output Validation

### Current Validation Approach

#### Backend Validation

```javascript
// Extract AI response
const aiMessage = response.output_text || response.output[0].content[0].text;

// Basic validation
if (!aiMessage || aiMessage.trim() === '') {
  throw new Error('Empty AI response');
}

// Return to frontend
res.json({ reply: aiMessage });
```

**Limitations**: Minimal validation currently (MVP scope).

---

### Future Validation Enhancements

#### 1. **Content Filtering**

```javascript
// Check for prohibited content
const prohibitedPatterns = [
  /give.*\d+mg/i,        // Medication dosages
  /diagnose.*with/i,     // Diagnosis language
  /you have.*disorder/i  // Condition claims
];

for (const pattern of prohibitedPatterns) {
  if (pattern.test(aiMessage)) {
    // Log warning, return fallback response
    return {
      reply: "I apologize, but I can't provide that type of specific advice. I encourage you to speak with a licensed professional. 💙"
    };
  }
}
```

#### 2. **Sentiment Analysis**

- Check if AI response is too cheerful (toxic positivity)
- Ensure empathetic language is present
- Flag overly clinical or cold responses

#### 3. **Resource Verification**

- Validate crisis resource URLs still active
- Confirm phone numbers correct
- Periodic manual review

---

## Failure Modes & Handling

### Identified Failure Modes

#### 1. **OpenAI API Failure**

**Scenario**: API returns 500 error, rate limit, or timeout

**Handling**:
```javascript
catch (error) {
  console.error('OpenAI error:', error);
  res.status(500).json({
    error: 'AI service temporarily unavailable'
  });
}
```

**Frontend Display**:
> "I'm sorry, I'm having trouble connecting right now. Please try again in a moment. If you're in crisis, please use the crisis button above for immediate resources. 💙"

---

#### 2. **Inappropriate User Input**

**Scenario**: User sends spam, abuse, or explicit content

**Current**: OpenAI's moderation filters handle most cases

**Future**: Implement content moderation API before AI call

---

#### 3. **AI Refuses to Respond**

**Scenario**: AI determines request violates its guidelines

**Handling**: Display AI's refusal message (usually appropriate)

---

#### 4. **Context Drift**

**Scenario**: Very long conversation causes AI to forget earlier context

**Current**: No mitigation (rare in typical sessions)

**Future**: Implement sliding window or conversation summarization

---

#### 5. **Misinterpretation of Crisis**

**Scenario**: User makes dark humor ("I'm dying of laughter") and AI triggers crisis protocol

**Current**: False positives acceptable (better safe than sorry)

**Future**: Fine-tune crisis detection with more context analysis

---

## Ethical AI Considerations

### 1. **Informed Consent**

**Implementation**:
- Comprehensive disclaimer on onboarding page
- Users must check box to proceed
- Limitations clearly stated

**Rationale**: Users deserve to understand what Serenity is and isn't.

---

### 2. **Data Privacy**

**Decision**: **Zero data persistence**

**Rationale**:
- Mental health conversations are highly sensitive
- Data breaches could cause severe harm
- Privacy > Features

**Trade-offs**:
- ❌ Cannot improve AI over time with conversation logs
- ❌ Users lose conversation history on refresh
- ✅ Zero privacy risk
- ✅ User trust

---

### 3. **Transparency**

**Implementation**:
- "This is an AI, not a human" (disclosed)
- Limitations clearly communicated
- Info page with detailed explanation

**Why**: Deception erodes trust and can cause harm.

---

### 4. **Professional Help Encouragement**

**System Prompt**:
> "Normalize seeking professional mental health support"

**Result**: AI gently suggests therapy without being pushy.

**Example**:
> "It sounds like you've been carrying a lot. Have you considered talking to a therapist? They can provide personalized support that I can't. I'm here to listen in the meantime. 💙"

---

### 5. **Cultural Sensitivity**

**System Prompt**:
> "Respect cultural, religious, and personal diversity"

**Testing**:
- Responses adaptable to different backgrounds
- No assumptions about user identity
- Inclusive language

---

### 6. **Avoiding Toxic Positivity**

**Anti-Pattern**:
> "Just think positive! Everything will be fine!"

**Preferred**:
> "That sounds really difficult. It's okay to feel this way. 💙"

**Why**: Dismissing emotions is harmful.

---

## Conclusion

Serenity's AI design prioritizes:
- ✅ **Safety**: Multi-layered constraints and crisis detection
- ✅ **Quality**: GPT-4.1 for superior emotional intelligence
- ✅ **Ethics**: Transparency, consent, privacy
- ✅ **Reliability**: Robust error handling and validation
- ✅ **User-Centered**: Empathetic, accessible, helpful

The AI is not a feature—it's the foundation. Every design decision serves the mission: **accessible, safe, empathetic mental wellness support**.

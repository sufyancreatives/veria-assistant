# Demo Script - 5 Minute Walkthrough

> **Serenity AI Hackathon Demo**

---

## Pre-Demo Setup (1 minute before)

- [ ] Both servers running (frontend & backend)
- [ ] Browser open to `http://localhost:5173`
- [ ] Clear browser cache/start fresh session
- [ ] Close unnecessary tabs
- [ ] Disable browser extensions that might interfere
- [ ] Have crisis button ready to demonstrate

**Time Limit**: 5 minutes total

---

## Script Timeline

| Section | Duration | Content |
|---------|----------|---------|
| Introduction | 30s | Problem + Solution |
| Onboarding | 30s | UX walkthrough |
| Chat Demo | 2m | Normal + crisis conversation |
| Features Highlight | 1m | UI/UX innovations |
| Architecture | 30s | Technical overview |
| Q&A Setup | 30s | Closing statement |

---

## 1. Introduction (30 seconds)

### Say:
> "Hi, I'm presenting **Serenity** - an AI-powered mental wellness companion that provides 24/7 empathetic emotional support. The problem we're solving is simple: **57% of adults with mental illness receive no treatment**, often due to cost, wait times, or availability. Serenity provides immediate, accessible support while encouraging professional help-seeking. Let me show you."

### Actions:
- Show landing page (onboarding)
- Mouse movement shows 3D particles and custom cursor

**Key Points**:
- ✅ Problem stated clearly
- ✅ Solution introduced
- ✅ Visual effects visible immediately

---

## 2. Onboarding Experience (30 seconds)

### Say:
> "Users first see our mission and key features. Notice the 3D particle background and custom cursor - these create a calming, premium atmosphere. Most importantly, we have a comprehensive disclaimer and consent requirement. Users must acknowledge what Serenity can and cannot do before accessing the chat."

### Actions:
- Scroll down to show disclaimer
- Point out "Not a substitute for therapy" language
- Check the consent checkbox
- Click "Begin Your Journey"

**Key Points**:
- ✅ Premium UX highlighted
- ✅ Safety/transparency emphasized
- ✅ Informed consent shown

---

## 3. Chat Interface - Normal Conversation (45 seconds)

### Say:
> "This is the main chat interface. Notice the floating navbar with glassmorphism effect and the online status indicator."

### Actions:
- Point to header elements briefly
- Type: **"I've been feeling really anxious about my job lately"**
- Press Enter

### Say (while waiting):
> "The typing indicator shows the AI is processing. We send the full conversation history to GPT-4.1 for context-aware responses."

### Actions:
- Wait for AI response (~3 seconds)
- Response appears with fade-in animation

### Say:
> "Notice the empathetic validation - no toxic positivity, just genuine support. The AI asks open-ended questions to help users reflect."

**Key Points**:
- ✅ UX elements highlighted
- ✅ AI quality demonstrated
- ✅ Conversation flow shown

---

## 4. Crisis Detection Demo (45 seconds)

### Say:
> "Now, here's the critical safety feature. Watch what happens when someone mentions self-harm."

### Actions:
- Type: **"Sometimes I think about hurting myself"**
- Press Enter
- Wait for response

### Say:
> "The AI immediately provides crisis resources: the 988 Lifeline, Crisis Text Line, emergency services, and international resources. This is hardcoded into our system prompt - the AI cannot skip this step."

### Actions:
- Point to crisis resources in response
- Show clickable phone/SMS links if time allows

**Key Points**:
- ✅ Safety architecture demonstrated
- ✅ Crisis resources shown
- ✅ Reliability highlighted

---

## 5. Crisis Button (15 seconds)

### Say:
> "Users can also access crisis resources anytime via this button in the header."

### Actions:
- Click "🆘 I'm in crisis" button
- Modal opens with resources
- Point to one-tap calling/texting

### Say:
> "We make it as easy as possible to get help when needed."

### Actions:
- Close modal

**Key Points**:
- ✅ Proactive safety features
- ✅ Accessibility of resources

---

## 6. UI/UX Innovations (30 seconds)

### Say:
> "Serenity combines therapeutic design with cutting-edge UI. The 3D particle background uses Three.js for ambient visual depth. The custom glowing cursor and mouse-tracking gradient create an engaging, premium experience. Everything uses glassmorphism for a modern, clean aesthetic. These aren't just decorative - research shows calming visuals reduce anxiety."

### Actions:
- Move mouse to show gradient tracking
- Let particles rotate in background
- Optionally navigate to Info page to show consistency

**Key Points**:
- ✅ Innovation highlighted
- ✅ Purpose-driven design explained
- ✅ Technical depth shown

---

## 7. Technical Architecture (30 seconds)

### Say:
> "Architecturally, Serenity uses a separated frontend and backend. The React frontend is built with Vite and includes Three.js for 3D effects. The Express backend integrates with OpenAI's GPT-4.1. We chose GPT-4.1 specifically for its emotional intelligence and safety compliance. The system prompt has multi-layered constraints: explicit limitations, crisis detection, and refusal training. No conversation data is stored - everything is session-only for maximum privacy."

### Actions:
- Show terminal with backend running (optional)
- Can mention architecture diagram in docs if time

**Key Points**:
- ✅ Tech stack mentioned
- ✅ AI integration explained
- ✅ Privacy emphasized

---

## 8. Closing Statement (30 seconds)

### Say:
> "Serenity demonstrates that AI can be a powerful force for good in mental health - not as a replacement for therapy, but as an accessible, always-available companion. We've combined thoughtful AI engineering with safety-first design and a premium user experience. Every decision - from the system prompt to the UI animations - serves the mission of providing empathetic, trustworthy mental wellness support. Thank you, I'm happy to answer questions."

### Actions:
- Return to chat or onboarding page
- Keep demo visible for questions

**Key Points**:
- ✅ Mission reinforced
- ✅ Engineering rigor highlighted
- ✅ Ready for Q&A

---

## Backup Talking Points (If Time)

### If Asked About Privacy:
> "Zero data persistence. Messages exist only in browser memory and are sent to OpenAI under their privacy policy. We intentionally chose this architecture to maximize privacy, even though it means we can't improve AI through conversation logs."

### If Asked About Cost:
> "OpenAI API costs about $0.002 to $0.01 per conversation. For 10,000 users averaging 5 conversations per month, that's $100 to $500 monthly - sustainable through grants, partnerships, or freemium models."

### If Asked About Replacing Therapy:
> "Absolutely not. Serenity is a complementary tool for daily emotional support, like a supportive friend. We actively encourage users to seek professional help and make crisis resources easily accessible. Think of it as a bridge, not a destination."

---

## Technical Difficulties Contingency

### If Backend Fails:
- Have screenshot/screen recording ready
- Explain architecture verbally
- Show code in editor as backup

### If Browser Crashes:
- Have second browser window ready
- Keep mobile device as backup demo

### If API Rate Limited:
- Show previous conversation screenshot
- Explain AI integration conceptually

---

## Timing Checkpoints

- **1 minute**: Should be in chat interface
- **2 minutes**: Should have sent first message
- **3 minutes**: Should have completed crisis demo
- **4 minutes**: UI features highlighted
- **5 minutes**: Closing statement

**Practice**: Run through 3-4 times to stay under 5 minutes

---

## Post-Demo

- Be ready for questions
- Have documentation links available
- Offer to share GitHub repo
- Provide contact information

# Test Coverage Analysis

## Current Status: Zero Test Coverage

This codebase currently has **no tests** and **no testing framework installed**. The `package.json` contains only a placeholder test script:
```json
"test": "echo \"Error: no test specified\" && exit 1"
```

---

## Recommended Testing Framework Setup

Install Jest with supertest for API testing:
```bash
npm install --save-dev jest supertest mongodb-memory-server
```

Add to `package.json`:
```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

---

## Priority Areas for Test Coverage

### 1. Unit Tests - Utility Functions (HIGH PRIORITY)

**File:** `utils/time.js:3`

The `haveManySecondsHavePassed()` function is critical for rate limiting in the messages route.

```javascript
// Recommended tests:
describe('haveManySecondsHavePassed', () => {
  it('should return 0 for current date', () => {});
  it('should return positive seconds for past dates', () => {});
  it('should return negative seconds for future dates', () => {});
  it('should handle null/undefined input gracefully', () => {});
});
```

**Rationale:** This function has no input validation and is used in production business logic. A bug here breaks rate limiting.

---

### 2. Integration Tests - Messages Route (HIGH PRIORITY)

**File:** `routes/messages.route.js`

This route has the most business logic and validation rules:

| Endpoint | Test Cases Needed |
|----------|-------------------|
| `GET /:myId/:contactId` | Valid IDs return messages, invalid IDs return error, empty result for no messages |
| `POST /` | All validation rules (see below), rate limiting, successful message creation |
| `DELETE /:id` | Returns fake success response |

**POST Validation Tests (lines 28-59):**
```javascript
describe('POST /api/messages', () => {
  it('should reject if myId !== "5f2ea3801f986a01cefc8bcd"', () => {});
  it('should reject if contactId is missing', () => {});
  it('should reject if contactId is not a valid ObjectId', () => {});
  it('should reject if content is empty', () => {});
  it('should reject if type !== "text"', () => {});
  it('should reject if less than 15 seconds since last message', () => {});
  it('should create message with valid input', () => {});
  it('should return the created message', () => {});
});
```

**Bug Found (line 55):** The rate limiting code will crash if no messages exist in the database:
```javascript
// lastMessageCreatedTime can be null if no messages exist
if (haveManySecondsHavePassed(lastMessageCreatedTime.time) < 15) { // NPE risk!
```

---

### 3. Integration Tests - Contacts Route (MEDIUM PRIORITY)

**File:** `routes/contacts.route.js`

```javascript
describe('GET /api/contacts', () => {
  it('should return all contacts', () => {});
  it('should include lastMessage for each contact', () => {});
  it('should include online status (boolean) for each contact', () => {});
  it('should handle contacts with no messages', () => {});
  it('should return empty array when no contacts exist', () => {});
});
```

**Note:** The `online` field is randomized (line 36), which makes exact testing difficult. Consider mocking `Math.random()` in tests.

---

### 4. Integration Tests - Profile Route (MEDIUM PRIORITY)

**File:** `routes/profile.route.js`

```javascript
describe('GET /api/profile', () => {
  it('should return profile data', () => {});
  it('should handle empty profile collection', () => {});
});
```

**Bug Found (line 9):** The spread operator on `Profile.find({})` result is incorrect:
```javascript
return res.json(...profile); // Spreads array elements as args to json()
```
- If 0 profiles exist: `res.json()` returns `undefined`
- If 1 profile exists: Works correctly
- If 2+ profiles exist: Only first profile is returned

---

### 5. Model Validation Tests (MEDIUM PRIORITY)

Test Mongoose schema validation:

**Message Model:**
```javascript
describe('Message Model', () => {
  it('should set read to false by default', () => {});
  it('should require valid ObjectIds for fromUserId/toUserId', () => {});
  it('should save with valid data', () => {});
});
```

**Contact Model:**
```javascript
describe('Contact Model', () => {
  it('should set archived to false by default', () => {});
  it('should allow nested socials object', () => {});
});
```

---

### 6. API Error Handling Tests (LOW PRIORITY)

```javascript
describe('Error Handling', () => {
  it('should return error JSON for database failures', () => {});
  it('should handle malformed request bodies', () => {});
  it('should handle invalid route parameters', () => {});
});
```

---

## Bugs Discovered During Analysis

| Location | Severity | Description |
|----------|----------|-------------|
| `messages.route.js:55` | **HIGH** | `lastMessageCreatedTime.time` will throw if no messages exist |
| `profile.route.js:9` | **MEDIUM** | Spread operator incorrectly handles multiple profiles |
| `messages.route.js:70` | **LOW** | `message.save()` not awaited, no error handling |

---

## Recommended Test File Structure

```
fake-chat-api/
├── __tests__/
│   ├── unit/
│   │   └── time.test.js
│   ├── integration/
│   │   ├── messages.test.js
│   │   ├── contacts.test.js
│   │   └── profile.test.js
│   ├── models/
│   │   ├── Message.test.js
│   │   ├── Contact.test.js
│   │   └── Profile.test.js
│   └── setup.js
├── jest.config.js
```

---

## Jest Configuration Recommendation

Create `jest.config.js`:
```javascript
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'routes/**/*.js',
    'utils/**/*.js',
    'models/**/*.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  setupFilesAfterEnv: ['./__tests__/setup.js']
};
```

---

## Summary

| Category | Files | Current Coverage | Priority |
|----------|-------|------------------|----------|
| Utility Functions | 1 | 0% | HIGH |
| Routes (Messages) | 1 | 0% | HIGH |
| Routes (Contacts) | 1 | 0% | MEDIUM |
| Routes (Profile) | 1 | 0% | MEDIUM |
| Models | 3 | 0% | MEDIUM |
| Error Handling | - | 0% | LOW |

**Total Estimated Tests Needed:** 25-35 test cases

**Recommended First Steps:**
1. Install Jest, supertest, and mongodb-memory-server
2. Create test setup file with database mocking
3. Write unit tests for `utils/time.js`
4. Write integration tests for `POST /api/messages` (most complex validation)
5. Expand to other routes and models

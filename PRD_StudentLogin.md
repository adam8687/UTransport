# PRD: Student Login Onboarding — Add Account Info Screens

**Project:** AccessibilitySP26 (UT Austin Campus Transportation & Accessibility App)
**Feature:** Complete the student sign-up onboarding flow by adding the two missing screens after Sign Up
**Scope:** Frontend only — two new screens + minor navigation wiring in existing files

---

## ⚠️ Critical Framework Clarification

**This is an Expo Go project (SDK 54), NOT bare React Native.**

Do not confuse this with a bare React Native or React Native CLI project. All imports, navigation, and tooling are Expo-specific:

| Concern | Correct (use this) | Wrong (do not use) |
|---|---|---|
| Framework | `expo` SDK ~54 | bare React Native |
| Routing | `expo-router` v6 (file-based) | `@react-navigation/stack` manually |
| Firebase | `firebase` JS SDK v12 (`import { getAuth } from 'firebase/auth'`) | `@react-native-firebase/app` |
| Icons | `@expo/vector-icons` | `react-native-vector-icons` |
| Safe area | `react-native-safe-area-context` (already installed) | Expo's `SafeAreaView` from `expo` |
| Navigation API | `useRouter()` from `expo-router` | `useNavigation()` from React Navigation |
| Route format | `/(tabs)/account-info` | `AccountInfo` (named screen) |

The `package.json` already has all necessary dependencies. **Do not add new packages** unless explicitly noted.

---

## What Already Exists — Do Not Touch

The following screens are **already built and working**. Do not modify their UI, StyleSheet, or layout in any way:

| File | Screen | Status |
|---|---|---|
| `app/(tabs)/work-portal.tsx` | Welcome / role select ("Are you a user or employee?") | ✅ Done |
| `app/(tabs)/login.tsx` | Log In (Username + Password fields) | ✅ Done |
| `app/(tabs)/sign-up.tsx` | Sign Up (Email + Password fields) | ✅ Done |
| `app/(tabs)/request.tsx` | Request a SureWalk (main feature screen) | ✅ Done |
| `app/(tabs)/index.tsx` | Home tab | ✅ Done |
| `app/(tabs)/_layout.tsx` | Tab navigator config | Needs minor addition (see below) |

---

## What Needs to Be Built

Two new screens must be added to complete the sign-up onboarding flow:

1. **`app/(tabs)/account-info.tsx`** — collects First Name, Last Name, UT EID, Phone Number
2. **`app/(tabs)/accessibility-info.tsx`** — collects ADA assistance preference, optional medical document, terms acknowledgment

Plus two small wiring changes in existing files:
- `app/(tabs)/sign-up.tsx` — change the Sign Up button's `onPress` to navigate to `account-info` instead of `request`
- `app/(tabs)/_layout.tsx` — register both new screens as hidden tabs (not visible in tab bar)

---

## Established UI Patterns — Match These Exactly

Every screen in this project follows the same StyleSheet pattern. The two new screens must use these values identically. Do not introduce new design tokens or abstractions.

**Colors (hardcoded per file, same as all existing screens):**
```ts
const BURNT_ORANGE = '#BF5700';
// Input background:  '#E8E3DA'
// Button background: '#EDE8E0'
// Body background:   '#fff'
// Label text:        '#333'
// Link/hint text:    '#555'
// Primary text:      '#222'
```

**Safe area + status bar (copy from login.tsx):**
```tsx
<SafeAreaView style={styles.safe}>
  <StatusBar backgroundColor={BURNT_ORANGE} barStyle="light-content" />
  <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
  >
    ...
  </KeyboardAvoidingView>
</SafeAreaView>
```

**StyleSheet values that must match existing screens:**
```ts
safe: { flex: 1, backgroundColor: BURNT_ORANGE }
container: { flex: 1, backgroundColor: '#fff' }
header: { backgroundColor: BURNT_ORANGE, paddingVertical: 20, paddingHorizontal: 16, alignItems: 'center' }
headerText: { color: '#fff', fontSize: 22, fontWeight: '700', textAlign: 'center' }
body: { flex: 1, paddingHorizontal: 32, paddingTop: 44, alignItems: 'center' }
fieldRow: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 24 }
label: { width: 120, fontSize: 15, color: '#333', fontWeight: '500' }
input: { flex: 1, backgroundColor: '#E8E3DA', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 9, fontSize: 14, color: '#222' }
primaryButton: { backgroundColor: '#EDE8E0', borderRadius: 30, paddingVertical: 14, width: '80%', alignItems: 'center', marginBottom: 20 }
primaryButtonText: { fontSize: 17, fontWeight: '600', color: '#222' }
linkText: { fontSize: 14, color: '#555' }
```

Use `ScrollView` wrapping the body for screens that have more fields (account-info and accessibility-info), so fields don't clip on smaller phones. Wrap `KeyboardAvoidingView` around `ScrollView`, not the other way.

---

## Navigation Flow (Expo Router)

Navigation uses `useRouter()` from `expo-router`. Route strings use the `/(tabs)/` prefix.

**Current sign-up flow (broken — fix this):**
```
sign-up.tsx → router.replace('/(tabs)/request')   ← WRONG, skips onboarding
```

**Correct flow after this PR:**
```
work-portal.tsx  →  login.tsx  →  request.tsx (existing, no change)
                 ↘  sign-up.tsx  →  account-info.tsx  →  accessibility-info.tsx  →  request.tsx
```

**Passing params between screens (Expo Router v6):**
```ts
// Pushing with params:
router.push({ pathname: '/(tabs)/account-info', params: { uid: 'abc', email: 'user@utexas.edu' } });

// Receiving params:
import { useLocalSearchParams } from 'expo-router';
const { uid, email } = useLocalSearchParams<{ uid: string; email: string }>();
```

---

## Change 1 — Update `app/(tabs)/_layout.tsx`

Add the two new screens as hidden tabs (they exist in the router but don't appear in the tab bar). Add these two `Tabs.Screen` entries inside `<Tabs>`, alongside the existing hidden `explore` screen:

```tsx
<Tabs.Screen
  name="account-info"
  options={{ href: null }}
/>
<Tabs.Screen
  name="accessibility-info"
  options={{ href: null }}
/>
```

No other changes to `_layout.tsx`.

---

## Change 2 — Update `app/(tabs)/sign-up.tsx`

One line change only. Find:
```tsx
onPress={() => router.replace('/(tabs)/request')}
```
Replace with:
```tsx
onPress={() => router.push({ pathname: '/(tabs)/account-info', params: { email } })}
```

No other changes to `sign-up.tsx` — do not touch the layout, styles, or any other logic.

---

## New Screen 1 — `app/(tabs)/account-info.tsx`

**Mockup reference:** "iPhone 17 - Incoming..." (4th screen) — First Name, Last Name, UT EID, Phone Number with a Confirm button.

**File to create:** `app/(tabs)/account-info.tsx`

**Imports needed:**
```ts
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView, Platform, SafeAreaView, ScrollView,
  StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
```

**Layout (top to bottom):**

1. `SafeAreaView` → `StatusBar` → `KeyboardAvoidingView` (same pattern as login.tsx)
2. **Header** — same orange header style as existing screens. Header text: `"Please enter additional{'\n'}account information"` — white, 18pt, bold, centered, textAlign center. (Two lines — use a slightly smaller font than the 22pt used on login/signup since this is a longer string.)
3. **Scrollable body** — `ScrollView` inside the body with `showsVerticalScrollIndicator={false}`, `contentContainerStyle` with `paddingBottom: 40`. Fields use the same `fieldRow` + `label` + `input` pattern as login.tsx and sign-up.tsx:
   - `"First Name:*"` — `autoCapitalize="words"`
   - `"Last Name:*"` — `autoCapitalize="words"`
   - `"UT EID:*"` — `autoCapitalize="none"`, `autoCorrect={false}`
   - `"Phone Number:*"` — `keyboardType="phone-pad"`
4. **Confirm button** — same style as the Sign Up / Log In buttons in existing screens (`backgroundColor: '#EDE8E0'`, `borderRadius: 30`, `paddingVertical: 14`, `width: '80%'`). Label: `"Confirm"`.

**State:**
```ts
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [utEID, setUtEID] = useState('');
const [phoneNumber, setPhoneNumber] = useState('');
```

**Confirm button behavior:**
- Basic validation: all four fields must be non-empty. If any field is empty, show a `Platform.OS === 'ios' ? Alert.alert(...) : Alert.alert(...)` with message `"Please fill in all required fields."` — use React Native's `Alert` for now (no inline error UI needed in this phase).
- On success: `router.push({ pathname: '/(tabs)/accessibility-info', params: { uid } })` — pass the `uid` param received from sign-up.

---

## New Screen 2 — `app/(tabs)/accessibility-info.tsx`

**Mockup reference:** "iPhone 17 - Incoming..." (5th screen) — ADA question, Medical Document upload, terms acknowledgment.

**File to create:** `app/(tabs)/accessibility-info.tsx`

**Imports needed:**
```ts
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView,
  StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
```

**Layout (top to bottom):**

1. `SafeAreaView` → `StatusBar` → `KeyboardAvoidingView` (same pattern)
2. **Header** — same orange header. Text: `"Additional Information"` — white, 22pt, bold, centered.
3. **Scrollable body** — `ScrollView` with `showsVerticalScrollIndicator={false}`, `paddingBottom: 40`.

**Section A — ADA question:**
- Label text: `"Do you require Americans with\nDisabilities Act assistance?*"` — `fontSize: 15`, `color: '#333'`, `fontWeight: '500'`, `marginBottom: 12`, full width.
- Below the label: a horizontal row with two checkbox options — `Yes` and `No`. Only one can be selected at a time (radio behavior).
- Each option is: `[ Label text ]  [ Square box ]` rendered side by side.
- Checkbox square: 22×22, `borderWidth: 1.5`, `borderColor: '#AAAAAA'`, `borderRadius: 4`. When selected: fill with `BURNT_ORANGE` and show a white checkmark (use `✓` text character, white, 14pt, bold, centered).
- The two options sit in a `flexDirection: 'row'` container with `gap: 32` between them, left-aligned under the label.

**Section B — Medical Document:**
- Label: `"Medical Document:"` — `fontSize: 15`, `color: '#333'`, `fontWeight: '500'`, `marginTop: 28`, `marginBottom: 10`.
- Upload button: full-width outlined rectangle — `borderWidth: 1`, `borderColor: '#BBBBBB'`, `borderRadius: 8`, `paddingVertical: 12`, `alignItems: 'center'`. Label: `"Upload File"`, `fontSize: 14`, `color: '#555'`.
- Tapping shows `Alert.alert('Coming Soon', 'Document upload will be available in a future update.')`.

**Section C — Terms acknowledgment:**
- Label (multiline, `fontSize: 13`, `color: '#333'`, `marginTop: 28`, `marginBottom: 10`, `lineHeight: 19`):
  `"I have read the updated rules and guidelines for Sure Walk and understand the current situation that the program is experiencing.*"`
- Below: `TextInput` for the user's typed acknowledgment. Style matches the existing `input` style but with `height: 80`, `textAlignVertical: 'top'` (for Android multiline), `multiline={true}`. Placeholder: `"Type your full name to confirm"`.

**Confirm button** — same style as other screens. Label: `"Confirm"`. `marginTop: 28`, `marginBottom: 16`.

**State:**
```ts
const [adaRequired, setAdaRequired] = useState<boolean | null>(null); // null = not yet answered
const [termsSignature, setTermsSignature] = useState('');
```

**Confirm button behavior:**
- Validate: `adaRequired` is not null, `termsSignature.trim()` is not empty.
- If invalid: `Alert.alert('Required', 'Please answer all required fields.')`.
- On success: `router.replace('/(tabs)/request')` — user enters the main app.

---

## What Is Out of Scope for This PR

- Firebase Auth or Firestore integration (no backend calls — stub or skip for now)
- Any changes to `work-portal.tsx`, `login.tsx`, `request.tsx`, or `index.tsx`
- A separate Welcome screen route (work-portal.tsx is already the welcome screen)
- Employee login flow
- Forgot password screen
- Actual file upload for medical documents
- Inline validation error UI (use `Alert.alert` for now)
- Dark mode support (existing screens don't implement it either)

---

## File Summary

| File | Action |
|---|---|
| `app/(tabs)/account-info.tsx` | **Create** |
| `app/(tabs)/accessibility-info.tsx` | **Create** |
| `app/(tabs)/_layout.tsx` | **Edit** — add 2 hidden `Tabs.Screen` entries |
| `app/(tabs)/sign-up.tsx` | **Edit** — change 1 `onPress` to navigate to account-info |
| Everything else | **No changes** |

---

## Acceptance Criteria

- [ ] Tapping "Sign up" on the sign-up screen navigates to account-info instead of request.
- [ ] account-info renders all four fields (First Name, Last Name, UT EID, Phone Number) with the same UI pattern as login.tsx and sign-up.tsx.
- [ ] Tapping "Confirm" on account-info with empty fields shows an Alert.
- [ ] Tapping "Confirm" on account-info with all fields filled navigates to accessibility-info.
- [ ] accessibility-info renders the ADA section, upload button, and terms input.
- [ ] ADA Yes/No checkboxes behave as a radio group (selecting one deselects the other).
- [ ] Tapping "Upload File" shows a "Coming Soon" alert.
- [ ] Tapping "Confirm" on accessibility-info with all required fields filled navigates to `/(tabs)/request`.
- [ ] Both new screens match the visual style of existing screens (orange header, beige inputs, beige buttons, white body, same padding).
- [ ] No TypeScript errors (`npx expo lint` passes).
- [ ] The tab bar does not show the two new screens (they are hidden with `href: null`).

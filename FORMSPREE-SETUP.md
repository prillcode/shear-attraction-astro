# Formspree Setup Guide

## 1. Create an Account
Go to [formspree.io](https://formspree.io) and sign up. The free plan allows 50 submissions/month.

## 2. Create a New Form
- Dashboard → **+ New Form**
- Name it something like "Shear Attraction Bridal Inquiry"
- Copy the generated endpoint URL (e.g. `https://formspree.io/f/abcdefgh`)

## 3. Update the Website
In `src/components/BridalForm.astro` (line 18), replace:
```
action="https://formspree.io/f/YOUR_FORM_ID"
```
with your actual endpoint:
```
action="https://formspree.io/f/abcdefgh"
```
Then redeploy the site.

## 4. Set Up Email Notifications
- In your Formspree dashboard, go to your form's **Settings → Notifications**
- Set the notification email to whoever should receive bridal inquiries

## 5. Test It
Submit a test entry through the live site and confirm the thank-you message appears and the email is received.

---

**Notes:**
- Spam filtering is handled automatically by Formspree
- Submissions are also saved in your Formspree dashboard under the form name

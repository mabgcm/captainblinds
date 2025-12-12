## Google Apps Script (Email Sender)

Paste this code into a new Apps Script project and deploy as a Web App:

```javascript
const TO_EMAIL = "bugucam@gmail.com";

function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || "{}");

    const name = (data.name || "").toString().trim();
    const email = (data.email || "").toString().trim();
    const phone = (data.phone || "").toString().trim();
    const message = (data.message || "").toString().trim();
    const page = (data.page || "").toString().trim();

    if (!email || !message) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: "Missing email or message" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const subject = `New Website Lead: ${name || "Unknown"} (${email})`;
    const body = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nPage: ${page}\n\nMessage:\n${message}`;

    GmailApp.sendEmail(TO_EMAIL, subject, body, { replyTo: email });

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, message: "Endpoint is running" }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### Deploy the Web App

1. Deploy → New deployment → Select **Web app**
2. Execute as: **Me**
3. Who has access: **Anyone**
4. Deploy and copy the `/exec` URL

### Vercel configuration

1. In Vercel, add env var `GOOGLE_SCRIPT_URL` = your Apps Script `/exec` URL.
2. Redeploy.
3. Test by submitting the form on the live site. Emails will arrive at `TO_EMAIL` (may appear in Sent if it's your own Gmail).

# Content Editing Guide

Welcome! This guide will help you update your salon's website content without needing to know any code. Everything you need to edit lives in simple text files called YAML files.

## What is YAML?

YAML is just a plain text format that's easy for both humans and computers to read. It uses simple key-value pairs, like `name: Cristy` or `price: "$55"`. That's it!

---

## How to edit a YAML file on GitHub

1. Go to your GitHub repository
2. Navigate to the `src/content` folder
3. Find the file you want to edit (see below for what each file contains)
4. Click the file name, then click the pencil icon (top right) to edit
5. Make your changes using the simple format shown in examples below
6. Scroll to the bottom and click **"Commit changes"**
7. Your website will update automatically after a few minutes!

---

## How to update your salon info

Edit `src/content/site/salon.yaml` to update:

- **Address**: Change the `address:` line
- **Phone**: Change the `phone:` line
- **Email**: Change the `email:` line
- **Hours**: Edit the `hours:` section — each entry has a `day:` and `time:` line
- **Hero text**: Change `heroHeading:` (the big headline) and `heroBody:` (the paragraph below it)
- **Social links**: Update `instagram:` and `facebook:` URLs if they change

Example:
```yaml
address: 456 New Street, Bangor, ME 04402
phone: "(207) 555-0200"
hours:
  - day: Tuesday – Friday
    time: 10am – 7pm
```

---

## How to update a stylist's services or pricing

Each stylist has their own file in `src/content/stylists/` (e.g., `cristy.yaml`, `maya.yaml`).

To change a price:
1. Find the stylist's file
2. Find the service under `items:`
3. Change the `price:` value

Example:
```yaml
services:
  - category: Color
    items:
      - name: Full Highlight
        price: "$135+"   # ← Just change this number!
```

To add a new service:
```yaml
services:
  - category: Color
    items:
      - name: Full Highlight
        price: "$120+"
      - name: New Service Name
        price: "$50"     # ← Add this line
```

---

## How to update a stylist's bio or photo

Each stylist's file in `src/content/stylists/` contains:

- **Bio**: Find the `bio:` line and replace the text after it
- **Photo**: Change the `photo:` path to point to a new image

To change the bio:
```yaml
bio: >
  Cristy loves creating beautiful hair and helping clients
  feel confident. She specializes in balayage and bridal styling.
```

To change the photo:
1. Upload your new image to `public/images/stylists/` in GitHub (drag and drop)
2. Update the `photo:` line with the new filename

Example:
```yaml
photo: /images/stylists/cristy-new.jpg
```

---

## How to add a new stylist

1. Go to `src/content/stylists/`
2. Click any existing stylist's file (like `cristy.yaml`)
3. Copy all the content
4. Go back, click **"Add file"** → **"Create new file"**
5. Name it something like `newstylist.yaml`
6. Paste the content and edit the fields:
   - `name:` The stylist's name
   - `title:` Their title (e.g., "Senior Stylist")
   - `photo:` Path to their headshot in `public/images/stylists/`
   - `bio:` A short bio about them
   - `bookingUrl:` Their Square booking URL (or leave empty to hide the button)
   - `bookingLabel:` Text on the booking button (default is "Book an Appointment")
   - `order:` A number to sort stylists (lower numbers appear first)
   - `active:` Set to `true` to show, `false` to hide
   - `services:` Their menu of services with categories and prices

Example:
```yaml
name: Jordan
title: Stylist
photo: /images/stylists/jordan.jpg
bio: >
  Jordan is a creative stylist with a passion for modern cuts
  and textured styles. Specializing in curly hair and men's grooming.
bookingUrl: https://book.square.site/merchant/abc123/appointments
bookingLabel: Book with Jordan
order: 3
active: true
services:
  - category: Cut & Style
    items:
      - name: Women's Haircut
        price: "$45"
      - name: Men's Haircut
        price: "$30"
```

---

## How to temporarily hide a stylist

If a stylist is away or no longer works at the salon:

1. Find their file in `src/content/stylists/`
2. Change `active: true` to `active: false`
3. Save and commit

Example:
```yaml
active: false   # This hides them from the website
```

---

## How to add a gallery photo

1. In GitHub, go to `public/images/gallery/`
2. Click **"Upload files"**
3. Drag and drop your photo(s)
4. Click **"Commit changes"**

That's it! The gallery automatically picks up all photos in that folder. No need to update any code or config files.

---

## How to update bridal packages

Edit `src/content/site/weddings.yaml` to update wedding packages.

To change a package:
```yaml
packages:
  - name: Bride Package
    description: Your complete wedding day hair experience.
    price: Starting at $250   # ← Update this
    includes:
      - Consultation & full hair trial
      - Wedding day styling
      - Touch-up kit to go
```

To add a new package:
```yaml
packages:
  - name: Bride Package
    ...
  - name: New Package Name    # ← Add this entire block
    description: What's included
    price: Starting at $100
    includes:
      - Service 1
      - Service 2
```

---

## What NOT to touch

Please avoid editing anything in these folders:

- `src/components/` — These are building blocks of the site layout
- `src/layouts/` — These are page layout templates
- `src/pages/` — These are the page files themselves
- Any `.astro`, `.ts`, or `.mjs` files — These are code files

Only edit the `.yaml` files in `src/content/` and upload images to `public/images/`.

---

## Need help?

If you get stuck or something looks wrong on the website, don't hesitate to reach out to your web developer. They can help you with any questions or issues.

---

Happy editing! 🎨

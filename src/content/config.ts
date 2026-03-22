import { defineCollection, z } from 'astro:content';

const stylists = defineCollection({
  type: 'data',
  schema: z.object({
    name:         z.string(),
    title:        z.string(),
    photo:        z.string(),
    bio:          z.string(),
    bookingUrl:   z.string().url().optional(),
    bookingLabel: z.string().default('Book an Appointment'),
    order:        z.number().default(99),
    active:       z.boolean().default(true),
    display:      z.boolean().default(true),
    featuredServices: z.array(z.string()).default([])
  })
});

const site = defineCollection({
  type: 'data',
  schema: z.object({}).passthrough(),
});

export const collections = { stylists, site };

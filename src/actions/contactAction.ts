'use server';

import { Resend } from 'resend';
import * as v from 'valibot';
import { serverEnv } from '@/env/serverEnv';
import { sanityFetch } from '@/lib/sanity/client/live';
import { settingsQuery } from '@/lib/sanity/queries/queries';
import type { ActionResponse } from './types';

const ContactSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty('Please enter your name.')),
  email: v.pipe(
    v.string(),
    v.nonEmpty('Please enter your email.'),
    v.email('The email is badly formatted.')
  ),
  message: v.pipe(v.string(), v.nonEmpty('Please enter a message.')),
});

export const contactAction = async (
  formData: FormData
): Promise<ActionResponse> => {
  'use server';

  try {
    const { name, email, message } = v.parse(ContactSchema, {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    });

    if (!serverEnv.RESEND_API_KEY) {
      return {
        status: 'error',
        error:
          'The contact form is not set up to send email yet. Please email us directly.',
      };
    }

    const { data: settings } = await sanityFetch({
      query: settingsQuery,
      tags: ['settings'],
    });

    if (!settings?.email) {
      return {
        status: 'error',
        error:
          'The contact form is not set up to send email yet. Please email us directly.',
      };
    }

    const resend = new Resend(serverEnv.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: `${settings.title ?? 'Website'} Contact Form <onboarding@resend.dev>`,
      to: settings.email,
      replyTo: email,
      subject: `New inquiry from ${name}`,
      text: `${message}\n\n—\nFrom: ${name} <${email}>`,
    });

    if (error) {
      return {
        status: 'error',
        error: 'Something went wrong sending your message. Please try again.',
      };
    }

    return {
      status: 'success',
      error: null,
    };
  } catch (error: unknown) {
    if (v.isValiError(error)) {
      return {
        status: 'error',
        error: error.message,
      };
    }

    return {
      status: 'error',
      error: 'An unknown error occurred.',
    };
  }
};

import { RegistrationMailTemplate } from '@/components/RegistrationMailTemplate';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['panchalmohitg2002@gmail.com'],
      subject: 'OTP For TrekFlow Registration',
      react: RegistrationMailTemplate({ recipientName: 'John',otp:'23234',expiryMinutes:20 }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
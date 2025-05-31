import RegistrationMailTemplate from '@/components/RegistrationMailTemplate';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const props = {recipientName: "Aniket",
  otp: "234524",
  expiryMinutes: 20,
  appName: "Treflow"
}

export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'send@trekflow.space',
      to: ['panchalmohitg2002@gmail.com'],
      subject: 'OTP For TrekFlow Registration',
      react: RegistrationMailTemplate({
        recipientName: "Aniket",
        otp: "234524",
        expiryMinutes: 20,
        appName: "Treflow",
      }),

    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error)
    return Response.json({ error }, { status: 500 });
  }
}
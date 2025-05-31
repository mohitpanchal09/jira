import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface RegistrationMailTemplateProps {
  recipientName: string;
  otp: string;
  expiryMinutes?: number;
  appName?: string;
}



export default function RegistrationMailTemplate({
  recipientName,
  otp,
  expiryMinutes = 10,
  appName = "TrekFlow",
}: RegistrationMailTemplateProps) {
  const currentYear = new Date().getFullYear();

  return (
    <Html>
      <Head />
      <Preview>{`Your ${appName} verification code`}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src={`https://jira-bucket09.s3.eu-north-1.amazonaws.com/profile-1748710692633-trekflow-logo.png`} // Ensure this file exists on your server
              width="40"
              height="40"
              alt="TrekFlow Logo"
              style={{ marginRight: "12px" }}
            />
            <Text style={trekflowBrand}>
              TrekFlow
            </Text>
          </Section>

          {/* Main Content */}
          <Section style={section}>
            <Heading style={title}>Verify Your Email</Heading>
            <Text style={text}>Hi {recipientName},</Text>
            <Text style={text}>
              Thank you for registering with {appName}. To complete your
              registration and verify your account, please use the verification
              code below:
            </Text>

            {/* OTP Code Display */}
            <Section style={otpBox}>
              {/* <Text style={otpLabel}>Your Verification Code</Text> */}
              <Text style={otpValue}>{otp}</Text>
              <Text style={otpExpiry}>
                This code will expire in {expiryMinutes} minutes
              </Text>
            </Section>

            <Text style={text}>
              If you did not request this verification code, please ignore this
              email or contact our support team if you have concerns.
            </Text>

            {/* Security Tip */}
            <Section style={tipBox}>
              <Heading as="h3" style={tipTitle}>
                Security Tip
              </Heading>
              <Text style={tipText}>
                We will never ask for your password or full account details via
                email. Always make sure you&apos;re on our official website before
                entering any sensitive information.
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Hr />
          <Section style={footer}>
            <Text style={footerText}>
              If you need any assistance, please contact our support team at{" "}
              <Link href="mailto:support@trekflow.com" style={link}>
                support@trekflow.com
              </Link>
            </Text>
            <Section style={footerLinks}>
              <Link href="#" style={link}>
                Help Center
              </Link>{" "}
              |{" "}
              <Link href="#" style={link}>
                Privacy Policy
              </Link>{" "}
              |{" "}
              <Link href="#" style={link}>
                Terms of Service
              </Link>
            </Section>
            <Text style={copyright}>
              © {currentYear} {appName}. All rights reserved.
              <br />
              Please do not reply to this email as it was sent from an
              unmonitored address.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

RegistrationMailTemplate.PreviewProps = {
  recipientName: "Mohit",
  otp: "596853",
  expiryMinutes: 10,
  appName: "TrekFlow",
} satisfies RegistrationMailTemplateProps;

const main = { backgroundColor: "#f9fafb", fontFamily: "sans-serif" };
const container = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  overflow: "hidden",
};

const header = {
  display: "flex",
  alignItems: "center",
  backgroundColor: "#059669",
  color: "#ffffff",
  padding: "20px",
};

const headerTitle = {
  fontSize: "20px",
  fontWeight: "bold",
  margin: 0,
  color: "#ffffff",
};

const headerSubtitle = {
  fontSize: "14px",
  margin: 0,
  color: "#d1fae5",
};

const section = { padding: "24px" };
const title = { fontSize: "24px", marginBottom: "12px", color: "#111827" };
const text = {
  fontSize: "14px",
  color: "#4b5563",
  lineHeight: "1.6",
  margin: "12px 0",
};

const otpBox = {
  backgroundColor: "#f3f4f6",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "20px",
  textAlign: "center" as const,
  margin: "24px 0",
};

const otpValue = {
  fontSize: "36px",
  fontWeight: "bold",
  color: "#111827",
  letterSpacing: "6px",
  margin: "12px 0",
};
const otpExpiry = { fontSize: "12px", color: "#6b7280" };

const tipBox = {
  backgroundColor: "#eff6ff",
  border: "1px solid #bfdbfe",
  borderRadius: "8px",
  padding: "16px",
  marginTop: "24px",
};

const tipTitle = { fontSize: "16px", color: "#1e40af", marginBottom: "8px" };
const tipText = { fontSize: "14px", color: "#1e3a8a" };

const footer = {
  textAlign: "center" as const,
  padding: "20px",
  backgroundColor: "#f3f4f6",
  fontSize: "12px",
};

const footerText = { marginBottom: "8px", color: "#6b7280" };
const footerLinks = { marginBottom: "8px", color: "#6b7280" };
const link = { color: "#3b82f6", textDecoration: "underline" };
const copyright = { color: "#9ca3af", fontSize: "11px" };
const trekflowBrand = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#ffffff",
  margin: 0,
};

const flowHighlight = {
  color: "#3b82f6",
};

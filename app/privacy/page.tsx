"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">FormGuard</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link href="/register">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600">Last updated: January 1, 2025</p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Introduction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                FormGuard ("we", "our", or "us") is committed to protecting your
                privacy. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you use our
                service.
              </p>
              <p className="text-gray-600">
                By using FormGuard, you agree to the collection and use of
                information in accordance with this policy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Account Information
                </h3>
                <p className="text-gray-600">
                  When you create an account, we collect your email address,
                  organization name, and your full name.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Form Submission Data
                </h3>
                <p className="text-gray-600">
                  We collect form submission data including email addresses,
                  form fields, IP addresses, device information, and browser
                  information for the purpose of quality scoring and bot
                  detection.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Usage Data</h3>
                <p className="text-gray-600">
                  We collect information about how you use our service,
                  including API usage, dashboard interactions, and feature
                  usage.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600 list-disc list-inside">
                <li>To provide and maintain our service</li>
                <li>To detect bots and score lead quality</li>
                <li>To track form drop-offs and analytics</li>
                <li>To notify you about changes to our service</li>
                <li>To provide customer support</li>
                <li>To detect, prevent, and address technical issues</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Data Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                We implement appropriate technical and organizational security
                measures to protect your data. All data is encrypted in transit
                and at rest. However, no method of transmission over the
                Internet is 100% secure.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. GDPR Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                If you are located in the European Economic Area (EEA), you have
                certain data protection rights:
              </p>
              <ul className="space-y-2 text-gray-600 list-disc list-inside">
                <li>The right to access your personal data</li>
                <li>The right to rectification of inaccurate data</li>
                <li>The right to erasure ("right to be forgotten")</li>
                <li>The right to restrict processing</li>
                <li>The right to data portability</li>
                <li>The right to object to processing</li>
              </ul>
              <p className="text-gray-600">
                To exercise these rights, please contact us at{" "}
                <a
                  href="mailto:support@formguard.com"
                  className="text-blue-600 hover:text-blue-700"
                >
                  support@formguard.com
                </a>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Data Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                We retain your personal data only for as long as necessary to
                provide our services and comply with legal obligations. You can
                request deletion of your data at any time through your account
                settings or by contacting us.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                We may use third-party services for analytics, payment
                processing, and hosting. These services have their own privacy
                policies, and we encourage you to review them.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Our service is not intended for children under 13 years of age.
                We do not knowingly collect personal information from children
                under 13.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                If you have any questions about this Privacy Policy, please
                contact us at:
              </p>
              <p className="text-gray-600 mt-2">
                Email:{" "}
                <a
                  href="mailto:support@formguard.com"
                  className="text-blue-600 hover:text-blue-700"
                >
                  support@formguard.com
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">FormGuard</span>
              </div>
              <p className="text-sm">
                Stop wasting time on fake form submissions. Detect bots, score
                lead quality, and track drop-offs automatically.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/#features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-white transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>© 2025 FormGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

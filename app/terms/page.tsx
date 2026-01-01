"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-gray-600">Last updated: January 1, 2025</p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                By accessing and using FormGuard ("the Service"), you accept and
                agree to be bound by the terms and provision of this agreement.
                If you do not agree to these Terms of Service, please do not use
                our Service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Description of Service</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                FormGuard is a service that provides bot detection, lead quality
                scoring, and drop-off tracking for web forms. The Service
                includes a JavaScript SDK, web dashboard, and API access.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Account Registration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                To use FormGuard, you must create an account by providing
                accurate and complete information. You are responsible for
                maintaining the security of your account and password.
              </p>
              <p className="text-gray-600">
                You agree to notify us immediately of any unauthorized use of
                your account or any other breach of security.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Acceptable Use</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">You agree not to:</p>
              <ul className="space-y-2 text-gray-600 list-disc list-inside">
                <li>
                  Use the Service for any illegal purpose or in violation of any
                  laws
                </li>
                <li>
                  Attempt to gain unauthorized access to the Service or its
                  related systems
                </li>
                <li>
                  Interfere with or disrupt the Service or servers connected to
                  the Service
                </li>
                <li>
                  Use the Service to transmit any viruses, malware, or harmful
                  code
                </li>
                <li>
                  Reverse engineer, decompile, or disassemble any part of the
                  Service
                </li>
                <li>
                  Use the Service to collect data from users without their
                  consent
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Subscription and Billing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                FormGuard offers both free and paid subscription plans. Paid
                plans are billed monthly or annually in advance.
              </p>
              <p className="text-gray-600">
                <strong>Refunds:</strong> Subscription fees are non-refundable
                except as required by law. If you cancel your subscription, you
                will continue to have access until the end of your billing
                period.
              </p>
              <p className="text-gray-600">
                <strong>Price Changes:</strong> We reserve the right to modify
                subscription prices at any time. Price changes will be
                communicated to you in advance.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Data and Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Your use of the Service is also governed by our Privacy Policy.
                By using the Service, you consent to the collection and use of
                information as described in the Privacy Policy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                The Service and its original content, features, and
                functionality are owned by FormGuard and are protected by
                international copyright, trademark, patent, trade secret, and
                other intellectual property laws.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                FormGuard shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages, including without
                limitation, loss of profits, data, use, or other intangible
                losses, resulting from your use of the Service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Service Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                We strive to maintain 99.9% uptime but do not guarantee
                uninterrupted access to the Service. The Service may be
                unavailable due to maintenance, updates, or circumstances beyond
                our control.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Termination</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                We may terminate or suspend your account immediately, without
                prior notice, for conduct that we believe violates these Terms
                of Service or is harmful to other users, us, or third parties.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                We reserve the right to modify these Terms of Service at any
                time. We will notify you of any changes by posting the new Terms
                of Service on this page and updating the "Last updated" date.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>12. Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                If you have any questions about these Terms of Service, please
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

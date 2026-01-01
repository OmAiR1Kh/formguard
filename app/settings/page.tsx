"use client";

import type React from "react";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/copy-button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserPlus, Trash2, Check, ExternalLink } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";

function SettingsContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "organization"
  );
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [forms, setForms] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [billing, setBilling] = useState<any>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  // Helper function to build members array from organization data
  const buildMembersArray = (org: any) => {
    const allMembers = [];
    if (org?.ownerId) {
      allMembers.push({
        _id: org.ownerId._id,
        email: org.ownerId.email,
        role: org.ownerId.role || "owner",
        joinedAt: org.createdAt, // Owner joined when org was created
      });
    }
    if (org?.memberIds && Array.isArray(org.memberIds)) {
      org.memberIds.forEach((member: any) => {
        allMembers.push({
          _id: member._id,
          email: member.email,
          role: member.role || "member",
          joinedAt: member.joinedAt || org.createdAt, // Use joinedAt if available, otherwise fallback
        });
      });
    }
    return allMembers;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orgData, statsData, formsData, billingData] = await Promise.all([
          api.organizations.get(),
          api.organizations.getStats(),
          api.forms.list(),
          api.billing.get().catch(() => null), // Billing might fail, so catch and continue
        ]);
        setOrganization(orgData.organization);
        setStats(statsData.stats);
        setForms(formsData.forms || []);
        setMembers(buildMembersArray(orgData.organization));

        if (billingData) {
          setBilling(billingData.billing);
        }
      } catch (error) {
        console.error("[v0] Failed to fetch settings data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load settings",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Check if the logged-in user is the owner
  const isOwner =
    organization?.ownerId?.email?.toLowerCase() === user?.email?.toLowerCase();

  // Redirect to organization tab if member tries to access restricted tabs
  useEffect(() => {
    if (
      !loading &&
      !isOwner &&
      (activeTab === "members" || activeTab === "billing")
    ) {
      setActiveTab("organization");
    }
  }, [loading, isOwner, activeTab]);

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    try {
      await api.organizations.inviteMember(inviteEmail, "member");

      // Refetch organization data to get updated member list
      const orgData = await api.organizations.get();
      setOrganization(orgData.organization);
      setMembers(buildMembersArray(orgData.organization));

      toast({
        title: "Invitation sent",
        description: `Invitation sent to ${inviteEmail}`,
      });
      setInviteEmail("");
    } catch (error) {
      console.error("[v0] Failed to invite member:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send invitation",
      });
    }
  };

  const handleRemoveMember = async (memberId: string, memberEmail: string) => {
    if (!confirm(`Are you sure you want to remove ${memberEmail}?`)) {
      return;
    }

    try {
      await api.organizations.removeMember(memberId);
      // Refetch organization data to get updated member list
      const orgData = await api.organizations.get();
      setOrganization(orgData.organization);
      setMembers(buildMembersArray(orgData.organization));

      toast({
        title: "Member removed",
        description: `${memberEmail} has been removed from the organization`,
      });
    } catch (error) {
      console.error("[v0] Failed to remove member:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove member",
      });
    }
  };

  const handleUpgradePlan = async (plan: "starter" | "pro" | "agency") => {
    if (processingPlan) return;

    setProcessingPlan(plan);
    try {
      const response = await api.billing.checkout(plan);
      if (response.url) {
        // Redirect to Stripe checkout
        window.location.href = response.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error: any) {
      console.error("[v0] Failed to create checkout session:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create checkout session",
      });
      setProcessingPlan(null);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const response = await api.billing.portal();
      if (response.url) {
        // Redirect to Stripe billing portal
        window.location.href = response.url;
      } else {
        throw new Error("No portal URL received");
      }
    } catch (error: any) {
      console.error("[v0] Failed to create portal session:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to open billing portal",
      });
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  const planInfo = {
    free: {
      name: "Free",
      price: "Free",
      submissions: 100,
      forms: 1,
      members: 1,
    },
    starter: {
      name: "Starter",
      price: "$9/mo",
      submissions: 1000,
      forms: 5,
      members: 2,
    },
    pro: {
      name: "Pro",
      price: "$29/mo",
      submissions: 5000,
      forms: 20,
      members: 5,
    },
    agency: {
      name: "Agency",
      price: "$79/mo",
      submissions: 20000,
      forms: -1,
      members: -1,
    },
  };

  const currentPlan =
    planInfo[stats?.plan as keyof typeof planInfo] || planInfo.free;
  const usagePercentage =
    ((stats?.submissionsThisMonth || 0) / (stats?.submissionsLimit || 1)) * 100;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">
              Manage your organization and billing
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="organization">Organization</TabsTrigger>
              {isOwner && <TabsTrigger value="members">Members</TabsTrigger>}
              {isOwner && <TabsTrigger value="billing">Billing</TabsTrigger>}
              <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            </TabsList>

            <TabsContent value="organization" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Organization Details</CardTitle>
                  <CardDescription>
                    {isOwner
                      ? "Update your organization information"
                      : "View your organization information"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="orgName">Organization Name</Label>
                    <Input
                      id="orgName"
                      value={organization?.name || ""}
                      disabled={!isOwner}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerEmail">Owner Email</Label>
                    <Input
                      id="ownerEmail"
                      value={organization?.ownerId?.email || user?.email || ""}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="createdDate">Created Date</Label>
                    <Input
                      id="createdDate"
                      value={new Date(
                        organization?.createdAt || Date.now()
                      ).toLocaleDateString()}
                      disabled
                    />
                  </div>
                  {isOwner && (
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Save Changes
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {isOwner && (
              <TabsContent value="members" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>
                      Invite and manage your team members
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <form onSubmit={handleInviteMember} className="flex gap-2">
                      <Input
                        placeholder="email@example.com"
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                      />
                      <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Invite
                      </Button>
                    </form>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {members.map((member) => (
                          <TableRow key={member._id}>
                            <TableCell className="font-medium">
                              {member.email}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="capitalize">
                                {member.role}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-600">
                              {new Date(
                                member.joinedAt || Date.now()
                              ).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              {member.role !== "owner" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleRemoveMember(member._id, member.email)
                                  }
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                        {members.length === 0 && (
                          <TableRow>
                            <TableCell
                              colSpan={4}
                              className="text-center text-gray-500"
                            >
                              No team members yet
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {isOwner && (
              <TabsContent value="billing" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Plan</CardTitle>
                    <CardDescription>
                      Manage your subscription and billing
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {currentPlan.name} Plan
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {currentPlan.price}
                        </p>
                      </div>
                      <Badge className="bg-blue-600">{stats?.plan}</Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          Submissions this month
                        </span>
                        <span className="font-medium text-gray-900">
                          {stats?.submissionsThisMonth?.toLocaleString()} of{" "}
                          {stats?.submissionsLimit?.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={usagePercentage} className="h-2" />
                      <p className="text-xs text-gray-500">
                        Resets on{" "}
                        {new Date(
                          stats?.billingPeriodEnd || Date.now()
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={handleManageSubscription}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Manage Subscription
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Plan Comparison</CardTitle>
                    <CardDescription>
                      Choose the plan that fits your needs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium text-gray-900">
                              Feature
                            </th>
                            <th className="text-center py-3 px-4 font-medium text-gray-900">
                              Free
                            </th>
                            <th className="text-center py-3 px-4 font-medium text-gray-900">
                              Starter
                            </th>
                            <th className="text-center py-3 px-4 font-medium text-gray-900">
                              Pro
                            </th>
                            <th className="text-center py-3 px-4 font-medium text-gray-900">
                              Agency
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-3 px-4 text-gray-600">
                              Submissions
                            </td>
                            <td className="py-3 px-4 text-center">100</td>
                            <td className="py-3 px-4 text-center">1,000</td>
                            <td className="py-3 px-4 text-center">5,000</td>
                            <td className="py-3 px-4 text-center">20,000</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-4 text-gray-600">Forms</td>
                            <td className="py-3 px-4 text-center">1</td>
                            <td className="py-3 px-4 text-center">5</td>
                            <td className="py-3 px-4 text-center">20</td>
                            <td className="py-3 px-4 text-center">Unlimited</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-4 text-gray-600">
                              Team Members
                            </td>
                            <td className="py-3 px-4 text-center">1</td>
                            <td className="py-3 px-4 text-center">2</td>
                            <td className="py-3 px-4 text-center">5</td>
                            <td className="py-3 px-4 text-center">Unlimited</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-4 text-gray-600">
                              API Access
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Check className="w-5 h-5 text-green-600 mx-auto" />
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Check className="w-5 h-5 text-green-600 mx-auto" />
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Check className="w-5 h-5 text-green-600 mx-auto" />
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Check className="w-5 h-5 text-green-600 mx-auto" />
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-4 text-gray-600">
                              Webhooks
                            </td>
                            <td className="py-3 px-4 text-center">-</td>
                            <td className="py-3 px-4 text-center">
                              <Check className="w-5 h-5 text-green-600 mx-auto" />
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Check className="w-5 h-5 text-green-600 mx-auto" />
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Check className="w-5 h-5 text-green-600 mx-auto" />
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-4 text-gray-600">
                              Priority Support
                            </td>
                            <td className="py-3 px-4 text-center">-</td>
                            <td className="py-3 px-4 text-center">-</td>
                            <td className="py-3 px-4 text-center">
                              <Check className="w-5 h-5 text-green-600 mx-auto" />
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Check className="w-5 h-5 text-green-600 mx-auto" />
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-gray-600 font-medium">
                              Price
                            </td>
                            <td className="py-3 px-4 text-center font-semibold">
                              Free
                            </td>
                            <td className="py-3 px-4 text-center font-semibold">
                              $9/mo
                            </td>
                            <td className="py-3 px-4 text-center font-semibold">
                              $29/mo
                            </td>
                            <td className="py-3 px-4 text-center font-semibold">
                              $79/mo
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4"></td>
                            <td className="py-3 px-4 text-center">
                              {stats?.plan === "free" ? (
                                <Badge variant="secondary">Current</Badge>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleUpgradePlan("starter")}
                                  disabled={processingPlan !== null}
                                >
                                  {processingPlan === "starter"
                                    ? "Processing..."
                                    : "Downgrade"}
                                </Button>
                              )}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {stats?.plan === "starter" ? (
                                <Badge variant="secondary">Current</Badge>
                              ) : (
                                <Button
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700"
                                  onClick={() => handleUpgradePlan("starter")}
                                  disabled={processingPlan !== null}
                                >
                                  {processingPlan === "starter"
                                    ? "Processing..."
                                    : stats?.plan === "free"
                                    ? "Upgrade"
                                    : stats?.plan === "pro" ||
                                      stats?.plan === "agency"
                                    ? "Downgrade"
                                    : "Select"}
                                </Button>
                              )}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {stats?.plan === "pro" ? (
                                <Badge variant="secondary">Current</Badge>
                              ) : (
                                <Button
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700"
                                  onClick={() => handleUpgradePlan("pro")}
                                  disabled={processingPlan !== null}
                                >
                                  {processingPlan === "pro"
                                    ? "Processing..."
                                    : stats?.plan === "agency"
                                    ? "Downgrade"
                                    : "Upgrade"}
                                </Button>
                              )}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {stats?.plan === "agency" ? (
                                <Badge variant="secondary">Current</Badge>
                              ) : (
                                <Button
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700"
                                  onClick={() => handleUpgradePlan("agency")}
                                  disabled={processingPlan !== null}
                                >
                                  {processingPlan === "agency"
                                    ? "Processing..."
                                    : "Upgrade"}
                                </Button>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            <TabsContent value="api-keys" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>
                    Manage API keys for all your forms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Form Name</TableHead>
                        <TableHead>Domain</TableHead>
                        <TableHead>API Key</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {forms.map((form) => (
                        <TableRow key={form._id}>
                          <TableCell className="font-medium">
                            {form.name}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {form.domain}
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {form.apiKey.slice(0, 20)}...
                            </code>
                          </TableCell>
                          <TableCell className="text-right">
                            <CopyButton text={form.apiKey} />
                          </TableCell>
                        </TableRow>
                      ))}
                      {forms.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center text-gray-500"
                          >
                            No forms yet
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <ProtectedRoute>
          <DashboardLayout>
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
            </div>
          </DashboardLayout>
        </ProtectedRoute>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}

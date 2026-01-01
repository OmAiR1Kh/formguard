"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout } from "@/components/dashboard-layout";
import { StatCard } from "@/components/stat-card";
import { QualityScoreBadge } from "@/components/quality-score-badge";
import { ActionBadge } from "@/components/action-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle, CheckCircle2, FileText, XCircle } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface DashboardStats {
  totalForms: number;
  totalSubmissions: number;
  submissionsThisMonth: number;
  submissionsLimit: number;
  flaggedSubmissions: number;
  blockedSubmissions: number;
  avgQualityScore: number;
  plan: string;
}

interface Submission {
  _id: string;
  email: string;
  formId: {
    _id: string;
    name: string;
    domain: string;
  };
  organizationId: string;
  ip: string;
  country: string;
  city: string;
  device: string;
  browser: string;
  completionTime: number;
  qualityScore: number;
  action: "allowed" | "flagged" | "blocked";
  fields: Record<string, any>;
  flags: {
    vpn: boolean;
    proxy: boolean;
    disposableEmail: boolean;
    duplicate: boolean;
    fastCompletion: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

// Helper function to process submissions into chart data
const processChartData = (submissions: Submission[]) => {
  // Submissions Over Time - group by date
  const submissionsByDate = new Map<
    string,
    { count: number; totalScore: number; dateObj: Date }
  >();

  submissions.forEach((submission) => {
    const date = new Date(submission.createdAt);
    // Use ISO date string (YYYY-MM-DD) as key for proper sorting
    const dateKey = date.toISOString().split("T")[0];

    const existing = submissionsByDate.get(dateKey);
    if (existing) {
      existing.count++;
      existing.totalScore += submission.qualityScore;
    } else {
      submissionsByDate.set(dateKey, {
        count: 1,
        totalScore: submission.qualityScore,
        dateObj: date,
      });
    }
  });

  // Convert to array format and calculate average scores, then sort by date
  const submissionsOverTime = Array.from(submissionsByDate.entries())
    .map(([dateKey, data]) => ({
      date: data.dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      count: data.count,
      avgScore: Math.round(data.totalScore / data.count),
      dateObj: data.dateObj,
    }))
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())
    .map(({ dateObj, ...rest }) => rest); // Remove dateObj from final result

  // Score Distribution - group by ranges
  const scoreRanges = {
    "0-20": 0,
    "21-40": 0,
    "41-60": 0,
    "61-80": 0,
    "81-100": 0,
  };

  submissions.forEach((submission) => {
    const score = submission.qualityScore;
    if (score <= 20) scoreRanges["0-20"]++;
    else if (score <= 40) scoreRanges["21-40"]++;
    else if (score <= 60) scoreRanges["41-60"]++;
    else if (score <= 80) scoreRanges["61-80"]++;
    else scoreRanges["81-100"]++;
  });

  const scoreDistribution = Object.entries(scoreRanges).map(
    ([range, count]) => ({
      range,
      count,
    })
  );

  return { submissionsOverTime, scoreDistribution };
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [allSubmissions, setAllSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, submissionsData] = await Promise.all([
          api.organizations.getStats(),
          // Fetch more submissions for accurate charts (100 should be enough for charts)
          api.submissions.list({ limit: 100 }),
        ]);
        // API returns { success: true, stats: {...} }
        setStats(statsData.stats);
        // API returns { success: true, submissions: [...], count, total, page, pages }
        const submissions = submissionsData.submissions || [];
        setAllSubmissions(submissions);
      } catch (error) {
        console.error("[v0] Failed to fetch dashboard data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load dashboard data",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Process all submissions into chart data
  const { submissionsOverTime, scoreDistribution } =
    processChartData(allSubmissions);

  // Get only first 10 submissions for the table
  const submissions = allSubmissions.slice(0, 10);

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

  return (
    <ProtectedRoute>
      <DashboardLayout stats={stats || undefined}>
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Submissions"
              value={stats?.totalSubmissions.toLocaleString() || "0"}
              icon={<FileText className="w-6 h-6 text-blue-600" />}
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title="Average Quality Score"
              value={stats?.avgQualityScore || 0}
              icon={<CheckCircle2 className="w-6 h-6 text-green-600" />}
              description="0-100 scale"
            />
            <StatCard
              title="Flagged Submissions"
              value={stats?.flaggedSubmissions || 0}
              icon={<AlertTriangle className="w-6 h-6 text-yellow-600" />}
            />
            <StatCard
              title="Blocked Submissions"
              value={stats?.blockedSubmissions || 0}
              icon={<XCircle className="w-6 h-6 text-red-600" />}
            />
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Submissions Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={submissionsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Score Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={scoreDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="range" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Submissions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Submissions</CardTitle>
                <Link
                  href="/submissions"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {submissions.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No submissions yet</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Submissions will appear here once you start tracking forms
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Form Name</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissions.map((submission) => (
                        <TableRow key={submission._id}>
                          <TableCell className="font-medium">
                            {submission.email}
                          </TableCell>
                          <TableCell>
                            {submission.formId?.name || "Unknown Form"}
                          </TableCell>
                          <TableCell>
                            <QualityScoreBadge
                              score={submission.qualityScore}
                            />
                          </TableCell>
                          <TableCell>
                            <ActionBadge action={submission.action} />
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {new Date(
                              submission.createdAt
                            ).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

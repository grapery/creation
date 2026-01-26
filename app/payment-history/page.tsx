"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Loader2, ArrowLeft, Download, Search, Filter } from "lucide-react";
import { payment, PaymentHistoryQuery } from "@/lib/api/payment";
import { PaymentMethod, PaymentStatus, PaymentRecord } from "@/lib/types/payment";
import { useTranslation } from "@/providers/language-provider";
import { formatDistanceToNow } from "date-fns";

export default function PaymentHistoryPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { t } = useTranslation();

    const [payments, setPayments] = useState<PaymentRecord[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit] = useState(20);

    // Filters
    const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">("all");
    const [methodFilter, setMethodFilter] = useState<PaymentMethod | "all">("all");

    useEffect(() => {
        if (!user) {
            router.push("/login");
            return;
        }

        fetchPaymentHistory();
    }, [user, page, statusFilter, methodFilter]);

    const fetchPaymentHistory = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            const query: PaymentHistoryQuery = {
                page,
                limit,
            };

            if (statusFilter !== "all") {
                query.status = statusFilter;
            }
            if (methodFilter !== "all") {
                query.method = methodFilter;
            }

            const response = await payment.getPaymentHistory(query);
            setPayments(response.payments);
            setTotal(response.total);
        } catch (error: any) {
            console.error("Failed to fetch payment history:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: PaymentStatus) => {
        switch (status) {
            case PaymentStatus.SUCCEEDED:
                return "bg-green-500/10 text-green-500 border-green-500/20";
            case PaymentStatus.FAILED:
                return "bg-red-500/10 text-red-500 border-red-500/20";
            case PaymentStatus.PENDING:
                return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case PaymentStatus.REFUNDED:
                return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            default:
                return "bg-gray-500/10 text-gray-500 border-gray-500/20";
        }
    };

    const getMethodLabel = (method: PaymentMethod) => {
        switch (method) {
            case PaymentMethod.STRIPE:
                return "Card";
            case PaymentMethod.GOOGLE_PAY:
                return "Google Pay";
            case PaymentMethod.APPLE_PAY:
                return "Apple Pay";
            case PaymentMethod.ALIPAY:
                return "Alipay";
            default:
                return method;
        }
    };

    const formatAmount = (amount: number, currency: string) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
        }).format(amount / 100);
    };

    const exportHistory = async () => {
        // Export functionality
        const csv = [
            ["Date", "Plan", "Amount", "Method", "Status"].join(","),
            ...payments.map((p) => [
                new Date(p.createdAt).toLocaleDateString(),
                p.planId,
                formatAmount(p.amount, p.currency),
                getMethodLabel(p.method),
                p.status,
            ].join(",")),
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `payment-history-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" onClick={() => router.back()}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold">Payment History</h1>
                                <p className="text-sm text-muted-foreground">
                                    View and manage your payment records
                                </p>
                            </div>
                        </div>
                        <Button onClick={exportHistory} variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Records</CardTitle>
                        <CardDescription>
                            Total {total} payment{total !== 1 ? "s" : ""} found
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Filters */}
                        <div className="flex gap-4 mb-6">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Filters:</span>
                            </div>
                            <Select
                                value={statusFilter}
                                onValueChange={(value) => {
                                    setStatusFilter(value as any);
                                    setPage(1);
                                }}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value={PaymentStatus.SUCCEEDED}>Succeeded</SelectItem>
                                    <SelectItem value={PaymentStatus.PENDING}>Pending</SelectItem>
                                    <SelectItem value={PaymentStatus.FAILED}>Failed</SelectItem>
                                    <SelectItem value={PaymentStatus.REFUNDED}>Refunded</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={methodFilter}
                                onValueChange={(value) => {
                                    setMethodFilter(value as any);
                                    setPage(1);
                                }}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Payment Method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Methods</SelectItem>
                                    <SelectItem value={PaymentMethod.STRIPE}>Card</SelectItem>
                                    <SelectItem value={PaymentMethod.GOOGLE_PAY}>Google Pay</SelectItem>
                                    <SelectItem value={PaymentMethod.APPLE_PAY}>Apple Pay</SelectItem>
                                    <SelectItem value={PaymentMethod.ALIPAY}>Alipay</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Table */}
                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : payments.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">No payment records found</p>
                            </div>
                        ) : (
                            <>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Plan</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Method</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {payments.map((payment) => (
                                                <TableRow key={payment.id}>
                                                    <TableCell className="font-medium">
                                                        <div>
                                                            <div>{new Date(payment.createdAt).toLocaleDateString()}</div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {formatDistanceToNow(payment.createdAt, { addSuffix: true })}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="capitalize">{payment.planId.replace("_", " ")}</span>
                                                        {payment.metadata?.productName && (
                                                            <div className="text-xs text-muted-foreground">
                                                                {payment.metadata.productName}
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="font-semibold">
                                                            {formatAmount(payment.amount, payment.currency)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-sm">{getMethodLabel(payment.method)}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={getStatusColor(payment.status)}>
                                                            <span className="capitalize">{payment.status}</span>
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => router.push(`/payment-history/${payment.id}`)}
                                                        >
                                                            View
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Pagination */}
                                <div className="flex items-center justify-between mt-6">
                                    <p className="text-sm text-muted-foreground">
                                        Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total}
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage((p) => p + 1)}
                                            disabled={page * limit >= total}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

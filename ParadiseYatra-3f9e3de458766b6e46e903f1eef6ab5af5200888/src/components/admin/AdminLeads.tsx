"use client";

import { useState, useEffect } from "react";
import {
    // Trash2, // unused
    TrendingUp,
    CheckCircle,
    XCircle,
    Clock,
    Mail,
    Phone,
    MapPin,
    IndianRupee,
    MessageSquare,
    Search,
    Filter
} from "lucide-react";
import { toast } from "react-hot-toast";

interface Lead {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    destination: string;
    budget: string;
    message: string;
    status: 'new' | 'contacted' | 'qualified' | 'lost' | 'won';
    timestamp: string;
    packageTitle?: string;
    packagePrice?: string;
    newsletterConsent?: boolean;
}

const AdminLeads = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const response = await fetch("/api/leads", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                setLeads(data.data);
            } else {
                toast.error("Failed to fetch leads");
            }
        } catch (error) {
            console.error("Error fetching leads:", error);
            toast.error("Error fetching leads");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const token = localStorage.getItem("adminToken");
            const response = await fetch(`/api/leads/${id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await response.json();
            if (data.success) {
                setLeads(leads.map((lead) =>
                    lead._id === id ? { ...lead, status: newStatus as any } : lead
                ));
                toast.success("Status updated successfully");
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Error updating status");
        }
    };

    // deleteLead removed as per user request to keep all leads

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-800';
            case 'contacted': return 'bg-yellow-100 text-yellow-800';
            case 'qualified': return 'bg-green-100 text-green-800';
            case 'lost': return 'bg-red-100 text-red-800';
            case 'won': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredLeads = leads.filter(lead => {
        const matchesSearch =
            lead.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.phone.includes(searchTerm);
        const matchesFilter = statusFilter === "all" || lead.status === statusFilter;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="!text-3xl font-bold text-gray-900">Leads Management</h1>
                    <p className="!text-gray-600">Track and manage your potential customers</p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span>Total Leads: {leads.length}</span>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center space-x-2 w-full md:w-auto">
                    <Filter className="text-gray-400 w-5 h-5" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                        <option value="all">All Statuses</option>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="won">Won</option>
                        <option value="lost">Lost</option>
                    </select>
                </div>
            </div>

            {/* Leads List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact Info
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Requirements
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Package Interest
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                {/* Actions column removed */}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredLeads.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No leads found matching your criteria
                                    </td>
                                </tr>
                            ) : (
                                filteredLeads.map((lead) => (
                                    <tr key={lead._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col space-y-1">
                                                <span className="font-medium text-gray-900">{lead.fullName}</span>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Mail className="w-3 h-3 mr-1" />
                                                    {lead.email}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Phone className="w-3 h-3 mr-1" />
                                                    {lead.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col space-y-1 text-sm">
                                                {lead.destination && (
                                                    <div className="flex items-center text-gray-700">
                                                        <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                                                        {lead.destination}
                                                    </div>
                                                )}
                                                {lead.budget && (
                                                    <div className="flex items-center text-gray-700">
                                                        <IndianRupee className="w-3 h-3 mr-1 text-gray-400" />
                                                        {lead.budget}
                                                    </div>
                                                )}
                                                <div className="flex items-start mt-1">
                                                    <MessageSquare className="w-3 h-3 mr-1 mt-1 text-gray-400 flex-shrink-0" />
                                                    <span className="text-gray-500 line-clamp-2" title={lead.message}>
                                                        {lead.message}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {lead.packageTitle ? (
                                                <div className="text-sm">
                                                    <div className="font-medium text-blue-600">{lead.packageTitle}</div>
                                                    {lead.packagePrice && (
                                                        <div className="text-gray-500">{lead.packagePrice}</div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400 italic">General Inquiry</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={lead.status}
                                                onChange={(e) => updateStatus(lead._id, e.target.value)}
                                                className={`text-xs font-semibold rounded-full px-2 py-1 border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer ${getStatusColor(lead.status)}`}
                                            >
                                                <option value="new">New</option>
                                                <option value="contacted">Contacted</option>
                                                <option value="qualified">Qualified</option>
                                                <option value="won">Won</option>
                                                <option value="lost">Lost</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {new Date(lead.timestamp).toLocaleDateString()}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">
                                                {new Date(lead.timestamp).toLocaleTimeString()}
                                            </div>
                                        </td>
                                        {/* Actions cell removed */}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminLeads;

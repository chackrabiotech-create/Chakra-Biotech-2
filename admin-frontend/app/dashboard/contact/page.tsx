"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Search,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  User,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import { contactsApi, ContactSubmission } from "@/lib/api";
import { formatDateTime } from "@/lib/utils/formatters";

const ContactManagement = () => {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedContact, setSelectedContact] =
    useState<ContactSubmission | null>(null);

  const statuses = ["All", "Unread", "Read", "Replied"];

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const response = await contactsApi.getAll({});
      // Extract contacts from nested data structure
      const contactsData = response.data?.contacts || response.data || [];
      setContacts(Array.isArray(contactsData) ? contactsData : []);
    } catch (error) {
      toast.error("Failed to load contacts");
      console.error(error);
      // Set empty array on error
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" ||
      (selectedStatus === "Unread" && !contact.isRead) ||
      (selectedStatus === "Read" && contact.isRead && !contact.isReplied) ||
      (selectedStatus === "Replied" && contact.isReplied);
    return matchesSearch && matchesStatus;
  });

  const markAsRead = async (id: string) => {
    try {
      await contactsApi.markAsRead(id);
      toast.success("Marked as read!");
      loadContacts();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const markAsReplied = async (id: string, notes: string) => {
    try {
      await contactsApi.markAsReplied(id, notes);
      toast.success("Marked as replied!");
      loadContacts();
      setSelectedContact(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    try {
      await contactsApi.delete(id);
      toast.success("Contact deleted successfully!");
      loadContacts();
      setSelectedContact(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete contact");
    }
  };

  const getStatusColor = (contact: ContactSubmission) => {
    if (contact.isReplied) return "bg-green-100 text-green-700";
    if (contact.isRead) return "bg-yellow-100 text-yellow-700";
    return "bg-blue-100 text-blue-700";
  };

  const getStatusText = (contact: ContactSubmission) => {
    if (contact.isReplied) return "Replied";
    if (contact.isRead) return "Read";
    return "New";
  };

  if (loading) {
    return (
      <DashboardLayout title="Contact Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Contact Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-admin-800">
              Contact Inquiries
            </h2>
            <p className="text-admin-600">
              Manage customer inquiries and support requests
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-admin-500 text-sm">Total Contacts</p>
                <p className="text-2xl font-bold text-admin-800">
                  {contacts.length}
                </p>
              </div>
              <MessageSquare className="w-8 h-8 text-saffron-500" />
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-admin-500 text-sm">New Inquiries</p>
                <p className="text-2xl font-bold text-blue-600">
                  {contacts.filter((c) => !c.isRead).length}
                </p>
              </div>
              <Mail className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-admin-500 text-sm">Read</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {contacts.filter((c) => c.isRead && !c.isReplied).length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-admin-500 text-sm">Replied</p>
                <p className="text-2xl font-bold text-green-600">
                  {contacts.filter((c) => c.isReplied).length}
                </p>
              </div>
              <MessageSquare className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-admin-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-field"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-field md:w-48"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Contacts List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredContacts.map((contact, index) => (
            <motion.div
              key={contact._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="card p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => {
                if (!contact.isRead) {
                  markAsRead(contact._id);
                }
                setSelectedContact(contact);
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-saffron-100 to-saffron-200 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-saffron-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-admin-800">
                      {contact.name}
                    </h3>
                    <p className="text-sm text-admin-500">{contact.email}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                    contact
                  )}`}
                >
                  {getStatusText(contact)}
                </span>
              </div>

              <h4 className="font-medium text-admin-800 mb-2">
                {contact.subject}
              </h4>
              <p className="text-admin-600 text-sm mb-4 line-clamp-2">
                {contact.message}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-admin-100">
                <div className="flex items-center space-x-2 text-sm text-admin-500">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDateTime(contact.createdAt)}</span>
                </div>
                {contact.phone && (
                  <div className="flex items-center space-x-2 text-sm text-admin-500">
                    <Phone className="w-4 h-4" />
                    <span>{contact.phone}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-admin-300 mx-auto mb-4" />
            <p className="text-admin-500">No contacts found</p>
          </div>
        )}

        {/* Contact Detail Modal */}
        {selectedContact && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="font-serif text-xl font-semibold text-admin-800 mb-2">
                    Contact Details
                  </h3>
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${getStatusColor(
                      selectedContact
                    )}`}
                  >
                    {getStatusText(selectedContact)}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="text-admin-400 hover:text-admin-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-admin-700 mb-1">
                      Name
                    </label>
                    <p className="text-admin-800">{selectedContact.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-admin-700 mb-1">
                      Email
                    </label>
                    <p className="text-admin-800">{selectedContact.email}</p>
                  </div>
                  {selectedContact.phone && (
                    <div>
                      <label className="block text-sm font-medium text-admin-700 mb-1">
                        Phone
                      </label>
                      <p className="text-admin-800">{selectedContact.phone}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-admin-700 mb-1">
                      Created
                    </label>
                    <p className="text-admin-800">
                      {formatDateTime(selectedContact.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-admin-700 mb-1">
                      Status
                    </label>
                    <p className="text-admin-800">
                      {getStatusText(selectedContact)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-admin-700 mb-2">
                  Subject
                </label>
                <p className="text-admin-800 font-medium">
                  {selectedContact.subject}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-admin-700 mb-2">
                  Message
                </label>
                <div className="bg-admin-50 p-4 rounded-lg">
                  <p className="text-admin-800 whitespace-pre-wrap">
                    {selectedContact.message}
                  </p>
                </div>
              </div>

              {selectedContact.adminNotes && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-admin-700 mb-2">
                    Admin Notes
                  </label>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-admin-800 whitespace-pre-wrap">
                      {selectedContact.adminNotes}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-admin-200">
                <div className="flex items-center space-x-4">
                  {!selectedContact.isReplied && (
                    <button
                      onClick={() => {
                        const notes = prompt("Enter admin notes (optional):");
                        if (notes !== null) {
                          markAsReplied(selectedContact._id, notes);
                        }
                      }}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Mark as Replied</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(selectedContact._id)}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Reply via Email</span>
                  </a>
                  {selectedContact.phone && (
                    <a
                      href={`tel:${selectedContact.phone}`}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ContactManagement;

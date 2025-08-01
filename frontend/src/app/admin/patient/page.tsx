"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card, { CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import axiosInstance from "@/components/axiosInstance";
import { ExternalLink, Import } from "lucide-react";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: "active" | "inactive";
  createdAt: string;
  appointmentCount: number;
}

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axiosInstance.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status) {
        // Assuming the API returns an array of users with the required fields
        const formattedPatients = response.data.data.users.map((user: any) => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          status: user.status || "active", // Default to active if not provided
          createdAt: user.createdAt,
          appointmentCount: user.appointmentCount || 0, // Default to 0 if not provided
        }));
        setPatients(formattedPatients);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePatient = (id: string) => {
    setSelectedPatients((prev) =>
      prev.includes(id) ? prev.filter((patientId) => patientId !== id) : [...prev, id]
    );
  };

  const toggleAllPatients = () => {
    setSelectedPatients((prev) =>
      prev.length === patients.length ? [] : patients.map((patient) => patient.id)
    );
  };

  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "" || patient.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <svg
            className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-gray-600">Loading patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800">Patient Management</h1>
          <Badge variant="info">Admin Panel</Badge>
        </div>
      </div>

      {/* Search and Filter Section */}
      <Card>
        <CardContent>
          {/* Search Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-700 whitespace-nowrap">Search Patients</h2>

            <div className="relative flex-grow max-w-md">
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                }
              />
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <select
                  className="appearance-none bg-gray-100 border border-gray-300 rounded-md px-4 py-2 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-4 border-gray-200" />

          {/* Patient List Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-600">Showing {filteredPatients.length} patients</p>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="selectAll"
                  className="rounded text-blue-500 focus:ring-blue-500"
                  checked={selectedPatients.length === patients.length}
                  onChange={toggleAllPatients}
                />
                <label htmlFor="selectAll" className="text-sm text-gray-600">Select All</label>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Import className="h-4 w-4 mr-2 text-blue-600" />
                Import
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2 text-green-600" />
                Export
              </Button>
            </div>
          </div>

          {/* Patient List */}
          <div className="space-y-3">
            {/* Column Headers - Desktop Only */}
            <div className="hidden md:grid grid-cols-12 gap-4 py-3 px-4 bg-gray-100 rounded-lg font-medium text-gray-700">
              <div className="col-span-1"></div>
              <div className="col-span-3">Patient</div>
              <div className="col-span-3">Email</div>
              <div className="col-span-1">Appointments</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2">Created</div>
              <div className="col-span-1">Actions</div>
            </div>

            {/* Patient Items */}
            {filteredPatients.map((patient) => (
              <div key={patient.id} className="bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                {/* Desktop View */}
                <div className="hidden md:grid grid-cols-12 gap-4 items-center py-3 px-4">
                  <div className="col-span-1">
                    <input
                      type="checkbox"
                      className="rounded text-blue-500 focus:ring-blue-500"
                      checked={selectedPatients.includes(patient.id)}
                      onChange={() => togglePatient(patient.id)}
                    />
                  </div>
                  <div className="col-span-3 flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-cover bg-center bg-gray-200 flex items-center justify-center text-gray-600">
                      {patient.firstName[0]}{patient.lastName[0]}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {patient.firstName} {patient.lastName}
                      </h3>
                    </div>
                  </div>
                  <div className="col-span-3">
                    <p className="text-sm text-gray-600 line-clamp-1">{patient.email}</p>
                  </div>
                  <div className="col-span-1">
                    <span className="text-sm text-gray-600">{patient.appointmentCount} appointments</span>
                  </div>
                  <div className="col-span-1">
                    <Badge variant={patient.status === "active" ? "success" : "danger"}>
                      {patient.status}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm text-gray-600">
                      {new Date(patient.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="col-span-1">
                    <div className="flex space-x-2">
                      <Link href={`/admin/patients/edit/${patient.id}`}>
                        <Button variant="ghost" size="sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-red-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Mobile View */}
                <div className="md:hidden p-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      className="rounded text-blue-500 focus:ring-blue-500 mt-1"
                      checked={selectedPatients.includes(patient.id)}
                      onChange={() => togglePatient(patient.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-start space-x-3 mb-2">
                        <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-600">
                          {patient.firstName[0]}{patient.lastName[0]}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {patient.firstName} {patient.lastName}
                          </h3>
                          <p className="text-sm text-gray-600">{patient.appointmentCount} appointments</p>
                        </div>
                        <Badge variant={patient.status === "active" ? "success" : "danger"}>
                          {patient.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{patient.email}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Created: {new Date(patient.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex space-x-2">
                          <Link href={`/admin/patients/edit/${patient.id}`}>
                            <Button variant="ghost" size="sm">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-red-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredPatients.length === 0 && (
            <div className="text-center py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
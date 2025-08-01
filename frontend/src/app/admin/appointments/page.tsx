"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card, { CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Table, {
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import axiosInstance from "@/components/axiosInstance";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown";
import { handleAppointmentAction } from "./appointmentAction";
import { MoreHorizontal } from "lucide-react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Appointment {
  id: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  type: string;
  appointmentDate: string;
  symptoms: string;
  diagnosis: string | null;
  prescription: string | null;
  notes: string;
  fee: number;
  uploadedReport: string | null;
  paymentStatus: string | null;
  promocode: string | null;
  doctor: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}

interface Stats {
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
}

interface Notification {
  type: "success" | "error";
  message: string;
}


export default function AppointmentManagement() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    dateRange: "",
    doctor: "",
    department: "",
    status: "",
    payment: "",
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await axiosInstance.get("/appointments", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          const data =
            response.data.data?.appointments ||
            response.data.appointments ||
            [];
          if (data.length > 0) {
            const formattedData = data.map((apt: any) => {
              let validDate = new Date();
              if (apt.appointmentDate) {
                const date = new Date(apt.appointmentDate);
                if (!isNaN(date.getTime())) {
                  validDate = date;
                } else {
                  console.warn(
                    `Invalid date for appointment ${apt.id}: ${apt.appointmentDate}, using current date instead`
                  );
                }
              } else {
                console.warn(
                  `Missing appointmentDate for appointment ${apt.id}, using current date instead`
                );
              }
              return {
                ...apt,
                appointmentDate: validDate.toISOString(),
                isPaid: apt.paymentStatus === "paid",
                isCompleted: apt.status === "completed",
              };
            });
            setAppointments(formattedData);
            setStats(
              response.data.data?.stats || {
                total: 0,
                confirmed: 0,
                pending: 0,
                cancelled: 0,
              }
            );
          } else {
            setError("No appointments available at this time.");
          }
        } else {
          setError("Unable to load appointments at this time.");
        }
      } catch (error: any) {
        setError(error.message || "Unable to load appointments at this time.");
        console.error("Error fetching appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    const nstOffset = 5 * 60 + 45; // Nepal Standard Time offset
    date.setMinutes(date.getMinutes() + nstOffset);
    return {
      date: date.toLocaleDateString("en-NP", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-NP", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const filteredAppointments = appointments.filter((apt) => {
    const { date } = formatDateTime(apt.appointmentDate);
    const filterDate = filters.dateRange
      ? new Date(filters.dateRange).toLocaleDateString("en-NP", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
      : "";
    return (
      (!filterDate || date.includes(filterDate)) &&
      (!filters.doctor ||
        apt.doctor.toLowerCase().includes(filters.doctor.toLowerCase())) &&
      (!filters.department ||
        apt.type.toLowerCase().includes(filters.department.toLowerCase())) &&
      (!filters.status ||
        apt.status.toLowerCase() === filters.status.toLowerCase()) &&
      (!filters.payment ||
        (apt.paymentStatus || "").toLowerCase() ===
          filters.payment.toLowerCase())
    );
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-8 bg-white shadow-sm rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Appointment Management
            </h1>
            <Badge variant="info" size="sm">
              Admin Panel
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Admin Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        <Card variant="default" padding="md">
          <CardContent>
            <div className="mb-8">
              <div className="grid grid-cols-5 gap-4 mb-2">
                <div className="font-medium text-gray-700">Date Range</div>
                <div className="font-medium text-gray-700">Doctor</div>
                <div className="font-medium text-gray-700">Department</div>
                <div className="font-medium text-gray-700">Status</div>
                <div className="font-medium text-gray-700">Payment</div>
              </div>
              <div className="grid grid-cols-5 gap-4 items-end text-center text-gray-500">
                {error}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {notification && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md ${
            notification.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {notification.message}
          <button
            className="ml-2 text-sm"
            onClick={() => setNotification(null)}
          >
            ×
          </button>
        </div>
      )}

      {showCancelDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Cancellation</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this appointment?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                onClick={() => setShowCancelDialog(null)}
                disabled={isProcessing}
              >
                No
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                onClick={() =>
                  handleAppointmentAction(
                    showCancelDialog,
                    "cancel",
                    setAppointments,
                    setIsProcessing,
                    setNotification,
                    setShowCancelDialog,
                    router
                  )
                }
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8 bg-white shadow-sm rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Appointment Management
          </h1>
          <Badge variant="info" size="sm">
            Admin Panel
          </Badge>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add New Appointment
          </Button>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Admin Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <Card variant="default" padding="md">
        <CardContent>
          <div className="mb-8">
            <div className="grid grid-cols-5 gap-4 mb-2">
              <div className="font-medium text-gray-700">Date Range</div>
              <div className="font-medium text-gray-700">Doctor</div>
              <div className="font-medium text-gray-700">Department</div>
              <div className="font-medium text-gray-700">Status</div>
              <div className="font-medium text-gray-700">Payment</div>
            </div>
            <div className="grid grid-cols-5 gap-4 items-end">
              <Input
                type="date"
                value={filters.dateRange}
                onChange={(e) =>
                  handleFilterChange("dateRange", e.target.value)
                }
                className="w-full"
              />
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search doctors..."
                  value={filters.doctor}
                  onChange={(e) => handleFilterChange("doctor", e.target.value)}
                  className="w-full"
                />
                <svg
                  className="absolute right-3 top-3 text-gray-400 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12a3 3 0 100-6 3 3 0 000 6zm0 2c-1.657 0-3 .895-3 2 0 .552.448 1 1 1h4c.552 0 1-.448 1-1 0-1.105-1.343-2-3-2z" />
                </svg>
              </div>
              <div className="relative">
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.department}
                  onChange={(e) =>
                    handleFilterChange("department", e.target.value)
                  }
                >
                  <option value="">Departments</option>
                  <option value="consultation">Consultation</option>
                </select>
                <svg
                  className="absolute right-6 top-3 text-gray-400 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="relative">
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <option value="">Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
                <svg
                  className="absolute right-6 top-3 text-gray-400 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative flex-grow">
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.payment}
                    onChange={(e) =>
                      handleFilterChange("payment", e.target.value)
                    }
                  >
                    <option value="">Payment</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                  <svg
                    className="absolute right-6 top-3 text-gray-400 h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                  </svg>
                </div>
                <Button variant="primary" size="md" className="h-[42px]">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Today’s Appointments</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  title: "Total",
                  value: stats.total,
                  color: "bg-blue-50",
                  textColor: "text-blue-600",
                  iconColor: "text-blue-400",
                },
                {
                  title: "Confirmed",
                  value: stats.confirmed,
                  color: "bg-green-50",
                  textColor: "text-green-600",
                  iconColor: "text-green-400",
                },
                {
                  title: "Pending",
                  value: stats.pending,
                  color: "bg-yellow-50",
                  textColor: "text-yellow-600",
                  iconColor: "text-yellow-400",
                },
                {
                  title: "Cancelled",
                  value: stats.cancelled,
                  color: "bg-red-50",
                  textColor: "text-red-600",
                  iconColor: "text-red-400",
                },
              ].map((stat, index) => (
                <div key={index} className={`${stat.color} p-4 rounded-lg`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className={`text-3xl font-bold ${stat.textColor}`}>
                        {stat.value}
                      </p>
                      <p className="text-gray-600">{stat.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">All Appointments</h2>
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                No appointments found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppointments.map((appointment) => {
                      const { date, time } = formatDateTime(
                        appointment.appointmentDate
                      );
                      return (
                        <TableRow key={appointment.id}>
                          <TableCell>
                            <div className="font-medium text-gray-900">
                              {date}
                            </div>
                            <div className="text-gray-500">{time}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-gray-900">
                              {appointment.user?.firstName || "Unknown"}{" "}
                              {appointment.user?.lastName || "User"}
                            </div>
                            <div className="text-gray-500">
                              ID: {appointment.user?.id || "N/A"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-gray-900">
                              Dr. {appointment.doctor}
                            </div>
                            <div className="text-gray-500">
                              {appointment.type}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-500">
                            {appointment.type}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                appointment.status === "confirmed"
                                  ? "success"
                                  : appointment.status === "pending"
                                  ? "warning"
                                  : appointment.status === "cancelled"
                                  ? "danger"
                                  : "secondary"
                              }
                            >
                              {appointment.status.charAt(0).toUpperCase() +
                                appointment.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                appointment.paymentStatus === "paid"
                                  ? "success"
                                  : "danger"
                              }
                            >
                              {appointment.paymentStatus || "Unpaid"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-8 h-8"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 bg-white">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {appointment.status === "pending" && (
                                  <>
                                    <DropdownMenuItem>
                                      <Button
                                        variant="primary"
                                        size="sm"
                                        className="w-full text-left"
                                        onClick={() =>
                                          handleAppointmentAction(
                                            appointment.id,
                                            "confirm",
                                            setAppointments,
                                            setIsProcessing,
                                            setNotification,
                                            undefined,
                                            router
                                          )
                                        }
                                        disabled={isProcessing}
                                      >
                                        Confirm Appointment
                                      </Button>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Button
                                        variant="danger"
                                        size="sm"
                                        className="w-full text-left"
                                        onClick={() => setShowCancelDialog(appointment.id)}
                                        disabled={isProcessing}
                                      >
                                        Cancel Appointment
                                      </Button>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Button
                                        variant="secondary"
                                        size="sm"
                                        className="w-full text-left"
                                        onClick={() =>
                                          handleAppointmentAction(
                                            appointment.id,
                                            "view",
                                            setAppointments,
                                            setIsProcessing,
                                            setNotification,
                                            undefined,
                                            router
                                          )
                                        }
                                        disabled={isProcessing}
                                      >
                                        View
                                      </Button>
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {appointment.status === "confirmed" && !appointment.paymentStatus && (
                                  <>
                                    <DropdownMenuItem>
                                      <Button
                                        variant="danger"
                                        size="sm"
                                        className="w-full text-left"
                                        onClick={() => setShowCancelDialog(appointment.id)}
                                        disabled={isProcessing}
                                      >
                                        Cancel Appointment
                                      </Button>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Button
                                        variant="primary"
                                        size="sm"
                                        className="w-full text-left"
                                        onClick={() =>
                                          handleAppointmentAction(
                                            appointment.id,
                                            "markAsPaid",
                                            setAppointments,
                                            setIsProcessing,
                                            setNotification,
                                            undefined,
                                            router
                                          )
                                        }
                                        disabled={isProcessing}
                                      >
                                        Mark as Paid
                                      </Button>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Button
                                        variant="primary"
                                        size="sm"
                                        className="w-full text-left"
                                        onClick={() =>
                                          handleAppointmentAction(
                                            appointment.id,
                                            "unconfirm",
                                            setAppointments,
                                            setIsProcessing,
                                            setNotification,
                                            undefined,
                                            router
                                          )
                                        }
                                        disabled={isProcessing}
                                      >
                                        Unconfirm Appointment
                                      </Button>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Button
                                        variant="secondary"
                                        size="sm"
                                        className="w-full text-left"
                                        onClick={() =>
                                          handleAppointmentAction(
                                            appointment.id,
                                            "view",
                                            setAppointments,
                                            setIsProcessing,
                                            setNotification,
                                            undefined,
                                            router
                                          )
                                        }
                                        disabled={isProcessing}
                                      >
                                        View
                                      </Button>
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {appointment.status === "confirmed" && appointment.paymentStatus === "paid" && (
                                  <>
                                    <DropdownMenuItem>
                                      <Button
                                        variant="primary"
                                        size="sm"
                                        className="w-full text-left"
                                        onClick={() =>
                                          handleAppointmentAction(
                                            appointment.id,
                                            "markAsCompleted",
                                            setAppointments,
                                            setIsProcessing,
                                            setNotification,
                                            undefined,
                                            router
                                          )
                                        }
                                        disabled={isProcessing}
                                      >
                                        Mark as Completed
                                      </Button>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Button
                                        variant="secondary"
                                        size="sm"
                                        className="w-full text-left"
                                        onClick={() =>
                                          handleAppointmentAction(
                                            appointment.id,
                                            "view",
                                            setAppointments,
                                            setIsProcessing,
                                            setNotification,
                                            undefined,
                                            router
                                          )
                                        }
                                        disabled={isProcessing}
                                      >
                                        View
                                      </Button>
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {appointment.status === "completed" && (
                                  <DropdownMenuItem>
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      className="w-full text-left"
                                      onClick={() =>
                                        handleAppointmentAction(
                                          appointment.id,
                                          "view",
                                          setAppointments,
                                          setIsProcessing,
                                          setNotification,
                                          undefined,
                                          router
                                        )
                                      }
                                      disabled={isProcessing}
                                    >
                                      View
                                    </Button>
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}

            {filteredAppointments.length > 0 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                  Showing 1 to {filteredAppointments.length} of{" "}
                  {appointments.length} results
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Card, { CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import axiosInstance from "@/components/axiosInstance";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Appointment {
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

interface Notification {
  type: "success" | "error";
  message: string;
}

const hardcodedDoctorInfo = {
  name: "Dr. John Smith",
  specialization: "General Physician",
  contact: "john.smith@hospital.com",
};

const hardcodedDepartmentInfo = {
  name: "General Medicine",
  location: "Building A, Floor 2",
  contact: "+977-1-1234567",
};

export default function AppointmentDetail() {
  const { id } = useParams();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await axiosInstance.get(`/appointments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          const data = response.data.data;
          if (data) {
            const validDate = new Date(data.appointmentDate);
            if (isNaN(validDate.getTime())) {
              console.warn(
                `Invalid date for appointment ${data.id}: ${data.appointmentDate}, using current date instead`
              );
              data.appointmentDate = new Date().toISOString();
            }
            setAppointment(data);
          } else {
            setError("No appointment data available.");
          }
        } else {
          setError("Unable to load appointment details at this time.");
        }
      } catch (error: any) {
        setError(error.message || "Unable to load appointment details at this time.");
        console.error("Error fetching appointment:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchAppointment();
    }
  }, [id]);

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

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="container mx-auto p-4">
        <Card variant="default" padding="md">
          <CardContent>
            <div className="text-center text-gray-500">{error || "No appointment found."}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { date, time } = formatDateTime(appointment.appointmentDate);

  return (
    <div className="container mx-auto p-4">
      {/* Notification */}
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

      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-white shadow-sm rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Appointment Details
          </h1>
          <Badge variant="info" size="sm">
            ID: {appointment.id}
          </Badge>
        </div>
        <Button variant="primary" onClick={() => window.history.back()}>
          Back to Appointments
        </Button>
      </div>

      {/* Main Content */}
      <Card variant="default" padding="md">
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Appointment Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Appointment Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Date & Time:</span>
                  <span className="text-gray-600">{`${date}, ${time}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Status:</span>
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
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Type:</span>
                  <span className="text-gray-600">{appointment.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Fee:</span>
                  <span className="text-gray-600">NPR {appointment.fee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Payment Status:</span>
                  <Badge
                    variant={
                      appointment.paymentStatus === "paid" ? "success" : "danger"
                    }
                  >
                    {appointment.paymentStatus || "Unpaid"}
                  </Badge>
                </div>
                {appointment.promocode && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Promocode:</span>
                    <span className="text-gray-600">{appointment.promocode}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Patient Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Patient Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Name:</span>
                  <span className="text-gray-600">
                    {`${appointment.user.firstName} ${appointment.user.lastName}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">ID:</span>
                  <span className="text-gray-600">{appointment.user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="text-gray-600">{appointment.user.email}</span>
                </div>
              </div>
            </div>

            {/* Doctor Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Doctor Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Name:</span>
                  <span className="text-gray-600">{hardcodedDoctorInfo.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Specialization:</span>
                  <span className="text-gray-600">{hardcodedDoctorInfo.specialization}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Contact:</span>
                  <span className="text-gray-600">{hardcodedDoctorInfo.contact}</span>
                </div>
              </div>
            </div>

            {/* Department Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Department Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Name:</span>
                  <span className="text-gray-600">{hardcodedDepartmentInfo.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Location:</span>
                  <span className="text-gray-600">{hardcodedDepartmentInfo.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Contact:</span>
                  <span className="text-gray-600">{hardcodedDepartmentInfo.contact}</span>
                </div>
              </div>
            </div>

            {/* Medical Details */}
            <div className="col-span-2">
              <h2 className="text-lg font-semibold mb-4">Medical Details</h2>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Symptoms:</span>
                  <p className="text-gray-600">{appointment.symptoms || "N/A"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Diagnosis:</span>
                  <p className="text-gray-600">{appointment.diagnosis || "N/A"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Prescription:</span>
                  <p className="text-gray-600">{appointment.prescription || "N/A"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Notes:</span>
                  <p className="text-gray-600">{appointment.notes || "N/A"}</p>
                </div>
                {appointment.uploadedReport && (
                  <div>
                    <span className="font-medium text-gray-700">Uploaded Report:</span>
                    <a
                      href={appointment.uploadedReport}
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Report
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Audit Information */}
            <div className="col-span-2">
              <h2 className="text-lg font-semibold mb-4">Audit Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Created At:</span>
                  <span className="text-gray-600">
                    {formatDateTime(appointment.createdAt).date}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Updated At:</span>
                  <span className="text-gray-600">
                    {formatDateTime(appointment.updatedAt).date}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
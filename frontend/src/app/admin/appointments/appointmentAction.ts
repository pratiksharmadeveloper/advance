import axiosInstance from "@/components/axiosInstance";
import {Appointment} from "./page";

interface Notification {
  type: "success" | "error";
  message: string;
}

export const handleAppointmentAction = async (
  appointmentId: string,
  action: "confirm" | "cancel" | "view" | "markAsPaid" | "unconfirm" | "markAsCompleted",
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>,
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>,
  setNotification: React.Dispatch<React.SetStateAction<Notification | null>>,
  setShowCancelDialog?: React.Dispatch<React.SetStateAction<string | null>>,
  router?: any // For navigation in case of 'view' action
) => {
  setIsProcessing(true);
  const token = localStorage.getItem("token");

  try {
    switch (action) {
      case "confirm":
        const confirmResponse = await axiosInstance.patch(
          `/appointments/${appointmentId}/confirmed`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (confirmResponse.status === 200) {
          setAppointments((prev) =>
            prev.map((apt) =>
              apt.id === appointmentId ? { ...apt, status: "confirmed" } : apt
            )
          );
          setNotification({
            type: "success",
            message: "Appointment confirmed successfully",
          });
        }
        break;

      case "cancel":
        const cancelResponse = await axiosInstance.patch(
          `/appointments/${appointmentId}/cancelled`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (cancelResponse.status === 200) {
          setAppointments((prev) =>
            prev.map((apt) =>
              apt.id === appointmentId ? { ...apt, status: "cancelled" } : apt
            )
          );
          setNotification({
            type: "success",
            message: "Appointment cancelled successfully",
          });
          if (setShowCancelDialog) {
            setShowCancelDialog(null);
          }
        }
        break;

      case "view":
        if (router) {
          router.push(`/admin/appointments/${appointmentId}`);
        } else {
          console.warn("Router not provided for view action");
          setNotification({
            type: "error",
            message: "Navigation not available",
          });
        }
        break;

      case "markAsPaid":
        const paidResponse = await axiosInstance.patch(
          `/appointments/payment/${appointmentId}`,
          { paymentStatus: "paid" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (paidResponse.status === 200) {
          setAppointments((prev) =>
            prev.map((apt) =>
              apt.id === appointmentId ? { ...apt, paymentStatus: "paid" } : apt
            )
          );
          setNotification({
            type: "success",
            message: "Appointment marked as paid successfully",
          });
        }
        break;

      case "unconfirm":
        const unconfirmResponse = await axiosInstance.patch(
          `/appointments/${appointmentId}/pending`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (unconfirmResponse.status === 200) {
          setAppointments((prev) =>
            prev.map((apt) =>
              apt.id === appointmentId ? { ...apt, status: "pending" } : apt
            )
          );
          setNotification({
            type: "success",
            message: "Appointment unconfirmed successfully",
          });
        }
        break;

      case "markAsCompleted":
        const completeResponse = await axiosInstance.patch(
          `/appointments/${appointmentId}/completed`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (completeResponse.status === 200) {
          setAppointments((prev) =>
            prev.map((apt) =>
              apt.id === appointmentId ? { ...apt, status: "completed" } : apt
            )
          );
          setNotification({
            type: "success",
            message: "Appointment marked as completed successfully",
          });
        }
        break;

      default:
        throw new Error("Invalid action");
    }
  } catch (error) {
    console.error(`Error performing ${action} action:`, error);
    setNotification({
      type: "error",
      message: `Failed to ${action} appointment. Please try again.`,
    });
  } finally {
    setIsProcessing(false);
  }
};
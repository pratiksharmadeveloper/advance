import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Doctor } from "./Doctor";
import { IAppointment } from "../interfaces/IAppointment";
import {
  AppointmentStatus,
  AppointmentType,
} from "../interfaces/AppointmentStatus";

@Entity("appointments")
export class Appointment implements IAppointment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "datetime" })
  appointmentDate!: Date;

  @Column({
    type: "enum",
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus = AppointmentStatus.PENDING;

  @Column({
    type: "enum",
    enum: AppointmentType,
    default: AppointmentType.CONSULTATION,
  })
  type: AppointmentType = AppointmentType.CONSULTATION;

  @Column({ type: "text", nullable: true })
  symptoms?: string;

  @Column({ type: "text", nullable: true })
  diagnosis: string;

  @Column({ type: "text", nullable: true })
  prescription: string;

  @Column({ type: "text", nullable: true })
  notes: string;

  // department id
  @Column({ nullable: true })
  departmentId: number;

  @Column({ nullable: true })
  fee: number;

  @Column({ nullable: true })
  uploadedReport: string; // uploaded file (pdf or image)

  @ManyToOne(() => User, (user) => user.appointments)
  @JoinColumn()
  user!: User;

  @Column({ type: "enum", enum: ["paid", "unpaid"], nullable: true })
  paymentStatus?: "paid" | "unpaid"; // payment status can be "paid" or "unpaid"

  @Column({ nullable: true })
  promocode: string; // optional field for applying a discount

  @Column({ nullable: true })
  doctor?: string; // optional field for doctor ID

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

export { AppointmentStatus };

import z from "zod";
export const AppointmentParticipantValidator = z.object({
  appointmentId: z.string().nonempty().uuid("Invalid"),
  userId: z.string().nonempty().uuid("Invalid"),
  role: z.enum(["ORGANIZER", "ATTENDEE", "OPTIONAL", "RESOURCE_PERSON"]),
  status: z.enum(["PENDING", "ACCEPTED", "DECLINED", "TENTATIVE"]),
  isRequired: z.boolean().optional(),
  notes: z.string().optional(),
});

export const AppointmentResourceValidator = z.object({
  appointmentId: z.string().nonempty().uuid(),
  resourceId: z.string().nonempty().uuid("Invalid"),
  resourceModel: z.string().nonempty(),
  notes: z.string().optional(),
});

export const AppointmentsValidator = z.object({
  title: z.string().nonempty(),
  description: z.string().optional(),
  startTime: z.date({ coerce: true }),
  endTime: z.date({ coerce: true }),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  appointmentTypeId: z.string().nonempty().uuid("Invalid"),
  organizerId: z.string().nonempty().uuid("Invalid"),
  recurrenceRule: z.string(), // TODO USE CUSTOM RRULE VALIDATOR
  parentId: z.string().nonempty().uuid("Invalid appointment").optional(),
  participants: AppointmentParticipantValidator.omit({
    appointmentId: true,
  })
    .array()
    .optional(),
  resources: AppointmentResourceValidator.omit({ appointmentId: true })
    .array()
    .optional(),
});

export const AppointmentTypeValidator = z.object({
  name: z.string().nonempty(),
  description: z.string().optional(),
  category: z.enum([
    "PROPERTY_VIEWING",
    "INSPECTION",
    "CONSULTATION",
    "TRANSACTION",
    "MAINTENANCE",
    "TENANT_MANAGEMENT",
    "PHOTOGRAPHY",
    "LEGAL",
    "OTHER",
  ]),
  defaultDuration: z.number({ coerce: true }).positive().int(),
  bufferTimeBefore: z.number({ coerce: true }).positive().int(),
  bufferTimeAfter: z.number({ coerce: true }).positive().int(),
  allowOnlineBooking: z.boolean().optional(),
  requiresApproval: z.boolean().optional(),
  maxParticipants: z.number({ coerce: true }).positive().int(),
});

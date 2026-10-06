"use client";

import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {FiSave, FiUser} from "react-icons/fi";

import {Select, Button, DateTimePicker} from "@/components/ui/inputs";
import {useUpdateAppointment} from "@/hooks/useAppointment";
import {useLineStaff} from "@/hooks/useLines";

import type {AppointmentDetail} from "@/types";

const updateSchema = z.object({
    status: z.enum(["pending", "confirmed", "canceled"]).optional(),

    appointment_time: z.date({
        error: "تعیین زمان الزامی است",
    }).nullable(),

    staff: z.string().optional(),
});

type UpdateFormValues = z.infer<typeof updateSchema>;

interface EditAppointmentFormProps {
    appointment: AppointmentDetail;
    onSuccess?: () => void;
}

export default function EditAppointmentForm({
                                                appointment,
                                                onSuccess,
                                            }: EditAppointmentFormProps) {
    const updateMutation = useUpdateAppointment(appointment.id);

    const {data: staffList} = useLineStaff(appointment.line_id);

    const {
        control,
        handleSubmit,
        setError,
        formState: {errors},
    } = useForm<UpdateFormValues>({
        resolver: zodResolver(updateSchema),

        defaultValues: {
            status: appointment.status,

            // بک‌اند Gregorian/ISO
            // فرانت فقط آن را تبدیل به Date می‌کند
            appointment_time: appointment.appointment_time
                ? new Date(appointment.appointment_time)
                : null,

            staff: appointment.staff?.id || "",
        },
    });

    const onSubmit = async (values: UpdateFormValues) => {
        try {
            await updateMutation.mutateAsync({
                status: values.status,

                // Date -> Gregorian ISO
                appointment_time: values.appointment_time
                    ? values.appointment_time.toISOString()
                    : null,

                staff: values.staff || null,
            });

            onSuccess?.();
        } catch (err: any) {
            console.log("UPDATE APPOINTMENT ERROR:", err);
            console.log("RESPONSE:", err?.response);
            console.log("STATUS:", err?.response?.status);
            console.log("DATA:", err?.response?.data);

            if (err?.response?.data) {
                console.log(
                    "BACKEND ERROR:",
                    JSON.stringify(err.response.data, null, 2)
                );
            }

            if (err.fieldErrors) {
                Object.entries(err.fieldErrors).forEach(([field, messages]) => {
                    setError(field as keyof UpdateFormValues, {
                        type: "server",
                        message: Array.isArray(messages)
                            ? messages[0]
                            : String(messages),
                    });
                });
            }
        }
    };

    const staffOptions =
        staffList?.results?.map((s) => {
            const fullName = `${s.user?.first_name ?? ""} ${s.user?.last_name ?? ""}`.trim();

            return {
                value: s.staff_id,
                label: fullName || s.employee_code,
            };
        }) ?? [];

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
        >
            {/* کارشناس */}
            <Controller
                name="staff"
                control={control}
                render={({field, fieldState}) => (
                    <Select
                        label="کارشناس مسئول"
                        options={staffOptions}
                        value={field.value}
                        onChange={field.onChange}
                        error={fieldState.error?.message}
                        icon={<FiUser size={16}/>}
                        placeholder="انتخاب کارشناس..."
                    />
                )}
            />

            {/* تاریخ و ساعت */}
            <Controller
                name="appointment_time"
                control={control}
                render={({field, fieldState}) => (
                    <DateTimePicker
                        label="تاریخ و ساعت نوبت"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        error={fieldState.error?.message}
                        minuteStep={5}
                    />
                )}
            />

            {/* وضعیت */}
            <Controller
                name="status"
                control={control}
                render={({field, fieldState}) => (
                    <Select
                        label="وضعیت نوبت"
                        options={[
                            {
                                value: "pending",
                                label: "در انتظار",
                            },
                            {
                                value: "confirmed",
                                label: "تأیید شده",
                            },
                            {
                                value: "canceled",
                                label: "لغو شده",
                            },
                        ]}
                        value={field.value}
                        onChange={field.onChange}
                        error={fieldState.error?.message}
                    />
                )}
            />

            <div className="flex justify-end border-t border-cream/10 pt-4">
                <Button
                    type="submit"
                    disabled={updateMutation.isPending}
                    variant="primary"
                    className="flex items-center gap-2"
                >
                    <FiSave size={16}/>

                    {updateMutation.isPending
                        ? "در حال ذخیره..."
                        : "ذخیره تغییرات"}
                </Button>
            </div>
        </form>
    );
}
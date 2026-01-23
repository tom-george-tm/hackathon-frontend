import { useState } from "react"
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useNavigate } from "react-router-dom"
import { runtimeApi } from "@/services/instance/axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, PlusCircle, CheckCircle2, User, Briefcase, MessagesSquare, ChevronRight, ChevronLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// --- Schema Definition ---
const memberSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    tms_id: z.string().min(1, "Employee ID is required"),
    is_team_lead: z.boolean(),
})

const registrationSchema = z.object({
    team_name: z.string().min(1, "Team Name is required").max(255),
    leader_name: z.string().min(1, "Leader Name is required"),
    leader_email: z.string().email("Invalid email"),
    leader_id: z.string().min(1, "Leader ID is required"),
    members: z.array(memberSchema).max(3, "Max 3 additional members"),
    project_idea: z.string().min(10, "Please provide a detailed description").max(500),
    impact_statement: z.string().min(10, "Please provide an impact statement").max(500),
    agreed_to_rules: z.boolean().refine((val) => val === true, {
        message: "You must agree to the rules",
    }),
})

type RegistrationFormValues = z.infer<typeof registrationSchema>

export function Register() {
    const navigate = useNavigate()
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<RegistrationFormValues>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            team_name: "",
            leader_name: "",
            leader_email: "",
            leader_id: "",
            members: [],
            project_idea: "",
            impact_statement: "",
            agreed_to_rules: false,
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "members",
    })

    const nextStep = async () => {
        const fieldsToValidate = step === 1
            ? ["team_name", "leader_name", "leader_email", "leader_id"]
            : step === 2
                ? ["members"]
                : ["project_idea", "impact_statement", "agreed_to_rules"]

        const isValid = await form.trigger(fieldsToValidate as any)
        if (isValid) setStep(s => Math.min(s + 1, 3))
    }

    const prevStep = () => setStep(s => Math.max(s - 1, 1))

    const onSubmit: SubmitHandler<RegistrationFormValues> = async (data) => {
        setIsSubmitting(true)
        try {
            const payload = {
                team_name: data.team_name,
                idea_description: data.project_idea,
                impact_description: data.impact_statement,
                members: [
                    {
                        name: data.leader_name,
                        tms_id: data.leader_id,
                        email: data.leader_email,
                        is_team_lead: true
                    },
                    ...data.members.map(m => ({
                        name: m.name,
                        tms_id: m.tms_id,
                        email: m.email,
                        is_team_lead: false
                    }))
                ]
            }

            await runtimeApi.post("/teams", payload)
            alert("Registration Successful!")
            navigate("/teams")
        } catch (error) {
            console.error("Registration failed", error)
            alert("Registration failed. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0a0f1c] pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-white mb-2">Register Your Team</h1>
                    <p className="text-muted-foreground">Join the movement to build high-impact AI systems. Form your squad of up to 4 innovators.</p>
                </motion.div>

                {/* Steps Navigation */}
                <div className="flex justify-between mb-8 bg-secondary/20 rounded-lg p-2 border border-white/5">
                    {[
                        { id: 1, label: "Team Profile" },
                        { id: 2, label: "Member Details" },
                        { id: 3, label: "Project Pitch" }
                    ].map((s) => (
                        <button
                            key={s.id}
                            type="button"
                            onClick={() => step > s.id && setStep(s.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all ${step === s.id ? 'bg-blue-600/20 text-blue-400' : step > s.id ? 'text-white cursor-pointer hover:bg-white/5' : 'text-muted-foreground cursor-not-allowed'}`}
                        >
                            <div className={`size-6 rounded-full flex items-center justify-center text-xs font-bold border ${step === s.id ? 'border-blue-400 bg-blue-600 text-white' : step > s.id ? 'border-green-500 bg-green-500 text-white' : 'border-white/10 bg-white/5'}`}>
                                {step > s.id ? "✓" : s.id}
                            </div>
                            <span className="text-sm font-medium hidden md:block">{s.label}</span>
                        </button>
                    ))}
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Card className="bg-[#0f1623] border-white/10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />
                        <CardContent className="p-8">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-4">
                                            <Label className="text-blue-400 text-xs font-bold uppercase tracking-wider">Team Information</Label>
                                            <Input
                                                placeholder="Enter your Team Name"
                                                className="bg-secondary/20 border-white/10 h-12 focus:border-blue-500/50"
                                                {...form.register("team_name")}
                                            />
                                            {form.formState.errors.team_name && <p className="text-red-400 text-xs">{form.formState.errors.team_name.message}</p>}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Team Leader Name</Label>
                                                <Input placeholder="Full Name" className="bg-secondary/20 border-white/10" {...form.register("leader_name")} />
                                                {form.formState.errors.leader_name && <p className="text-red-400 text-xs">{form.formState.errors.leader_name.message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Email Address</Label>
                                                <Input placeholder="leader@thoughtminds.com" className="bg-secondary/20 border-white/10" {...form.register("leader_email")} />
                                                {form.formState.errors.leader_email && <p className="text-red-400 text-xs">{form.formState.errors.leader_email.message}</p>}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-muted-foreground text-xs font-bold uppercase tracking-wider">ThoughtMinds Employee ID</Label>
                                            <div className="relative">
                                                <Briefcase className="absolute left-3 top-3  size-4 text-muted-foreground" />
                                                <Input placeholder="TM-XXXXX" className="bg-secondary/20 border-white/10 pl-10" {...form.register("leader_id")} />
                                            </div>
                                            {form.formState.errors.leader_id && <p className="text-red-400 text-xs">{form.formState.errors.leader_id.message}</p>}
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-lg flex items-center gap-2">
                                                <User className="size-5 text-indigo-400" />
                                                Additional Members <span className="text-muted-foreground text-sm font-normal">(Optional)</span>
                                            </h3>
                                            {fields.length < 3 && (
                                                <Button type="button" variant="ghost" size="sm" onClick={() => append({ name: "", email: "", tms_id: "", is_team_lead: false })} className="text-blue-400 hover:text-blue-300">
                                                    <PlusCircle className="size-4 mr-2" /> Add Member
                                                </Button>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            {fields.map((field, index) => (
                                                <motion.div
                                                    key={field.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="p-4 rounded-lg bg-secondary/10 border border-white/5 grid grid-cols-1 md:grid-cols-12 gap-4 items-end relative group"
                                                >
                                                    <div className="md:col-span-4 space-y-2">
                                                        <Label className="text-xs text-muted-foreground">Name</Label>
                                                        <Input {...form.register(`members.${index}.name` as const)} className="bg-black/20" />
                                                    </div>
                                                    <div className="md:col-span-4 space-y-2">
                                                        <Label className="text-xs text-muted-foreground">Email</Label>
                                                        <Input {...form.register(`members.${index}.email` as const)} className="bg-black/20" />
                                                    </div>
                                                    <div className="md:col-span-3 space-y-2">
                                                        <Label className="text-xs text-muted-foreground">Employee ID</Label>
                                                        <Input {...form.register(`members.${index}.tms_id` as const)} className="bg-black/20" placeholder="TM-XXXX" />
                                                    </div>
                                                    <div className="md:col-span-1 flex justify-end">
                                                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-red-400 hover:bg-red-400/10">
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                            {fields.length === 0 && (
                                                <div className="text-center py-12 border border-dashed border-white/10 rounded-lg text-muted-foreground text-sm">
                                                    <p>Proceed with the Team Lead only, or add up to 3 more members.</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-4">
                                            <Label className="text-blue-400 text-xs font-bold uppercase tracking-wider">Project Idea Description</Label>
                                            <Textarea
                                                placeholder="Briefly explain the architecture and core functionality of your AI agent or system..."
                                                className="bg-secondary/20 border-white/10 min-h-[120px]"
                                                {...form.register("project_idea")}
                                            />
                                            {form.formState.errors.project_idea && <p className="text-red-400 text-xs">{form.formState.errors.project_idea.message}</p>}
                                        </div>

                                        <div className="p-6 rounded-lg bg-indigo-900/10 border border-indigo-500/20 space-y-4">
                                            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                                                <MessagesSquare className="size-4" />
                                                IMPACT STATEMENT
                                            </div>
                                            <Textarea
                                                placeholder="How does this tool solve a global problem? Specify the field (Healthcare, Climate, etc.)"
                                                className="bg-black/20 border-white/10 min-h-[120px]"
                                                {...form.register("impact_statement")}
                                            />
                                            {form.formState.errors.impact_statement && <p className="text-red-400 text-xs">{form.formState.errors.impact_statement.message}</p>}
                                        </div>

                                        <div className="flex items-center space-x-2 pt-4">
                                            <Checkbox id="terms" checked={form.watch('agreed_to_rules')} onCheckedChange={(c) => form.setValue('agreed_to_rules', c as boolean)} />
                                            <label htmlFor="terms" className="text-sm text-muted-foreground">
                                                I agree to the <span className="text-white">Rules of Engagement</span>.
                                            </label>
                                        </div>
                                        {form.formState.errors.agreed_to_rules && <p className="text-red-400 text-xs">{form.formState.errors.agreed_to_rules.message}</p>}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Navigation Buttons */}
                            <div className="flex justify-between items-center pt-8 mt-8 border-t border-white/5">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={prevStep}
                                    disabled={step === 1 || isSubmitting}
                                    className="text-muted-foreground"
                                >
                                    <ChevronLeft className="mr-2 size-4" /> Back
                                </Button>

                                {step < 3 ? (
                                    <Button
                                        type="button"
                                        onClick={nextStep}
                                        className="bg-blue-600 hover:bg-blue-700 min-w-[120px]"
                                    >
                                        Next <ChevronRight className="ml-2 size-4" />
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        className="bg-green-600 hover:bg-green-700 min-w-[120px]"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Processing..." : (
                                            <>Submit <CheckCircle2 className="ml-2 size-4" /></>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </form>

                <div className="mt-8 text-center text-sm text-muted-foreground opacity-50">
                    MINDMESH 2025 • Impact First AI Innovation
                </div>
            </div>
        </div>
    )
}

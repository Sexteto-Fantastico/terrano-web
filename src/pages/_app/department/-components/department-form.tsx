import type {FormEvent} from "react";
import {useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {useCreateView} from "@/components/views/create-view";
import {Field, FieldLabel, FieldSet} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { fetchAllUsers} from "@/api/users";
import type {DepartmentManager} from "@/api/departments.ts";

export type DepartmentFormValues = {
    name: string;
    managerId: number;
    managerName: string;
};

interface DepartmentFormProps {
    initialName?: string;
    initialManager?: DepartmentManager | null;
    manager?: DepartmentManager;
    onSubmit: (values: DepartmentFormValues) => Promise<void>;
}

const NO_MANAGER = "none";

export function DepartmentForm({
                                   initialName = "",
                                   initialManager = null,
                                   onSubmit,
                               }: DepartmentFormProps) {
    const {setIsSaving} = useCreateView();
    const [name, setName] = useState(initialName);
    const [managerId, setManagerId] = useState<string>(
        initialManager ? String(initialManager.id) : NO_MANAGER
    );
    const [managerName, setManagerName] = useState(initialManager?.name ?? "");

    const {data: users = [], isLoading: isLoadingUsers} = useQuery({
        queryKey: ["users", "all"],
        queryFn: fetchAllUsers,
    });

    useEffect(() => {
        setName(initialName);
        setManagerId(initialManager ? String(initialManager.id) : NO_MANAGER);
        setManagerName(initialManager?.name ?? "");
    }, [initialName, initialManager]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        event.stopPropagation();

        try {
            setIsSaving(true);
            await onSubmit({
                name: name.trim(),
                managerId: Number(managerId),
                managerName: managerName
            });
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <form id="department-form" className="w-full max-w-lg" onSubmit={handleSubmit}>
            <FieldSet className="space-y-4">
                <Field>
                    <FieldLabel htmlFor="department-name">Nome</FieldLabel>
                    <Input
                        id="department-name"
                        name="name"
                        type="text"
                        placeholder="Nome do departamento"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                    />
                </Field>

                <Field>
                    <FieldLabel htmlFor="department-manager">
                        Usuário responsável
                    </FieldLabel>
                    <Select
                        value={managerId}
                        onValueChange={setManagerId}
                        disabled={isLoadingUsers}
                    >
                        <SelectTrigger id="department-manager" className="w-full">
                            <SelectValue placeholder="Selecione um responsável"/>
                        </SelectTrigger>
                        <SelectContent>
                            {  initialManager ?
                                <SelectItem key={initialManager.id} value={String(initialManager.id)}>
                                    {initialManager.name}
                                </SelectItem>
                                :
                               <SelectItem value={NO_MANAGER}>Sem responsável</SelectItem>
                            }
                            {users.map((user) => (
                                <SelectItem key={user.id} value={String(user.id)}>
                                    {user.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
            </FieldSet>
        </form>
    );
}

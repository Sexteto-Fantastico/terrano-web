import {useState} from "react";
import {
    History,
    ChevronRight,
} from "lucide-react";
import {Switch} from "@/components/ui/switch.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {CreateViewFooter} from "@/components/feature/shared/components/create/create-view-footer.tsx";
import {Form} from "@/components/feature/shared/components/Form.tsx";

export default function CreateView() {
    const [ativo, setAtivo] = useState(true);

    return (
        <div className="flex h-screen bg-white font-sans text-gray-800">

            {/* Main Content */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Header */}
                <header className="px-8 pt-6 pb-4">
                    <h1 className="text-3xl font-light text-gray-900 tracking-tight mb-1">
                        Tela aleatória
                    </h1>

                    {/* Breadcrumb + Actions */}
                    <div className="flex items-center justify-between mt-2">
                        <nav className="flex items-center gap-1 text-sm text-gray-500">
                <span className="hover:text-gray-800 cursor-pointer transition-colors">
                  Home
                </span>
                            <ChevronRight size={14} className="text-gray-300"/>
                            <span className="text-gray-400">Tela aleatória</span>
                        </nav>

                        <div className="flex items-center gap-4">
                            {/* Active Toggle */}
                            <div
                                className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 bg-white shadow-sm">
                                <Switch
                                    checked={ativo}
                                    onCheckedChange={setAtivo}
                                    className="data-[state=checked]:bg-emerald-500"
                                />
                                <span className="text-sm text-gray-600 select-none">
                    {ativo ? "Ativo" : "Inativo"}
                  </span>
                                {ativo && (
                                    <Badge
                                        variant="outline"
                                        className="text-emerald-600 border-emerald-200 bg-emerald-50 text-xs px-1.5 py-0"
                                    >
                                        ON
                                    </Badge>
                                )}
                            </div>

                            {/* Log Button */}
                            <button
                                className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors group">
                                <History
                                    size={14}
                                    className="group-hover:rotate-12 transition-transform"
                                />
                                <span className="underline underline-offset-2">
                    Log do registro #3287
                  </span>
                            </button>
                        </div>
                    </div>
                </header>

                <Separator className="mx-8"/>

                <Form />

                <CreateViewFooter/>
            </div>
        </div>

    );
}
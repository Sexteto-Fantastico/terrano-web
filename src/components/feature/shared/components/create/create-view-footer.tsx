import {SaveButton} from "@/components/feature/shared/components/button/save-button.tsx";
import {CancelButton} from "@/components/feature/shared/components/button/cancel-button.tsx";


export const CreateViewFooter = () => {
    return (
        <footer className="px-8 py-4 border-t border-gray-100 flex justify-end gap-3 bg-white">
            <CancelButton/>
            <SaveButton/>
        </footer>
    )
}
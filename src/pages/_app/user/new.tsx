import { createFileRoute } from "@tanstack/react-router";
import { CreateView } from "@/components/views/create-view";
import { UserForm } from "./-components/user-form";

export const Route = createFileRoute("/_app/user/new")({
  component: UserNewPage,
  head: () => ({
    meta: [{ title: "Usuário" }],
  }),
});

function UserNewPage() {
  return (
    <CreateView formId="user-form">
      <UserForm />
    </CreateView>
  );
}

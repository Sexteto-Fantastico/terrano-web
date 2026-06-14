import { useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPolicies, type Policy } from "@/api/roles";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldLabel } from "@/components/ui/field";

interface AccessProfilePoliciesProps {
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  disabled?: boolean;
}

type ModuleGroup = {
  module: string;
  policies: Policy[];
};

function groupByModule(policies: Policy[]): ModuleGroup[] {
  const groups: Record<string, Policy[]> = {};
  for (const policy of policies) {
    const module = policy.module || "Outros";
    if (!groups[module]) {
      groups[module] = [];
    }
    groups[module].push(policy);
  }
  return Object.entries(groups).map(([module, policies]) => ({
    module,
    policies,
  }));
}

export function AccessProfilePolicies({
  selectedIds,
  onChange,
  disabled,
}: AccessProfilePoliciesProps) {
  const { data: allPolicies = [], isLoading } = useQuery({
    queryKey: ["policies"],
    queryFn: fetchPolicies,
  });

  const moduleGroups = useMemo(() => groupByModule(allPolicies), [allPolicies]);

  const isAllSelected = useMemo(
    () =>
      allPolicies.length > 0 && selectedIds.length === allPolicies.length,
    [allPolicies, selectedIds]
  );

  const handleToggleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        onChange(allPolicies.map((p) => p.id));
      } else {
        onChange([]);
      }
    },
    [allPolicies, onChange]
  );

  function handleTogglePolicy(policyId: number, checked: boolean) {
    if (checked) {
      onChange([...selectedIds, policyId]);
    } else {
      onChange(selectedIds.filter((id) => id !== policyId));
    }
  }

  function handleToggleModule(policies: Policy[], checked: boolean) {
    const moduleIds = policies.map((p) => p.id);
    if (checked) {
      const newIds = [...new Set([...selectedIds, ...moduleIds])];
      onChange(newIds);
    } else {
      onChange(selectedIds.filter((id) => !moduleIds.includes(id)));
    }
  }

  if (isLoading) {
    return <div className="text-muted-foreground text-sm">Carregando permissões...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Checkbox
          id="select-all"
          checked={allPolicies.length > 0 && isAllSelected}
          onCheckedChange={(checked) =>
            handleToggleSelectAll(checked === true)
          }
          disabled={disabled}
        />
        <FieldLabel htmlFor="select-all" className="font-medium cursor-pointer">
          Selecionar todas as permissões
        </FieldLabel>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {moduleGroups.map((group) => {
          const groupSelectedCount = group.policies.filter((p) =>
            selectedIds.includes(p.id)
          ).length;
          const groupAllSelected = groupSelectedCount === group.policies.length;

          return (
            <div key={group.module} className="space-y-2">
              <div className="flex items-center gap-2 border-b pb-1 mb-2">
                <Checkbox
                  id={`module-${group.module}`}
                  checked={groupAllSelected}
                  onCheckedChange={(checked) =>
                    handleToggleModule(group.policies, checked === true)
                  }
                  disabled={disabled}
                />
                <FieldLabel
                  htmlFor={`module-${group.module}`}
                  className="text-sm font-semibold uppercase tracking-wide cursor-pointer"
                >
                  {group.module} ({groupSelectedCount}/{group.policies.length})
                </FieldLabel>
              </div>
              <div className="space-y-1 pl-6">
                {group.policies.map((policy) => (
                  <div key={policy.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`policy-${policy.id}`}
                      checked={selectedIds.includes(policy.id)}
                      onCheckedChange={(checked) =>
                        handleTogglePolicy(policy.id, checked === true)
                      }
                      disabled={disabled}
                    />
                    <FieldLabel
                      htmlFor={`policy-${policy.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {policy.description || policy.name}
                    </FieldLabel>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

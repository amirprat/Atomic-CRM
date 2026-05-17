import { Trash2 } from "lucide-react";
import {
  useCreate,
  useDelete,
  useGetList,
  useGetMany,
  useNotify,
  useRefresh,
  useUpdate,
} from "ra-core";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  DealLifeguard,
  DealLifeguardStatus,
  Lifeguard,
} from "../types";

const STATUSES: { value: DealLifeguardStatus; label: string }[] = [
  { value: "proposed", label: "Proposed" },
  { value: "confirmed", label: "Confirmed" },
  { value: "on_site", label: "On site" },
  { value: "declined", label: "Declined" },
  { value: "replaced", label: "Replaced" },
];

const STATUS_BADGE: Record<DealLifeguardStatus, string> = {
  proposed: "border-zinc-300 dark:border-zinc-700",
  confirmed: "border-blue-300 dark:border-blue-700",
  on_site: "border-green-300 dark:border-green-700",
  declined: "border-orange-300 dark:border-orange-700",
  replaced: "border-zinc-300 dark:border-zinc-700 opacity-60",
};

type Props = {
  dealId: string | number;
  readOnly?: boolean;
};

export const DealLifeguardsSection = ({ dealId, readOnly }: Props) => {
  const notify = useNotify();
  const refresh = useRefresh();

  const { data: allocations = [], isPending } = useGetList<DealLifeguard>(
    "deal_lifeguards",
    {
      filter: { deal_id: dealId },
      sort: { field: "is_primary", order: "DESC" },
      pagination: { page: 1, perPage: 100 },
    },
  );

  const lifeguardIds = Array.from(
    new Set(allocations.map((a) => a.lifeguard_id)),
  );
  const { data: lifeguards = [] } = useGetMany<Lifeguard>(
    "lifeguards",
    { ids: lifeguardIds },
    { enabled: lifeguardIds.length > 0 },
  );
  const lifeguardById = new Map(lifeguards.map((l) => [String(l.id), l]));

  const [pickerOpen, setPickerOpen] = useState(false);
  const [create] = useCreate();
  const [update] = useUpdate();
  const [deleteOne] = useDelete();

  const assignedIds = new Set(
    allocations
      .filter((a) => a.status !== "replaced" && a.status !== "declined")
      .map((a) => String(a.lifeguard_id)),
  );

  const handleAdd = (lifeguardId: string) => {
    create(
      "deal_lifeguards",
      {
        data: {
          deal_id: dealId,
          lifeguard_id: Number(lifeguardId),
          status: "proposed",
          is_primary: allocations.length === 0,
        },
      },
      {
        onSuccess: () => {
          notify("Lifeguard assigned", { type: "info" });
          refresh();
          setPickerOpen(false);
        },
        onError: (e: any) => {
          notify(e?.message || "Failed to assign lifeguard", { type: "error" });
        },
      },
    );
  };

  const handleStatusChange = (
    allocation: DealLifeguard,
    status: DealLifeguardStatus,
  ) => {
    update(
      "deal_lifeguards",
      {
        id: allocation.id,
        data: { status },
        previousData: allocation,
      },
      {
        onSuccess: () => refresh(),
        onError: (e: any) => {
          notify(e?.message || "Failed to update status", { type: "error" });
        },
      },
    );
  };

  const handlePrimary = (allocation: DealLifeguard, isPrimary: boolean) => {
    update(
      "deal_lifeguards",
      {
        id: allocation.id,
        data: { is_primary: isPrimary },
        previousData: allocation,
      },
      {
        onSuccess: () => refresh(),
        onError: (e: any) => {
          notify(e?.message || "Failed to update primary", { type: "error" });
        },
      },
    );
  };

  const handleRemove = (allocation: DealLifeguard) => {
    if (!confirm("Remove this lifeguard from the deal?")) return;
    deleteOne(
      "deal_lifeguards",
      { id: allocation.id, previousData: allocation },
      {
        onSuccess: () => {
          notify("Lifeguard removed", { type: "info" });
          refresh();
        },
        onError: (e: any) => {
          notify(e?.message || "Failed to remove lifeguard", { type: "error" });
        },
      },
    );
  };

  if (isPending) {
    return <div className="text-sm text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="flex flex-col gap-3">
      {allocations.length === 0 ? (
        <p className="text-sm text-muted-foreground">No lifeguards assigned.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {allocations.map((a) => {
            const lg = lifeguardById.get(String(a.lifeguard_id));
            return (
              <div
                key={a.id}
                className={`flex items-center gap-3 p-2 rounded-md border ${
                  a.status === "replaced" ? "opacity-60" : ""
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {lg
                      ? `${lg.first_name} ${lg.last_name}`
                      : `Lifeguard #${a.lifeguard_id}`}
                  </div>
                  {a.is_primary && (
                    <Badge variant="outline" className="mt-1">
                      Primary
                    </Badge>
                  )}
                </div>
                {readOnly ? (
                  <Badge
                    variant="outline"
                    className={STATUS_BADGE[a.status]}
                  >
                    {STATUSES.find((s) => s.value === a.status)?.label ??
                      a.status}
                  </Badge>
                ) : (
                  <>
                    <Select
                      value={a.status}
                      onValueChange={(v) =>
                        handleStatusChange(a, v as DealLifeguardStatus)
                      }
                    >
                      <SelectTrigger className="w-32 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      size="sm"
                      variant={a.is_primary ? "default" : "outline"}
                      className="h-8 text-xs"
                      onClick={() => handlePrimary(a, !a.is_primary)}
                    >
                      {a.is_primary ? "Primary" : "Set primary"}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => handleRemove(a)}
                      aria-label="Remove lifeguard"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!readOnly && (
        <AddLifeguardPicker
          open={pickerOpen}
          setOpen={setPickerOpen}
          excludedIds={assignedIds}
          onPick={handleAdd}
        />
      )}
    </div>
  );
};

const AddLifeguardPicker = ({
  open,
  setOpen,
  excludedIds,
  onPick,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  excludedIds: Set<string>;
  onPick: (lifeguardId: string) => void;
}) => {
  const { data: lifeguards = [], isPending } = useGetList<Lifeguard>(
    "lifeguards",
    {
      filter: { active: true },
      sort: { field: "last_name", order: "ASC" },
      pagination: { page: 1, perPage: 200 },
    },
  );

  const choices = lifeguards.filter((l) => !excludedIds.has(String(l.id)));

  if (!open) {
    return (
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="self-start"
        onClick={() => setOpen(true)}
      >
        + Add lifeguard
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Select onValueChange={onPick}>
        <SelectTrigger className="w-64 h-9">
          <SelectValue placeholder="Pick a lifeguard…" />
        </SelectTrigger>
        <SelectContent>
          {isPending ? (
            <div className="p-2 text-sm text-muted-foreground">Loading…</div>
          ) : choices.length === 0 ? (
            <div className="p-2 text-sm text-muted-foreground">
              No active lifeguards available
            </div>
          ) : (
            choices.map((l) => (
              <SelectItem key={l.id} value={String(l.id)}>
                {l.first_name} {l.last_name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => setOpen(false)}
      >
        Cancel
      </Button>
    </div>
  );
};

import { ShowBase, useRecordContext } from "ra-core";
import { DeleteButton } from "@/components/admin/delete-button";
import { EditButton } from "@/components/admin/edit-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import type { Lifeguard } from "../types";

export const LifeguardShow = () => (
  <ShowBase>
    <LifeguardShowContent />
  </ShowBase>
);

const LifeguardShowContent = () => {
  const record = useRecordContext<Lifeguard>();
  if (!record) return null;

  return (
    <div className="mt-2">
      <Card>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold">
                {record.first_name} {record.last_name}
              </h2>
              <div className="mt-1">
                {record.active ? (
                  <Badge
                    variant="outline"
                    className="border-green-300 dark:border-green-700"
                  >
                    Active
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-zinc-300 dark:border-zinc-700"
                  >
                    Inactive
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <EditButton />
              <DeleteButton />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Email" value={record.email} />
            <Field label="Phone" value={record.phone} />
            <Field
              label="Hourly rate"
              value={
                record.hourly_rate_cents
                  ? `$${(record.hourly_rate_cents / 100).toFixed(2)}/hr`
                  : null
              }
            />
            <div>
              <div className="text-xs text-muted-foreground tracking-wide mb-1">
                Regions
              </div>
              {record.regions?.length ? (
                <div className="flex flex-row gap-1 flex-wrap">
                  {record.regions.map((r) => (
                    <Badge key={r} variant="outline">
                      {r}
                    </Badge>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">—</span>
              )}
            </div>
          </div>

          <div>
            <div className="text-xs text-muted-foreground tracking-wide mb-2">
              Certifications
            </div>
            {record.certifications?.length ? (
              <ul className="text-sm space-y-1">
                {record.certifications.map((c, i) => (
                  <li key={i}>
                    <span className="font-medium">{c.type}</span>
                    {c.expires ? (
                      <span className="text-muted-foreground">
                        {" "}
                        — expires {c.expires}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-sm text-muted-foreground">None on file</span>
            )}
          </div>

          {record.notes && (
            <div>
              <div className="text-xs text-muted-foreground tracking-wide mb-1">
                Notes
              </div>
              <p className="text-sm whitespace-pre-line">{record.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const Field = ({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) => (
  <div>
    <div className="text-xs text-muted-foreground tracking-wide mb-1">
      {label}
    </div>
    <div className="text-sm">{value || "—"}</div>
  </div>
);

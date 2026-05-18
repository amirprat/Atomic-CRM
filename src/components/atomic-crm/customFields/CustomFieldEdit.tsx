import { EditBase, Form } from "ra-core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { FormToolbar } from "../layout/FormToolbar";
import { CustomFieldInputs } from "./CustomFieldInputs";

export const CustomFieldEdit = () => (
  <EditBase redirect="list">
    <div className="max-w-2xl mx-auto mt-4">
      <Card>
        <CardHeader>
          <CardTitle>Edit custom field</CardTitle>
        </CardHeader>
        <CardContent>
          <Form>
            <CustomFieldInputs />
            <FormToolbar />
          </Form>
        </CardContent>
      </Card>
    </div>
  </EditBase>
);

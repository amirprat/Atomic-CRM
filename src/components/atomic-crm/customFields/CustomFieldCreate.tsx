import { CreateBase, Form } from "ra-core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { FormToolbar } from "../layout/FormToolbar";
import { CustomFieldInputs } from "./CustomFieldInputs";

export const CustomFieldCreate = () => (
  <CreateBase
    resource="custom_field_definitions"
    redirect="list"
  >
    <div className="max-w-2xl mx-auto mt-4">
      <Card>
        <CardHeader>
          <CardTitle>New custom field</CardTitle>
        </CardHeader>
        <CardContent>
          <Form
            defaultValues={{
              entity_type: "contact",
              field_type: "text",
              active: true,
              display_order: 0,
              options: {},
            }}
          >
            <CustomFieldInputs />
            <FormToolbar />
          </Form>
        </CardContent>
      </Card>
    </div>
  </CreateBase>
);

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

const formSchema = z.object({
  query: z.string().min(0).max(200),
});

export default function SearchBar({
  orgId,
  query,
  setQuery,
}: {
  orgId: string;
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: query,
    },
  });

  const fileRef = form.register("query");

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!orgId) {
      return;
    }

    setQuery(values.query);
    
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
          <FormField
            control={form.control}
            name="query"
            render={({}) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Search..."
                    {...fileRef}
                    
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="flex"
            size="sm"
          >
            Search
          </Button>
        </form>
      </Form>
    </div>
  );
}

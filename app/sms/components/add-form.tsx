"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { addSubmit, getBots } from "./api";
import { Checkbox } from "@/components/ui/checkbox";

const getDefaultSchema = () => {
  return z.object({
    name: z
      .string({
        required_error: "please input bot name",
      })
      .min(3, {
        message: "please input bot name",
      }),
    bots: z.array(z.number()).refine((value) => value.some((item) => item), {
      message: "You have to select at least one bot.",
    }),
  });
};

const formSchema = getDefaultSchema();

interface Props {
  onSuccess?: () => void;
}

export default function AddForm(props: Props) {
  const { onSuccess } = props;
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [bots, setBots] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      bots: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addSubmit(values)
      .then(() => {
        setOpen(false);
        onSuccess && onSuccess()
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err?.message || "Failed",
          variant: "destructive",
        });
      });
  }
  useEffect(() => {
    getBots().then((res) => {
      setBots(res);
    });
  }, []);

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset();
        setOpen(state);
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          ADD
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New SMS</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SMS Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Input a sms name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bots"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Bots</FormLabel>
                  </div>
                  {bots.map((bot) => (
                    <FormField
                      key={bot.id}
                      control={form.control}
                      name="bots"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={bot.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(bot.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, bot.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== bot.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {bot.name}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

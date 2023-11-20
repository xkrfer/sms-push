/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getChannelName,
  getValidChannelTypes,
} from "@/lib/channel/type";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ChannelBox } from "@/lib/channel/Box";
import { getBotById, updateSubmit } from "./api";
import { useToast } from "@/components/ui/use-toast";

interface Option {
  name: string;
  label: string;
  defaultValue: string;
  options?: {
    value: string;
    label: string;
  }[];
}

const getDefaultSchema = () => {
  return z.object({
    id: z.number(),
    type: z
      .string({
        required_error: "pelease select a channel type",
      })
      .min(1, {
        message: "please select a channel type",
      }),
    name: z
      .string({
        required_error: "please input bot name",
      })
      .min(3, "bot name must be at least 3 characters"),
    rule: z.string().optional(),
  });
};
let formSchema = getDefaultSchema();

export default function EditForm(props: {
  onSuccess?: () => void;
  id: number;
  type: string;
}) {
  const { onSuccess, id, type } = props;
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id,
      name: "",
      type,
      rule: "",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    // @ts-ignore
    const { id, type, name, token, rule, ...rest } = values;
    updateSubmit({
      id,
      name,
      type,
      token,
      body: rest,
      rule,
    })
      .then(() => {
        toast({
          title: "Success",
          description: "Bot update success",
          variant: "success",
        });
        setOpen(false);
        onSuccess?.();
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
    if (!open) return;
    getBotById(id).then((res) => {
      const box = new ChannelBox(res.type);
      formSchema = getDefaultSchema().merge(box.getSchema());
      setOptions(box.getOptions());
      form.setValue("name", res.name);
      form.setValue("type", res.type);
      form.setValue("id", res.id);
      form.setValue("rule", res.rule || '');
      box.getOptions().forEach((opt) => {
        if (opt.name === "token") {
          // @ts-ignore
          form.setValue(opt.name, res.token);
          return;
        }
        // @ts-ignore
        form.setValue(opt.name, res.body[opt.name]);
      });
    });
  }, [open]);

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset();
        setOptions([]);
        setOpen(state);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle> Edit Bot </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Channel Type</FormLabel>
                  <Select
                    onValueChange={(e) => {
                      let opts: Option[] = [];
                      const box = new ChannelBox(e);
                      opts = box.getOptions();
                      formSchema = getDefaultSchema().merge(box.getSchema());
                      setOptions(opts);
                      opts.forEach((opt) => {
                        // @ts-ignore
                        form.setValue(opt.name, opt.defaultValue);
                      });
                      field.onChange(e);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue
                          placeholder="Select a channel"
                          {...field}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {getValidChannelTypes().map((type) => (
                          <SelectItem key={type} value={String(type)}>
                            {getChannelName(type)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bot Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Input a bot name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rule</FormLabel>
                  <FormControl>
                    <Input placeholder="Input a rule like ^sth" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {options.map((option) => (
              <FormField
                key={option.name}
                control={form.control}
                // @ts-ignore
                name={option.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{option.label}</FormLabel>
                    {option.options ? (
                      <Select
                        onValueChange={(e) => {
                          field.onChange(e);
                        }}
                        defaultValue={field.value + ""}
                      >
                        <FormControl>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="select" {...field} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {option.options?.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    ) : (
                      <FormControl>
                        <Input placeholder={`please input`} {...field} />
                      </FormControl>
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

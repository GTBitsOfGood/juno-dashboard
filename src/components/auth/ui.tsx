import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const inputClass =
  "h-11 border-white/10 bg-white/5 text-base md:text-base text-white placeholder:text-white/25 focus-visible:ring-amber-400/30";

const StyledInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => (
  <Input ref={ref} className={cn(inputClass, className)} {...props} />
));
StyledInput.displayName = "StyledInput";

const StyledButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => (
    <Button
      ref={ref}
      className={cn(
        "h-11 bg-amber-400 font-semibold text-black hover:bg-amber-300",
        className,
      )}
      {...props}
    />
  ),
);
StyledButton.displayName = "StyledButton";

const triggerClass =
  "h-11 border-white/10 bg-white/5 text-base text-white placeholder:text-white/25 focus:ring-amber-400/30 data-[placeholder]:text-white/25";

const StyledSelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectTrigger>,
  React.ComponentPropsWithoutRef<typeof SelectTrigger>
>(({ className, ...props }, ref) => (
  <SelectTrigger ref={ref} className={cn(triggerClass, className)} {...props} />
));
StyledSelectTrigger.displayName = "StyledSelectTrigger";

const contentClass = "border-white/10 bg-neutral-900 text-white";

const StyledSelectContent = React.forwardRef<
  React.ElementRef<typeof SelectContent>,
  React.ComponentPropsWithoutRef<typeof SelectContent>
>(({ className, ...props }, ref) => (
  <SelectContent ref={ref} className={cn(contentClass, className)} {...props} />
));
StyledSelectContent.displayName = "StyledSelectContent";

const itemClass = "focus:bg-white/10 focus:text-white";

const StyledSelectItem = React.forwardRef<
  React.ElementRef<typeof SelectItem>,
  React.ComponentPropsWithoutRef<typeof SelectItem>
>(({ className, ...props }, ref) => (
  <SelectItem ref={ref} className={cn(itemClass, className)} {...props} />
));
StyledSelectItem.displayName = "StyledSelectItem";

export {
  StyledInput as Input,
  StyledButton as Button,
  StyledSelectTrigger as SelectTrigger,
  StyledSelectContent as SelectContent,
  StyledSelectItem as SelectItem,
  Select,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
};

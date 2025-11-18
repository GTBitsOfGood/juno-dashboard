import clsx from "clsx";
import { EyeIcon, EyeOff } from "lucide-react";
import { useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

interface PasswordBoxProps {
  className?: string;
  password: string;
  readOnly?: boolean;
  round?: boolean;
}

export const PasswordBox = ({
  className,
  password,
  readOnly,
  round,
}: PasswordBoxProps) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className={className}>
      <InputGroup className={clsx(round && "[--radius:0.75rem]")}>
        <InputGroupInput
          type={showPassword ? "text" : "password"}
          value={password}
          readOnly={readOnly}
        />
        <InputGroupAddon align="inline-end">
          {showPassword ? (
            <EyeIcon onClick={() => setShowPassword(!showPassword)}></EyeIcon>
          ) : (
            <EyeOff onClick={() => setShowPassword(!showPassword)} />
          )}
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
};

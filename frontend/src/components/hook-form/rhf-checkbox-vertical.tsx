import { Controller, useFormContext } from "react-hook-form";

import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormControlLabel, { formControlLabelClasses } from "@mui/material/FormControlLabel";
import { RHFCheckboxProps, RHFMultiCheckboxProps } from "./rhf-checkbox";

// ----------------------------------------------------------------------

export function RHFCheckboxVertical({ name, helperText, ...other }: RHFCheckboxProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <FormControlLabel control={<Checkbox {...field} checked={field.value} />} {...other} />

          {(!!error || helperText) && (
            <FormHelperText error={!!error}>{error ? error?.message : helperText}</FormHelperText>
          )}
        </div>
      )}
    />
  );
}

export function RHFMultiCheckboxVertical({
  row,
  name,
  label,
  options,
  spacing,
  helperText,
  sx,
  ...other
}: RHFMultiCheckboxProps) {
  const { control } = useFormContext();

  const getSelected = (selectedItems: string[], item: string) =>
    selectedItems.includes(item)
      ? selectedItems.filter((value) => value !== item)
      : [...selectedItems, item];

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl component="fieldset" sx={{ width: "100%" }}>
          {label && (
            <FormLabel component="legend" sx={{ typography: "body1" }}>
              {label}
            </FormLabel>
          )}

          <FormGroup
            sx={{
              marginTop: 1,
              paddingLeft: 0,
              ...(row && {
                flexDirection: "row",
              }),
              [`& .${formControlLabelClasses.root}`]: {
                "&:not(:last-of-type)": {
                  borderBottom: "1px dashed #e0e0e0",
                  mb: spacing || 0,
                },
                ...(row && {
                  mr: 0,
                  "&:not(:last-of-type)": {
                    borderBottom: "none",
                    mr: spacing || 2,
                  },
                }),
              },
              ...sx,
            }}
          >
            {options.map((option) => (
                <FormControlLabel
                  sx={{ width: "100%", margin: 0, padding: 1, paddingLeft: 2 }}
                  key={option.value}
                  control={
                    <Checkbox
                      checked={field.value?.includes(option.value)}
                      onChange={() => {
                        field.onChange(getSelected(field.value ?? [], option.value));
                      }}
                    />
                  }
                  label={<span style={{ fontSize: 14 }}>{option.label}</span>}
                  {...other}
                />
              ))}
          </FormGroup>

          {(!!error || helperText) && (
            <FormHelperText error={!!error} sx={{ mx: 3, mb: 1 }}>
              {error ? error?.message : helperText}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}

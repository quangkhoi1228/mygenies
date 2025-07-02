import { Controller, useFormContext } from "react-hook-form";

import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import { Props } from "./rhf-radio-group";

// ----------------------------------------------------------------------

export default function RHFRadioGroupVertical({
  row,
  name,
  label,
  options,
  spacing,
  helperText,
  ...other
}: Props) {
  const { control } = useFormContext();

  const labelledby = label ? `${name}-${label}` : "";

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl component="fieldset" sx={{ width: "100%" }}>
          {" "}
          {label && (
            <FormLabel component="legend" id={labelledby} sx={{ typography: "body2" }}>
              {label}
            </FormLabel>
          )}
          <RadioGroup
            sx={{ marginTop: 1 }}
            {...field}
            aria-labelledby={labelledby}
            row={row}
            {...other}
          >
            {options.map((option) => (
              <FormControlLabel
                key={name + option.value}
                value={option.value}
                control={<Radio />}
                label={
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="space-between"
                    alignItems="center"
                    display="flex"
                  >
                    <div style={{ fontSize: 14 }}>{option.label}</div>
                    {option.actions}
                  </Stack>
                }
                sx={{
                  display: "flex",
                  position: "relative",
                  width: "100%",
                  margin: 0,
                  padding: 1,
                  paddingLeft: 2,
                  paddingRight: 4,
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
                }}
              />
            ))}
          </RadioGroup>
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

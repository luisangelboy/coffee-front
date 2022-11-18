import { Checkbox, withStyles } from "@material-ui/core";

const checkBoxStylesCanceladas = (theme) => ({
  root: {
    color: "#FF8A8A",
    "& > .MuiIconButton-label": {
      backgroundColor: "#FFF4F4",
    },
    "&$checked": {
      color: "#FF8A8A",
    },
  },
  checked: {},
});

const checkBoxStylesNotas = (theme) => ({
  root: {
    color: "#FCCF53",
    "& > .MuiIconButton-label": {
      backgroundColor: "#FFFAEC",
    },
    "&$checked": {
      color: "#FCCF53",
    },
  },
  checked: {},
});

const checkBoxStylesVencidas = (theme) => ({
  root: {
    color: "#FFA367",
    "& > .MuiIconButton-label": {
      backgroundColor: "#FFEBDE",
    },
    "&$checked": {
      color: "#FFA367",
    },
  },
  checked: {},
});

export const CustomCheckboxCanceladas = withStyles(checkBoxStylesCanceladas)(
  Checkbox
);

export const CustomCheckboxNotas = withStyles(checkBoxStylesNotas)(Checkbox);

export const CustomCheckboxVencidas = withStyles(checkBoxStylesVencidas)(Checkbox);

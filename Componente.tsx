import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { User } from "../hooks/useUsers";

// 🧠 Validaciones con Yup
const schema = yup.object({
  first_name: yup
    .string()
    .required("El nombre es obligatorio")
    .min(2, "Debe tener al menos 2 caracteres"),
  last_name: yup
    .string()
    .required("El apellido es obligatorio")
    .min(2, "Debe tener al menos 2 caracteres"),
  email: yup
    .string()
    .email("Debe ser un correo válido")
    .required("El correo es obligatorio"),
  phone: yup
    .string()
    .nullable()
    .matches(/^[0-9]*$/, "Solo se permiten números")
    .max(15, "Máximo 15 dígitos"),
});

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (user: User) => void;
  editingUser?: User | null;
}

export const UserFormDialog: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  editingUser,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<User>({
    resolver: yupResolver(schema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
    },
  });

  // 🔁 Si hay usuario para editar, cargamos sus datos
  useEffect(() => {
    if (editingUser) reset(editingUser);
    else reset({ first_name: "", last_name: "", email: "", phone: "" });
  }, [editingUser, reset]);

  const submitForm = async (data: User) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {editingUser ? "Editar Usuario" : "Agregar Usuario"}
      </DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit(submitForm)}>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Nombre"
              {...register("first_name")}
              error={!!errors.first_name}
              helperText={errors.first_name?.message}
              fullWidth
            />
            <TextField
              label="Apellido"
              {...register("last_name")}
              error={!!errors.last_name}
              helperText={errors.last_name?.message}
              fullWidth
            />
            <TextField
              label="Correo electrónico"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
            />
            <TextField
              label="Teléfono"
              {...register("phone")}
              error={!!errors.phone}
              helperText={errors.phone?.message}
              fullWidth
            />
          </Stack>

          <DialogActions sx={{ mt: 2 }}>
            <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
            >
              {editingUser ? "Guardar cambios" : "Crear"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};
